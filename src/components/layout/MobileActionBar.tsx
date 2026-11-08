'use client';

import Link from 'next/link';
import { CalendarCheck, MessageCircle, Phone } from 'lucide-react';
import { useBrand } from '@/components/layout/BrandProvider';
import { links } from '@/lib/brand-links';

const item =
  'flex min-h-14 flex-1 flex-col items-center justify-center gap-0.5 px-2 text-xs font-medium text-cream focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-accent-light';

/**
 * Phones only: the three ways to reach the office stay one tap away while scrolling.
 * Fixed UI above it (chat launcher, accessibility button) is lifted to make room.
 */
export function MobileActionBar() {
  const brand = useBrand();
  const l = links(brand);
  return (
    <>
      <nav
        aria-label="יצירת קשר מהירה"
        className="fixed inset-x-0 bottom-0 z-[50] border-t border-cream/15 bg-navy pb-[env(safe-area-inset-bottom)] sm:hidden"
      >
        <p className="border-b border-cream/10 py-1 text-center text-xs font-medium text-accent-light">
          צריכים ייעוץ משפטי דחוף? מדברים עכשיו
        </p>
        <div className="flex divide-x divide-x-reverse divide-cream/15">
        <a href={l.tel} className={item}>
          <Phone className="h-5 w-5" aria-hidden="true" />
          התקשרו
        </a>
        <a href={l.whatsapp} target="_blank" rel="noopener noreferrer" className={item}>
          <MessageCircle className="h-5 w-5" aria-hidden="true" />
          וואטסאפ
          <span className="sr-only"> (נפתח בחלון חדש)</span>
        </a>
        <Link href="/consultation" className={`${item} bg-accent`}>
          <CalendarCheck className="h-5 w-5" aria-hidden="true" />
          קבעו פגישה
        </Link>
        </div>
      </nav>
      {/* Keeps the end of the page from sitting under the bar. */}
      <div aria-hidden="true" className="h-[4.75rem] sm:hidden" />
    </>
  );
}
