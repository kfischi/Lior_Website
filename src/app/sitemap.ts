import type { MetadataRoute } from 'next';
import { brand } from '@/lib/brand';
import { siteUrl } from '@/lib/utils';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl();
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: now, changeFrequency: 'monthly', priority: 1 },
    { url: `${base}/legal/privacy`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${base}/legal/accessibility`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${base}/legal/terms`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
  ];

  // Practice areas are anchors on the home page today; when dedicated pages are
  // added at /practice-areas/[slug] they will be picked up here automatically.
  const practiceRoutes: MetadataRoute.Sitemap = brand.practiceAreas.map((area) => ({
    url: `${base}/#${area.slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  return [...staticRoutes, ...practiceRoutes];
}
