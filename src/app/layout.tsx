import type { Metadata, Viewport } from 'next';
import { Frank_Ruhl_Libre, Heebo } from 'next/font/google';
import './globals.css';

import { brand } from '@/lib/brand';
import { buildMetadata, legalServiceJsonLd, attorneyJsonLd, websiteJsonLd } from '@/lib/seo';
import { CookieConsent } from '@/components/legal/CookieConsent';
import { ChatBot } from '@/components/ai/ChatBot';
import { ConciergeProvider } from '@/components/ai/ConciergeProvider';
import { AccessibilityWidget } from '@/components/a11y/AccessibilityWidget';
import { WhatsAppButton } from '@/components/ai/WhatsAppButton';
import { ScrollProgress } from '@/components/motion/ScrollProgress';

/*
 * Fonts self-host at build time via next/font — no runtime requests to Google.
 */
const frank = Frank_Ruhl_Libre({
  subsets: ['hebrew', 'latin'],
  weight: ['400', '500', '700', '900'],
  variable: '--font-frank',
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

  return (
    <html lang="he" dir="rtl" className={`${frank.variable} ${heebo.variable}`}>
      <head>
        <link rel="alternate" type="application/rss+xml" title="מדריכים" href="/feed.xml" />
        <style dangerouslySetInnerHTML={{ __html: brandVars() }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <a href="#main" className="skip-link">
          דלג לתוכן הראשי
        </a>
        <ScrollProgress />
        <ConciergeProvider>
          {children}
          <ChatBot />
          <WhatsAppButton />
          <AccessibilityWidget />
        </ConciergeProvider>
        <CookieConsent />
      </body>
    </html>
  );
}
