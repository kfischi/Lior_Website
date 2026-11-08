import type { Metadata } from 'next';
import { MessageCircle } from 'lucide-react';
import { getBrand } from '@/lib/sanity/content';
import { breadcrumbJsonLd, buildMetadata } from '@/lib/seo';
import { siteUrl } from '@/lib/utils';
import { Header } from '@/components/sections/Header';
import { Footer } from '@/components/sections/Footer';
import { Reveal } from '@/components/motion/Reveal';
import { CallbackForm } from '@/components/sections/CallbackForm';
import { Button } from '@/components/ui/button';

export async function generateMetadata(): Promise<Metadata> {
  const brand = await getBrand();
  return buildMetadata({
    brand,
    title: 'הרצאות על משפט, צדק וזכויות אדם',
    description: `הרצאות לארגונים, כנסים וקהילות מפי ${brand.attorneyName}: חקירות ופלילים, הטרדה מינית בעסקים, זכויות אדם בחירום, הסכמה מדעת, רשלנות רפואית וייפוי כוח מתמשך.`,
    path: '/lectures',
  });
}

function JsonLd({ data }: { data: unknown }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}

export default async function LecturesPage() {
  const brand = await getBrand();
  const { lectures } = brand;
  const years = new Date().getFullYear() - brand.about.practisingSince;
  const base = siteUrl();
  const whatsappHref = `https://wa.me/${brand.whatsapp}?text=${encodeURIComponent(lectures.whatsappText)}`;

  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'ItemList',
          name: `הרצאות, ${brand.attorneyName}`,
          itemListElement: lectures.items.map((l, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            item: { '@type': 'Service', name: l.title, description: l.about, provider: { '@id': `${base}/#attorney` } },
          })),
        }}
      />
      <JsonLd data={breadcrumbJsonLd([{ name: 'ראשי', path: '/' }, { name: 'הרצאות', path: '/lectures' }])} />
      <Header />
      <main id="main">
        <section aria-labelledby="lectures-title" className="bg-navy pb-16 pt-36 text-cream md:pb-24">
          <div className="shell max-w-4xl">
            <Reveal>
              <p className="eyebrow mb-4 text-accent-light">{lectures.eyebrow}</p>
              <h1 id="lectures-title" className="text-4xl font-semibold leading-tight text-cream md:text-6xl">
                {lectures.title}
              </h1>
              <p className="mt-6 max-w-2xl text-xl leading-relaxed text-cream/90">
                הרצאות על פלילים, צדק והאדם שמאחורי התיק, מפי עורכת דין עם {years} שנות ניסיון בתוך המערכת.
              </p>
              <div className="mt-8">
                <Button asChild size="lg" variant="accentOnDark">
                  <a href="#invite">להזמנת הרצאה</a>
                </Button>
              </div>
            </Reveal>
          </div>
        </section>

        <article className="section bg-cream">
          <div className="shell max-w-3xl space-y-16">
            <section aria-labelledby="why-title">
              <h2 id="why-title" className="text-2xl text-navy md:text-3xl">למה להזמין אותי</h2>
              <blockquote className="mt-6 border-s-4 border-accent ps-5 font-heading text-2xl leading-snug text-navy">
                {lectures.quote}
              </blockquote>
              <div className="mt-6 space-y-4 text-lg leading-relaxed text-ink/85">
                {lectures.about.map((p) => (
                  <p key={p}>{p.replace('{years}', String(years))}</p>
                ))}
              </div>
            </section>

            <section aria-labelledby="menu-title">
              <h2 id="menu-title" className="text-2xl text-navy md:text-3xl">תפריט ההרצאות</h2>
              <ol className="mt-8 space-y-6">
                {lectures.items.map((l, i) => (
                  <li key={l.title}>
                    <article className="rounded-2xl border border-navy/10 bg-white p-6 md:p-8">
                      <p className="text-sm font-medium text-accent">הרצאה {i + 1}</p>
                      <h3 className="mt-1 text-xl font-semibold leading-snug text-navy md:text-2xl">{l.title}</h3>
                      <p className="mt-4 leading-relaxed text-ink/85">{l.about}</p>
                      <p className="mt-4 text-sm text-ink/75">
                        <span className="font-semibold text-navy">למי זה מתאים: </span>
                        {l.audience}
                      </p>
                    </article>
                  </li>
                ))}
              </ol>
            </section>
          </div>
        </article>

        <section id="invite" aria-labelledby="invite-title" className="scroll-mt-24 bg-navy py-16 text-cream md:py-20">
          <div className="shell max-w-2xl">
            <h2 id="invite-title" className="text-3xl text-cream">{lectures.ctaTitle}</h2>
            <p className="mt-3 text-cream/85">{lectures.ctaText}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild size="lg" variant="accentOnDark">
                <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="h-5 w-5" aria-hidden="true" />
                  שליחת הודעה בוואטסאפ
                  <span className="sr-only"> (נפתח בחלון חדש)</span>
                </a>
              </Button>
              <Button asChild size="lg" variant="onDark">
                <a href={`tel:+${brand.phoneE164}`}>{brand.phone}</a>
              </Button>
            </div>
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
