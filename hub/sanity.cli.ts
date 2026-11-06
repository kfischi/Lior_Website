import { defineCliConfig } from 'sanity/cli';
import { sites } from './sites';

/** `npx sanity deploy` publishes the hub on sanity.studio. It is hosted under the first site's project. */
export default defineCliConfig({
  api: { projectId: sites[0].projectId, dataset: sites[0].dataset },
  studioHost: process.env.HUB_STUDIO_HOST,
});
