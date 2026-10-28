/** Types of the chat kit. Nothing here depends on the host project. */

export type ChatLink = { label: string; href: string };

/** One topic the assistant can answer. `audio` is an optional ready-made recording of the answer. */
export type KnowledgeEntry = {
  id: string;
  /** The question as a visitor would ask it. Also used for the quick-reply button text if `quickReply` is set. */
  question: string;
  /** Words and phrases that point to this topic. The more of them appear in the message, the better the match. */
  keywords: string[];
  answer: string;
  /** Path under /public of a recording of the answer (webm, mp3, ...). Without it the browser voice reads it. */
  audio?: string;
  /** Buttons shown under the answer. */
  links?: ChatLink[];
  /** Show this question as a quick-reply button. */
  quickReply?: boolean;
};

export type CaptionSegment = { start: number; text: string };

export type ChatKitConfig = {
  /** Name shown in the chat header and said in the welcome. */
  assistantName: string;
  /** Who the assistant works for, shown under the name. */
  firmName: string;
  /** Short line under the name, e.g. "available 24/7". */
  tagline: string;
  /** "he" | "en": the interface direction follows it. */
  locale: 'he' | 'en';
  welcome: {
    /** First message in the conversation. */
    message: string;
    /** Still image of the assistant, shown in the media window (public path). */
    poster?: string;
    /** Local video (webm/mp4), optional. Plays muted unless the visitor taps it. */
    video?: { src: string; type: string }[];
    /** Local recording of the welcome (webm/mp3), optional. */
    audio?: string;
    /** Captions shown in sync with the audio. Without them the whole welcome text is shown. */
    captions?: CaptionSegment[];
  };
  /** Open the chat by itself with the welcome after this many ms (0 = never). It never re-opens after a close. */
  autoOpenAfterMs: number;
  knowledge: KnowledgeEntry[];
  /** Said when nothing matches well enough. */
  fallback: { message: string; links?: ChatLink[] };
  /** If a message contains one of these, the answer is prefixed with `urgent.message`. */
  urgent?: { keywords: string[]; message: string; links?: ChatLink[] };
  /** Words that browser voices read badly -> how to spell them for the voice. Applied only to speech, never to the screen. */
  pronunciations: Record<string, string>;
  /** Called with a question nobody could answer, so the site owner can learn from it (POST it anywhere, or ignore). */
  onUnanswered?: (question: string) => void;
  /** Interface texts (so the same code can be reused in another language). */
  labels: {
    open: string;
    close: string;
    placeholder: string;
    send: string;
    mic: string;
    micStop: string;
    listen: string;
    stopListening: string;
    mute: string;
    unmute: string;
    transcript: string;
    typing: string;
    quickRepliesTitle: string;
    voiceUnsupported: string;
  };
};
