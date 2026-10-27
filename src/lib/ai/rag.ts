import 'server-only';
import { embed } from 'ai';
import { openai } from '@ai-sdk/openai';
import { getSupabaseAdmin } from '@/lib/supabase/admin';

/**
 * RAG retrieval. Embeds the query and finds the most similar documents via the
 * pgvector `match_documents` RPC.
 *
 * Fully optional and defensive: if Supabase or the embeddings key is missing,
 * or anything fails, it returns an empty string and the chatbot proceeds with
 * just its baked-in firm knowledge. RAG is an enhancement, never a dependency.
 */
const EMBEDDING_MODEL = 'text-embedding-3-small'; // 1536 dims

export function isRagEnabled(): boolean {
  return Boolean(process.env.OPENAI_API_KEY) && getSupabaseAdmin() !== null;
}

export async function retrieveContext(
  query: string,
  { matchCount = 4, threshold = 0.5 }: { matchCount?: number; threshold?: number } = {},
): Promise<string> {
  if (!isRagEnabled()) return '';
  const db = getSupabaseAdmin();
  if (!db) return '';

  try {
    const { embedding } = await embed({
      model: openai.embedding(EMBEDDING_MODEL),
      value: query,
    });

    const { data, error } = await db.rpc('match_documents', {
      query_embedding: JSON.stringify(embedding),
      match_count: matchCount,
      match_threshold: threshold,
    });

    if (error || !data || data.length === 0) return '';

    return data
      .map((d: { content: string }, i: number) => `[${i + 1}] ${d.content}`)
      .join('\n\n');
  } catch (err) {
    console.error('RAG retrieval failed (continuing without context):', err);
    return '';
  }
}
