import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { siteContentModel, siteStructure, makeTheme } from '../src/sanity/studio-shared';
import { sites } from './sites';

/**
 * The control Studio: one sign-in, every site. Each site in sites.ts is a workspace, with the
 * site's own project, content and colors. The content model is the template's, shared with each
 * site's own /studio, so both always show the same fields.
 */
export default defineConfig(
  sites.map((site) => ({
    name: site.id,
    title: site.title,
    subtitle: site.url.replace(/^https?:\/\//, ''),
    basePath: `/${site.id}`,
    projectId: site.projectId,
    dataset: site.dataset,
    theme: makeTheme(site.colors),
    plugins: [structureTool({ structure: siteStructure })],
    ...siteContentModel,
  })),
);
