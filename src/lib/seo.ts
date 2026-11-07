import type { Metadata } from 'next';
import { brand as staticBrand, type PracticeArea } from './brand';
import type { Brand } from './sanity/settings';
import type { Article } from './articles';
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
  /** The brand with edited settings applied. Defaults to brand.ts. */
  brand?: Brand;
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
  /** Set for article pages: emits og:type=article with dates. */
  article?: { published: string; modified: string };
}

const DEFAULT_OG_IMAGE = '/opengraph-image.png';

/** Search Console / Bing Webmaster ownership tags, from env (server-only values). */
function verificationTags(): Pick<Metadata, 'verification'> {
  const google = process.env.GOOGLE_SITE_VERIFICATION;
  const bing = process.env.BING_SITE_VERIFICATION;
  if (!google && !bing) return {};
  return {
    verification: {
      ...(google ? { google } : {}),
      ...(bing ? { other: { 'msvalidate.01': bing } } : {}),
    },
  };
}

export function buildMetadata({
  brand: b = staticBrand,
  title,
  absoluteTitle,
  description,
  path = '/',
  ogImage = DEFAULT_OG_IMAGE,
  noindex = false,
  article,
}: PageMetaInput = {}): Metadata {
  const base = siteUrl();
  const fullTitle =
    absoluteTitle ?? (title ? `${title} | ${b.seo.titleSuffix}` : b.firmName);
  const desc = description || b.description;
  const url = `${base}${path === '/' ? '' : path}` || base;
  const image = { url: ogImage, width: 1200, height: 630, alt: b.firmName };

  return {
    metadataBase: new URL(base),
    title: absoluteTitle || title ? { absolute: fullTitle } : fullTitle,
    description: desc,
    applicationName: b.firmName,
    authors: [{ name: b.attorneyName }],
    alternates: { canonical: path },
    robots: noindex ? { index: false, follow: false } : { index: true, follow: true },
    ...verificationTags(),
    openGraph: {
      ...(article
        ? { type: 'article' as const, publishedTime: article.published, modifiedTime: article.modified }
        : { type: 'website' as const }),
      locale: 'he_IL',
      siteName: b.firmName,
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
export function legalServiceJsonLd(b: Brand = staticBrand) {
  const base = siteUrl();
  return {
    '@context': 'https://schema.org',
    '@type': 'LegalService',
    '@id': `${base}/#firm`,
    name: b.firmName,
    description: b.description,
    url: base,
    image: `${base}${DEFAULT_OG_IMAGE}`,
    telephone: `+${b.phoneE164}`,
    faxNumber: b.fax,
    email: b.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: b.address.street,
      addressLocality: b.address.city,
      postalCode: b.address.postalCode,
      addressCountry: b.address.country,
    },
    knowsLanguage: 'he',
    serviceType: b.practiceAreas.map((a) => a.title),
    knowsAbout: b.seo.knowsAbout,
    areaServed: { '@type': 'Country', name: 'ישראל' },
    hasMap: b.mapUrl,
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      telephone: `+${b.phoneE164}`,
      email: b.email,
      availableLanguage: 'he',
    },
    potentialAction: {
      '@type': 'ReserveAction',
      name: 'בקשת פגישת ייעוץ',
      target: { '@type': 'EntryPoint', urlTemplate: `${base}/consultation`, actionPlatform: 'https://schema.org/DesktopWebPlatform' },
      result: { '@type': 'Reservation', name: 'פגישת ייעוץ' },
    },
    founder: { '@id': `${base}/#attorney` },
    sameAs: Object.values(b.social).filter(Boolean),
  };
}

/** The site itself, linked to the firm as publisher (helps entity resolution). */
export function websiteJsonLd(b: Brand = staticBrand) {
  const base = siteUrl();
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${base}/#website`,
    url: base,
    name: b.firmName,
    inLanguage: 'he-IL',
    publisher: { '@id': `${base}/#firm` },
  };
}

/**
 * The attorney as a schema.org Person who works for the firm. (schema.org's `Attorney` type is a local business,
 * not a person, so it would duplicate the firm's address and phone as a second business.)
 */
export function attorneyJsonLd(b: Brand = staticBrand) {
  const base = siteUrl();
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `${base}/#attorney`,
    name: b.attorneyName,
    knowsAbout: b.seo.knowsAbout,
    image: `${base}${b.about.portraitId}`,
    jobTitle: 'עורכת דין',
    worksFor: { '@id': `${base}/#firm` },
    url: base,
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
    areaServed: { '@type': 'Country', name: 'ישראל' },
  };
}

/** FAQPage structured data. Must match the FAQ visible on the same page. */
export function faqJsonLd(items: { question: string; answer: string }[] = staticBrand.faq) {
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

/** A guide as schema.org Article. Author and publisher are the firm's attorney and firm. */
export function articleJsonLd(article: Article, b: Brand = staticBrand) {
  const base = siteUrl();
  const url = `${base}/articles/${article.slug}`;
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    '@id': `${url}#article`,
    mainEntityOfPage: url,
    url,
    headline: article.title,
    description: article.seoDescription,
    abstract: article.tldr,
    inLanguage: 'he-IL',
    datePublished: article.published,
    dateModified: article.updated,
    image: `${base}/opengraph-image.png`,
    author: { '@id': `${base}/#attorney` },
    publisher: { '@id': `${base}/#firm` },
    isPartOf: { '@id': `${base}/#website` },
    about: b.practiceAreas.find((a) => a.slug === article.areaSlug)?.title,
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: ['[data-speakable]'],
    },
  };
}
