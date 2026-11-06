'use client';

import * as React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useReducedMotion } from '@/components/motion/useReducedMotionSafe';
import type { SiteTarget } from '@/lib/site-actions';
import { useConcierge } from './ConciergeProvider';
import { spotlight } from './tour';

/**
 * Takes the visitor where the assistant points: scrolls to a section of the page and lights it,
 * or opens another page. On a phone the chat covers the page, so it is closed first; on a wide
 * screen it stays open beside what it is showing.
 */
export function useSiteNavigator() {
  const router = useRouter();
  const pathname = usePathname();
  const reduced = useReducedMotion();
  const { closePanel } = useConcierge();

  return React.useCallback(
    (target: SiteTarget, options: { auto?: boolean } = {}) => {
      const wide = window.matchMedia('(min-width: 1024px)').matches;
      if (!wide && !options.auto) closePanel();
      const [path, hash] = target.href.split('#');
      const samePage = (path || '/') === pathname;

      const reveal = (id: string): boolean => {
        const el = document.getElementById(id);
        if (!el) return false;
        const top = el.getBoundingClientRect().top + window.scrollY - 88;
        window.scrollTo({ top, behavior: reduced ? 'auto' : 'smooth' });
        spotlight(el);
        return true;
      };

      if (samePage && hash) {
        reveal(hash);
        return;
      }
      if (samePage && !hash && (path || '/') === '/') {
        window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
        return;
      }
      router.push(target.href);
      if (hash) {
        // The page is still loading: light the section once it exists.
        let tries = 0;
        const timer = window.setInterval(() => {
          tries += 1;
          if (reveal(hash) || tries > 20) window.clearInterval(timer);
        }, 150);
      }
    },
    [closePanel, pathname, reduced, router],
  );
}
