import { brand as staticBrand, type PainPage } from '@/lib/brand';

/**
 * Landing pages by situation. A page the attorney has not approved is shown only outside
 * production builds (local runs and Netlify deploy previews), so she can read it as visitors would.
 * The decision is taken at build time (the pages are prerendered), and defaults to "visible"
 * only when the build is explicitly not the production one.
 */
export function pageVisible(page: PainPage): boolean {
  return page.approved || process.env.CONTEXT !== 'production';
}

export function visiblePainPages(pages: readonly PainPage[] = staticBrand.painPages): PainPage[] {
  return pages.filter(pageVisible);
}

/** Pages that are public and indexable: approved only. */
export function approvedPainPages(pages: readonly PainPage[] = staticBrand.painPages): PainPage[] {
  return pages.filter((p) => p.approved);
}
