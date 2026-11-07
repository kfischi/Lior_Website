# Landing pages by situation (/help/[slug])

Four pages, written as general information (no advice on a specific case, no outcome promises, no deadlines or response-time claims):

| Page | Slug | Area |
| --- | --- | --- |
| הוזמנתם לחקירה במשטרה? | `/help/police-investigation` | criminal-law |
| הוזמנתם לשימוע לפני פיטורים? | `/help/dismissal-hearing` | torts |
| מרגישים שמתעמרים בכם בעבודה? | `/help/workplace-bullying` | torts |
| רוצים להסדיר צוואה או ייפוי כוח מתמשך? | `/help/will-and-power-of-attorney` | personal-status |

Each has the callback form above the fold, booking request below, three FAQ items (with FAQ structured data) and a link to the practice area. The visit source is attached to every inquiry automatically.

## Approval gate
Content lives in `brand.painPages` (`src/lib/brand.ts`), each with `approved: false`.
- Production build (`CONTEXT=production` on Netlify): unapproved pages are not built (404), not in `sitemap.xml`, not in `llms.txt`.
- Local runs and Netlify deploy previews: the pages show, marked "טיוטה", with `noindex`, so the attorney can read them as visitors do.
- After she approves a page: set `approved: true` for that page, merge. It then publishes, is indexed and appears in the sitemap.

## Facts for the attorney to confirm before approving
- Police page: the witness/suspect distinction, the right to consult counsel and to remain silent, "do not sign what you did not understand".
- Dismissal page: that the invitation normally lists the claims, that a companion is normally allowed, and the advice not to sign resignation or settlement before understanding it.
- Bullying page: the plain-language description of the conduct, and the documentation advice.
- Will / lasting power of attorney page: the statement that a lasting power of attorney is made in a formal procedure that includes a lawyer, and that form errors can affect validity.
- The line "ייעוץ בזום בכל הארץ" on every page.

## Status (2026-11-07)
All four pages approved by the owner and set to `approved: true`. They are built in production, indexable, in `sitemap.xml` and `llms.txt`, and linked from their practice-area page under "מצבים נפוצים". `brand.seo.lastModified` bumped.
