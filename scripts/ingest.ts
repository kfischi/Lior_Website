/**
 * RAG ingestion — embeds the firm's knowledge into Supabase `documents`.
 *
 * Run (Node 22+):
 *   npm run ingest            # loads .env.local automatically
 *
 * Requires SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY and OPENAI_API_KEY.
 * Re-running replaces the auto-generated firm chunks (idempotent by source tag).
 *
 * To add custom knowledge, drop plain-text/markdown files in `content/` and
 * they'll be chunked and embedded alongside the brand data.
 */
import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { createClient } from '@supabase/supabase-js';
import { embedMany } from 'ai';
import { openai } from '@ai-sdk/openai';
import { brand } from '../src/lib/brand';

const URL = process.env.SUPABASE_URL;
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!URL || !KEY || !process.env.OPENAI_API_KEY) {
  console.error('Missing SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY / OPENAI_API_KEY.');
  process.exit(1);
}

const db = createClient(URL, KEY, { auth: { persistSession: false } });

function brandChunks(): { content: string; source: string }[] {
  const chunks: { content: string; source: string }[] = [];
  chunks.push({ content: `${brand.firmName}. ${brand.description} ${brand.about.body}`, source: 'about' });
  for (const a of brand.practiceAreas) {
    chunks.push({ content: `תחום עיסוק — ${a.title}: ${a.description}`, source: `practice:${a.slug}` });
  }
  for (const f of brand.faq) {
    chunks.push({ content: `שאלה: ${f.question}\nתשובה: ${f.answer}`, source: 'faq' });
  }
  chunks.push({
    content: `פרטי קשר: טלפון ${brand.phone}, דוא"ל ${brand.email}, כתובת ${brand.address.street} ${brand.address.city}. שעות: ${brand.hours}.`,
    source: 'contact',
  });
  return chunks;
}

async function contentFiles(): Promise<{ content: string; source: string }[]> {
  const out: { content: string; source: string }[] = [];
  try {
    const dir = join(process.cwd(), 'content');
    for (const file of await readdir(dir)) {
      if (!/\.(md|txt)$/i.test(file)) continue;
      const text = await readFile(join(dir, file), 'utf8');
      // naive paragraph chunking
      for (const para of text.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean)) {
        out.push({ content: para, source: `file:${file}` });
      }
    }
  } catch {
    /* no content/ dir — fine */
  }
  return out;
}

async function main() {
  const chunks = [...brandChunks(), ...(await contentFiles())];
  console.log(`Embedding ${chunks.length} chunks...`);

  const { embeddings } = await embedMany({
    model: openai.embedding('text-embedding-3-small'),
    values: chunks.map((c) => c.content),
  });

  // Clear previous auto-generated rows, then insert fresh.
  await db.from('documents').delete().neq('id', '00000000-0000-0000-0000-000000000000');

  const rows = chunks.map((c, i) => ({
    content: c.content,
    metadata: { source: c.source },
    embedding: JSON.stringify(embeddings[i]),
  }));

  const { error } = await db.from('documents').insert(rows);
  if (error) {
    console.error('Insert failed:', error.message);
    process.exit(1);
  }
  console.log(`Ingested ${rows.length} documents.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
