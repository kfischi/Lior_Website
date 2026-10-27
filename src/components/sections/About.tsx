import Image from 'next/image';
import { Check, Scale } from 'lucide-react';
import { brand } from '@/lib/brand';
import { Reveal } from '@/components/motion/Reveal';

export function About() {
  return (
    <section id="about" aria-labelledby="about-title" className="section overflow-hidden bg-cream">
      <div className="shell">
        <div className="grid items-center gap-16 lg:grid-cols-[1fr_1.15fr] lg:gap-20">
          {/* Portrait with an offset frame */}
          <Reveal>
            <div className="relative mx-auto w-full max-w-md">
              <div
                aria-hidden="true"
                className="absolute -bottom-5 -start-5 h-full w-full rounded-2xl border border-accent/50"
              />
              <div className="relative aspect-[4/5] overflow-hidden rounded-2xl shadow-2xl">
                {brand.about.portraitId ? (
                  <Image
                    src={brand.about.portraitId}
                    alt={`תמונה של ${brand.attorneyName}`}
                    fill
                    sizes="(max-width: 1024px) 100vw, 28rem"
                    className="object-cover object-top"
                  />
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center gap-5 bg-navy p-8 text-center text-cream">
                    <Scale className="h-16 w-16 text-accent-light" aria-hidden="true" />
                  </div>
                )}
                <div
                  aria-hidden="true"
                  className="absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-t from-navy/85 to-transparent"
                />
                <div className="absolute inset-x-0 bottom-0 p-6 text-cream">
                  <p className="font-heading text-2xl font-semibold">{brand.attorneyName}</p>
                  <p className="mt-1 text-sm text-cream/80">עורכת דין · {brand.address.city}</p>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Text */}
          <Reveal delay={0.1}>
            <p className="eyebrow mb-5">קצת עלינו</p>
            <h2 id="about-title" className="text-4xl text-navy md:text-5xl">
              {brand.about.heading}
            </h2>

            <blockquote className="relative mt-10">
              <span
                aria-hidden="true"
                className="absolute -top-6 -start-1 select-none font-heading text-9xl leading-none text-accent/20"
              >
                ״
              </span>
              <p className="relative font-heading text-2xl leading-snug text-navy md:text-3xl">
                {brand.about.quote}
              </p>
            </blockquote>

            <p className="mt-8 text-lg leading-relaxed text-ink/75">{brand.about.body}</p>
            {brand.about.more.map((paragraph) => (
              <p key={paragraph} className="mt-4 text-lg leading-relaxed text-ink/75">
                {paragraph}
              </p>
            ))}

            <ul className="mt-8 flex flex-wrap gap-3">
              {brand.about.credentials.map((c) => (
                <li
                  key={c}
                  className="flex items-center gap-2 rounded-full border border-navy/15 bg-background px-4 py-2 text-sm text-ink/85"
                >
                  <Check className="h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
                  {c}
                </li>
              ))}
            </ul>

            {brand.about.certificates.length > 0 && (
              <div className="mt-10 border-t border-navy/10 pt-8">
                <h3 className="mb-4 font-heading text-xl font-semibold text-navy">תעודות והשתלמויות</h3>
                <ul className="flex flex-wrap gap-5">
                  {brand.about.certificates.map((c) => (
                    <li key={c.image}>
                      <a
                        href={c.image}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${c.title}, ${c.issuer}, ${c.date}. הצגת התעודה בגודל מלא (נפתח בחלון חדש)`}
                        className="group flex flex-col items-start gap-4 rounded-xl border border-navy/10 bg-white p-4 transition-all hover:-translate-y-0.5 hover:border-accent hover:shadow-lg sm:flex-row sm:items-center"
                      >
                        <Image
                          src={c.image}
                          alt=""
                          width={c.width}
                          height={c.height}
                          sizes="(min-width: 640px) 224px, 256px"
                          className="h-auto w-full max-w-64 rounded-md shadow-md sm:w-56"
                        />
                        <span className="flex max-w-[14rem] flex-col leading-snug">
                          <span className="font-semibold text-navy">{c.title}</span>
                          <span className="mt-1 text-sm text-ink/75">
                            {c.issuer} · {c.date}
                          </span>
                          <span className="mt-2 text-sm font-medium text-accent group-hover:underline">
                            לצפייה בתעודה
                          </span>
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {brand.about.gallery.length > 0 && (
              <ul className="mt-10 grid grid-cols-2 gap-4 border-t border-navy/10 pt-8">
                {brand.about.gallery.map((photo) => (
                  <li key={photo.src}>
                    <figure>
                      <Image
                        src={photo.src}
                        alt={photo.alt}
                        width={photo.width}
                        height={photo.height}
                        sizes="(min-width: 1024px) 18rem, 45vw"
                        className="aspect-[3/4] w-full rounded-xl object-cover object-top shadow-md"
                      />
                      {photo.caption && (
                        <figcaption className="mt-2 text-sm text-ink/75">{photo.caption}</figcaption>
                      )}
                    </figure>
                  </li>
                ))}
              </ul>
            )}

            {brand.trustStats.length > 0 && (
              <dl className="mt-10 grid grid-cols-2 gap-6 border-t border-navy/10 pt-8 sm:grid-cols-4">
                {brand.trustStats.map((stat) => (
                  <div key={stat.label}>
                    <dt className="sr-only">{stat.label}</dt>
                    <dd>
                      <span className="block font-heading text-4xl font-semibold text-navy">
                        {stat.value}
                      </span>
                      <span className="mt-1 block text-xs text-ink/75">{stat.label}</span>
                    </dd>
                  </div>
                ))}
              </dl>
            )}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
