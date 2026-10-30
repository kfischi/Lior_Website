'use client';

import { brand, telHref } from '@/lib/brand';

/**
 * Last resort: if the root layout itself fails, the visitor still gets a page with a way to call, never a blank screen.
 * It replaces the whole document, so it carries its own <html> and plain styles.
 */
export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="he" dir="rtl">
      <body style={{ margin: 0, fontFamily: 'system-ui, sans-serif', background: '#0f1d33', color: '#f6f1e7' }}>
        <main style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: '1.5rem', textAlign: 'center' }}>
          <div style={{ maxWidth: '32rem' }}>
            <h1 style={{ fontSize: '1.75rem' }}>משהו השתבש</h1>
            <p style={{ lineHeight: 1.7 }}>
              אירעה תקלה בטעינת האתר. אפשר לנסות שוב, או להתקשר אלינו:{' '}
              <a href={telHref} style={{ color: 'inherit', fontWeight: 700 }}>
                <span dir="ltr">{brand.phone}</span>
              </a>
            </p>
            <button
              type="button"
              onClick={reset}
              style={{ minHeight: '2.75rem', padding: '0 1.5rem', borderRadius: '999px', border: 0, fontSize: '1rem', cursor: 'pointer' }}
            >
              ניסיון נוסף
            </button>
          </div>
        </main>
      </body>
    </html>
  );
}
