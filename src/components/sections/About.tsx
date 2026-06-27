import Image from 'next/image';
import { brand } from '@/lib/brand';
import { Check } from 'lucide-react';

export function About() {
  return (
    <section id="about" aria-labelledby="about-title" className="bg-cream">
      <div className="container-section">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Portrait */}
          <div className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-xl shadow-lg">
            <Image
              src={brand.about.portraitId}
              alt={`תמונה של ${brand.attorneyName}`}
              fill
              sizes="(max-width: 1024px) 100vw, 28rem"
              className="object-cover"
            />
          </div>

          {/* Text */}
          <div>
            <p className="font-medium text-accent">קצת עלינו</p>
            <h2 id="about-title" className="mt-2 text-3xl font-bold text-navy md:text-4xl">
              {brand.about.heading}
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-ink/80">
              {brand.about.body}
            </p>

            <ul className="mt-8 space-y-3">
              {brand.about.credentials.map((c) => (
                <li key={c} className="flex items-start gap-3">
                  <Check className="mt-0.5 h-5 w-5 shrink-0 text-accent" aria-hidden="true" />
                  <span className="text-ink/90">{c}</span>
                </li>
              ))}
            </ul>

            {/* Trust strip (E-E-A-T) */}
            <dl className="mt-10 grid grid-cols-2 gap-6 border-t border-border pt-8 sm:grid-cols-4">
              {brand.trustStats.map((stat) => (
                <div key={stat.label}>
                  <dt className="sr-only">{stat.label}</dt>
                  <dd>
                    <span className="block font-heading text-3xl font-bold text-navy">
                      {stat.value}
                    </span>
                    <span className="mt-1 block text-xs text-muted-foreground">
                      {stat.label}
                    </span>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
