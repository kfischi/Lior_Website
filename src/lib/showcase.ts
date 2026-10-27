/**
 * The "behind the scenes" demo page (/showcase): what this site can do, shown to other law firms and
 * businesses. It describes the TEMPLATE (what one config file and a few skills give a new client),
 * so it lives here and not in a component. Hidden from search, the menu and the sitemap.
 *
 * Only list a capability as `live` when it exists in this repository and works; use `building` and
 * `planned` honestly. Leave `contact` empty to hide the "talk to us" button.
 */

export type CapabilityStatus = 'live' | 'building' | 'planned';
export type CapabilityGroup = 'chat' | 'avatar' | 'growth' | 'trust' | 'platform';

export interface Capability {
  id: string;
  group: CapabilityGroup;
  title: string;
  text: string;
  status: CapabilityStatus;
  /** A line to send to the assistant, so the visitor can try it right here. */
  tryPrompt?: string;
}

export const showcase = {
  eyebrow: 'מאחורי הקלעים',
  title: 'אתר של משרד עורכי דין, שעובד כמו מוצר',
  intro:
    'האתר הזה הוא תבנית לבנייה מחדש לכל משרד: קובץ אחד מחליף את התוכן, הצבעים והפרטים, וכל מה שמתחתיו נשאר. ' +
    'הצ׳אט מכיר את כל האתר ומוביל בו, העוזרת מדברת, וסוכנים עובדים ברקע על קידום והתעדכנות. ' +
    'כאן אפשר לנסות את מה שכבר פועל, ולראות מה בדרך.',

  groups: {
    chat: { title: 'שיחה שמובילה את האתר', text: 'העוזרת עונה, מנווטת וקולטת פניות, גם כשאין חיבור למודל חיצוני.' },
    avatar: { title: 'נוכחות אנושית', text: 'וידאו היכרות, קול וסיור באתר.' },
    growth: { title: 'צמיחה אורגנית', text: 'נראות בגוגל ובתשובות של בינה מלאכותית, בלי קמפיינים.' },
    trust: { title: 'אמון ופרטיות', text: 'סודיות, נגישות ושליטה של עורכת הדין בתוכן.' },
    platform: { title: 'תשתית', text: 'מהירות, אבטחה ותחזוקה פשוטה.' },
  } satisfies Record<CapabilityGroup, { title: string; text: string }>,

  capabilities: [
    {
      id: 'chat-local',
      group: 'chat',
      status: 'live',
      title: 'עונה בלי מודל חיצוני',
      text: 'מנוע חיפוש עברי על תוכן האתר ועל מה שעורכת הדין לימדה. עובד גם בלי מפתח API, בלי עלות ובלי שמידע יוצא החוצה. כשיש מודל (Claude או Gemini), הוא מקבל את אותו ידע.',
      tryPrompt: 'כמה עולה ייעוץ ראשוני?',
    },
    {
      id: 'chat-nav',
      group: 'chat',
      status: 'live',
      title: 'הצ׳אט מנהל את האתר',
      text: 'אומרים מה רוצים לראות והאתר זז: גולל לחלק הנכון ומדגיש אותו, או פותח את העמוד.',
      tryPrompt: 'תראי לי את ההמלצות',
    },
    {
      id: 'chat-intake',
      group: 'chat',
      status: 'live',
      title: 'קליטת פנייה מסודרת',
      text: 'כמה שאלות קצרות בלי לפרט את המקרה, ואישור מפורש. הפנייה עוברת למשרד, או מוכנה כהודעת וואטסאפ.',
      tryPrompt: 'אני רוצה לדבר עם ליאור',
    },
    {
      id: 'chat-voice',
      group: 'chat',
      status: 'live',
      title: 'דיבור והקראה',
      text: 'מיקרופון ושאלה בקול, והקראה של התשובה. נעשה בדפדפן של המבקר.',
    },
    {
      id: 'chat-empathy',
      group: 'chat',
      status: 'live',
      title: 'תשובה שמתאימה למצב',
      text: 'מזהה מצב אישי ("פיטרו אותי אחרי חופשת לידה", "המשטרה התקשרה אליי"), פותחת במשפט אנושי ומכוונת לצעד הנכון, ושולחת מיד לטלפון כשהעניין דחוף.',
      tryPrompt: 'פיטרו אותי אחרי שחזרתי מחופשת לידה',
    },
    {
      id: 'chat-teach',
      group: 'trust',
      status: 'live',
      title: 'עורכת הדין מלמדת את הצ׳אט',
      text: 'דף ניהול מוגן בסיסמה: שאלות שלא נענו, ותשובות שליאור כותבת במילים שלה ונכנסות לצ׳אט מיד.',
    },
    {
      id: 'chat-approve',
      group: 'trust',
      status: 'live',
      title: 'טיוטה, אישור ואזהרות ניסוח',
      text: 'תשובה חדשה מחכה לאישור, אפשר לבדוק אותה לפני פרסום, והמערכת מזהירה על הבטחות תוצאה ופרטים אישיים, בהתאם לכללי הפרסום של הלשכה.',
    },
    {
      id: 'avatar-video',
      group: 'avatar',
      status: 'live',
      title: 'עוזרת מדברת, בקול של עורכת הדין',
      text: 'וידאו היכרות שנוצר מתמונה ומקול משובט, עם כתוביות ותמלול. הכול נעשה מקומית, בלי שירות חיצוני, ומסומן "נוצר בבינה מלאכותית".',
    },
    {
      id: 'avatar-tour',
      group: 'avatar',
      status: 'live',
      title: 'סיור שמדגיש את האתר',
      text: 'בזמן שהיא מדברת, החלק שהיא מזכירה נדלק באתר: הצ׳אט, המיקרופון, המדריכים, ההמלצות ויצירת הקשר.',
    },
    {
      id: 'growth-seo',
      group: 'growth',
      status: 'live',
      title: 'סוכן קידום אורגני',
      text: 'בודק את האתר מדי שבוע, מתקן מה שבטוח, מכין טיוטות תוכן לאישור ופותח בקשת שינוי. לא מפרסם לבד.',
    },
    {
      id: 'growth-watch',
      group: 'growth',
      status: 'live',
      title: 'מעקב אחרי שינויים בגוגל ובבינה מלאכותית',
      text: 'סוכן שקורא מקורות רשמיים בלבד, מסווג כל שינוי, מעריך את ההשפעה על האתר ומציע צעדים בטוחים. בלי ניצול פרצות ובלי מניפולציה.',
    },
    {
      id: 'growth-geo',
      group: 'growth',
      status: 'live',
      title: 'מוכן למנועי תשובות',
      text: 'נתונים מובנים (JSON-LD), קובץ llms.txt ותוכן שנכתב כך שמנועי בינה מלאכותית יוכלו לצטט אותו.',
    },
    {
      id: 'trust-a11y',
      group: 'trust',
      status: 'live',
      title: 'נגישות מובנית',
      text: 'HTML סמנטי, ניווט במקלדת, כיבוד "הפחתת תנועה", ותפריט נגישות. נבדק בדפדפן אמיתי.',
    },
    {
      id: 'trust-legal',
      group: 'trust',
      status: 'live',
      title: 'מסמכים וצעדי פרטיות',
      text: 'מדיניות פרטיות, הצהרת נגישות, תנאי שימוש והסכמה לעוגיות. הצ׳אט מבקש שלא למסור פרטים רגישים.',
    },
    {
      id: 'trust-redact',
      group: 'trust',
      status: 'live',
      title: 'הסרת פרטים מזהים לפני מודל חיצוני',
      text: 'טלפונים, מספרי זהות, כרטיסי אשראי ודוא״ל מוסרים מההודעה לפני שהיא נשלחת למודל, ולפני שהיא נשמרת.',
    },
    {
      id: 'plat-white',
      group: 'platform',
      status: 'live',
      title: 'קובץ אחד לכל משרד חדש',
      text: 'שם, צבעים, תחומי עיסוק, המלצות, שאלות, וידאו ויצירת קשר מוגדרים במקום אחד. אין מחרוזת של לקוח בקוד.',
    },
    {
      id: 'plat-stack',
      group: 'platform',
      status: 'live',
      title: 'תשתית מודרנית',
      text: 'Next.js 16, React 19, TypeScript במצב קפדני, Tailwind 4, אנימציות שמכבדות העדפות משתמש, ומעבר חלק למובייל ול-RTL.',
    },
    {
      id: 'chat-prefs',
      group: 'chat',
      status: 'live',
      title: 'פגישה במשרד או בזום, בזמן נוח',
      text: 'בקליטת הפנייה בוחרים איפה ומתי נוח, והעדפה זו מגיעה למשרד יחד עם הפרטים.',
    },
    {
      id: 'next-docs',
      group: 'chat',
      status: 'live',
      title: 'קריאת מכתב בתוך השיחה, בלי שהוא יוצא מהמכשיר',
      text: 'מצלמים מכתב פיטורים, זימון לשימוע או הזמנה לחקירה, והדפדפן קורא אותו בעברית ומזהה את סוג המסמך והתאריכים שבו. שום דבר לא נשלח החוצה. לא קובע מועדים ולא נותן ייעוץ. תמונות בלבד כרגע, ו-PDF בהמשך.',
    },
    {
      id: 'next-booking',
      group: 'chat',
      status: 'planned',
      title: 'תיאום פגישה ביומן',
      text: 'חיבור ליומן, הצעת מועדים פנויים ואישור, עם סיכום קצר לעורכת הדין. דורש חיבור לחשבון היומן של המשרד.',
    },
    {
      id: 'next-lang',
      group: 'chat',
      status: 'planned',
      title: 'רב-לשוניות',
      text: 'אנגלית, רוסית וערבית, בלי להבטיח שהמשרד משרת בשפה שאינו דובר.',
    },
    {
      id: 'next-dash',
      group: 'trust',
      status: 'live',
      title: 'לוח נתונים בלי לפגוע בפרטיות',
      text: 'מה נשאל הכי הרבה, כמה שיחות לא נענו, כמה סומנו "לא עזר" וכמה השאירו פרטים. נשמרים רק מספרים ונושא כללי, לא השאלות עצמן.',
    },
    {
      id: 'next-private',
      group: 'trust',
      status: 'planned',
      title: 'מודל על שרת של המשרד',
      text: 'אפשרות להריץ את המודל במקום שבו המידע לא עוזב את המשרד, ולבדוק את איכותו מול מודל ענן לפני שמחליטים.',
    },
  ] satisfies Capability[],

  stack: [
    ['Next.js 16 + React 19', 'רינדור בשרת, מהירות ו-SEO'],
    ['TypeScript במצב קפדני', 'פחות תקלות, תחזוקה פשוטה'],
    ['Tailwind CSS 4', 'עיצוב עקבי, מובייל קודם, RTL נכון'],
    ['Vercel AI SDK + Claude / Gemini', 'הצ׳אט, עם מעבר חלק בין ספקים'],
    ['מנוע חיפוש עברי מקומי', 'גיבוי שעובד בלי מודל ובלי עלות'],
    ['Supabase (אופציונלי)', 'חיפוש סמנטי והיסטוריית שיחות'],
    ['Claude Code: כישורים וסוכנים', 'קידום, מעקב, בניית אווטאר וביקורת'],
    ['מודלים מקומיים', 'קול ופנים שנוצרים על המחשב, בלי שירות חיצוני'],
  ] as [name: string, role: string][],

  packages: [
    {
      name: 'אתר + עוזרת',
      forWho: 'משרד שרוצה אתר מקצועי עם עוזרת שמובילה את המבקר',
      includes: ['אתר בתבנית, בצבעים ובתוכן של המשרד', 'עוזרת שיחה עם ידע מהאתר', 'קליטת פניות ווואטסאפ', 'נגישות וקידום אורגני בסיסי'],
    },
    {
      name: 'עם אווטאר וסיור',
      forWho: 'משרד שרוצה נוכחות אנושית ובידול',
      includes: ['הכול מהחבילה הראשונה', 'וידאו היכרות בקול ובפנים של עורכת הדין, באישורה בכתב', 'סיור שמדגיש את האתר'],
    },
    {
      name: 'צמיחה מתמשכת',
      forWho: 'משרד שרוצה להתקדם בלי לנהל את זה בעצמו',
      includes: ['סוכן קידום אורגני שבועי', 'מעקב שינויים בגוגל ובבינה מלאכותית', 'דף ניהול ללימוד העוזרת'],
    },
  ] as { name: string; forWho: string; includes: string[] }[],

  notes: [
    'פרסום של עורכי דין כפוף לכללי לשכת עורכי הדין. תוכן, המלצות וסרטונים מאושרים על ידי עורכת הדין לפני פרסום.',
    'אווטאר וקול משובט נעשים רק באישור כתוב של האדם, ומסומנים כנוצרים בבינה מלאכותית.',
    'העוזרת אינה נותנת ייעוץ משפטי ואינה מבטיחה תוצאות.',
  ],

  /** Where interested firms reach out. Both empty = the button is hidden. */
  contact: { whatsapp: '', email: '' },
};
