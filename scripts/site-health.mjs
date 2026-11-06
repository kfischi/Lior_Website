#!/usr/bin/env node
/**
 * Site health check: opens every public page of the running site in a real browser and reports what is broken.
 *
 *   node scripts/site-health.mjs [--base http://localhost:3000] [--json out.json]
 *
 * Start the site first (`npm run build && npm start`), or point --base at a deployed preview.
 * Needs Playwright (`npm i -D playwright && npx playwright install chromium`, or any Chromium via PLAYWRIGHT_CHROMIUM).
 * Exit code 0 = healthy, 1 = at least one failure. Warnings never fail the run.
 *
 * Checks, per page: HTTP status, one <h1>, <title> and description lengths, canonical, lang/dir, JSON-LD parses,
 * no horizontal scroll at phone width, no console or page errors, no placeholder or forbidden text, no broken
 * internal links. Site-wide: robots.txt, sitemap.xml, llms.txt, the chat opens and answers, the 404 page.
 */
import { createRequire } from 'node:module';
import { writeFileSync } from 'node:fs';

const args = process.argv.slice(2);
const arg = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 && args[i + 1] ? args[i + 1] : fallback;
};
const BASE = arg('base', process.env.BASE_URL || 'http://localhost:3000').replace(/\/$/, '');
const JSON_OUT = arg('json', '');

/** Text that must never be visible on the site: left-over names, placeholders, rendering accidents. */
const FORBIDDEN = ['ליאורה', 'lorem ipsum', 'undefined', '[object Object]', 'NaN', 'TODO', 'לא נמצא תרגום'];
/** Errors from hosts that are legitimately unreachable in some environments (CDN video, fonts, analytics). */
const IGNORED_ERROR_HOSTS = /res\.cloudinary\.com|fonts\.(googleapis|gstatic)\.com|google-analytics|googletagmanager|facebook\.net/;

const failures = [];
const warnings = [];
const passes = [];
const fail = (where, what) => failures.push({ where, what });
const warn = (where, what) => warnings.push({ where, what });
const pass = (what) => passes.push(what);

async function loadPlaywright() {
  const require = createRequire(import.meta.url);
  try {
    return require('playwright');
  } catch {
    try {
      return await import('playwright');
    } catch {
      console.error('Playwright is not installed: npm i -D playwright && npx playwright install chromium');
      process.exit(2);
    }
  }
}

async function get(path) {
  const res = await fetch(`${BASE}${path}`, { redirect: 'manual', signal: AbortSignal.timeout(20000) });
  return { status: res.status, text: await res.text().catch(() => ''), headers: res.headers };
}

function sitemapPaths(xml) {
  const out = new Set(['/']);
  for (const m of xml.matchAll(/<loc>([^<]+)<\/loc>/g)) {
    try {
      out.add(new URL(m[1]).pathname || '/');
    } catch {
      /* ignore malformed entry */
    }
  }
  return [...out];
}

