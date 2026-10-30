#!/usr/bin/env bash
# Assembles the Whisper "small" speech model (CTranslate2 int8, MIT) from four npm packages, so that it
# works where huggingface.co is blocked. The assembled file is checked against a checksum pinned in this script.
set -euo pipefail
cd "$(dirname "$0")/../.."
dest=".avatar-models/whisper-small"
if [ -f "$dest/model.bin" ]; then echo "already there: $dest"; exit 0; fi
tmp="$(mktemp -d)"
trap 'rm -rf "$tmp"' EXIT
mkdir -p "$dest"
for i in 0 1 2 3; do
  url="https://registry.npmjs.org/@skillninja/shortmovie-telop-model-p$i/-/shortmovie-telop-model-p$i-1.0.0.tgz"
  curl -sS --fail --proto '=https' --tlsv1.2 -m 600 -o "$tmp/p$i.tgz" "$url"
  mkdir -p "$tmp/x$i" && tar -xzf "$tmp/p$i.tgz" --no-same-owner -C "$tmp/x$i"
done
for f in tokenizer.json vocabulary.json config.json; do
  if [ -L "$tmp/x0/package/$f" ]; then echo "unexpected symlink in the package: $f" >&2; exit 1; fi
  cp "$tmp/x0/package/$f" "$dest/"
done
cat "$tmp/x0/package/model.bin.part0" "$tmp/x1/package/model.bin.part1" "$tmp/x2/package/model.bin.part2" "$tmp/x3/package/model.bin.part3" > "$dest/model.bin"
# Pinned here (and in git), so a changed upload from the package author cannot slip through.
want="ca732cb1379efc49417d028465f543d83a39de2c61f3027678de103dc404ce73"
got="$(sha256sum "$dest/model.bin" | cut -d' ' -f1)"
if [ "$want" != "$got" ]; then rm -rf "$dest"; echo "checksum mismatch, removed the download" >&2; exit 1; fi
echo "speech model ready: $dest"
