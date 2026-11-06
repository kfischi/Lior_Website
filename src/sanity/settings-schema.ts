import { defineField, defineType } from 'sanity';

/**
 * "Site settings": one document that holds the texts, contact details and colors of the whole site.
 * Everything here is optional: a field left empty keeps the value from brand.ts, so a new client
 * can start with nothing and fill it in gradually.
 */

const text = (name: string, title: string, description?: string, rows?: number) =>
  defineField({ name, title, type: rows ? 'text' : 'string', rows, description });

const list = (name: string, title: string, description?: string) =>
  defineField({ name, title, type: 'array', of: [{ type: 'string' }], description });

const hex = (name: string, title: string, description: string) =>
  defineField({
    name,
    title,
    type: 'string',
    description,
    validation: (rule) => rule.regex(/^#[0-9a-fA-F]{6}$/, { name: 'צבע', invert: false }).error('קוד צבע כמו #1A3742'),
  });

const group = (name: string, title: string, description: string, fields: ReturnType<typeof defineField>[]) =>
  defineField({
    name,
    title,
    type: 'object',
    description,
    options: { collapsible: true, collapsed: true },
    fields,
  });

export const ICON_OPTIONS = [
  { title: 'מאזניים', value: 'Scale' },
  { title: 'פטיש שופט', value: 'Gavel' },
  { title: 'אנשים', value: 'Users' },
  { title: 'מבנה', value: 'Building2' },
  { title: 'תיק', value: 'Briefcase' },
  { title: 'מגן', value: 'ShieldCheck' },
  { title: 'לחיצת יד', value: 'HeartHandshake' },
  { title: 'פרס', value: 'Award' },
  { title: 'עין', value: 'Eye' },
  { title: 'שעון', value: 'Clock' },
];

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'הגדרות האתר',
  type: 'document',
  description: 'שדה שנשאר ריק יציג את הערך המקורי של האתר. אין צורך למלא הכול.',
  fields: [
    group('identity', 'שם ותיאור המשרד', 'השם שמופיע בכותרות, בכותרת הדפדפן ובנתונים שגוגל קורא.', [
      text('firmName', 'שם המשרד המלא'),
      text('firmNameShort', 'שם קצר (בתפריט העליון)'),
      text('tagline', 'משפט מפתח (בתחתית האתר)'),
      text('attorneyName', 'שם עורכת הדין'),
      text('description', 'תיאור קצר של המשרד', 'מופיע בתוצאות חיפוש ובשיתוף ברשתות. עד כ-300 תווים.', 4),
    ]),
    group('contact', 'פרטי קשר', 'מופיעים בתפריט, באזור יצירת הקשר, בתחתית האתר ובנתוני החיפוש.', [
      text('phone', 'טלפון להצגה', 'כפי שיופיע באתר, למשל 052-469-4158'),
      text('phoneE164', 'טלפון בפורמט בינלאומי', 'ספרות בלבד, בלי פלוס, למשל 972524694158. משמש לקישור "חיוג".'),
      text('whatsapp', 'מספר וואטסאפ', 'ספרות בלבד בפורמט בינלאומי.'),
      text('fax', 'פקס'),
      text('email', 'דוא״ל'),
      text('hours', 'שעות פעילות'),
      text('street', 'רחוב ומספר'),
      text('city', 'עיר'),
      text('postalCode', 'מיקוד'),
      text('mapUrl', 'קישור למפה', 'קישור Google Maps.'),
      text('facebook', 'פייסבוק (כתובת מלאה)'),
      text('linkedin', 'לינקדאין (כתובת מלאה)'),
      text('instagram', 'אינסטגרם (כתובת מלאה)'),
    ]),
    group('colors', 'צבעי האתר', 'משנים את כל האתר ואת הממשק הזה. שימו לב לניגודיות: טקסט על רקע חייב להישאר קריא.', [
      hex('navy', 'צבע ראשי כהה', 'רקעים כהים וכותרות.'),
      hex('cream', 'צבע רקע בהיר', 'רקע הדפים.'),
      hex('accent', 'צבע הדגשה', 'כפתורים וקישורים על רקע בהיר.'),
      hex('accentLight', 'צבע הדגשה בהיר', 'הדגשות על רקע כהה.'),
      hex('ink', 'צבע טקסט', 'טקסט הגוף.'),
    ]),
    group('hero', 'פתיחת העמוד הראשי', 'הכותרת הגדולה בראש האתר. הווידאו עצמו מוחלף על ידי מפתח האתר.', [
      text('eyebrow', 'שורה קטנה מעל הכותרת'),
      text('title', 'כותרת ראשית'),
      text('subtitle', 'משפט משנה', undefined, 3),
      text('primaryCta', 'טקסט כפתור ראשי', 'למשל: לקביעת ייעוץ'),
      text('secondaryCta', 'טקסט כפתור שני', 'למשל: וואטסאפ'),
    ]),
    group('chat', 'העוזרת הווירטואלית (צ׳אט)', 'הטקסטים שהצ׳אט מציג. ההתנהגות שלו נקבעת בקוד.', [
      text('assistantName', 'שם העוזרת'),
      text('greeting', 'ברכת פתיחה', undefined, 3),
      list('suggestedPrompts', 'שאלות מוצעות (כפתורים)', 'עד 8, קצרות.'),
      text('disclaimer', 'הבהרה משפטית קצרה', 'מופיעה בצ׳אט ובעמוד השאלות.'),
    ]),
    defineField({
      name: 'trustStats',
      title: 'פס נתונים (ניסיון)',
      type: 'array',
      description: 'מספרים מאומתים בלבד, למשל "21 שנות ניסיון". ריק = המספר המחושב של האתר.',
      of: [
        {
          type: 'object',
          name: 'stat',
          fields: [
            defineField({ name: 'value', title: 'המספר', type: 'string', validation: (r) => r.required().max(12) }),
            defineField({ name: 'label', title: 'התיאור', type: 'string', validation: (r) => r.required().max(40) }),
          ],
          preview: { select: { title: 'value', subtitle: 'label' } },
        },
      ],
    }),
    group('about', 'אודות', 'הטקסט עליה ועל המשרד. רק נוסח שעורכת הדין אישרה.', [
      text('heading', 'כותרת'),
      text('body', 'פסקה ראשית', undefined, 6),
      text('quote', 'ציטוט מודגש', undefined, 3),
      list('credentials', 'הכשרה וניסיון (שורות קצרות)'),
      defineField({ name: 'more', title: 'פסקאות נוספות', type: 'array', of: [{ type: 'text', rows: 4 }] }),
    ]),
    list('marquee', 'מילים בפס הנע מתחת לפתיחה', 'מילה או שתיים. תחומי העיסוק מתווספים אוטומטית.'),
    group('process', '״איך זה עובד״', 'שלושה צעדים.', [
      text('eyebrow', 'שורה קטנה'),
      text('heading', 'כותרת'),
      defineField({
        name: 'steps',
        title: 'הצעדים',
        type: 'array',
        of: [
          {
            type: 'object',
            name: 'step',
            fields: [
              defineField({ name: 'title', title: 'כותרת', type: 'string', validation: (r) => r.required().max(60) }),
              defineField({ name: 'text', title: 'הסבר', type: 'text', rows: 3, validation: (r) => r.required().max(300) }),
            ],
            preview: { select: { title: 'title', subtitle: 'text' } },
          },
        ],
      }),
    ]),
    group('whyUs', '״למה אנחנו״', 'עקרונות העבודה של המשרד.', [
      text('intro', 'משפט פתיחה'),
      defineField({
        name: 'items',
        title: 'העקרונות',
        type: 'array',
        of: [
          {
            type: 'object',
            name: 'principle',
            fields: [
              defineField({ name: 'title', title: 'כותרת', type: 'string', validation: (r) => r.required().max(60) }),
              defineField({
                name: 'description',
                title: 'הסבר',
                type: 'text',
                rows: 3,
                validation: (r) => r.required().max(300),
              }),
              defineField({
                name: 'icon',
                title: 'סמל',
                type: 'string',
                options: { list: ICON_OPTIONS },
                initialValue: 'Scale',
              }),
            ],
            preview: { select: { title: 'title', subtitle: 'description' } },
          },
        ],
      }),
    ]),
    group('seo', 'קידום בגוגל (עמוד הבית)', 'הכותרת והתיאור שמופיעים בתוצאות החיפוש.', [
      text('homeTitle', 'כותרת הדף', 'כ-50 עד 60 תווים.'),
      text('homeDescription', 'תיאור הדף', 'כ-120 עד 160 תווים.', 3),
      text('titleSuffix', 'סיומת לכותרות עמודים פנימיים'),
    ]),
  ],
  preview: { prepare: () => ({ title: 'הגדרות האתר' }) },
});

