import { NextResponse } from 'next/server';

/**
 * Chatbot endpoint.
 *
 * The browser posts the conversation here; the server relays it to the n8n
 * chat webhook (which can run the LLM / RAG flow). The webhook URL is a
 * server-only env var — never exposed to the client.
 *
 * Per-client customization: adjust the firm's chatbot behavior in the n8n
 * workflow's system prompt, not here.
 */

export const runtime = 'nodejs';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatPayload {
  message?: string;
  history?: ChatMessage[];
  sessionId?: string;
}

export async function POST(request: Request) {
  let data: ChatPayload;
  try {
    data = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'בקשה לא תקינה' }, { status: 400 });
  }

  const message = (data.message || '').trim();
  if (!message) {
    return NextResponse.json({ ok: false, error: 'הודעה ריקה' }, { status: 422 });
  }
  if (message.length > 2000) {
    return NextResponse.json({ ok: false, error: 'הודעה ארוכה מדי' }, { status: 422 });
  }

  const webhook = process.env.N8N_CHAT_WEBHOOK_URL;
  if (!webhook) {
    console.error('N8N_CHAT_WEBHOOK_URL is not configured');
    return NextResponse.json(
      { ok: false, error: 'הצ׳אט אינו זמין כעת' },
      { status: 503 },
    );
  }

  try {
    const res = await fetch(webhook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message,
        history: Array.isArray(data.history) ? data.history.slice(-10) : [],
        sessionId: data.sessionId || null,
        receivedAt: new Date().toISOString(),
      }),
    });

    if (!res.ok) throw new Error(`n8n responded ${res.status}`);

    // n8n may return { reply } or plain text — normalize to { reply }.
    const contentType = res.headers.get('content-type') || '';
    const reply = contentType.includes('application/json')
      ? (await res.json())?.reply ?? ''
      : await res.text();

    return NextResponse.json({ ok: true, reply: String(reply) });
  } catch (err) {
    console.error('Chat forward failed:', err);
    return NextResponse.json(
      { ok: false, error: 'אירעה שגיאה. נסו שוב מאוחר יותר.' },
      { status: 502 },
    );
  }
}
