/**
 * Copies the offline text-reading engine (Tesseract: worker, WebAssembly cores, Hebrew model) from node_modules
 * into public/ocr (Hebrew and English models: dates and numbers read better with both), so reading a letter in the chat runs in the visitor's browser and loads nothing from another
 * site. Runs before dev and build. The copies are not committed (see .gitignore).
 */
import { cpSync, existsSync, mkdirSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const out = join(root, 'public', 'ocr');
mkdirSync(join(out, 'lang'), { recursive: true });

const lib = join(root, 'node_modules', 'tesseract.js', 'dist', 'worker.min.js');
const core = join(root, 'node_modules', 'tesseract.js-core');
const langs = ['heb', 'eng'].map((l) => [l, join(root, 'node_modules', '@tesseract.js-data', l, '4.0.0_best_int', `${l}.traineddata.gz`)]);

if (!existsSync(lib) || !existsSync(core) || langs.some(([, f]) => !existsSync(f))) {
  console.warn('OCR assets not found in node_modules; the document reader will be unavailable.');
  process.exit(0);
}

cpSync(lib, join(out, 'worker.min.js'));
for (const file of readdirSync(core)) {
  // Only the LSTM cores: the Hebrew model is an LSTM model.
  if (/^tesseract-core.*lstm\.(?:wasm|wasm\.js)$/.test(file)) cpSync(join(core, file), join(out, file));
}
for (const [name, file] of langs) cpSync(file, join(out, 'lang', `${name}.traineddata.gz`)); // Hebrew text, plus Latin digits and dates
console.log('OCR assets ready in public/ocr');
