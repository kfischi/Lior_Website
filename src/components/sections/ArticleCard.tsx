import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { brand } from '@/lib/brand';
import { formatHebrewDate, type Article } from '@/lib/articles';

/** Card linking to a guide; used on the home page, the hub and related lists. */
export function ArticleCard({ article, headingLevel: Heading = 'h3' }: { article: Article; headingLevel?: 'h2' | 'h3' }) {
  const area = brand.practiceAreas.find((a) => a.slug === article.areaSlug);
  return (
    <Link
      href={`/articles/${article.slug}`}
      className="group flex h-full flex-col rounded-2xl border border-navy/10 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-accent hover:shadow-lg"
    >
      {area && <span className="eyebrow mb-3">{area.title}</span>}
      <Heading className="font-heading text-xl font-semibold leading-snug text-navy">{article.title}</Heading>
      <p className="mt-3 line-clamp-3 flex-1 text-sm leading-relaxed text-ink/70">{article.tldr}</p>
      <div className="mt-5 flex items-center justify-between text-xs text-ink/75">
        <span>
          <time dateTime={article.updated}>{formatHebrewDate(article.updated)}</time> · {article.readingMinutes} דקות קריאה
        </span>
        <span className="flex items-center gap-1 font-medium text-accent">
          לקריאה
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" aria-hidden="true" />
        </span>
      </div>
    </Link>
  );
}
