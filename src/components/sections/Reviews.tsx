import Image from 'next/image';
import { Quote, Star } from 'lucide-react';
import { brand, type TestimonialLetter } from '@/lib/brand';
import { cn } from '@/lib/utils';
import { Reveal, Stagger, StaggerItem } from '@/components/motion/Reveal';

const dateFormat = new Intl.DateTimeFormat('he-IL', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
});

/** Newest first; ISO dates compare correctly as strings. */
const testimonials = [...brand.testimonials].sort((a, b) => b.date.localeCompare(a.date));

/** Five stars, each filled by the share of the rating that falls on it (4.6 → last star 60%). */
function Stars({ rating, onDark }: { rating: number; onDark?: boolean }) {
  const tone = onDark ? 'text-accent-light' : 'text-accent';
  return (
    <div className="flex items-center gap-2" role="img" aria-label={`דירוג ${rating} מתוך 5`}>
      <div className="flex gap-1" aria-hidden="true">
        {Array.from({ length: 5 }).map((_, i) => {
          const fill = Math.min(1, Math.max(0, rating - i));
          return (
            <span key={i} className="relative inline-block h-5 w-5">
              <Star className={cn('absolute inset-0 h-5 w-5 opacity-40', tone)} />
              <span
                className="absolute inset-0 overflow-hidden"
                style={{ width: `${fill * 100}%` }}
              >
                <Star className={cn('h-5 w-5', tone)} fill="currentColor" />
              </span>
            </span>
          );
        })}
      </div>
      {!Number.isInteger(rating) && (
        <span aria-hidden="true" className={cn('text-sm font-medium', onDark ? 'text-cream/80' : 'text-ink/75')}>
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
}

type ReviewItem =
  | { kind: 'text'; key: string; date: string; name: string; rating: number; text: string }
  | { kind: 'letter'; key: string; date: string; name: string; letter: TestimonialLetter };

/** Reviews and scanned letters in one list, newest first. */
const items: ReviewItem[] = [
  ...testimonials.map((t) => ({ kind: 'text' as const, key: `${t.date}-${t.name}`, ...t })),
  ...brand.testimonialLetters.map((letter) => ({
    kind: 'letter' as const,
    key: `${letter.date}-${letter.name}`,
    date: letter.date,
    name: letter.name,
    letter,
  })),
].sort((a, b) => b.date.localeCompare(a.date));

export function Reviews() {
  // Never show placeholder reviews: the section appears only with real ones.
  if (items.length === 0) return null;

  return (
    <section
      id="reviews"
      aria-labelledby="reviews-title"
      className="section relative overflow-hidden bg-cream"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-32 -end-32 h-96 w-96 rounded-full bg-accent/10 blur-3xl"
      />
      <div className="shell relative">
        <Reveal className="mx-auto mb-14 max-w-2xl text-center">
          <p className="eyebrow mb-3">מה אומרים עלינו</p>
          <h2 id="reviews-title" className="display-xl text-navy">
            המלצות
          </h2>
          {brand.testimonialsSource && (
            <p className="mt-4 text-sm text-ink/75">{brand.testimonialsSource}</p>
          )}
        </Reveal>

        <Stagger as="ul" className="columns-1 gap-6 md:columns-2 lg:columns-3">
          {items.map((item, i) => {
            const featured = i === 0 && item.kind === 'text';
            return (
              <StaggerItem as="li" key={item.key} className="mb-6 break-inside-avoid">
                <figure
                  className={cn(
                    'group relative flex flex-col gap-5 overflow-hidden rounded-[1.75rem] transition-all duration-500 hover:-translate-y-1.5 hover:shadow-2xl',
                    item.kind === 'letter' ? 'p-5' : 'p-8',
                    featured
                      ? 'bg-navy text-cream shadow-xl'
                      : 'border border-navy/10 bg-white shadow-sm hover:border-accent/50',
                  )}
                >
                  {item.kind === 'text' && (
                    <Quote
                      aria-hidden="true"
                      className={cn(
                        'absolute -top-2 end-5 h-20 w-20 rotate-180',
                        featured ? 'text-cream/10' : 'text-accent/10',
                      )}
                      strokeWidth={1.5}
                    />
                  )}
                  {item.kind === 'text' ? (
                    <>
                      <Stars rating={item.rating} onDark={featured} />
                      <blockquote
                        className={cn(
                          'relative flex-1 text-lg leading-relaxed',
                          featured ? 'text-cream/95' : 'text-ink/85',
                        )}
                      >
                        <p>״{item.text}״</p>
                      </blockquote>
                    </>
                  ) : (
                    <div className="relative flex flex-col gap-3">
                      <p className="flex items-center justify-between gap-3 text-sm">
                        <span className="font-medium text-accent">מכתב תודה מלקוחה</span>
                        <span className="text-ink/70">לחצו להגדלה</span>
                      </p>
                      <a
                        href={item.letter.image}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="הצגת המכתב בגודל מלא (נפתח בחלון חדש)"
                        className="block overflow-hidden rounded-xl bg-cream ring-1 ring-navy/10 transition-shadow hover:shadow-lg"
                      >
                        <Image
                          src={item.letter.image}
                          alt={item.letter.alt}
                          width={item.letter.width}
                          height={item.letter.height}
                          sizes="(min-width: 1024px) 320px, (min-width: 768px) 45vw, 90vw"
                          className="h-auto w-full mix-blend-multiply"
                        />
                      </a>
                    </div>
                  )}
                  <figcaption
                    className={cn(
                      'flex items-center gap-3 border-t pt-5',
                      featured ? 'border-cream/15' : 'border-navy/10',
                    )}
                  >
                    <span
                      aria-hidden="true"
                      className={cn(
                        'flex h-11 w-11 shrink-0 items-center justify-center rounded-full font-heading text-lg font-semibold',
                        featured ? 'bg-accent-light text-navy' : 'bg-accent/10 text-accent',
                      )}
                    >
                      {Array.from(item.name)[0]}
                    </span>
                    <span className="flex flex-col leading-snug">
                      <span className={cn('font-semibold', featured ? 'text-cream' : 'text-navy')}>
                        {item.name}
                      </span>
                      <time
                        dateTime={item.date}
                        className={cn('text-sm', featured ? 'text-cream/75' : 'text-ink/75')}
                      >
                        {dateFormat.format(new Date(item.date))}
                      </time>
                    </span>
                  </figcaption>
                </figure>
              </StaggerItem>
            );
          })}
        </Stagger>
      </div>
    </section>
  );
}
