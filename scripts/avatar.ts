/**
 * Build the chat's welcome video from a photo and the script in src/lib/avatar-intro.json.
 *
 *   npm run avatar -- --tts elevenlabs --voice <voiceId> --provider fal
 *   npm run avatar -- --dry-run                      # plan only, no calls
 *   npm run avatar                                   # silent preview: still photo, no speech
 *
 * Steps: 1) speech for every script line (so each line's start time is exact), 2) a talking
 * video from the photo and that speech, in chunks the provider can handle, 3) one H.264 file
 * with the master audio, a poster frame, and the start times written back to avatar-intro.json.
 * Needs ffmpeg and ffprobe on the PATH. Keys are read from .env.local, never printed.
 *
 *   --photo <path>      default public/images/lior-about.webp
 *   --tts <name>        silent (default) | recorded | elevenlabs | gemini
 *   --recording <file>  with --tts recorded: one recording (audio or video) of the whole script read aloud
 *                       with a short pause between the lines; it is cut into lines at the pauses
 *   --lines-dir <dir>   with --tts recorded: a folder with one audio file per line (01.mp3, 02.mp3 ...),
 *                       in order; the safest way, for example when a voice site makes each line separately
 *   --voice <id>        ElevenLabs voice id, or a Gemini voice name (default Kore)
 *   --provider <name>   preview (default) | local | fal | did
 *                       local: animates the photo on this machine, no account or key (npm run avatar:setup first)
 *   --out <name>        output name in public/videos (default intro)
 *   --gap <seconds>     pause between lines (default 0.45)
 *   --max-chunk <s>     longest piece sent to a provider (default 28)
 *
 * The person in the photo must have agreed to this use of their face and voice.
 */
import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

interface Segment {
  start: number;
  text: string;
  focus?: string;
}
interface IntroFile {
  src: string;
  poster: string;
  segments: Segment[];
}

const ROOT = process.cwd();
const WORK = join(ROOT, '.avatar-work');
const INTRO_JSON = join(ROOT, 'src/lib/avatar-intro.json');

// ---------- small helpers ----------

function parseArgs(argv: string[]): Record<string, string> {
  const out: Record<string, string> = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (!a.startsWith('--')) continue;
    const next = argv[i + 1];
    if (next === undefined || next.startsWith('--')) out[a.slice(2)] = 'true';
    else {
      out[a.slice(2)] = next;
      i++;
    }
  }
  return out;
}

