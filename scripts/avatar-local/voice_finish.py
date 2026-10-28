"""Turns the recorded takes of the chat's sentences into the files the chat plays.

  voice_finish.py --takes takesH --asr-model /path/to/hebrew-whisper-ct2 [--out public/voice]

The takes are <key>_<tag>.wav (see voice_takes.py), one or more per sentence, where <key> is the key of the sentence
in content/voice/sentences.json and its vowelled text is in content/voice/pointed-*.json.
Each take is listened to with a Hebrew speech recogniser and compared with what it was meant to say; a take that
misses words, adds words or cuts the ending is rejected. Of the takes that pass, the one closest to the text is kept,
trimmed, de-noised, sped up to the pace of the welcome (--tempo), levelled and written as <key>.mp3, and registered
in manifest.json. Sentences without a good take are listed in retry.json.
Needs ffmpeg, ffprobe and faster-whisper.
"""
import argparse
import difflib
import glob
import json
import os
import re
import subprocess
import sys
import tempfile

ap = argparse.ArgumentParser()
ap.add_argument('--takes', required=True)
ap.add_argument('--asr-model', required=True)
ap.add_argument('--pointed', default='content/voice/pointed-*.json')
ap.add_argument('--out', default='public/voice')
ap.add_argument('--tempo', type=float, default=1.3)
ap.add_argument('--min-ratio', type=float, default=0.88)
args = ap.parse_args()

from faster_whisper import WhisperModel  # noqa: E402

pointed: dict[str, str] = {}
for path in sorted(glob.glob(args.pointed)):
    with open(path, encoding='utf-8') as fh:
        pointed.update(json.load(fh))

os.makedirs(args.out, exist_ok=True)
manifest_path = os.path.join(args.out, 'manifest.json')
manifest: dict[str, str] = {}
if os.path.exists(manifest_path):
    with open(manifest_path, encoding='utf-8') as fh:
        manifest = json.load(fh)

cache_path = os.path.join(args.takes, 'heard.json')
heard: dict[str, str] = {}
if os.path.exists(cache_path):
    with open(cache_path, encoding='utf-8') as fh:
        heard = json.load(fh)

asr = WhisperModel(args.asr_model, device='cpu', compute_type='int8', cpu_threads=4)


def words(text: str) -> list[str]:
    plain = re.sub(r'[֑-ׇ]', '', text)
    return re.sub(r'[^א-ת ]', '', plain).split()


def run(cmd: list[str]) -> str:
    return subprocess.run(cmd, check=True, capture_output=True, text=True).stdout


def listen(path: str) -> str:
    segs, _ = asr.transcribe(path, language='he', beam_size=5, condition_on_previous_text=False)
    return ' '.join(s.text for s in segs).strip()


def judge(key: str, said: str) -> float:
    want, got = words(pointed[key]), words(said)
    if not want:
        return 0.0
    sm = difflib.SequenceMatcher(None, want, got)
    kept = sum(b - a for op, a, b, _, _ in sm.get_opcodes() if op == 'equal') / len(want)
    extra = max(0, len(got) - len(want))
    ending = all(w in got[-4:] for w in want[-2:]) if len(want) >= 2 else want[-1] in got
    return kept - 0.15 * extra - (0.3 if not ending else 0.0)


by_key: dict[str, list[str]] = {}
for path in sorted(glob.glob(os.path.join(args.takes, '*.wav'))):
    key = os.path.basename(path).split('_')[0]
    if key in pointed:
        by_key.setdefault(key, []).append(path)

retry: list[str] = []
done = 0
for key, paths in by_key.items():
    scored: list[tuple[float, str]] = []
    for path in paths:
        name = os.path.basename(path)
        if name not in heard:
            heard[name] = listen(path)
            with open(cache_path, 'w', encoding='utf-8') as fh:
                json.dump(heard, fh, ensure_ascii=False, indent=1)
        scored.append((judge(key, heard[name]), path))
    best_score, best = max(scored)
    if best_score < args.min_ratio:
        retry.append(key)
        manifest.pop(key, None)
        print(f'{key}: best {best_score:.2f}, to record again | {heard[os.path.basename(best)]}')
        continue
    target = os.path.join(args.out, f'{key}.mp3')
    chain = ','.join([
        'highpass=f=75',
        'afftdn=nr=12:nf=-50',
        'silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.05',
        'areverse',
        'silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.08',
        'areverse',
        f'atempo={args.tempo}',
        'loudnorm=I=-18:TP=-1.5:LRA=9',
        'apad=pad_dur=0.1',
    ])
    run(['ffmpeg', '-y', '-v', 'error', '-i', best, '-ac', '1', '-ar', '24000', '-af', chain,
         '-c:a', 'libmp3lame', '-b:a', '56k', target])
    manifest[key] = f'/voice/{key}.mp3'
    done += 1

with open(manifest_path, 'w', encoding='utf-8') as fh:
    json.dump(dict(sorted(manifest.items())), fh, ensure_ascii=False, indent=1)
    fh.write('\n')
with open(os.path.join(args.takes, 'retry.json'), 'w', encoding='utf-8') as fh:
    json.dump(retry, fh)
print(f'{done} sentences written now, {len(manifest)} in the manifest, {len(retry)} to record again')
sys.exit(0)
