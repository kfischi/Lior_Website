'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { track } from '@/lib/analytics/track';

function send(body: Record<string, unknown>) {
  try {
    navigator.sendBeacon?.('/api/e', new Blob([JSON.stringify(body)], { type: 'application/json' }));
  } catch {
    /* ignore */
  }
}

/** Cookieless, aggregate-only visit counter. Honors Do-Not-Track; stores nothing on the device except a per-tab flag. */
export function Tracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (navigator.webdriver || navigator.doNotTrack === '1') return;
    if (pathname.startsWith('/admin') || pathname.startsWith('/studio')) return;
    let first = false;
    try {
      first = !sessionStorage.getItem('v');
      if (first) sessionStorage.setItem('v', '1');
    } catch {
      /* private mode: count the page only */
    }
    const u = new URLSearchParams(location.search).get('utm_source') ?? undefined;
    send(first ? { p: pathname, s: true, r: document.referrer, u } : { p: pathname });
  }, [pathname]);

  useEffect(() => {
    const onClick = (ev: MouseEvent) => {
      const a = (ev.target as Element | null)?.closest?.('a[href]');
      const href = a?.getAttribute('href') ?? '';
      if (href.startsWith('tel:')) track('call_click');
      else if (href.startsWith('mailto:')) track('email_click');
      else if (/^https?:\/\/(wa\.me|api\.whatsapp\.com)\//.test(href)) track('whatsapp_click');
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  return null;
}