function run(cmd: string, args: string[]): string {
  const r = spawnSync(cmd, args, { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
  if (r.error) throw new Error(`${cmd} could not start: ${r.error.message}`);
  if (r.status !== 0) throw new Error(`${cmd} failed (${r.status}): ${r.stderr.split('\n').slice(-8).join('\n')}`);
  return r.stdout;
}

const ffmpeg = (args: string[]) => run('ffmpeg', ['-v', 'error', '-y', ...args]);

function duration(file: string): number {
  return Number(run('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', file]).trim());
}

function record(value: unknown): Record<string, unknown> {
  return typeof value === 'object' && value !== null ? (value as Record<string, unknown>) : {};
}

function need(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Set ${name} (for example in .env.local).`);
  return v;
}

async function http(url: string, init: RequestInit): Promise<Response> {
  const res = await fetch(url, init);
  if (!res.ok) throw new Error(`${init.method ?? 'GET'} ${new URL(url).host}${new URL(url).pathname} -> ${res.status}: ${(await res.text()).slice(0, 400)}`);
  return res;
}

async function download(url: string, file: string): Promise<void> {
  const res = await http(url, {});
  writeFileSync(file, Buffer.from(await res.arrayBuffer()));
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function poll<T>(label: string, step: () => Promise<T | null>, everyMs = 4000, maxMs = 15 * 60_000): Promise<T> {
  const started = Date.now();
  for (;;) {
    const v = await step();
    if (v !== null) return v;
    if (Date.now() - started > maxMs) throw new Error(`${label}: timed out`);
    await sleep(everyMs);
  }
}

const dataUri = (file: string, mime: string) => `data:${mime};base64,${readFileSync(file).toString('base64')}`;

// ---------- speech ----------

/** Writes a mono 44.1 kHz WAV for one line of the script. */
async function speak(tts: string, text: string, voice: string | undefined, file: string): Promise<void> {
  if (tts === 'silent') {
    const seconds = Math.max(1.2, text.length / 13);
    ffmpeg(['-f', 'lavfi', '-i', 'anullsrc=r=44100:cl=mono', '-t', seconds.toFixed(2), file]);
    return;
  }
  if (tts === 'elevenlabs') {
    if (!voice) throw new Error('--voice <ElevenLabs voice id> is required with --tts elevenlabs.');
    const res = await http(`https://api.elevenlabs.io/v1/text-to-speech/${voice}?output_format=mp3_44100_128`, {
      method: 'POST',
      headers: { 'xi-api-key': need('ELEVENLABS_API_KEY'), 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text,
        model_id: process.env.ELEVENLABS_MODEL || 'eleven_v3',
        language_code: 'he',
        voice_settings: { stability: 0.5, similarity_boost: 0.8 },
      }),
    });
    const mp3 = file.replace(/\.wav$/, '.mp3');
    writeFileSync(mp3, Buffer.from(await res.arrayBuffer()));
    ffmpeg(['-i', mp3, '-ac', '1', '-ar', '44100', file]);
    return;
  }
  if (tts === 'gemini') {
    const model = process.env.GEMINI_TTS_MODEL || 'gemini-2.5-flash-preview-tts';
    const res = await http(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${need('GOOGLE_GENERATIVE_AI_API_KEY')}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `Say warmly and calmly, in Hebrew: ${text}` }] }],
          generationConfig: {
            responseModalities: ['AUDIO'],
            speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: voice || 'Kore' } } },
          },
        }),
      },
    );
    const body = record(await res.json());
    const parts = record(record(Array.isArray(body.candidates) ? body.candidates[0] : {}).content).parts;
    const inline = record(record(Array.isArray(parts) ? parts[0] : {}).inlineData);
    if (typeof inline.data !== 'string') throw new Error('Gemini TTS returned no audio.');
    const pcm = file.replace(/\.wav$/, '.pcm');
    writeFileSync(pcm, Buffer.from(inline.data, 'base64'));
    ffmpeg(['-f', 's16le', '-ar', '24000', '-ac', '1', '-i', pcm, '-ar', '44100', file]);
    return;
  }
  throw new Error(`Unknown --tts "${tts}". Use silent, elevenlabs or gemini.`);
}

/**
 * Cuts one recording of the whole script into `count` lines at its longest pauses.
 * Returns the WAV files, one per line, with the silence trimmed from their edges.
 */
function splitRecording(recording: string, count: number): string[] {
  const wav = join(WORK, 'recording.wav');
  ffmpeg(['-i', recording, '-vn', '-ac', '1', '-ar', '44100', wav]);
  const total = duration(wav);
  const log = spawnSync('ffmpeg', ['-i', wav, '-af', 'silencedetect=noise=-35dB:d=0.3', '-f', 'null', '-'], { encoding: 'utf8' }).stderr;
  const starts = [...log.matchAll(/silence_start: ([\d.]+)/g)].map((m) => Number(m[1]));
  const ends = [...log.matchAll(/silence_end: ([\d.]+)/g)].map((m) => Number(m[1]));
  const gaps = starts
    .map((st, i) => ({ start: st, end: ends[i] ?? total }))
    .filter((g) => g.start > 0.3 && g.end < total - 0.3)
    .map((g) => ({ ...g, length: g.end - g.start }));
  if (gaps.length < count - 1) {
    throw new Error(`Found ${gaps.length} pauses in the recording but need ${count - 1} (one between each of the ${count} lines). Pause longer between lines, or record the lines separately.`);
  }
  const cuts = [...gaps].sort((a, b) => b.length - a.length).slice(0, count - 1).sort((a, b) => a.start - b.start);
  const weakest = Math.min(...cuts.map((c) => c.length));
  if (weakest < 0.45) console.warn(`Warning: the shortest pause used to split lines is only ${weakest.toFixed(2)} s; check the cuts.`);
  const bounds = [0, ...cuts.map((c) => (c.start + c.end) / 2), total];
  const files: string[] = [];
  for (let i = 0; i < count; i++) {
    const file = join(WORK, `line-${String(i).padStart(2, '0')}.wav`);
    ffmpeg(['-i', wav, '-ss', bounds[i].toFixed(3), '-to', bounds[i + 1].toFixed(3), '-af', 'silenceremove=start_periods=1:start_threshold=-40dB,areverse,silenceremove=start_periods=1:start_threshold=-40dB,areverse', file]);
    files.push(file);
  }
  return files;
}

