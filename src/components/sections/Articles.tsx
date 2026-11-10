import Link from 'next/link';
import { getBrand } from '@/lib/sanity/content';
import { newestArticles, type Article } from '@/lib/articles';
import { getSiteContent } from '@/lib/sanity/content';
import { ArticleCard } from './ArticleCard';
import { PressList } from './PressList';
import { HeroBackdrop } from '@/components/ui/HeroBackdrop';

/** Home page teaser for the guides hub. */
export async function Articles() {
  const brand = await getBrand();
  const { articles } = await getSiteContent();
  // One guide per practice area first, so every visitor finds something for their own case; then the newest.
  const all = newestArticles(100, articles);
  const items: Article[] = [];
  for (const area of brand.practiceAreas) {
    const first = all.find((a) => a.areaSlug === area.slug && !items.includes(a));
    if (first) items.push(first);
  }
  for (const a of all) {
    if (items.length >= 3) break;
    if (!items.includes(a)) items.push(a);
  }
  items.splice(3);
  return (
    <section id="articles" aria-labelledby="articles-title" className="section relative isolate overflow-hidden bg-white">
      <HeroBackdrop name="articles" tone="light" />
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
