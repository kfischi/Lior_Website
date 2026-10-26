---
name: organic-seo
description: Weekly organic-SEO routine for the Liorerez law-firm site (Hebrew, Next.js). Audits the technical and on-page SEO of this repo, fixes safe issues, drafts new content for attorney approval, and reports what only the owner can do. Use when asked to improve, audit or grow the site's organic search, or when run on the weekly schedule.
---

# Organic SEO for the firm site

Goal: grow organic traffic and qualified inquiries for the firm over time, with
small, safe, reviewable changes. This is a routine, not a one-off.

## Honest limits (never overstate these)

- Nobody can guarantee rankings. Do not promise positions, traffic or leads.
- This environment cannot reach the live site or Google. You audit the code and
  a local build. Real ranking data needs Search Console, which the owner must
  connect. Say so in the report instead of guessing numbers.
- You cannot do off-site work (Google Business Profile, directories, links,
  reviews). List it for the owner.

## Where SEO lives in this repo

- `src/lib/seo.ts`: metadata builder and JSON-LD (LegalService, Attorney, FAQPage, Breadcrumb)
- `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/legal/*`: per-page metadata
- `src/app/sitemap.ts`, `src/app/robots.ts`, `src/app/llms.txt/route.ts`
- `src/lib/brand.ts`: every fact about the firm, the FAQ, practice areas
- `src/lib/knowledge.ts`: what the chatbot says (keep consistent with the site)
- `docs/seo/backlog.md`: the standing backlog. Read it first, update it last.
- `docs/seo/reports/`: one report per run
- `content/seo/drafts/`: article drafts awaiting the attorney's approval

## Weekly routine

1. **Read** `docs/seo/backlog.md` and the latest report in `docs/seo/reports/`.
2. **Baseline.** `npm ci`, then `npm run typecheck`, `npm run lint`, `npm run build`.
   A failing build is the top finding. Note route sizes from the build output.
3. **Audit a running build** (`npx next start -p 3111`, fetch with curl). For every
   public page check:
   - one `<h1>`, sensible heading order, `lang="he" dir="rtl"`
   - `<title>` about 50-60 chars, meta description about 120-160 chars, both unique
   - canonical, Open Graph, Twitter tags, robots
   - JSON-LD parses and matches the visible page (name, phone, address, FAQ text)
   - every image has meaningful `alt`; links have descriptive text
   - the sitemap lists every indexable route; `robots.txt` and `llms.txt` are correct
   - internal links between related pages; no orphan pages
   - performance signals: image sizes, fonts, blocking scripts, client JS weight
   - optional: Lighthouse via Playwright's Chromium if installable
4. **Classify** each finding:
   - *Auto-fix*: technical, low risk, no new claims (metadata, alt text, schema,
     sitemap, internal links, performance). Fix these.
   - *Propose*: new pages or copy. Write drafts, do not publish.
   - *Owner*: anything needing facts, approval or access outside the repo.
5. **Grow content** from the backlog, one item per run, highest value first
   (see below). Pages go in `src/app/...` only when every claim comes from
   `brand.ts`. Articles go in `content/seo/drafts/` as Hebrew Markdown marked
   `status: draft` and are not linked from the site.
6. **Verify** typecheck, lint and build again. Do not leave the build broken.
7. **Report** to `docs/seo/reports/YYYY-MM-DD.md`: status, fixed, proposed,
   needs the owner, numbers measured, focus for next run. Update the backlog.
8. **Ship** on a new branch `seo/weekly-YYYY-MM-DD`, open a **draft** PR. Never
   merge, never push to the base branch.

## Content priorities

1. Dedicated pages per practice area: `/practice-areas/[slug]` with a unique H1,
   a useful 300-500 word explanation, a short FAQ (with FAQPage JSON-LD),
   breadcrumbs, and links to the contact section. The sitemap already expects them.
2. Informational Hebrew articles answering real questions in the three areas:
   workplace discrimination and bullying, sexual harassment, criminal law.
   General education only, never advice on a specific case.
3. A local page for the firm's area, only with service-area facts the owner confirmed.
4. Chatbot knowledge kept in step with new pages (`src/lib/knowledge.ts`).

Write for people first. Natural Hebrew, one clear topic per page, no keyword
stuffing, no near-duplicate pages across areas.

## Guardrails for a law-firm site

- Legal advertising in Israel is regulated by the Bar. Do not publish claims
  about results, success rates, being "the best", or comparisons to other firms.
- Never invent facts about the attorney: years of experience, cases, awards,
  credentials, hours, places served. If it is not in `brand.ts`, ask the owner.
- No fake or incentivised reviews, no invented testimonials or statistics.
- Every new public text needs the attorney's approval before it goes live.
  That is why articles stay drafts and PRs stay drafts.
- Sensitive topics (sexual harassment, criminal cases): calm, respectful tone,
  no graphic detail, point to speaking with the attorney, and to police (100)
  in immediate danger.
- No hidden text, doorway pages, bought links or scraped content.
- Never commit secrets or `.env*` files.
