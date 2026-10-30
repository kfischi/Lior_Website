import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, MessageCircle, Phone } from 'lucide-react';
import { brand, telHref, whatsappHref } from '@/lib/brand';
import { buildMetadata, faqJsonLd } from '@/lib/seo';
import { Header } from '@/components/sections/Header';
import { TrustBar } from '@/components/sections/TrustBar';
import { Process } from '@/components/sections/Process';
import { Faq } from '@/components/sections/Faq';
import { Contact } from '@/components/sections/Contact';
import { Footer } from '@/components/sections/Footer';
import { CallbackForm } from '@/components/sections/CallbackForm';
import { Icon } from '@/components/sections/Icon';
import { Button } from '@/components/ui/button';

/**
 * Landing page for ads and links that go straight to "talk to the attorney".
 * Built only from the brand file, with no countdown, no invented scarcity and no promised results.
 * Kept out of search results (noindex) until the attorney approves the wording; then remove `noindex`.
 */
export const metadata: Metadata = buildMetadata({
  absoluteTitle: `שיחה ראשונה עם עו״ד ליאור-קלואי ארז | ${brand.address.city} וזום`,
  description:
    'פלילי, נזיקין, צוואות וייפוי כוח מתמשך. שיחה קצרה ודיסקרטית עם עו״ד ליאור-קלואי ארז, בלי צורך לפרט את האירוע בפנייה הראשונה.',
  path: '/consultation',
  noindex: true,
});

export default function ConsultationPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd()) }} />
      <Header />
      <main id="main">
        <section aria-labelledby="lp-title" className="relative overflow-hidden bg-navy pb-16 pt-32 text-cream md:pb-24 md:pt-40">
          <div className="shell grid items-center gap-10 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
            <div>
              <p className="eyebrow mb-4 text-accent-light">
                {brand.firmNameShort} · {brand.address.city} וזום
              </p>
              <h1 id="lp-title" className="text-[clamp(2rem,5vw,3.75rem)] font-semibold leading-[1.08] text-cream text-balance">
                יש לכם שאלה משפטית? אפשר להתחיל בשיחה קצרה ודיסקרטית
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-cream/85">
                משפט פלילי, נזיקין, צוואות וייפוי כוח מתמשך. בפנייה הראשונה אין צורך לפרט את האירוע: מספרים במשפט
                אחד במה מדובר, ומקבלים הסבר על האפשרויות.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild size="lg" variant="accentOnDark">
                  <a href={telHref}>
                    <Phone className="h-5 w-5" aria-hidden="true" />
                    <span dir="ltr">{brand.phone}</span>
                  </a>
                </Button>
                <Button asChild size="lg" variant="onDark">
                  <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="h-5 w-5" aria-hidden="true" />
                    {brand.hero.secondaryCta}
                  </a>
                </Button>
              </div>
            </div>

            <div className="rounded-3xl border border-cream/15 bg-cream/5 p-6 md:p-8">
              <h2 className="text-2xl text-cream">השאירו טלפון ונחזור אליכם</h2>
              <div className="mt-5">
                <CallbackForm />
              </div>
            </div>
          </div>
          <p className="shell mt-10 text-sm leading-relaxed text-cream/70 md:mt-14 md:pe-[40%]">
            האתר מציע מידע כללי בלבד ואינו מהווה ייעוץ משפטי. העוזרת הווירטואלית היא בינה מלאכותית ואינה עורכת דין.
          </p>
        </section>

        <TrustBar />

        <section aria-labelledby="lp-areas" className="section bg-cream">
          <div className="shell">
            <p className="eyebrow mb-3">במה אפשר לעזור</p>
            <h2 id="lp-areas" className="display-xl text-navy">
              שלושה תחומים, ליווי אישי אחד
            </h2>
            <ul className="mt-12 grid gap-6 md:grid-cols-3">
              {brand.practiceAreas.map((area) => (
                <li key={area.slug} className="flex flex-col rounded-2xl border border-navy/10 bg-white p-7 shadow-sm">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 text-accent">
                    <Icon name={area.icon} className="h-6 w-6" />
                  </span>
                  <h3 className="mt-5 text-2xl text-navy">{area.title}</h3>
                  <p className="mt-3 flex-1 leading-relaxed text-ink/75">{area.description}</p>
                  <Link
                    href={`/practice-areas/${area.slug}`}
                    className="mt-6 inline-flex min-h-11 items-center gap-2 font-medium text-accent underline-offset-4 hover:underline"
                  >
                    עוד על {area.title}
                    <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <Process />
        <Faq />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
