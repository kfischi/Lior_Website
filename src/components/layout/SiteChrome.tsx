'use client';

import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { CookieConsent } from '@/components/legal/CookieConsent';
import { ChatBot } from '@/components/ai/ChatBot';
import { ConciergeProvider } from '@/components/ai/ConciergeProvider';
import { AccessibilityWidget } from '@/components/a11y/AccessibilityWidget';
import { ScrollProgress } from '@/components/motion/ScrollProgress';

/**
 * Everything that floats over the public pages (chat, accessibility, cookie notice,
 * progress bar). The editing screen at /studio is a separate app and gets none of it.
 */
export function SiteChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  if (pathname === '/studio' || pathname.startsWith('/studio/')) return <>{children}</>;

  return (
    <>
      <a href="#main" className="skip-link">
        דלג לתוכן הראשי
      </a>
      <ScrollProgress />
      <ConciergeProvider>
        {children}
        <ChatBot />
        <AccessibilityWidget />
      </ConciergeProvider>
      <CookieConsent />
    </>
  );
}
