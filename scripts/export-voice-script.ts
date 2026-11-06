/**
 * Lists every sentence the assistant can say out loud, so each one can be recorded in the chosen voice.
 *
 *   npm run voice:script
 *
 * Writes content/voice/chat-voice-script.txt (what to read, in parts) and content/voice/sentences.json
 * (the key of every sentence; the recordings are matched to the chat by these keys).
 * Answers the attorney teaches later are not in the list: they are recorded when they are approved.
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { brand } from '../src/lib/brand';
import { allStaticDocs } from '../src/lib/ai/local/engine';
import { fixedSpokenTexts } from '../src/lib/ai/local/reply';
import { splitSpoken, spokenKey } from '../src/lib/voice/spoken';

interface Item {
  key: string;
  text: string;
  group: string;
}

const items = new Map<string, Item>();
function add(group: string, text: string) {
  for (const sentence of splitSpoken(text)) {
    const key = spokenKey(sentence);
    if (!items.has(key)) items.set(key, { key, text: sentence, group });
  }
}

// What the chat says by itself (keep in sync with ConciergeProvider.tsx).
add('פתיחת השיחה והשאלות הקצרות', brand.chat.greeting);
for (const line of [
  'בשמחה. אשאל כמה שאלות קצרות כדי שהמשרד יחזור אליך, בלי צורך לפרט את המקרה. איך קוראים לך?',
  'באיזה תחום מדובר?',
  'ועד מתי חשוב לך לקבל מענה?',
  'כשיש מועד קרוב כדאי לדבר ישירות. אפשר להתקשר עכשיו, ובמקביל אשאיר את הפרטים. מה מספר הטלפון שלך?',
  'מה מספר הטלפון שלך? נחזור אליך בהקדם.',
  'המספר לא נראה לי תקין. אפשר לכתוב אותו שוב, למשל 050-0000000?',
  'איך נוח לך לדבר עם עורכת הדין, במשרד בחריש או בזום?',
  'ובאיזו שעה בדרך כלל נוח לך שיחזרו אליך?',
  'רוצה להוסיף משפט על העניין? אין צורך לפרט את האירוע, ואפשר לדלג.',
  'בואו נוודא שהכול נכון:',
  'הפרטים הועברו למשרד, ונחזור אליך בהקדם. אם נוח לך, אפשר גם להמשיך את השיחה בוואטסאפ.',
  'כמעט סיימנו. הכנתי לך הודעה מוכנה עם כל הפרטים. לחצו לשליחה בוואטסאפ והיא תגיע ישירות למשרד.',
  'כדי להמשיך, לחצו על "כן, שלחו" או על "להתחיל מחדש".',
  'אין בעיה, לא שלחתי כלום. אפשר להמשיך לשאול אותי כל דבר.',
  'בשמחה, מתחילים מחדש. איך קוראים לך?',
  'אשמח לשם שאפשר לפנות אליו, לפחות שתי אותיות.',
  'התשובה מתעכבת. אפשר לנסות שוב, או להתקשר ונענה מיד.',
  `אירעה תקלה בשליחה. אפשר להתקשר אלינו ל-${brand.phone}.`,
]) {
  add('פתיחת השיחה והשאלות הקצרות', line);
}

for (const text of fixedSpokenTexts()) add('מצבים רגישים, ניווט באתר ומשפטי מעבר', text);

const GROUP: Record<string, string> = {
  knowledge: 'על המשרד, פגישות ושאלות נפוצות',
  faq: 'שאלות ותשובות',
  area: 'תחומי עיסוק',
  article: 'מדריכים ומאמרים',
};
for (const doc of allStaticDocs()) {
  if (doc.kind === 'taught') continue;
  const group = GROUP[doc.kind] ?? 'אחר';
  add(group, doc.answer);
  if (doc.followUp) add(group, doc.followUp);
}

const list = [...items.values()];
const PART = 20;
const parts: Item[][] = [];
for (let i = 0; i < list.length; i += PART) parts.push(list.slice(i, i + PART));

const header = [
  'טקסט להקראה: כל המשפטים שהצ׳אט אומר בקול',
  `${list.length} משפטים, ב-${parts.length} חלקים של עד ${PART} משפטים.`,
  '',
  'איך מקליטים (לכל חלק בנפרד):',
  '1. מעתיקים את הטקסט שמתחת לכותרת החלק (בלי הכותרת עצמה).',
  '2. מבקשים להקריא אותו בקול הנבחר, בעברית ישראלית טבעית ואנושית, בקצב נעים.',
  '3. להשאיר שקט של שתי שניות לפחות בין משפט למשפט (כל משפט בשורה נפרדת).',
  '4. לא להקריא את הכותרות, ולא את המספרים.',
  '5. "צ׳אט" נאמר כמו chat באנגלית, לא "צאט".',
  '6. משפט שמסתיים בסימן שאלה נאמר כשאלה, בטון עולה.',
  '7. לשמור כל חלק בקובץ נפרד בשם part-01, part-02 וכן הלאה.',
  '',
  '========================================',
  '',
];
const welcome = [
  '=== חלק 00: הפתיחה (12 שורות, בקובץ אחד, שנייה של שקט בין שורה לשורה) ===',
  '',
  ...brand.chat.intro.segments.flatMap((seg) => [seg.text, '']),
];
const body = [
  ...welcome,
  ...parts.flatMap((p, i) => [
    `=== חלק ${String(i + 1).padStart(2, '0')} (${p.length} משפטים) ===`,
    '',
    ...p.flatMap((it) => [it.text, '']),
  ]),
];

mkdirSync('content/voice', { recursive: true });
writeFileSync('content/voice/chat-voice-script.txt', [...header, ...body].join('\n'));
writeFileSync(
  'content/voice/sentences.json',
  JSON.stringify(
    list.map((it, i) => ({ key: it.key, part: Math.floor(i / PART) + 1, index: i % PART, group: it.group, text: it.text })),
    null,
    1,
  ) + '\n',
);
console.log(`${list.length} sentences in ${parts.length} parts`);
const chars = list.reduce((n, it) => n + it.text.length, 0);
console.log(`about ${Math.round(chars / 14 / 60)} minutes of speech`);
