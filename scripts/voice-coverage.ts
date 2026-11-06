/**
 * How much of the chat's most common answers is already recorded in the chosen voice.
 *
 *   npm run voice:coverage
 *
 * Asks the local engine the questions people ask most (the starter questions and the area questions), cuts each answer
 * into sentences and checks them against public/voice/manifest.json. Prints the answers that are fully recorded and,
 * for the rest, the sentences still missing, most useful first. Writes the missing ones to content/voice/missing-popular.json.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { brand } from '../src/lib/brand';
import { localReply } from '../src/lib/ai/local/reply';
import { splitSpoken, spokenKey } from '../src/lib/voice/spoken';

const manifest = JSON.parse(readFileSync('public/voice/manifest.json', 'utf8')) as Record<string, string>;

const questions = [
  ...brand.chat.suggestedPrompts,
  ...brand.practiceAreas.flatMap((area) => area.page.faq.slice(0, 3).map((f) => f.question)),
  'איך קובעים פגישה?',
  'כמה זה עולה?',
  'איפה המשרד?',
  'מה שעות הפעילות?',
  'האם השיחה חסויה?',
  'אפשר בזום?',
  'מה התחומים שלכם?',
  'מי זו ליאור?',
];

async function main() {
const missing = new Map<string, { text: string; answers: number }>();
let full = 0;
const rows: string[] = [];

for (const question of [...new Set(questions)]) {
  const reply = await localReply(question, '');
  const sentences = splitSpoken(reply);
  const lacking = sentences.filter((s) => !manifest[spokenKey(s)]);
  if (lacking.length === 0) full += 1;
  for (const s of lacking) {
    const key = spokenKey(s);
    const entry = missing.get(key) ?? { text: s, answers: 0 };
    entry.answers += 1;
    missing.set(key, entry);
  }
  rows.push(`${lacking.length === 0 ? 'FULL ' : `${sentences.length - lacking.length}/${sentences.length}`}  ${question}`);
}

console.log(rows.join('\n'));
console.log(`\n${full} of ${rows.length} popular answers are fully recorded; ${missing.size} sentences are missing.`);
const ranked = [...missing.entries()].map(([key, v]) => ({ key, ...v })).sort((a, b) => b.answers - a.answers);
writeFileSync('content/voice/missing-popular.json', JSON.stringify(ranked, null, 1) + '\n');
}

void main();
