import { buildLegacyTheme } from 'sanity';
import { brand } from '@/lib/brand';

/**
 * The Studio wears the site's own palette and fonts (brand.colors), so editing
 * feels like part of the website. Re-skinning a client in brand.ts re-skins this too.
 */
const { navy, cream, accent, accentLight, ink } = brand.colors;

export const studioTheme = buildLegacyTheme({
  '--font-family-base': 'var(--font-heebo), system-ui, sans-serif',
  '--black': ink,
  '--white': '#ffffff',
  '--gray': '#5c6b73',
  '--gray-base': '#5c6b73',
  '--component-bg': cream,
  '--component-text-color': ink,
  '--brand-primary': accent,
  '--default-button-color': '#5c6b73',
  '--default-button-primary-color': accent,
  '--default-button-success-color': '#2f7d5b',
  '--default-button-warning-color': '#a86a00',
  '--default-button-danger-color': '#b3352c',
  '--focus-color': accent,
  '--main-navigation-color': navy,
  '--main-navigation-color--inverted': cream,
  '--state-info-color': accentLight,
  '--state-success-color': '#2f7d5b',
  '--state-warning-color': '#a86a00',
  '--state-danger-color': '#b3352c',
});
