import { brand } from '@/lib/brand';

/** Public identifiers only. They come from brand.ts, so a new client changes one file. */
export const sanityEnv = {
  projectId: brand.cms.projectId,
  dataset: brand.cms.dataset,
  apiVersion: brand.cms.apiVersion,
  enabled: brand.cms.projectId.length > 0,
};
