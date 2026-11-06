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

export const schemaTypes = [faqItem, testimonial, pressArticle];
