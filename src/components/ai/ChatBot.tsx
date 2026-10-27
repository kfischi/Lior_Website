'use client';

import * as React from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { ArrowDown } from 'lucide-react';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { useConsentPending } from '@/components/legal/CookieConsent';
import { cn } from '@/lib/utils';
import { Avatar, ConciergePanel } from './ConciergePanel';
import { useConcierge } from './ConciergeProvider';

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Floating entry point to the conversation: a prominent labelled button with a
 * callout and a bobbing arrow until first use, and a bottom sheet on phones.
 */
function Floating() {
  const reduced = useReducedMotion();
  const { panelOpen, openPanel, closePanel } = useConcierge();
  const cookiePending = useConsentPending();
  const [opened, setOpened] = React.useState(false);

  // Keep the launcher clear of the cookie banner while it is showing.
  const bottom = cookiePending ? 'bottom-52 sm:bottom-24' : 'bottom-5';

  return (
    <>
      {!panelOpen && (
        <div className={cn('fixed end-3 z-[60] flex flex-col items-center gap-1.5 sm:end-5', bottom)}>
          {!opened && (
            <>
              <p className="rounded-2xl bg-white px-3 py-1.5 text-center text-sm font-semibold leading-snug text-navy shadow-xl ring-1 ring-navy/10">
                יש שאלה?
                <br />
                אני עונה מיד
              </p>
              <span
                aria-hidden="true"
                className="flex h-11 w-11 animate-arrow items-center justify-center rounded-full bg-accent text-white shadow-lg ring-2 ring-white"
              >
                <ArrowDown className="h-7 w-7" strokeWidth={3} />
              </span>
            </>
          )}
          <button
            type="button"
            onClick={() => {
              setOpened(true);
              openPanel();
            }}
            aria-label="שיחה עם המשרד, פתיחת העוזר הדיגיטלי"
            className="flex h-[4.5rem] w-[4.5rem] animate-ring items-center justify-center rounded-full bg-linear-to-l from-accent to-navy text-cream shadow-2xl ring-2 ring-white transition-transform duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-[1.04] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent-light"
          >
            <span className="relative flex" aria-hidden="true">
              <Avatar className="h-[3.75rem] w-[3.75rem] ring-2 ring-white" />
              <span className="absolute bottom-0 end-0 flex h-4 w-4">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-4 w-4 rounded-full bg-emerald-400 ring-2 ring-white" />
              </span>
            </span>
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
