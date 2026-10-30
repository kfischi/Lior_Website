import type { MetadataRoute } from 'next';
import { siteUrl } from '@/lib/utils';

/**
 * Search and answer-engine crawlers are welcome: being quoted by AI assistants
 * is part of the strategy (GEO). Each named group repeats the disallow list,
 * because a crawler that matches a specific group ignores the "*" group.
 */
const PRIVATE = ['/api/', '/admin'];

const AI_AND_SEARCH_BOTS = [
  'Googlebot',
  'Bingbot',
  'GPTBot',
  'OAI-SearchBot',
  'ChatGPT-User',
  'ClaudeBot',
  'Claude-SearchBot',
  'Claude-User',
  'PerplexityBot',
  'Perplexity-User',
  'Google-Extended',
  'Applebot',
  'Applebot-Extended',
];

export default function robots(): MetadataRoute.Robots {
  const base = siteUrl();
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: PRIVATE },
      { userAgent: AI_AND_SEARCH_BOTS, allow: '/', disallow: PRIVATE },
    ],
    sitemap: `${base}/sitemap.xml`,
  };
}
