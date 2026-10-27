'use client';

import * as React from 'react';
import { useActionState } from 'react';
import { loginAction, teachAction, type FormState } from '@/lib/actions/admin';
import { Button } from '@/components/ui/button';

const INITIAL: FormState = { ok: false, message: '' };

const fieldClass =
  'mt-1.5 w-full rounded-lg border border-navy/25 bg-white px-3 py-2.5 text-base text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent';

function Status({ state }: { state: FormState }) {
  if (!state.message) return null;
  return (
    <p
      role={state.ok ? 'status' : 'alert'}
      className={state.ok ? 'text-sm font-medium text-emerald-800' : 'text-sm font-medium text-red-700'}
    >
      {state.message}
    </p>
  );
}

export function LoginForm() {
  const [state, action, pending] = useActionState(loginAction, INITIAL);
  return (
    <form action={action} className="space-y-4">
      <div>
        <label htmlFor="password" className="text-sm font-medium text-navy">
          סיסמה
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className={fieldClass}
        />
      </div>
      <Status state={state} />
      <Button type="submit" variant="accent" disabled={pending}>
        {pending ? 'מתחבר...' : 'כניסה'}
      </Button>
    </form>
  );
}

export function TeachForm({ prefill }: { prefill?: string }) {
  const [state, action, pending] = useActionState(teachAction, INITIAL);
  const formRef = React.useRef<HTMLFormElement>(null);

  React.useEffect(() => {
    if (state.ok) formRef.current?.reset();
  }, [state]);

  return (
    <form ref={formRef} action={action} className="space-y-4" key={prefill ?? 'blank'}>
      <div>
        <label htmlFor="question" className="text-sm font-medium text-navy">
          שאלה של לקוח (לא חובה)
        </label>
        <input
          id="question"
          name="question"
          maxLength={300}
          defaultValue={prefill}
          className={fieldClass}
          placeholder="למשל: האם אפשר לשלם בתשלומים?"
        />
      </div>
      <div>
        <label htmlFor="answer" className="text-sm font-medium text-navy">
          התשובה או ההנחיה, בדיוק כמו שהיית אומרת
        </label>
        <textarea
          id="answer"
          name="answer"
          required
          rows={5}
          maxLength={2000}
          className={fieldClass}
          placeholder="כתבי כאן את התשובה. אפשר גם הנחיה כללית, כמו 'כשמישהו מזכיר פיטורים, תמיד להזכיר לשמור את מכתב הפיטורים'."
        />
      </div>
      <Status state={state} />
      <Button type="submit" variant="accent" disabled={pending}>
        {pending ? 'שומר...' : 'לימוד העוזרת'}
      </Button>
    </form>
  );
}
