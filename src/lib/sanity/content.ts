import 'server-only';
import { cache } from 'react';
import { createClient } from '@sanity/client';
import { z } from 'zod';
import { brand, type FaqItem, type PressArticle, type Testimonial } from '@/lib/brand';
import { sanityEnv } from '@/sanity/env';
import { withTimeout } from '@/lib/with-timeout';

/**
 * Editable content, read from Sanity on the server.
 *
 * - Only published documents are read, through the public CDN: no token and no secret.
 * - Every list falls back to the one in brand.ts when Sanity is off, slow, failing, or
 *   has no documents of that type yet. The site renders the same either way.
 * - Each item is validated; a malformed one is dropped instead of breaking the page.
 * - Pages revalidate every REVALIDATE_SECONDS, and at once when the webhook calls
 *   /api/revalidate (see docs/cms.md).
 */

export const SANITY_TAG = 'sanity';
const REVALIDATE_SECONDS = 60;
const TIMEOUT_MS = 4000;

export interface SiteContent {
  faq: FaqItem[];
  testimonials: Testimonial[];
  press: PressArticle[];
  /** Where each list came from, for the health check and the docs. */
  source: { faq: 'sanity' | 'brand'; testimonials: 'sanity' | 'brand'; press: 'sanity' | 'brand' };
}

const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);
const text = (max: number) => z.string().trim().min(1).max(max);

const faqSchema = z.object({ question: text(200), answer: text(1500) });
const testimonialSchema = z.object({
  name: text(80),
  date: isoDate,
  rating: z.number().min(0).max(5),
  text: text(1000),
});
const pressSchema = z.object({
  title: text(200),
  outlet: text(80),
  date: isoDate.nullish().transform((d) => d ?? undefined),
  url: z.url().refine((u) => u.startsWith('https://')),
  excerpt: z.string().trim().max(400).nullish().transform((e) => e || undefined),
});

const QUERY = `{
  "faq": *[_type == "faqItem"] | order(order asc, _createdAt asc){question, answer},
  "testimonials": *[_type == "testimonial"] | order(date desc){name, date, rating, text},
  "press": *[_type == "pressArticle"] | order(date desc){title, outlet, date, url, excerpt}
}`;

function parseList<T>(schema: z.ZodType<T>, raw: unknown): T[] {
  if (!Array.isArray(raw)) return [];
  return raw.flatMap((item) => {
    const parsed = schema.safeParse(item);
    return parsed.success ? [parsed.data] : [];
  });
}

async function fetchFromSanity(): Promise<unknown> {
  const client = createClient({
    projectId: sanityEnv.projectId,
    dataset: sanityEnv.dataset,
    apiVersion: sanityEnv.apiVersion,
    useCdn: true,
    perspective: 'published',
  });
  return client.fetch(QUERY, {}, { next: { revalidate: REVALIDATE_SECONDS, tags: [SANITY_TAG] } });
}

const fromBrand = (): SiteContent => ({
  faq: brand.faq,
  testimonials: brand.testimonials,
  press: brand.press,
  source: { faq: 'brand', testimonials: 'brand', press: 'brand' },
});

/** Turns a raw Sanity answer into the site's lists, dropping bad items and filling gaps from brand.ts. */
export function parseSiteContent(raw: unknown): SiteContent {
  const fallback = fromBrand();
  if (!raw || typeof raw !== 'object') return fallback;
  const data = raw as Record<string, unknown>;

  const faq = parseList(faqSchema, data.faq);
  const testimonials = parseList(testimonialSchema, data.testimonials);
  const press = parseList(pressSchema, data.press);

  return {
    faq: faq.length > 0 ? faq : fallback.faq,
    testimonials: testimonials.length > 0 ? testimonials : fallback.testimonials,
    press: press.length > 0 ? press : fallback.press,
    source: {
      faq: faq.length > 0 ? 'sanity' : 'brand',
      testimonials: testimonials.length > 0 ? 'sanity' : 'brand',
      press: press.length > 0 ? 'sanity' : 'brand',
    },
  };
}

/** The site's editable lists. Never throws: any problem returns the brand.ts lists. */
export const getSiteContent = cache(async (): Promise<SiteContent> => {
  if (!sanityEnv.enabled) return fromBrand();
  return parseSiteContent(await withTimeout<unknown>(fetchFromSanity(), TIMEOUT_MS, null));
});
