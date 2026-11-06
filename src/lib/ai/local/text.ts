/**
 * Hebrew text normalisation for the local (no-API) assistant.
 *
 * Hebrew attaches prepositions and the article to the word ("בעבודה", "והטרדה"),
 * so matching raw words misses most questions. We strip those prefixes and a few
 * endings, and map common synonyms to one concept token. The same function is
 * applied to the question and to the site content, so even imperfect stems match.
 */

const NIQQUD = /[֑-ׇ]/g;
const FINALS: Record<string, string> = { ם: 'מ', ן: 'נ', ך: 'כ', ף: 'פ', ץ: 'צ' };

const STOPWORDS = new Set(
  (
    'של את עם על אל אני אתה את אתם אתן הוא היא הם הן אנחנו זה זאת זו אלה אלו יש אין לא כן גם או אבל כי אם ' +
    'מה איך מי מתי איפה למה האם אפשר צריך צריכה רוצה רוצים רוצות יכול יכולה יכולים לי לך לו לה לנו להם לכם ' +
    'שלי שלך שלו שלה שלנו שלכם שלהם עוד רק כל מאוד פשוט בבקשה תודה היי שלום הלו אהלן אז כך כמו אחרי לפני ' +
    'היה היתה היו יהיה תהיה להיות הייתי הייתה נראה נראית שאלה שאלות רציתי רוצה אמרו מישהו משהו כלום ' +
    'אותי אותו אותה אותנו אותם אותן עלי עליו עליה עלינו ממני ממנו בי בו בה בנו לעשות עושים עושה לעשות ' +
    'אפשר האם ענין עניין מקרה קורה קרה קורים'
  ).split(/\s+/),
);

