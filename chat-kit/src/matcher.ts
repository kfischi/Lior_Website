import type { KnowledgeEntry } from './types';

/** Hebrew nikud, cantillation and the geresh/quote marks that vary between keyboards. */
const MARKS = /[֑-ׇ'׳’`"״“”]/g;
/** One-letter prefixes (and, the, in, like, to, from, that) that stick to Hebrew words. */
const PREFIXES = /^[והבכלמש]{1,2}(?=.{3,})/;

export function normalize(text: string): string {
  return text.replace(MARKS, '').replace(/[^\p{L}\p{N}\s]/gu, ' ').replace(/\s+/g, ' ').trim().toLowerCase();
}

/** Words of a text, each also without its Hebrew prefix, so "בגירושין" finds "גירושין". */
export function tokens(text: string): string[] {
  const out = new Set<string>();
  for (const word of normalize(text).split(' ')) {
    if (!word) continue;
    out.add(word);
    const bare = word.replace(PREFIXES, '');
    if (bare !== word) out.add(bare);
  }
  return [...out];
}

export type Match = { entry: KnowledgeEntry; score: number };

/**
 * Picks the topic whose keywords best fit the message. A phrase from `keywords` that appears whole in the message
 * counts more than a single shared word. Returns null when nothing is convincing, so the assistant says so
 * instead of guessing.
 */
export function findAnswer(message: string, knowledge: KnowledgeEntry[], minScore = 2): Match | null {
  const text = normalize(message);
  if (!text) return null;
  const words = new Set(tokens(message));
  let best: Match | null = null;
  for (const entry of knowledge) {
    let score = 0;
    for (const keyword of entry.keywords) {
      const phrase = normalize(keyword);
      if (!phrase) continue;
      if (phrase.includes(' ')) {
        if (text.includes(phrase)) score += 3;
        continue;
      }
      const forms = tokens(keyword);
      if (forms.some((form) => words.has(form))) score += 2;
    }
    if (normalize(entry.question) === text) score += 10;
    if (score >= minScore && (!best || score > best.score)) best = { entry, score };
  }
  return best;
}

export function isUrgent(message: string, keywords: string[] | undefined): boolean {
  if (!keywords?.length) return false;
  const text = normalize(message);
  return keywords.some((keyword) => text.includes(normalize(keyword)));
}
