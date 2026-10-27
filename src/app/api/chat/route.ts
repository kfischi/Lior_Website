import {
  streamText,
  convertToModelMessages,
  createUIMessageStream,
  createUIMessageStreamResponse,
  stepCountIs,
  type UIMessage,
  type UIMessageChunk,
} from 'ai';
import { chatModelName, chatProviderOptions, getChatModel } from '@/lib/ai/model';
import { buildSystemPrompt } from '@/lib/ai/system';
import { retrieveContext } from '@/lib/ai/rag';
import { chatTools } from '@/lib/ai/tools';
import { localReply } from '@/lib/ai/local/reply';
import { splitSuggestions } from '@/lib/ai/suggestions';
import { splitSiteAction } from '@/lib/site-actions';
import { redactPersonalDetails } from '@/lib/privacy/redact';
import { brand } from '@/lib/brand';
import { getLearnedPrompt } from '@/lib/learning/store';
import { clientIp, rateLimit } from '@/lib/rate-limit';
import { withTimeout } from '@/lib/with-timeout';
import { getSupabaseAdmin } from '@/lib/supabase/admin';

export const runtime = 'nodejs';

/**
 * After the model fails or stalls, skip it for a minute so every visitor gets the
 * local engine's instant answer instead of each waiting for the same timeout.
 */
let modelDownUntil = 0;
const MODEL_COOLDOWN_MS = 60_000;
export const maxDuration = 30;

/** Shown when a visitor shared personal details in the chat. */
const REDACTED_NOTE =
  'שימו לב: הסרתי אוטומטית פרטים אישיים שכתבתם (כמו טלפון או מספר זהות). עדיף לא למסור אותם בצ׳אט, ואפשר להשאיר אותם בשיחה ישירה עם המשרד או בקליטת הפנייה.';

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

/** Streams a fixed reply as a UI message stream, with a light typing cadence. */
function streamStaticReply(text: string): Response {
  const stream = createUIMessageStream({
    execute: async ({ writer }) => {
      const id = 'fallback';
      writer.write({ type: 'text-start', id });
      const words = text.split(/(\s+)/);
      for (let i = 0; i < words.length; i += 3) {
        writer.write({ type: 'text-delta', id, delta: words.slice(i, i + 3).join('') });
        await new Promise((r) => setTimeout(r, 25));
      }
      writer.write({ type: 'text-end', id });
    },
  });
  return createUIMessageStreamResponse({ stream });
}

/** Liveness check: open /api/chat in a browser to see that the route is up and which engine answers. */
export function GET() {
  return Response.json({ ok: true, engine: chatModelName() ?? 'local (no API)' });
}

