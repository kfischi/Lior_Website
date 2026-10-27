"""Reads a script aloud in a cloned voice, offline, on CPU (Chatterbox Multilingual, MIT).

  voice.py --model <dir with t3_mtl23ls_v2.safetensors, s3gen.pt, ve.pt, conds.pt, grapheme_mtl_merged_expanded_v1.json>
           --ref <10+ seconds of the person's own voice> --script content/avatar/script-pointed.json --out <dir>

Writes <out>/01.wav, 02.wav ... which `npm run avatar -- --tts recorded --lines-dir <out>` turns into the video.
The model reads Hebrew well only with niqqud (vowel marks), so the script file must be pointed.
Only for a voice the speaker has agreed to have cloned. About 13x slower than real time on 4 CPU cores.
"""
import argparse, json, os, re, sys

os.environ.setdefault("HF_HUB_OFFLINE", "1")  # everything is local; avoids retries against blocked hosts

ap = argparse.ArgumentParser()
ap.add_argument("--model", required=True)
ap.add_argument("--ref", required=True)
ap.add_argument("--script", required=True)
ap.add_argument("--out", required=True)
ap.add_argument("--only", help="comma-separated line numbers, 1-based")
ap.add_argument("--seed", type=int, default=7)
ap.add_argument("--cfg", type=float, default=0.5, help="lower (0.3) follows the reference voice less and the text more")
args = ap.parse_args()

import torch, torchaudio as ta
import chatterbox.models.tokenizers.tokenizer as tk
from chatterbox.mtl_tts import ChatterboxMultilingualTTS

# The automatic pointing tool is not installable offline; the script is pointed by hand.
tk.add_hebrew_diacritics = lambda text: text

lines = json.load(open(args.script, encoding="utf-8"))["lines"]
wanted = {int(n) for n in args.only.split(",")} if args.only else set(range(1, len(lines) + 1))
os.makedirs(args.out, exist_ok=True)
model = ChatterboxMultilingualTTS.from_local(args.model, "cpu")
gap = torch.zeros(1, int(model.sr * 0.28))

for n, line in enumerate(lines, 1):
    if n not in wanted:
        continue
    parts = [p.strip() for p in re.split(r"(?<=[.?!])\s+", line) if p.strip()]
    pieces = []
    for p in parts:
        torch.manual_seed(args.seed + n)
        pieces += [model.generate(p, language_id="he", audio_prompt_path=args.ref, cfg_weight=args.cfg).cpu(), gap]
    wav = torch.cat(pieces[:-1], dim=-1)
    ta.save(os.path.join(args.out, f"{n:02d}.wav"), wav, model.sr)
    print(f"line {n}: {wav.shape[-1] / model.sr:.1f}s", flush=True)
print("done", flush=True)
