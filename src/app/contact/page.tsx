import type { Metadata } from 'next';
import Link from 'next/link';
import { Clock, Mail, MapPin, Phone, Video } from 'lucide-react';
import { getBrand } from '@/lib/sanity/content';
import { links } from '@/lib/brand';
import { breadcrumbJsonLd, buildMetadata, contactPageJsonLd } from '@/lib/seo';
import { Header } from '@/components/sections/Header';
import { Footer } from '@/components/sections/Footer';
import { Reveal } from '@/components/motion/Reveal';
import { CallbackForm } from '@/components/sections/CallbackForm';
import { BookingBlock } from '@/components/sections/BookingBlock';
import { WhatsAppIcon } from '@/components/ui/whatsapp-icon';

export async function generateMetadata(): Promise<Metadata> {
  const brand = await getBrand();
  return buildMetadata({
    brand,
    title: `יצירת קשר, ${brand.address.city}`,
    description: `${brand.firmName}, ${brand.address.street}, ${brand.address.city}: משפט פלילי, נזיקין וצוואות. טלפון ${brand.phone}, וואטסאפ או בקשת פגישה. ייעוץ בזום בכל הארץ.`,
    path: '/contact',
  });
}

function JsonLd({ data }: { data: unknown }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}

export default async function ContactPage() {
  const brand = await getBrand();
  const { tel, whatsapp, mail } = links(brand);
  const rows = [
    { icon: Phone, label: 'טלפון', value: brand.phone, href: tel, dir: 'ltr' as const },
    { icon: WhatsAppIcon, label: 'וואטסאפ', value: brand.phone, href: whatsapp, dir: 'ltr' as const, external: true },
    { icon: Mail, label: 'דוא״ל', value: brand.email, href: mail, dir: 'ltr' as const },
    { icon: MapPin, label: 'כתובת המשרד', value: `${brand.address.street}, ${brand.address.city}`, href: brand.mapUrl, external: true },
    { icon: Clock, label: 'מתי', value: brand.hours },
    { icon: Video, label: 'אזורי שירות', value: `משרד ב${brand.seo.serviceAreas.join(', ')}. ייעוץ בזום בכל הארץ.` },
  ];

  return (
    <>
      <JsonLd data={contactPageJsonLd(brand)} />
      <JsonLd data={breadcrumbJsonLd([{ name: 'ראשי', path: '/' }, { name: 'יצירת קשר', path: '/contact' }])} />
      <Header />
      <main id="main">
        <section aria-labelledby="contact-title" className="bg-navy pb-14 pt-36 text-cream md:pb-20">
          <div className="shell grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:items-start">
            <Reveal>
              <p className="eyebrow mb-4 text-accent-light">{brand.firmName}</p>
              <h1 id="contact-title" className="text-4xl font-semibold leading-tight text-cream md:text-5xl">
                יצירת קשר, {brand.address.city} וזום
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-cream/90">
                אפשר להתקשר, לכתוב בוואטסאפ או להשאיר טלפון ונחזור אליכם. בפנייה הראשונה אין צורך לפרט את האירוע.
              </p>
              <address className="mt-8 not-italic">
                <ul className="space-y-4">
                  {rows.map(({ icon: Icon, label, value, href, dir, external }) => (
                    <li key={label} className="flex items-start gap-3">
                      <Icon className="mt-1 h-5 w-5 shrink-0 text-accent-light" aria-hidden="true" />
                      <span className="flex flex-col leading-snug">
                        <span className="text-xs text-cream/70">{label}</span>
                        {href ? (
                          <a
                            href={href}
                            dir={dir}
                            {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                            className="text-lg font-medium text-cream underline-offset-4 hover:underline"
                          >
                            {value}
                            {external && <span className="sr-only"> (נפתח בחלון חדש)</span>}
                          </a>
                        ) : (
                          <span className="text-lg font-medium text-cream">{value}</span>
                        )}
                      </span>
                    </li>
                  ))}
                </ul>
              </address>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="rounded-3xl border border-cream/15 bg-cream/5 p-6 md:p-8">
                <h2 className="text-2xl text-cream">השאירו טלפון ונחזור אליכם</h2>
                <div className="mt-5">
                  <CallbackForm />
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        <section aria-labelledby="book-title" className="bg-cream py-16 md:py-20">
          <div className="shell max-w-3xl">
            <h2 id="book-title" className="text-3xl text-navy">רוצים לקבוע פגישת ייעוץ?</h2>
            <p className="mt-3 text-ink/80">בקשת פגישה היא לא קביעה סופית: המשרד יחזור אליכם לאישור המועד.</p>
            <div className="mt-8 rounded-3xl bg-navy p-6 md:p-8">
              <BookingBlock />
            </div>
            <p className="mt-8 text-sm text-ink/75">
              קודם רוצים לקרוא?{' '}
              <Link href="/faq" className="text-accent underline underline-offset-4">שאלות ותשובות</Link> או{' '}
              <Link href="/articles" className="text-accent underline underline-offset-4">המדריכים</Link>.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
