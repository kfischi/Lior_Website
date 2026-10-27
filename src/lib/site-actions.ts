import { brand } from '@/lib/brand';

/**
 * The places the assistant can take a visitor to. The chat is the way to move around the site:
 * "show me the reviews" scrolls to them and lights them up; "the criminal law page" opens it.
 *
 * The assistant (model or local engine) asks for it with a marker in its text:
 *
 *   ...answer text...
 *   [[אתר: reviews]]
 *
 * `splitSiteAction` removes the marker from what the visitor reads (also while it is still streaming
 * in) and returns the target. Safe for client and server.
 */

export interface SiteTarget {
  id: string;
  /** Shown on the button: "להצגה באתר: {label}". */
  label: string;
  /** A page, or a section of the home page (`/#reviews`). */
  href: string;
  /** Words visitors use for it, for the local engine. */
  phrases: string[];
  /** One sentence the assistant says when it takes the visitor there. */
  line?: string;
  /** A bare topic word ("הטרדה") is a question, not a request to go there: only act on it with a verb like "show me". */
  needsVerb?: boolean;
}

const PAGE_TARGETS: SiteTarget[] = [
  { id: 'home', label: 'דף הבית', href: '/', phrases: ['דף הבית', 'עמוד הבית', 'עמוד ראשי', 'לראש הדף'] },
  { id: 'practice', label: 'תחומי העיסוק', href: '/#practice', phrases: ['תחומי עיסוק', 'תחומי העיסוק', 'התחומים', 'במה אתם מטפלים'] },
  {
    id: 'about',
    label: 'אודות עורכת הדין',
    href: '/#about',
    phrases: ['אודות', 'על ליאור', 'עליך', 'על המשרד', 'על עורכת הדין', 'תעודות', 'תעודה', 'הסמכות', 'השתלמויות'],
  },
  { id: 'why', label: 'למה אנחנו', href: '/#why', phrases: ['למה אנחנו', 'למה לבחור'] },
  { id: 'process', label: 'איך זה עובד', href: '/#process', phrases: ['איך זה עובד', 'שלבי העבודה', 'שלבי התהליך'] },
  { id: 'reviews', label: 'המלצות', href: '/#reviews', phrases: ['המלצות', 'ביקורות', 'חוות דעת', 'מכתבי תודה', 'מכתב תודה'] },
  {
    id: 'video-reviews',
    label: 'סרטוני לקוחות',
    href: '/#video-reviews',
    phrases: ['סרטוני לקוחות', 'סרטונים', 'סרטון של לקוח', 'ביקורות וידאו', 'וידאו'],
  },
  { id: 'articles', label: 'מדריכים ומאמרים', href: '/articles', phrases: ['מדריכים', 'מאמרים', 'מאמר', 'כתבות', 'כתבה', 'בעיתונות', 'בתקשורת'] },
  { id: 'faq', label: 'שאלות ותשובות', href: '/faq', phrases: ['שאלות נפוצות', 'שאלות ותשובות', 'עמוד השאלות'] },
  { id: 'contact', label: 'יצירת קשר', href: '/#contact', phrases: ['צור קשר', 'יצירת קשר', 'פרטי קשר', 'טופס', 'להשאיר פרטים'] },
  { id: 'privacy', label: 'מדיניות פרטיות', href: '/legal/privacy', phrases: ['מדיניות פרטיות', 'פרטיות'] },
  { id: 'accessibility', label: 'הצהרת נגישות', href: '/legal/accessibility', phrases: ['הצהרת נגישות', 'נגישות'] },
  { id: 'terms', label: 'תנאי שימוש', href: '/legal/terms', phrases: ['תנאי שימוש', 'תקנון'] },
];

/** How visitors name each area, besides its title. */
const AREA_ALIASES: Record<string, string[]> = {
  'workplace-discrimination': ['אפליה והתעמרות', 'תחום העבודה', 'דיני עבודה', 'אפליה', 'התעמרות'],
  'sexual-harassment': ['הטרדה מינית', 'הטרדה'],
  'criminal-law': ['משפט פלילי', 'הליך פלילי', 'פלילי', 'פליליים'],
};

const AREA_TARGETS: SiteTarget[] = brand.practiceAreas.map((a) => ({
  id: `area-${a.slug}`,
  label: a.title,
  href: `/practice-areas/${a.slug}`,
  phrases: [a.title, ...(AREA_ALIASES[a.slug] ?? [])],
  line: a.description,
  needsVerb: true,
}));

/** The reviews section exists only when there are reviews. */
export const SITE_TARGETS: SiteTarget[] = [...PAGE_TARGETS, ...AREA_TARGETS].filter(
  (t) => t.id !== 'reviews' || brand.testimonials.length + brand.testimonialLetters.length > 0,
);

const BY_ID = new Map(SITE_TARGETS.map((t) => [t.id, t]));

export function getSiteTarget(id: string): SiteTarget | undefined {
  return BY_ID.get(id.trim());
}

/** For the model's instructions: every id it may ask for, with what it is. */
export function siteTargetsForPrompt(): string {
  return SITE_TARGETS.map((t) => `${t.id}: ${t.label} (${t.href})`).join('\n');
}

const COMPLETE = /\[\[\s*אתר\s*:\s*([a-z0-9-]+)\s*\]\]/g;

export function splitSiteAction(text: string): { text: string; target?: SiteTarget } {
  let target: SiteTarget | undefined;
  let out = text.replace(COMPLETE, (_, id: string) => {
    target ??= getSiteTarget(id);
    return '';
  });
  // A marker that has started but not finished streaming: hide it for now.
  const open = out.lastIndexOf('[[');
  if (open !== -1 && !out.slice(open).includes(']]') && /^\[\[\s*(?:א|את|אתר)?/.test(out.slice(open))) {
    out = out.slice(0, open);
  }
  return { text: out.replace(/\n{3,}/g, '\n\n').trimEnd(), target };
}

export function withSiteAction(text: string, id: string): string {
  return `${text}\n[[אתר: ${id}]]`;
}
