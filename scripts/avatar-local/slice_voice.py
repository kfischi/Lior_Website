"""Cuts the recorded parts of the chat voice into one clean file per sentence and registers them for the chat.

  slice_voice.py --audio-dir recordings/ --asr-model /path/to/hebrew-whisper-ct2
                 [--sentences content/voice/sentences.json] [--out public/voice]

recordings/ holds part-01.<ext> ... (any format ffmpeg reads), each the reading of the matching part of
content/voice/chat-voice-script.txt with a pause of two seconds or more between sentences.
For every part: the speech is separated at the pauses, the pieces must be as many as the sentences, each piece is
levelled and encoded, and then checked by listening to it with a Hebrew speech recogniser: a piece that does not say
its sentence (a missing word, a cut ending, extra words) is NOT added, and is listed so it can be recorded again.
Needs ffmpeg, ffprobe and faster-whisper. Sentences already in the manifest are kept unless their part is given again.
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
ap.add_argument('--audio-dir', required=True)
ap.add_argument('--asr-model', required=True, help='a faster-whisper (CTranslate2) model folder, ideally a Hebrew one')
ap.add_argument('--sentences', default='content/voice/sentences.json')
ap.add_argument('--out', default='public/voice')
ap.add_argument('--min-ratio', type=float, default=0.8, help='how much of the sentence must be heard')
args = ap.parse_args()

from faster_whisper import WhisperModel  # noqa: E402

with open(args.sentences, encoding='utf-8') as fh:
    sentences = json.load(fh)
manifest_path = os.path.join(args.out, 'manifest.json')
os.makedirs(args.out, exist_ok=True)
manifest: dict[str, str] = {}
if os.path.exists(manifest_path):
    with open(manifest_path, encoding='utf-8') as fh:
        manifest = json.load(fh)

asr = WhisperModel(args.asr_model, device='cpu', compute_type='int8', cpu_threads=4)


def run(cmd: list[str]) -> subprocess.CompletedProcess:
    return subprocess.run(cmd, check=True, capture_output=True, text=True)


def duration(path: str) -> float:
    return float(run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', path]).stdout.strip())


def speech_pieces(path: str, db: int, pause: float) -> list[tuple[float, float]]:
    out = subprocess.run(
        ['ffmpeg', '-v', 'info', '-i', path, '-af', f'silencedetect=noise={db}dB:d={pause}', '-f', 'null', '-'],
        capture_output=True, text=True,
    ).stderr
    starts = [float(m) for m in re.findall(r'silence_start: ([\d.]+)', out)]
    ends = [float(m) for m in re.findall(r'silence_end: ([\d.]+)', out)]
    total = duration(path)
    pieces: list[tuple[float, float]] = []
    cursor = 0.0
    for s, e in zip(starts, ends + [total]):
        if s - cursor > 0.25:
            pieces.append((cursor, s))
        cursor = e
    if total - cursor > 0.25 and len(ends) >= len(starts):
        pieces.append((cursor, total))
    return pieces


def words(text: str) -> list[str]:
    plain = re.sub(r'[֑-ׇ]', '', text)
    return re.sub(r'[^א-ת ]', '', plain).split()


def heard_ratio(expected: str, clip: str) -> tuple[float, str]:
    segs, _ = asr.transcribe(clip, language='he', beam_size=5, condition_on_previous_text=False)
    heard = ' '.join(s.text for s in segs)
    ref, hyp = ' '.join(words(expected)), ' '.join(words(heard))
    return difflib.SequenceMatcher(None, ref, hyp).ratio(), heard


rejected: list[str] = []
for part in sorted({s['part'] for s in sentences}):
    files = glob.glob(os.path.join(args.audio_dir, f'part-{part:02d}.*'))
    if not files:
        continue
    expected = sorted((s for s in sentences if s['part'] == part), key=lambda s: s['index'])
    pieces: list[tuple[float, float]] = []
    for db in (-38, -34, -42, -30, -46):
        for pause in (1.4, 1.1, 0.8, 0.6):
            found = speech_pieces(files[0], db, pause)
            if len(found) == len(expected):
                pieces = found
                break
        if pieces:
            break
    if not pieces:
        print(f'part {part:02d}: {len(found)} pieces for {len(expected)} sentences; not cut. Record it again with longer pauses.')
        rejected += [f"part {part:02d} #{s['index'] + 1}: {s['text']}" for s in expected]
        continue
    added = 0
    with tempfile.TemporaryDirectory() as tmp:
        for (start, end), s in zip(pieces, expected):
            clip = os.path.join(tmp, f"{s['key']}.wav")
            length = max(0.3, end - start + 0.2)
            run([
                'ffmpeg', '-y', '-v', 'error', '-ss', f'{max(0.0, start - 0.1):.3f}', '-t', f'{length:.3f}', '-i', files[0],
                '-ac', '1', '-ar', '24000', '-af',
                f'highpass=f=70,loudnorm=I=-18:TP=-2:LRA=7,afade=t=in:d=0.015,areverse,afade=t=in:d=0.04,areverse',
                clip,
            ])
            ratio, heard = heard_ratio(s['text'], clip)
            if ratio < args.min_ratio:
                rejected.append(f"part {part:02d} #{s['index'] + 1} ({ratio:.2f}): {s['text']}  |  heard: {heard.strip()}")
                manifest.pop(s['key'], None)
                continue
            target = os.path.join(args.out, f"{s['key']}.mp3")
            run(['ffmpeg', '-y', '-v', 'error', '-i', clip, '-ac', '1', '-ar', '24000', '-c:a', 'libmp3lame', '-b:a', '56k', target])
            manifest[s['key']] = f"/voice/{s['key']}.mp3"
            added += 1
    print(f'part {part:02d}: {added} of {len(expected)} sentences added')

with open(manifest_path, 'w', encoding='utf-8') as fh:
    json.dump(dict(sorted(manifest.items())), fh, ensure_ascii=False, indent=1)
    fh.write('\n')
total = len(sentences)
print(f'{len(manifest)} of {total} sentences have a recording')
if rejected:
    print('\nTo record again:')
    print('\n'.join(rejected))
    sys.exit(1)
