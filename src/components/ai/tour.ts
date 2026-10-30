import type { IntroFocus } from '@/lib/brand';

/**
 * Where the welcome video points while a line plays. Each focus lights up the matching parts of
 * the page (a glowing outline) and, on wide screens, scrolls the section into view. Elements are
 * found by selector, so no component needs to know about the tour; the chat's own controls carry
 * a `data-tour-target` attribute.
 */
const TARGETS: Record<IntroFocus, { selectors: string[]; scrollTo?: string }> = {
  about: { selectors: ['nav[aria-label="ניווט ראשי"] a[href="/#about"]', '#about'], scrollTo: '#about' },
  chat: { selectors: ['[data-tour-target="chat"]'] },
  voice: { selectors: ['[data-tour-target="voice"]'] },
  questions: { selectors: ['[data-tour-target="questions"]'] },
  articles: { selectors: ['nav[aria-label="ניווט ראשי"] a[href="/articles"]', '#articles'], scrollTo: '#articles' },
  faq: { selectors: ['nav[aria-label="ניווט ראשי"] a[href="/#faq"]', '#faq'], scrollTo: '#faq' },
  reviews: { selectors: ['nav[aria-label="ניווט ראשי"] a[href="/#reviews"]', '#reviews'], scrollTo: '#reviews' },
  contact: { selectors: ['header a[href^="tel:"]', 'header a[href^="https://wa.me"]'] },
};

const ATTR = 'data-tour-on';

export function clearTour(): void {
  document.querySelectorAll(`[${ATTR}]`).forEach((el) => el.removeAttribute(ATTR));
}

export function applyTour(focus: IntroFocus | undefined, options: { scroll: boolean; smooth: boolean }): void {
  clearTour();
  if (!focus) return;
  const target = TARGETS[focus];
  for (const selector of target.selectors) {
    document.querySelectorAll(selector).forEach((el) => el.setAttribute(ATTR, ''));
  }
  if (options.scroll && target.scrollTo) {
    const section = document.querySelector(target.scrollTo);
    if (section) {
      const top = section.getBoundingClientRect().top + window.scrollY - 88;
      window.scrollTo({ top, behavior: options.smooth ? 'smooth' : 'auto' });
    }
  }
}

let spotlightTimer: number | undefined;

/** Lights one element for a few seconds (the assistant pointing at something on the page). */
export function spotlight(el: Element, ms = 4000): void {
  window.clearTimeout(spotlightTimer);
  clearTour();
  el.setAttribute(ATTR, '');
  spotlightTimer = window.setTimeout(() => el.removeAttribute(ATTR), ms);
}
