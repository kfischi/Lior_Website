import { brand as staticBrand } from '@/lib/brand';
import type { Brand } from '@/lib/sanity/settings';
import { articles as staticArticles, type Article } from '@/lib/articles';

/**
 * One plain-text rendering of the whole public site (practice pages, guides,
 * every FAQ). Feeds the chatbot's knowledge and /llms-full.txt, so what the
 * assistant says always matches what is published.
 */

function practiceAreaText(brand: Brand): string {
  return brand.practiceAreas
    .map((a) => {
      const p = a.page;
      return [
        `### ${a.title} (/practice-areas/${a.slug})`,
        a.description,
        ...p.intro,
        `במה המשרד מסייע: ${p.handles.join('; ')}.`,
        `מה כדאי לדעת בשלבים הראשונים: ${p.steps.join(' ')}`,
        ...p.faq.map((f) => `ש: ${f.question}\nת: ${f.answer}`),
      ].join('\n');
    })
    .join('\n\n');
}

function articleText(articles: Article[]): string {
  return articles
    .map((a) =>
      [
        `### ${a.title} (/articles/${a.slug})`,
        `בקצרה: ${a.tldr}`,
        ...a.sections.map((s) =>
          [s.heading, ...s.paragraphs, ...(s.bullets ?? []).map((b) => `- ${b}`)].join('\n'),
        ),
        ...a.faq.map((f) => `ש: ${f.question}\nת: ${f.answer}`),
      ].join('\n'),
    )
    .join('\n\n');
}

function lecturesText(brand: Brand): string {
  const l = brand.lectures;
  return [
    `### ${l.title} (/lectures)`,
    ...l.about,
    ...l.items.map((i) => `- ${i.title}: ${i.about} מתאים ל: ${i.audience}`),
  ].join('\n');
}

function additionalAreasText(brand: Brand): string {
  return brand.about.additionalAreas.map((a) => `### ${a.title}\n${a.text}`).join('\n\n');
}

/** Empty when there are no other areas, so no empty heading is sent. */
function additionalSection(heading: string, brand: Brand): string {
  const text = additionalAreasText(brand);
  return text ? `${heading}${text}\n\n` : '';
}

export function siteContentAsPrompt(articles: Article[] = staticArticles, brand: Brand = staticBrand): string {
  return `## תחומי העיסוק\n${practiceAreaText(brand)}\n\n${additionalSection('## תחומים נוספים\n', brand)}## הרצאות\nכשמבקשים הרצאה, הפנה לעמוד /lectures.\n${lecturesText(brand)}\n\n## מדריכים באתר\nכשהנושא רלוונטי, הפנה את המשתמש למדריך המתאים בכתיבת הנתיב (למשל /articles/hearing-before-dismissal).\n${articleText(articles)}`;
}

export function siteContentAsMarkdown(articles: Article[] = staticArticles, brand: Brand = staticBrand): string {
  return `${practiceAreaText(brand)}\n\n${additionalSection('## תחומים נוספים\n\n', brand)}## הרצאות\n\n${lecturesText(brand)}\n\n${articleText(articles)}`;
}
