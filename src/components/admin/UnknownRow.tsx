'use client';

import { useActionState } from 'react';
import Link from 'next/link';
import { dismissUnknownAction } from '@/lib/actions/admin';
import { Button } from '@/components/ui/button';
import { INITIAL, Status, stackClass, tapClass } from './shared';

interface UnknownRowProps {
  id: string;
  question: string;
  count: number;
}

export function UnknownRow({ id, question, count }: UnknownRowProps) {
  const [state, action, pending] = useActionState(dismissUnknownAction, INITIAL);
  return (
    <li className="space-y-3 rounded-xl border border-navy/15 bg-white p-4">
      <div>
        <p className="font-medium text-navy [overflow-wrap:anywhere]">{question}</p>
        <p className="text-xs text-ink/70">נשאלה {count} פעמים</p>
      </div>
      <div className={stackClass}>
        <Button asChild variant="accent" className={`${tapClass} w-full sm:w-auto`}>
          <Link href={`/admin?q=${encodeURIComponent(question)}`}>ללמד</Link>
        </Button>
        <form action={action} className="w-full sm:w-auto">
          <input type="hidden" name="id" value={id} />
          <Button type="submit" variant="outline" disabled={pending} className={`${tapClass} w-full sm:w-auto`}>
            {pending ? 'מסירה...' : 'התעלם'}
          </Button>
        </form>
      </div>
      <Status state={state} />
    </li>
  );
}
