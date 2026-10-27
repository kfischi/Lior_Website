"""Neural talking-head render: audio in, a living portrait out, on CPU, no account or key.

SadTalker (MIT) predicts head pose, blinks and expressions from the voice and renders the face; this script
then composites that face back onto the full-resolution photo, so the background, hair and clothes stay sharp.
Run it from the SadTalker folder with the python of the environment that has its dependencies (see
scripts/avatar-local/neural-setup.sh):

  python neural_render.py --photo photo.png --lines-dir lines/ --out-dir out/ [--tempo 1.15 --gap 0.3]
  python neural_render.py --photo photo.png --audio speech.wav --out-dir out/ --max-seconds 4     # a short test

Lines: 01.wav, 02.wav ... one per script line. They are sped up (--tempo, pitch unchanged), joined with a
short pause, rendered, and the start time of every line is written to <out>/starts.json.
The face is rendered at 12.5 frames a second (--step 2) and the in-between frames are blended; on 4 CPU cores
that is about 2 s of work per frame. Progress is kept per chunk, so an interrupted run resumes.
Only for a person who has agreed to this use of their face and voice.
"""
import argparse
import json
import os
import random
import subprocess
import sys
import time

import cv2
import numpy as np
import scipy.io as scio
import torch
from PIL import Image

ap = argparse.ArgumentParser()
ap.add_argument('--photo', required=True)
ap.add_argument('--audio')
ap.add_argument('--lines-dir')
ap.add_argument('--out-dir', required=True)
ap.add_argument('--tempo', type=float, default=1.0)
ap.add_argument('--gap', type=float, default=0.3)
ap.add_argument('--step', type=int, default=2, help='render every Nth frame, blend the rest')
ap.add_argument('--chunk', type=int, default=30, help='rendered frames per saved chunk')
ap.add_argument('--pose-style', type=int, default=0)
ap.add_argument('--expression-scale', type=float, default=1.1)
ap.add_argument('--pose-scale', type=float, default=0.6, help='1 = the model\'s own head movement; lower is calmer')
ap.add_argument('--still', action='store_true', help='keep the head still (only face and mouth move)')
ap.add_argument('--seed', type=int, default=3)
ap.add_argument('--size', type=int, default=720, help='output frame size (a square around the face)')
ap.add_argument('--max-seconds', type=float, default=0)
ap.add_argument('--checkpoint-dir', default='./checkpoints')
args = ap.parse_args()

ROOT = os.getcwd()
os.environ['TORCH_HOME'] = os.path.abspath(args.checkpoint_dir)  # the face detector weights ship in checkpoints/hub
sys.path.insert(0, ROOT)
os.makedirs(args.out_dir, exist_ok=True)
random.seed(args.seed)
np.random.seed(args.seed)
torch.manual_seed(args.seed)

# --- compatibility with current libraries (the model code is from 2023) ---
_load = torch.load
torch.load = lambda *a, **k: _load(*a, **{'map_location': 'cpu', 'weights_only': False, **k})
import face_alignment  # noqa: E402

if not hasattr(face_alignment.LandmarksType, '_2D'):
    setattr(face_alignment.LandmarksType, '_2D', face_alignment.LandmarksType.TWO_D)
_FA = face_alignment.FaceAlignment
face_alignment.FaceAlignment = lambda lt, **k: _FA(lt, **{'device': 'cpu', **k})

from src.facerender.animate import AnimateFromCoeff  # noqa: E402
from src.facerender.modules.make_animation import make_animation  # noqa: E402
from src.generate_batch import get_data  # noqa: E402
from src.generate_facerender_batch import transform_semantic_1, transform_semantic_target  # noqa: E402
from src.test_audio2coeff import Audio2Coeff  # noqa: E402
from src.utils.preprocess import CropAndExtract  # noqa: E402

FPS = 25
t0 = time.time()


def log(msg):
    print(f'[{time.time() - t0:6.0f}s] {msg}', flush=True)


def ff(cmd):
    r = subprocess.run(['ffmpeg', '-v', 'error', '-y', *cmd], capture_output=True, text=True)
    if r.returncode:
        raise RuntimeError(r.stderr)


def duration(path):
    out = subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', path],
                         capture_output=True, text=True).stdout
    return float(out.strip())


