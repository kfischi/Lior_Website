"""
Animate a still photo of a face so it speaks a recording, entirely on this machine.

No account, key or neural model of someone else's face is involved: face landmarks come from
MediaPipe's bundled mesh, and the motion is classic 2D animation driven by the audio's loudness
and brightness (mouth opening and width), with blinks, small head movement and breathing.

    python puppet.py --photo face.png --audio voice.wav --out clip.mp4 [--size 720] [--fps 25]

It is a stylised "living portrait", not a photoreal AI video: it looks good at the size of the
chat window, and obviously synthetic when blown up. See .claude/skills/talking-avatar.
"""
from __future__ import annotations

import argparse
import math
import subprocess
import sys

import cv2
import mediapipe as mp
import numpy as np
from scipy.interpolate import RBFInterpolator
from scipy.linalg import solve_toeplitz

# ---------- MediaPipe face-mesh index sets ----------
INNER_LIPS = [78, 95, 88, 178, 87, 14, 317, 402, 318, 324, 308, 415, 310, 311, 312, 13, 82, 81, 80, 191]
LOWER_INNER = [78, 95, 88, 178, 87, 14, 317, 402, 318, 324, 308]
UPPER_INNER = [308, 415, 310, 311, 312, 13, 82, 81, 80, 191, 78]
OUTER_LOWER = [61, 146, 91, 181, 84, 17, 314, 405, 321, 375, 291]
OUTER_UPPER = [61, 185, 40, 39, 37, 0, 267, 269, 270, 409, 291]
CORNERS = [61, 291, 78, 308]
JAW = [152, 148, 176, 149, 150, 377, 400, 378, 379, 175, 199, 200, 428, 208, 171, 396, 140, 369]
FACE_OVAL = [10, 338, 297, 332, 284, 251, 389, 356, 454, 323, 361, 288, 397, 365, 379, 378, 400, 377, 152,
             148, 176, 149, 150, 136, 172, 58, 132, 93, 234, 127, 162, 21, 54, 103, 67, 109]
R_UP, R_LO = [246, 161, 160, 159, 158, 157, 173], [7, 163, 144, 145, 153, 154, 155]
L_UP, L_LO = [466, 388, 387, 386, 385, 384, 398], [249, 390, 373, 374, 380, 381, 382]
BROWS = [70, 63, 105, 66, 107, 336, 296, 334, 293, 300]
IRIS = [468, 469, 470, 471, 472, 473, 474, 475, 476, 477]
ANCHORS = [1, 4, 5, 6, 168, 197, 195, 33, 133, 263, 362, 129, 358, 98, 327]


def read_audio(path: str, rate: int = 16000) -> np.ndarray:
    raw = subprocess.run(
        ["ffmpeg", "-v", "error", "-i", path, "-ac", "1", "-ar", str(rate), "-f", "f32le", "-"],
        check=True, capture_output=True,
    ).stdout
    return np.frombuffer(raw, dtype=np.float32)