/** One audio file per line, in name order (01, 02, ... 12), with the silence trimmed from the edges. */
function linesFromDir(dir: string, count: number): string[] {
  const names = readdirSync(dir)
    .filter((n) => /\.(mp3|wav|m4a|aac|ogg|opus|flac|mp4|mov|webm)$/i.test(n))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
  if (names.length !== count) {
    throw new Error(`${dir} has ${names.length} audio files but the script has ${count} lines. Name them 01, 02, ... in order.`);
  }
  return names.map((name, i) => {
    const file = join(WORK, `line-${String(i).padStart(2, '0')}.wav`);
    ffmpeg(['-i', join(dir, name), '-vn', '-ac', '1', '-ar', '44100', '-af', 'silenceremove=start_periods=1:start_threshold=-45dB,areverse,silenceremove=start_periods=1:start_threshold=-45dB,areverse', file]);
    return file;
  });
}

// ---------- talking video providers ----------

type Render = (photo: string, audio: string, out: string, startAt: number) => Promise<void>;

/** No lip movement: a slow push-in on the still photo, to test the whole pipeline. */
const previewRender: Render = async (photo, audio, out) => {
  const seconds = duration(audio);
  ffmpeg([
    '-loop', '1', '-i', photo, '-i', audio, '-t', seconds.toFixed(2),
    '-vf', "scale=1080:-2,zoompan=z='1+0.0008*on':d=1:s=720x720:fps=25,format=yuv420p",
    '-c:v', 'libx264', '-crf', '24', '-c:a', 'aac', '-shortest', out,
  ]);
};

/** fal.ai audio-driven avatar (OmniHuman by default). Unverified against the live service. */
const falRender: Render = async (photo, audio, out) => {
  const key = need('FAL_KEY');
  const model = process.env.FAL_AVATAR_MODEL || 'fal-ai/bytedance/omnihuman/v1.5';
  const headers = { Authorization: `Key ${key}`, 'Content-Type': 'application/json' };
  const submit = record(
    await (
      await http(`https://queue.fal.run/${model}`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ image_url: dataUri(photo, 'image/png'), audio_url: dataUri(audio, 'audio/wav') }),
      })
    ).json(),
  );
  const statusUrl = String(submit.status_url ?? '');
  const responseUrl = String(submit.response_url ?? '');
  if (!statusUrl || !responseUrl) throw new Error(`fal: unexpected submit response ${JSON.stringify(submit).slice(0, 300)}`);
  await poll('fal render', async () => {
    const s = record(await (await http(statusUrl, { headers })).json());
    if (s.status === 'COMPLETED') return true;
    if (s.status === 'FAILED' || s.error) throw new Error(`fal: ${JSON.stringify(s).slice(0, 300)}`);
    return null;
  });
  const result = record(await (await http(responseUrl, { headers })).json());
  const url = record(result.video).url;
  if (typeof url !== 'string') throw new Error(`fal: no video in ${JSON.stringify(result).slice(0, 300)}`);
  await download(url, out);
};

