import { z } from 'zod';
import { brand } from '@/lib/brand';
import { PHONE_PATTERN } from '@/lib/phone';

/**
 * Shared lead helpers (safe for client and server). The WhatsApp message is
 * built here so the Meta API path and the wa.me fallback send identical text.
 */

export const LeadSchema = z.object({
  name: z.string().trim().min(2, 'נא להזין שם מלא').max(60, 'השם ארוך מדי'),
  phone: z
    .string()
    .trim()
    .regex(PHONE_PATTERN, 'נא להזין מספר טלפון תקין'),
  matter: z.string().trim().max(80).default(''),
  message: z.string().trim().max(1000).default(''),
});

export type Lead = z.infer<typeof LeadSchema>;

/** How the inquiry reached the site. Shown at the top of the office's message. */
export const CHANNELS = {
  form: 'השארת טלפון',
  chat: 'צ׳אט',
  booking: 'בקשת פגישה',
} as const;
export type Channel = keyof typeof CHANNELS;

/** A channel from untrusted input, defaulting to the plain form. */
export function parseChannel(value: unknown): Channel {
  return typeof value === 'string' && value in CHANNELS ? (value as Channel) : 'form';
}

/** Human-readable lead summary, in Hebrew, for the office's WhatsApp. */
export function buildLeadMessage(lead: Lead, channel: Channel = 'form'): string {
  const lines = [
    `פנייה חדשה: ${CHANNELS[channel]}`,
    `מהאתר של ${brand.firmName}`,
    `שם: ${lead.name}`,
    `טלפון: ${lead.phone}`,
    lead.matter ? `תחום: ${lead.matter}` : '',
    lead.message ? `פרטים: ${lead.message}` : '',
  ];
  return lines.filter(Boolean).join('\n');
}

/** wa.me click-to-chat link carrying a prefilled message. */
export function buildWhatsAppHref(text: string): string {
  return `https://wa.me/${brand.whatsapp}?text=${encodeURIComponent(text)}`;
}
