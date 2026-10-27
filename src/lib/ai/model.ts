import 'server-only';
import { anthropic } from '@ai-sdk/anthropic';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import type { LanguageModel } from 'ai';

/**
 * Chooses the model behind the chat, from environment variables only.
 *
 *   CHAT_PROVIDER=anthropic | google   (optional; forces a provider)
 *   ANTHROPIC_API_KEY + CHAT_MODEL     (default model: claude-sonnet-5-5)
 *   GOOGLE_GENERATIVE_AI_API_KEY + GEMINI_MODEL   (default: gemini-2.5-flash)
 *
 * Without CHAT_PROVIDER, Anthropic is used when its key exists, otherwise
 * Gemini. With no key at all the chat answers from the knowledge base instead.
 */

export type ChatProvider = 'anthropic' | 'google';

const DEFAULT_CLAUDE = 'claude-sonnet-5-5';
const DEFAULT_GEMINI = 'gemini-2.5-flash';

export function resolveChatProvider(): ChatProvider | null {
  const hasAnthropic = Boolean(process.env.ANTHROPIC_API_KEY);
  const hasGoogle = Boolean(process.env.GOOGLE_GENERATIVE_AI_API_KEY);
  const forced = process.env.CHAT_PROVIDER?.trim().toLowerCase();

  if (forced === 'google') return hasGoogle ? 'google' : null;
  if (forced === 'anthropic') return hasAnthropic ? 'anthropic' : null;
  if (hasAnthropic) return 'anthropic';
  if (hasGoogle) return 'google';
  return null;
}

/** The configured model, or null when no provider key is set. */
export function getChatModel(): LanguageModel | null {
  switch (resolveChatProvider()) {
    case 'anthropic':
      return anthropic(process.env.CHAT_MODEL || DEFAULT_CLAUDE);
    case 'google': {
      // baseURL is only overridden in tests (a local stand-in for the API).
      const google = createGoogleGenerativeAI({
        baseURL: process.env.GOOGLE_GENERATIVE_AI_BASE_URL || undefined,
      });
      return google(process.env.GEMINI_MODEL || DEFAULT_GEMINI);
    }
    default:
      return null;
  }
}

/**
 * Provider options that keep replies quick. Gemini 2.5 Flash "thinks" before it
 * answers by default, which adds seconds; for short support-style answers a zero
 * thinking budget is much faster. Other models are left at their defaults.
 */
export function chatProviderOptions(): { google: { thinkingConfig: { thinkingBudget: number } } } | undefined {
  if (resolveChatProvider() !== 'google') return undefined;
  const model = process.env.GEMINI_MODEL || DEFAULT_GEMINI;
  return /2\.5-flash/.test(model) ? { google: { thinkingConfig: { thinkingBudget: 0 } } } : undefined;
}

/** Human-readable name of the configured model, for the admin status check. */
export function chatModelName(): string | null {
  switch (resolveChatProvider()) {
    case 'anthropic':
      return `Anthropic ${process.env.CHAT_MODEL || DEFAULT_CLAUDE}`;
    case 'google':
      return `Google ${process.env.GEMINI_MODEL || DEFAULT_GEMINI}`;
    default:
      return null;
  }
}
