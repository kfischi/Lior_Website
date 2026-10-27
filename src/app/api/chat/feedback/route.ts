import { logUnknown } from '@/lib/learning/store';
import { sanitizeQuestion } from '@/lib/learning/sanitize';
import { clientIp, rateLimit } from '@/lib/rate-limit';

export const runtime = 'nodejs';

/**
 * A visitor marked an answer as unhelpful. The question (stripped of phone
 * numbers and emails) joins the list the attorney answers in /admin.
 */
export async function POST(req: Request) {
  if (!rateLimit(`feedback:${clientIp(req.headers)}`, 20, 10 * 60 * 1000)) {
    return new Response(null, { status: 429 });
  }
  let question = '';
  try {
    const body: unknown = await req.json();
    if (typeof body === 'object' && body !== null && 'question' in body && typeof body.question === 'string') {
      question = sanitizeQuestion(body.question);
    }
  } catch {
    return new Response(null, { status: 400 });
  }
  if (question.length < 4) return new Response(null, { status: 400 });
  try {
    await logUnknown(question);
  } catch (err) {
    console.error('Logging feedback failed (non-fatal):', err);
  }
  return new Response(null, { status: 204 });
}
