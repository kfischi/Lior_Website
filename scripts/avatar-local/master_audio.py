"""Masters the welcome narration: one audio file per script line in, one clean mp3 and the caption timings out.

For a voice that is allowed to be used (the person agreed, or a built-in synthetic voice), not for a real person's
voice taken from somewhere else. Needs ffmpeg and ffprobe on the PATH.

  master_audio.py --lines-dir lines/ [--tempo 1.25 --gap 0.2] [--out public/audio/intro.mp3]
                  [--intro-json src/lib/avatar-intro.json]

lines/ holds 01.wav ... 12.wav (any format ffmpeg reads: wav, mp3, m4a, WhatsApp .opus), one per line of the script.
Each line is: high-passed (no rumble), de-noised (FFT), sped up without changing the pitch (--tempo), brought to one
loudness and peak limit, and the lines are joined with a short pause. The start time of every line is written into the
`segments[].start` of --intro-json, which drives the captions, the transcript and the highlights on the site.
"""
import argparse
import json
import os
import subprocess
import sys
import tempfile

ap = argparse.ArgumentParser()
ap.add_argument('--lines-dir', required=True)
ap.add_argument('--tempo', type=float, default=1.25, help='1 = as recorded; 1.25 is a brisk, natural pace')
ap.add_argument('--gap', type=float, default=0.2, help='seconds of pause between lines')
ap.add_argument('--out', default='public/audio/intro.mp3')
ap.add_argument('--intro-json', default='src/lib/avatar-intro.json')
ap.add_argument('--denoise', type=float, default=12.0, help='dB of noise reduction (0 switches it off)')
args = ap.parse_args()

if not 0.5 <= args.tempo <= 2.0:
    sys.exit('--tempo must be between 0.5 and 2.0')


def run(cmd: list[str]) -> str:
    return subprocess.run(cmd, check=True, capture_output=True, text=True).stdout


def ffmpeg(*a: str) -> None:
    run(['ffmpeg', '-v', 'error', '-y', *a])


def duration(path: str) -> float:
    return float(run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', path]).strip())


with open(args.intro_json, encoding='utf-8') as fh:
    intro = json.load(fh)
segments = intro['segments']

files = sorted(f for f in os.listdir(args.lines_dir) if not f.startswith('.'))
if len(files) != len(segments):
    sys.exit(f'{len(segments)} script lines but {len(files)} files in {args.lines_dir}')

filters = ['highpass=f=75']
if args.denoise > 0:
    filters.append(f'afftdn=nr={args.denoise}:nf=-50')
filters += [
    f'atempo={args.tempo}',
    'loudnorm=I=-18:TP=-1.5:LRA=9',
]

starts: list[float] = []
with tempfile.TemporaryDirectory() as tmp:
    gap = os.path.join(tmp, 'gap.wav')
    ffmpeg('-f', 'lavfi', '-i', 'anullsrc=r=24000:cl=mono', '-t', str(args.gap), '-c:a', 'pcm_f32le', gap)
    parts: list[str] = []
    now = 0.0
    for i, name in enumerate(files, 1):
        out = os.path.join(tmp, f'{i:02d}.wav')
        ffmpeg('-i', os.path.join(args.lines_dir, name), '-ac', '1', '-ar', '24000', '-af', ','.join(filters), '-c:a', 'pcm_f32le', out)
        starts.append(round(now, 1))
        now += duration(out) + args.gap
        parts += [out, gap]
    listing = os.path.join(tmp, 'all.txt')
    with open(listing, 'w', encoding='utf-8') as fh:
        fh.write(''.join(f"file '{p}'\n" for p in parts))
    os.makedirs(os.path.dirname(args.out) or '.', exist_ok=True)
    ffmpeg('-f', 'concat', '-safe', '0', '-i', listing, '-ar', '44100', '-ac', '1', '-c:a', 'libmp3lame', '-b:a', '64k', args.out)

for seg, start in zip(segments, starts):
    seg['start'] = start
with open(args.intro_json, 'w', encoding='utf-8') as fh:
    json.dump(intro, fh, ensure_ascii=False, indent=2)
    fh.write('\n')
print(f'{args.out}: {duration(args.out):.1f} s, line starts {starts}')
