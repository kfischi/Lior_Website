"""Downloads one layer of a public Docker Hub image and unpacks only the files you want.

Used to get model weights where huggingface.co and github.com are blocked but Docker Hub is open: a few
public images were built with the weights inside. The layer is addressed by its sha256, so what arrives is
exactly what was pinned (the download is checked against it), and no image manifest request (rate limited) is needed.

  fetch_layer.py <repo> <sha256:digest> <dest-dir> [--only <path-prefix> ...] [--strip <n>]
"""
import argparse
import hashlib
import json
import os
import sys
import tarfile
import tempfile
import urllib.request

ap = argparse.ArgumentParser()
ap.add_argument('repo')
ap.add_argument('digest')
ap.add_argument('dest')
ap.add_argument('--only', nargs='*', default=[], help='unpack only members whose path starts with one of these')
ap.add_argument('--strip', type=int, default=0, help='drop this many leading path parts')
args = ap.parse_args()

token = json.load(urllib.request.urlopen(
    f'https://auth.docker.io/token?service=registry.docker.io&scope=repository:{args.repo}:pull', timeout=60))['token']
req = urllib.request.Request(f'https://registry-1.docker.io/v2/{args.repo}/blobs/{args.digest}',
                             headers={'Authorization': f'Bearer {token}'})
sha = hashlib.sha256()
with tempfile.NamedTemporaryFile(suffix='.tgz', delete=False) as tmp:
    with urllib.request.urlopen(req, timeout=120) as res:
        while chunk := res.read(1 << 20):
            tmp.write(chunk)
            sha.update(chunk)
want = args.digest.split(':', 1)[1]
if sha.hexdigest() != want:
    os.unlink(tmp.name)
    sys.exit(f'checksum mismatch: got {sha.hexdigest()}, expected {want}')

os.makedirs(args.dest, exist_ok=True)
dest = os.path.realpath(args.dest)
count = 0
with tarfile.open(tmp.name) as tar:
    for member in tar:
        name = member.name.lstrip('./')
        if args.only and not any(name.startswith(p) for p in args.only):
            continue
        parts = name.split('/')[args.strip:]
        if not parts or not member.isfile():  # plain files only: no links or devices from a downloaded archive
            continue
        target = os.path.realpath(os.path.join(dest, *parts))
        if not target.startswith(dest + os.sep):
            continue
        os.makedirs(os.path.dirname(target), exist_ok=True)
        with tar.extractfile(member) as src, open(target, 'wb') as out:
            while chunk := src.read(1 << 20):
                out.write(chunk)
        count += 1
os.unlink(tmp.name)
print(f'{count} files unpacked to {args.dest}')
