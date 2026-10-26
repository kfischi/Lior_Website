import type { MetadataRoute } from 'next';
import { brand } from '@/lib/brand';
import { siteUrl } from '@/lib/utils';

/**
 * lastmod comes from brand.seo.lastModified (bump it when public content
 * changes), not from the build time, so crawlers see honest change dates.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl();
  const lastModified = new Date(brand.seo.lastModified);

  return [
    { url: `${base}/`, lastModified, changeFrequency: 'monthly', priority: 1 },
    ...brand.practiceAreas.map((area) => ({
      url: `${base}/practice-areas/${area.slug}`,
      lastModified,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
    { url: `${base}/legal/privacy`, lastModified, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${base}/legal/accessibility`, lastModified, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${base}/legal/terms`, lastModified, changeFrequency: 'yearly', priority: 0.3 },
  ];
}
