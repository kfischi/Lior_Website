'use client';

import * as React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const STORAGE_KEY = 'cookie-consent-v1';
const EVENT = 'cookie-consent';
type Consent = 'accepted' | 'declined';

/** Subscribe to consent changes (our custom event + cross-tab storage event). */
function subscribe(onChange: () => void): () => void {
  window.addEventListener(EVENT, onChange);
  window.addEventListener('storage', onChange);
  return () => {
    window.removeEventListener(EVENT, onChange);
    window.removeEventListener('storage', onChange);
  };
}

function readConsent(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

/**
 * Cookie consent banner. Reads the stored choice via useSyncExternalStore (the
 * idiomatic way to read an external store), so there is no setState-in-effect.
 * Non-essential scripts should gate on hasConsent() or the `cookie-consent` event.
 */
export function CookieConsent() {
  const consent = React.useSyncExternalStore(
    subscribe,
    readConsent,
    () => null, // server snapshot
  );

  if (consent !== null) return null;

  function decide(choice: Consent) {
    try {
      localStorage.setItem(STORAGE_KEY, choice);
    } catch {
      /* ignore */
    }
    window.dispatchEvent(new CustomEvent(EVENT, { detail: { choice } }));
  }

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="הודעת עוגיות"
      className="fixed inset-x-0 bottom-0 z-[55] border-t border-navy/10 bg-cream/95 backdrop-blur"
    >
      <div className="shell flex flex-col items-start gap-3 py-4 md:flex-row md:items-center md:justify-between">
        <p className="text-sm leading-relaxed text-ink/70">
          אתר זה עושה שימוש בעוגיות חיוניות לתפעולו. בכפוף לאישורכם נשתמש גם
          בעוגיות לשיפור החוויה ולמדידה. למידע נוסף עיינו ב
          <Link href="/legal/privacy" className="mx-1 text-accent underline underline-offset-2">
            מדיניות הפרטיות
          </Link>
          .
        </p>
        <div className="flex shrink-0 gap-2">
          <Button size="sm" variant="outline" onClick={() => decide('declined')}>
            רק חיוניות
          </Button>
          <Button size="sm" variant="accent" onClick={() => decide('accepted')}>
            אישור
          </Button>
        </div>
      </div>
    </div>
  );
}

/** True while the cookie banner is on screen, so other fixed UI can make room. */
export function useConsentPending(): boolean {
  return React.useSyncExternalStore(
    subscribe,
    () => readConsent() === null,
    () => false,
  );
}

export function hasConsent(): boolean {
  return readConsent() === 'accepted';
}
