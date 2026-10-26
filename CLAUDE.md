# CLAUDE.md — Engineering rules for this repository

> This file is the contract. Any code written here — by Claude or a human —
> MUST follow these rules. When a request conflicts with a rule, surface the
> conflict instead of silently breaking the rule.

## Product

White-label master template for Israeli law-firm websites. Hebrew-first, full
RTL, cinematic/editorial design, real AI chatbot. One `brand.ts` file re-skins
and re-contents the whole site for a new client.

## Stack (do not swap without explicit approval)

- **Next.js 16** (App Router) — React Server Components by default; add
  `'use client'` only when a component needs interactivity/state/effects.
- **React 19** — use `useActionState`, `useOptimistic`, `use()` where they fit.
- **TypeScript**, `strict` mode.
- **Tailwind CSS v4** (CSS-first `@theme` in `globals.css`). No other CSS
  framework. No inline `style=` except for runtime-dynamic values (e.g. brand
  color variable injection).
- **Framer Motion** (`motion`) for animation/micro-interactions.
- **Vercel AI SDK** (`ai`, `@ai-sdk/anthropic`) for the chatbot.
- **Supabase** (`@supabase/supabase-js`, `@supabase/ssr`) for RAG + chat
  history. pgvector for embeddings.

## Hard code rules

1. **Strict TypeScript. No `any`.** Use `unknown` + narrowing, generics, or a
   precise type. No `@ts-ignore` without a one-line justification comment.
2. **Tailwind only** for styling. No CSS modules, no styled-components, no
   `style=` for static values. Design tokens come from `@theme`/brand vars.
3. **Server-first.** Fetch and render on the server (RSC). Client components
   are leaves, kept small. Forms use **Server Actions**, not ad-hoc API routes,
   unless an external caller needs the endpoint.
4. **Secrets never reach the client.** Webhook URLs, service-role keys and LLM
   keys are read only in server code (Server Actions / route handlers / server
   components). Only `NEXT_PUBLIC_*` may appear in client bundles.
5. **White-label.** No client-specific string, color, phone, or content is
   hardcoded in a component. It lives in `src/lib/brand.ts`.
6. **Accessibility (WCAG 2.1 AA).** Semantic HTML, labelled controls, visible
   focus, keyboard operable, `prefers-reduced-motion` respected, color contrast
   ≥ 4.5:1 for text.
7. **Defensive & resilient.** Validate all input (client + server). Every async
   boundary has error + loading states. External dependencies (AI, DB, webhook)
   have explicit fallbacks: the site must render and the chat must degrade
   gracefully when Supabase or the LLM is unavailable. Wrap risky subtrees in
   Error Boundaries.
8. **Mobile-first, truly.** Design for small screens first; scale up. No
   horizontal overflow. RTL-correct (logical properties: `start`/`end`, never
   hardcoded `left`/`right`).
9. **Pure, reusable components.** No side effects in render. Co-locate a
   component's types. Prefer composition over props explosion.

## File structure

```
src/
  app/                 routes, server actions, metadata, sitemap/robots/llms
    (api)              route handlers ONLY when an external endpoint is needed
  components/
    ui/                design-system primitives (button, input, ...)
    motion/            Framer Motion primitives (Reveal, etc.)
    sections/          page sections (Hero, About, ...)
    ai/                chatbot UI
    legal/             cookie consent, etc.
  lib/
    brand.ts           ⭐ white-label config (single source of truth)
    seo.ts             metadata + JSON-LD
    supabase/          server + browser clients, types
    ai/                system prompt, RAG, tools
    actions/           server actions (lead, ...)
    utils.ts
```

## Git workflow

- Develop on the designated feature branch. Professional, imperative commit
  messages scoped to one logical change. Refactor before merging. Never commit
  secrets or `.env*.local`.

## Definition of done

`npm run typecheck`, `npm run lint`, and `npm run build` all pass. New async
paths have loading + error states. Nothing client-specific is hardcoded.