/** D-ID talks from an uploaded image and audio. Unverified against the live service. */
const didRender: Render = async (photo, audio, out) => {
  const auth = { Authorization: `Basic ${need('DID_API_KEY')}` };
  const upload = async (kind: 'images' | 'audios', file: string, mime: string, field: string) => {
    const form = new FormData();
    form.append(field, new Blob([readFileSync(file)], { type: mime }), file.split('/').pop());
    const r = record(await (await http(`https://api.d-id.com/${kind}`, { method: 'POST', headers: auth, body: form })).json());
    if (typeof r.url !== 'string') throw new Error(`D-ID ${kind}: ${JSON.stringify(r).slice(0, 300)}`);
    return r.url;
  };
  const sourceUrl = await upload('images', photo, 'image/png', 'image');
  const audioUrl = await upload('audios', audio, 'audio/wav', 'audio');
  const created = record(
    await (
      await http('https://api.d-id.com/talks', {
        method: 'POST',
        headers: { ...auth, 'Content-Type': 'application/json' },
        body: JSON.stringify({ source_url: sourceUrl, script: { type: 'audio', audio_url: audioUrl } }),
      })
    ).json(),
  );
  const id = String(created.id ?? '');
  if (!id) throw new Error(`D-ID: ${JSON.stringify(created).slice(0, 300)}`);
  const done = await poll('D-ID render', async () => {
    const t = record(await (await http(`https://api.d-id.com/talks/${id}`, { headers: auth })).json());
    if (t.status === 'done' && typeof t.result_url === 'string') return t.result_url;
    if (t.status === 'error' || t.status === 'rejected') throw new Error(`D-ID: ${JSON.stringify(t).slice(0, 300)}`);
    return null;
  });
  await download(done, out);
};

/** Offline "living portrait": landmarks plus 2D animation driven by the audio. No account, no key. */
const localRender: Render = async (photo, audio, out, startAt) => {
  const python = process.env.AVATAR_PYTHON || join(ROOT, '.avatar-venv/bin/python');
  if (!existsSync(python)) throw new Error('Run "npm run avatar:setup" first (it creates .avatar-venv).');
  run(python, [
    join(ROOT, 'scripts/avatar-local/puppet.py'),
    '--photo', photo, '--audio', audio, '--out', out, '--start', startAt.toFixed(3),
  ]);
};

const PROVIDERS: Record<string, Render> = { preview: previewRender, local: localRender, fal: falRender, did: didRender };