export async function POST(req: Request) {
  // The endpoint is public and every call costs money: cap it per address.
  if (!rateLimit(`chat:${clientIp(req.headers)}`, 40, 10 * 60 * 1000)) {
    return Response.json({ error: 'יותר מדי הודעות. נסו שוב בעוד כמה דקות.' }, { status: 429 });
  }

  let body: { messages: UIMessage[]; sessionId?: string; page?: string };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: 'בקשה לא תקינה' }, { status: 400 });
  }

  const { messages, sessionId, page } = body;
  if (!Array.isArray(messages) || messages.length === 0) {
    return Response.json({ error: 'אין הודעות' }, { status: 400 });
  }

  // Personal details are removed here, before the model, the local engine, the logs or the database see them.
  let redacted = false;
  const clean: UIMessage[] = messages.slice(-12).map((m) => {
    if (m.role !== 'user') return m;
    return {
      ...m,
      parts: m.parts.map((p) => {
        if (p.type !== 'text') return p;
        const r = redactPersonalDetails(p.text);
        if (r.found.length > 0) redacted = true;
        return { ...p, text: r.text };
      }),
    };
  });

  // Token-window management: keep only the most recent turns in context.
  const trimmed = clean;
  const userTurns = trimmed.filter((m) => m.role === 'user');
  const lastUserText = messageText(userTurns[userTurns.length - 1]);
  const previousUserText = messageText(userTurns[userTurns.length - 2]);

  // No AI provider configured (or CHAT_PROVIDER=local): the local engine answers.
  const model = getChatModel();
  if (!model || Date.now() < modelDownUntil) {
    const reply = await localReply(lastUserText, previousUserText);
    return streamStaticReply(redacted ? `${REDACTED_NOTE}\n\n${reply}` : reply);
  }

  // Which practice-area page the visitor is on (matched against known routes only).
  const area =
    typeof page === 'string'
      ? brand.practiceAreas.find((a) => page === `/practice-areas/${a.slug}`)
      : undefined;

  // RAG (optional) — only active when Supabase + embeddings are configured.
  const context = await withTimeout(retrieveContext(lastUserText), 2000, undefined);

  const modelMessages = await convertToModelMessages(trimmed);

  // The model must start answering quickly and finish within the function limit;
  // otherwise the visitor gets the local engine's answer instead of a hung chat.
  const abort = new AbortController();
  const hardLimit = setTimeout(() => abort.abort(), 24_000);
  let firstChunkLimit: ReturnType<typeof setTimeout> | undefined = setTimeout(() => abort.abort(), 6_000);

  const result = streamText({
    model,
    system:
      buildSystemPrompt(context, area, await withTimeout(getLearnedPrompt(), 1500, '')) +
      (redacted
        ? '\n\n## הודעה אחרונה\nהמשתמש מסר פרטים אישיים (טלפון, זהות, כרטיס או דוא״ל) והם הוסרו אוטומטית. ' +
          'אל תבקש אותם שוב. אמור במשפט אחד חם שעדיף לא למסור פרטים כאלה בצ׳אט, ושאפשר להשאיר אותם בשיחה ישירה עם המשרד או בקליטת הפנייה.'
        : ''),
    messages: modelMessages,
    tools: chatTools,
    stopWhen: stepCountIs(4),
    temperature: 0.5,
    maxOutputTokens: 700,
    providerOptions: chatProviderOptions(),
    abortSignal: abort.signal,
    onFinish: ({ text }) => {
      void persistExchange(sessionId, lastUserText, splitSiteAction(splitSuggestions(text).text).text);
    },
    onError: (err) => {
      console.error('streamText error:', err);
    },
  });

  const writeLocal = async (writer: { write: (chunk: UIMessageChunk) => void }) => {
    modelDownUntil = Date.now() + MODEL_COOLDOWN_MS;
    const id = 'fallback';
    writer.write({ type: 'text-start', id });
    writer.write({ type: 'text-delta', id, delta: await localReply(lastUserText, previousUserText) });
    writer.write({ type: 'text-end', id });
  };

  // If the model fails or stalls before saying anything (bad key, quota, outage),
  // answer from the local engine instead of showing the visitor an error.
  const stream = createUIMessageStream({
    execute: async ({ writer }) => {
      let produced = false;
      try {
        const chunks = result.toUIMessageStream({
          onError: (err) => {
            console.error('Chat model failed:', err);
            return 'model_error';
          },
        });
        for await (const chunk of chunks) {
          if ((chunk.type === 'error' || chunk.type === 'abort') && !produced) {
            await writeLocal(writer);
            return;
          }
          if (chunk.type !== 'start' && chunk.type !== 'start-step') {
            produced = true;
            clearTimeout(firstChunkLimit);
            firstChunkLimit = undefined;
          }
          writer.write(chunk);
        }
        if (!produced) await writeLocal(writer);
      } catch (err) {
        console.error('Chat stream failed:', err);
        if (!produced) await writeLocal(writer);
      } finally {
        clearTimeout(hardLimit);
        clearTimeout(firstChunkLimit);
      }
    },
  });
  return createUIMessageStreamResponse({ stream });
}
