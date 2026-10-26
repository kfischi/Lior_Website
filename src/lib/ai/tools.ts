import { tool } from 'ai';
import { z } from 'zod';
import { brand, telHref, whatsappHref, mailHref } from '@/lib/brand';

/**
 * Tools the chatbot can call. Kept read-only and safe — they surface firm
 * information the UI can render richly; they never mutate state or expose
 * secrets.
 */
export const chatTools = {
  getContactOptions: tool({
    description:
      'החזר את דרכי יצירת הקשר של המשרד (טלפון, וואטסאפ, דוא"ל, כתובת, שעות). ' +
      'השתמש כשהמשתמש רוצה לקבוע פגישה או ליצור קשר.',
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
} as const;
