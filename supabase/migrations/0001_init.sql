-- =============================================================================
--  Lawyer OS — Supabase schema (chat history + RAG with pgvector)
--  Apply with the Supabase SQL editor or: supabase db push
--  Embeddings are 1536-dim (OpenAI text-embedding-3-small).
-- =============================================================================

create extension if not exists vector;

-- Chat sessions ---------------------------------------------------------------
create table if not exists public.chat_sessions (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  last_active timestamptz not null default now(),
  meta        jsonb not null default '{}'::jsonb
);

-- Chat messages ---------------------------------------------------------------
create table if not exists public.chat_messages (
  id         uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.chat_sessions(id) on delete cascade,
  role       text not null check (role in ('user','assistant','system')),
  content    text not null,
  created_at timestamptz not null default now()
);
create index if not exists chat_messages_session_idx on public.chat_messages(session_id, created_at);

-- Knowledge base documents (RAG) ---------------------------------------------
create table if not exists public.documents (
  id         uuid primary key default gen_random_uuid(),
  content    text not null,
  metadata   jsonb not null default '{}'::jsonb,
  embedding  vector(1536),
  created_at timestamptz not null default now()
);
create index if not exists documents_embedding_idx
  on public.documents using ivfflat (embedding vector_cosine_ops) with (lists = 100);

-- Similarity search -----------------------------------------------------------
create or replace function public.match_documents (
  query_embedding vector(1536),
  match_count int default 4,
  match_threshold float default 0.5
)
returns table (id uuid, content text, metadata jsonb, similarity float)
language sql stable
as $$
  select
    d.id,
    d.content,
    d.metadata,
    1 - (d.embedding <=> query_embedding) as similarity
  from public.documents d
  where d.embedding is not null
    and 1 - (d.embedding <=> query_embedding) > match_threshold
  order by d.embedding <=> query_embedding
  limit match_count;
$$;

-- Row Level Security ----------------------------------------------------------
-- The app talks to these tables only via the server (service-role key), which
-- bypasses RLS. We still enable RLS and add no public policies, so anon/auth
-- clients cannot read or write directly.
alter table public.chat_sessions enable row level security;
alter table public.chat_messages enable row level security;
alter table public.documents     enable row level security;
