/**
 * What can this machine do for the avatar? Run: npm run avatar:doctor
 *
 * Checks the tools, the compute and the network the avatar skills need, and says in plain words what
 * is missing. Nothing is installed or sent anywhere; it only reads and makes a few HEAD requests.
 */
import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import os from 'node:os';

const ok = (s: string) => console.log(`  [ok]      ${s}`);
const no = (s: string) => console.log(`  [missing] ${s}`);
const note = (s: string) => console.log(`  [note]    ${s}`);

function has(cmd: string, args: string[] = ['-version']): boolean {
  const r = spawnSync(cmd, args, { encoding: 'utf8' });
  return !r.error && r.status === 0;
}

/** Uses curl so it follows the same proxy settings as the shell. 403 and 407 mean a network policy blocked it. */
async function reach(url: string): Promise<boolean> {
  const r = spawnSync('curl', ['-sS', '-m', '8', '-o', '/dev/null', '-w', '%{http_code}', url], { encoding: 'utf8' });
  const code = Number(r.stdout.trim());
  return r.status === 0 && code > 0 && code < 500 && code !== 403 && code !== 407;
}

async function main() {
  console.log('\nTools');
  has('ffmpeg') ? ok('ffmpeg') : no('ffmpeg (needed for every route)');
  has('python3', ['--version']) ? ok('python3') : no('python3 (needed for the local animator)');
  existsSync(join(process.cwd(), '.avatar-venv/bin/python'))
    ? ok('animator environment (.avatar-venv)')
    : no('animator environment: run "npm run avatar:setup" (about 40 s)');

  console.log('\nCompute');
  const gpu = has('nvidia-smi', ['-L']);
  gpu ? ok('NVIDIA GPU') : note(`no NVIDIA GPU found (${os.cpus().length} CPU cores, ${(os.totalmem() / 2 ** 30).toFixed(0)} GB RAM). Photoreal lip-sync models need a GPU, or are very slow on a CPU.`);
  if (process.platform === 'darwin' && os.arch() === 'arm64') note('Apple silicon: several open models can use it, more slowly than a GPU.');

  console.log('\nNetwork (what the open-source model route would download from)');
  const hosts: [string, string, string][] = [
    ['https://pypi.org/simple/', 'Python packages', 'needed by the local animator'],
    ['https://huggingface.co/ResembleAI/chatterbox', 'huggingface.co', 'model weights for voice cloning and neural lip-sync'],
    ['https://github.com/resemble-ai/chatterbox', 'github.com', 'model code and release files'],
    ['https://download.pytorch.org/whl/cpu/', 'download.pytorch.org', 'smaller CPU builds of PyTorch'],
    ['https://api.elevenlabs.io/', 'api.elevenlabs.io', 'paid voice service (optional route)'],
    ['https://queue.fal.run/', 'queue.fal.run', 'paid talking-video service (optional route)'],
  ];
  const results = await Promise.all(hosts.map(async ([url, name, why]) => [name, why, await reach(url)] as const));
  for (const [name, why, up] of results) (up ? ok : no)(`${name}: ${why}`);

  console.log('\nWhat this means');
  const hf = results.find((r) => r[0] === 'huggingface.co')?.[2];
  if (!hf) note('Voice cloning and neural lip-sync need huggingface.co (and github.com). In Claude Code on the web: the environment menu, then Edit, then Network access: allow those domains, and start a new session.');
  if (!gpu) note('Without a GPU, expect slow runs and lower quality; running Claude Code on your own computer with a GPU removes the limit.');
  console.log('');
}

main();
