import { brand } from '@/lib/brand';
import { articles } from '@/lib/articles';
import { knowledge } from '@/lib/knowledge';
import { analyze } from './text';

/**
 * The local retrieval engine behind the assistant when no AI key is set (or the
 * model fails). It indexes everything the site says, plus what the attorney
 * taught in /admin, and ranks passages with BM25 over Hebrew stems and concepts.
 * No network, no API, no cost, and it improves every time a note is added.
 */

export type DocKind = 'taught' | 'knowledge' | 'faq' | 'article' | 'area';

export interface Doc {
  id: string;
  kind: DocKind;
  /** What the passage answers; shown as a follow-up chip when it is a question. */
  title: string;
  /** The text returned to the visitor. */
  answer: string;
  /** Site path with more detail, when there is one. */
  link?: string;
  suggestions?: string[];
  followUp?: string;
  boost: number;
  tf: Map<string, number>;
  len: number;
}

export interface Note {
  id: string;
  question: string;
  answer: string;
  enabled: boolean;
}

/** Cut text to about `max` characters at a sentence boundary. */
function brief(text: string, max = 420): string {
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  const end = Math.max(cut.lastIndexOf('. '), cut.lastIndexOf('.\n'));
  return end > 120 ? cut.slice(0, end + 1) : `${cut.trimEnd()}...`;
}

function makeDoc(
  base: Omit<Doc, 'tf' | 'len'>,
  weighted: { text: string; weight: number }[],
): Doc {
  const tf = new Map<string, number>();
  let len = 0;
  for (const { text, weight } of weighted) {
    for (const group of analyze(text)) {
      for (const v of group) tf.set(v, (tf.get(v) ?? 0) + weight);
      len += weight;
    }
  }
  return { ...base, tf, len };
}

let staticDocs: Doc[] | null = null;

function buildStatic(): Doc[] {
  const docs: Doc[] = [];

  for (const k of knowledge) {
    docs.push(
      makeDoc(
        {
          id: `k:${k.id}`,
          kind: 'knowledge',
          title: k.title,
          answer: k.answer,
          followUp: k.followUp,
          suggestions: k.suggestions,
          boost: Math.sqrt(k.weight ?? 1),
        },
        [
          { text: k.title, weight: 3 },
          { text: k.keywords.join(' '), weight: 3 },
          { text: k.answer, weight: 1 },
        ],
      ),
    );
  }

  brand.faq.forEach((f, i) =>
    docs.push(
      makeDoc(
        { id: `faq:${i}`, kind: 'faq', title: f.question, answer: f.answer, link: '/faq', boost: 1.15 },
        [
          { text: f.question, weight: 3 },
          { text: f.answer, weight: 1 },
        ],
      ),
    ),
  );

  for (const area of brand.practiceAreas) {
    const link = `/practice-areas/${area.slug}`;
    docs.push(
      makeDoc(
        {
          id: `area:${area.slug}`,
          kind: 'area',
          title: area.title,
          answer: [area.description, ...area.page.intro].join(' '),
          link,
          boost: 1,
        },
        [
          { text: area.title, weight: 3 },
          { text: [area.description, ...area.page.intro, ...area.page.handles].join(' '), weight: 1 },
        ],
      ),
    );
    area.page.faq.forEach((f, i) =>
      docs.push(
        makeDoc(
          { id: `afaq:${area.slug}:${i}`, kind: 'faq', title: f.question, answer: f.answer, link, boost: 1.15 },
          [
            { text: f.question, weight: 3 },
            { text: `${area.title} ${f.answer}`, weight: 1 },
          ],
        ),
      ),
    );
  }

  for (const a of articles) {
    const link = `/articles/${a.slug}`;
    docs.push(
      makeDoc(
        { id: `art:${a.slug}`, kind: 'article', title: a.title, answer: a.tldr, link, boost: 1.05 },
        [
          { text: a.title, weight: 3 },
          { text: a.tldr, weight: 2 },
        ],
      ),
    );
    a.sections.forEach((s, i) => {
      const body = [...s.paragraphs, ...(s.bullets ?? [])].join(' ');
      docs.push(
        makeDoc(
          { id: `sec:${a.slug}:${i}`, kind: 'article', title: s.heading, answer: brief(body), link, boost: 0.95 },
          [
            { text: `${a.title} ${s.heading}`, weight: 3 },
            { text: body, weight: 1 },
          ],
        ),
      );
    });
    a.faq.forEach((f, i) =>
      docs.push(
        makeDoc(
          { id: `afq:${a.slug}:${i}`, kind: 'faq', title: f.question, answer: f.answer, link, boost: 1.15 },
          [
            { text: f.question, weight: 3 },
            { text: f.answer, weight: 1 },
          ],
        ),
      ),
    );
  }

  return docs;
}

function taughtDocs(notes: Note[]): Doc[] {
  return notes
    .filter((n) => n.enabled && n.question.trim().length > 0)
    .map((n) =>
      makeDoc(
        { id: `note:${n.id}`, kind: 'taught', title: n.question, answer: n.answer, boost: 1.8 },
        [
          { text: n.question, weight: 4 },
          { text: n.answer, weight: 1 },
        ],
      ),
    );
}

export interface Hit {
  doc: Doc;
  score: number;
  /** Share of the question's weight (by rarity) that this passage contains, 0 to 1. */
  coverage: number;
}

const K1 = 1.4;
const B = 0.75;

/** Ranks every passage for the question. Highest first. */
export function search(question: string, notes: Note[]): Hit[] {
  staticDocs ??= buildStatic();
  const docs = [...staticDocs, ...taughtDocs(notes)];
  const groups = analyze(question);
  if (groups.length === 0) return [];

  const n = docs.length;
  const avg = docs.reduce((sum, d) => sum + d.len, 0) / n || 1;
  const df = new Map<string, number>();
  for (const d of docs) for (const t of d.tf.keys()) df.set(t, (df.get(t) ?? 0) + 1);
  const idf = (t: string) => Math.log(1 + (n - (df.get(t) ?? 0) + 0.5) / ((df.get(t) ?? 0) + 0.5));

  // A word counts once, through its best-matching form; its weight is the rarest form's.
  const totalMass = groups.reduce((sum, g) => sum + Math.max(...g.map(idf)), 0) || 1;
  const hits: Hit[] = [];
  for (const d of docs) {
    let score = 0;
    let matched = 0;
    for (const g of groups) {
      let best = 0;
      let bestIdf = 0;
      for (const v of g) {
        const f = d.tf.get(v);
        if (!f) continue;
        const w = idf(v);
        const s = (w * f * (K1 + 1)) / (f + K1 * (1 - B + (B * d.len) / avg));
        if (s > best) {
          best = s;
          bestIdf = w;
        }
      }
      score += best;
      matched += bestIdf;
    }
    if (score > 0) hits.push({ doc: d, score: score * d.boost, coverage: Math.min(1, matched / totalMass) });
  }
  return hits.sort((a, b) => b.score - a.score);
}
