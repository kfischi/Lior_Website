import { defineField, defineType } from 'sanity';

/**
 * Content types the office edits in the Studio (/studio).
 * Titles and help texts are in Hebrew, because the people who edit are not developers.
 * The field names match the shapes in src/lib/brand.ts, so the site can use either source.
 */

export const faqItem = defineType({
  name: 'faqItem',
  title: 'שאלה נפוצה',
  type: 'document',
  fields: [
    defineField({
      name: 'question',
      title: 'השאלה',
      type: 'string',
      validation: (rule) => rule.required().min(5).max(160),
    }),
    defineField({
      name: 'answer',
      title: 'התשובה',
      type: 'text',
      rows: 5,
      description: 'תשובה כללית וקצרה. בלי הבטחת תוצאות ובלי ייעוץ למקרה מסוים.',
      validation: (rule) => rule.required().min(10).max(1200),
    }),
    defineField({
      name: 'order',
      title: 'מקום ברשימה',
      type: 'number',
      description: 'מספר נמוך מופיע קודם. השאלות הראשונות מוצגות בעמוד הבית.',
      initialValue: 100,
      validation: (rule) => rule.required().integer().min(0).max(10000),
    }),
  ],
  orderings: [{ title: 'לפי מקום ברשימה', name: 'byOrder', by: [{ field: 'order', direction: 'asc' }] }],
  preview: { select: { title: 'question', subtitle: 'answer' } },
});

export const testimonial = defineType({
  name: 'testimonial',
  title: 'המלצה',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'שם המומלץ',
      type: 'string',
      description: 'שם פרטי או ראשי תיבות, ועיר אם מופיעה במקור. למשל: "חנה, צפת".',
      validation: (rule) => rule.required().max(60),
    }),
    defineField({
      name: 'date',
      title: 'תאריך פרסום במקור',
      type: 'date',
      options: { dateFormat: 'DD/MM/YYYY' },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'rating',
      title: 'דירוג (0 עד 5)',
      type: 'number',
      description: 'בדיוק כפי שמופיע במקור.',
      initialValue: 5,
      validation: (rule) => rule.required().min(0).max(5),
    }),
    defineField({
      name: 'text',
      title: 'נוסח ההמלצה',
      type: 'text',
      rows: 5,
      description:
        'מילה במילה כפי שפורסם. לא מפרסמים המלצה שמתארת תוצאה ("זיכתה אותי"), את מצבו הרפואי או התיק של הלקוח, או את המילה "מומחית". יש לקבל אישור של עורכת הדין לפני פרסום.',
      validation: (rule) => rule.required().min(5).max(900),
    }),
  ],
  orderings: [{ title: 'החדשות קודם', name: 'newest', by: [{ field: 'date', direction: 'desc' }] }],
  preview: { select: { title: 'name', subtitle: 'text' } },
});

export const pressArticle = defineType({
  name: 'pressArticle',
  title: 'כתבה בתקשורת',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'כותרת', type: 'string', validation: (rule) => rule.required().max(160) }),
    defineField({
      name: 'outlet',
      title: 'שם האתר או העיתון',
      type: 'string',
      validation: (rule) => rule.required().max(60),
    }),
    defineField({ name: 'date', title: 'תאריך פרסום', type: 'date', options: { dateFormat: 'DD/MM/YYYY' } }),
    defineField({
      name: 'url',
      title: 'קישור לכתבה',
      type: 'url',
      validation: (rule) => rule.required().uri({ scheme: ['https'] }),
    }),
    defineField({
      name: 'excerpt',
      title: 'ציטוט קצר מהכתבה (לא חובה)',
      type: 'text',
      rows: 3,
      validation: (rule) => rule.max(300),
    }),
  ],
  orderings: [{ title: 'החדשות קודם', name: 'newest', by: [{ field: 'date', direction: 'desc' }] }],
  preview: { select: { title: 'title', subtitle: 'outlet' } },
});

const faqEntry = defineType({
  name: 'faqEntry',
  title: 'שאלה ותשובה',
  type: 'object',
  fields: [
    defineField({ name: 'question', title: 'השאלה', type: 'string', validation: (rule) => rule.required().max(200) }),
    defineField({ name: 'answer', title: 'התשובה', type: 'text', rows: 4, validation: (rule) => rule.required().max(1500) }),
  ],
  preview: { select: { title: 'question', subtitle: 'answer' } },
});

const articleSection = defineType({
  name: 'articleSection',
  title: 'פרק במדריך',
  type: 'object',
  fields: [
    defineField({
      name: 'heading',
      title: 'כותרת הפרק',
      type: 'string',
      description: 'מומלץ לנסח כשאלה, כפי שאנשים שואלים.',
      validation: (rule) => rule.required().max(160),
    }),
    defineField({
      name: 'paragraphs',
      title: 'פסקאות',
      type: 'array',
      of: [{ type: 'text', rows: 4 }],
      validation: (rule) => rule.required().min(1),
    }),
    defineField({ name: 'bullets', title: 'רשימת נקודות (לא חובה)', type: 'array', of: [{ type: 'string' }] }),
  ],
  preview: { select: { title: 'heading' } },
});

