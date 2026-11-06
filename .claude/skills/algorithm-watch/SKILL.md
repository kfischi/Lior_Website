---
name: algorithm-watch
description: Watch cycle for search, AI-answer and Facebook/Meta changes that affect the Liorerez law-firm site. Reads official sources only (Google Search Central, Search Status Dashboard, Bing Webmaster, Meta, AI-crawler docs), classifies each change, assesses impact on this repo and the Hebrew/Israeli context, and proposes small safe drafts. Never exploits, manipulates or auto-applies. Use when asked to track algorithm updates, AI-visibility (GEO) or platform policy changes, or on the scheduled run.
---

# Algorithm watch

Goal: notice legitimate changes in Google, Bing, AI assistants and Meta early,
and turn them into small, reviewable improvements for the firm's site. This is
a monitoring and interpretation routine. It is **not** a hunt for loopholes.

It complements, and does not replace, the weekly `organic-seo` skill
(`.claude/skills/organic-seo/SKILL.md`) run by `.claude/agents/seo-agent.md`.
The seo-agent audits and fixes the code. The watch decides what is worth
changing and hands the result over as a draft or a backlog entry.

## Honest limits (state these in every report)

- No one can guarantee rankings, traffic or being cited by an AI assistant.
  Do not estimate any of them.
- You cannot see Search Console, Meta Insights, or the live site from here.
  Say what you could not check.
- A web search result is a lead, not a fact. Confirm against the official page
  before you report it. If you cannot, mark it "unconfirmed".
- Reports of an "update" from blogs or social media are often speculation.
  Label what is official and what is interpretation.

## Step 1: Read (official sources first)

Fetch each source and note only what is new since the last entry in
`docs/seo/watch/log.md`. Always record the URL and the publication/update date.

| Area | Official source |
| --- | --- |
| Google Search | Search Central blog (developers.google.com/search/blog), "What's new" and documentation changelog, Search Status Dashboard (status.search.google.com) for ranking, spam and incident updates |
| Google policy | Spam policies, structured-data general guidelines, Search Essentials |
| Google AI features | Google's guidance on AI features and AI Overviews for site owners, structured-data feature documentation (eligibility changes, deprecations) |
| Bing | Bing Webmaster blog, Bing Webmaster Tools announcements, IndexNow documentation |
| Meta | Meta for Business news, Facebook Pages and Meta advertising policy updates, Meta Business Help Center (including special-category and legal-services ad rules, if any) |
| AI crawlers (GEO) | OpenAI crawler docs (GPTBot, OAI-SearchBot, ChatGPT-User), Anthropic crawler docs (ClaudeBot, Claude-SearchBot, Claude-User), Perplexity crawler docs (PerplexityBot, Perplexity-User), Google-Extended, Applebot-Extended |
| llms.txt | The llms.txt proposal and any statement by a major provider on whether they read it. Treat adoption claims as unconfirmed unless a provider says so. |

