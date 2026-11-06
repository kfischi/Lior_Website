# Site health log

One line per run of the `site-health` routine (`npm run qa:health`): date, pages checked, failures before and
after, what changed. Newest at the bottom.

| Date | Pages | Failures before | Failures after | Notes |
|---|---|---|---|---|
| 2026-10-30 | 15 | 0 (1 warning) | 0 | First run. Flagship audit (design, SEO+GEO, QA) fixed: FAQ answers in HTML, Person schema, hero CTA, legal header band, ReDoS in the e-mail redaction regex plus request size limits, chat Esc/focus/dialog role, security headers, phone validation, off-topic 'tomorrow' false alarm. |
