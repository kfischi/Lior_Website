import { brand } from '@/lib/brand';
import { articles } from '@/lib/articles';

/**
 * One plain-text rendering of the whole public site (practice pages, guides,
 * every FAQ). Feeds the chatbot's knowledge and /llms-full.txt, so what the
 * assistant says always matches what is published.
 */

function practiceAreaText(): string {
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

function articleText(): string {
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

function additionalAreasText(): string {
  return brand.about.additionalAreas.map((a) => `### ${a.title}\n${a.text}`).join('\n\n');
}

export function siteContentAsPrompt(): string {
  return `## תחומי העיסוק\n${practiceAreaText()}\n\n## תחומים נוספים\n${additionalAreasText()}\n\n## מדריכים באתר\nכשהנושא רלוונטי, הפנה את המשתמש למדריך המתאים בכתיבת הנתיב (למשל /articles/hearing-before-dismissal).\n${articleText()}`;
}

export function siteContentAsMarkdown(): string {
  return `${practiceAreaText()}\n\n## תחומים נוספים\n\n${additionalAreasText()}\n\n${articleText()}`;
}