def speech_curves(audio: np.ndarray, fps: int, rate: int = 16000):
    """Per video frame: mouth opening, vowel openness, lip rounding, lip spread and emphasis, each 0..1."""
    hop, win = rate // fps, 1024
    n = max(1, int(len(audio) / hop))
    rms = np.zeros(n)
    cen = np.zeros(n)
    window = np.hanning(win)
    freqs = np.fft.rfftfreq(win, 1 / rate)
    for i in range(n):
        seg = audio[i * hop : i * hop + win]
        if len(seg) < win:
            seg = np.pad(seg, (0, win - len(seg)))
        rms[i] = math.sqrt(float(np.mean(seg**2)) + 1e-12)
        spec = np.abs(np.fft.rfft(seg * window))
        cen[i] = float((freqs * spec).sum() / (spec.sum() + 1e-9))
    db = 20 * np.log10(rms + 1e-9)
    floor, top = np.percentile(db, 12), np.percentile(db, 96)
    raw = np.clip((db - (floor + 4)) / max(6.0, top - floor - 4), 0, 1)
    # Fast attack, slower release: it reads as syllables, not jitter.
    out = np.zeros(n)
    for i in range(n):
        prev = out[i - 1] if i else 0.0
        out[i] = prev + (raw[i] - prev) * (0.75 if raw[i] > prev else 0.35)
    opening = np.clip(out**0.8 * 1.05, 0, 1)

    # Vowel colour from the first two formants (LPC): a low second formant is a rounded "o/u" (lips
    # pushed together), a high one a spread "i/e" (corners out), a high first formant an open "a".
    f1 = np.full(n, 550.0)
    f2 = np.full(n, 1500.0)
    win_f = int(0.032 * rate)
    for i in range(n):
        if opening[i] < 0.2:
            continue
        c = i * hop + hop // 2
        seg = audio[max(0, c - win_f // 2) : c + win_f // 2]
        if len(seg) < win_f:
            continue
        got = formants(seg, rate)
        if got:
            f1[i], f2[i] = got
    for arr in (f1, f2):  # hold through silence, then smooth
        for i in range(1, n):
            if opening[i] < 0.2:
                arr[i] = arr[i - 1]
        arr[:] = np.convolve(np.pad(arr, 2, mode="edge"), np.ones(5) / 5, mode="valid")
    open_scale = np.clip((f1 - 350) / 450, 0, 1)
    rounded = np.clip((1450 - f2) / 600, 0, 1) * np.clip(opening * 1.6, 0, 1)
    spread = np.clip((f2 - 1750) / 550, 0, 1) * np.clip(opening * 1.6, 0, 1)
    emph = np.clip(np.maximum(0, np.gradient(opening)) * 4, 0, 1)
    emph = np.convolve(emph, np.ones(5) / 5, mode="same")
    return opening, open_scale, rounded, spread, emph


def formants(seg: np.ndarray, rate: int):
    """First two formants of a short voiced frame by linear prediction, or None."""
    x = np.append(seg[0], seg[1:] - 0.97 * seg[:-1]) * np.hamming(len(seg))
    order = 12
    r = np.correlate(x, x, mode="full")[len(x) - 1 : len(x) + order]
    if r[0] < 1e-9:
        return None
    try:
        a = solve_toeplitz(r[:order], r[1 : order + 1])
    except Exception:  # singular frame
        return None
    roots = np.roots(np.concatenate(([1.0], -a)))
    roots = roots[np.imag(roots) > 0.01]
    freqs = np.angle(roots) * rate / (2 * np.pi)
    bw = -0.5 * rate / (2 * np.pi) * np.log(np.abs(roots)) * 2
    good = sorted(f for f, b in zip(freqs, bw) if 250 < f < 3200 and b < 400)
    return (good[0], good[1]) if len(good) >= 2 else None


def detect(img_bgr: np.ndarray) -> np.ndarray:
    fm = mp.solutions.face_mesh.FaceMesh(static_image_mode=True, refine_landmarks=True, max_num_faces=1)
    res = fm.process(cv2.cvtColor(img_bgr, cv2.COLOR_BGR2RGB))
    if not res.multi_face_landmarks:
        sys.exit("No face found in the photo. Use a sharp, front-facing photo.")
    h, w = img_bgr.shape[:2]
    return np.array([[p.x * w, p.y * h] for p in res.multi_face_landmarks[0].landmark], dtype=np.float64)


def crop_square(img: np.ndarray, pts: np.ndarray, size: int):
    """A square around the face, kept inside the photo (no invented borders), face in the upper half."""
    ih, iw = img.shape[:2]
    fw = pts[:, 0].max() - pts[:, 0].min()
    side = min(fw * 3.0, iw, ih)
    cx = (pts[:, 0].max() + pts[:, 0].min()) / 2
    cy = (pts[:, 1].max() + pts[:, 1].min()) / 2
    x0 = min(max(cx - side / 2, 0), iw - side)
    y0 = min(max(cy - side * 0.38, 0), ih - side)
    scale = size / side
    m = np.array([[scale, 0, -x0 * scale], [0, scale, -y0 * scale]], dtype=np.float64)
    out = cv2.warpAffine(img, m, (size, size), flags=cv2.INTER_AREA if scale < 1 else cv2.INTER_CUBIC,
                         borderMode=cv2.BORDER_REPLICATE)
    p2 = pts @ m[:, :2].T + m[:, 2]
    return out, p2


def nearest_pairs(base, upper, lower):
    return {u: min(lower, key=lambda l: abs(base[l][0] - base[u][0])) for u in upper}


class Puppet:
    def __init__(self, img: np.ndarray, pts: np.ndarray):
        self.img, self.base = img, pts
        self.size = img.shape[0]
        self.fh = pts[152][1] - pts[10][1]
        self.mw = abs(pts[291][0] - pts[61][0])
        self.pairs = {**nearest_pairs(pts, R_UP, R_LO), **nearest_pairs(pts, L_UP, L_LO)}
        moving = set(INNER_LIPS + OUTER_LOWER + OUTER_UPPER + JAW + R_UP + R_LO + L_UP + L_LO + BROWS + CORNERS + IRIS)
        ring = [p for p in FACE_OVAL if p not in moving]
        # Control points: everything that moves plus anchors that stay put, plus the picture's border.
        s = self.size
        border = [[x, y] for x in np.linspace(0, s, 9) for y in (0, s)] + [[x, y] for y in np.linspace(0, s, 9) for x in (0, s)]
        self.ids = sorted(moving | set(ring) | set(ANCHORS))
        self.src = np.vstack([pts[self.ids], np.array(border)])
        self.index = {i: k for k, i in enumerate(self.ids)}
        gs = 72
        ys, xs = np.mgrid[0:gs, 0:gs]
        self.grid = np.stack([xs.ravel(), ys.ravel()], 1) * (s / (gs - 1))
        self.gs = gs
        self.X, self.Y = np.meshgrid(np.arange(s, dtype=np.float32), np.arange(s, dtype=np.float32))
        self.blink_at = []
        t = 1.6
        rng = np.random.default_rng(7)
        while t < 600:
            self.blink_at.append(t)
            t += rng.uniform(2.4, 5.2)
        # Gaze: stays near the camera, with small quick shifts every second or two.
        self.gaze = []
        t = 0.0
        while t < 600:
            self.gaze.append((t, rng.normal(0, 0.55), rng.normal(0, 0.4)))
            t += rng.uniform(0.9, 2.6)

    def blink(self, t: float) -> float:
        for b in self.blink_at:
            d = t - b
            if 0 <= d < 0.22:
                return math.sin(math.pi * d / 0.22) ** 0.7
            if d < 0:
                break
        return 0.0

    def gaze_at(self, t: float):
        for k in range(len(self.gaze) - 1, -1, -1):
            t0, gx, gy = self.gaze[k]
            if t >= t0:
                prev = self.gaze[k - 1] if k else (0.0, 0.0, 0.0)
                m = min(1.0, (t - t0) / 0.09)
                m = m * m * (3 - 2 * m)
                return prev[1] + (gx - prev[1]) * m, prev[2] + (gy - prev[2]) * m
        return 0.0, 0.0

    def displacement(self, t, opening, open_scale, rounded, spread, emph):
        d = np.zeros((len(self.src), 2))
        k = self.index
        fh, mw = self.fh, self.mw
        o = opening * (0.032 + 0.034 * open_scale) * fh

        def add(i, dx, dy):
            if i in k:
                d[k[i]] += (dx, dy)

        x0, x1 = self.base[61][0], self.base[291][0]

        def along(i):
            """0 at the mouth corners, 1 in the middle: the corners stay put while the centre opens."""
            u = min(1.0, max(0.0, (self.base[i][0] - x0) / (x1 - x0)))
            return math.sin(math.pi * u) ** 0.8

        for i in LOWER_INNER:
            add(i, 0, o * along(i))
        for i in OUTER_LOWER:
            add(i, 0, o * 0.92 * along(i))
        for i in UPPER_INNER + OUTER_UPPER:
            add(i, 0, -o * 0.12 * along(i))
        for i, wgt in zip(JAW, [0.75, 0.7, 0.7, 0.65, 0.55, 0.7, 0.7, 0.65, 0.55, 0.7, 0.6, 0.6, 0.5, 0.35, 0.4, 0.5, 0.35, 0.3]):
            add(i, 0, o * wgt * 0.7)
        for i in CORNERS:
            side = 1 if self.base[i][0] > self.base[1][0] else -1
            add(i, side * (spread * 0.05 - rounded * 0.13) * mw, o * 0.06 - spread * fh * 0.006)
        # Rounded vowels draw all the lip points toward the middle; spread ones pull them out a little.
        cx = self.base[13][0]
        for i in INNER_LIPS + OUTER_LOWER + OUTER_UPPER:
            add(i, -(self.base[i][0] - cx) * (rounded * 0.20 - spread * 0.05), 0)
        gx, gy = self.gaze_at(t)
        for i in IRIS:
            add(i, gx * fh * 0.0075, gy * fh * 0.0055)
        # Blink
        b = self.blink(t)
        for up, lo in self.pairs.items():
            v = self.base[lo] - self.base[up]
            add(up, v[0] * 0.0, v[1] * 0.93 * b)
        for lo in R_LO + L_LO:
            add(lo, 0, -fh * 0.004 * b)
        # Brows lift a little on emphasis, and with the blink's tail
        for i in BROWS:
            add(i, 0, -fh * (0.010 * emph + 0.004 * opening) + fh * 0.004 * b)
        return d

    def head_matrix(self, t, opening, emph):
        s = self.size
        rot = math.radians(0.7 * math.sin(2 * math.pi * 0.19 * t) + 0.4 * math.sin(2 * math.pi * 0.43 * t + 1.1))
        rot += math.radians(0.25 * (opening - 0.4))
        tx = s * 0.0045 * math.sin(2 * math.pi * 0.23 * t + 0.4)
        ty = s * 0.004 * math.sin(2 * math.pi * 0.27 * t) + s * 0.0035 * emph
        sc = 1.0 + 0.004 * math.sin(2 * math.pi * 0.27 * t + 0.6)
        pivot = np.array([s * 0.5, s * 0.82])
        c, sn = math.cos(rot) * sc, math.sin(rot) * sc
        a = np.array([[c, -sn], [sn, c]])
        off = pivot - a @ pivot + (tx, ty)
        return a, off

    def frame(self, t, opening, open_scale, rounded, spread, emph):
        s = self.size
        d = self.displacement(t, opening, open_scale, rounded, spread, emph)
        a, off = self.head_matrix(t, opening, emph)
        a_inv = np.linalg.inv(a)
        # Displacement field on a coarse grid, then smoothly enlarged.
        rbf = RBFInterpolator(self.src, d, kernel="thin_plate_spline", smoothing=6.0)
        field = rbf(self.grid).reshape(self.gs, self.gs, 2).astype(np.float32)
        dx = cv2.resize(field[..., 0], (s, s), interpolation=cv2.INTER_CUBIC)
        dy = cv2.resize(field[..., 1], (s, s), interpolation=cv2.INTER_CUBIC)
        px = a_inv[0, 0] * (self.X - off[0]) + a_inv[0, 1] * (self.Y - off[1])
        py = a_inv[1, 0] * (self.X - off[0]) + a_inv[1, 1] * (self.Y - off[1])
        # The field says where source content goes; find where each output pixel comes from.
        qx, qy = px.astype(np.float32), py.astype(np.float32)
        for _ in range(3):
            ddx = cv2.remap(dx, qx, qy, cv2.INTER_LINEAR, borderMode=cv2.BORDER_REPLICATE)
            ddy = cv2.remap(dy, qx, qy, cv2.INTER_LINEAR, borderMode=cv2.BORDER_REPLICATE)
            qx, qy = (px - ddx).astype(np.float32), (py - ddy).astype(np.float32)
        out = cv2.remap(self.img, qx, qy, cv2.INTER_CUBIC, borderMode=cv2.BORDER_REPLICATE)
        # Mouth interior from the moved inner-lip ring, in final-image coordinates.
        ring = np.array([self.base[i] + d[self.index[i]] for i in INNER_LIPS])
        ring = ring @ a.T + off
        return self.mouth(out, ring, opening)

    def mouth(self, img, ring, opening):
        top = ring[[INNER_LIPS.index(i) for i in (13, 82, 312, 81, 311)]].mean(0)
        bot = ring[[INNER_LIPS.index(i) for i in (14, 87, 317, 178, 402)]].mean(0)
        gap = bot[1] - top[1]
        if gap < 1.5:
            return img
        s = self.size
        poly = ring.astype(np.int32)
        mask = np.zeros((s, s), np.float32)
        cv2.fillPoly(mask, [poly], 1.0)
        mask = cv2.erode(mask, np.ones((3, 3), np.uint8))
        y0, y1 = int(top[1]) - 2, int(bot[1]) + 3
        x0, x1 = int(ring[:, 0].min()) - 2, int(ring[:, 0].max()) + 3
        layer = img.copy().astype(np.float32)
        h = max(1, y1 - y0)
        yy = (np.arange(s, dtype=np.float32)[:, None] - y0) / h
        dark = np.array([34, 22, 70], np.float32)  # BGR, warm dark inside the mouth
        deeper = np.array([20, 12, 40], np.float32)
        base = dark[None, None, :] * (1 - yy[..., None]) + deeper[None, None, :] * yy[..., None]
        layer[:] = np.where(mask[..., None] > 0, np.broadcast_to(base, layer.shape), layer)
        # Upper teeth: a short, inset, softly shaded band under the upper lip.
        if gap > 5:
            tooth_h = min(gap * 0.34, self.fh * 0.032)
            band = np.zeros((s, s), np.float32)
            cv2.fillPoly(band, [poly], 1.0)
            band[: int(top[1]), :] = 0
            band[int(top[1] + tooth_h) :, :] = 0
            inset = (ring[:, 0].max() - ring[:, 0].min()) * 0.14
            band[:, : int(ring[:, 0].min() + inset)] = 0
            band[:, int(ring[:, 0].max() - inset) :] = 0
            band = cv2.GaussianBlur(band * mask, (0, 0), 1.4)
            shade = np.clip((np.arange(s, dtype=np.float32)[:, None] - top[1]) / max(tooth_h, 1.0), 0, 1)[..., None]
            teeth = np.array([228, 236, 241], np.float32) * (1 - shade * 0.18)
            layer = layer * (1 - band[..., None] * 0.78) + teeth * band[..., None] * 0.78
        # Tongue when wide open.
        if gap > 11:
            tongue = np.zeros((s, s), np.float32)
            cx = int(ring[:, 0].mean())
            cv2.ellipse(tongue, (cx, int(bot[1] - gap * 0.22)), (int(self.mw * 0.17), max(2, int(gap * 0.2))), 0, 0, 360, 1.0, -1)
            tongue = cv2.GaussianBlur(tongue * mask, (0, 0), 1.6)
            pink = np.array([100, 90, 190], np.float32)
            layer = layer * (1 - tongue[..., None] * 0.8) + pink * tongue[..., None] * 0.8
        soft = cv2.GaussianBlur(mask, (0, 0), 1.0)[..., None]
        return (img.astype(np.float32) * (1 - soft) + layer * soft).clip(0, 255).astype(np.uint8)


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--photo", required=True)
    ap.add_argument("--audio", required=True)
    ap.add_argument("--out", required=True)
    ap.add_argument("--size", type=int, default=720)
    ap.add_argument("--fps", type=int, default=25)
    ap.add_argument("--start", type=float, default=0.0, help="clock offset in seconds (keeps motion continuous across chunks)")
    args = ap.parse_args()

    img = cv2.imread(args.photo)
    if img is None:
        sys.exit(f"Cannot read {args.photo}")
    pts = detect(img)
    crop, cpts = crop_square(img, pts, args.size)
    puppet = Puppet(crop, cpts)
    audio = read_audio(args.audio)
    opening, open_scale, rounded, spread, emph = speech_curves(audio, args.fps)
    frames = len(opening)

    enc = subprocess.Popen(
        ["ffmpeg", "-v", "error", "-y", "-f", "rawvideo", "-pix_fmt", "bgr24", "-s", f"{args.size}x{args.size}",
         "-r", str(args.fps), "-i", "-", "-i", args.audio, "-map", "0:v", "-map", "1:a", "-c:v", "libx264",
         "-crf", "20", "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "96k", "-shortest", args.out],
        stdin=subprocess.PIPE,
    )
    for i in range(frames):
        t = args.start + i / args.fps
        enc.stdin.write(puppet.frame(t, float(opening[i]), float(open_scale[i]), float(rounded[i]), float(spread[i]), float(emph[i])).tobytes())
    enc.stdin.close()
    if enc.wait() != 0:
        sys.exit("ffmpeg failed")


if __name__ == "__main__":
    main()
