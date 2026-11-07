import type { VisitDay } from '@/lib/analytics/store';
import { SOURCE_LABELS } from '@/lib/analytics/sources';

const EVENT_LABELS: Record<string, string> = {
  chat_open: 'פתחו את הצ׳אט',
  call_click: 'לחצו על חיוג',
  whatsapp_click: 'לחצו על וואטסאפ',
  email_click: 'לחצו על מייל',
  lead: 'השאירו פרטים',
  booking_request: 'ביקשו פגישה',
};

function sum(days: VisitDay[], pick: (d: VisitDay) => Record<string, number>) {
  const out: Record<string, number> = {};
  for (const d of days) for (const [k, v] of Object.entries(pick(d))) out[k] = (out[k] ?? 0) + v;
  return Object.entries(out).sort((a, b) => b[1] - a[1]);
}

function Bars({ rows, label }: { rows: [string, number][]; label: (k: string) => string }) {
  const top = rows[0]?.[1] ?? 1;
  return (
    <ul className="space-y-2">
      {rows.map(([k, n]) => (
        <li key={k} className="grid grid-cols-[8.5rem_1fr_2.5rem] items-center gap-3 text-sm">
          <span className="truncate text-ink/85" dir="auto">{label(k)}</span>
          <span className="h-3 overflow-hidden rounded-full bg-navy/10" aria-hidden="true">
            <span className="block h-full rounded-full bg-accent" style={{ width: `${(n / top) * 100}%` }} />
          </span>
          <span className="text-end tabular-nums text-ink/85">{n}</span>
        </li>
      ))}
    </ul>
  );
}

/** Anonymous visit statistics: counts only, no visitor identity. */
export function VisitsPanel({ days }: { days: VisitDay[] }) {
  const sessions = days.reduce((a, d) => a + d.sessions, 0);
  const views = days.reduce((a, d) => a + d.pageviews, 0);
  const sources = sum(days, (d) => d.sources);
  const pages = sum(days, (d) => d.pages).slice(0, 8);
  const events = sum(days, (d) => d.events);
  const convAll = sum(days, (d) => d.conv ?? {}).filter(([k]) => !k.endsWith(':chat_open'));
  const bySourceMap: Record<string, number> = {};
  for (const [k, n] of convAll) bySourceMap[k.split(':')[0]] = (bySourceMap[k.split(':')[0]] ?? 0) + n;
  const bySource = Object.entries(bySourceMap).sort((a, b) => b[1] - a[1]);
  const contacts = events.filter(([k]) => ['call_click', 'whatsapp_click', 'email_click', 'lead', 'booking_request'].includes(k)).reduce((a, [, n]) => a + n, 0);
  const conv = sessions > 0 ? Math.round((contacts / sessions) * 100) : 0;

  return (
    <section aria-labelledby="visits-title" className="rounded-2xl border border-navy/10 bg-white p-5 sm:p-6">
      <h2 id="visits-title" className="mb-1 text-2xl text-navy">מי מגיע לאתר</h2>
      <p className="mb-5 text-sm text-ink/75">
        {days.length} הימים האחרונים. סטטיסטיקה מצטברת ואנונימית: בלי עוגיות, בלי כתובות IP ובלי מעקב אחרי אדם מסוים.
      </p>
      {views === 0 ? (
        <p className="rounded-lg bg-cream p-4 text-ink/80">עדיין אין נתונים. הם יופיעו אחרי הביקורים הראשונים.</p>
      ) : (
        <>
          <dl className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              ['ביקורים', String(sessions)],
              ['צפיות בעמודים', String(views)],
              ['פעולות יצירת קשר', String(contacts)],
              ['אחוז פנייה', `${conv}%`],
            ].map(([l, v]) => (
              <div key={l} className="rounded-lg bg-cream p-3">
                <dt className="text-xs text-ink/75">{l}</dt>
                <dd className="mt-1 text-xl font-semibold text-navy">{v}</dd>
              </div>
            ))}
          </dl>
          <h3 className="mb-2 mt-6 text-lg font-semibold text-navy">מאיפה הגיעו</h3>
          <Bars rows={sources} label={(k) => SOURCE_LABELS[k] ?? k} />
          <h3 className="mb-2 mt-6 text-lg font-semibold text-navy">איזה מקור מביא פניות</h3>
          <p className="mb-2 text-sm text-ink/75">פעולות יצירת קשר (חיוג, וואטסאפ, מייל, השארת פרטים, בקשת פגישה) לפי מקור ההגעה, מתוך הביקורים.</p>
          {bySource.length ? (
            <ul className="space-y-2">
              {bySource.map(([src, n]) => {
                const visits = sources.find(([k]) => k === src)?.[1] ?? 0;
                return (
                  <li key={src} className="flex items-baseline justify-between gap-3 rounded-lg bg-cream px-3 py-2 text-sm">
                    <span className="text-ink/85">{SOURCE_LABELS[src] ?? src}</span>
                    <span className="tabular-nums text-navy">
                      {n} פעולות מתוך {visits} ביקורים{visits > 0 ? ` (${Math.round((n / visits) * 100)}%)` : ''}
                    </span>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="text-sm text-ink/70">עוד אין פעולות עם מקור ידוע.</p>
          )}
          <h3 className="mb-2 mt-6 text-lg font-semibold text-navy">העמודים הנצפים ביותר</h3>
          <Bars rows={pages} label={(k) => k} />
          <h3 className="mb-2 mt-6 text-lg font-semibold text-navy">פעולות</h3>
          {events.length ? <Bars rows={events} label={(k) => EVENT_LABELS[k] ?? k} /> : <p className="text-sm text-ink/70">עוד אין פעולות.</p>}
        </>
      )}
    </section>
  );
}
