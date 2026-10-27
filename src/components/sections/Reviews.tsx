import { Quote, Star } from 'lucide-react';
import { brand } from '@/lib/brand';
import { cn } from '@/lib/utils';
import { Reveal, Stagger, StaggerItem } from '@/components/motion/Reveal';

function Stars({ rating, onDark }: { rating: number; onDark?: boolean }) {
  return (
    <div className="flex gap-1" role="img" aria-label={`דירוג ${rating} מתוך 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={cn('h-5 w-5', onDark ? 'text-accent-light' : 'text-accent')}
          aria-hidden="true"
          fill={i < rating ? 'currentColor' : 'none'}
        />
      ))}
    </div>
  );
}

export function Reviews() {
  // Never show placeholder reviews: the section appears only with real ones.
  if (brand.testimonials.length === 0) return null;

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
          {brand.testimonials.map((t, i) => {
            const featured = i === 0;
            return (
              <StaggerItem as="li" key={t.name} className="mb-6 break-inside-avoid">
                <figure
                  className={cn(
                    'group relative flex flex-col gap-5 overflow-hidden rounded-[1.75rem] p-8 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-2xl',
                    featured
                      ? 'bg-navy text-cream shadow-xl'
                      : 'border border-navy/10 bg-white shadow-sm hover:border-accent/50',
                  )}
                >
                  <Quote
                    aria-hidden="true"
                    className={cn(
                      'absolute -top-2 end-5 h-20 w-20 rotate-180',
                      featured ? 'text-cream/10' : 'text-accent/10',
                    )}
                    strokeWidth={1.5}
                  />
                  <Stars rating={t.rating} onDark={featured} />
                  <blockquote
                    className={cn(
                      'relative flex-1 text-lg leading-relaxed',
                      featured ? 'text-cream/95' : 'text-ink/85',
                    )}
                  >
                    <p>״{t.text}״</p>
                  </blockquote>
                  <figcaption
                    className={cn(
                      'flex items-center gap-3 border-t pt-5',
                      featured ? 'border-cream/15' : 'border-navy/10',
                    )}
                  >
                    <span
                      aria-hidden="true"
                      className={cn(
                        'flex h-11 w-11 shrink-0 items-center justify-center rounded-full font-heading text-lg font-bold',
                        featured ? 'bg-accent-light text-navy' : 'bg-accent/10 text-accent',
                      )}
                    >
                      {Array.from(t.name)[0]}
                    </span>
                    <span className="flex flex-col leading-snug">
                      <span className={cn('font-semibold', featured ? 'text-cream' : 'text-navy')}>
                        {t.name}
                      </span>
                      {t.role && (
                        <span className={cn('text-sm', featured ? 'text-cream/75' : 'text-ink/75')}>
                          {t.role}
                        </span>
                      )}
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
