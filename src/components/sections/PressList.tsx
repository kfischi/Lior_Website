import { ArrowUpLeft } from 'lucide-react';
import { brand } from '@/lib/brand';
import { formatHebrewDate } from '@/lib/articles';

/** Pieces published on other sites. Renders nothing while `brand.press` is empty. */
export function PressList({ headingId }: { headingId: string }) {
  // Newest first; pieces without a known date come last.
  const items = [...brand.press].sort((a, b) => (b.date ?? '').localeCompare(a.date ?? ''));
  if (items.length === 0) return null;

  return (
    <div className="mt-16 border-t border-navy/10 pt-12">
      <p className="eyebrow mb-3">בתקשורת</p>
      <h3 id={headingId} className="mb-8 text-3xl text-navy md:text-4xl">
        כתבות וראיונות
      </h3>
      <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3" aria-labelledby={headingId}>
        {items.map((p) => (
          <li key={p.url}>
            <a
              href={p.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex h-full flex-col rounded-2xl border border-navy/10 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-accent hover:shadow-lg"
            >
              <span className="eyebrow mb-3">{p.outlet}</span>
              <span className="font-heading text-xl font-semibold leading-snug text-navy">{p.title}</span>
              {p.excerpt && (
                <span className="mt-3 line-clamp-3 flex-1 text-sm leading-relaxed text-ink/70">{p.excerpt}</span>
              )}
              <span className="mt-5 flex items-center justify-between text-xs text-ink/75">
                {p.date ? <time dateTime={p.date}>{formatHebrewDate(p.date)}</time> : <span />}
                <span className="flex items-center gap-1 font-medium text-accent">
                  לקריאה באתר {p.outlet}
                  <ArrowUpLeft className="h-4 w-4 transition-transform group-hover:-translate-y-0.5" aria-hidden="true" />
                  <span className="sr-only">(נפתח בחלון חדש)</span>
                </span>
              </span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
