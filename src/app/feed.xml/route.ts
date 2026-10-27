import { brand } from '@/lib/brand';
import { articles } from '@/lib/articles';
import { siteUrl } from '@/lib/utils';

/** RSS feed of the guides, so crawlers and readers can discover new ones. */
export const dynamic = 'force-static';

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export function GET() {
  const base = siteUrl();
  const items = [...articles]
    .sort((a, b) => b.published.localeCompare(a.published))
    .map(
      (a) => `    <item>
      <title>${esc(a.title)}</title>
      <link>${base}/articles/${a.slug}</link>
      <guid isPermaLink="true">${base}/articles/${a.slug}</guid>
      <pubDate>${new Date(a.published).toUTCString()}</pubDate>
      <description>${esc(a.tldr)}</description>
    </item>`,
    )
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${esc(brand.firmName)}</title>
    <link>${base}</link>
    <description>${esc(brand.description)}</description>
    <language>he-IL</language>
${items}
  </channel>
</rss>
`;
  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
