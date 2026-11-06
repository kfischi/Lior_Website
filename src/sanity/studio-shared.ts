import { buildLegacyTheme, type SchemaTypeDefinition, type DocumentActionComponent, type NewDocumentOptionsResolver, type TemplateResolver } from 'sanity';
import { type StructureResolver } from 'sanity/structure';
import { schemaTypes } from './schema';

/**
 * The pieces every site's Studio shares: the same content model, the same menu, the same
 * rules. The site's own /studio and the central hub (hub/) both use these, so a change to
 * the content model is made once and reaches every site that is built from the template.
 * Relative imports only: the Sanity CLI does not know the "@/" alias.
 */

export interface SiteColors {
  navy: string;
  cream: string;
  accent: string;
  accentLight: string;
  ink: string;
}

/** Studio colors from a site's palette. */
export function makeTheme(c: SiteColors) {
  return buildLegacyTheme({
    '--font-family-base': 'var(--font-heebo), system-ui, sans-serif',
    '--black': c.ink,
    '--white': '#ffffff',
    '--gray': '#5c6b73',
    '--gray-base': '#5c6b73',
    '--component-bg': c.cream,
    '--component-text-color': c.ink,
    '--brand-primary': c.accent,
    '--default-button-color': '#5c6b73',
    '--default-button-primary-color': c.accent,
    '--default-button-success-color': '#2f7d5b',
    '--default-button-warning-color': '#a86a00',
    '--default-button-danger-color': '#b3352c',
    '--focus-color': c.accent,
    '--main-navigation-color': c.navy,
    '--main-navigation-color--inverted': c.cream,
    '--state-info-color': c.accentLight,
    '--state-success-color': '#2f7d5b',
    '--state-warning-color': '#a86a00',
    '--state-danger-color': '#b3352c',
  });
}

/** The left menu: the settings document first (there is exactly one), then the lists. */
export const siteStructure: StructureResolver = (S) =>
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

const templates: TemplateResolver = (prev) => prev.filter(({ schemaType }) => schemaType !== 'siteSettings');
const actions = (prev: DocumentActionComponent[], { schemaType }: { schemaType: string }) =>
  schemaType === 'siteSettings' ? prev.filter(({ action }) => action !== 'delete' && action !== 'duplicate') : prev;
const newDocumentOptions: NewDocumentOptionsResolver = (prev) => prev.filter((item) => item.templateId !== 'siteSettings');

/** Schema and document rules, for `defineConfig`. One settings document per site: it cannot be created twice or deleted. */
export const siteContentModel: {
  schema: { types: SchemaTypeDefinition[]; templates: TemplateResolver };
  document: { actions: typeof actions; newDocumentOptions: NewDocumentOptionsResolver };
} = {
  schema: { types: schemaTypes, templates },
  document: { actions, newDocumentOptions },
};