export const practiceArea = defineType({
  name: 'practiceArea',
  title: 'תחום עיסוק',
  type: 'document',
  description: 'כל תחום מקבל עמוד משלו. מידע כללי בלבד, בלי ייעוץ למקרה מסוים ובלי הבטחת תוצאות. נדרש אישור של עורכת הדין.',
  fields: [
    defineField({ name: 'title', title: 'שם התחום', type: 'string', validation: (r) => r.required().max(60) }),
    defineField({
      name: 'slug',
      title: 'כתובת העמוד (באנגלית)',
      type: 'slug',
      options: { source: 'title', maxLength: 60 },
      description: 'אל תשנו אחרי פרסום: הקישור הישן יפסיק לעבוד.',
      validation: (r) =>
        r.required().custom((v) => (v?.current && /^[a-z0-9-]+$/.test(v.current) ? true : 'אותיות באנגלית קטנות, ספרות ומקפים')),
    }),
    defineField({
      name: 'description',
      title: 'תיאור קצר (בכרטיס בעמוד הבית)',
      type: 'text',
      rows: 3,
      validation: (r) => r.required().max(400),
    }),
    defineField({ name: 'icon', title: 'סמל', type: 'string', options: { list: ICON_OPTIONS }, initialValue: 'Scale' }),
    defineField({ name: 'seoTitle', title: 'כותרת לגוגל', type: 'string', validation: (r) => r.required().max(80) }),
    defineField({ name: 'seoDescription', title: 'תיאור לגוגל', type: 'text', rows: 3, validation: (r) => r.required().max(220) }),
    defineField({
      name: 'intro',
      title: 'פסקאות פתיחה',
      type: 'array',
      of: [{ type: 'text', rows: 4 }],
      validation: (r) => r.required().min(1),
    }),
    defineField({ name: 'handles', title: 'במה המשרד מסייע', type: 'array', of: [{ type: 'string' }] }),
    defineField({ name: 'steps', title: 'צעדים ראשונים מומלצים', type: 'array', of: [{ type: 'string' }] }),
    defineField({ name: 'faq', title: 'שאלות ותשובות', type: 'array', of: [{ type: 'faqEntry' }] }),
    defineField({
      name: 'order',
      title: 'מקום ברשימה',
      type: 'number',
      initialValue: 100,
      validation: (r) => r.required().integer().min(0).max(10000),
    }),
  ],
  orderings: [{ title: 'לפי מקום ברשימה', name: 'byOrder', by: [{ field: 'order', direction: 'asc' }] }],
  preview: { select: { title: 'title', subtitle: 'description' } },
});
