import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronLeft, MessageCircle, MessagesSquare } from 'lucide-react';
import { brand, whatsappHref } from '@/lib/brand';
import { articlesForArea } from '@/lib/articles';
import { ArticleCard } from '@/components/sections/ArticleCard';
import { breadcrumbJsonLd, buildMetadata, faqJsonLd, serviceJsonLd } from '@/lib/seo';
import { Header } from '@/components/sections/Header';
import { Footer } from '@/components/sections/Footer';
import { Reveal } from '@/components/motion/Reveal';
import { Button } from '@/components/ui/button';
import { OpenChatButton } from '@/components/ai/OpenChatButton';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

type Params = { slug: string };

export const dynamicParams = false;

export function generateStaticParams(): Params[] {
  return brand.practiceAreas.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const area = brand.practiceAreas.find((a) => a.slug === slug);
  if (!area) return {};
  return buildMetadata({
    title: area.page.seoTitle,
    description: area.page.seoDescription,
    path: `/practice-areas/${area.slug}`,
  });
}

function JsonLd({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export default async function PracticeAreaPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const area = brand.practiceAreas.find((a) => a.slug === slug);
  if (!area) notFound();

  const { page } = area;
  const others = brand.practiceAreas.filter((a) => a.slug !== area.slug);
  const path = `/practice-areas/${area.slug}`;
  const guides = articlesForArea(area.slug);

  return (
    <>
      <JsonLd data={serviceJsonLd(area)} />
      <JsonLd data={faqJsonLd(page.faq)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'ראשי', path: '/' },
          { name: 'תחומי עיסוק', path: '/#practice' },
          { name: area.title, path },
        ])}
      />

      <Header />
      <main id="main">
        {/* Intro band */}
        <section aria-labelledby="area-title" className="bg-navy pb-16 pt-36 text-cream md:pb-24">
          <div className="shell max-w-4xl">
            <nav aria-label="פירורי לחם" className="mb-6 text-sm text-cream/70">
              <ol className="flex flex-wrap items-center gap-1.5">
                <li>
                  <Link href="/" className="hover:text-accent-light">
                    ראשי
                  </Link>
                </li>
                <li aria-hidden="true">
                  <ChevronLeft className="h-3.5 w-3.5" />
                </li>
                <li>
                  <Link href="/#practice" className="hover:text-accent-light">
                    תחומי עיסוק
                  </Link>
                </li>
                <li aria-hidden="true">
                  <ChevronLeft className="h-3.5 w-3.5" />
                </li>
                <li aria-current="page" className="text-cream">
                  {area.title}
                </li>
              </ol>
            </nav>
            <Reveal>
              <p className="eyebrow mb-4 text-accent-light">{brand.firmName}</p>
              <h1 id="area-title" className="text-4xl font-bold text-cream md:text-5xl">
                {area.title}
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-cream/85">
                {page.intro[0]}
              </p>
            </Reveal>
          </div>
        </section>

        {/* Article */}
        <article className="section bg-cream">
          <div className="shell max-w-3xl space-y-14">
            {page.intro.slice(1).map((paragraph) => (
              <p key={paragraph} className="text-lg leading-relaxed text-ink/80">
                {paragraph}
              </p>
            ))}

            <section aria-labelledby="handles-title">
              <h2 id="handles-title" className="text-2xl text-navy md:text-3xl">
                במה המשרד מסייע
              </h2>
              <ul className="mt-6 space-y-3">
                {page.handles.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-ink/85">
                    <span
                      aria-hidden="true"
                      className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent"
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </section>

            <section aria-labelledby="steps-title">
              <h2 id="steps-title" className="text-2xl text-navy md:text-3xl">
                מה כדאי לדעת בשלבים הראשונים
              </h2>
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
              <p className="mt-6 text-sm text-ink/75">{brand.chat.disclaimer}</p>
            </section>

            <section aria-labelledby="faq-title">
              <h2 id="faq-title" className="text-2xl text-navy md:text-3xl">
                שאלות נפוצות
              </h2>
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

        {/* Call to action */}
        <section aria-labelledby="cta-title" className="bg-navy py-16 text-cream md:py-20">
          <div className="shell max-w-3xl text-center">
            <h2 id="cta-title" className="text-3xl text-cream">
              רוצים לדבר על המקרה שלכם?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-cream/80">
              אפשר לשוחח עם העוזרת של ליאור ולהשאיר כמה פרטים קצרים, או לכתוב בוואטסאפ. בלי צורך לפרט את האירוע בפנייה הראשונה.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <OpenChatButton size="lg" variant="accentOnDark">
                <MessagesSquare className="h-5 w-5" />
                {brand.hero.primaryCta}
              </OpenChatButton>
              <Button asChild size="lg" variant="onDark">
                <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="h-5 w-5" />
                  {brand.hero.secondaryCta}
                </a>
              </Button>
            </div>
          </div>
        </section>

        {guides.length > 0 && (
          <section aria-labelledby="guides-title" className="section bg-white">
            <div className="shell max-w-5xl">
              <h2 id="guides-title" className="text-2xl text-navy md:text-3xl">
                מדריכים בנושא
              </h2>
              <ul className="mt-6 grid gap-5 md:grid-cols-2">
                {guides.map((g) => (
                  <li key={g.slug}>
                    <ArticleCard article={g} />
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        {/* Internal links to the other areas */}
        <nav aria-labelledby="more-title" className="section bg-cream">
          <div className="shell max-w-3xl">
            <h2 id="more-title" className="text-2xl text-navy">
              תחומי עיסוק נוספים
            </h2>
            <ul className="mt-6 grid gap-4 sm:grid-cols-2">
              {others.map((o) => (
                <li key={o.slug}>
                  <Link
                    href={`/practice-areas/${o.slug}`}
                    className="block rounded-xl border border-navy/10 p-5 transition-colors hover:border-accent"
                  >
                    <span className="font-heading text-lg font-semibold text-navy">{o.title}</span>
                    <span className="mt-1 block text-sm text-ink/65">{o.description}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </main>
      <Footer />
    </>
  );
}
