import {
  streamText,
  convertToModelMessages,
  stepCountIs,
  type UIMessage,
} from 'ai';
import { anthropic } from '@ai-sdk/anthropic';
import { buildSystemPrompt } from '@/lib/ai/system';
import { retrieveContext } from '@/lib/ai/rag';
import { chatTools } from '@/lib/ai/tools';
import { getSupabaseAdmin } from '@/lib/supabase/admin';

export const runtime = 'nodejs';
export const maxDuration = 30;

const MODEL = process.env.CHAT_MODEL || 'claude-sonnet-4-5';

/** Join the text parts of a UIMessage into a plain string. */
function messageText(message: UIMessage | undefined): string {
  if (!message) return '';
  return message.parts
    .filter((p): p is { type: 'text'; text: string } => p.type === 'text')
    .map((p) => p.text)
    .join(' ')
    .trim();
}

/** Best-effort persistence of the exchange. Never blocks or breaks the reply. */
async function persistExchange(
  sessionId: string | undefined,
  userText: string,
  assistantText: string,
): Promise<void> {
  const db = getSupabaseAdmin();
  if (!db || !sessionId) return;
  try {
    await db.from('chat_sessions').upsert({ id: sessionId, last_active: new Date().toISOString() });
    await db.from('chat_messages').insert([
      { session_id: sessionId, role: 'user', content: userText },
      { session_id: sessionId, role: 'assistant', content: assistantText },
    ]);
  } catch (err) {
    console.error('Chat persistence failed (non-fatal):', err);
  }
}

export async function POST(req: Request) {
  // Graceful fallback when the LLM key is not configured.
  if (!process.env.ANTHROPIC_API_KEY) {
    return Response.json(
      { error: 'הצ׳אט אינו מוגדר כעת. אנא צרו קשר טלפוני.' },
      { status: 503 },
    );
  }

  let body: { messages: UIMessage[]; sessionId?: string };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: 'בקשה לא תקינה' }, { status: 400 });
  }

  const { messages, sessionId } = body;
  if (!Array.isArray(messages) || messages.length === 0) {
    return Response.json({ error: 'אין הודעות' }, { status: 400 });
  }

  // Token-window management: keep only the most recent turns in context.
  const trimmed = messages.slice(-12);
  const lastUserText = messageText([...trimmed].reverse().find((m) => m.role === 'user'));

  // RAG (optional) — retrieve relevant firm knowledge for this query.
  const context = await retrieveContext(lastUserText);

  const modelMessages = await convertToModelMessages(trimmed);

  const result = streamText({
    model: anthropic(MODEL),
    system: buildSystemPrompt(context),
    messages: modelMessages,
    tools: chatTools,
    stopWhen: stepCountIs(4),
    temperature: 0.4,
    onFinish: ({ text }) => {
      void persistExchange(sessionId, lastUserText, text);
    },
    onError: (err) => {
      console.error('streamText error:', err);
    },
  });

  return result.toUIMessageStreamResponse();
}
