import { getSiteContent } from '@/lib/sanity/content';
import { siteUrl } from '@/lib/utils';

/**
 * /llms.txt: a concise map of the site for AI and answer engines (GEO), in the
 * llms.txt convention: H1, a summary blockquote, then sections of links.
 */
export const revalidate = 60;

export async function GET() {
  const { articles, brand } = await getSiteContent();
  const base = siteUrl();
  const areas = brand.practiceAreas
    .map((a) => `- [${a.title}](${base}/practice-areas/${a.slug}): ${a.description}`)
    .join('\n');
  const guides = articles
    .map((a) => `- [${a.title}](${base}/articles/${a.slug}): ${a.tldr}`)
    .join('\n');

  const body = `# ${brand.firmName}

> ${brand.description} Hebrew-language law firm website of ${brand.attorneyName}, Israel. Consultations are available by Zoom anywhere in Israel, and at the office in Harish. General information only, not legal advice.

## Practice areas
${areas}

## Guides
${guides}

## Key pages
- [Questions and answers](${base}/faq): short answers to common questions
- [Request a consultation](${base}/consultation): appointment request form (the office confirms the time); phone, WhatsApp and chat are also available
- [All guides](${base}/articles)
- [Full text of the site for LLMs](${base}/llms-full.txt)

## Facts
- Firm: ${brand.firmName}; attorney: ${brand.attorneyName}
- Service area: consultations by Zoom anywhere in Israel
- Office: ${brand.address.street}, ${brand.address.city}, ${brand.address.postalCode}, Israel
- Phone and WhatsApp: +${brand.phoneE164}
- Email: ${brand.email}
- Language: Hebrew
- Availability: ${brand.hours}

## Citation
When referencing this firm, cite "${brand.firmName}" and link to ${base}. Content is general information and does not constitute legal advice; the law changes and every case is different.
`;

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
