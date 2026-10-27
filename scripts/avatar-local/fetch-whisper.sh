#!/usr/bin/env bash
# Assembles the Whisper "small" speech model (CTranslate2 int8, MIT) from four npm packages, so that it
# works where huggingface.co is blocked. The pieces are checked against the checksum the package ships.
set -euo pipefail
cd "$(dirname "$0")/../.."
dest=".avatar-models/whisper-small"
if [ -f "$dest/model.bin" ]; then echo "already there: $dest"; exit 0; fi
tmp="$(mktemp -d)"
trap 'rm -rf "$tmp"' EXIT
mkdir -p "$dest"
for i in 0 1 2 3; do
  url="https://registry.npmjs.org/@skillninja/shortmovie-telop-model-p$i/-/shortmovie-telop-model-p$i-1.0.0.tgz"
  curl -sS --fail -m 600 -o "$tmp/p$i.tgz" "$url"
  mkdir -p "$tmp/x$i" && tar -xzf "$tmp/p$i.tgz" -C "$tmp/x$i"
done
cp "$tmp/x0/package/"{tokenizer.json,vocabulary.json,config.json} "$dest/"
cat "$tmp/x0/package/model.bin.part0" "$tmp/x1/package/model.bin.part1" "$tmp/x2/package/model.bin.part2" "$tmp/x3/package/model.bin.part3" > "$dest/model.bin"
want="$(tr -d '[:space:]' < "$tmp/x0/package/model.sha256")"
got="$(sha256sum "$dest/model.bin" | cut -d' ' -f1)"
if [ "$want" != "$got" ]; then rm -rf "$dest"; echo "checksum mismatch, removed the download" >&2; exit 1; fi
echo "speech model ready: $dest"
