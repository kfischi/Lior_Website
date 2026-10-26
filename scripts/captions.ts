/**
 * Draft Hebrew captions (WebVTT) for the video reviews with Gemini.
 *
 * Run (Node 22+):
 *   npm run captions            # loads .env.local; needs GOOGLE_GENERATIVE_AI_API_KEY
 *
 * Writes public/videos/<name>.he.vtt next to each local video in
 * brand.videoReviews. These are DRAFTS of what clients said: read each file
 * while listening to the video and fix mistakes before publishing, then set
 * `captions` for the video in src/lib/brand.ts.
 */
import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { streamText } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { brand } from '../src/lib/brand';

const key = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
if (!key) {
  console.error('Set GOOGLE_GENERATIVE_AI_API_KEY (for example in .env.local).');
  process.exit(1);
}

const google = createGoogleGenerativeAI({
  baseURL: process.env.GOOGLE_GENERATIVE_AI_BASE_URL || undefined,
});
const model = google(process.env.GEMINI_MODEL || 'gemini-2.5-flash');

const PROMPT = `זהו סרטון שבו אדם מדבר בעברית. כתוב כתוביות בפורמט WebVTT.
כללים:
- השורה הראשונה היא WEBVTT, ואחריה שורה ריקה.
- כל כתובית היא בלוק: שורת זמן בפורמט 00:00:01.200 --> 00:00:04.800, ואחריה שורה או שתיים של טקסט.
- כל כתובית נמשכת בין 2 ל-6 שניות, עם לכל היותר 42 תווים בשורה.
- תמלל מילה במילה בעברית, כפי שנאמר, עם פיסוק. אל תוסיף מילים, אל תסכם ואל תתקן את הדובר.
- מקום שלא ברור כתוב [לא ברור]. אל תמציא.
- החזר אך ורק את קובץ ה-VTT, בלי הסברים ובלי גדרות קוד.`;

const CUE = /^\d{2}:\d{2}:\d{2}\.\d{3} --> \d{2}:\d{2}:\d{2}\.\d{3}$/m;

function clean(text: string): string | null {
  const body = text.replace(/^```(?:vtt)?\s*|\s*```$/g, '').trim();
  return body.startsWith('WEBVTT') && CUE.test(body) ? `${body}\n` : null;
}

async function main() {
  for (const video of brand.videoReviews) {
    if (!video.src.startsWith('/videos/')) continue;
    const file = join(process.cwd(), 'public', video.src);
    const out = file.replace(/\.mp4$/, '.he.vtt');
    console.log(`Transcribing ${video.src} ...`);

    const result = streamText({
      model,
      temperature: 0,
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: PROMPT },
            { type: 'file', data: await readFile(file), mediaType: 'video/mp4' },
          ],
        },
      ],
    });

    const vtt = clean(await result.text);
    if (!vtt) {
      console.error(`  Unexpected output for ${video.src}; skipped.`);
      continue;
    }
    await writeFile(out, vtt, 'utf8');
    console.log(`  Wrote ${out.replace(`${process.cwd()}/`, '')} — review it against the video.`);
  }
}

main().catch((err: unknown) => {
  console.error(err);
  process.exit(1);
});
