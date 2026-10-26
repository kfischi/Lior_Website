import type { Metadata } from 'next';
import { brand, type PracticeArea } from './brand';
import { siteUrl } from './utils';

/**
 * SEO + GEO (Generative Engine Optimization) helpers.
 * - buildMetadata(): Next.js Metadata per page.
 * - JSON-LD builders: LegalService, Attorney, Service, FAQPage, BreadcrumbList.
 *
 * Only facts that exist in brand.ts are emitted. Do not add claims (service
 * area, languages, hours, ratings) that the firm has not confirmed.
 */

interface PageMetaInput {
  /** Inner-page title; the brand suffix is appended. */
  title?: string;
  /** Full <title>, used as-is (home page). Wins over `title`. */
  absoluteTitle?: string;
  description?: string;
  /** Path beginning with "/" (canonical). Defaults to "/". */
  path?: string;
  /** Absolute URL or path to the social preview image. */
  ogImage?: string;
  noindex?: boolean;
}

const DEFAULT_OG_IMAGE = '/opengraph-image.png';

export function buildMetadata({
  title,
  absoluteTitle,
  description,
  path = '/',
  ogImage = DEFAULT_OG_IMAGE,
  noindex = false,
}: PageMetaInput = {}): Metadata {
  const base = siteUrl();
  const fullTitle =
    absoluteTitle ?? (title ? `${title} | ${brand.seo.titleSuffix}` : brand.firmName);
  const desc = description || brand.description;
  const url = `${base}${path === '/' ? '' : path}` || base;
  const image = { url: ogImage, width: 1200, height: 630, alt: brand.firmName };

  return {
    metadataBase: new URL(base),
    title: absoluteTitle || title ? { absolute: fullTitle } : fullTitle,
    description: desc,
    applicationName: brand.firmName,
    authors: [{ name: brand.attorneyName }],
    alternates: { canonical: path },
    robots: noindex ? { index: false, follow: false } : { index: true, follow: true },
    openGraph: {
      type: 'website',
      locale: 'he_IL',
      siteName: brand.firmName,
      title: fullTitle,
      description: desc,
      url,
      images: [image],
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description: desc,
      images: [ogImage],
    },
  };
}

/** Organization-level structured data: LegalService. */
export function legalServiceJsonLd() {
  const base = siteUrl();
  return {
    '@context': 'https://schema.org',
    '@type': 'LegalService',
    '@id': `${base}/#firm`,
    name: brand.firmName,
    description: brand.description,
    url: base,
    image: `${base}${DEFAULT_OG_IMAGE}`,
    telephone: `+${brand.phoneE164}`,
    faxNumber: brand.fax,
    email: brand.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: brand.address.street,
      addressLocality: brand.address.city,
      postalCode: brand.address.postalCode,
      addressCountry: brand.address.country,
    },
    knowsLanguage: 'he',
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
    jobTitle: 'עורכת דין',
    worksFor: { '@id': `${base}/#firm` },
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

/** A practice area as a schema.org Service offered by the firm. */
export function serviceJsonLd(area: PracticeArea) {
  const base = siteUrl();
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: area.title,
    description: area.description,
    url: `${base}/practice-areas/${area.slug}`,
    serviceType: area.title,
    provider: { '@id': `${base}/#firm` },
  };
}

/** FAQPage structured data. Must match the FAQ visible on the same page. */
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
      item: `${base}${c.path === '/' ? '' : c.path}`,
    })),
  };
}
