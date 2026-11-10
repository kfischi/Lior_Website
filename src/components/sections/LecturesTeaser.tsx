import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, Fingerprint, Gavel, MessagesSquare, ShieldAlert, type LucideIcon } from 'lucide-react';
import { getBrand } from '@/lib/sanity/content';
import { Reveal } from '@/components/motion/Reveal';
import { Button } from '@/components/ui/button';
import { OpenChatButton } from '@/components/ai/OpenChatButton';

/** One icon per talk, in the order of the menu on /lectures. Presentation only. */
const ICONS: LucideIcon[] = [Gavel, ShieldAlert, Fingerprint];

/** How many talks are named on the home page; the rest are on /lectures. */
const SHOWN = 4;

/** The home page's door to /lectures: a photo from the stage, a few of the talks, and the ways to book. */
export async function LecturesTeaser() {
  const { lectures } = await getBrand();
  const shown = lectures.items.slice(0, SHOWN);
  const more = lectures.items.length - shown.length;

  return (
    <section id="lectures" aria-labelledby="lectures-home-title" className="section relative isolate overflow-hidden bg-navy text-cream">
      <div className="shell grid items-center gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <Reveal>
          <figure className="mx-auto w-full max-w-sm">
            <div className="relative">
              <div
                aria-hidden="true"
                className="absolute -bottom-4 -start-4 h-full w-full rounded-2xl border border-accent-light/40"
              />
              <div className="relative aspect-[3/4] overflow-hidden rounded-2xl shadow-2xl">
                <Image
                  src={lectures.photo.src}
                  alt={lectures.photo.alt}
                  fill
                  sizes="(min-width: 1024px) 24rem, 80vw"
                  className="object-cover object-[50%_35%]"
                />
              </div>
            </div>
            <figcaption className="mt-6 text-sm text-cream/75">{lectures.photo.caption}</figcaption>
          </figure>
        </Reveal>

        <Reveal delay={0.1}>
          <p className="eyebrow mb-4 text-accent-light">{lectures.eyebrow}</p>
          <h2 id="lectures-home-title" className="text-balance text-3xl text-cream md:text-5xl">
            {lectures.title}
          </h2>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-cream/85">{lectures.quote}</p>

          <ul className="mt-8 divide-y divide-cream/15 border-y border-cream/15">
            {shown.map((l, i) => {
              const Icon = ICONS[i % ICONS.length];
              return (
                <li key={l.title} className="flex items-start gap-4 py-4">
                  <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-cream/10 text-accent-light">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <span className="leading-snug text-cream">{l.title}</span>
                </li>
              );
            })}
          </ul>
          {more > 0 && (
            <p className="mt-3 text-sm text-cream/75">
              ועוד {more} הרצאות בתפריט המלא.
            </p>
          )}

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button asChild size="lg" variant="accentOnDark">
              <Link href="/lectures#invite">להזמנת הרצאה</Link>
            </Button>
            <Button asChild size="lg" variant="onDark">
              <Link href="/lectures#menu">
                לתפריט ההרצאות
                <ChevronLeft className="h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
            <OpenChatButton intake={false} size="lg" variant="onDark">
              <MessagesSquare className="h-5 w-5" aria-hidden="true" />
              לשאול את העוזרת
            </OpenChatButton>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
