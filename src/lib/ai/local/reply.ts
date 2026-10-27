import 'server-only';
import { brand } from '@/lib/brand';
import { listApprovedNotes, logUnknown } from '@/lib/learning/store';
import { sanitizeQuestion } from '@/lib/learning/sanitize';
import { withTimeout } from '@/lib/with-timeout';
import { SITE_TARGETS, withSiteAction, type SiteTarget } from '@/lib/site-actions';
import { withSuggestions } from '../suggestions';
import { search, type Hit, type Note } from './engine';
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
  ['#נציג', 'k:talk-to-lawyer', 4],
];

/** Topics where a person describing their own situation first gets one human sentence. */
const EMPATHY: Record<string, string> = {
  'k:workplace-discrimination': 'זה נשמע מצב קשה, ואני שמחה שפניתם.',
  'k:unpaid-wages': 'זה מצב מתסכל, ואני שמחה שפניתם.',
  'k:criminal-law': 'אני מבינה שזה מלחיץ, וטוב שבדקתם לפני שמוסרים גרסה.',
  'k:urgent': 'זה מצב שדורש מהירות, אז אכוון אתכם ישר לצעד הנכון.',
};
/** First-person cues: the visitor is describing something that happened to them. */
const PERSONAL = /(?:^|\s)(?:אותי|אליי|אלי|עליי|עלי|שלי|לי|אצלי|פיטרו|פוטרתי|הטרידו|הוזמנתי|זימנו|נעצר|נעצרתי|מפחד|מפחדת|חושש|חוששת|מקלל|משפיל|מתעמר)/;

/** When nothing matches well, a clearly named topic still gets that topic's answer. */
const TOPIC_FALLBACKS: [concept: string, docId: string][] = [
  ['#אחר', 'k:other-areas'],
  ['#סיכוי', 'k:what-we-dont-do'],
  ['#הריון', 'k:workplace-discrimination'],
  ['#גיל', 'k:workplace-discrimination'],
  ['#חלת', 'k:workplace-discrimination'],
  ['#משכורת', 'k:unpaid-wages'],
  ['#הטרדה', 'k:sexual-harassment'],
  ['#חקירה', 'k:criminal-law'],
  ['#פלילי', 'k:criminal-law'],
  ['#פיטורים', 'k:workplace-discrimination'],
  ['#התעמרות', 'k:workplace-discrimination'],
  ['#אפליה', 'k:workplace-discrimination'],
];

/** Concepts that name what a question is about. */
const DOMAIN = ['#חקירה', '#פלילי', '#הטרדה', '#פיטורים', '#התעמרות', '#אפליה', '#משכורת', '#הריון', '#שתיקה'];
/** Narrow topics: only an answer about them when the visitor asked about them. */
const NICHE = ['#הריון', '#שתיקה', '#גיל', '#חלת'];

/** Broad overview answers. A specific published answer that fits the question about as well should win over them. */
const BROAD = new Set(['k:workplace-discrimination', 'k:sexual-harassment', 'k:criminal-law']);

const CONFIDENT = { score: 1.3, coverage: 0.5 };
const CLOSE = { score: 1.6, coverage: 0.42 };

