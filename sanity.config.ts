'use client';

import { defineConfig } from 'sanity';
import { structureTool, type StructureResolver } from 'sanity/structure';
import { brand } from './src/lib/brand';
import { sanityEnv } from './src/sanity/env';
import { schemaTypes } from './src/sanity/schema';
import { studioTheme } from './src/sanity/theme';

/** The left menu: the settings document first (there is exactly one), then the lists. */
const structure: StructureResolver = (S) =>
  S.list()
    .title('ניהול האתר')
    .items([
      S.listItem()
        .title('הגדרות האתר')
        .id('siteSettings')
        .child(S.document().schemaType('siteSettings').documentId('siteSettings').title('הגדרות האתר')),
      S.divider(),
      S.documentTypeListItem('practiceArea').title('תחומי עיסוק'),
      S.documentTypeListItem('article').title('מדריכים'),
      S.documentTypeListItem('faqItem').title('שאלות נפוצות'),
      S.documentTypeListItem('testimonial').title('המלצות'),
      S.documentTypeListItem('videoReview').title('סרטוני המלצה'),
      S.documentTypeListItem('pressArticle').title('כתבות בתקשורת'),
    ]);

/** Sanity Studio, embedded in the site at /studio. */
export default defineConfig({
  name: 'default',
  title: brand.firmName,
  basePath: '/studio',
  projectId: sanityEnv.projectId || 'unconfigured',
  dataset: sanityEnv.dataset,
  theme: studioTheme,
  plugins: [structureTool({ structure })],
  schema: {
    types: schemaTypes,
    // One settings document only: it cannot be created twice or deleted.
    templates: (templates) => templates.filter(({ schemaType }) => schemaType !== 'siteSettings'),
  },
  document: {
    actions: (prev, { schemaType }) => (schemaType === 'siteSettings' ? prev.filter(({ action }) => action !== 'delete' && action !== 'duplicate') : prev),
    newDocumentOptions: (prev) => prev.filter((item) => item.templateId !== 'siteSettings'),
  },
});
