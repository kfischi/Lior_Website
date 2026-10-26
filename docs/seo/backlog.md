# SEO backlog

Maintained by the `seo-agent`. Newest decisions at the top of each section.
Rankings and search volume are **not measured here**; every keyword below is a
hypothesis to validate in Google Search Console once it is connected.

## Status

- Site: Next.js, Hebrew. Home, three practice-area pages, three legal pages.
- Structured data: LegalService, Attorney on all pages; FAQPage on home and
  practice pages; Service and BreadcrumbList on practice pages.
- Not yet built: articles, local page. Not yet measured: Lighthouse / CWV.

## Content to build (highest value first)

1. ~~Practice-area pages (3)~~ built 2026-10-26, awaiting the attorney's approval
2. Article drafts (Hebrew, need attorney approval):
   - מהי התעמרות בעבודה ומה אפשר לעשות
   - אפליה בעבודה: איך מתעדים ולמה זה חשוב
   - הטרדה מינית במקום העבודה: מה האפשרויות
   - הוזמנתי לחקירה במשטרה: מה חשוב לדעת
3. Local page for the firm's area (only with facts the owner confirms).

## Keyword hypotheses (unvalidated)

- עורכת דין לדיני עבודה, התעמרות בעבודה, אפליה בעבודה
- עורכת דין הטרדה מינית, הטרדה מינית בעבודה
- עורכת דין פלילי, זימון לחקירה, חקירה במשטרה
- Location modifiers: חריש (confirm service area with the owner)

## Needs the owner (outside the repo)

- [ ] Verify the site in Google Search Console and Bing Webmaster Tools, submit `/sitemap.xml`
- [ ] Create and complete the Google Business Profile (address in Harish, phone, categories)
- [ ] Confirm `SITE_URL=https://www.liorerezadv.com` is set in the hosting environment
- [ ] Provide verified facts for the About page: experience, education, areas served, hours
- [ ] Real client reviews, only where the Bar rules and the client allow
- [ ] Approve the text of the three practice-area pages (stored in `src/lib/brand.ts`)
- [ ] Confirm the email address and "by appointment" as the availability
- [ ] Approve or reject article drafts in `content/seo/drafts/`

## Done

- 2026-10-26: production URL fallback (no more localhost canonicals), home title
  and description, default social image, stable sitemap dates, sitemap and
  llms.txt list the practice pages, header anchors work on sub-pages, cleaned
  structured data, practice-area pages. See `reports/2026-10-26.md`.
