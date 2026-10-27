import * as React from 'react';
import type { FormState } from '@/lib/actions/admin';
import type { LintWarning } from '@/lib/learning/lint';

export const INITIAL: FormState = { ok: false, message: '' };

/** Large, thumb-friendly controls (48px minimum height, 16px text so phones do not zoom). */
export const fieldClass =
  'mt-1.5 block min-h-12 w-full rounded-lg border border-navy/35 bg-white px-3 py-2.5 text-base text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-1';

export const tapClass = 'h-auto min-h-12 whitespace-normal px-5 py-2 text-base';

export const stackClass = 'flex flex-col gap-2 sm:flex-row sm:flex-wrap';

/** Result of an action: spoken to screen readers, never color-only. */
export function Status({ state }: { state: FormState }) {
  if (!state.message) return null;
  return (
    <p
      role={state.ok ? 'status' : 'alert'}
      className={
        state.ok
          ? 'rounded-lg bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-900'
          : 'rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-800'
      }
    >
      {state.ok ? 'בוצע: ' : 'שגיאה: '}
      {state.message}
    </p>
  );
}

/** Plain-Hebrew safety warnings. Always rendered as a live region so new ones are announced. */
export function WarningList({ warnings }: { warnings: LintWarning[] }) {
  return (
    <div aria-live="polite">
      {warnings.length > 0 && (
        <div className="rounded-lg border border-amber-600/60 bg-amber-50 p-3 text-amber-950">
          <p className="font-semibold">
            {warnings.length === 1 ? 'שימי לב: יש אזהרה אחת' : `שימי לב: יש ${warnings.length} אזהרות`}
          </p>
          <ul className="mt-2 space-y-3">
            {warnings.map((w) => (
              <li key={w.ruleId}>
                <p className="font-medium">{w.title}</p>
                <p className="mt-0.5 text-sm">{w.why}</p>
                <p className="mt-1 text-sm">
                  נמצא:{' '}
                  {w.matches.map((m, i) => (
                    <React.Fragment key={m}>
                      {i > 0 && ', '}
                      <bdi className="rounded bg-amber-200/70 px-1 font-medium">{m}</bdi>
                    </React.Fragment>
                  ))}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
