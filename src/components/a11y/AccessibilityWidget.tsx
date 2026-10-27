'use client';

import * as React from 'react';
import Link from 'next/link';
import { RotateCcw, X } from 'lucide-react';
import { useConsentPending } from '@/components/legal/CookieConsent';
import { cn } from '@/lib/utils';

const STORAGE_KEY = 'a11y-prefs-v1';
const EVENT = 'a11y-prefs';

interface Prefs {
  /** 0–3 steps of text enlargement. */
  size: 0 | 1 | 2 | 3;
  contrast: boolean;
  gray: boolean;
  links: boolean;
  readable: boolean;
  spacing: boolean;
  motionOff: boolean;
  bigCursor: boolean;
}

const DEFAULTS: Prefs = {
  size: 0,
  contrast: false,
  gray: false,
  links: false,
  readable: false,
  spacing: false,
  motionOff: false,
  bigCursor: false,
};

const SIZE_PERCENT = [100, 112.5, 125, 150] as const;

function subscribe(onChange: () => void): () => void {
  window.addEventListener(EVENT, onChange);
  window.addEventListener('storage', onChange);
  return () => {
    window.removeEventListener(EVENT, onChange);
    window.removeEventListener('storage', onChange);
  };
}

function readRaw(): string {
  try {
    return localStorage.getItem(STORAGE_KEY) ?? '';
  } catch {
    return '';
  }
}

function parse(raw: string): Prefs {
  if (!raw) return DEFAULTS;
  try {
    const value: unknown = JSON.parse(raw);
    if (typeof value !== 'object' || value === null) return DEFAULTS;
    return { ...DEFAULTS, ...(value as Partial<Prefs>) };
  } catch {
    return DEFAULTS;
  }
}

function write(next: Prefs) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    /* storage unavailable: the choice then lasts for this page only */
  }
  window.dispatchEvent(new Event(EVENT));
}

/** Mirrors the preferences onto <html> so the CSS in globals.css can react. */
function applyToDocument(p: Prefs) {
  const root = document.documentElement;
  root.style.fontSize = p.size === 0 ? '' : `${SIZE_PERCENT[p.size]}%`;
  const set = (name: string, on: boolean, value: string) => {
    if (on) root.setAttribute(name, value);
    else root.removeAttribute(name);
  };
  set('data-a11y-contrast', p.contrast, 'high');
  set('data-a11y-gray', p.gray, 'on');
  set('data-a11y-links', p.links, 'on');
  set('data-a11y-font', p.readable, 'readable');
  set('data-a11y-spacing', p.spacing, 'on');
  set('data-a11y-motion', p.motionOff, 'off');
  set('data-a11y-cursor', p.bigCursor, 'big');
}

/** The familiar accessibility figure: head, outstretched arms, body and legs. */
function AccessibilityFigure({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <circle cx="12" cy="5" r="1.9" fill="currentColor" stroke="none" />
      <path d="M5 9.2c4.6 1.6 9.4 1.6 14 0" />
      <path d="M12 10.6v4.2" />
      <path d="M12 14.8 8.8 20" />
      <path d="M12 14.8 15.2 20" />
    </svg>
  );
}

type ToggleKey = Exclude<keyof Prefs, 'size'>;

const TOGGLES: { key: ToggleKey; label: string }[] = [
  { key: 'contrast', label: 'ניגודיות גבוהה' },
  { key: 'gray', label: 'גווני אפור' },
  { key: 'links', label: 'הדגשת קישורים' },
  { key: 'readable', label: 'גופן קריא' },
  { key: 'spacing', label: 'ריווח שורות ומילים' },
  { key: 'motionOff', label: 'עצירת אנימציות וסרטון' },
  { key: 'bigCursor', label: 'סמן עכבר גדול' },
];

/**
 * Accessibility menu: text size, contrast and motion preferences, stored on the
 * device. These are conveniences; the site itself is built to WCAG 2.1 AA.
 */
