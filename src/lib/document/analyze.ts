/**
 * Reads what a letter says, from text the visitor's own browser extracted (nothing here touches a server):
 * which kind of document it looks like and which dates it mentions. It does NOT say what a date means or what
 * the deadline is: that is for the attorney. Pure; safe for client and server.
 */

export type DocKind = 'hearing' | 'dismissal' | 'investigation' | 'indictment' | 'warning' | 'lawsuit' | 'order';

interface KindRule {
  kind: DocKind;
  label: string;
  /** Phrases (plain Hebrew); the most matches wins. */
  words: string[];
  /** A document of this kind needs a conversation with the office soon. */
  urgent: boolean;
}

const RULES: KindRule[] = [
  { kind: 'hearing', label: 'זימון לשימוע', words: ['שימוע', 'זימון לשימוע', 'טרם קבלת החלטה', 'להשמיע טענות', 'לפני קבלת החלטה'], urgent: true },
  { kind: 'dismissal', label: 'מכתב פיטורים או סיום העסקה', words: ['פיטורים', 'סיום העסקה', 'הודעה מוקדמת', 'הפסקת העסקה', 'מפוטר', 'מודיעים לך'], urgent: true },
  { kind: 'investigation', label: 'הזמנה לחקירה', words: ['חקירה', 'משטרת ישראל', 'חשוד', 'באזהרה', 'להתייצב', 'תחנת משטרה', 'זימון לחקירה'], urgent: true },
  { kind: 'indictment', label: 'כתב אישום', words: ['כתב אישום', 'נאשם', 'פרקליטות', 'אישום', 'בית משפט השלום', 'בית המשפט המחוזי'], urgent: true },
  { kind: 'warning', label: 'מכתב התראה או דרישה', words: ['מכתב התראה', 'התראה', 'נדרשים', 'אנו דורשים', 'בטרם נפעל', 'ננקוט', 'הליכים משפטיים'], urgent: true },
  { kind: 'lawsuit', label: 'כתב תביעה', words: ['כתב תביעה', 'התובע', 'הנתבע', 'התובעת', 'הנתבעת', 'בית הדין לעבודה', 'סעדים'], urgent: true },
  { kind: 'order', label: 'צו או החלטה של בית משפט', words: ['צו', 'החלטה', 'צו הרחקה', 'צו הגנה', 'צו מניעה', 'בית משפט'], urgent: true },
];

const MONTHS: Record<string, number> = {
  ינואר: 1, פברואר: 2, מרץ: 3, מרס: 3, אפריל: 4, מאי: 5, יוני: 6,
  יולי: 7, אוגוסט: 8, ספטמבר: 9, אוקטובר: 10, נובמבר: 11, דצמבר: 12,
};

export interface FoundDate {
  /** YYYY-MM-DD */
  iso: string;
  /** As written in the letter. */
  text: string;
  /** Whole days from `today` (negative = in the past). */
  inDays: number;
}

export interface DocumentReading {
  kind: DocKind | null;
  label: string | null;
  /** Phrases that made it look like this kind of document. */
  clues: string[];
  dates: FoundDate[];
  /** Needs the office soon: a kind that is time-sensitive, or a date in the next two weeks. */
  urgent: boolean;
}

const plain = (s: string) =>
  s
    .replace(/[‎‏‪-‮]/g, '')
    .replace(/[״"׳'`]/g, '"')
    .replace(/\s+/g, ' ');

function validDate(y: number, m: number, d: number): Date | null {
  if (y < 2000 || y > 2100 || m < 1 || m > 12 || d < 1 || d > 31) return null;
  const date = new Date(Date.UTC(y, m - 1, d));
  return date.getUTCMonth() === m - 1 ? date : null;
}

export function findDates(input: string, today = new Date()): FoundDate[] {
  const text = plain(input);
  const base = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());
  const found = new Map<string, FoundDate>();
  const add = (date: Date | null, shown: string) => {
    if (!date) return;
    const iso = date.toISOString().slice(0, 10);
    if (!found.has(iso)) found.set(iso, { iso, text: shown.trim(), inDays: Math.round((date.getTime() - base) / 86_400_000) });
  };

  // 12/11/2026, 12.11.26, 12-11-2026
  for (const m of text.matchAll(/(?<![\d/.-])(\d{1,2})[./-](\d{1,2})[./-](\d{4}|\d{2})(?![\d])/g)) {
    const year = m[3].length === 2 ? 2000 + Number(m[3]) : Number(m[3]);
    add(validDate(year, Number(m[2]), Number(m[1])), m[0]);
  }
  // 12 בנובמבר 2026, 12 לנובמבר 2026
  const names = Object.keys(MONTHS).join('|');
  for (const m of text.matchAll(new RegExp(`(\\d{1,2})\\s*(?:ב|ל)?(${names})\\s*,?\\s*(\\d{4})`, 'g'))) {
    add(validDate(Number(m[3]), MONTHS[m[2]], Number(m[1])), m[0]);
  }
  return [...found.values()].sort((a, b) => a.iso.localeCompare(b.iso));
}

/** `moreText`: a second reading of the same page (digits read better by an English pass); only dates are taken from it. */
export function readDocument(input: string, today = new Date(), moreText = ''): DocumentReading {
  const text = plain(input);
  let best: { rule: KindRule; clues: string[] } | null = null;
  for (const rule of RULES) {
    const clues = rule.words.filter((w) => text.includes(w));
    if (clues.length > 0 && (!best || clues.length > best.clues.length)) best = { rule, clues };
  }
  const dates = findDates(`${text}\n${moreText}`, today);
  const soon = dates.some((d) => d.inDays >= 0 && d.inDays <= 14);
  return {
    kind: best?.rule.kind ?? null,
    label: best?.rule.label ?? null,
    clues: best?.clues ?? [],
    dates,
    urgent: soon || (best?.rule.urgent ?? false),
  };
}

/** A line the visitor can send to the assistant: the kind and the dates, nothing else from the letter. */
export function summaryForChat(reading: DocumentReading): string {
  const what = reading.label ? `מסמך שנראה כמו ${reading.label}` : 'מסמך';
  const dates = reading.dates.slice(0, 3).map((d) => d.text).join(', ');
  return `קיבלתי ${what}${dates ? `, עם התאריכים ${dates}` : ''}. מה כדאי לעשות?`;
}
