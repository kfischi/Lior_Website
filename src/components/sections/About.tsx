import Image from 'next/image';
import { Check } from 'lucide-react';
import { brand } from '@/lib/brand';
import { Reveal } from '@/components/motion/Reveal';

export function About() {
  return (
    <section id="about" aria-labelledby="about-title" className="section bg-cream">
      <div className="shell">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <div className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-xl shadow-xl">
              <Image
                src={brand.about.portraitId}
                alt={`תמונה של ${brand.attorneyName}`}
                fill
                sizes="(max-width: 1024px) 100vw, 28rem"
                className="object-cover"
              />
              <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-navy/10" />
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <p className="eyebrow mb-3">קצת עלינו</p>
            <h2 id="about-title" className="text-3xl text-navy md:text-4xl">
              {brand.about.heading}
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-ink/75">{brand.about.body}</p>

            <ul className="mt-8 space-y-3">
              {brand.about.credentials.map((c) => (
                <li key={c} className="flex items-start gap-3">
                  <Check className="mt-1 h-5 w-5 shrink-0 text-bronze" aria-hidden="true" />
                  <span className="text-ink/85">{c}</span>
                </li>
              ))}
            </ul>

            <dl className="mt-10 grid grid-cols-2 gap-6 border-t border-navy/10 pt-8 sm:grid-cols-4">
              {brand.trustStats.map((stat) => (
                <div key={stat.label}>
                  <dt className="sr-only">{stat.label}</dt>
                  <dd>
                    <span className="block font-heading text-3xl font-bold text-navy">
                      {stat.value}
                    </span>
                    <span className="mt-1 block text-xs text-ink/55">{stat.label}</span>
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
