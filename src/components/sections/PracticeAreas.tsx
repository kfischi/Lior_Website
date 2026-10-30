import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { brand } from '@/lib/brand';
import { Reveal, Stagger, StaggerItem } from '@/components/motion/Reveal';
import { Icon } from './Icon';

export function PracticeAreas() {
  return (
    <section
      id="practice"
      aria-labelledby="practice-title"
      className="section grain relative overflow-hidden bg-navy text-cream"
    >
      {/* The firm's statue, very large and very faint, as a watermark */}
      <Image
        src={brand.logo.iconLight}
        alt=""
        width={brand.logo.iconSize.width}
        height={brand.logo.iconSize.height}
        aria-hidden="true"
        className="pointer-events-none absolute -start-16 top-1/2 h-[46rem] w-auto -translate-y-1/2 opacity-[0.06]"
      />

      <div className="shell relative z-10">
        <Reveal className="mx-auto mb-16 max-w-2xl text-center">
          <p className="eyebrow mb-4 text-accent-light">מה אנחנו עושים</p>
          <h2 id="practice-title" className="text-4xl text-cream md:text-5xl">
            תחומי עיסוק
          </h2>
        </Reveal>

        <Stagger className="grid gap-6 lg:grid-cols-3">
          {brand.practiceAreas.map((area, i) => (
            <StaggerItem
              key={area.slug}
              className="group relative flex flex-col rounded-2xl border border-cream/10 bg-cream/[0.04] p-8 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1.5 hover:border-accent-light/50 hover:bg-cream/[0.07] md:p-10"
            >
              <div className="flex items-start justify-between">
                <span
                  aria-hidden="true"
                  className="font-heading text-7xl leading-none text-accent-light/25 transition-colors duration-500 group-hover:text-accent-light/50"
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-cream/5 text-accent-light transition-colors duration-500 group-hover:bg-accent-light group-hover:text-navy">
                  <Icon name={area.icon} className="h-6 w-6" />
                </span>
              </div>

              <h3 className="mt-10 font-heading text-3xl font-semibold text-cream">{area.title}</h3>
              <p className="mt-4 flex-1 leading-relaxed text-cream/70">{area.description}</p>

              <Link
                href={`/practice-areas/${area.slug}`}
                className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-accent-light after:absolute after:inset-0"
              >
                עוד על {area.title}
                <ArrowLeft
                  className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1.5"
                  aria-hidden="true"
                />
              </Link>
            </StaggerItem>
          ))}
        </Stagger>

        {brand.about.additionalAreas.length > 0 && (
          <Reveal className="mt-14 border-t border-cream/15 pt-10">
            <h3 className="font-heading text-2xl font-semibold text-cream">ובתחומים נוספים</h3>
            <ul className="mt-6 grid gap-5 md:grid-cols-2">
              {brand.about.additionalAreas.map((a) => (
                <li key={a.title} className="rounded-xl border border-cream/10 bg-cream/[0.04] p-6">
                  <h4 className="font-semibold text-accent-light">{a.title}</h4>
                  <p className="mt-2 leading-relaxed text-cream/80">{a.text}</p>
                </li>
              ))}
            </ul>
          </Reveal>
        )}
      </div>
    </section>
  );
}
