import Link from 'next/link';
import { Mic } from 'lucide-react';
import { getBrand } from '@/lib/sanity/content';
import { Button } from '@/components/ui/button';

/** A slim strip under the opening video: the door to /lectures, where a talk is booked through the chat. */
export async function LecturesBanner() {
  const { lectures } = await getBrand();
  return (
    <section aria-label={lectures.eyebrow} className="border-b border-navy/10 bg-cream">
      <div className="shell flex flex-col items-center justify-between gap-4 py-5 text-center sm:flex-row sm:text-start">
        <p className="flex items-center gap-3 text-lg font-medium text-navy">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-navy text-accent-light">
            <Mic className="h-5 w-5" aria-hidden="true" />
          </span>
          {lectures.bannerText}
        </p>
        <Button asChild size="lg" variant="accent">
          <Link href="/lectures">{lectures.bannerCta}</Link>
        </Button>
      </div>
    </section>
  );
}
