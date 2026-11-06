# Algorithm watch

A monitoring routine that tracks official changes in Google, Bing, AI
assistants and Meta, and turns them into small, reviewable proposals for the
site. It sits next to the weekly SEO routine and does not replace it.

- Skill: `.claude/skills/algorithm-watch/SKILL.md`
- Agent: `.claude/agents/algorithm-watch.md`
- Applies changes: `.claude/agents/seo-agent.md` (see `docs/seo/reports/`)

## Files here

- `YYYY-MM-DD.md`: one report per run
- `log.md`: append-only, one line per finding:
  `YYYY-MM-DD | class | impact | official/interpretation | short title | URL`

## How to run

Manually: ask Claude Code to "run the algorithm-watch agent". It reads the
sources, writes today's report, appends to the log, and stops.

Scheduled: run the same prompt once a day with a scheduled task (for example a
cron job or the Claude Code scheduled-tasks feature). Daily is enough: official
sources change a few times a week at most. Most days the entry is "no change".
A scheduled run needs web access and write access to `docs/seo/watch/` and
`docs/seo/backlog.md`. It needs no secrets.

Next step for any proposal: review the report, then ask the `seo-agent` to
apply the approved items in its normal draft PR.

## What it will do

- Read official sources and cite every URL
- Classify: policy/spam-policy, ranking system, new feature/markup, AI-answer
  visibility, Facebook/Meta distribution
- Read this repo and judge impact for a Hebrew, single-attorney law-firm site
- Write draft proposals, and add unchecked technical items to the backlog

## What it will not do

- Edit site code, `brand.ts`, `package.json` or scripts
- Run git, open branches, commits or PRs, or merge anything
- Publish or change any public legal text (the attorney approves every text)
- Estimate rankings, traffic or leads, or claim to see Search Console data
- Do anything on the "do not" list in the skill

## Report template

```markdown
# Algorithm watch: YYYY-MM-DD

## Summary
Findings: N (policy a, ranking b, feature c, AI visibility d, Meta e).
High-impact: N. Nothing new: yes/no.

## Could not check
(live site, Search Console, Meta Insights, unreachable sources)

## Findings
### 1. Short title
- Class: ...
- Source: URL (date) | official / interpretation | confirmed / partly / unconfirmed
- What changed: ...
- Impact on this site: high/medium/low/none, one sentence citing the file read
- Hebrew / Israel note: ...
- Proposal: change, file, risk, approver (none / attorney)

## Excluded: policy risk
(ideas or claims seen and rejected, with the reason)

## Needs the owner
- [ ] ...

## Added to backlog
(items appended to docs/seo/backlog.md)

## Next run
(what to look at)
```

## Why "exploits" are excluded

The original request was to hunt for loopholes in Google, Facebook and AI chat
modules. That is not built, for three reasons:

1. It breaks platform terms. Cloaking, link schemes, fake accounts, and
   injecting text into other companies' AI assistants lead to demotion or
   removal of the site, which costs more than any short-term gain.
2. A law firm is bound by the Israeli Bar's advertising rules. Manipulative or
   misleading promotion is a professional risk for the attorney personally.
3. Loopholes get closed, and the site that depended on them goes with them.
   Durable organic visibility comes from accurate pages, clear structure,
   crawler access, real reviews and a complete Google Business Profile.

The watch keeps the ambitious part, which is speed: learning about legitimate
changes early and acting on them in small, safe steps.
