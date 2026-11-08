import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, Check, ExternalLink } from 'lucide-react';
import { getSiteContent } from '@/lib/sanity/content';
import { attorneyJsonLd, breadcrumbJsonLd, buildMetadata } from '@/lib/seo';
import { siteUrl } from '@/lib/utils';
import { Header } from '@/components/sections/Header';
import { Footer } from '@/components/sections/Footer';
import { Reveal } from '@/components/motion/Reveal';
import { CallbackForm } from '@/components/sections/CallbackForm';

export async function generateMetadata(): Promise<Metadata> {
  const { brand } = await getSiteContent();
  return buildMetadata({
    brand,
    absoluteTitle: `${brand.attorneyName} | בוגרת הפרקליטות הפלילית`,
    description:
      'עו״ד ליאור-קלואי ארז: בוגרת הפרקליטות הפלילית בתל אביב ותובעת לשעבר במשרד הכלכלה. ליווי בהליכים פליליים, נזיקין וצוואות, ייעוץ בזום בכל הארץ.',
    path: '/about',
  });
}

function JsonLd({ data }: { data: unknown }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}

export default async function AboutPage() {
  const { brand, press } = await getSiteContent();
  const years = new Date().getFullYear() - brand.about.practisingSince;
  const base = siteUrl();

  return (
    <>
      <JsonLd data={attorneyJsonLd(brand)} />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'ProfilePage',
          url: `${base}/about`,
          name: brand.attorneyName,
          inLanguage: 'he-IL',
          mainEntity: { '@id': `${base}/#attorney` },
        }}
      />
      <JsonLd data={breadcrumbJsonLd([{ name: 'ראשי', path: '/' }, { name: brand.attorneyName, path: '/about' }])} />

      <Header />
      <main id="main">
        <section aria-labelledby="about-title" className="bg-navy pb-16 pt-36 text-cream md:pb-24">
          <div className="shell grid items-center gap-12 lg:grid-cols-[1.2fr_0.8fr]">
            <Reveal>
              <p className="eyebrow mb-4 text-accent-light">עורכת דין</p>
              <h1 id="about-title" className="text-4xl font-semibold leading-tight text-cream md:text-6xl">
                {brand.attorneyName}
              </h1>
              <p className="mt-6 max-w-2xl text-xl leading-relaxed text-cream/90">
                בוגרת הפרקליטות הפלילית בתל אביב ותובעת לשעבר במשרד הכלכלה. היום היא מלווה אנשים בהליכים פליליים,
                בנזיקין ובענייני צוואות, בהקשבה, בדיסקרטיות ובהסבר ברור.
              </p>
              <dl className="mt-8 flex flex-wrap gap-x-10 gap-y-4">
                <div>
                  <dt className="text-sm text-cream/75">שנות ניסיון</dt>
                  <dd className="font-heading text-4xl font-semibold text-accent-light">{years}</dd>
                </div>
                <div>
                  <dt className="text-sm text-cream/75">ייעוץ</dt>
                  <dd className="mt-1 text-lg font-medium text-cream">בזום בכל הארץ</dd>
                </div>
              </dl>
            </Reveal>
            {brand.about.portraitId && (
              <Reveal delay={0.1}>
                <div className="relative mx-auto aspect-[4/5] w-full max-w-sm overflow-hidden rounded-2xl shadow-2xl">
                  <Image
                    src={brand.about.portraitId}
                    alt={`תמונה של ${brand.attorneyName}`}
                    fill
                    priority
                    sizes="(max-width: 1024px) 80vw, 24rem"
                    className="object-cover object-top"
                  />
                </div>
              </Reveal>
            )}
          </div>
        </section>

        <article className="section bg-cream">
          <div className="shell max-w-3xl space-y-14">
            <section aria-labelledby="bg-title">
              <h2 id="bg-title" className="text-2xl text-navy md:text-3xl">הרקע המקצועי</h2>
              <ul className="mt-6 space-y-3">
                {brand.about.credentials.map((c) => (
                  <li key={c} className="flex items-start gap-3 text-lg text-ink/85">
                    <Check className="mt-1.5 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
                    {c}
                  </li>
                ))}
              </ul>
            </section>

            <section aria-labelledby="how-title">
              <h2 id="how-title" className="text-2xl text-navy md:text-3xl">איך זה מגיע אליכם</h2>
              <div className="mt-6 space-y-4 text-lg leading-relaxed text-ink/85">
                <p>{brand.about.body}</p>
                {brand.about.more.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
              <blockquote className="mt-8 border-s-4 border-accent ps-5 font-heading text-2xl leading-snug text-navy">
                {brand.about.quote}
              </blockquote>
            </section>

            <section aria-labelledby="areas-title">
              <h2 id="areas-title" className="text-2xl text-navy md:text-3xl">תחומי עיסוק</h2>
              <ul className="mt-6 grid gap-4">
                {brand.practiceAreas.map((a) => (
                  <li key={a.slug}>
                    <Link
                      href={`/practice-areas/${a.slug}`}
                      className="flex items-center justify-between gap-4 rounded-xl border border-navy/10 bg-white p-5 transition-colors hover:border-accent"
                    >
                      <span>
                        <span className="block font-heading text-lg font-semibold text-navy">{a.title}</span>
                        <span className="mt-1 block text-sm text-ink/75">{a.description}</span>
                      </span>
                      <ChevronLeft className="h-5 w-5 shrink-0 text-accent" aria-hidden="true" />
                    </Link>
                  </li>
                ))}
              </ul>
            </section>

            <section aria-labelledby="lect-title">
              <h2 id="lect-title" className="text-2xl text-navy md:text-3xl">הרצאות</h2>
              <p className="mt-4 text-lg leading-relaxed text-ink/85">
                ליאור מרצה לארגונים, לכנסים ולקהילות על פלילים, זכויות אדם, רשלנות רפואית וייפוי כוח מתמשך.
              </p>
              <Link href="/lectures" className="mt-4 inline-flex items-center gap-1 font-medium text-accent underline-offset-4 hover:underline">
                לתפריט ההרצאות
                <ChevronLeft className="h-4 w-4" aria-hidden="true" />
              </Link>
            </section>

            {(brand.about.certificates.length > 0 || press.length > 0) && (
              <section aria-labelledby="proof-title">
                <h2 id="proof-title" className="text-2xl text-navy md:text-3xl">השתלמויות ופרסומים</h2>
                <ul className="mt-6 space-y-4">
                  {brand.about.certificates.map((c) => (
                    <li key={c.image} className="rounded-xl border border-navy/10 bg-white p-5">
                      <p className="font-semibold text-navy">{c.title}</p>
                      <p className="mt-1 text-sm text-ink/75">
                        {c.issuer} · {c.date}
                      </p>
                    </li>
                  ))}
                  {press.map((p) => (
                    <li key={p.url}>
                      <a
                        href={p.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between gap-4 rounded-xl border border-navy/10 bg-white p-5 transition-colors hover:border-accent"
                      >
                        <span>
                          <span className="block font-semibold text-navy">{p.title}</span>
                          <span className="mt-1 block text-sm text-ink/75">{p.outlet}</span>
                        </span>
                        <ExternalLink className="h-5 w-5 shrink-0 text-accent" aria-hidden="true" />
                        <span className="sr-only"> (נפתח בחלון חדש)</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>
        </article>

        {brand.about.gallery.length > 0 && (
          <section aria-label="תמונות" className="section bg-white">
            <ul className="shell grid max-w-3xl grid-cols-2 gap-4">
              {brand.about.gallery.map((photo) => (
                <li key={photo.src}>
                  <figure>
                    <Image
                      src={photo.src}
                      alt={photo.alt}
                      width={photo.width}
                      height={photo.height}
                      sizes="(min-width: 768px) 24rem, 45vw"
                      className="aspect-[3/4] w-full rounded-xl object-cover object-top shadow-md"
                    />
                    {photo.caption && <figcaption className="mt-2 text-sm text-ink/75">{photo.caption}</figcaption>}
                  </figure>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section aria-labelledby="talk-title" className="bg-navy py-16 text-cream md:py-20">
          <div className="shell max-w-2xl">
            <h2 id="talk-title" className="text-3xl text-cream">נעים להכיר, אפשר לדבר</h2>
            <p className="mt-3 text-cream/80">
              ייעוץ בזום בכל הארץ, או במשרד בחריש. בשיחה הראשונה אין צורך לפרט את האירוע, ואין התחייבות להמשך.
            </p>
            <div className="mt-8 rounded-3xl border border-cream/15 bg-cream/5 p-6 md:p-8">
              <CallbackForm />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
