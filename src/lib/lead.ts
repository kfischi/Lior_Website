import { z } from 'zod';
import { brand } from '@/lib/brand';

/**
 * Shared lead helpers (safe for client and server). The WhatsApp message is
 * built here so the Meta API path and the wa.me fallback send identical text.
 */

export const LeadSchema = z.object({
  name: z.string().trim().min(2, 'נא להזין שם מלא'),
  phone: z
    .string()
    .trim()
    .regex(/^[\d\s+()-]{9,15}$/, 'נא להזין מספר טלפון תקין'),
  matter: z.string().trim().max(80).default(''),
  message: z.string().trim().max(1000).default(''),
});

export type Lead = z.infer<typeof LeadSchema>;

/** Human-readable lead summary, in Hebrew, for the office's WhatsApp. */
export function buildLeadMessage(lead: Lead): string {
  const lines = [
    `פנייה חדשה מהאתר של ${brand.firmName}`,
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
