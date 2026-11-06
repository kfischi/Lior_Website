import type { SiteColors } from '../src/sanity/studio-shared';

/**
 * The register of every site built from the template. One line per site: the hub shows each as
 * its own workspace in one Studio, with that site's colors, so the person who manages them
 * signs in once and switches between sites from the menu.
 *
 * To add a site: create its Sanity project (docs/cms-pilot.md), add a line here, and deploy the hub again.
 */
export interface Site {
  /** Short id, lowercase letters, digits and dashes. Also the path in the hub: /<id>. */
  id: string;
  /** Name shown in the site switcher. */
  title: string;
  /** Public address of the site. */
  url: string;
  /** Sanity project and dataset of the site. */
  projectId: string;
  dataset: string;
  /** The site's palette, so its workspace looks like the site. */
  colors: SiteColors;
  /** Free text for the manager: client, status, hosting, renewal date. Not shown to the client. */
  notes?: string;
}

export const sites: Site[] = [
  {
    id: 'liorerez',
    title: 'עו״ד ליאור-קלואי ארז',
    url: 'https://www.liorerezadv.com',
    projectId: 'pqddwskg',
    dataset: 'production',
    colors: {
      navy: '#1A3742',
      cream: '#F4F6F6',
      accent: '#3C7186',
      accentLight: '#8DB5C4',
      ink: '#17242B',
    },
    notes: 'אתר הפיילוט. תצוגה מקדימה: deploy-preview-9--lior-website.netlify.app',
  },
];
