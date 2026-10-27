"""
Hebrew (or any language) speech to text on this machine, with word times.

    python transcribe.py voice.opus --out words.json [--language he] [--model-dir .avatar-models/whisper-small]

Uses faster-whisper with a Whisper "small" model that `npm run avatar:setup -- --asr` assembles from npm
packages (no Hugging Face needed). Whisper small is decent, not perfect, on Hebrew: always have a person
read the result against the recording and correct it.
"""
from __future__ import annotations

import argparse
import json
import subprocess
import sys

import numpy as np
from faster_whisper import WhisperModel


def load_audio(path: str, rate: int = 16000) -> np.ndarray:
    raw = subprocess.run(
        ["ffmpeg", "-v", "error", "-i", path, "-vn", "-ac", "1", "-ar", str(rate), "-f", "f32le", "-"],
        check=True, capture_output=True,
    ).stdout
    return np.frombuffer(raw, dtype=np.float32)


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("audio")
    ap.add_argument("--out", required=True)
    ap.add_argument("--language", default="he")
    ap.add_argument("--model-dir", default=".avatar-models/whisper-small")
    args = ap.parse_args()

    try:
        model = WhisperModel(args.model_dir, device="cpu", compute_type="int8", cpu_threads=4)
    except Exception as exc:  # noqa: BLE001
        sys.exit(f"Cannot load the speech model from {args.model_dir}: {exc}\nRun: npm run avatar:setup -- --asr")
    segments, info = model.transcribe(
        load_audio(args.audio), language=args.language, beam_size=5, condition_on_previous_text=False,
        word_timestamps=True,
    )
    words, segs = [], []
    for s in segments:
        segs.append({"start": round(s.start, 2), "end": round(s.end, 2), "text": s.text.strip()})
        for w in s.words or []:
            words.append({"start": round(w.start, 2), "end": round(w.end, 2), "word": w.word.strip()})
    with open(args.out, "w", encoding="utf-8") as f:
        json.dump({"language": info.language, "duration": round(info.duration, 2), "segments": segs, "words": words},
                  f, ensure_ascii=False, indent=2)
    print(" ".join(s["text"] for s in segs))


if __name__ == "__main__":
    main()
