'use client';

import * as React from 'react';
import { useActionState, startTransition } from 'react';
import {
  teachAction,
  testAnswerAction,
  updateNoteAction,
  type FormState,
  type TestState,
} from '@/lib/actions/admin';
import { lintNote } from '@/lib/learning/lint';
import { Button } from '@/components/ui/button';
import { INITIAL, Status, WarningList, fieldClass, stackClass, tapClass } from './shared';

interface EditableNote {
  id: string;
  question: string;
  answer: string;
  approved: boolean;
}

interface NoteEditorProps {
  /** Present when editing an existing note; absent for a new draft. */
  note?: EditableNote;
  /** Question to start with (from the unanswered list). */
  prefill?: string;
  /** Called after a successful save of an edit. */
  onDone?: () => void;
  onCancel?: () => void;
}

const TEST_INITIAL: TestState = { ok: false, message: '' };

/** Create a new draft, or edit an existing note, with live safety hints and a dry-run of the chat. */
export function NoteEditor({ note, prefill, onDone, onCancel }: NoteEditorProps) {
  const uid = React.useId();
  const [question, setQuestion] = React.useState(note?.question ?? prefill ?? '');
  const [answer, setAnswer] = React.useState(note?.answer ?? '');
  const [visitor, setVisitor] = React.useState(note?.question ?? prefill ?? '');

  const save = React.useCallback(
    async (prev: FormState, formData: FormData): Promise<FormState> => {
      const result = note ? await updateNoteAction(prev, formData) : await teachAction(prev, formData);
      if (result.ok) {
        if (note) onDone?.();
        else {
          setQuestion('');
          setAnswer('');
        }
      }
      return result;
    },
    [note, onDone],
  );
  const [saveState, saveAction, saving] = useActionState(save, INITIAL);
  const [testState, testAction, testing] = useActionState(testAnswerAction, TEST_INITIAL);

  // Computed during render: a pure function of the two fields.
  const warnings = lintNote({ question, answer });

  const runTest = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    startTransition(() => testAction(data));
  };

  return (
    <div className="space-y-5">
      <form action={saveAction} className="space-y-4">
        {note && <input type="hidden" name="id" value={note.id} />}
        <div>
          <label htmlFor={`${uid}-q`} className="text-sm font-medium text-navy">
            שאלה של לקוח (לא חובה, אבל בלעדיה העוזרת המקומית לא תשתמש בתשובה)
          </label>
          <input
            id={`${uid}-q`}
            name="question"
            maxLength={300}
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className={fieldClass}
            placeholder="למשל: האם אפשר לשלם בתשלומים?"
          />
        </div>
        <div>
          <label htmlFor={`${uid}-a`} className="text-sm font-medium text-navy">
            התשובה או ההנחיה, בדיוק כמו שהיית אומרת
          </label>
          <textarea
            id={`${uid}-a`}
            name="answer"
            required
            minLength={3}
            rows={6}
            maxLength={2000}
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            aria-describedby={`${uid}-count`}
            className={fieldClass}
            placeholder="כתבי כאן את התשובה. אפשר גם הנחיה כללית, כמו 'כשמישהו מזכיר פיטורים, תמיד להזכיר לשמור את מכתב הפיטורים'."
          />
          <p id={`${uid}-count`} className="mt-1 text-xs text-ink/70">
            {answer.length} מתוך 2000 תווים
          </p>
        </div>

        <WarningList warnings={warnings} />

        {note?.approved && (
          <p className="rounded-lg bg-navy/5 px-3 py-2 text-sm text-navy">
            התשובה הזו מאושרת ונמצאת בשימוש. אחרי שמירה היא תחזור להיות טיוטה ותצטרך אישור מחדש.
          </p>
        )}
        <Status state={saveState} />
        <div className={stackClass}>
          <Button type="submit" variant="accent" disabled={saving} className={`${tapClass} w-full sm:w-auto`}>
            {saving ? 'שומרת...' : note ? 'שמירת השינויים' : 'שמירה כטיוטה'}
          </Button>
          {note && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={saving}
              className={`${tapClass} w-full sm:w-auto`}
            >
              ביטול
            </Button>
          )}
        </div>
      </form>

      <form
        onSubmit={runTest}
        aria-labelledby={`${uid}-test`}
        className="space-y-3 rounded-xl border border-navy/15 bg-cream/60 p-4"
      >
        <h3 id={`${uid}-test`} className="text-lg font-semibold text-navy">
          בדיקת הצ׳אט לפני אישור
        </h3>
        <p className="text-sm text-ink/80">
          כתבי שאלה כמו של מבקר, ותראי מה העוזרת תענה עם התשובות המאושרות והטיוטה שלמעלה. לא נשלח כלום למודל ולא נשמר דבר.
        </p>
        <input type="hidden" name="draftId" value={note?.id ?? ''} />
        <input type="hidden" name="question" value={question} />
        <input type="hidden" name="answer" value={answer} />
        <div>
          <label htmlFor={`${uid}-v`} className="text-sm font-medium text-navy">
            שאלה של מבקר
          </label>
          <input
            id={`${uid}-v`}
            name="visitor"
            required
            maxLength={300}
            value={visitor}
            onChange={(e) => setVisitor(e.target.value)}
            className={fieldClass}
          />
        </div>
        <Button type="submit" variant="primary" disabled={testing} className={`${tapClass} w-full sm:w-auto`}>
          {testing ? 'בודקת...' : 'בדיקה'}
        </Button>
        <div aria-live="polite" className="space-y-2">
          {testState.message && !testState.ok && <Status state={testState} />}
          {testState.ok && testState.reply !== undefined && (
            <figure className="rounded-lg border border-navy/15 bg-white p-3">
              <figcaption className="text-xs text-ink/70">{testState.message}</figcaption>
              <blockquote className="mt-2 whitespace-pre-line text-base text-ink [overflow-wrap:anywhere]">
                {testState.reply}
              </blockquote>
              {testState.chips && testState.chips.length > 0 && (
                <p className="mt-2 text-xs text-ink/70">
                  הצעות להמשך שיופיעו למבקר: {testState.chips.join(' · ')}
                </p>
              )}
            </figure>
          )}
        </div>
      </form>
    </div>
  );
}
