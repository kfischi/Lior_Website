#!/usr/bin/env bash
# One-time setup for `npm run avatar -- --provider local`: a Python virtual environment with
# MediaPipe (its face mesh model is inside the package), OpenCV and SciPy. No account or key.
set -euo pipefail
cd "$(dirname "$0")/../.."
python3 -m venv .avatar-venv
.avatar-venv/bin/pip install --quiet --upgrade pip
.avatar-venv/bin/pip install --quiet -r scripts/avatar-local/requirements.txt
.avatar-venv/bin/python -c "import cv2, mediapipe, numpy, scipy; print('ready: mediapipe', mediapipe.__version__)"
