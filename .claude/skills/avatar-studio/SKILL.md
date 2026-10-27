---
name: avatar-studio
description: The whole talking-avatar job inside Claude Code, from a photo and a script to the welcome video on the site. Use first when the request is to make the avatar, check what this environment can do, choose between the offline, open-source-model and paid-service routes, or explain what is possible. It calls the talking-avatar and avatar-tour skills.
---

# Avatar studio (everything in Claude Code)

Goal: make the site's welcome video, with captions and site highlights, without leaving Claude Code.

## Step 0: find out what this machine can do
`npm run avatar:doctor` lists tools, compute and which hosts are reachable. Read its notes aloud to the person.
The answer decides the route:

| Route | Needs | Result | Status |
| --- | --- | --- | --- |
| A. Living portrait, offline | Python, ffmpeg, `npm run avatar:setup` | The photo blinks, breathes, shifts its gaze and moves the mouth with a recording. Stylised, not photoreal | built and tested |
| B. Open-source models | `huggingface.co` and `github.com` reachable, ideally a GPU | Voice cloned from a short sample (for example Chatterbox Multilingual) and a neural lip-sync (for example SadTalker or MuseTalk) | not built: weights could not be downloaded in the cloud sandbox. Build it only when `avatar:doctor` shows both hosts reachable, and test each step before claiming it works |
| C. Paid service | A key and network access | Photoreal lip-sync (fal OmniHuman, D-ID) and a cloned voice (ElevenLabs) | adapters written to the docs, never run live |

Honest points to give the person:
- Hebrew is the weak spot of open voice models. One informal 2025 test found Chatterbox cloning poor in Hebrew;
  check the first output by ear before building on it.
- A 10 s voice note is too short to clone well. Ask for 1-3 minutes of clean speech, with the speaker's consent.
- Without a GPU the open lip-sync models are slow and low resolution.
- Running Claude Code on a computer with a GPU removes most limits, and everything still happens inside Claude Code.
- Do not promise "photoreal". Say what the chosen route produces.

## The flow (route A works today)
1. Consent from the person in the photo, and from the speaker if the voice is cloned. Keep the "AI-made" label.
2. Script: `src/lib/avatar-intro.json` (the lines, and `focus` for what lights up on the site). Hebrew, one idea per line.
3. Voice: the speaker reads the lines (WhatsApp voice notes `01.opus`...`12.opus` work), or a service makes them.
4. `npm run avatar -- --tts recorded --lines-dir <folder> --provider local` (see the `talking-avatar` skill).
5. Check the result in the chat at 1440 px and 390 px, and click through the transcript (see `avatar-tour`).
6. `npm run typecheck && npm run lint && npm run build`, then open a PR and wait for the person's approval.

## Building route B (only when the doctor allows)
1. Voice: install the model in a separate venv, write `scripts/avatar-local/voice.py` that takes `--sample` and a lines JSON and writes
   `01.wav`...; add `--tts clone` to `scripts/avatar.ts` calling it. Listen to a Hebrew test line first.
2. Lip-sync: add a provider that renders a still photo plus audio to a video, in chunks like the other providers
   (`max-chunk`), keeping the same timing code. Compare it frame by frame with route A before switching.
3. Update the table above with what was actually tested.

## Marketing honesty
What can be said truthfully today: an AI assistant with a living portrait of the attorney, captions, a transcript and
a tour that points at the site as she speaks, all built in Claude Code. Do not say "photoreal" or "her real voice"
unless that route has been built, tested and approved by the attorney.
