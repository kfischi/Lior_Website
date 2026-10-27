/** Strips emails and long digit runs (phones, ID numbers) from a question before it is stored. */
export function sanitizeQuestion(question: string): string {
  return question
    .replace(/[\w.+-]+@[\w-]+\.[\w.]+/g, '')
    .replace(/\d[\d\s-]{4,}\d/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 200);
}
