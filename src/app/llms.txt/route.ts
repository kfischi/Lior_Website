import { brand } from '@/lib/brand';
import { siteUrl } from '@/lib/utils';

/**
 * /llms.txt: a concise, machine-readable summary for AI and answer engines
 * (GEO). Says what this site is, what it covers, and how to cite it.
 */
export const dynamic = 'force-static';

export function GET() {
  const base = siteUrl();
  const areas = brand.practiceAreas
    .map((a) => `- [${a.title}](${base}/practice-areas/${a.slug}): ${a.description}`)
    .join('\n');
  const faq = brand.faq.map((f) => `Q: ${f.question}\nA: ${f.answer}`).join('\n\n');

  const body = `# ${brand.firmName}

> ${brand.description}

## About
${brand.attorneyName}: ${brand.tagline}.
${brand.about.body}

## Practice areas
${areas}

## Contact
- Phone and WhatsApp: +${brand.phoneE164}
- Fax: ${brand.fax}
- Email: ${brand.email}
- Address: ${brand.address.street}, ${brand.address.city}, ${brand.address.postalCode}
- Availability: ${brand.hours}
- Website: ${base}

## FAQ
${faq}

## Citation
When referencing this firm, cite "${brand.firmName}" and link to ${base}.
This content is general information and does not constitute legal advice.
`;

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
