#!/usr/bin/env bash
# Sets up the two neural models of the talking portrait, on this machine, CPU only, no account or key:
#   --face   SadTalker (MIT): head, blinks and expressions from the voice  -> .avatar-models/sadtalker
#   --voice  Chatterbox Multilingual (MIT): reads the script in a cloned voice -> .avatar-models/chatterbox
# The weights come from public Docker Hub images that have them baked in (huggingface.co and github.com are
# often blocked); each download is checked against a pinned sha256. Python comes from conda-forge through
# micromamba, because the CPU build of PyTorch is not on PyPI. About 12 GB of disk in all.
set -euo pipefail
cd "$(dirname "$0")/../.."
ROOT="$PWD"
MODELS="$ROOT/.avatar-models"
MM="$ROOT/.avatar-models/micromamba"
export MAMBA_ROOT_PREFIX="$MODELS/conda"
want_face=0; want_voice=0
for a in "$@"; do case "$a" in --face) want_face=1;; --voice) want_voice=1;; esac; done
if [ $((want_face + want_voice)) -eq 0 ]; then echo "usage: neural-setup.sh [--face] [--voice]"; exit 1; fi
mkdir -p "$MODELS"

if [ ! -x "$MM" ]; then
  echo "downloading micromamba (conda-forge)..."
  url="$(python3 - <<'PY'
import json, urllib.request
d = json.load(urllib.request.urlopen('https://api.anaconda.org/package/conda-forge/micromamba/files', timeout=60))
f = max((x for x in d if x['attrs'].get('subdir') == 'linux-64' and x['basename'].endswith('.tar.bz2')), key=lambda x: x['upload_time'])
print('https:' + f['download_url'] if f['download_url'].startswith('//') else f['download_url'])
PY
)"
  tmp="$(mktemp -d)"; curl -sSL --fail --proto '=https' -o "$tmp/mm.tar.bz2" "$url"
  tar -xjf "$tmp/mm.tar.bz2" -C "$tmp" bin/micromamba && mv "$tmp/bin/micromamba" "$MM"; rm -rf "$tmp"
fi

if [ "$want_face" -eq 1 ] && [ ! -f "$MODELS/sadtalker/checkpoints/epoch_20.pth" ]; then
  echo "SadTalker environment..."
  "$MM" create -y -n sad -c conda-forge python=3.10 pytorch-cpu torchvision "numpy<2" ffmpeg dlib >/dev/null
  "$MM" run -n sad pip install -q --no-cache-dir "numpy<2" face_alignment==1.3.5 imageio imageio-ffmpeg librosa numba \
    resampy pydub scipy kornia tqdm yacs pyyaml joblib scikit-image safetensors opencv-python-headless av
  echo "SadTalker code and weights (4 GB)..."
  # layer 11 of wawa9000/sadtalker: the code; layer 16: the checkpoints
  python3 scripts/avatar-local/fetch_layer.py wawa9000/sadtalker \
    sha256:e077eef10f1b53e622434c07644436596d5eff9fe3bb3a9dd7e19cb17ab3f886 "$MODELS/sadtalker" --only app/SadTalker/ --strip 2
  python3 scripts/avatar-local/fetch_layer.py wawa9000/sadtalker \
    sha256:7a2c4fc8acc0151eb48858838d56d6c2e37f4aff2d67edbb7c704bf1c73ba9b5 "$MODELS/sadtalker" --only app/SadTalker/checkpoints/ --strip 2
  # The model code is from 2023: three small fixes for current libraries.
  python3 - "$MODELS/sadtalker" <<'PY'
import pathlib, sys
root = pathlib.Path(sys.argv[1])
def sub(rel, old, new):
    p = root / rel
    s = p.read_text()
    if old in s:
        p.write_text(s.replace(old, new))
sub('src/utils/audio.py', 'librosa.filters.mel(hp.sample_rate, hp.n_fft,', 'librosa.filters.mel(sr=hp.sample_rate, n_fft=hp.n_fft,')
sub('src/face3d/util/preprocess.py', 'np.array([w0, h0, s, t[0], t[1]])',
    'np.array([w0, h0, float(np.squeeze(s)), float(np.squeeze(t[0])), float(np.squeeze(t[1]))])')
sub('src/facerender/animate.py', 'from src.utils.face_enhancer import enhancer as face_enhancer',
    'try:\n    from src.utils.face_enhancer import enhancer as face_enhancer\nexcept ImportError:  # optional GFPGAN enhancer not installed\n    face_enhancer = None')
PY
  echo "face model ready: $MODELS/sadtalker"
fi

if [ "$want_voice" -eq 1 ] && [ ! -f "$MODELS/chatterbox/t3_mtl23ls_v2.safetensors" ]; then
  echo "Chatterbox environment..."
  "$MM" create -y -n voice -c conda-forge python=3.11 pytorch-cpu torchaudio "numpy<2.3" ffmpeg >/dev/null
  "$MM" run -n voice pip install -q --no-cache-dir chatterbox-tts==0.1.7 librosa
  echo "Chatterbox weights (3 GB)..."
  # the layer of barkint/chatterbox-multilingual that holds the Hugging Face cache of ResembleAI/chatterbox
  python3 scripts/avatar-local/fetch_layer.py barkint/chatterbox-multilingual \
    sha256:3e055aa275af09e10dfac3c2634553684588eada901f730eaabf36c28caf27dc "$MODELS/chatterbox-cache" \
    --only root/.cache/huggingface/hub/models--ResembleAI--chatterbox/snapshots/ --strip 0
  snap="$(find "$MODELS/chatterbox-cache" -type d -path '*snapshots/*' -prune | head -1)"
  mkdir -p "$MODELS/chatterbox" && cp -r "$snap"/. "$MODELS/chatterbox/" && rm -rf "$MODELS/chatterbox-cache"
  echo "voice model ready: $MODELS/chatterbox"
fi
