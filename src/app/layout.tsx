import type { Metadata, Viewport } from 'next';
import { Rubik, Heebo } from 'next/font/google';
import './globals.css';

import { brand } from '@/lib/brand';
import { buildMetadata, legalServiceJsonLd, attorneyJsonLd, websiteJsonLd } from '@/lib/seo';
import { SiteChrome } from '@/components/layout/SiteChrome';

/*
 * Fonts self-host at build time via next/font — no runtime requests to Google.
 */
const rubik = Rubik({
  subsets: ['hebrew', 'latin'],
  weight: ['400', '500', '600'],
  variable: '--font-rubik',
  display: 'swap',
});

const heebo = Heebo({
  subsets: ['hebrew', 'latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-heebo',
  display: 'swap',
});

export const metadata: Metadata = buildMetadata();

export const viewport: Viewport = {
  themeColor: brand.colors.navy,
  width: 'device-width',
  initialScale: 1,
};

/** Inject brand.ts colors as CSS variables so one file re-themes the whole site. */
function brandVars(): string {
  const { navy, cream, accent, accentLight, ink } = brand.colors;
  return `:root{--brand-navy:${navy};--brand-cream:${cream};--brand-accent:${accent};--brand-accent-light:${accentLight};--brand-ink:${ink};}`;
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const jsonLd = [legalServiceJsonLd(), attorneyJsonLd(), websiteJsonLd()];

  // The hero image and video are served from another host: connect to it while the HTML is still arriving.
  const heroOrigin = /^https?:\/\//.test(brand.hero.posterId) ? new URL(brand.hero.posterId).origin : '';

  return (
    <html lang="he" dir="rtl" className={`${rubik.variable} ${heebo.variable}`}>
      <head>
        <link rel="alternate" type="application/rss+xml" title="מדריכים" href="/feed.xml" />
        {heroOrigin && <link rel="preconnect" href={heroOrigin} crossOrigin="anonymous" />}
        <style dangerouslySetInnerHTML={{ __html: brandVars() }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}
