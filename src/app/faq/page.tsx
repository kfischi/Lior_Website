import type { Metadata } from 'next';
import Link from 'next/link';
import { brand } from '@/lib/brand';
import { articles } from '@/lib/articles';
import { breadcrumbJsonLd, buildMetadata, faqJsonLd } from '@/lib/seo';
import { Header } from '@/components/sections/Header';
import { Footer } from '@/components/sections/Footer';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

export const metadata: Metadata = buildMetadata({
  title: 'שאלות ותשובות',
  description:
    'תשובות קצרות לשאלות נפוצות על פגישת ייעוץ, סודיות, אפליה והתעמרות בעבודה, שימוע, הטרדה מינית וחקירה במשטרה.',
  path: '/faq',
});

interface Group {
  id: string;
  title: string;
  items: { question: string; answer: string }[];
}

function groups(): Group[] {
  return [
    { id: 'general', title: 'שאלות כלליות', items: brand.faq },
    ...brand.practiceAreas.map((a) => ({ id: a.slug, title: a.title, items: a.page.faq })),
    { id: 'guides', title: 'מתוך המדריכים', items: articles.flatMap((a) => a.faq) },
  ];
}

export default function FaqPage() {
  const all = groups();
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(all.flatMap((g) => g.items))) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: 'ראשי', path: '/' },
              { name: 'שאלות ותשובות', path: '/faq' },
            ]),
          ),
        }}
      />
      <Header />
      <main id="main">
        <section aria-labelledby="faq-hub" className="bg-navy pb-14 pt-36 text-cream md:pb-20">
          <div className="shell max-w-3xl">
            <p className="eyebrow mb-4 text-accent-light">{brand.firmName}</p>
            <h1 id="faq-hub" className="text-4xl font-bold text-cream md:text-6xl">
              שאלות ותשובות
            </h1>
            <p className="mt-6 text-lg text-cream/85">
              תשובות כלליות וקצרות. למקרה שלכם אפשר לשוחח עם העוזר הדיגיטלי או עם עורכת הדין.
            </p>
          </div>
        </section>
        <div className="section bg-cream">
          <div className="shell max-w-3xl space-y-14">
            {all.map((g) => (
              <section key={g.id} aria-labelledby={`g-${g.id}`}>
                <h2 id={`g-${g.id}`} className="text-2xl text-navy md:text-3xl">
                  {g.title}
                </h2>
                <Accordion type="single" collapsible className="mt-4 border-t border-navy/10">
                  {g.items.map((item, i) => (
                    <AccordionItem key={item.question} value={`${g.id}-${i}`}>
                      <AccordionTrigger>{item.question}</AccordionTrigger>
                      <AccordionContent>{item.answer}</AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </section>
            ))}
            <p className="text-sm text-ink/75">
              {brand.chat.disclaimer} <Link href="/articles" className="text-accent underline">למדריכים המלאים</Link>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
