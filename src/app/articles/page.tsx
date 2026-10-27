import type { Metadata } from 'next';
import Link from 'next/link';
import { brand } from '@/lib/brand';
import { articles } from '@/lib/articles';
import { breadcrumbJsonLd, buildMetadata } from '@/lib/seo';
import { siteUrl } from '@/lib/utils';
import { Header } from '@/components/sections/Header';
import { Footer } from '@/components/sections/Footer';
import { ArticleCard } from '@/components/sections/ArticleCard';

export const metadata: Metadata = buildMetadata({
  title: 'מדריכים ומאמרים משפטיים',
  description:
    'מדריכים ברורים בעברית על התעמרות ואפליה בעבודה, שימוע לפני פיטורים, הטרדה מינית וחקירה במשטרה. מידע כללי מעורכת דין בחריש.',
  path: '/articles',
});

export default function ArticlesPage() {
  const base = siteUrl();
  const collection = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'מדריכים ומאמרים משפטיים',
    url: `${base}/articles`,
    inLanguage: 'he-IL',
    isPartOf: { '@id': `${base}/#website` },
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: articles.map((a, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        url: `${base}/articles/${a.slug}`,
        name: a.title,
      })),
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collection) }} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: 'ראשי', path: '/' },
              { name: 'מדריכים', path: '/articles' },
            ]),
          ),
        }}
      />
      <Header />
      <main id="main">
        <section aria-labelledby="hub-title" className="bg-navy pb-16 pt-36 text-cream md:pb-20">
          <div className="shell max-w-4xl">
            <p className="eyebrow mb-4 text-accent-light">{brand.firmName}</p>
            <h1 id="hub-title" className="text-4xl font-bold text-cream md:text-6xl">
              מדריכים ומאמרים
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-cream/85">
              מידע כללי וברור על הזכויות שלכם בעבודה, בהטרדה מינית ובהליך הפלילי. כל מדריך נפתח בתשובה קצרה, ואחריה הסבר מסודר.
            </p>
          </div>
        </section>
        <section className="section bg-cream">
          <div className="shell">
            <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {articles.map((a) => (
                <li key={a.slug}>
                  <ArticleCard article={a} />
                </li>
              ))}
            </ul>
            <p className="mt-12 text-sm text-ink/75">
              {brand.chat.disclaimer} יש לכם שאלה אחרת? <Link href="/faq" className="text-accent underline">לכל השאלות והתשובות</Link>.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