export function AccessibilityWidget() {
  const raw = React.useSyncExternalStore(subscribe, readRaw, () => '');
  const prefs = React.useMemo(() => parse(raw), [raw]);
  const cookiePending = useConsentPending();
  const [open, setOpen] = React.useState(false);
  const buttonRef = React.useRef<HTMLButtonElement>(null);

  React.useEffect(() => {
    applyToDocument(prefs);
  }, [prefs]);

  React.useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const changed = JSON.stringify(prefs) !== JSON.stringify(DEFAULTS);
  const bottom = cookiePending ? 'bottom-52 sm:bottom-24' : 'bottom-5';

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="a11y-menu"
        aria-label="תפריט נגישות"
        className={cn(
          'fixed start-5 z-[58] flex h-14 w-14 items-center justify-center rounded-full bg-[#1d3f93] text-white shadow-xl ring-2 ring-white transition-transform duration-200 hover:scale-105 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent-light',
          bottom,
        )}
      >
        <AccessibilityFigure className="h-9 w-9" />
      </button>

      {open && (
        <div
          id="a11y-menu"
          role="dialog"
          aria-label="תפריט נגישות"
          className={cn(
            'fixed start-3 z-[70] w-[min(20rem,calc(100vw-1.5rem))] rounded-2xl border border-navy/15 bg-cream p-5 text-ink shadow-2xl sm:start-5',
            cookiePending ? 'bottom-72 sm:bottom-44' : 'bottom-24',
          )}
        >
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-heading text-xl font-semibold text-navy">נגישות</h2>
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                buttonRef.current?.focus();
              }}
              aria-label="סגירת תפריט הנגישות"
              className="flex h-9 w-9 items-center justify-center rounded-full text-navy hover:bg-navy/10"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>

          <div className="mb-3 flex items-center justify-between gap-2 rounded-lg border border-navy/15 p-2">
            <span className="px-1 text-sm font-medium" id="a11y-size-label">
              גודל טקסט
            </span>
            <div className="flex items-center gap-1" role="group" aria-labelledby="a11y-size-label">
              <button
                type="button"
                disabled={prefs.size === 0}
                onClick={() => write({ ...prefs, size: (prefs.size - 1) as Prefs['size'] })}
                aria-label="הקטנת טקסט"
                className="h-9 w-9 rounded-md border border-navy/20 text-lg font-bold hover:bg-navy/10 disabled:opacity-40"
              >
                א-
              </button>
              <button
                type="button"
                disabled={prefs.size === 3}
                onClick={() => write({ ...prefs, size: (prefs.size + 1) as Prefs['size'] })}
                aria-label="הגדלת טקסט"
                className="h-9 w-9 rounded-md border border-navy/20 text-lg font-bold hover:bg-navy/10 disabled:opacity-40"
              >
                א+
              </button>
            </div>
          </div>

          <ul className="grid grid-cols-2 gap-2">
            {TOGGLES.map(({ key, label }) => (
              <li key={key}>
                <button
                  type="button"
                  aria-pressed={prefs[key]}
                  onClick={() => write({ ...prefs, [key]: !prefs[key] })}
                  className={cn(
                    'h-full min-h-14 w-full rounded-lg border px-2 py-2 text-sm font-medium leading-tight transition-colors',
                    prefs[key]
                      ? 'border-navy bg-navy text-cream'
                      : 'border-navy/20 bg-transparent text-ink hover:bg-navy/10',
                  )}
                >
                  {label}
                </button>
              </li>
            ))}
          </ul>

          <div className="mt-4 flex items-center justify-between gap-3 text-sm">
            <button
              type="button"
              onClick={() => write(DEFAULTS)}
              disabled={!changed}
              className="inline-flex items-center gap-1.5 rounded-md px-2 py-1.5 font-medium text-navy hover:bg-navy/10 disabled:opacity-40"
            >
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
              איפוס
            </button>
            <Link href="/legal/accessibility" className="font-medium text-accent underline underline-offset-2">
              הצהרת נגישות
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