# ---------- 1) the speech: lines -> one file, with start times ----------
audio = args.audio
starts = []
if args.lines_dir:
    files = sorted(f for f in os.listdir(args.lines_dir) if f.endswith('.wav'))
    parts, t = [], 0.0
    gap = os.path.join(args.out_dir, 'gap.wav')
    ff(['-f', 'lavfi', '-i', 'anullsrc=r=16000:cl=mono', '-t', f'{args.gap}', gap])
    for i, f in enumerate(files):
        sped = os.path.join(args.out_dir, f'sped-{f}')
        ff(['-i', os.path.join(args.lines_dir, f), '-ar', '16000', '-ac', '1', '-af', f'atempo={args.tempo}', sped])
        starts.append(round(t, 1))
        t += duration(sped) + args.gap
        parts += [sped, gap]
    listing = os.path.join(args.out_dir, 'parts.txt')
    open(listing, 'w').write('\n'.join(f"file '{os.path.abspath(p)}'" for p in parts[:-1]))
    audio = os.path.join(args.out_dir, 'speech.wav')
    ff(['-f', 'concat', '-safe', '0', '-i', listing, '-ar', '16000', '-ac', '1', audio])
    json.dump(starts, open(os.path.join(args.out_dir, 'starts.json'), 'w'))
    log(f'speech {duration(audio):.1f}s, line starts {starts}')
if args.max_seconds:
    cut = os.path.join(args.out_dir, 'speech-test.wav')
    ff(['-i', audio, '-t', f'{args.max_seconds}', cut])
    audio = cut
audio = os.path.abspath(audio)

# ---------- 2) models ----------
device = 'cpu'
ck = args.checkpoint_dir
pre = CropAndExtract(f'{ck}/shape_predictor_68_face_landmarks.dat', f'{ck}/epoch_20.pth', f'{ck}/BFM_Fitting', device)
a2c = Audio2Coeff(f'{ck}/auido2pose_00140-model.pth', 'src/config/auido2pose.yaml',
                  f'{ck}/auido2exp_00300-model.pth', 'src/config/auido2exp.yaml', f'{ck}/wav2lip.pth', device)
animator = AnimateFromCoeff(f'{ck}/facevid2vid_00189-model.pth.tar', f'{ck}/mapping_00229-model.pth.tar',
                            'src/config/facerender.yaml', device)
log('models loaded')

# ---------- 3) face geometry, speech -> motion ----------
work = os.path.join(args.out_dir, 'work')
os.makedirs(work, exist_ok=True)
first_coeff, crop_png = pre.generate(args.photo, work)
if first_coeff is None:
    sys.exit('No face found in the photo.')
photo_bgr = cv2.imread(args.photo)
photo_rgb = cv2.cvtColor(photo_bgr, cv2.COLOR_BGR2RGB)
lm_photo = pre.kp_extractor.extract_keypoint([Image.fromarray(photo_rgb)], os.path.join(work, 'photo_full.txt'), False)[0].reshape(68, 2)
lm_crop = np.loadtxt(os.path.join(work, os.path.splitext(os.path.basename(args.photo))[0] + '_landmarks.txt')).reshape(68, 2)
# crop (256 px) -> photo: a similarity transform from the matching landmarks
M, _ = cv2.estimateAffinePartial2D(lm_crop.astype(np.float32), lm_photo.astype(np.float32), method=cv2.LMEDS)
log(f'crop->photo scale {np.hypot(M[0, 0], M[1, 0]):.2f}')

coeff_path = os.path.join(args.out_dir, 'coeffs.mat')
if not os.path.exists(coeff_path):
    batch = get_data(first_coeff, audio, device)
    made = a2c.generate(batch, args.out_dir, args.pose_style)
    os.replace(made, coeff_path)
log('motion predicted from the voice')

gen = scio.loadmat(coeff_path)['coeff_3dmm']
src_sem = scio.loadmat(first_coeff)['coeff_3dmm'][:1, :70]
gen[:, :64] *= args.expression_scale
gen[:, 64:67] *= args.pose_scale  # head rotation
gen[:, 67:70] *= args.pose_scale  # head shift
if args.still:
    gen[:, 64:] = np.repeat(src_sem[:, 64:], gen.shape[0], axis=0)
total = gen.shape[0]
kept = list(range(0, total, args.step))
log(f'{total} frames, rendering {len(kept)} of them')

src_img = np.array(Image.open(crop_png)).astype(np.float32) / 255.0
src_img = cv2.resize(src_img, (256, 256)).transpose(2, 0, 1)
source_image = torch.FloatTensor(src_img).unsqueeze(0)
source_sem = torch.FloatTensor(transform_semantic_1(src_sem, 13)).unsqueeze(0)

