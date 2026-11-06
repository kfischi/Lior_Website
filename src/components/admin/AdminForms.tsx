'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { loginAction, testChatAction } from '@/lib/actions/admin';
import { Button } from '@/components/ui/button';
import { INITIAL, Status, fieldClass, tapClass } from './shared';

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
      <Button type="submit" variant="accent" disabled={pending} className={`${tapClass} w-full sm:w-auto`}>
        {pending ? 'מתחבר...' : 'כניסה'}
      </Button>
    </form>
  );
}

/** Submit button for the logout form (must render inside that form to read its status). */
export function LogoutButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" variant="outline" disabled={pending} className={`${tapClass} w-full sm:w-auto`}>
      {pending ? 'יוצאת...' : 'יציאה'}
    </Button>
  );
}

export function TestChatForm() {
  const [state, action, pending] = useActionState(testChatAction, INITIAL);
  return (
    <form action={action} className="space-y-3">
      <Button type="submit" variant="outline" disabled={pending} className={`${tapClass} w-full sm:w-auto`}>
        {pending ? 'בודקת...' : 'בדיקת חיבור ומהירות'}
      </Button>
      <Status state={state} />
    </form>
  );
}
