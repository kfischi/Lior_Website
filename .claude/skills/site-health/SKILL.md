---
name: site-health
description: Self-checking routine for the Liorerez law-firm site. Builds the site, runs the browser health check (every page, links, chat, mobile overflow, JSON-LD, forbidden text), triages what failed, fixes safe bugs, re-runs until green, and opens a draft PR. Use when asked to check the site, find or fix bugs, make sure everything works, or on the daily schedule.
---

# Site health: check, fix, verify

Goal: the site keeps working. Every run finds what broke, fixes what is safe to
fix, proves the fix, and tells the owner what is left. It is a routine, not a one-off.

## Honest limits

- This environment cannot reach the live site, Cloudinary, Google or Netlify. You test a local
  production build. Say so; do not claim the live site is healthy.
- Chromium here has no H.264 and the hero video lives on Cloudinary: ignore those, but make sure the
  poster/fallback still renders.
- A green run means "nothing this script looks for is broken", not "no bugs exist". Do not overstate it.

## Steps

1. Read `CLAUDE.md` (the engineering rules are the acceptance criteria) and the last entry of
   `docs/qa/health-log.md`.
2. Base: the repo's working branch (`claude/law-firm-template-hhn1hg` until it is merged, then `main`).
   Create `qa/health-YYYY-MM-DD` from it.
3. Gates, in order. Stop and fix at the first red one:
   - `npm run typecheck`
   - `npm run lint`
   - `npm run build`
4. Start the build: `npm start -- -p 3600 &` (record the PID; kill it by PID at the end, never `pkill -f`).
5. Run `npm run qa:health -- --base http://localhost:3600 --json /tmp/health.json`.
   If Playwright is missing, use the one that is preinstalled (`require('playwright')`) or set
   `PLAYWRIGHT_CHROMIUM=/opt/pw-browsers/chromium`.
6. Triage every FAIL into one of:
   - **Safe to fix now**: code defects (overflow, missing canonical, duplicate h1, broken internal link, console
     error from our code, a stale word, unhandled error state, a missing label). Fix at the root cause, not by
     loosening the check.
   - **Needs the owner**: anything about legal wording, prices, results claims, reviews, photos, the
     attorney's facts, external accounts, env vars, domain, Search Console.
   - **Environment only**: a failure caused by this sandbox (blocked host). Note it, do not "fix" it.
7. After each fix, re-run the gates and the health check. Repeat until the safe items are green.
8. Also run `npm run test:privacy` and `npm run test:document` when you touched `src/lib/privacy` or the document reader.
9. Add one line to `docs/qa/health-log.md`: date, pages checked, failures before, failures after, what changed.
10. Commit in small steps, push the branch, open a **draft** PR. If nothing needed changing, open no PR and just
    add the log line (commit it to the branch only if something else changed).

## Hard rules

- Never merge, never push to the base branch.
- Never weaken, skip or delete a check to get green. If a check is wrong, say why in the PR and fix the check
  with a test that shows the false alarm.
- Never invent facts about the firm, add result claims, reviews, statistics or legal advice.
- Never change prices, legal pages' meaning, or the attorney's wording without approval.
- Never commit secrets or `.env*`.
- Keep the white-label rule: nothing client-specific hard-coded in components; it lives in `src/lib/brand.ts`.
- Hebrew first, RTL, logical properties (`start`/`end`), WCAG 2.1 AA.

## Report (Hebrew, short)

PR link first. Then: what was checked, what failed, what was fixed, what remains (with severity), what only
the owner can do, and what could not be checked and why.
