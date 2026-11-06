---
name: avatar-tour
description: Edit the interactive markings that follow the welcome video (which part of the site lights up while she speaks), retime them to a recording, or add a new target. Use when the avatar script, caption timings or the highlighted elements need changing.
---

# Avatar tour (what lights up while she talks)

Each line in `src/lib/avatar-intro.json` has `start` (seconds), `text` and an optional `focus`. While that
line plays, `src/components/ai/IntroStage.tsx` calls `applyTour(focus)` from `tour.ts`, which adds
`data-tour-on` to the matching elements (a glowing outline, see `globals.css`) and, on screens of 1024 px and up,
scrolls the section into view. The same lines are the live captions and the clickable transcript.

## Targets (`IntroFocus` in `src/lib/brand.ts`)
`about`, `chat`, `voice`, `questions`, `articles`, `faq`, `reviews`, `contact`. Each maps to selectors in
`TARGETS` in `tour.ts`: header links and page sections by href or id, the chat's own controls by
`data-tour-target="chat|voice|questions"`.

## Add a target
1. Add the name to `IntroFocus` in `brand.ts` and a `TARGETS` entry in `tour.ts` (selectors, optional `scrollTo`).
2. If it is inside the chat, add `data-tour-target="name"` to the element in `ConciergePanel.tsx`.
3. Use it as `focus` on the line that talks about it, then check it in a browser.

## Retime to a real recording
- With `npm run avatar` the start times are exact, written for you.
- For a video recorded elsewhere: export subtitles (SRT) from the tool and copy each line's start time into
  `start`. No SRT: `ffmpeg -i intro.mp4 -af silencedetect=noise=-35dB:d=0.35 -f null -` lists the pauses between
  lines; match them to the script by order.
- After editing, open the transcript in the chat and click each line: the highlight and the captions must change at
  the right word, and the video must jump to the line's start.

## Rules
- One `focus` per line; a line should mention only what is highlighted.
- Reduced motion: no autoplay and no smooth scroll (already handled); keep it so.
- Keep the highlights to elements that exist on every page the chat can open on, or make them harmless when missing
  (a missing selector is simply skipped).
- Run `npm run typecheck && npm run lint` and test in the browser at 1440 px and 390 px.
