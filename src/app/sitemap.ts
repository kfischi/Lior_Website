import type { MetadataRoute } from 'next';
import { brand } from '@/lib/brand';
import { getSiteContent } from '@/lib/sanity/content';
import { siteUrl } from '@/lib/utils';

/**
 * lastmod comes from brand.seo.lastModified (bump it when public content
 * changes), not from the build time, so crawlers see honest change dates.
 */
export const revalidate = 60;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { articles } = await getSiteContent();
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
    { url: `${base}/articles`, lastModified: new Date(Math.max(...articles.map((a) => +new Date(a.updated)))), changeFrequency: 'weekly', priority: 0.8 },
    ...articles.map((a) => ({
      url: `${base}/articles/${a.slug}`,
      lastModified: new Date(a.updated),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
    { url: `${base}/faq`, lastModified, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/legal/privacy`, lastModified, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${base}/legal/accessibility`, lastModified, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${base}/legal/terms`, lastModified, changeFrequency: 'yearly', priority: 0.3 },
  ];
}
