'use client';

import * as React from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { ArrowDown, X } from 'lucide-react';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { useConsentPending } from '@/components/legal/CookieConsent';
import { cn } from '@/lib/utils';
import { Avatar, ConciergePanel } from './ConciergePanel';
import { useConcierge } from './ConciergeProvider';

const EASE = [0.22, 1, 0.36, 1] as const;
const NUDGE_KEY = 'concierge-nudge-seen';

function readSeen(): boolean {
  try {
    return sessionStorage.getItem(NUDGE_KEY) === '1';
  } catch {
    return true;
  }
}

/**
 * Floating entry point to the conversation: a labelled pill (so people notice
 * it), a single gentle nudge after a while, and a bottom sheet on phones.
 */
function Floating() {
  const reduced = useReducedMotion();
  const { panelOpen, openPanel, closePanel } = useConcierge();
  const cookiePending = useConsentPending();
  const [nudge, setNudge] = React.useState(false);
  const [opened, setOpened] = React.useState(false);

  React.useEffect(() => {
    if (readSeen()) return;
    const t = window.setTimeout(() => setNudge(true), 12000);
    return () => window.clearTimeout(t);
  }, []);

  function dismissNudge() {
    setNudge(false);
    try {
      sessionStorage.setItem(NUDGE_KEY, '1');
    } catch {
      /* ignore */
    }
  }

  // Keep the launcher clear of the cookie banner while it is showing.
  const bottom = cookiePending ? 'bottom-52 sm:bottom-24' : 'bottom-5';

  return (
    <>
      <AnimatePresence>
        {nudge && !panelOpen && (
          <motion.div
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: EASE }}
            className={cn(
              'fixed end-5 z-[60] max-w-[16rem] rounded-2xl rounded-ee-sm bg-navy px-4 py-3 text-sm text-cream shadow-xl',
              cookiePending ? 'bottom-80 sm:bottom-52' : 'bottom-40',
            )}
          >
            <button
              type="button"
              onClick={dismissNudge}
              aria-label="סגירת ההודעה"
              className="absolute -start-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-cream text-navy shadow"
            >
              <X className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              className="text-start"
              onClick={() => {
                dismissNudge();
                openPanel();
              }}
            >
              יש שאלה על המקרה שלכם? אפשר לשאול אותי, בדיסקרטיות.
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {!panelOpen && (
        <div className={cn('fixed end-5 z-[60] flex flex-col items-center gap-1.5', bottom)}>
          {!opened && (
            <ArrowDown
              aria-hidden="true"
              strokeWidth={3}
              className="h-9 w-9 animate-arrow text-accent drop-shadow-[0_1px_2px_rgb(255_255_255/0.9)]"
            />
          )}
          <button
            type="button"
            onClick={() => {
              dismissNudge();
              setOpened(true);
              openPanel();
            }}
            aria-label="שיחה עם המשרד, פתיחת העוזר הדיגיטלי"
            className="flex h-14 animate-ring items-center gap-2.5 rounded-full bg-accent px-5 text-cream shadow-xl ring-2 ring-cream/70 transition-transform duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-[1.03] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-navy"
          >
            <span className="relative flex" aria-hidden="true">
              <Avatar className="h-9 w-9" />
              <span className="absolute -bottom-0.5 -end-0.5 flex h-3 w-3">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-light opacity-75" />
                <span className="relative inline-flex h-3 w-3 animate-blink rounded-full bg-accent-light ring-2 ring-accent" />
              </span>
            </span>
            <span className="text-sm font-medium">שיחה עם המשרד</span>
          </button>
        </div>
      )}

      <AnimatePresence>
        {panelOpen && (
          <motion.div
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.98 }}
            transition={{ duration: 0.25, ease: EASE }}
            className="fixed inset-x-3 bottom-3 z-[60] sm:inset-x-auto sm:bottom-5 sm:end-5 sm:w-[24rem]"
          >
            <ConciergePanel
              autoFocus
              onClose={closePanel}
              className="h-[min(36rem,calc(100dvh-1.5rem))] rounded-2xl border border-navy/10 shadow-2xl"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/** Wrapped in an error boundary so a failure here never blanks the page. */
export function ChatBot() {
  return (
    <ErrorBoundary fallback={null}>
      <Floating />
    </ErrorBoundary>
  );
}
