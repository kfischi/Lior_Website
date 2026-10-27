import Link from 'next/link';
import { newestArticles } from '@/lib/articles';
import { ArticleCard } from './ArticleCard';
import { PressList } from './PressList';

/** Home page teaser for the guides hub. */
export function Articles() {
  const items = newestArticles(3);
  return (
    <section id="articles" aria-labelledby="articles-title" className="section bg-white">
      <div className="shell">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow mb-3">מדריכים</p>
            <h2 id="articles-title" className="text-4xl text-navy md:text-5xl">
              לדעת את הזכויות שלכם
            </h2>
          </div>
          <Link href="/articles" className="font-medium text-accent underline underline-offset-4">
            לכל המדריכים
          </Link>
        </div>
        <ul className="grid gap-6 md:grid-cols-3">
          {items.map((a) => (
            <li key={a.slug}>
              <ArticleCard article={a} />
            </li>
          ))}
        </ul>
        <PressList headingId="press-title" />
      </div>
    </section>
  );
}