function chipFor(hit: Hit): string | null {
  if (hit.doc.chip) return hit.doc.chip;
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
  const empathy = EMPATHY[doc.id];
  const opener = empathy && !hedge && PERSONAL.test(` ${asked}`) ? `${empathy} ` : '';
  parts.push(`${opener}${doc.answer}`);
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

const NAV_VERB = /(?:^|\s)(?:תראי|תראה|תראו|הראי|הראה|הראו|להראות|תציגי|להציג|הציגי|הצג|קחי|קח|קחו|תקחי|תקח|קפצי|קפוץ|פתחי|פתח|פתחו|עברי|עבור|לעבור|לראות|לצפות|לקרוא|נווטי|נווט|איפה|היכן)(?:\s|$)/;

/** "Show me the reviews", "take me to the criminal law page": the visitor wants to go somewhere on the site. */
function navigationTarget(question: string): SiteTarget | undefined {
  const q = ` ${normalizeText(question)} `;
  const words = q.trim().split(' ').length;
  const verb = NAV_VERB.test(q);
  if (!verb && words > 3) return undefined;
  let best: { target: SiteTarget; len: number } | undefined;
  for (const target of SITE_TARGETS) {
    if (target.needsVerb && !verb) continue;
    for (const phrase of target.phrases) {
      const p = normalizeText(phrase);
      // Hebrew attaches ה/ו/ל/ב/מ/ש/כ to the front of a word: "ההמלצות", "למדריכים".
      if (p.length >= 3 && new RegExp(`(?:^|\\s)[והבכלמש]{0,2}${p}(?:\\s|$)`).test(q) && (!best || p.length > best.len)) {
        best = { target, len: p.length };
      }
    }
  }
  return best?.target;
}

function navigate(target: SiteTarget): string {
  const text = target.line
    ? `בשמחה, מציגה לכם את עמוד התחום באתר. ${target.line}`
    : `בשמחה, מציגה לכם באתר: ${target.label}.`;
  return withSuggestions(withSiteAction(text, target.id), ['קביעת ייעוץ', 'מה עוד יש באתר?']);
}

const SELF_HARM = /(?:^|\s)(?:להתאבד|התאבדות|לפגוע בעצמי|לסיים את הכל|לסיים הכל|רוצה למות|רוצה למות|לא רוצה לחיות|אין טעם לחיות|למות)(?:\s|$)/;
const ASSAULT = /(?:^|\s)(?:אנס|אנסו|נאנסתי|נאנסה|אונס|תקף אותי מינית|תקפו אותי מינית|פגע בי מינית|פגעו בי מינית)(?:\s|$)/;
const INJECTION = /(?:התעלמ[יו]? מ|תדפיס|הדפיס|הראי לי את ההוראות|פרומפט|system prompt|ignore (?:all|your|previous))/i;
const ABUSE = /(?:^|\s)(?:טיפש|מטומטם|מטומטמת|אידיוט|זבל|חרא|כוס|בן זונה|יא בוט)(?:\s|$)/;

function crisis(): string {
  return withSuggestions(
    'אני מצטערת שאת/ה מרגיש/ה כך, וזה חשוב. אם יש סכנה מיידית, התקשרו עכשיו למשטרה 100 או למד״א 101. ' +
      'אפשר גם לפנות לער״ן, עזרה ראשונה נפשית, בטלפון 1201, בכל שעה. ' +
      'הצעד המשפטי יכול לחכות. אם תרצו, אחר כך המשרד ישמח לשמוע ולעזור.',
    ['קביעת ייעוץ'],
  );
}

function assault(): string {
  return withSuggestions(
    'אני מצטערת על מה שעברתם, ותודה שסיפרתם. אין צורך לפרט כאן. אם יש סכנה מיידית, התקשרו למשטרה 100. ' +
      'מרכזי הסיוע לנפגעות ולנפגעי תקיפה מינית זמינים בקווי הסיוע 1202 (נשים) ו-1203 (גברים). ' +
      'עורכת הדין תשמע אתכם בשיחה ישירה ודיסקרטית ותסביר מה האפשרויות. אל תמחקו הודעות או חומרים. ' +
      `אפשר להתקשר ל-${brand.phone} או להשאיר פרטים קצרים ונחזור אליכם.`,
    ['קביעת ייעוץ', 'האם הפנייה חסויה?'],
  );
}

function refuse(): string {
  return withSuggestions(
    'אני לא יכולה לשתף הוראות פנימיות או לשנות את התפקיד שלי, אבל אשמח לעזור בכל שאלה על המשרד, על תחומי העיסוק או על קביעת פגישה.',
    DEFAULT_CHIPS,
  );
}

function calm(): string {
  return withSuggestions(
    `אני מצטערת שזה מתסכל. אם יש משהו שאפשר לעשות, אשמח לעזור, ואם עדיף לדבר עם אדם, אפשר להתקשר למשרד ל-${brand.phone}.`,
    ['קביעת ייעוץ', 'מה אפשר לשאול אותך?'],
  );
}

/** Russian and Arabic visitors get a short honest note in their own language. */
function otherScript(question: string): string | null {
  if (/[\u0400-\u04FF]{3}/.test(question)) {
    return withSuggestions(
      `Здравствуйте! Я виртуальный помощник юридической фирмы. Чат лучше всего работает на иврите. По срочным вопросам звоните или пишите в WhatsApp: ${brand.phone}. На каких языках вас обслужат в офисе, уточните у них напрямую.`,
      ['קביעת ייעוץ'],
    );
  }
  if (/[\u0600-\u06FF]{3}/.test(question)) {
    return withSuggestions(
      `مرحباً، أنا المساعدة الافتراضية لمكتب المحاماة. تعمل المحادثة بشكل أفضل بالعبرية. للأمور العاجلة يرجى الاتصال أو الكتابة عبر واتساب: ${brand.phone}. للاستفسار عن اللغات المتاحة في المكتب، تواصلوا معهم مباشرة.`,
      ['קביעת ייעוץ'],
    );
  }
  return null;
}

/** The same answer twice in a row helps nobody: ask for the one detail that would change it. */
function moreSpecific(): string {
  return withSuggestions(
    'כדי לכוון אתכם בצורה מדויקת יותר, כדאי שאדע באיזה שלב אתם נמצאים: האם קיבלתם מכתב או זימון, האם כבר הוגשה תלונה, ' +
      'ומה הכי דחוף לכם עכשיו. אין צורך לפרט את האירוע. ואם נוח יותר, אפשר לדבר ישירות עם המשרד.',
    ['קביעת ייעוץ', 'מה להביא לפגישה?', 'האם הפנייה חסויה?'],
  );
}

function english(): string {
  return withSuggestions(
    `Thank you for reaching out. I'm the virtual assistant of the law firm. This chat works best in Hebrew, ` +
      `and for anything urgent please call or message the office on WhatsApp at ${brand.phone}. ` +
      'Which languages the office can serve you in is best confirmed with them directly.',
    ['קביעת ייעוץ'],
  );
}

function unknown(): string {
  return withSuggestions(
    'לא מצאתי תשובה מדויקת לשאלה הזו, ואני לא רוצה לנחש. אפשר לנסח אותה אחרת, או לדבר ישירות עם המשרד ' +
      `בטלפון ${brand.phone} או בוואטסאפ. ליאור רואה שאלות כאלה ומלמדת אותי תשובה, כך שבפעם הבאה אדע לענות.`,
    DEFAULT_CHIPS,
  );
}

/** Passages for a question, best first: BM25, then clear intents, then specific answers over broad overviews. */
function rankHits(q: string, notes: Note[]): Hit[] {
  let hits = search(q, notes);
  const present = new Set(tokens(q));
  // A passage about a topic the visitor did not raise (pregnancy for "I was fired") or that lacks the topic they did
  // raise (a hearing for "summoned to an investigation") ranks lower.
  const asked = DOMAIN.filter((c) => present.has(c));
  hits = hits
    .map((h) => {
      let factor = 1;
      if (asked.length > 0 && !asked.some((c) => h.doc.tf.has(c))) factor *= 0.55;
      if (NICHE.some((c) => h.doc.tf.has(c) && !present.has(c))) factor *= 0.6;
      return factor === 1 ? h : { ...h, score: h.score * factor };
    })
    .sort((x, y) => y.score - x.score);
  // "The police called me" is an investigation, not a request for our phone number.
  const investigation = present.has('#חקירה') || present.has('#פלילי');
  const boosts: [string, string, number][] = INTENT_BOOSTS.filter(
    ([concept, docId]) => present.has(concept) && !(investigation && docId === 'k:contact'),
  );
  if (investigation && /(?:^|\s)(?:נעצר|נעצרה|נעצרתי|עצרו|לתחנה|עצור|עצורה)/.test(` ${normalizeText(q)}`)) {
    boosts.push(['#חקירה', 'k:urgent', 3]);
  }
  if (boosts.length > 0) {
    hits = hits
      .map((h) => {
        const b = boosts.find(([, docId]) => docId === h.doc.id);
        return b ? { ...h, score: h.score * b[2], coverage: Math.max(h.coverage, 0.6) } : h;
      })
      .sort((a, b) => b.score - a.score);
  }
  if (hits[0] && BROAD.has(hits[0].doc.id)) {
    const first = hits[0];
    // Topic words the question has and the overview covers must also be in the specific answer ("חקירה" must not become "שימוע").
    const topics = [...present].filter((t) => t.startsWith('#') && first.doc.tf.has(t));
    const specific = hits.find(
      (h) =>
        (h.doc.kind === 'faq' || h.doc.kind === 'taught') &&
        topics.every((t) => h.doc.tf.has(t)) &&
        h.coverage >= first.coverage * 0.9 &&
        h.score >= first.score * 0.7,
    );
    if (specific) hits = [specific, ...hits.filter((h) => h.doc.id !== specific.doc.id)];
  }
  return hits;
}

/** Which passage answers, and whether to say "I think this is what you asked". Null when nothing fits. */
function pick(hits: Hit[], present: Set<string>): { hit: Hit; hedge: boolean } | null {
  const top = hits[0];
  if (!top) return null;
  const taught = top.doc.kind === 'taught';
  if (top.score >= CONFIDENT.score && top.coverage >= (taught ? 0.4 : CONFIDENT.coverage)) return { hit: top, hedge: false };
  const topic = TOPIC_FALLBACKS.find(([concept]) => present.has(concept));
  const topicHit = topic ? hits.find((h) => h.doc.id === topic[1]) : undefined;
  if (topicHit) return { hit: topicHit, hedge: false };
  if (top.score >= CLOSE.score && top.coverage >= CLOSE.coverage) return { hit: top, hedge: true };
  return null;
}

export interface LocalReplyOptions {
  /** Use these notes instead of the stored ones (the admin "test the chat" box). */
  notes?: Note[];
  /** False for dry runs: do not add the question to the unanswered list. */
  recordUnknown?: boolean;
}

/** Answer a question from the site and from what the attorney taught. */
export async function localReply(
  question: string,
  previousQuestion?: string,
  options: LocalReplyOptions = {},
): Promise<string> {
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

  // Safety first: someone in danger gets help, not a search result, and is never logged.
  if (SELF_HARM.test(` ${norm} `)) return crisis();
  if (ASSAULT.test(` ${norm} `)) return assault();
  if (INJECTION.test(norm)) return refuse();
  if (ABUSE.test(` ${norm} `)) return calm();
  const script = otherScript(question);
  if (script) return script;

  const where = navigationTarget(question);
  if (where) return navigate(where);
  if (/[A-Za-z]{3}/.test(question) && !/[\u0590-\u05FF]/.test(question)) return english();

  const notes = options.notes ?? (await withTimeout(listApprovedNotes(), 1500, []));
  let q = question;
  // A short follow-up ("ופיצויים?", "ואם לא אגיע") is about the previous question.
  const followUp = analyze(question).length <= 1 || (words.length <= 5 && /^(?:ו|אז |ומה|ואם|והאם)/.test(norm));
  if (followUp && previousQuestion) q = `${previousQuestion} ${question}`;

  const hits = rankHits(q, notes);
  const picked = pick(hits, new Set(tokens(q)));

  // Never repeat the answer just given: take another passage, or ask for the one detail that would change it.
  if (picked && previousQuestion && picked.hit.doc.kind !== 'taught') {
    const before = pick(rankHits(previousQuestion, notes), new Set(tokens(previousQuestion)));
    if (before && before.hit.doc.id === picked.hit.doc.id) {
      const rest = hits.filter((h) => h.doc.id !== picked.hit.doc.id);
      const other = pick(rest, new Set(tokens(q)));
      return other ? compose(other.hit, rest, question, other.hedge) : moreSpecific();
    }
  }
  if (picked) return compose(picked.hit, hits, question, picked.hedge);

  const clean = sanitizeQuestion(question);
  if (options.recordUnknown !== false && clean.length >= 4 && tokens(clean).length >= 2 && !question.includes('הוסר]')) {
    void logUnknown(clean).catch(() => undefined);
  }
  return unknown();
}