export const article = defineType({
  name: 'article',
  title: 'מדריך',
  type: 'document',
  description:
    'מידע כללי בלבד, בלי ייעוץ למקרה מסוים ובלי הבטחת תוצאות. לא מציינים סכומים, מועדים או אחוזים שלא אומתו. יש לקבל אישור של עורכת הדין לפני פרסום.',
  fields: [
    defineField({ name: 'title', title: 'כותרת', type: 'string', validation: (rule) => rule.required().max(160) }),
    defineField({
      name: 'slug',
      title: 'כתובת העמוד (באנגלית)',
      type: 'slug',
      options: { source: 'title', maxLength: 80 },
      description: 'חלק מהקישור, למשל workplace-bullying. אל תשנו אחרי פרסום: הקישור הישן יפסיק לעבוד.',
      validation: (rule) =>
        rule.required().custom((value) => (value?.current && /^[a-z0-9-]+$/.test(value.current) ? true : 'אותיות באנגלית קטנות, ספרות ומקפים בלבד')),
    }),
    defineField({
      name: 'areaSlug',
      title: 'תחום עיסוק',
      type: 'string',
      options: {
        list: [
          { title: 'משפט פלילי', value: 'criminal-law' },
          { title: 'נזיקין', value: 'torts' },
          { title: 'מעמד אישי', value: 'personal-status' },
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'tldr',
      title: 'תשובה קצרה בראש העמוד',
      type: 'text',
      rows: 4,
      description: 'שניים עד שלושה משפטים שעונים ישירות על השאלה. זה הטקסט ששואבים מנועי חיפוש ובינה מלאכותית.',
      validation: (rule) => rule.required().max(700),
    }),
    defineField({
      name: 'seoTitle',
      title: 'כותרת לגוגל',
      type: 'string',
      validation: (rule) => rule.required().max(70),
    }),
    defineField({
      name: 'seoDescription',
      title: 'תיאור לגוגל',
      type: 'text',
      rows: 3,
      validation: (rule) => rule.required().min(80).max(200),
    }),
    defineField({ name: 'published', title: 'תאריך פרסום', type: 'date', validation: (rule) => rule.required() }),
    defineField({ name: 'updated', title: 'תאריך עדכון אחרון', type: 'date', validation: (rule) => rule.required() }),
    defineField({
      name: 'readingMinutes',
      title: 'דקות קריאה',
      type: 'number',
      initialValue: 4,
      validation: (rule) => rule.required().integer().min(1).max(60),
    }),
    defineField({
      name: 'sections',
      title: 'פרקים',
      type: 'array',
      of: [{ type: 'articleSection' }],
      validation: (rule) => rule.required().min(1),
    }),
    defineField({ name: 'faq', title: 'שאלות ותשובות בסוף המדריך', type: 'array', of: [{ type: 'faqEntry' }] }),
    defineField({
      name: 'order',
      title: 'מקום ברשימה',
      type: 'number',
      description: 'מספר נמוך מופיע קודם.',
      initialValue: 100,
      validation: (rule) => rule.required().integer().min(0).max(10000),
    }),
  ],
  orderings: [{ title: 'לפי מקום ברשימה', name: 'byOrder', by: [{ field: 'order', direction: 'asc' }] }],
  preview: { select: { title: 'title', subtitle: 'areaSlug' } },
});

export const videoReview = defineType({
  name: 'videoReview',
  title: 'סרטון המלצה',
  type: 'document',
  fields: [
    defineField({
      name: 'label',
      title: 'שם הסרטון',
      type: 'string',
      description: 'למשל: ביקורת וידאו מלקוחה. המספר מתווסף אוטומטית.',
      validation: (rule) => rule.required().max(80),
    }),
    defineField({
      name: 'youtubeId',
      title: 'מזהה סרטון ביוטיוב',
      type: 'string',
      description: '11 התווים אחרי v= בקישור, או אחרי youtu.be/ או shorts/. הסרטון נטען רק אחרי לחיצה על ניגון. מלאו את זה או את קובץ הווידאו, לא את שניהם.',
      validation: (rule) => rule.regex(/^[A-Za-z0-9_-]{11}$/, { name: 'מזהה יוטיוב' }),
    }),
    defineField({
      name: 'src',
      title: 'קובץ וידאו באתר',
      type: 'string',
      description: 'נתיב לקובץ שהועלה לתיקיית public/videos, למשל /videos/review-1.mp4. אחראי האתר מעלה את הקובץ.',
    }),
    defineField({ name: 'poster', title: 'תמונת שער', type: 'string', description: 'נתיב לתמונה, למשל /videos/review-1.webp.' }),
    defineField({ name: 'landscape', title: 'סרטון רחב (לרוחב)', type: 'boolean', initialValue: false }),
    defineField({
      name: 'note',
      title: 'תיאור קצר מתחת לסרטון',
      type: 'text',
      rows: 3,
      description: 'רק נוסח שעורכת הדין אישרה. בלי בית משפט, רקע הלקוח או מה הואשם הצד השני.',
      validation: (rule) => rule.max(400),
    }),
    defineField({
      name: 'order',
      title: 'מקום ברשימה',
      type: 'number',
      initialValue: 100,
      validation: (rule) => rule.required().integer().min(0).max(10000),
    }),
  ],
  validation: (rule) =>
    rule.custom((doc) => {
      const d = doc as { youtubeId?: string; src?: string } | undefined;
      return d?.youtubeId || d?.src ? true : 'צריך מזהה יוטיוב או קובץ וידאו';
    }),
  orderings: [{ title: 'לפי מקום ברשימה', name: 'byOrder', by: [{ field: 'order', direction: 'asc' }] }],
  preview: { select: { title: 'label', subtitle: 'youtubeId' } },
});

export const schemaTypes = [faqItem, testimonial, pressArticle, article, videoReview, faqEntry, articleSection];
