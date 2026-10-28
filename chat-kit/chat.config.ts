import type { ChatKitConfig } from './src/types';

/**
 * ⭐ The only file you edit for a new client: names, texts, questions and answers, media and contact links.
 * Everything below is a neutral example for a law firm; replace it with the real content (reviewed by the attorney).
 */
export const chatConfig: ChatKitConfig = {
  assistantName: 'העוזרת הווירטואלית',
  firmName: 'משרד עורכי דין לדוגמה',
  tagline: 'זמינה כל שעה',
  locale: 'he',

  welcome: {
    message:
      'שלום, ברוכים הבאים. אני העוזרת הווירטואלית של המשרד. אפשר לשאול אותי כל שאלה, בכתב או בקול, ואכוון אתכם לתחום הנכון. מה מעניין אתכם?',
    // Put these files in /public (see README). Every line below is optional.
    // poster: '/chat-kit/assistant.webp',
    // video: [{ src: '/chat-kit/assistant.webm', type: 'video/webm' }],
    // audio: '/chat-kit/part-01.webm',
    // captions: [{ start: 0, text: 'שלום, ברוכים הבאים.' }, { start: 3.2, text: 'אני העוזרת הווירטואלית של המשרד.' }],
  },
  autoOpenAfterMs: 4000,

  knowledge: [
    {
      id: 'first-meeting',
      question: 'איך קובעים פגישת ייעוץ?',
      keywords: ['פגישה', 'פגישת ייעוץ', 'לקבוע פגישה', 'ייעוץ', 'זום', 'תור'],
      answer:
        'אפשר לקבוע פגישה בטלפון, בוואטסאפ או דרך טופס יצירת הקשר באתר. הפגישה הראשונה היא כדי להבין את המקרה ולהסביר את האפשרויות. אפשר גם בזום.',
      quickReply: true,
      links: [{ label: 'וואטסאפ', href: 'https://wa.me/972500000000' }],
    },
    {
      id: 'fees',
      question: 'כמה זה עולה?',
      keywords: ['עלות', 'שכר טרחה', 'מחיר', 'כמה עולה', 'תשלום'],
      answer:
        'שכר הטרחה תלוי בסוג ההליך ובהיקף העבודה, ונקבע מראש בהסכם כתוב. בפגישה הראשונה תקבלו הערכה ברורה.',
      quickReply: true,
    },
    {
      id: 'chat-privacy',
      question: 'האם השיחה כאן חסויה?',
      keywords: ['חסוי', 'סודיות', 'פרטיות', 'דיסקרטי', 'צ׳אט', "צ'אט"],
      answer:
        'אני עוזרת וירטואלית ולא עורכת דין, ולכן לא ניתן כאן ייעוץ משפטי. אפשר לשתף פרטים כלליים בלבד. בשיחה עם עורכת הדין עצמה חלה חובת סודיות מלאה.',
      quickReply: true,
    },
  ],

  fallback: {
    message:
      'לא בטוחה שהבנתי. אפשר לנסח אחרת, או להשאיר פרטים ונחזור אליכם בהקדם. אני לא יכולה לתת ייעוץ משפטי, אבל אפשר לקבוע פגישה עם עורכת הדין.',
    links: [{ label: 'וואטסאפ', href: 'https://wa.me/972500000000' }],
  },

  urgent: {
    keywords: ['מעצר', 'נעצר', 'חקירה', 'חקירה במשטרה', 'זימון לחקירה', 'דחוף', 'אלימות'],
    message: 'אם זה דחוף או אם יש סכנה, אפשר להתקשר עכשיו למשרד, ובמצב חירום לפנות למשטרה במספר 100.',
    links: [{ label: 'להתקשר למשרד', href: 'tel:+972500000000' }],
  },

  // Browser voices read some words badly. Left: how it is written on screen. Right: how to spell it for the voice.
  pronunciations: {
    "צ'אט": 'טשאט',
    'צ׳אט': 'טשאט',
    'וואטסאפ': 'וואטסאפ',
    'זום': 'זום',
  },

  labels: {
    open: 'צ׳אט עם העוזרת',
    close: 'סגירת הצ׳אט',
    placeholder: 'כתבו כאן את השאלה',
    send: 'שליחה',
    mic: 'דיבור במקום הקלדה',
    micStop: 'עצירת ההקלטה',
    listen: 'הקראה בקול',
    stopListening: 'עצירת ההקראה',
    mute: 'השתקה',
    unmute: 'ביטול השתקה',
    transcript: 'תמלול הפתיחה',
    typing: 'העוזרת כותבת…',
    quickRepliesTitle: 'שאלות נפוצות',
    voiceUnsupported: 'אין הרשאה למיקרופון, או שאין מיקרופון. אפשר להקליד.',
  },
};