/** Surface forms that should count as one concept. Keys are plain words. */
const SYNONYMS: Record<string, string[]> = {
  '#עלות': ['מחיר', 'עלות', 'עולה', 'עולים', 'תשלום', 'לשלם', 'כסף', 'שכר טרחה', 'טרחה', 'עלויות', 'תעריף', 'תשלומים', 'יקר', 'זול', 'חינם', 'בחינם'],
  '#משכורת': ['שכר', 'משכורת', 'משכורות', 'שילם', 'שילמו', 'שולם', 'פיצויים', 'פיצוי', 'פיצויי', 'תלוש', 'סוציאליות', 'פנסיה'],
  '#שתיקה': ['שתיקה', 'לשתוק', 'שותק', 'שותקת', 'להשתיק'],
  '#הריון': ['הריון', 'בהריון', 'הרה', 'לידה', 'חופשת לידה', 'הורות', 'אימהות'],
  '#נציג': ['נציג', 'נציגה', 'לדבר עם ליאור', 'לדבר עם עורכת הדין', 'לדבר עם עורך דין', 'לדבר עם מישהו', 'לדבר עם אדם', 'שתחזור אליי', 'שיחזרו אליי', 'תחזרו אליי', 'תחזרו אלי', 'חזרו אליי', 'תתקשרו אליי', 'שיתקשרו אליי', 'שתתקשר אליי'],
  '#פיטורים': ['פיטורים', 'פוטרתי', 'פיטרו', 'מפטרים', 'פיטור', 'לפטר', 'שימוע', 'פיטורין', 'סיום העסקה', 'הודעה מוקדמת'],
  '#התעמרות': ['התעמרות', 'צועק', 'צועקים', 'מקלל', 'מקללים', 'מעליב', 'מעליבים', 'מאיים', 'מאיימים', 'מתנכל', 'מתנכלים', 'הצקות', 'לוחץ עלי', 'מתעלל', 'מתעמר', 'מתעמרים', 'בריונות', 'מציק', 'מציקים', 'השפלה', 'משפיל', 'משפילים', 'צעקות', 'מתעללים', 'הדרה', 'מנודה'],
  '#אפליה': ['אפליה', 'מפלים', 'מפלה', 'מופלה', 'מופלית', 'שוויון', 'מפלות'],
  '#הטרדה': ['הטרדה', 'הטריד', 'מטריד', 'הטרידו', 'מינית', 'נגע', 'נגיעה', 'מגע', 'הצעות', 'אונס', 'אנס', 'אנסו', 'נאנסתי', 'נאנסה', 'תקיפה', 'פגע', 'עירום', 'תמונות עירום', 'הפצה'],
  '#חקירה': ['חקירה', 'משטרה', 'זימון', 'זומנתי', 'נחקר', 'נחקרת', 'חשוד', 'חשודה', 'מעצר', 'נעצר', 'נעצרה', 'עצרו', 'שוטר', 'שוטרים', 'באזהרה', 'תחנה', 'לתחנה', 'במשטרה', 'ליחידה', 'נעצרתי', 'עצור', 'עצורה', 'מחפשים אותי', 'הגיעו אליי'],
  '#פלילי': ['פלילי', 'פלילית', 'כתב אישום', 'אישום', 'מואשם', 'נאשם', 'משפט', 'הרשעה', 'עבירה', 'עבירות', 'תיק פלילי', 'סם', 'סמים', 'גניבה', 'אלימות', 'איומים', 'שכרות', 'שיכור', 'תפסו'],
  '#סיכוי': ['סיכוי', 'סיכויים', 'לזכות', 'אנצח', 'לנצח', 'ננצח'],
  '#אחר': ['תאונה', 'תאונת', 'דירה', 'חוזה שכירות', 'מקרקעין', 'נדלן', 'הוצאה לפועל', 'פשיטת רגל'],
  '#גירושין': ['גירושין', 'גירושים', 'להתגרש', 'נישואין', 'להתחתן', 'הסכם גירושין', 'משמורת', 'מזונות'],
  '#ירושה': ['ירושה', 'צוואה', 'צוואות', 'יורשים', 'נפטר', 'נפטרה', 'אפוטרופוס', 'אפוטרופסות', 'הצהרת מוות', 'ייפוי כוח', 'יפוי כוח', 'ייפוי כוח מתמשך', 'צו ירושה', 'צו קיום צוואה'],
  '#רפואית': ['רשלנות רפואית', 'רשלנות', 'חיסון', 'חיסונים', 'פייזר', 'זריקה', 'זריקות', 'בית חולים', 'טעות רפואית', 'נפגע חיסון', 'נזק רפואי'],
  '#נזיקין': ['נזיקין', 'ביטוח לאומי', 'לשון הרע', 'הוציאו דיבתי', 'צו הטרדה', 'הטרדה מאיימת', 'צו הרחקה', 'הרחקה', 'ללא הוכחת נזק'],
  '#גיל': ['גיל', 'מבוגר', 'מבוגרת', 'צעיר', 'שכרו צעיר'],
  '#חלת': ['חלת', 'חל״ת', 'חופשה ללא תשלום', 'צמצומים', 'הורידו תפקיד', 'הורידו לי תפקיד'],
  '#טלפון': ['טלפון', 'נייד', 'להתקשר', 'התקשר', 'מספר טלפון', 'ליצור קשר', 'יצירת קשר'],
  '#כתובת': ['כתובת', 'מיקום', 'חריש', 'נמצא', 'נמצאים', 'איפה המשרד', 'איך מגיעים', 'מפה', 'ניווט'],
  '#וואטסאפ': ['וואטסאפ', 'ווטסאפ', 'וטסאפ', 'ווצאפ', 'whatsapp'],
  '#שעות': ['שעות', 'פתוח', 'פתוחים', 'זמינות', 'זמין', 'זמינים', 'שעות פעילות', 'שבת'],
  '#דחוף': ['דחוף', 'דחופה', 'דחופים', 'מיידי', 'בהקדם', 'דד ליין', 'מועד אחרון', 'ממש עכשיו'],
  '#סודיות': ['סודיות', 'חסוי', 'חסויה', 'דיסקרטיות', 'דיסקרטי', 'פרטיות', 'סוד', 'יודע'],
  '#מסמכים': ['מסמכים', 'מסמך', 'להביא', 'חוזה', 'תלושים', 'תלוש', 'התכתבויות', 'הודעות', 'ראיות', 'תיעוד', 'לתעד', 'להקליט', 'הקלטה'],
  '#פגישה': ['פגישה', 'ייעוץ', 'לקבוע', 'תור', 'להיפגש', 'לתאם', 'לתיאום', 'שיחה'],
  '#זמן': ['כמה זמן', 'נמשך', 'נמשכת', 'לוקח', 'לוקחת', 'משך', 'שנים', 'חודשים', 'מהר'],
  '#התפטרות': ['התפטרות', 'התפטרתי', 'להתפטר', 'מתפטר', 'התפטר', 'לעזוב'],
  '#בוט': ['בוט', 'רובוט', 'אדם', 'אמיתי', 'בינה מלאכותית', 'צאט', 'צ׳אט', 'צ\'אט', 'מכונה'],
};

