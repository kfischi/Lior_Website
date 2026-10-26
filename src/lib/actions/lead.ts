'use server';

import { LeadSchema, buildLeadMessage, buildWhatsAppHref } from '@/lib/lead';
import { isMetaWhatsAppConfigured, sendLeadViaMeta } from '@/lib/whatsapp';

/**
 * Lead capture Server Action.
 *
 *  - Validates on the server (Zod) and drops honeypot hits silently.
 *  - If the Meta WhatsApp Cloud API is configured, sends the lead to the
 *    office's WhatsApp directly -> status "sent".
 *  - Otherwise (not configured, or Meta rejected it) returns status "handoff"
 *    with a prefilled wa.me link, so the lead is never lost.
 */

export interface LeadState {
  status: 'idle' | 'sent' | 'handoff' | 'error';
  message?: string;
  errors?: Partial<Record<'name' | 'phone', string>>;
  /** Prefilled wa.me link, present for "sent" (continue chat) and "handoff". */
  waHref?: string;
}

export async function submitLead(_prev: LeadState, formData: FormData): Promise<LeadState> {
  // Honeypot — real users never fill this field.
  if (String(formData.get('company') ?? '').length > 0) return { status: 'sent' };

  const parsed = LeadSchema.safeParse({
    name: formData.get('name') ?? '',
    phone: formData.get('phone') ?? '',
    matter: formData.get('matter') ?? '',
    message: formData.get('message') ?? '',
  });

  if (!parsed.success) {
    const fields = parsed.error.flatten().fieldErrors;
    return {
      status: 'error',
      message: 'נא לבדוק את הפרטים שהוזנו.',
      errors: { name: fields.name?.[0], phone: fields.phone?.[0] },
    };
  }

  const lead = parsed.data;
  const waHref = buildWhatsAppHref(buildLeadMessage(lead));

  if (isMetaWhatsAppConfigured()) {
    const result = await sendLeadViaMeta(lead);
    if (result.ok) return { status: 'sent', waHref };
  }

  return { status: 'handoff', waHref };
}
