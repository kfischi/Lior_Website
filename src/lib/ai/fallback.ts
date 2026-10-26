import { knowledge, type KnowledgeEntry } from '@/lib/knowledge';
import { brand } from '@/lib/brand';

/**
 * Keyword fallback used when no AI key is configured (or the model call fails
 * before streaming). It answers from the same knowledge base, so the chat is
 * never dead. It is deliberately modest: it matches topics, it doesn't reason.
 */

/** Strip niqqud and punctuation, collapse whitespace, lowercase. */
function normalize(input: string): string {
  return input
    .normalize('NFKD')
    .replace(/[֑-ׇ]/g, '') // Hebrew niqqud / cantillation
    .replace(/["'״׳`.,!?;:()\-–—]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

function score(entry: KnowledgeEntry, text: string): number {
  let total = 0;
  for (const keyword of entry.keywords) {
    const k = normalize(keyword);
    if (k && text.includes(k)) total += k.includes(' ') ? 3 : 2;
  }
  return total;
}

const GREETINGS = new Set(['שלום', 'היי', 'הי', 'הלו', 'אהלן', 'בוקר', 'ערב', 'צהריים', 'תודה']);

export function fallbackReply(question: string): string {
  const text = normalize(question);

  const words = text.split(' ');
  if (words.length <= 3 && GREETINGS.has(words[0])) {
    return 'שלום, שמחים שפניתם. אפשר לספר לי במה מדובר, או לשאול על תחומי העיסוק, על פגישת ייעוץ או על שעות הפעילות.';
  }

  let best: KnowledgeEntry | null = null;
  let bestScore = 0;
  for (const entry of knowledge) {
    const s = score(entry, text);
    if (s > bestScore) {
      best = entry;
      bestScore = s;
    }
  }

  if (!best) {
    return (
      'אני רוצה לוודא שאענה לכם נכון, ולכן כדאי שתדברו ישירות עם המשרד. ' +
      `אפשר להתקשר ל-${brand.phone} או לכתוב בוואטסאפ. ` +
      'ואם תרצו, ספרו לי בקצרה במה מדובר ואנסה לכוון אתכם.'
    );
  }

  return best.followUp ? `${best.answer}\n\n${best.followUp}` : best.answer;
}