function plain(input: string): string {
  return input
    .normalize('NFKD')
    .replace(NIQQUD, '')
    .replace(/["'״׳`’.,!?;:()\-–—_/\\[\]{}<>«»…]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

function finals(word: string): string {
  return word.replace(/[םןךףץ]/g, (c) => FINALS[c] ?? c);
}

const PREFIXES = 'והבכלמש';

/**
 * The plausible forms of a word: itself, without prefixes, without endings and
 * both. A word's first letter may be part of its root (שלב, לקוח), so we keep
 * every variant and let matching pick whichever the content also has.
 */
export function variants(word: string): string[] {
  const base = finals(word);
  const out = new Set<string>([base]);

  const noSuffix = (w: string): string[] => {
    const r: string[] = [];
    if (w.length >= 5 && (w.endsWith('ימ') || w.endsWith('ות') || w.endsWith('ית'))) r.push(w.slice(0, -2));
    if (w.length >= 5 && w.endsWith('י')) r.push(w.slice(0, -1));
    if (w.length >= 4 && (w.endsWith('ה') || w.endsWith('ת'))) r.push(w.slice(0, -1));
    return r;
  };

  const prefixed: string[] = [];
  if (base.length >= 4 && PREFIXES.includes(base[0])) prefixed.push(base.slice(1));
  if (base.length >= 5 && PREFIXES.includes(base[0]) && PREFIXES.includes(base[1])) prefixed.push(base.slice(2));

  for (const w of [base, ...prefixed]) {
    out.add(w);
    for (const r of noSuffix(w)) out.add(r);
  }
  return [...out].filter((v) => v.length >= 3 || v === base);
}

/** One entry per word: its variants. Concept tokens are single-variant entries. */
export type Group = string[];

const CONCEPT_BY_VARIANT = new Map<string, string>();
const CONCEPT_PHRASES: { phrase: string; concept: string }[] = [];
for (const [concept, words] of Object.entries(SYNONYMS)) {
  for (const w of words) {
    const p = plain(w);
    if (p.includes(' ')) CONCEPT_PHRASES.push({ phrase: p, concept });
    else CONCEPT_BY_VARIANT.set(finals(p), concept);
  }
}

const STOP = new Set([...STOPWORDS].map((w) => finals(plain(w))));

/** Words of the text as variant groups, stop words removed, concepts appended. */
export function analyze(text: string): Group[] {
  const p = plain(text);
  const groups: Group[] = [];
  const concepts = new Set<string>();
  for (const { phrase, concept } of CONCEPT_PHRASES) {
    if (p.includes(phrase)) concepts.add(concept);
  }
  for (const word of p.split(' ')) {
    if (!word) continue;
    const vs = variants(word);
    for (const v of vs) {
      const c = CONCEPT_BY_VARIANT.get(v);
      if (c) concepts.add(c);
    }
    if (vs.some((v) => STOP.has(v))) continue;
    groups.push(vs);
  }
  for (const c of concepts) groups.push([c]);
  return groups;
}

/** Flat list of every variant, for simple "does it mention" checks. */
export function tokens(text: string): string[] {
  return analyze(text).flat();
}

export function normalizeText(text: string): string {
  return plain(text);
}
