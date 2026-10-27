'use client';

import Link from 'next/link';
import { brand, telHref } from '@/lib/brand';
import { Button } from '@/components/ui/button';

/** Last-resort boundary: the visitor can retry or call, and is never left on a blank page. */
export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main id="main" className="flex min-h-svh items-center bg-navy text-cream">
      <div className="shell max-w-xl text-center">
        <h1 className="text-3xl text-cream md:text-4xl">משהו השתבש</h1>
        <p className="mt-4 text-lg leading-relaxed text-cream/80">
          מצטערים, אירעה תקלה בטעינת העמוד. אפשר לנסות שוב, או להתקשר אלינו:{' '}
          <a href={telHref} className="font-semibold underline">
            {brand.phone}
          </a>
          .
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Button size="lg" variant="accentOnDark" onClick={reset}>
            ניסיון נוסף
          </Button>
          <Button asChild size="lg" variant="onDark">
            <Link href="/">לעמוד הבית</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
