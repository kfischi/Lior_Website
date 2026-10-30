import type { Stats } from '@/lib/learning/stats';

/** What visitors ask about, in numbers only (no questions, no names). */
export function StatsPanel({ stats }: { stats: Stats }) {
  const topics = Object.entries(stats.topics).sort((a, b) => b[1] - a[1]).slice(0, 8);
  const top = topics[0]?.[1] ?? 1;
  const max = Math.max(1, ...stats.perDay.map((d) => d.total));
  const unansweredShare = stats.total > 0 ? Math.round((stats.unanswered / stats.total) * 100) : 0;

  return (
    <section aria-labelledby="stats-title" className="rounded-2xl border border-navy/10 bg-white p-5 sm:p-6">
      <h2 id="stats-title" className="mb-1 text-2xl text-navy">
        מה אנשים שואלים
      </h2>
      <p className="mb-5 text-sm text-ink/75">
        {stats.days} הימים האחרונים. נשמרים רק מספרים ונושא כללי, לא השאלות עצמן ולא פרטים אישיים.
      </p>

      {stats.total === 0 ? (
        <p className="rounded-lg bg-cream p-4 text-ink/80">עדיין אין נתונים. הם יופיעו אחרי השיחות הראשונות.</p>
      ) : (
        <>
          <dl className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              ['שיחות', String(stats.total)],
              ['לא נענו', `${stats.unanswered} (${unansweredShare}%)`],
              ['סומנו "לא עזר"', String(stats.down)],
              ['השאירו פרטים', `${stats.leads}${stats.urgentLeads ? ` (${stats.urgentLeads} דחופות)` : ''}`],
            ].map(([label, value]) => (
              <div key={label} className="rounded-lg bg-cream p-3">
                <dt className="text-xs text-ink/75">{label}</dt>
                <dd className="mt-1 text-xl font-semibold text-navy">{value}</dd>
              </div>
            ))}
          </dl>

          <h3 className="mb-2 mt-6 text-lg font-semibold text-navy">הנושאים הנפוצים</h3>
          <ul className="space-y-2">
            {topics.map(([topic, n]) => (
              <li key={topic} className="grid grid-cols-[8.5rem_1fr_2rem] items-center gap-3 text-sm">
                <span className="text-ink/85">{topic}</span>
                <span className="h-3 overflow-hidden rounded-full bg-navy/10" aria-hidden="true">
                  <span className="block h-full rounded-full bg-accent" style={{ width: `${(n / top) * 100}%` }} />
                </span>
                <span className="text-end tabular-nums text-ink/85">{n}</span>
              </li>
            ))}
          </ul>

          <h3 className="mb-2 mt-6 text-lg font-semibold text-navy">שיחות ביום</h3>
          <div className="flex h-20 items-end gap-0.5" role="img" aria-label={`שיחות ביום, ב-${stats.days} הימים האחרונים`}>
            {stats.perDay.map((d) => (
              <span
                key={d.date}
                title={`${d.date}: ${d.total}`}
                className="flex-1 rounded-t bg-accent/70"
                style={{ height: `${Math.max(d.total > 0 ? 6 : 2, (d.total / max) * 100)}%` }}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
