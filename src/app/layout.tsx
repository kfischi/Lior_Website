import type { Metadata } from 'next';
import { Frank_Ruhl_Libre, Heebo } from 'next/font/google';
import './globals.css';

import { brand } from '@/lib/brand';
import { hexToHslTriplet } from '@/lib/color';
import { buildMetadata, legalServiceJsonLd, attorneyJsonLd } from '@/lib/seo-config';
import { CookieConsent } from '@/components/legal/CookieConsent';
import { ChatBot } from '@/components/ai/ChatBot';

/*
 * Fonts are loaded with next/font, which self-hosts them at build time.
 * There are NO runtime requests to Google — the files are served from our own
 * origin, satisfying the privacy + performance requirements.
 */
const heading = Frank_Ruhl_Libre({
  subsets: ['hebrew', 'latin'],
  weight: ['400', '500', '700', '900'],
  variable: '--font-heading',
  display: 'swap',
});

const body = Heebo({
  subsets: ['hebrew', 'latin'],
  weight: ['300', '400', '500', '700'],
  variable: '--font-body',
  display: 'swap',
});

export const metadata: Metadata = buildMetadata();

/** Inject brand.ts colors as CSS variables so editing brand.ts re-themes all. */
function brandStyle(): string {
  const { navy, cream, bronze, ink } = brand.colors;
  return `:root{
    --brand-navy:${navy};
    --brand-cream:${cream};
    --brand-bronze:${bronze};
    --brand-ink:${ink};
    --background:${hexToHslTriplet(cream)};
    --foreground:${hexToHslTriplet(ink)};
    --primary:${hexToHslTriplet(navy)};
    --primary-foreground:${hexToHslTriplet(cream)};
    --accent:${hexToHslTriplet(bronze)};
    --accent-foreground:${hexToHslTriplet(cream)};
    --ring:${hexToHslTriplet(bronze)};
    --secondary-foreground:${hexToHslTriplet(navy)};
  }`;
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const ld = [legalServiceJsonLd(), attorneyJsonLd()];

  return (
    <html lang="he" dir="rtl" className={`${heading.variable} ${body.variable}`}>
      <head>
        {/* Brand color tokens — single source of truth is src/lib/brand.ts */}
        <style dangerouslySetInnerHTML={{ __html: brandStyle() }} />
        {/* Organization + Attorney structured data on every page */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
        />
      </head>
      <body>
        <a href="#main" className="skip-link">
          דלג לתוכן הראשי
        </a>
        {children}
        <ChatBot />
        <CookieConsent />
      </body>
    </html>
  );
}
