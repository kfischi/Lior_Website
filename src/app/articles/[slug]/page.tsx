import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronLeft, MessageCircle, MessagesSquare } from 'lucide-react';
import { brand, whatsappHref } from '@/lib/brand';
import { articles, articlesForArea, formatHebrewDate, getArticle } from '@/lib/articles';
import { articleJsonLd, breadcrumbJsonLd, buildMetadata, faqJsonLd } from '@/lib/seo';
import { Header } from '@/components/sections/Header';
import { Footer } from '@/components/sections/Footer';
import { ArticleCard } from '@/components/sections/ArticleCard';
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
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const article = getArticle((await params).slug);
  if (!article) return {};
  return buildMetadata({
    title: article.seoTitle,
    description: article.seoDescription,
    path: `/articles/${article.slug}`,
    article: { published: article.published, modified: article.updated },
  });
}

function JsonLd({ data }: { data: unknown }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}

export default async function ArticlePage({ params }: { params: Promise<Params> }) {
  const article = getArticle((await params).slug);
  if (!article) notFound();

  const area = brand.practiceAreas.find((a) => a.slug === article.areaSlug);
  const related = articlesForArea(article.areaSlug).filter((a) => a.slug !== article.slug);
  const path = `/articles/${article.slug}`;

  return (
    <>
      <JsonLd data={articleJsonLd(article)} />
      <JsonLd data={faqJsonLd(article.faq)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'ראשי', path: '/' },
          { name: 'מדריכים', path: '/articles' },
          { name: article.title, path },
        ])}
      />
      <Header />
      <main id="main">
        <section aria-labelledby="article-title" className="bg-navy pb-14 pt-36 text-cream md:pb-20">
          <div className="shell max-w-3xl">
            <nav aria-label="פירורי לחם" className="mb-6 text-sm text-cream/70">
              <ol className="flex flex-wrap items-center gap-1.5">
                <li>
                  <Link href="/" className="hover:text-accent-light">ראשי</Link>
                </li>
                <li aria-hidden="true"><ChevronLeft className="h-3.5 w-3.5" /></li>
                <li>
                  <Link href="/articles" className="hover:text-accent-light">מדריכים</Link>
                </li>
              </ol>
            </nav>
            {area && <p className="eyebrow mb-4 text-accent-light">{area.title}</p>}
            <h1 id="article-title" className="text-3xl font-bold text-cream md:text-5xl">
              {article.title}
            </h1>
            <p className="mt-5 text-sm text-cream/70">
              {brand.attorneyName} · עודכן <time dateTime={article.updated}>{formatHebrewDate(article.updated)}</time> ·{' '}
              {article.readingMinutes} דקות קריאה
            </p>
          </div>
        </section>

        <article className="section bg-cream">
          <div className="shell max-w-3xl space-y-12">
            <section
              aria-label="בקצרה"
              data-speakable
              className="rounded-2xl border border-accent/30 bg-white p-6 shadow-sm"
            >
              <h2 className="mb-2 text-lg text-accent">בקצרה</h2>
              <p className="text-lg leading-relaxed text-ink">{article.tldr}</p>
            </section>

            {article.sections.map((section) => (
              <section key={section.heading}>
                <h2 className="text-2xl text-navy md:text-3xl">{section.heading}</h2>
                {section.paragraphs.map((p) => (
                  <p key={p} className="mt-4 text-lg leading-relaxed text-ink/80">
                    {p}
                  </p>
                ))}
                {section.bullets && (
                  <ul className="mt-4 space-y-2.5">
                    {section.bullets.map((b) => (
                      <li key={b} className="flex items-start gap-3 text-ink/85">
                        <span aria-hidden="true" className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                        {b}
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            ))}

            <section aria-labelledby="article-faq">
              <h2 id="article-faq" className="text-2xl text-navy md:text-3xl">שאלות נפוצות</h2>
              <Accordion type="single" collapsible className="mt-4 border-t border-navy/10">
                {article.faq.map((item, i) => (
                  <AccordionItem key={item.question} value={`q-${i}`}>
                    <AccordionTrigger>{item.question}</AccordionTrigger>
                    <AccordionContent>{item.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </section>

            <p className="rounded-xl bg-navy/5 p-4 text-sm leading-relaxed text-ink/70">
              {brand.chat.disclaimer} המדריך מתאר את המצב הכללי ואינו חוות דעת על מקרה ספציפי.
            </p>
          </div>
        </article>

        <section aria-labelledby="cta-title" className="bg-navy py-16 text-cream md:py-20">
          <div className="shell max-w-3xl text-center">
            <h2 id="cta-title" className="text-3xl text-cream">רוצים לדבר על המקרה שלכם?</h2>
            <p className="mx-auto mt-4 max-w-xl text-cream/80">
              אפשר לשוחח עם העוזר הדיגיטלי ולהשאיר כמה פרטים קצרים, או לכתוב בוואטסאפ. בלי צורך לפרט את האירוע בפנייה הראשונה.
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

        {(area || related.length > 0) && (
          <nav aria-labelledby="more-title" className="section bg-cream">
            <div className="shell max-w-5xl">
              <h2 id="more-title" className="text-2xl text-navy">להמשך קריאה</h2>
              {area && (
                <p className="mt-3 text-ink/75">
                  עמוד התחום:{' '}
                  <Link href={`/practice-areas/${area.slug}`} className="font-medium text-accent underline underline-offset-2">
                    {area.title}
                  </Link>
                </p>
              )}
              {related.length > 0 && (
                <ul className="mt-6 grid gap-5 md:grid-cols-2">
                  {related.map((a) => (
                    <li key={a.slug}>
                      <ArticleCard article={a} />
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </nav>
        )}
      </main>
      <Footer />
    </>
  );
}