# ---------- 4) face mask on the photo ----------
h, w = photo_bgr.shape[:2]
pts = lm_photo.astype(np.float32).copy()
chin, brow_top = pts[8], pts[17:27].mean(0)
up = (brow_top - chin) / (np.linalg.norm(brow_top - chin) + 1e-6)
forehead = pts[17:27] + up * np.linalg.norm(brow_top - chin) * 0.28
hull = cv2.convexHull(np.vstack([pts[0:17], forehead]).astype(np.int32))
mask = np.zeros((h, w), np.float32)
cv2.fillConvexPoly(mask, hull, 1.0)
size = max(3, int(np.linalg.norm(pts[0] - pts[16]) * 0.06) | 1)
mask = cv2.erode(mask, np.ones((size, size), np.uint8))
mask = cv2.GaussianBlur(mask, (0, 0), np.linalg.norm(pts[0] - pts[16]) * 0.05)[..., None]
# the output frame: a square around the face, as in the still-photo animator (face in the upper half)
fw = float(lm_photo[:, 0].max() - lm_photo[:, 0].min())
side = int(min(fw * 3.0, w, h))
cx, cy = (lm_photo[:, 0].max() + lm_photo[:, 0].min()) / 2, (lm_photo[:, 1].max() + lm_photo[:, 1].min()) / 2
fx0 = int(min(max(cx - side / 2, 0), w - side))
fy0 = int(min(max(cy - side * 0.38, 0), h - side))
lab_photo = cv2.cvtColor(photo_bgr, cv2.COLOR_BGR2LAB).astype(np.float32)
sel = mask[..., 0] > 0.9
mu_p, sd_p = lab_photo[sel].mean(0), lab_photo[sel].std(0) + 1e-3


def composite(face256):
    face = (np.clip(face256, 0, 1) * 255).astype(np.uint8)[..., ::-1]
    warped = cv2.warpAffine(face, M, (w, h), flags=cv2.INTER_CUBIC, borderMode=cv2.BORDER_REPLICATE)
    lab = cv2.cvtColor(warped, cv2.COLOR_BGR2LAB).astype(np.float32)
    s = mask[..., 0] > 0.9
    mu, sd = lab[s].mean(0), lab[s].std(0) + 1e-3
    lab = (lab - mu) / sd * sd_p + mu_p
    warped = cv2.cvtColor(np.clip(lab, 0, 255).astype(np.uint8), cv2.COLOR_LAB2BGR).astype(np.float32)
    blur = cv2.GaussianBlur(warped, (0, 0), 1.4)
    warped = np.clip(warped + 0.6 * (warped - blur), 0, 255)  # soften the upscale
    full = (photo_bgr.astype(np.float32) * (1 - mask) + warped * mask).astype(np.uint8)
    framed = full[fy0:fy0 + side, fx0:fx0 + side]
    return cv2.resize(framed, (args.size, args.size), interpolation=cv2.INTER_AREA if side > args.size else cv2.INTER_CUBIC)


# ---------- 5) render in chunks (resumable) ----------
frames_dir = os.path.join(args.out_dir, 'frames')
os.makedirs(frames_dir, exist_ok=True)
for c0 in range(0, len(kept), args.chunk):
    marker = os.path.join(frames_dir, f'chunk-{c0:05d}.done')
    if os.path.exists(marker):
        continue
    idx = kept[c0:c0 + args.chunk]
    sem = np.stack([transform_semantic_target(gen, i, 13) for i in idx])[None]  # 1, frames, 70, 27
    zeros = torch.zeros(1, len(idx))
    out = make_animation(source_image, source_sem, torch.FloatTensor(sem), animator.generator,
                         animator.kp_extractor, animator.mapping, zeros, zeros, zeros, use_exp=True)
    for k, i in enumerate(idx):
        face = out[0, k].numpy().transpose(1, 2, 0)
        cv2.imwrite(os.path.join(frames_dir, f'r{i:06d}.png'), composite(face))
    open(marker, 'w').write('ok')
    log(f'rendered {min(c0 + args.chunk, len(kept))}/{len(kept)}')

# ---------- 6) blend the in-between frames, encode with the speech ----------
final_dir = os.path.join(args.out_dir, 'final')
os.makedirs(final_dir, exist_ok=True)
read = lambda i: cv2.imread(os.path.join(frames_dir, f'r{i:06d}.png')).astype(np.float32)  # noqa: E731
for i in range(total):
    if i % args.step == 0:
        img = cv2.imread(os.path.join(frames_dir, f'r{i:06d}.png'))
    else:
        a = (i // args.step) * args.step
        b = min(a + args.step, kept[-1])
        t = (i - a) / (b - a) if b > a else 0
        img = (read(a) * (1 - t) + read(b) * t).astype(np.uint8)
    cv2.imwrite(os.path.join(final_dir, f'{i:06d}.png'), img)
out_mp4 = os.path.join(args.out_dir, 'neural.mp4')
ff(['-framerate', str(FPS), '-i', os.path.join(final_dir, '%06d.png'), '-i', audio, '-c:v', 'libx264', '-crf', '18',
    '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '128k', '-shortest', out_mp4])
log(f'done: {out_mp4}')
