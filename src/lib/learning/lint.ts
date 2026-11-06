import { brand } from '@/lib/brand';

/**
 * Safety checks for what the attorney teaches the assistant. Pure and
 * dependency-free (apart from brand.ts), so it runs on the server (the real
 * gate before approval) and in the browser (live hints while she types).
 *
 * HOW TO EXTEND: add a regular expression to a rule's `patterns`, or add a new
 * rule to RULES. Patterns are matched against text where Hebrew quote marks and
 * niqqud are normalised (see `normalize`). Hebrew has no word boundaries in
 * regular expressions, so match stems and let prefixes (ו, ב, ל, ה) through.
 *
 * The checks are deliberately conservative: a warning is only a speed bump (she
 * can acknowledge it and approve), never a block, and a clean result is NOT a
 * legal review. Israeli Bar advertising rules apply: no promises of outcomes,
 * no comparison with other lawyers.
 */

export type LintRuleId =
  | 'outcome-promise'
  | 'price-promise'
  | 'comparison'
  | 'case-opinion'
  | 'personal-data';

export interface LintRule {
  id: LintRuleId;
  /** Short Hebrew title shown on the warning. */
  title: string;
  /** Plain-Hebrew explanation of why this is a problem. */
  why: string;
  patterns: readonly RegExp[];
  /** Return true to ignore a match (e.g. the firm's own phone number). */
  ignore?: (match: string) => boolean;
}

export interface LintWarning {
  ruleId: LintRuleId;
  title: string;
  why: string;
  /** Up to three short snippets that triggered the rule. */
  matches: string[];
}

const digitsOnly = (s: string) => s.replace(/\D/g, '');
const OWN_PHONE = digitsOnly(brand.phone);
const OWN_EMAIL = brand.email.toLowerCase();

