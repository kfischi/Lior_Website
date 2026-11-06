'use client';

import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { brand } from './src/lib/brand';
import { sanityEnv } from './src/sanity/env';
import { schemaTypes } from './src/sanity/schema';
import { studioTheme } from './src/sanity/theme';

/** Sanity Studio, embedded in the site at /studio. */
export default defineConfig({
  name: 'default',
  title: brand.firmName,
  basePath: '/studio',
  projectId: sanityEnv.projectId || 'unconfigured',
  dataset: sanityEnv.dataset,
  theme: studioTheme,
  plugins: [structureTool()],
  schema: { types: schemaTypes },
});
