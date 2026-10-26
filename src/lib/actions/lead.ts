'use server';

import { z } from 'zod';
import { brand } from '@/lib/brand';

/**
 * Lead capture Server Action. Validates on the server and relays to the n8n
 * webhook. The webhook URL is a server-only env var — it never reaches the
 * client. Returns a typed state for useActionState.
 */

const LeadSchema = z.object({
  name: z.string().trim().min(2, 'נא להזין שם מלא'),
  phone: z
    .string()
    .trim()
    .regex(/^[\d\s+()-]{9,15}$/, 'נא להזין מספר טלפון תקין'),
  matter: z.string().trim().max(80).optional().default(''),
  message: z.string().trim().max(2000).optional().default(''),
  // Honeypot — must stay empty.
  company: z.string().max(0).optional().default(''),
});

export interface LeadState {
  status: 'idle' | 'success' | 'error';
  message?: string;
  errors?: Partial<Record<'name' | 'phone', string>>;
}

export async function submitLead(
  _prev: LeadState,
  formData: FormData,
): Promise<LeadState> {
  const parsed = LeadSchema.safeParse({
    name: formData.get('name'),
    phone: formData.get('phone'),
    matter: formData.get('matter'),
    message: formData.get('message'),
    company: formData.get('company'),
  });

  if (!parsed.success) {
    const flat = parsed.error.flatten().fieldErrors;
    // Honeypot tripped → pretend success, drop silently.
    if (flat.company) return { status: 'success' };
    return {
      status: 'error',
      message: 'נא לבדוק את הפרטים שהוזנו.',
      errors: { name: flat.name?.[0], phone: flat.phone?.[0] },
    };
  }

  const data = parsed.data;
  const webhook = process.env.N8N_LEAD_WEBHOOK_URL;

  // Graceful fallback: if the webhook isn't configured, don't lose the lead —
  // report a soft error that nudges the visitor to call.
  if (!webhook) {
    console.error('N8N_LEAD_WEBHOOK_URL is not configured');
    return {
      status: 'error',
      message: `אירעה תקלה זמנית. ניתן להתקשר אלינו: ${brand.phone}`,
    };
  }

  try {
    const res = await fetch(webhook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: data.name,
        phone: data.phone,
        matter: data.matter,
        message: data.message,
        source: 'website-lead-form',
        receivedAt: new Date().toISOString(),
      }),
    });
    if (!res.ok) throw new Error(`n8n responded ${res.status}`);
    return { status: 'success' };
  } catch (err) {
    console.error('Lead forward failed:', err);
    return {
      status: 'error',
      message: `אירעה שגיאה בשליחה. נסו שוב או התקשרו: ${brand.phone}`,
    };
  }
}
