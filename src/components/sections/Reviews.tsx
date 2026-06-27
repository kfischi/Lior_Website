import { brand } from '@/lib/brand';
import { Card, CardContent } from '@/components/ui/card';
import { Star } from 'lucide-react';

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`דירוג ${rating} מתוך 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className="h-4 w-4"
          aria-hidden="true"
          fill={i < rating ? 'currentColor' : 'none'}
          stroke="currentColor"
          color="var(--brand-bronze)"
        />
      ))}
    </div>
  );
}

export function Reviews() {
  return (
    <section id="reviews" aria-labelledby="reviews-title" className="bg-secondary/40">
      <div className="container-section">
        <header className="mx-auto mb-12 max-w-2xl text-center">
          <p className="font-medium text-accent">לקוחות מספרים</p>
          <h2 id="reviews-title" className="mt-2 text-3xl font-bold text-navy md:text-4xl">
            המלצות
          </h2>
        </header>

        <ul className="grid gap-6 md:grid-cols-3">
          {brand.testimonials.map((t) => (
            <li key={t.name}>
              <Card className="h-full">
                <CardContent className="flex h-full flex-col gap-4 p-6">
                  <Stars rating={t.rating} />
                  <blockquote className="flex-1 text-ink/80">
                    <p className="leading-relaxed">״{t.text}״</p>
                  </blockquote>
                  <footer className="border-t border-border pt-4">
                    <cite className="not-italic">
                      <span className="block font-semibold text-navy">{t.name}</span>
                      {t.role && (
                        <span className="text-sm text-muted-foreground">{t.role}</span>
                      )}
                    </cite>
                  </footer>
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
