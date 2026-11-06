import { brand } from '@/lib/brand';
import { makeTheme } from './studio-shared';

/**
 * The Studio wears the site's own palette and fonts (brand.colors), so editing
 * feels like part of the website. Re-skinning a client in brand.ts re-skins this too.
 */
export const studioTheme = makeTheme(brand.colors);
