import { z } from 'zod';
import { brand as baseBrand, type PracticeArea } from '@/lib/brand';

/**
 * Turns the "site settings" document and the practice-area documents into the same
 * shape as brand.ts. Every group is validated on its own: a group that is missing or
 * invalid is ignored, and a field left empty keeps the value from brand.ts.
 */

export type Brand = typeof baseBrand;

const str = (max: number) => z.string().trim().min(1).max(max).nullish();
const strList = (maxItem: number, maxLen = 12) =>
  z
    .array(z.string().trim().min(1).max(maxItem))
    .max(maxLen)
    .nullish()
    .transform((l) => (l && l.length > 0 ? l : undefined));
const hex = z.string().regex(/^#[0-9a-fA-F]{6}$/).nullish();
const digits = z.string().regex(/^\d{9,15}$/).nullish();
const httpsUrl = z.url().refine((u) => u.startsWith('https://')).nullish();

const groups = {
  identity: z.object({
    firmName: str(120),
    firmNameShort: str(80),
    tagline: str(200),
    attorneyName: str(80),
    description: str(600),
  }),
  contact: z.object({
    phone: z.string().trim().regex(/^[\d\-+ ()]{7,20}$/).nullish(),
    phoneE164: digits,
    whatsapp: digits,
    fax: str(30),
    email: z.email().nullish(),
    hours: str(160),
    street: str(80),
    city: str(60),
    postalCode: str(12),
    mapUrl: httpsUrl,
    facebook: httpsUrl,
    linkedin: httpsUrl,
    instagram: httpsUrl,
  }),
  colors: z.object({ navy: hex, cream: hex, accent: hex, accentLight: hex, ink: hex }),
  hero: z.object({ eyebrow: str(80), title: str(120), subtitle: str(400), primaryCta: str(40), secondaryCta: str(40) }),
  chat: z.object({
    assistantName: str(60),
    greeting: str(500),
    suggestedPrompts: strList(100, 8),
    disclaimer: str(200),
  }),
  about: z.object({
    heading: str(80),
    body: str(1500),
    quote: str(400),
    credentials: strList(200),
    more: strList(1200),
  }),
  process: z.object({
    eyebrow: str(60),
    heading: str(80),
    steps: z
      .array(z.object({ title: z.string().trim().min(1).max(60), text: z.string().trim().min(1).max(300) }))
      .max(6)
      .nullish(),
  }),
  whyUs: z.object({
    intro: str(200),
    items: z
      .array(
        z.object({
          title: z.string().trim().min(1).max(60),
          description: z.string().trim().min(1).max(300),
          icon: z.string().nullish(),
        }),
      )
      .max(8)
      .nullish(),
  }),
  seo: z.object({ homeTitle: str(120), homeDescription: str(300), titleSuffix: str(60) }),
};

const trustStatsSchema = z
  .array(z.object({ value: z.string().trim().min(1).max(12), label: z.string().trim().min(1).max(40) }))
  .max(6);

/** Parses one group of the settings document, or returns undefined when it is absent or invalid. */
function group<K extends keyof typeof groups>(raw: Record<string, unknown>, key: K): z.infer<(typeof groups)[K]> | undefined {
  const parsed = groups[key].safeParse(raw[key] ?? {});
  return parsed.success ? (parsed.data as z.infer<(typeof groups)[K]>) : undefined;
}

/** Keeps only the defined values, so spreading never overwrites a default with undefined. */
function defined<T extends Record<string, unknown>>(o: T | undefined): Partial<T> {
  if (!o) return {};
  return Object.fromEntries(Object.entries(o).filter(([, v]) => v !== undefined && v !== null)) as Partial<T>;
}

export function mergeSettings(base: Brand, raw: unknown): Brand {
  if (!raw || typeof raw !== 'object') return base;
  const doc = raw as Record<string, unknown>;

  const identity = defined(group(doc, 'identity'));
  const contact = defined(group(doc, 'contact'));
  const colors = defined(group(doc, 'colors'));
  const hero = defined(group(doc, 'hero'));
  const chat = defined(group(doc, 'chat'));
  const about = defined(group(doc, 'about'));
  const proc = defined(group(doc, 'process'));
  const whyUs = defined(group(doc, 'whyUs'));
  const seo = defined(group(doc, 'seo'));
  const stats = trustStatsSchema.safeParse(doc.trustStats);
  const marquee = strList(40, 8).safeParse(doc.marquee);

  const { street, city, postalCode, facebook, linkedin, instagram, ...flatContact } = contact;
  const { steps, ...procRest } = proc;
  const { items, intro, ...whyRest } = whyUs;
  void whyRest;

  return {
    ...base,
    ...defined({
      firmName: identity.firmName,
      firmNameShort: identity.firmNameShort,
      tagline: identity.tagline,
      attorneyName: identity.attorneyName,
      description: identity.description,
    }),
    ...flatContact,
    address: { ...base.address, ...defined({ street, city, postalCode }) },
    social: { ...base.social, ...defined({ facebook, linkedin, instagram }) },
    colors: { ...base.colors, ...colors },
    hero: { ...base.hero, ...hero },
    chat: {
      ...base.chat,
      ...defined({
        assistantName: chat.assistantName,
        greeting: chat.greeting,
        suggestedPrompts: chat.suggestedPrompts,
        disclaimer: chat.disclaimer,
      }),
    },
    trustStats: stats.success && stats.data.length > 0 ? stats.data : base.trustStats,
    about: { ...base.about, ...about },
    marquee: marquee.success && marquee.data ? marquee.data : base.marquee,
    process: {
      ...base.process,
      ...procRest,
      steps: steps && steps.length > 0 ? steps : base.process.steps,
    },
    whyUsIntro: intro ?? base.whyUsIntro,
    whyUs:
      items && items.length > 0
        ? items.map((i) => ({ title: i.title, description: i.description, icon: i.icon ?? 'Scale' }))
        : base.whyUs,
    seo: { ...base.seo, ...seo },
  } as Brand;
}

const areaSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  title: z.string().trim().min(1).max(80),
  description: z.string().trim().min(1).max(500),
  icon: z.string().nullish(),
  seoTitle: z.string().trim().min(1).max(100),
  seoDescription: z.string().trim().min(1).max(300),
  intro: z.array(z.string().trim().min(1).max(2000)).min(1),
  handles: z.array(z.string().trim().min(1).max(300)).nullish(),
  steps: z.array(z.string().trim().min(1).max(300)).nullish(),
  faq: z
    .array(z.object({ question: z.string().trim().min(1).max(200), answer: z.string().trim().min(1).max(1500) }))
    .nullish(),
});

/** Practice areas from Sanity, or the ones in brand.ts when there are none (or all are invalid). */
export function parseAreas(raw: unknown, fallback: PracticeArea[]): PracticeArea[] {
  if (!Array.isArray(raw)) return fallback;
  const areas = raw.flatMap((item) => {
    const p = areaSchema.safeParse(item);
    if (!p.success) return [];
    const a = p.data;
    return [
      {
        slug: a.slug,
        title: a.title,
        description: a.description,
        icon: a.icon ?? 'Scale',
        page: {
          seoTitle: a.seoTitle,
          seoDescription: a.seoDescription,
          intro: a.intro,
          handles: a.handles ?? [],
          steps: a.steps ?? [],
          faq: a.faq ?? [],
        },
      } satisfies PracticeArea,
    ];
  });
  return areas.length > 0 ? areas : fallback;
}
