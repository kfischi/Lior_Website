import { NextResponse } from 'next/server';

/**
 * Lead form endpoint.
 *
 * SECURITY: the n8n webhook URL lives ONLY in a server env var and is never
 * exposed to the client. The browser posts to this internal route; the server
 * relays to n8n. No keys/URLs ever reach the client bundle.
 */

export const runtime = 'nodejs';

interface LeadPayload {
  name?: string;
  phone?: string;
  matter?: string;
  message?: string;
  // Honeypot field — bots fill it, humans never see it.
  company?: string;
}

export async function POST(request: Request) {
  let data: LeadPayload;
  try {
    data = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'בקשה לא תקינה' }, { status: 400 });
  }

  // Spam honeypot: silently accept but drop.
  if (data.company) {
    return NextResponse.json({ ok: true });
  }

  // Server-side validation.
  const name = (data.name || '').trim();
  const phone = (data.phone || '').trim();
  if (name.length < 2) {
    return NextResponse.json({ ok: false, error: 'נא להזין שם מלא' }, { status: 422 });
  }
  if (!/^[\d\s+()-]{9,15}$/.test(phone)) {
    return NextResponse.json(
      { ok: false, error: 'נא להזין מספר טלפון תקין' },
      { status: 422 },
    );
  }

  const webhook = process.env.N8N_LEAD_WEBHOOK_URL;
  if (!webhook) {
    console.error('N8N_LEAD_WEBHOOK_URL is not configured');
    return NextResponse.json(
      { ok: false, error: 'השירות אינו זמין כעת' },
      { status: 503 },
    );
  }

  try {
    const res = await fetch(webhook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        phone,
        matter: (data.matter || '').trim(),
        message: (data.message || '').trim(),
        source: 'website-lead-form',
        receivedAt: new Date().toISOString(),
      }),
    });

    if (!res.ok) throw new Error(`n8n responded ${res.status}`);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Lead forward failed:', err);
    return NextResponse.json(
      { ok: false, error: 'אירעה שגיאה בשליחה. נסו שוב או התקשרו אלינו.' },
      { status: 502 },
    );
  }
}
