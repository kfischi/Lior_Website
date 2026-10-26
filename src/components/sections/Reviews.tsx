import { Star } from 'lucide-react';
import { brand } from '@/lib/brand';
import { Reveal, Stagger, StaggerItem } from '@/components/motion/Reveal';

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`דירוג ${rating} מתוך 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className="h-4 w-4 text-accent"
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
    <section id="reviews" aria-labelledby="reviews-title" className="section bg-cream">
      <div className="shell">
        <Reveal className="mx-auto mb-14 max-w-2xl text-center">
          <p className="eyebrow mb-3">לקוחות מספרים</p>
          <h2 id="reviews-title" className="text-4xl text-navy md:text-5xl">
            המלצות
          </h2>
          {brand.testimonialsSource && (
            <p className="mt-3 text-sm text-ink/60">{brand.testimonialsSource}</p>
          )}
        </Reveal>

        <Stagger as="ul" className="flex flex-wrap justify-center gap-6">
          {brand.testimonials.map((t) => (
            <StaggerItem
              as="li"
              key={t.name}
              className="w-full md:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)]"
            >
              <figure className="flex h-full flex-col gap-4 rounded-xl border border-navy/10 bg-background p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                <Stars rating={t.rating} />
                <blockquote className="flex-1 leading-relaxed text-ink/80">
                  <p>״{t.text}״</p>
                </blockquote>
                <figcaption className="border-t border-navy/10 pt-4">
                  <span className="block font-semibold text-navy">{t.name}</span>
                  {t.role && <span className="text-sm text-ink/55">{t.role}</span>}
                </figcaption>
              </figure>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