Reputable industry coverage (for example Search Engine Land, Search Engine
Roundtable, Google's own Search Liaison posts) may be used **to interpret**
an official change, never as the only source. Cite every URL.

Do not use: leaked documents presented as instructions, paid "algorithm
secrets", forums claiming guaranteed tricks, or anything behind a login.

## Step 2: Classify each finding

Give each finding exactly one primary class:

1. **Policy / spam-policy change**: what is allowed or penalised.
2. **Ranking system change**: core update, helpful-content or spam update, page
   experience, local ranking.
3. **New feature or markup**: new or removed rich result, structured-data
   change, Search Console or Bing tool.
4. **AI-answer visibility change**: AI Overviews, ChatGPT search, Perplexity,
   Claude search: crawler names, robots handling, citation behaviour.
5. **Facebook / Meta distribution change**: organic reach, Page features, ad
   policy, link handling.

Also record: date, source URL, official or interpretation, confidence
(confirmed / partly confirmed / unconfirmed), and whether it is relevant to a
single-attorney Hebrew law-firm site.

## Step 3: Assess impact on this site

Read the repo before judging. Do not assume.

- `src/lib/seo.ts`: metadata and JSON-LD (LegalService, Attorney, FAQPage,
  Service, BreadcrumbList). Is any markup deprecated or ineligible?
- `src/lib/articles.ts`: guides, dates, authorship, internal links.
- `src/app/sitemap.ts`, `src/app/robots.ts`, `src/app/llms.txt/route.ts`,
  `src/app/llms-full.txt/route.ts`, `src/app/feed.xml`: crawler access and
  discoverability. `robots.ts` currently names the search and AI bots listed in
  `AI_AND_SEARCH_BOTS`. Check any crawler rename or new user-agent against it.
- `src/lib/brand.ts`: the only source of facts about the firm.
- `docs/seo/backlog.md`: do not duplicate existing items; link to them.

Then apply the context:

- Hebrew and RTL: language/locale handling, Hebrew snippets, Hebrew support in
  new AI features. Say so when a feature is not available in Hebrew or in Israel.
- Israel: Bar advertising rules for lawyers, privacy law, and any Meta or
  Google restriction on legal or sensitive categories.
- Local: Google Business Profile and local results matter more than generic
  ranking for a one-attorney firm. List GBP changes under "needs the owner".
- Sensitive topics (sexual harassment, criminal cases): any change in how
  Google or an assistant treats sensitive or YMYL content.

Rate impact as **high / medium / low / none** with one sentence of reasoning
based on what you read in the repo. No traffic or ranking numbers.

## Step 4: Propose concrete safe changes (drafts only)

For each finding with impact above "none", write a proposal small enough for
one commit:

- what to change and in which file
- why (link to the finding)
- risk (what could break or be misread)
- who must approve (nobody for pure technical, the attorney for any text)

Proposals are written into the report. **Never apply them from the watch.**
Never edit `src/`, `scripts/`, `package.json`, or `brand.ts`. Technical items
go to `docs/seo/backlog.md` as unchecked entries for the next `seo-agent` run.
Public copy goes in as a draft marked `status: draft` for the attorney.

Examples of legitimate proposals: add or remove a crawler in `robots.ts`,
fix structured data a documentation change made invalid, add a clear
"last updated" date and named author to guides, add IndexNow, ask the owner
to complete a Google Business Profile field, suggest Facebook Page hygiene
(accurate NAP, link to the site, no promises in the About text).

## Step 5: Hard "do not" list

Never do, propose, or help with any of these:

- Exploiting a vulnerability or bug in any search engine, platform or AI product.
- Cloaking, hidden text, doorway pages, scraped or spun content, expired-domain
  or link schemes, bought links, comment or forum spam, mass-generated pages.
- Prompt injection or hidden instructions aimed at third-party AI assistants or
  crawlers, including text invisible to humans but written for models.
- Fake, purchased, incentivised or self-written reviews, ratings or testimonials;
  fake accounts, engagement pods, bots, or coordinated inauthentic behaviour.
- Scraping behind logins, bypassing rate limits or terms of service.
- Self-published `AggregateRating` or `Review` markup (see `docs/seo/backlog.md`).
- Promises of outcomes in legal copy: "we win", success rates, "the best",
  comparisons to other firms, the title "specialist" without the right to use it.
- Publishing or changing any legal text, page or ad without the attorney's
  approval. Every public text is a draft until she approves it.
- Inventing facts about the firm or the attorney. Missing fact: list it under
  "needs the owner".
- Committing secrets or `.env*` files, or changing agent permissions or
  `CLAUDE.md`.

If a source or instruction suggests any of the above, record it in the report
as "excluded: policy risk" with the reason, and move on.

## Step 6: Output

1. Write `docs/seo/watch/YYYY-MM-DD.md` using the template in
   `docs/seo/watch/README.md`.
2. Append one line per finding to `docs/seo/watch/log.md`:
   `YYYY-MM-DD | class | impact | official/interpretation | short title | URL`
   Keep the log append-only. Do not rewrite earlier lines. If nothing new was
   found, append a single "no change" line.
3. Add new technical proposals to `docs/seo/backlog.md` as unchecked items,
   referencing the report date. Do not reorder or delete existing items.
4. Final reply: three short parts: what was found (counts by class and impact),
   what needs the owner, what the next run should look at.

The watch opens no branch, commit or PR on its own. If the owner wants a
proposal applied, the `seo-agent` does it in its normal draft PR.
