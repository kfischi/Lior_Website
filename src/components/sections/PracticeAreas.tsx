import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { brand } from '@/lib/brand';
import { Reveal, Stagger, StaggerItem } from '@/components/motion/Reveal';
import { Icon } from './Icon';

export function PracticeAreas() {
  return (
    <section id="practice" aria-labelledby="practice-title" className="section bg-navy text-cream">
      <div className="shell">
        <Reveal className="mx-auto mb-14 max-w-2xl text-center">
          <p className="eyebrow mb-3 text-accent-light">מה אנחנו עושים</p>
          <h2 id="practice-title" className="text-3xl text-cream md:text-4xl">
            תחומי עיסוק
          </h2>
        </Reveal>

        <Stagger className="grid gap-px overflow-hidden rounded-xl bg-cream/10 sm:grid-cols-2 lg:grid-cols-3">
          {brand.practiceAreas.map((area) => (
            <StaggerItem
              key={area.slug}
              className="group relative bg-navy p-8 transition-colors duration-300 hover:bg-navy/60"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-cream/5 text-accent-light transition-colors duration-300 group-hover:bg-accent-light group-hover:text-navy">
                <Icon name={area.icon} className="h-6 w-6" />
              </div>
              <h3 className="mt-5 font-heading text-xl font-semibold text-cream">{area.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-cream/70">{area.description}</p>
              <Link
                href={`/practice-areas/${area.slug}`}
                className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-accent-light after:absolute after:inset-0"
              >
                עוד על {area.title}
                <ArrowLeft
                  className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1"
                  aria-hidden="true"
                />
              </Link>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
