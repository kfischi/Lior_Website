import type { Metadata } from 'next';
import { brand } from '@/lib/brand';
import { adminEnabled, isAdmin } from '@/lib/admin-auth';
import { listNotes, listUnknown } from '@/lib/learning/store';
import { logoutAction } from '@/lib/actions/admin';
import { LoginForm, LogoutButton, TestChatForm } from '@/components/admin/AdminForms';
import { NoteCard } from '@/components/admin/NoteCard';
import { NoteEditor } from '@/components/admin/NoteEditor';
import { UnknownRow } from '@/components/admin/UnknownRow';

export const metadata: Metadata = {
  title: 'ניהול העוזרת של ליאור',
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
    <main id="main" className="min-h-screen bg-cream py-8 sm:py-12">
      <div className="shell max-w-3xl">
        <p className="eyebrow mb-2">{brand.firmName}</p>
        <h1 className="text-3xl text-navy md:text-4xl">ניהול העוזרת של ליאור</h1>
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

  let notes: Awaited<ReturnType<typeof listNotes>> = [];
  let unknown: Awaited<ReturnType<typeof listUnknown>> = [];
  let loadFailed = false;
  try {
    [notes, unknown] = await Promise.all([listNotes(), listUnknown()]);
  } catch (err) {
    console.error('Loading admin data failed:', err);
    loadFailed = true;
  }

  // Drafts first: they are the ones waiting for a decision.
  const ordered = [...notes].sort(
    (a, b) => Number(a.status === 'approved') - Number(b.status === 'approved'),
  );
  const drafts = notes.filter((n) => n.status === 'draft').length;

  return (
    <div className="mt-6 space-y-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-ink/80">
          כאן מלמדים את העוזרת. כל תשובה מתחילה כטיוטה, ורק תשובה שאישרת נכנסת לשיחות.
        </p>
        <form action={logoutAction}>
          <LogoutButton />
        </form>
      </div>

      {loadFailed && (
        <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 font-medium text-red-800">
          שגיאה: לא הצלחנו לטעון את הרשימות. רעננו את הדף. האתר והצ׳אט ממשיכים לעבוד.
        </p>
      )}

      <section aria-labelledby="teach-title" className="rounded-2xl border border-navy/15 bg-white p-4 sm:p-6">
        <h2 id="teach-title" className="mb-4 text-2xl text-navy">
          ללמד משהו חדש
        </h2>
        <NoteEditor key={q ?? 'blank'} prefill={q} />
      </section>

      <section aria-labelledby="notes-title">
        <h2 id="notes-title" className="mb-1 text-2xl text-navy">
          מה העוזרת למדה ({notes.length})
        </h2>
        <p className="mb-4 text-sm text-ink/75">
          {drafts} טיוטות שמחכות לאישור, {notes.length - drafts} מאושרות ובשימוש.
        </p>
        {ordered.length === 0 ? (
          <p className="text-ink/70">עוד לא לימדת אותה כלום.</p>
        ) : (
          <ul className="space-y-4">
            {ordered.map((note) => (
              <NoteCard key={note.id} note={note} />
            ))}
          </ul>
        )}
      </section>

      <section aria-labelledby="unknown-title">
        <h2 id="unknown-title" className="mb-1 text-2xl text-navy">
          שאלות שהעוזרת לא ידעה לענות עליהן
        </h2>
        <p className="mb-4 text-sm text-ink/75">
          שאלות כלליות שנשמרו אוטומטית, בלי פרטים מזהים. לחצי &quot;ללמד&quot; כדי לענות עליהן.
        </p>
        {unknown.length === 0 ? (
          <p className="text-ink/70">אין שאלות ממתינות.</p>
        ) : (
          <ul className="space-y-3">
            {unknown.map((item) => (
              <UnknownRow key={item.id} id={item.id} question={item.question} count={item.count} />
            ))}
          </ul>
        )}
      </section>

      <section aria-labelledby="status-title" className="rounded-2xl border border-navy/15 bg-white p-4 sm:p-6">
        <h2 id="status-title" className="mb-1 text-2xl text-navy">
          מצב הצ׳אט
        </h2>
        <p className="mb-4 text-sm text-ink/75">בודק שהמודל מחובר, וכמה זמן לוקחת תשובה קצרה.</p>
        <TestChatForm />
      </section>
    </div>
  );
}
