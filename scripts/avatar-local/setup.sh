#!/usr/bin/env bash
# One-time setup for `npm run avatar -- --provider local`: a Python virtual environment with
# MediaPipe (its face mesh model is inside the package), OpenCV and SciPy. No account or key.
set -euo pipefail
cd "$(dirname "$0")/../.."
python3 -m venv .avatar-venv
.avatar-venv/bin/pip install --quiet --upgrade pip
.avatar-venv/bin/pip install --quiet -r scripts/avatar-local/requirements.txt
.avatar-venv/bin/pip install --quiet --no-deps "mediapipe==0.10.14"
.avatar-venv/bin/python -c "import cv2, mediapipe, numpy, scipy; print('ready: mediapipe', mediapipe.__version__)"

# Optional: speech to text (npm run avatar:setup -- --asr)
if [ "${1:-}" = "--asr" ]; then
  .avatar-venv/bin/pip install --quiet -r scripts/avatar-local/requirements-asr.txt
  bash scripts/avatar-local/fetch-whisper.sh
  .avatar-venv/bin/python -c "import faster_whisper; print('ready: faster-whisper', faster_whisper.__version__)"
fi