const RULES: readonly LintRule[] = [
  {
    id: 'outcome-promise',
    title: 'הבטחת תוצאה או הצלחה',
    why: 'כללי לשכת עורכי הדין אוסרים לפרסם הבטחה או ציפייה לתוצאה. אי אפשר לדעת איך תיק יסתיים, ומבקר עלול להבין מהעוזרת שהוא יזכה. עדיף לתאר מה אפשר לעשות, בלי להבטיח מה יצא מזה.',
    patterns: [
      /מובטח/g,
      /מבטיח(?:ים|ה|ות)?(?![א-ת])/g,
      /(?<![א-ת])[נא]בטיח/g,
      /תנצחו|ננצח|ניצחון\s+בטוח|נזכה\s+בתיק|תזכו\s+(?:בתיק|בתביעה|בפיצוי|במשפט)/g,
      /בטוח(?:ה|ים|ות)?\s+ש\S*\s+(?:תזכו|תנצחו|תצליחו|תקבלו|ננצח|נזכה|נצליח)/g,
      /100\s*%|מאה\s+אחוז/g,
      /(?:ללא|בלי|אפס)\s+סיכון/g,
      /אחריות\s+(?:ל|על)\s*(?:ה)?תוצא/g,
      /תקבלו\s+(?:את\s+ה)?פיצוי/g,
    ],
  },
  {
    id: 'price-promise',
    title: 'מחיר או הבטחה כספית',
    why: 'מחיר מדויק, "חינם" או "תשלום רק בהצלחה" יוצרים התחייבות. המחיר תלוי בתיק ובהסכם שכר הטרחה בין הלקוח לעורכת הדין, ואין לפרסם אותו בשם העוזרת. עדיף להפנות לשיחה עם המשרד.',
    patterns: [
      /(?:₪|\$|€)\s*\d/g,
      /\d[\d,.]*\s*(?:₪|\$|€|ש"ח|שח|שקל(?:ים)?|אלף|דולר|אירו)/g,
      /בחינם|חינם|ללא\s+עלות|ללא\s+תשלום|בלי\s+תשלום/g,
      /תשלום\s+(?:רק\s+)?(?:בהצלחה|אם\s+(?:נצליח|תזכו))|שכר\s+טרחה\s+(?:רק\s+)?(?:בהצלחה|בלבד)/g,
      /מחיר\s+(?:קבוע|סופי|מוסכם)|במחיר\s+של/g,
    ],
  },
  {
    id: 'comparison',
    title: 'השוואה לעורכי דין אחרים או הצהרת עליונות',
    why: 'כללי הפרסום אוסרים להשוות בין עורכי דין או לטעון שמשרד הוא "הטוב ביותר". גם ביטוי כמו "המובילים בתחום" נחשב הצהרת עליונות. עדיף לתאר את הניסיון והגישה של המשרד בלי להשוות.',
    patterns: [
      /עורכ(?:י|ות)\s+דין\s+אחר(?:ים|ות)/g,
      /עורך\s+דין\s+אחר|עורכת\s+דין\s+אחרת/g,
      /משרד(?:ים|י)?\s+(?:עורכי\s+דין\s+)?אחר(?:ים|ות)/g,
      /מתחרים|המתחרים/g,
      /הכי\s+(?:טוב|מוצלח|מנוסה|מקצועי|גדול)/g,
      /הטוב(?:ה|ים|ות)?\s+ביותר|המוב(?:יל|ילים|ילה)\s+ב/g,
      /מספר\s+1|מס'\s*1/g,
      /טוב(?:ה|ים|ות)?\s+יותר\s+מ|עדיפ(?:ים|ה|ות)?\s+על|בניגוד\s+ל(?:משרד|עורכ)/g,
    ],
  },
  {
    id: 'case-opinion',
    title: 'חוות דעת על מקרה מסוים',
    why: 'העוזרת עונה לציבור הרחב ואינה יודעת את העובדות. ניסוח כמו "במקרה שלך יש תביעה" או "הסיכויים גבוהים" נשמע כייעוץ משפטי אישי, שרק עורכת הדין יכולה לתת אחרי שיחה. עדיף הסבר כללי והזמנה לפגישה.',
    patterns: [
      /במקרה\s+(?:שלך|שלכם|שלכן)/g,
      /יש\s+(?:לך|לכם|לכן)\s+(?:תביעה|תיק|סיכוי|עילה)/g,
      /(?:סיכוי(?:ים)?|סיכויי)\s+(?:טובים|גבוהים|נמוכים|גדולים|קלושים)/g,
      /תיק\s+(?:חזק|חלש|מנצח)/g,
      /(?:אתה|אתם|את|אתן)\s+זכאי(?:ת|ם|ות)?/g,
      /מגיע\s+(?:לך|לכם|לכן)\s+פיצוי/g,
      /(?:הפיטורים|הפיטורין)\s+(?:שלך|שלכם)\s+(?:אינם|לא|היו)/g,
    ],
  },
  {
    id: 'personal-data',
    title: 'פרט אישי (טלפון, ת״ז, דוא״ל או שם)',
    why: 'כל מה שנכתב כאן נכנס לשיחות עם כל המבקרים, ויכול להיחשף להם. אין לכלול טלפון, מספר זהות, דוא״ל או שמות של אנשים (לקוחות, צדדים או עדים). טלפון ודוא״ל של המשרד עצמו מותרים.',
    patterns: [
      /[\w.+-]+@[\w-]+\.[\w.]+/g,
      /(?<!\d)(?:\+?972[-\s]?|0)(?:5\d|[2-4689]|7\d)[-\s]?\d{3}[-\s]?\d{4}(?!\d)/g,
      /(?<!\d)\d{9}(?!\d)/g,
      /ת\.?\s?ז\.?\s*:?\s*\d+/g,
      /(?<![א-ת])(?:מר|מרת|גברת|גב'|הגב'|דר'|ד"ר|פרופ'|הרב)\s+[א-ת]{2,}/g,
      /(?<![א-ת])(?:שמו|שמי|קוראים\s+לו|קוראים\s+לה)\s+[א-ת]{2,}/g,
      /\b[A-Z][a-z]{2,}\s+[A-Z][a-z]{2,}\b/g,
    ],
    ignore: (m) => {
      const lower = m.toLowerCase();
      if (lower === OWN_EMAIL) return true;
      const d = digitsOnly(m);
      if (d.length < 9) return false;
      const local = d.startsWith('972') ? `0${d.slice(3)}` : d;
      return local === OWN_PHONE;
    },
  },
];

/** Exposed so a developer or the UI can list what is checked. */
export const LINT_RULES: readonly Pick<LintRule, 'id' | 'title' | 'why'>[] = RULES.map(
  ({ id, title, why }) => ({ id, title, why }),
);

/** Unifies Hebrew quote marks and removes niqqud, so patterns stay simple. */
function normalize(text: string): string {
  return text
    .replace(/[֑-ׇ]/g, '')
    .replace(/[״“”]/g, '"')
    .replace(/[׳‘’]/g, "'")
    .replace(/[‐-―]/g, '-');
}

/** "לא נבטיח", "איננו מבטיחים": the sentence says the opposite, so do not warn. */
const NEGATION = /(?:^|\s)(?:לא|אין|אי|בלי|אסור|איננו|אינני|אינו|אינה|אינם)(?:\s+\S+){0,2}\s*$/;

function negated(text: string, index: number): boolean {
  return NEGATION.test(text.slice(Math.max(0, index - 24), index));
}

const SKIP_NEGATION: ReadonlySet<LintRuleId> = new Set(['outcome-promise']);

/** Checks a piece of text and returns one warning per rule that matched. */
export function lintText(text: string): LintWarning[] {
  const clean = normalize(text);
  const warnings: LintWarning[] = [];
  for (const rule of RULES) {
    const found = new Set<string>();
    for (const pattern of rule.patterns) {
      for (const m of clean.matchAll(pattern)) {
        const hit = m[0].trim();
        if (!hit || rule.ignore?.(hit)) continue;
        if (SKIP_NEGATION.has(rule.id) && negated(clean, m.index ?? 0)) continue;
        found.add(hit.length > 40 ? `${hit.slice(0, 40)}...` : hit);
      }
    }
    if (found.size > 0) {
      warnings.push({ ruleId: rule.id, title: rule.title, why: rule.why, matches: [...found].slice(0, 3) });
    }
  }
  return warnings;
}

/** Checks both fields of a note (the question can also contain personal data). */
export function lintNote(note: { question: string; answer: string }): LintWarning[] {
  return lintText(`${note.question}\n${note.answer}`);
}
