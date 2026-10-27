import 'server-only';
import { brand } from '@/lib/brand';
import { listNotes, logUnknown } from '@/lib/learning/store';
import { sanitizeQuestion } from '@/lib/learning/sanitize';
import { withSuggestions } from '../suggestions';
import { search, type Hit } from './engine';
import { analyze, normalizeText, tokens } from './text';

/**
 * The assistant's brain when no AI model answers: retrieval over the site and
 * over what the attorney taught. It says "I am not sure" instead of guessing,
 * and records the question so she can teach the answer in /admin.
 */

const GREETINGS = new Set(['שלום', 'היי', 'הי', 'הלו', 'אהלן', 'בוקר', 'ערב', 'צהריים', 'שלומות']);
const THANKS = new Set(['תודה', 'תודה רבה', 'אחלה', 'מעולה', 'מצוין', 'סבבה']);
const BYE = new Set(['להתראות', 'ביי', 'יום טוב', 'שבוע טוב', 'לילה טוב']);

const DEFAULT_CHIPS = ['קביעת ייעוץ', 'באילו תחומים אתם מטפלים?', 'כמה עולה ייעוץ ראשוני?'];

const INTENT_BOOSTS: [concept: string, docId: string, factor: number][] = [
  ['#דחוף', 'k:urgent', 3],
  ['#טלפון', 'k:contact', 3],
  ['#וואטסאפ', 'k:contact', 3],
  ['#שעות', 'k:response-time', 2.5],
];

/** When nothing matches well, a clearly named topic still gets that topic's answer. */
const TOPIC_FALLBACKS: [concept: string, docId: string][] = [
  ['#הטרדה', 'k:sexual-harassment'],
  ['#חקירה', 'k:criminal-law'],
  ['#פלילי', 'k:criminal-law'],
  ['#פיטורים', 'k:workplace-discrimination'],
  ['#התעמרות', 'k:workplace-discrimination'],
  ['#אפליה', 'k:workplace-discrimination'],
];

const CONFIDENT = { score: 1.3, coverage: 0.5 };
const CLOSE = { score: 1.6, coverage: 0.34 };

function chipFor(hit: Hit): string | null {
  const t = hit.doc.title.trim();
  if (t.length > 60 || t.length < 4) return null;
  if (hit.doc.kind === 'knowledge') return t.endsWith('?') ? t : `${t}?`;
  return t.endsWith('?') ? t : null;
}

/** Up to two follow-up questions from the next best passages, plus booking. */
function chips(hits: Hit[], used: Hit, asked: string): string[] {
  const seen = new Set([normalizeText(asked), normalizeText(used.doc.title)]);
  const out: string[] = [];
  for (const h of hits) {
    if (out.length >= 2) break;
    if (h.doc.id === used.doc.id || h.coverage < 0.15) continue;
    const c = chipFor(h);
    if (!c || seen.has(normalizeText(c))) continue;
    seen.add(normalizeText(c));
    out.push(c);
  }
  const base = used.doc.suggestions?.filter((s) => !seen.has(normalizeText(s))) ?? [];
  const merged = [...out, ...base].slice(0, 2);
  return ['קביעת ייעוץ', ...merged];
}

function compose(hit: Hit, hits: Hit[], asked: string, hedge: boolean): string {
  const { doc } = hit;
  const parts: string[] = [];
  if (hedge) parts.push('נראה לי שזה מה ששאלתם:');
  parts.push(doc.answer);
  if (doc.followUp) parts.push(doc.followUp);
  if (doc.link && doc.kind !== 'taught') parts.push(`קראו עוד: ${doc.link}`);
  return withSuggestions(parts.join('\n\n'), chips(hits, hit, asked));
}

function sensitive(): string {
  return withSuggestions(
    'תודה ששיתפתם, ואני מבינה שזה לא פשוט. אין צורך לפרט את האירוע כאן. ' +
      'עורכת הדין תשמע אתכם בשיחה ישירה ודיסקרטית, ותסביר מה האפשרויות. אפשר להשאיר פרטים קצרים ונחזור אליכם.',
    ['קביעת ייעוץ', 'האם הפנייה חסויה?'],
  );
}

function unknown(): string {
  return withSuggestions(
    'לא מצאתי תשובה מדויקת לשאלה הזו, ואני לא רוצה לנחש. אפשר לנסח אותה אחרת, או לדבר ישירות עם המשרד ' +
      `בטלפון ${brand.phone} או בוואטסאפ. ליאור רואה שאלות כאלה ומלמדת אותי תשובה, כך שבפעם הבאה אדע לענות.`,
    DEFAULT_CHIPS,
  );
}

/** Answer a question from the site and from what the attorney taught. */
export async function localReply(question: string, previousQuestion?: string): Promise<string> {
  const norm = normalizeText(question);
  const words = norm.split(' ');

  if (words.length <= 3 && GREETINGS.has(words[0])) {
    return withSuggestions(
      `שלום, אני ${brand.chat.assistantName}. אפשר לספר לי במה מדובר, או לשאול על תחומי העיסוק, על פגישת ייעוץ או על שעות הפעילות.`,
      DEFAULT_CHIPS,
    );
  }
  if (THANKS.has(norm) || (words.length <= 3 && THANKS.has(words[0]))) {
    return withSuggestions('בשמחה. אם עולה עוד שאלה, אני כאן. ואם תרצו לדבר עם המשרד, אפשר לקבוע ייעוץ.', ['קביעת ייעוץ']);
  }
  if (BYE.has(norm)) return 'להתראות, ובהצלחה. אפשר לחזור בכל עת.';
  if (question.length > 260) return sensitive();

  const notes = await listNotes().catch(() => []);
  let q = question;
  if (analyze(question).length <= 1 && previousQuestion) q = `${previousQuestion} ${question}`;

  let hits = search(q, notes);
  // Clear intents go to their dedicated answer (urgent: phone first; contact; hours).
  const present = new Set(tokens(q));
  const boosts = INTENT_BOOSTS.filter(([concept]) => present.has(concept));
  if (boosts.length > 0) {
    hits = hits
      .map((h) => {
        const b = boosts.find(([, docId]) => docId === h.doc.id);
        return b ? { ...h, score: h.score * b[2], coverage: Math.max(h.coverage, 0.6) } : h;
      })
      .sort((a, b) => b.score - a.score);
  }

  const top = hits[0];
  if (top) {
    const taught = top.doc.kind === 'taught';
    if (top.score >= CONFIDENT.score && top.coverage >= (taught ? 0.4 : CONFIDENT.coverage)) {
      return compose(top, hits, question, false);
    }
    const topic = TOPIC_FALLBACKS.find(([concept]) => present.has(concept));
    const topicHit = topic ? hits.find((h) => h.doc.id === topic[1]) : undefined;
    if (topicHit) return compose(topicHit, hits, question, false);
    if (top.score >= CLOSE.score && top.coverage >= CLOSE.coverage) {
      return compose(top, hits, question, true);
    }
  }

  const clean = sanitizeQuestion(question);
  if (clean.length >= 4 && tokens(clean).length >= 2) {
    void logUnknown(clean).catch(() => undefined);
  }
  return unknown();
}

