import type { Metadata } from 'next';
import Link from 'next/link';
import { brand } from '@/lib/brand';
import { adminEnabled, isAdmin } from '@/lib/admin-auth';
import { listNotes, listUnknown } from '@/lib/learning/store';
import {
  deleteNoteAction,
  dismissUnknownAction,
  logoutAction,
  toggleNoteAction,
} from '@/lib/actions/admin';
import { LoginForm, TeachForm } from '@/components/admin/AdminForms';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'ניהול העוזר הדיגיטלי',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;

  return (
    <main id="main" className="min-h-screen bg-cream py-12">
      <div className="shell max-w-3xl">
        <p className="eyebrow mb-2">{brand.firmName}</p>
        <h1 className="text-3xl text-navy md:text-4xl">ניהול העוזר הדיגיטלי</h1>
        <Body q={q} />
      </div>
    </main>
  );
}

async function Body({ q }: { q?: string }) {
  if (!adminEnabled()) {
    return (
      <p className="mt-8 rounded-lg border border-navy/15 bg-white p-5 text-ink/80">
        ממשק הניהול כבוי. כדי להפעיל אותו, מגדירים בשרת את המשתנה <code>ADMIN_PASSWORD</code>.
      </p>
    );
  }

  if (!(await isAdmin())) {
    return (
      <div className="mt-8 max-w-sm">
        <LoginForm />
      </div>
    );
  }

  const [notes, unknown] = await Promise.all([listNotes(), listUnknown()]);

  return (
    <div className="mt-6 space-y-12">
      <div className="flex items-center justify-between gap-4">
        <p className="text-ink/75">
          כאן מלמדים את העוזר. כל מה שנשמר נכנס לשיחות הבאות, ועדיף על הידע הקיים.
        </p>
        <form action={logoutAction}>
          <Button type="submit" variant="outline" size="sm">
            יציאה
          </Button>
        </form>
      </div>

      <section aria-labelledby="teach-title" className="rounded-2xl border border-navy/10 bg-white p-6">
        <h2 id="teach-title" className="mb-4 text-2xl text-navy">
          ללמד משהו חדש
        </h2>
        <TeachForm prefill={q} />
      </section>

      <section aria-labelledby="unknown-title">
        <h2 id="unknown-title" className="mb-1 text-2xl text-navy">
          שאלות שהעוזר לא ידע לענות עליהן
        </h2>
        <p className="mb-4 text-sm text-ink/65">
          שאלות כלליות שנשמרו אוטומטית, בלי פרטים מזהים. לחצי &quot;ללמד&quot; כדי לענות עליהן.
        </p>
        {unknown.length === 0 ? (
          <p className="text-ink/60">אין שאלות ממתינות.</p>
        ) : (
          <ul className="space-y-3">
            {unknown.map((item) => (
              <li
                key={item.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-navy/10 bg-white p-4"
              >
                <div>
                  <p className="font-medium text-navy">{item.question}</p>
                  <p className="text-xs text-ink/55">נשאלה {item.count} פעמים</p>
                </div>
                <div className="flex gap-2">
                  <Button asChild size="sm" variant="accent">
                    <Link href={`/admin?q=${encodeURIComponent(item.question)}`}>ללמד</Link>
                  </Button>
                  <form action={dismissUnknownAction}>
                    <input type="hidden" name="id" value={item.id} />
                    <Button type="submit" size="sm" variant="outline">
                      התעלם
                    </Button>
                  </form>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section aria-labelledby="notes-title">
        <h2 id="notes-title" className="mb-4 text-2xl text-navy">
          מה העוזר כבר למד ({notes.length})
        </h2>
        {notes.length === 0 ? (
          <p className="text-ink/60">עוד לא לימדת אותו כלום.</p>
        ) : (
          <ul className="space-y-3">
            {notes.map((note) => (
              <li key={note.id} className="rounded-xl border border-navy/10 bg-white p-4">
                {note.question && <p className="font-medium text-navy">{note.question}</p>}
                <p className={note.enabled ? 'mt-1 text-ink/85' : 'mt-1 text-ink/45 line-through'}>
                  {note.answer}
                </p>
                <div className="mt-3 flex gap-2">
                  <form action={toggleNoteAction}>
                    <input type="hidden" name="id" value={note.id} />
                    <input type="hidden" name="enabled" value={String(!note.enabled)} />
                    <Button type="submit" size="sm" variant="outline">
                      {note.enabled ? 'השבתה' : 'הפעלה'}
                    </Button>
                  </form>
                  <form action={deleteNoteAction}>
                    <input type="hidden" name="id" value={note.id} />
                    <Button type="submit" size="sm" variant="ghost">
                      מחיקה
                    </Button>
                  </form>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
