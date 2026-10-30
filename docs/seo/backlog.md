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
- [ ] **Confirm with the attorney that publishing client reviews on her own site is allowed
      under the Bar's advertising rules**, and that she is comfortable with the reviewers'
      first names and cities being reused. Remove `brand.testimonials` if in doubt: the
      section hides itself when the list is empty.
- [ ] Approve the text of the three practice-area pages (stored in `src/lib/brand.ts`)
- [ ] Confirm the email address and "by appointment" as the availability
- [ ] Approve or reject article drafts in `content/seo/drafts/`

## Reviews on the site (updated 2026-10-27)

Source: screenshots of reviews on LawReviews, supplied by the owner. Nine are
published in `brand.testimonials`, word for word (spacing normalised), with the first
name or initial and city as shown at the source, the source's date, and the page
sorted newest first. One review carries the source's fractional rating (4.6) shown as is.
Rules used, so future additions stay consistent:

- Excluded: any claim of an outcome or a win, details of the client's case, health
  matters, the word "specialist" (a regulated title), and quotes with typos or an
  ellipsis from a truncated preview.
- Never add an aggregate rating, star total or Review/AggregateRating markup.
  Google treats self-published ratings as ineligible, and a rating total would be an
  unverified claim.

Seen in the screenshots but **not** published (add to `brand.testimonials` only if the
attorney approves each one under the Bar's advertising rules):

| Reviewer (as at source) | Date | Why held back |
| --- | --- | --- |
| סבטלנה, רחובות | 23.01.2024 | claims an outcome ("received all my rights") |
| אורית מרציאנו, באר שבע (two reviews) | 15.02.2024, 18.02.2024 | describes a client's child's medical case and an outcome |
| ל. | 15.01.2024 | claims an outcome ("got what I wanted"), health field |
| עמליה סגל, רחובות | 18.01.2024 | claims an outcome (dismissal cancelled) |
| פ. | 15.02.2024 | uses "מומחית" (regulated title), details of the case |
| דימיטרי, לוד | 21.01.2024 | claims an outcome (suspicions dismissed), case details |
| תהילה פרס, חריש | 21.01.2024 | typos at the source ("מחזירה פרט", "שרותים") |
| כ. | 18.02.2024 | truncated preview ("...") |
| רחל בהרל, מחניים | 21.01.2024 | claims an outcome, health and public-policy matters |
| חיים ק., גבעת זאב | 19.01.2024 | health matter, typos |

A scanned client letter ("ליאה", dated 3.4.2016) is shown among the reviews as an image
(`brand.testimonialLetters`), at the owner's request. The scan was cropped and cleaned up;
the text is not retyped, so it is not misquoted. Confirm that the writer agreed to its
publication, and replace the scan with a sharper one if she has the original.

## Done

- 2026-10-27: two more client video reviews added (five in total).
- 2026-10-27: reviews extended to nine, dated and sorted newest first (see section above).
- 2026-10-26: five vetted client reviews added to the home page.
- 2026-10-26: production URL fallback (no more localhost canonicals), home title
  and description, default social image, stable sitemap dates, sitemap and
  llms.txt list the practice pages, header anchors work on sub-pages, cleaned
  structured data, practice-area pages. See `reports/2026-10-26.md`.


## Owner-only items (cannot be done from code)

- [ ] Verify the site in Google Search Console and Bing Webmaster Tools (set `GOOGLE_SITE_VERIFICATION` / `BING_SITE_VERIFICATION`), then submit `/sitemap.xml`.
- [ ] Claim and complete the Google Business Profile (name, address, phone, hours, categories, photos) and keep NAP identical to the site.
- [ ] Attorney to review and approve every guide in `src/lib/articles.ts` and the answers in `brand.faq` (legal accuracy, Bar advertising rules).
- [ ] Provide the bar licence number and business ID for the footer (`brand.legal.licenseNumber`, `brand.legal.businessId`) and confirm the court area in `brand.legal.jurisdiction`.
- [ ] Earn real links: legal directories, local press, professional associations. Real client reviews on Google (no incentives).
- [ ] Teach the chatbot in `/admin` as new questions arrive.
