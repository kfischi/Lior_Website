import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { getBrand } from '@/lib/sanity/content';
import { pageVisible, visiblePainPages } from '@/lib/pain-pages';
import { breadcrumbJsonLd, buildMetadata, faqJsonLd } from '@/lib/seo';
import { Header } from '@/components/sections/Header';
import { Footer } from '@/components/sections/Footer';
import { Reveal } from '@/components/motion/Reveal';
import { CallbackForm } from '@/components/sections/CallbackForm';
import { BookingBlock } from '@/components/sections/BookingBlock';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

type Params = { slug: string };

// Decided at build time; a slug that is not listed here is a 404.
export const dynamicParams = false;

export async function generateStaticParams(): Promise<Params[]> {
  const brand = await getBrand();
  return visiblePainPages(brand.painPages).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const brand = await getBrand();
  const page = brand.painPages.find((p) => p.slug === slug);
  if (!page || !pageVisible(page)) return {};
  const meta = buildMetadata({
    brand,
    title: page.seoTitle,
    description: page.seoDescription,
    path: `/help/${page.slug}`,
  });
  // Until the attorney approves the text, keep it out of search results.
  return page.approved ? meta : { ...meta, robots: { index: false, follow: false } };
}

function JsonLd({ data }: { data: unknown }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}

function Bullets({ items, tone }: { items: string[]; tone: 'accent' | 'warn' }) {
  return (
    <ul className="mt-6 space-y-3">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-3 text-ink/85">
          <span
            aria-hidden="true"
            className={`mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full ${tone === 'accent' ? 'bg-accent' : 'bg-ink/40'}`}
          />
          {item}
        </li>
      ))}
    </ul>
  );
}

export default async function PainPageRoute({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const brand = await getBrand();
  const page = brand.painPages.find((p) => p.slug === slug);
  if (!page || !pageVisible(page)) notFound();

  const area = brand.practiceAreas.find((a) => a.slug === page.areaSlug);
  const path = `/help/${page.slug}`;

  return (
    <>
      <JsonLd data={faqJsonLd(page.faq)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'ראשי', path: '/' },
          ...(area ? [{ name: area.title, path: `/practice-areas/${area.slug}` }] : []),
          { name: page.title, path },
        ])}
      />

      <Header />
      <main id="main">
        <section aria-labelledby="help-title" className="bg-navy pb-14 pt-36 text-cream md:pb-20">
          <div className="shell grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:items-start">
            <Reveal>
              {!page.approved && (
                <p role="note" className="mb-5 inline-block rounded-lg bg-amber-200 px-3 py-1.5 text-sm font-medium text-ink">
                  טיוטה לאישור ליאור. העמוד לא מפורסם ולא מופיע בגוגל.
                </p>
              )}
              <p className="eyebrow mb-4 text-accent-light">{brand.firmName}</p>
              <h1 id="help-title" className="text-4xl font-semibold leading-tight text-cream md:text-5xl">
                {page.title}
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-cream/90">{page.lead}</p>
              <p className="mt-4 text-sm text-cream/75">
                ייעוץ בזום בכל הארץ, או במשרד בחריש. בשיחה הראשונה אין צורך לפרט את האירוע, ואין התחייבות להמשך.
              </p>
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

        <article className="section bg-cream">
          <div className="shell max-w-3xl space-y-14">
            <section aria-labelledby="know-title">
              <h2 id="know-title" className="text-2xl text-navy md:text-3xl">מה כדאי לדעת</h2>
              <Bullets items={page.know} tone="accent" />
            </section>

            <section aria-labelledby="steps-title">
              <h2 id="steps-title" className="text-2xl text-navy md:text-3xl">מה כדאי לעשות עכשיו</h2>
              <ol className="mt-6 space-y-4">
                {page.steps.map((step, i) => (
                  <li key={step} className="flex items-start gap-4">
                    <span
                      aria-hidden="true"
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent/10 text-sm font-semibold text-accent"
                    >
                      {i + 1}
                    </span>
                    <span className="pt-0.5 leading-relaxed text-ink/85">{step}</span>
                  </li>
                ))}
              </ol>
            </section>

            <section aria-labelledby="avoid-title">
              <h2 id="avoid-title" className="text-2xl text-navy md:text-3xl">ומה כדאי להימנע ממנו</h2>
              <Bullets items={page.avoid} tone="warn" />
              <p className="mt-6 text-sm text-ink/75">{brand.chat.disclaimer}</p>
            </section>

            <section aria-labelledby="faq-title">
              <h2 id="faq-title" className="text-2xl text-navy md:text-3xl">שאלות נפוצות</h2>
              <Accordion type="single" collapsible className="mt-4 border-t border-navy/10">
                {page.faq.map((item, i) => (
                  <AccordionItem key={item.question} value={`q-${i}`}>
                    <AccordionTrigger>{item.question}</AccordionTrigger>
                    <AccordionContent>{item.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </section>
          </div>
        </article>

        <section aria-labelledby="book-title" className="bg-navy py-16 text-cream md:py-20">
          <div className="shell max-w-3xl">
            <h2 id="book-title" className="text-3xl text-cream">רוצים לקבוע שיחה?</h2>
            <p className="mt-3 text-cream/80">
              בקשת פגישה היא לא קביעה סופית: המשרד יחזור אליכם לאישור המועד.
            </p>
            <div className="mt-8 rounded-3xl border border-cream/15 bg-cream/5 p-6 md:p-8">
              <BookingBlock />
            </div>
          </div>
        </section>

        {area && (
          <nav aria-label="תחום עיסוק קשור" className="section bg-cream">
            <div className="shell max-w-3xl">
              <Link
                href={`/practice-areas/${area.slug}`}
                className="flex items-center justify-between gap-4 rounded-xl border border-navy/10 p-5 transition-colors hover:border-accent"
              >
                <span>
                  <span className="block text-sm text-ink/65">עוד על התחום</span>
                  <span className="font-heading text-lg font-semibold text-navy">{area.title}</span>
                </span>
                <ChevronLeft className="h-5 w-5 text-accent" aria-hidden="true" />
              </Link>
            </div>
          </nav>
        )}
      </main>
      <Footer />
    </>
  );
}