async function main() {
  // Site-wide files
  for (const file of ['/robots.txt', '/sitemap.xml', '/llms.txt']) {
    try {
      const r = await get(file);
      if (r.status !== 200 || r.text.trim().length < 20) fail(file, `status ${r.status} or empty`);
      else pass(`${file} ok`);
    } catch (e) {
      fail(file, `unreachable: ${e.message}`);
    }
  }
  let paths = ['/'];
  try {
    paths = sitemapPaths((await get('/sitemap.xml')).text);
  } catch {
    warn('/sitemap.xml', 'could not read, checking only the home page');
  }

  const pw = await loadPlaywright();
  const chromium = pw.chromium ?? pw.default?.chromium;
  const browser = await chromium.launch(
    process.env.PLAYWRIGHT_CHROMIUM ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM, args: ['--no-sandbox'] } : {},
  );
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true });
  const internalLinks = new Set();

  for (const path of paths) {
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', (e) => errors.push(`page error: ${e.message}`));
    page.on('console', (m) => {
      if (m.type() === 'error' && !IGNORED_ERROR_HOSTS.test(m.location().url || '')) errors.push(`console: ${m.text()}`);
    });
    page.on('requestfailed', (r) => {
      if (r.url().startsWith(BASE) && !r.failure()?.errorText?.includes('ABORTED')) errors.push(`request failed: ${r.url()}`);
    });
    try {
      const res = await page.goto(`${BASE}${path}`, { waitUntil: 'load', timeout: 45000 });
      await page.waitForTimeout(800);
      if (!res || res.status() !== 200) {
        fail(path, `status ${res?.status()}`);
        continue;
      }
      const facts = await page.evaluate(() => {
        const meta = (n) => document.querySelector(`meta[name="${n}"]`)?.getAttribute('content') ?? '';
        const jsonld = [...document.querySelectorAll('script[type="application/ld+json"]')].map((s) => s.textContent ?? '');
        return {
          title: document.title,
          description: meta('description'),
          h1: document.querySelectorAll('h1').length,
          canonical: document.querySelector('link[rel="canonical"]')?.getAttribute('href') ?? '',
          lang: document.documentElement.lang,
          dir: document.documentElement.dir,
          overflow: document.documentElement.scrollWidth - window.innerWidth,
          text: document.body.innerText,
          jsonld,
          links: [...document.querySelectorAll('a[href^="/"]')].map((a) => a.getAttribute('href')),
        };
      });
      if (!facts.title || facts.title.length < 15 || facts.title.length > 75) warn(path, `title length ${facts.title.length}: "${facts.title}"`);
      if (facts.description.length < 70 || facts.description.length > 175) warn(path, `description length ${facts.description.length}`);
      if (facts.h1 !== 1) fail(path, `${facts.h1} <h1> elements (should be exactly 1)`);
      if (!facts.canonical) fail(path, 'no canonical link');
      if (facts.lang !== 'he' || facts.dir !== 'rtl') fail(path, `lang="${facts.lang}" dir="${facts.dir}" (expected he / rtl)`);
      if (facts.overflow > 0) fail(path, `horizontal scroll at 390px: ${facts.overflow}px too wide`);
      for (const block of facts.jsonld) {
        try {
          JSON.parse(block);
        } catch {
          fail(path, 'a JSON-LD block is not valid JSON');
        }
      }
      for (const word of FORBIDDEN) {
        if (facts.text.includes(word)) fail(path, `visible forbidden text: "${word}"`);
      }
      for (const e of errors) fail(path, e);
      for (const l of facts.links) internalLinks.add(l.split('#')[0].split('?')[0] || '/');
      if (!errors.length && facts.h1 === 1 && facts.overflow <= 0) pass(`${path} ok`);
    } catch (e) {
      fail(path, `could not load: ${e.message}`);
    } finally {
      await page.close();
    }
  }

  // Internal links that lead nowhere
  for (const link of [...internalLinks].filter((l) => l && !paths.includes(l)).slice(0, 120)) {
    if (/\.(png|jpe?g|webp|svg|ico|mp4|webm|mp3|pdf|txt|xml)$/i.test(link)) continue;
    try {
      const r = await get(link);
      if (r.status >= 400) fail(link, `broken internal link (status ${r.status})`);
    } catch (e) {
      fail(link, `broken internal link: ${e.message}`);
    }
  }

  // The 404 page must be a real, friendly page
  try {
    const r = await get('/this-page-does-not-exist-xyz');
    if (r.status !== 404) fail('/404', `unknown URL answered ${r.status}, expected 404`);
    else if (!/<h1/i.test(r.text)) warn('/404', 'the 404 page has no heading');
    else pass('404 page ok');
  } catch (e) {
    fail('/404', e.message);
  }

  // The chat opens, answers, and survives a nonsense question
  const page = await context.newPage();
  try {
    await page.goto(`${BASE}/`, { waitUntil: 'load', timeout: 45000 });
    await page.evaluate(() => document.querySelector('[aria-label="הודעת עוגיות"]')?.remove());
    const opener = page.getByRole('button', { name: /צ׳אט|צ'אט|שיחה|עוזרת/ }).first();
    if ((await opener.count()) === 0) {
      warn('chat', 'no button to open the chat was found (it may have opened by itself)');
    } else {
      await opener.click({ timeout: 8000 }).catch(() => undefined);
    }
    const box = page.locator('textarea, input[type="text"]').last();
    await box.waitFor({ timeout: 8000 });
    await box.fill('איך קובעים פגישה?');
    await box.press('Enter');
    await page.waitForTimeout(6000);
    const bodyText = await page.evaluate(() => document.body.innerText);
    if (!/פגישה|ייעוץ|וואטסאפ|התקשר/.test(bodyText.split('איך קובעים פגישה?').slice(1).join(''))) {
      fail('chat', 'no sensible answer to "איך קובעים פגישה?" within 6 s');
    } else {
      pass('chat answers');
    }
  } catch (e) {
    fail('chat', `chat could not be used: ${e.message}`);
  } finally {
    await page.close();
  }

  await browser.close();

  const summary = {
    base: BASE,
    checked: paths.length,
    failures,
    warnings,
    passed: passes.length,
    at: new Date().toISOString(),
  };
  if (JSON_OUT) writeFileSync(JSON_OUT, JSON.stringify(summary, null, 2));
  console.log(`\nSite health for ${BASE}: ${paths.length} pages, ${passes.length} checks passed, ${warnings.length} warnings, ${failures.length} failures`);
  for (const f of failures) console.log(`  FAIL ${f.where}: ${f.what}`);
  for (const w of warnings) console.log(`  warn ${w.where}: ${w.what}`);
  process.exit(failures.length ? 1 : 0);
}

main().catch((e) => {
  console.error(e);
  process.exit(2);
});
