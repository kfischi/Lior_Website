---
name: talking-avatar
description: Turn a photo of a person into a talking-head video that speaks a Hebrew script, with exact caption timings, for the chat's welcome video. Use when asked to make, redo or improve the avatar video, switch voice or video provider, or change the script.
---

# Talking avatar (photo to speaking video)

The site's chat opens with a welcome video of the virtual assistant. `scripts/avatar.ts`
(`npm run avatar`) builds it: script lines to speech, speech plus the photo to a talking video, then one
H.264 file, a poster, and the exact start time of every line in `src/lib/avatar-intro.json`
(captions, transcript and the site highlights all read that file).

## Before anything: consent
The person in the photo must have agreed in writing to the use of their face and voice, including a
cloned voice. Ask if it is not already stated. Never make a video of anyone else. The video is
labelled "נוצר בבינה מלאכותית" in the player and the script says she is a virtual assistant; keep both.

## Inputs
- Photo: front-facing, sharp, neutral expression, head and shoulders, plain lighting
  (default `public/images/lior-about.webp`). A square crop with the face in the upper half frames best.
- Script: `src/lib/avatar-intro.json` (`segments[].text`, optional `focus`). Edit lines there. One idea per line,
  under about 25 seconds each. Keep the disclaimer line ("אני עוזרת וירטואלית ואיני מחליפה ייעוץ משפטי").
- Keys in `.env.local` (never print or commit them): `ELEVENLABS_API_KEY`, `GOOGLE_GENERATIVE_AI_API_KEY`
  (already used by the chat), `FAL_KEY`, `DID_API_KEY`.

## Run
```
npm run avatar -- --dry-run                                          # list the lines
npm run avatar                                                       # silent preview, still photo (tests the pipeline)
npm run avatar -- --tts gemini --provider fal                        # Gemini voice + fal OmniHuman
npm run avatar -- --tts elevenlabs --voice <voiceId> --provider fal  # cloned or library voice
npm run avatar -- --tts elevenlabs --voice <voiceId> --provider did
```
Other flags: `--photo`, `--out`, `--gap` (pause between lines, 0.45 s), `--max-chunk` (longest piece sent to
the provider, 28 s; fal OmniHuman 1.5 allows 30 s at 1080p and 60 s at 720p).
`FAL_AVATAR_MODEL` picks another fal model (for example `bytedance/omnihuman/v2`).

## What the providers are
| Piece | Option | Status |
| --- | --- | --- |
| Speech | `elevenlabs` (Eleven v3, `language_code: he`) | written to the docs, not run against the live service |
| Speech | `gemini` (`gemini-2.5-flash-preview-tts`) | written to the docs, not run against the live service |
| Video | `fal` (OmniHuman, audio-driven) | written to the docs, not run against the live service |
| Video | `did` (talks from image and audio) | written to the docs, not run against the live service |
| Video | `preview` | tested: still photo with a slow push-in, no lip movement |

The sandbox cannot reach these services, so the first real run may need small fixes to request
fields. The scripts print the service's error text (never keys) so the fix is quick.

## After a run: always check
1. `ffprobe public/videos/intro.mp4`: duration matches the last line's start plus its length, size 3-8 MB.
2. Watch it whole, with sound. Check lip sync on the Hebrew, the eyes and teeth at chunk joins (every
   `--max-chunk` seconds), and that the face still looks like her. Re-run a bad chunk with a different `--max-chunk`.
3. Open the site, open the chat, wait 2 s: video plays, captions follow, highlights move (see `avatar-tour`).
4. `npm run typecheck && npm run lint && npm run build`.
5. Do not publish a video the person has not watched and approved.

## Do not
- Do not fake lip movement with the preview provider and ship it as the final video.
- Do not remove the AI label, the disclaimer line, or the skip and captions controls.
- Do not commit `.env.local` or `.avatar-work/`.
