import type { Metadata } from 'next';
import Image from 'next/image';
import {
  Fingerprint,
  FileSignature,
  Gavel,
  HeartPulse,
  Landmark,
  MessageCircle,
  MessagesSquare,
  Mic,
  ShieldAlert,
  Stethoscope,
  Users,
  type LucideIcon,
} from 'lucide-react';
import { getBrand } from '@/lib/sanity/content';
import { breadcrumbJsonLd, buildMetadata } from '@/lib/seo';
import { siteUrl } from '@/lib/utils';
import { Header } from '@/components/sections/Header';
import { Footer } from '@/components/sections/Footer';
import { Reveal, Stagger, StaggerItem } from '@/components/motion/Reveal';
import { CallbackForm } from '@/components/sections/CallbackForm';
import { Button } from '@/components/ui/button';
import { OpenChatButton } from '@/components/ai/OpenChatButton';

/** One icon per talk, in the order of the menu. Presentation only. */
const ICONS: LucideIcon[] = [Gavel, ShieldAlert, Fingerprint, Landmark, HeartPulse, Stethoscope, FileSignature];

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
  const stats = [
    { value: String(lectures.items.length), label: 'נושאים להרצאה' },
    { value: String(years), label: 'שנות ניסיון' },
    { value: 'ארגונים, כנסים וקהילות', label: 'למי אני מרצה', wide: true },
  ];

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
        {/* Opening: the title beside a photo of her on stage */}
        <section aria-labelledby="lectures-title" className="relative overflow-hidden bg-navy pb-20 pt-32 text-cream md:pb-28 md:pt-36">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -end-40 -top-40 h-[34rem] w-[34rem] rounded-full bg-accent/20 blur-3xl"
          />
          <div className="shell relative grid items-center gap-14 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
            <Reveal>
              <p className="eyebrow mb-5 inline-flex items-center gap-2 text-accent-light">
                <Mic className="h-4 w-4" aria-hidden="true" />
                {lectures.eyebrow}
              </p>
              <h1 id="lectures-title" className="text-balance text-4xl font-semibold leading-[1.08] text-cream md:text-6xl">
                {lectures.title}
              </h1>
              <p className="mt-6 max-w-xl text-xl leading-relaxed text-cream/90">
                הרצאות על פלילים, צדק והאדם שמאחורי התיק, מפי עורכת דין עם {years} שנות ניסיון בתוך המערכת.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <OpenChatButton lecture size="lg" variant="accentOnDark">
                  <MessagesSquare className="h-5 w-5" aria-hidden="true" />
                  להזמנת הרצאה
                </OpenChatButton>
                <Button asChild size="lg" variant="onDark">
                  <a href="#menu">לתפריט ההרצאות</a>
                </Button>
                <OpenChatButton intake={false} size="lg" variant="onDark">
                  <MessagesSquare className="h-5 w-5" aria-hidden="true" />
                  לשאול את העוזרת
                </OpenChatButton>
              </div>
              <dl className="mt-12 grid max-w-xl grid-cols-2 gap-x-6 gap-y-5 border-t border-cream/15 pt-8">
                {stats.map((s) => (
                  <div key={s.label} className={s.wide ? 'col-span-2' : undefined}>
                    <dt className="text-sm text-cream/70">{s.label}</dt>
                    <dd
                      className={
                        s.wide
                          ? 'mt-1 text-xl font-medium text-cream'
                          : 'mt-1 font-heading text-4xl font-semibold text-accent-light'
                      }
                    >
                      {s.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </Reveal>

            <Reveal delay={0.1}>
              <figure className="relative mx-auto w-full max-w-sm lg:max-w-none">
                <div
                  aria-hidden="true"
                  className="absolute -bottom-5 -start-5 h-full w-full rounded-3xl border border-accent-light/50"
                />
                <div className="relative aspect-[4/5] overflow-hidden rounded-3xl shadow-2xl ring-1 ring-cream/10">
                  <Image
                    src={lectures.photo.src}
                    alt={lectures.photo.alt}
                    fill
                    priority
                    sizes="(max-width: 1024px) 80vw, 28rem"
                    className="object-cover object-[62%_58%]"
                  />
                  <div
                    aria-hidden="true"
                    className="absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-t from-navy/85 to-transparent"
                  />
                  <figcaption className="absolute inset-x-0 bottom-0 flex items-center gap-2 p-5 text-cream">
                    <Mic className="h-4 w-4 text-accent-light" aria-hidden="true" />
                    <span className="font-heading text-lg font-semibold">{lectures.photo.caption}</span>
                  </figcaption>
                </div>
              </figure>
            </Reveal>
          </div>
        </section>

        {/* Why invite her */}
        <section aria-labelledby="why-title" className="section bg-cream">
          <div className="shell grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
            <Reveal>
              <p className="eyebrow mb-4">למה להזמין אותי</p>
              <h2 id="why-title" className="sr-only">למה להזמין אותי</h2>
              <blockquote className="relative">
                <span
                  aria-hidden="true"
                  className="absolute -top-8 -start-1 select-none font-heading text-9xl leading-none text-accent/20"
                >
                  ״
                </span>
                <p className="relative font-heading text-3xl leading-snug text-navy md:text-4xl">{lectures.quote}</p>
              </blockquote>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="space-y-5 text-lg leading-relaxed text-ink/85">
                {lectures.about.map((p) => (
                  <p key={p}>{p.replace('{years}', String(years))}</p>
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        {/* The menu */}
        <section id="menu" aria-labelledby="menu-title" className="section scroll-mt-20 bg-white">
          <div className="shell">
            <Reveal>
              <p className="eyebrow mb-4">מה אפשר להזמין</p>
              <h2 id="menu-title" className="text-3xl text-navy md:text-5xl">תפריט ההרצאות</h2>
              <p className="mt-4 max-w-2xl text-lg text-ink/75">
                אפשר להזמין כל הרצאה כמו שהיא, או לשלב נושאים ולהתאים אותם לקהל שלכם.
              </p>
            </Reveal>
            <Stagger as="div" className="mt-12 grid gap-6 md:grid-cols-2">
              {lectures.items.map((l, i) => {
                const Icon = ICONS[i % ICONS.length];
                return (
                  <StaggerItem key={l.title}>
                    <article className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-navy/10 bg-cream/60 p-7 transition-all duration-500 hover:-translate-y-1.5 hover:border-accent/50 hover:shadow-2xl md:p-9">
                      <span
                        aria-hidden="true"
                        className="pointer-events-none absolute -top-3 end-6 select-none font-heading text-8xl font-semibold leading-none text-accent/10 transition-colors group-hover:text-accent/20"
                      >
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-navy text-accent-light">
                        <Icon className="h-6 w-6" aria-hidden="true" />
                      </span>
                      <h3 className="mt-5 text-xl font-semibold leading-snug text-navy md:text-2xl">
                        <span className="sr-only">הרצאה {i + 1}: </span>
                        {l.title}
                      </h3>
                      <p className="mt-4 flex-1 leading-relaxed text-ink/85">{l.about}</p>
                      <p className="mt-6 flex items-start gap-2 border-t border-navy/10 pt-5 text-sm leading-relaxed text-ink/80">
                        <Users className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
                        <span>
                          <span className="font-semibold text-navy">למי זה מתאים: </span>
                          {l.audience}
                        </span>
                      </p>
                    </article>
                  </StaggerItem>
                );
              })}
            </Stagger>
          </div>
        </section>

        {/* Invite */}
        <section id="invite" aria-labelledby="invite-title" className="relative scroll-mt-20 overflow-hidden bg-navy py-20 text-cream md:py-28">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -start-32 -bottom-40 h-[30rem] w-[30rem] rounded-full bg-accent/20 blur-3xl"
          />
          <div className="shell relative grid gap-12 lg:grid-cols-2 lg:items-center">
            <Reveal>
              <h2 id="invite-title" className="text-balance text-3xl text-cream md:text-5xl">{lectures.ctaTitle}</h2>
              <p className="mt-5 max-w-lg text-lg leading-relaxed text-cream/85">{lectures.ctaText}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <OpenChatButton lecture size="lg" variant="accentOnDark">
                  <MessagesSquare className="h-5 w-5" aria-hidden="true" />
                  להזמנת הרצאה בצ׳אט
                </OpenChatButton>
                <Button asChild size="lg" variant="onDark">
                  <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="h-5 w-5" aria-hidden="true" />
                    שליחת הודעה בוואטסאפ
                    <span className="sr-only"> (נפתח בחלון חדש)</span>
                  </a>
                </Button>
                <Button asChild size="lg" variant="onDark">
                  <a href={`tel:+${brand.phoneE164}`}>
                    <span dir="ltr">{brand.phone}</span>
                  </a>
                </Button>
                <OpenChatButton intake={false} size="lg" variant="onDark">
                  <MessagesSquare className="h-5 w-5" aria-hidden="true" />
                  שאלות? העוזרת עונה
                </OpenChatButton>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="rounded-3xl border border-cream/15 bg-cream/5 p-6 backdrop-blur-sm md:p-8">
                <h3 className="text-2xl text-cream">או השאירו טלפון ונחזור אליכם</h3>
                <div className="mt-5">
                  <CallbackForm channel="lecture" matter="הזמנת הרצאה" />
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
