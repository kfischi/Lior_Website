'use client';

import * as React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const STORAGE_KEY = 'cookie-consent-v1';

type Consent = 'accepted' | 'declined';

/**
 * Cookie consent banner. Non-essential scripts (analytics, marketing) must be
 * gated behind acceptance. Read the choice elsewhere with `hasConsent()`, or
 * listen for the `cookie-consent` CustomEvent to fire scripts after opt-in.
 */
export function CookieConsent() {
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) setVisible(true);
    } catch {
      /* storage blocked — show banner anyway */
      setVisible(true);
    }
  }, []);

  function decide(choice: Consent) {
    try {
      localStorage.setItem(STORAGE_KEY, choice);
    } catch {
      /* ignore */
    }
    window.dispatchEvent(
      new CustomEvent('cookie-consent', { detail: { choice } }),
    );
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="הודעת עוגיות"
      className="fixed inset-x-0 bottom-0 z-[60] border-t border-border bg-card/95 backdrop-blur"
    >
      <div className="container flex flex-col items-start gap-3 py-4 md:flex-row md:items-center md:justify-between">
        <p className="text-sm leading-relaxed text-muted-foreground">
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

/** Helper for gating non-essential scripts elsewhere in the app. */
export function hasConsent(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'accepted';
  } catch {
    return false;
  }
}
