'use server';

import { headers } from 'next/headers';
import { LeadSchema, buildLeadMessage, buildWhatsAppHref } from '@/lib/lead';
import { clientIp, rateLimit } from '@/lib/rate-limit';
import { brand } from '@/lib/brand';
import { isMetaWhatsAppConfigured, sendLeadViaMeta } from '@/lib/whatsapp';
import { recordLead } from '@/lib/learning/stats';

/**
 * Lead capture Server Action.
 *
 *  - Called by the chat's guided intake (src/components/ai/ConciergeProvider.tsx).
 *  - Validates on the server (Zod) and rate-limits per IP.
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
  // Slow down spam: a handful of inquiries per hour per address is plenty.
  const ip = clientIp(await headers());
  if (!rateLimit(`lead:${ip}`, 5, 60 * 60 * 1000)) {
    return {
      status: 'error',
      message: `נשלחו הרבה פניות ממכשיר זה. אפשר להתקשר ישירות: ${brand.phone}`,
    };
  }

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
  void recordLead(lead.message.includes('דחוף'));

  if (isMetaWhatsAppConfigured()) {
    const result = await sendLeadViaMeta(lead);
    if (result.ok) return { status: 'sent', waHref };
  }

  return { status: 'handoff', waHref };
}
