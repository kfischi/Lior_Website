import type { Metadata } from 'next';
import { brand } from './brand';
import { siteUrl } from './utils';

/**
 * SEO + GEO (Generative Engine Optimization) helpers.
 * - buildMetadata(): Next.js Metadata per page.
 * - JSON-LD builders: LegalService, Attorney, FAQPage, BreadcrumbList.
 */

interface PageMetaInput {
  title?: string;
  description?: string;
  /** Path beginning with "/" (canonical). Defaults to "/". */
  path?: string;
  /** Cloudinary public ID or absolute URL for the OG image. */
  ogImage?: string;
  noindex?: boolean;
}

export function buildMetadata({
  title,
  description,
  path = '/',
  ogImage,
  noindex = false,
}: PageMetaInput = {}): Metadata {
  const base = siteUrl();
  const fullTitle = title ? `${title} | ${brand.firmName}` : brand.firmName;
  const desc = description || brand.description;
  const url = `${base}${path}`;

  return {
    metadataBase: new URL(base),
    title: fullTitle,
    description: desc,
    applicationName: brand.firmName,
    authors: [{ name: brand.attorneyName }],
    alternates: { canonical: url },
    robots: noindex
      ? { index: false, follow: false }
      : { index: true, follow: true },
    openGraph: {
      type: 'website',
      locale: 'he_IL',
      siteName: brand.firmName,
      title: fullTitle,
      description: desc,
      url,
      ...(ogImage ? { images: [{ url: ogImage }] } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description: desc,
      ...(ogImage ? { images: [ogImage] } : {}),
    },
  };
}

/** Organization-level structured data: LegalService. */
export function legalServiceJsonLd() {
  const base = siteUrl();
  return {
    '@context': 'https://schema.org',
    '@type': 'LegalService',
    name: brand.firmName,
    description: brand.description,
    url: base,
    telephone: `+${brand.phoneE164}`,
    email: brand.email,
    priceRange: '₪₪',
    address: {
      '@type': 'PostalAddress',
      streetAddress: brand.address.street,
      addressLocality: brand.address.city,
      postalCode: brand.address.postalCode,
      addressCountry: brand.address.country,
    },
    openingHours: 'Su-Th 09:00-18:00',
    areaServed: { '@type': 'Country', name: 'Israel' },
    knowsLanguage: ['he', 'en'],
    serviceType: brand.practiceAreas.map((a) => a.title),
  };
}

/** Person-level structured data: Attorney. */
export function attorneyJsonLd() {
  const base = siteUrl();
  return {
    '@context': 'https://schema.org',
    '@type': 'Attorney',
    name: brand.attorneyName,
    worksFor: { '@type': 'LegalService', name: brand.firmName },
    url: base,
    telephone: `+${brand.phoneE164}`,
    email: brand.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: brand.address.street,
      addressLocality: brand.address.city,
      addressCountry: brand.address.country,
    },
  };
}

/** FAQPage structured data — used on the home page and practice-area pages. */
export function faqJsonLd(items: { question: string; answer: string }[] = brand.faq) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  };
}

/** BreadcrumbList structured data. */
export function breadcrumbJsonLd(crumbs: { name: string; path: string }[]) {
  const base = siteUrl();
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: `${base}${c.path}`,
    })),
  };
}
