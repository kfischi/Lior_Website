'use client';

import * as React from 'react';
import { useActionState } from 'react';
import {
  approveNoteAction,
  deleteNoteAction,
  unapproveNoteAction,
} from '@/lib/actions/admin';
import { lintNote } from '@/lib/learning/lint';
import type { Note } from '@/lib/learning/types';
import { Button } from '@/components/ui/button';
import { NoteEditor } from './NoteEditor';
import { INITIAL, Status, WarningList, stackClass, tapClass } from './shared';

const wide = `${tapClass} w-full sm:w-auto`;

export function NoteCard({ note }: { note: Note }) {
  const uid = React.useId();
  const [editing, setEditing] = React.useState(false);
  const [confirmingDelete, setConfirmingDelete] = React.useState(false);

  const [approveState, approveAction, approving] = useActionState(approveNoteAction, INITIAL);
  const [unapproveState, unapproveAction, unapproving] = useActionState(unapproveNoteAction, INITIAL);
  const [deleteState, deleteAction, deleting] = useActionState(deleteNoteAction, INITIAL);

  const approved = note.status === 'approved';
  const warnings = lintNote(note);
  const busy = approving || unapproving || deleting;

  if (editing) {
    return (
      <li className="rounded-xl border-2 border-accent/60 bg-white p-4">
        <h3 className="mb-3 text-lg font-semibold text-navy">עריכת תשובה</h3>
        <NoteEditor
          note={{ id: note.id, question: note.question, answer: note.answer, approved }}
          onDone={() => setEditing(false)}
          onCancel={() => setEditing(false)}
        />
      </li>
    );
  }

  return (
    <li className="rounded-xl border border-navy/15 bg-white p-4">
      <p
        className={
          approved
            ? 'inline-block rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-900'
            : 'inline-block rounded-full bg-amber-100 px-3 py-1 text-sm font-semibold text-amber-950'
        }
      >
        {approved ? 'מאושרת, בשימוש בצ׳אט' : 'טיוטה, העוזרת עדיין לא משתמשת בזה'}
      </p>
      {note.question ? (
        <p className="mt-3 font-medium text-navy [overflow-wrap:anywhere]">{note.question}</p>
      ) : (
        <p className="mt-3 text-sm text-ink/70">
          בלי שאלה: משמשת רק כהנחיה למודל ה-AI, לא בתשובות המקומיות.
        </p>
      )}
      <p className="mt-1 whitespace-pre-line text-ink/90 [overflow-wrap:anywhere]">{note.answer}</p>

      {warnings.length > 0 && (
        <div className="mt-3">
          <WarningList warnings={warnings} />
        </div>
      )}

      <div className="mt-4 space-y-3">
        {!approved && (
          <form action={approveAction} className="space-y-3">
            <input type="hidden" name="id" value={note.id} />
            {warnings.length > 0 && (
              <div className="flex items-start gap-3">
                <input
                  id={`${uid}-ack`}
                  type="checkbox"
                  name="acknowledge"
                  required
                  className="mt-1 size-6 shrink-0 accent-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                />
                <label htmlFor={`${uid}-ack`} className="text-sm font-medium text-navy">
                  קראתי את האזהרות, ואני מאשרת את התשובה על אחריותי
                </label>
              </div>
            )}
            <Button type="submit" variant="accent" disabled={busy} className={wide}>
              {approving ? 'מאשרת...' : 'אישור והפעלה בצ׳אט'}
            </Button>
          </form>
        )}

        {approved && (
          <form action={unapproveAction} className="space-y-3">
            <input type="hidden" name="id" value={note.id} />
            <Button type="submit" variant="outline" disabled={busy} className={wide}>
              {unapproving ? 'מחזירה...' : 'החזרה לטיוטה (הפסקת שימוש)'}
            </Button>
          </form>
        )}

        {/* Outside the forms above: they swap places when the status changes, the message must stay. */}
        <Status state={approveState} />
        <Status state={unapproveState} />

        <div className={stackClass}>
          <Button
            type="button"
            variant="outline"
            disabled={busy}
            onClick={() => setEditing(true)}
            className={wide}
          >
            עריכה
          </Button>
          {!confirmingDelete && (
            <Button
              type="button"
              variant="ghost"
              disabled={busy}
              onClick={() => setConfirmingDelete(true)}
              className={`${wide} text-red-800 hover:bg-red-50`}
            >
              מחיקה
            </Button>
          )}
        </div>

        {confirmingDelete && (
          <form
            action={deleteAction}
            role="group"
            aria-label="אישור מחיקה"
            className="space-y-3 rounded-lg border border-red-700/40 bg-red-50 p-3"
          >
            <input type="hidden" name="id" value={note.id} />
            <p className="font-medium text-red-900">למחוק את התשובה הזו? אי אפשר לשחזר אחרי המחיקה.</p>
            <div className={stackClass}>
              <Button
                type="submit"
                disabled={deleting}
                className={`${wide} bg-red-800 text-white hover:bg-red-900`}
              >
                {deleting ? 'מוחקת...' : 'כן, למחוק'}
              </Button>
              <Button
                type="button"
                variant="outline"
                disabled={deleting}
                autoFocus
                onClick={() => setConfirmingDelete(false)}
                className={wide}
              >
                ביטול
              </Button>
            </div>
            <Status state={deleteState} />
          </form>
        )}
      </div>
    </li>
  );
}
