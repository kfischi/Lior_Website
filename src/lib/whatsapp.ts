import 'server-only';
import { brand } from '@/lib/brand';
import { buildLeadMessage, type Lead } from '@/lib/lead';

/**
 * Meta WhatsApp Business Cloud API (server-only).
 *
 * Sends the lead straight to the office's WhatsApp from the server, so the
 * visitor never has to open WhatsApp. Credentials come from env and never
 * reach the client.
 *
 * Meta rule to know: a business can start a conversation only with an
 * APPROVED TEMPLATE; free-form text is delivered only if the recipient wrote to
 * the business number in the last 24 hours. So:
 *   - WHATSAPP_LEAD_TEMPLATE set  -> sends the template (works any time)
 *   - not set                     -> sends plain text (works inside the 24h window)
 */

const GRAPH_VERSION = process.env.WHATSAPP_GRAPH_VERSION || 'v23.0';

export function isMetaWhatsAppConfigured(): boolean {
  return Boolean(process.env.WHATSAPP_ACCESS_TOKEN && process.env.WHATSAPP_PHONE_NUMBER_ID);
}

/** Template parameters may not contain newlines, tabs or long space runs. */
function templateSafe(value: string): string {
  return value.replace(/[\n\r\t]+/g, ' ').replace(/ {2,}/g, ' ').trim() || '-';
}

export type SendResult = { ok: true } | { ok: false; reason: string };

export async function sendLeadViaMeta(lead: Lead): Promise<SendResult> {
  const token = process.env.WHATSAPP_ACCESS_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  if (!token || !phoneNumberId) return { ok: false, reason: 'not_configured' };

  const to = (process.env.WHATSAPP_NOTIFY_TO || brand.whatsapp).replace(/\D/g, '');
  const template = process.env.WHATSAPP_LEAD_TEMPLATE;
  const language = process.env.WHATSAPP_TEMPLATE_LANG || 'he';

  // Template body variables, in order: {{1}} name, {{2}} phone, {{3}} matter, {{4}} details.
  const body = template
    ? {
        messaging_product: 'whatsapp',
        to,
        type: 'template',
        template: {
          name: template,
          language: { code: language },
          components: [
            {
              type: 'body',
              parameters: [lead.name, lead.phone, lead.matter, lead.message].map((v) => ({
                type: 'text',
                text: templateSafe(v),
              })),
            },
          ],
        },
      }
    : {
        messaging_product: 'whatsapp',
        to,
        type: 'text',
        text: { body: buildLeadMessage(lead), preview_url: false },
      };

  try {
    const res = await fetch(`https://graph.facebook.com/${GRAPH_VERSION}/${phoneNumberId}/messages`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(10_000),
    });

    if (!res.ok) {
      const detail = await res.text().catch(() => '');
      console.error(`Meta WhatsApp send failed (${res.status}):`, detail.slice(0, 500));
      return { ok: false, reason: `http_${res.status}` };
    }
    return { ok: true };
  } catch (err) {
    console.error('Meta WhatsApp send error:', err);
    return { ok: false, reason: 'network' };
  }
}