// ---------- main ----------

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const photoArg = args.photo || 'public/images/lior-about.webp';
  const tts = args.tts || 'silent';
  const providerName = args.provider || 'preview';
  const outName = args.out || 'intro';
  const gap = Number(args.gap || 0.45);
  const maxChunk = Number(args['max-chunk'] || 28);
  const render = PROVIDERS[providerName];
  if (!render) throw new Error(`Unknown --provider "${providerName}". Use preview, fal or did.`);

  const intro = JSON.parse(readFileSync(INTRO_JSON, 'utf8')) as IntroFile;
  console.log(`${intro.segments.length} lines · speech: ${tts} · video: ${providerName}`);
  if (args['dry-run']) {
    intro.segments.forEach((s, i) => console.log(`  ${i + 1}. [${s.focus ?? '-'}] ${s.text.slice(0, 60)}`));
    return;
  }
  if (tts !== 'silent' && providerName === 'preview') console.log('Note: the preview provider has speech but no lip movement.');

  rmSync(WORK, { recursive: true, force: true });
  mkdirSync(WORK, { recursive: true });
  const photo = join(WORK, 'photo.png');
  ffmpeg(['-i', resolve(ROOT, photoArg), photo]);

  // 1) speech for every line, and exact start times
  const gapFile = join(WORK, 'gap.wav');
  ffmpeg(['-f', 'lavfi', '-i', 'anullsrc=r=44100:cl=mono', '-t', gap.toFixed(2), gapFile]);
  const lines: { file: string; seconds: number }[] = [];
  if (tts === 'recorded') {
    if (!args.recording && !args['lines-dir']) throw new Error('--recording <file> or --lines-dir <folder> is required with --tts recorded.');
    const files = args['lines-dir']
      ? linesFromDir(resolve(ROOT, args['lines-dir']), intro.segments.length)
      : splitRecording(resolve(ROOT, args.recording), intro.segments.length);
    for (const file of files) lines.push({ file, seconds: duration(file) });
  } else {
    for (let i = 0; i < intro.segments.length; i++) {
      const file = join(WORK, `line-${String(i).padStart(2, '0')}.wav`);
      process.stdout.write(`speech ${i + 1}/${intro.segments.length}\r`);
      await speak(tts, intro.segments[i].text, args.voice, file);
      lines.push({ file, seconds: duration(file) });
    }
  }
  let t = 0;
  const starts = lines.map((l) => {
    const s = t;
    t += l.seconds + gap;
    return Math.round(s * 10) / 10;
  });
  console.log(`\nspeech ready: ${(t - gap).toFixed(1)} s`);

  // 2) chunks the provider can render
  const chunks: number[][] = [];
  let acc = 0;
  lines.forEach((l, i) => {
    const add = l.seconds + (chunks.at(-1)?.length ? gap : 0);
    if (!chunks.length || acc + add > maxChunk) {
      chunks.push([i]);
      acc = l.seconds;
    } else {
      chunks.at(-1)!.push(i);
      acc += add;
    }
  });
  const concat = (files: string[], out: string, extra: string[] = []) => {
    const list = join(WORK, `${out.split('/').pop()}.txt`);
    writeFileSync(list, files.map((f) => `file '${f}'`).join('\n'));
    ffmpeg(['-f', 'concat', '-safe', '0', '-i', list, ...extra, out]);
  };
  const clips: string[] = [];
  for (let c = 0; c < chunks.length; c++) {
    const parts: string[] = [];
    chunks[c].forEach((i, k) => parts.push(...(k ? [gapFile] : []), lines[i].file));
    // The pause before the next chunk belongs to this one, so the joined video keeps the timing.
    if (c < chunks.length - 1) parts.push(gapFile);
    const audio = join(WORK, `chunk-${c}.wav`);
    concat(parts, audio);
    const clip = join(WORK, `clip-${c}.mp4`);
    console.log(`video ${c + 1}/${chunks.length} (${duration(audio).toFixed(1)} s of speech)...`);
    await render(photo, audio, clip, starts[chunks[c][0]]);
    // Providers return clips a little shorter or longer than the speech. Pad with the last frame
    // or trim, so every chunk is exactly as long as its audio and the start times stay true.
    const fixed = join(WORK, `fixed-${c}.mp4`);
    ffmpeg([
      '-i', clip, '-an', '-vf', 'fps=25,tpad=stop_mode=clone:stop_duration=5',
      '-t', duration(audio).toFixed(3), '-c:v', 'libx264', '-crf', '20', '-pix_fmt', 'yuv420p', fixed,
    ]);
    clips.push(fixed);
  }

  // 3) join, mux the master audio, poster, and write the config
  const allAudio: string[] = [];
  lines.forEach((l, i) => allAudio.push(...(i ? [gapFile] : []), l.file));
  const master = join(WORK, 'master.wav');
  concat(allAudio, master);
  const silentVideo = join(WORK, 'video.mp4');
  concat(clips, silentVideo, ['-an', '-c:v', 'libx264', '-crf', '20', '-pix_fmt', 'yuv420p']);
  const drift = Math.abs(duration(silentVideo) - duration(master));
  if (drift > 0.3) console.warn(`Warning: video and speech differ by ${drift.toFixed(2)} s; check the joins.`);

  mkdirSync(join(ROOT, 'public/videos'), { recursive: true });
  const outFile = join(ROOT, 'public/videos', `${outName}.mp4`);
  ffmpeg([
    '-i', silentVideo, '-i', master, '-map', '0:v', '-map', '1:a',
    '-vf', "scale='min(720,iw)':-2", '-c:v', 'libx264', '-crf', '24', '-preset', 'slow', '-pix_fmt', 'yuv420p',
    '-c:a', 'aac', '-b:a', '96k', '-movflags', '+faststart', '-shortest', outFile,
  ]);
  const posterFile = join(ROOT, 'public/images', `${outName}-poster.webp`);
  ffmpeg(['-ss', '0.3', '-i', outFile, '-frames:v', '1', '-c:v', 'libwebp', '-quality', '80', posterFile]);

  intro.src = `/videos/${outName}.mp4`;
  intro.poster = `/images/${outName}-poster.webp`;
  intro.segments = intro.segments.map((s, i) => ({ ...s, start: starts[i] }));
  writeFileSync(INTRO_JSON, `${JSON.stringify(intro, null, 2)}\n`);

  const mb = statSync(outFile).size / 1_048_576;
  console.log(`\nDone: public/videos/${outName}.mp4 · ${duration(outFile).toFixed(1)} s · ${mb.toFixed(1)} MB`);
  console.log('Start times written to src/lib/avatar-intro.json. Watch the whole video before publishing.');
  if (!existsSync(posterFile)) console.warn('Poster frame was not written.');
}

main().catch((e: unknown) => {
  console.error(e instanceof Error ? e.message : e);
  process.exit(1);
});
