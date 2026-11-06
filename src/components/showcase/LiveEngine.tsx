'use client';

import * as React from 'react';

/** Asks the chat route which engine answers right now, so the demo shows the real setup, not a claim. */
export function LiveEngine() {
  const [engine, setEngine] = React.useState<string | null>(null);
  const [failed, setFailed] = React.useState(false);

  React.useEffect(() => {
    const controller = new AbortController();
    fetch('/api/chat', { signal: controller.signal })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((d: { engine?: unknown }) => setEngine(typeof d.engine === 'string' ? d.engine : null))
      .catch(() => {
        if (!controller.signal.aborted) setFailed(true);
      });
    return () => controller.abort();
  }, []);

  return (
    <p role="status" className="text-sm text-cream/80">
      {failed
        ? 'המנוע שעונה כרגע: לא זמין לבדיקה'
        : engine
          ? `המנוע שעונה כרגע: ${engine === 'local (no API)' ? 'מנוע מקומי, בלי מודל חיצוני' : engine}`
          : 'בודקת איזה מנוע עונה…'}
    </p>
  );
}
