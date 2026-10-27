import { brand } from '@/lib/brand';
import { siteContentAsMarkdown } from '@/lib/ai/site-content';
import { siteUrl } from '@/lib/utils';

/** /llms-full.txt: the full public content of the site as one plain document. */
export const dynamic = 'force-static';

export function GET() {
  const base = siteUrl();
  const faq = brand.faq.map((f) => `ש: ${f.question}\nת: ${f.answer}`).join('\n\n');
  const body = `# ${brand.firmName}

> ${brand.description}
> ${base}

${brand.about.body}

## פרטי קשר
טלפון ווטסאפ: +${brand.phoneE164} · דוא"ל: ${brand.email} · כתובת: ${brand.address.street}, ${brand.address.city} · ${brand.hours}

## שאלות כלליות
${faq}

## תוכן
${siteContentAsMarkdown()}

${brand.chat.disclaimer}
`;
  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
