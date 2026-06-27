import { brand } from '@/lib/brand';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Icon } from './Icon';

export function PracticeAreas() {
  return (
    <section
      id="practice-areas"
      aria-labelledby="practice-title"
      className="bg-secondary/40"
    >
      <div className="container-section">
        <header className="mx-auto mb-12 max-w-2xl text-center">
          <p className="font-medium text-accent">מה אנחנו עושים</p>
          <h2 id="practice-title" className="mt-2 text-3xl font-bold text-navy md:text-4xl">
            תחומי עיסוק
          </h2>
        </header>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {brand.practiceAreas.map((area) => (
            <Card
              key={area.slug}
              className="group transition-all hover:-translate-y-1 hover:shadow-md"
            >
              <CardHeader>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-navy/5 text-navy transition-colors group-hover:bg-accent group-hover:text-accent-foreground">
                  <Icon name={area.icon} className="h-6 w-6" />
                </div>
                <CardTitle className="mt-4 text-navy">{area.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {area.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
