'use client';

import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { CookieConsent } from '@/components/legal/CookieConsent';
import { ChatBot } from '@/components/ai/ChatBot';
import { ConciergeProvider } from '@/components/ai/ConciergeProvider';
import { AccessibilityWidget } from '@/components/a11y/AccessibilityWidget';
import { ScrollProgress } from '@/components/motion/ScrollProgress';
import { Tracker } from '@/components/analytics/Tracker';
import { BrandProvider } from './BrandProvider';
import type { ClientBrand } from '@/lib/client-brand';

/**
 * Everything that floats over the public pages (chat, accessibility, cookie notice,
 * progress bar). The editing screen at /studio is a separate app and gets none of it.
 */
export function SiteChrome({ children, brand }: { children: ReactNode; brand: ClientBrand }) {
  const pathname = usePathname();
  if (pathname === '/studio' || pathname.startsWith('/studio/')) return <>{children}</>;

  return (
    <BrandProvider value={brand}>
      <a href="#main" className="skip-link">
        דלג לתוכן הראשי
      </a>
      <Tracker />
      <ScrollProgress />
      <ConciergeProvider>
        {children}
        <ChatBot />
        <AccessibilityWidget />
      </ConciergeProvider>
      <CookieConsent />
    </BrandProvider>
  );
}
