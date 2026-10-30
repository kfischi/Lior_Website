'use client';

import * as React from 'react';
import { FileText, Loader2, Phone, X } from 'lucide-react';
import { brand, telHref } from '@/lib/brand';
import { readDocument, summaryForChat, type DocumentReading } from '@/lib/document/analyze';

type State =
  | { step: 'idle' }
  | { step: 'reading'; progress: number }
  | { step: 'done'; reading: DocumentReading; text: string }
  | { step: 'error'; message: string };

const MAX_SIDE = 2000;

/** Photo -> canvas, shrunk so a phone picture reads in seconds. */
async function toCanvas(file: File): Promise<HTMLCanvasElement> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('canvas');
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  return canvas;
}

function relative(days: number): string {
  if (days === 0) return 'היום';
  if (days === 1) return 'מחר';
  if (days > 1) return `בעוד ${days} ימים`;
  if (days === -1) return 'אתמול';
  return `לפני ${-days} ימים`;
}

/**
 * Reads a photo of a letter inside the visitor's own browser (offline text recognition, Hebrew model served from
 * this site) and says what kind of document it looks like and which dates it mentions. The picture and the text
 * never leave the device unless the visitor chooses to send a one-line summary to the chat.
 */
export function DocumentReader({ onClose, onSend }: { onClose: () => void; onSend: (text: string) => void }) {
  const [state, setState] = React.useState<State>({ step: 'idle' });
  const inputRef = React.useRef<HTMLInputElement>(null);
  const closeRef = React.useRef<HTMLButtonElement>(null);

  React.useEffect(() => {
    closeRef.current?.focus();
  }, []);

  async function run(file: File) {
    if (!file.type.startsWith('image/')) {
      setState({ step: 'error', message: 'כרגע אפשר לקרוא תמונה של המסמך (צילום או צילום מסך). קובצי PDF עדיין לא נתמכים.' });
      return;
    }
    setState({ step: 'reading', progress: 0 });
    try {
      const canvas = await toCanvas(file);
      const { createWorker } = await import('tesseract.js');
      // Two passes over the same picture: Hebrew for the words, English for the digits and dates it reads better.
      const digits = await createWorker('eng', 1, { workerPath: '/ocr/worker.min.js', corePath: '/ocr', langPath: '/ocr/lang' });
      const worker = await createWorker('heb', 1, {
        workerPath: '/ocr/worker.min.js',
        corePath: '/ocr',
        langPath: '/ocr/lang',
        logger: (m) => {
          if (m.status === 'recognizing text') setState({ step: 'reading', progress: m.progress });
        },
      });
      try {
        const { data } = await worker.recognize(canvas);
        const text = data.text.trim();
        const more = (await digits.recognize(canvas)).data.text;
        if (text.length < 8) {
          setState({ step: 'error', message: 'לא הצלחתי לקרוא טקסט בתמונה. כדאי לצלם ישר, באור טוב, כך שהמסמך ממלא את התמונה.' });
          return;
        }
        setState({ step: 'done', reading: readDocument(text, new Date(), more), text });
      } finally {
        void worker.terminate();
        void digits.terminate();
      }
    } catch (err) {
      console.error('Reading the document failed:', err);
      setState({ step: 'error', message: 'לא הצלחתי לקרוא את המסמך במכשיר הזה. אפשר לצלם שוב, או לתאר לי במילים מה כתוב בו.' });
    }
  }

  return (
    <div
      role="region"
      aria-label="קריאת מכתב או מסמך"
      className="absolute inset-0 z-40 flex flex-col overflow-y-auto bg-cream"
    >
      <div className="flex items-center justify-between gap-3 bg-navy px-4 py-3 text-cream">
        <h2 className="flex items-center gap-2 font-heading text-base font-semibold">
          <FileText className="h-5 w-5" aria-hidden="true" />
          קריאת מכתב או מסמך
        </h2>
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="סגירה"
          className="rounded-full p-2 text-cream/85 hover:bg-cream/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-light"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="space-y-4 p-4 text-[0.9375rem] leading-relaxed text-ink/90">
        <p className="rounded-lg bg-white p-3 text-sm">
          המסמך נקרא <strong>בדפדפן שלך בלבד</strong>. התמונה והטקסט לא נשלחים לשום מקום ולא נשמרים. נשלח לצ׳אט רק מה שתבחרו.
        </p>

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="sr-only"
          aria-label="בחירת תמונה של המסמך"
          onChange={(e) => {
            const file = e.target.files?.[0];
            e.target.value = '';
            if (file) void run(file);
          }}
        />

        {(state.step === 'idle' || state.step === 'error') && (
          <>
            {state.step === 'error' && (
              <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 font-medium text-red-800">
                {state.message}
              </p>
            )}
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-accent px-3 py-3 font-medium text-cream hover:bg-accent/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-light"
            >
              <FileText className="h-5 w-5" aria-hidden="true" />
              צילום או בחירת תמונה של המסמך
            </button>
            <p className="text-sm text-ink/75">מתאים למכתב פיטורים, זימון לשימוע, הזמנה לחקירה ומכתבי התראה. אפשר לצלם גם מהטלפון.</p>
          </>
        )}

        {state.step === 'reading' && (
          <div role="status" className="flex items-center gap-3 rounded-lg bg-white p-4">
            <Loader2 className="h-5 w-5 animate-spin text-accent motion-reduce:animate-none" aria-hidden="true" />
            <span>קוראת את המסמך... {state.progress > 0 ? `${Math.round(state.progress * 100)}%` : ''}</span>
          </div>
        )}

        {state.step === 'done' && (
          <div className="space-y-4">
            <div className="rounded-lg bg-white p-4">
              <h3 className="font-semibold text-navy">מה זיהיתי (משוער)</h3>
              <p className="mt-2">
                {state.reading.label ? `נראה כמו: ${state.reading.label}.` : 'לא זיהיתי איזה סוג מסמך זה.'}
              </p>
              {state.reading.dates.length > 0 ? (
                <ul className="mt-2 space-y-1">
                  {state.reading.dates.slice(0, 6).map((d) => (
                    <li key={d.iso}>
                      תאריך שמופיע במסמך: <strong>{d.text}</strong> ({relative(d.inDays)})
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-2">לא מצאתי תאריכים במסמך.</p>
              )}
            </div>

            <p className="rounded-lg border border-accent/40 bg-white p-3 text-sm">
              זה זיהוי אוטומטי וייתכנו טעויות. הוא לא קובע מה המועד האחרון לפעולה או מה כדאי לעשות: את זה בודקים מול המסמך עצמו
              עם עורכת הדין.{state.reading.urgent ? ' כשיש מועד קרוב, עדיף להתקשר היום.' : ''}
            </p>

            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={() => onSend(summaryForChat(state.reading))}
                className="rounded-lg bg-accent px-3 py-2.5 font-medium text-cream hover:bg-accent/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-light"
              >
                שליחה לצ׳אט (רק סוג המסמך והתאריכים)
              </button>
              {state.reading.urgent && (
                <a
                  href={telHref}
                  className="flex items-center justify-center gap-2 rounded-lg border border-navy/25 bg-white px-3 py-2.5 font-medium text-navy hover:border-accent hover:text-accent"
                >
                  <Phone className="h-4 w-4" aria-hidden="true" />
                  התקשרות למשרד: {brand.phone}
                </a>
              )}
              <button
                type="button"
                onClick={() => setState({ step: 'idle' })}
                className="rounded-lg border border-navy/25 bg-white px-3 py-2.5 text-navy hover:border-accent hover:text-accent"
              >
                קריאת מסמך אחר
              </button>
            </div>

            <details className="text-sm">
              <summary className="cursor-pointer text-ink/80">הטקסט שנקרא (מוצג רק כאן, במכשיר שלך)</summary>
              <pre dir="rtl" className="mt-2 max-h-48 overflow-auto whitespace-pre-wrap rounded-lg bg-white p-3 text-xs">
                {state.text}
              </pre>
            </details>
          </div>
        )}
      </div>
    </div>
  );
}
