import { tool } from 'ai';
import { z } from 'zod';
import { brand, telHref, whatsappHref, mailHref } from '@/lib/brand';
import { buildWhatsAppHref } from '@/lib/lead';

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
