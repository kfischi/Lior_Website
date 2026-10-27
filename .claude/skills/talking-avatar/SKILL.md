---
name: talking-avatar
description: Turn a photo of a person into a talking-head video that speaks a Hebrew script (their own recording, a synthetic voice, or a paid service), with exact caption timings, for the chat's welcome video. Works fully offline with no account or key. Use when asked to make, redo or improve the avatar video, switch voice or video provider, or change the script.
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

## The no-account route (works anywhere with Python and ffmpeg)
```
npm run avatar:setup                                                            # once: ~40 s, installs into .avatar-venv
npm run avatar -- --tts recorded --recording my-reading.m4a --provider local   # a real voice, animated photo
```
- `--tts recorded`: one recording (audio or a phone video) of the whole script read aloud, with a clear pause of
  about a second between lines. It is cut into lines at the longest pauses, and each line's start time is exact.
  Real recorded Hebrew sounds far better than any offline synthetic voice.
- `--lines-dir <folder>`: instead of one recording, one audio file per line named `01.mp3`, `02.mp3`, ... in order.
  The safest way, for example with a text-to-speech site that makes each line separately.
- `--provider local` (`scripts/avatar-local/puppet.py`): MediaPipe face landmarks and 2D animation. The mouth opens
  with the loudness and brightness of the voice, plus blinks, small head movement, breathing and brow lifts. About
  3 frames a second on 4 CPU cores (a 90 s video takes around 7 minutes).
- Honest quality: a stylised living portrait. Small, soft speech movements look natural at the size of the chat
  window. It has no lip rounding for "o/u", the teeth are a simple shaded band, and it looks synthetic when enlarged.
  Photoreal lip-sync needs a neural model on a GPU or a paid service (below). Say so to the person asking.
- What it models: mouth opening from loudness, vowel shape from the first two formants (rounded "o/u" draws the
  lips together, spread "i/e" pulls the corners out, an open "a" opens wider), blinks, small gaze shifts, brow
  lifts on emphasis, head movement and breathing. The photo is cropped inside its own borders (no invented pixels).
- Tested here: setup, the pause-based split, chunking with motion kept continuous across chunks, the join, the
  site playback, and a 12 s run on real Hebrew speech (frames reviewed: natural, subtle movement, no artefacts).

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
| Video | `local` | tested end to end (see above) |
| Video | `preview` | tested: still photo with a slow push-in, no lip movement |
| Speech | `recorded` | tested with a synthetic recording; the person's own voice |

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
- Do not ship the `preview` provider's output (still photo) as the final video.
- Do not describe the `local` result as photorealistic AI video; it is an animated portrait.
- Do not remove the AI label, the disclaimer line, or the skip and captions controls.
- Do not commit `.env.local` or `.avatar-work/`.
