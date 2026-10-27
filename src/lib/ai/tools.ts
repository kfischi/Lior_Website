import { tool } from 'ai';
import { z } from 'zod';
import { brand, telHref, whatsappHref, mailHref } from '@/lib/brand';
import { buildWhatsAppHref } from '@/lib/lead';
import { logUnknown } from '@/lib/learning/store';
import { sanitizeQuestion } from '@/lib/learning/sanitize';

/**
 * Tools the chatbot can call. Read-only and safe: they surface firm information
 * or build links the visitor chooses to click. Nothing is sent on their behalf.
 */
export const chatTools = {
  getContactOptions: tool({
    description:
      'החזר את דרכי יצירת הקשר של המשרד (טלפון, וואטסאפ, דוא"ל, כתובת, שעות). ' +
      'השתמש כשהמשתמש מבקש פרטי קשר, כתובת או שעות פעילות.',
    inputSchema: z.object({}),
    execute: async () => ({
      phone: brand.phone,
      telHref,
      whatsapp: whatsappHref,
      email: brand.email,
      mailHref,
      address: `${brand.address.street}, ${brand.address.city}`,
      hours: brand.hours,
    }),
  }),

  listPracticeAreas: tool({
    description: 'החזר את רשימת תחומי העיסוק של המשרד עם תיאור קצר לכל תחום.',
    inputSchema: z.object({}),
    execute: async () =>
      brand.practiceAreas.map((a) => ({ title: a.title, description: a.description })),
  }),

  flagUnknownQuestion: tool({
    description:
      'תעד שאלה כללית שאין לך עליה תשובה מבוססת בבסיס הידע, כדי שעורכת הדין תלמד אותך תשובה. ' +
      'נסח את השאלה מחדש בצורה כללית, בלי שם, טלפון או פרטים מזהים על המקרה.',
    inputSchema: z.object({
      question: z.string().min(3).max(200).describe('השאלה בניסוח כללי וללא פרטים מזהים'),
    }),
    execute: async ({ question }) => {
      // Defence in depth: strip anything that looks like a phone, ID or email.
      const clean = sanitizeQuestion(question);
      if (clean.length >= 3) {
        try {
          await logUnknown(clean);
        } catch (err) {
          console.error('Logging unknown question failed (non-fatal):', err);
        }
      }
      return { logged: true };
    },
  }),

  startIntake: tool({
    description:
      'הצע למשתמש להשאיר פרטים לקביעת ייעוץ בתהליך קצר ומסודר בתוך הצ׳אט (שם, תחום, דחיפות, טלפון). ' +
      'השתמש כשהמשתמש רוצה לקבוע פגישה, לדבר עם עורכת הדין או שיחזרו אליו. זו הדרך המועדפת.',
    inputSchema: z.object({}),
    execute: async () => ({ ready: true }),
  }),

  whatsappHandoff: tool({
    description:
      'הכן הודעה מוכנה לוואטסאפ של המשרד, עם סיכום קצר של הפנייה, כדי שהמשתמש ילחץ וישלח. ' +
      'השתמש כשהמשתמש רוצה לקבוע פגישה או לדבר עם עורכת הדין, אחרי שיש לך לפחות שם ונושא.',
    inputSchema: z.object({
      name: z.string().optional().describe('שם המשתמש, אם נמסר'),
      topic: z.string().describe('נושא או תחום הפנייה, בקצרה'),
      summary: z
        .string()
        .optional()
        .describe('סיכום של 1–2 משפטים של מה שהמשתמש סיפר. בלי פרטים רגישים כמו ת"ז'),
    }),
    execute: async ({ name, topic, summary }) => {
      const text = [
        `שלום, פונה דרך האתר של ${brand.firmName}.`,
        name ? `שמי ${name}.` : '',
        `נושא: ${topic}.`,
        summary ?? '',
        'אשמח שתחזרו אליי.',
      ]
        .filter(Boolean)
        .join(' ');
      return { href: buildWhatsAppHref(text), topic };
    },
  }),
} as const;
