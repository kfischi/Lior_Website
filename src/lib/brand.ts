/**
 * =============================================================================
 *  WHITE-LABEL BRAND CONFIG  —  THE ONLY FILE YOU EDIT FOR A NEW CLIENT
 * =============================================================================
 *
 *  Every piece of client-specific data (name, contact, colors, fonts, content)
 *  is read from this object. To launch a new law firm:
 *    1. Edit the values below.
 *    2. Swap the Cloudinary image IDs.
 *    3. Update the chatbot system prompt (src/app/api/chat/route.ts metadata).
 *    4. Deploy.
 *
 *  Colors are injected as CSS variables in src/app/layout.tsx, so changing them
 *  here re-themes the entire site — no component edits required.
 *
 *  PALETTE: matched to the firm logo. Contrast checked (WCAG AA). Replace per
 *  client; keep `accent` readable on `cream` and `accentLight` on `navy`.
 * =============================================================================
 */

import introConfig from './avatar-intro.json';
import videoTranscripts from './video-transcripts.json';

export interface FaqItem {
  question: string;
  answer: string;
}

/** Content of the dedicated page /practice-areas/[slug]. General information only. */
export interface PracticeAreaPage {
  /** Short title tag text (the firm name is appended). */
  seoTitle: string;
  /** Meta description, about 120-160 characters. */
  seoDescription: string;
  /** Opening paragraphs. */
  intro: string[];
  /** What the office helps with. */
  handles: string[];
  /** General first steps. Educational, never advice on a specific case. */
  steps: string[];
  faq: FaqItem[];
}

export interface PracticeArea {
  /** Stable slug used for the route /practice-areas/[slug] and anchors. */
  slug: string;
  title: string;
  description: string;
  /** lucide-react icon name (see src/components/sections/PracticeAreas.tsx). */
  icon: string;
  page: PracticeAreaPage;
}

export interface Testimonial {
  name: string;
  /** Publication date at the source, ISO `YYYY-MM-DD`. The site lists newest first. */
  date: string;
  rating: number; // 0–5, fractions allowed (shown exactly as at the source)
  text: string;
}

/** An article by the attorney, or about her, published on an outside site. */
export interface PressArticle {
  title: string;
  /** Name of the publication, e.g. 'דבר ראשון'. */
  outlet: string;
  /** Publication date, ISO `YYYY-MM-DD`; leave out while it is not known (shown last, without a date). */
  date?: string;
  url: string;
  /** Optional one or two sentences quoted from the piece. */
  excerpt?: string;
}

/** One line of the intro video's script; `start` is in seconds from the start of the video. */
export interface IntroSegment {
  start: number;
  text: string;
  /** Lights up the matching item of the tour while this line plays. */
  focus?: IntroFocus;
}

/** What the intro video points at on the site while a line plays (see components/ai/tour.ts). */
export type IntroFocus = 'about' | 'chat' | 'voice' | 'questions' | 'articles' | 'faq' | 'reviews' | 'contact';

export interface IntroConfig {
  /** Path of the video in /public; empty switches the intro off. */
  src: string;
  poster: string;
  segments: IntroSegment[];
}

/** A client's letter shown as a scanned image among the reviews (no rating). */
export interface TestimonialLetter {
  name: string;
  /** Date of the letter, ISO `YYYY-MM-DD`. */
  date: string;
  /** Image in /public/images. */
  image: string;
  width: number;
  height: number;
  /** Text alternative for the scan: what the letter says, in words. */
  alt: string;
}

/** One spoken line of a client video, with its times in seconds. */
export interface VideoTranscriptLine {
  start: number;
  end: number;
  text: string;
}

/** A client video: a local file, or a YouTube video played only after a click. */
export type VideoReview = { label: string; landscape?: boolean } & (
  | {
      src: string;
      poster: string;
      /** What is said, line by line (see video-transcripts.json). Shown as captions and as a transcript. */
      transcript?: VideoTranscriptLine[];
      /** A short description under the video. Only text the attorney approved. */
      note?: string;
      youtubeId?: undefined;
    }
  | { youtubeId: string; poster?: string; src?: undefined; transcript?: undefined; note?: undefined }
);

/** The year she began practising (from her own "21 years" in 2026). The years-of-experience figure counts from it. */
const PRACTISING_SINCE = 2005;

export const brand = {
  // --- Identity ---
  firmName: 'משרד עורכת דין ליאור-קלואי ארז',
  firmNameShort: 'ליאור-קלואי ארז, עו״ד',
  tagline: 'ליווי משפטי ברגישות, בנחישות ובדיסקרטיות',
  attorneyName: 'עו״ד ליאור-קלואי ארז',
  /** Short legal-services description — used in meta + JSON-LD. */
  description:
    'משרד עורכת דין ליאור-קלואי ארז בחריש ובזום: משפט פלילי, נזיקין (רשלנות, אפליה, הטרדה מינית, לשון הרע) ומעמד אישי (צוואות וייפוי כוח מתמשך). ' +
    'בוגרת הפרקליטות הפלילית, ליווי אישי ודיסקרטי מהשיחה הראשונה.',
  /** Public website address. */
  website: 'https://www.liorerezadv.com',
  /**
   * Logo files (transparent WebP, in /public/images). `lockup` is the full
   * white mark for dark backgrounds; the icon comes in a light and a dark
   * version for the header over the hero and over the cream page.
   */
  logo: {
    lockup: '/images/logo-lockup-white.webp',
    lockupSize: { width: 588, height: 258 },
    iconLight: '/images/logo-icon-white.webp',
    iconDark: '/images/logo-icon-navy.webp',
    iconSize: { width: 159, height: 258 },
  },

  // --- Contact ---
  phone: '052-469-4158',
  /** International format, digits only — for tel: and WhatsApp links. */
  phoneE164: '972524694158',
  whatsapp: '972524694158',
  fax: '077-4702353',
  email: 'Lioraere@gmail.com',
  address: {
    street: 'רח׳ רימון 5',
    city: 'חריש',
    postalCode: '3786100',
    country: 'IL',
  },
  hours: 'בתיאום מראש, במשרד בחריש או בזום',
  /** Maps embed/link target. */
  mapUrl: 'https://maps.google.com/?q=%D7%A8%D7%99%D7%9E%D7%95%D7%9F+5+%D7%97%D7%A8%D7%99%D7%A9',

  // --- Social ---
  social: {
    facebook: '',
    linkedin: '',
    instagram: '',
  },

  // --- Colors: matched to the firm logo (dusty steel blue + silver) ---
  colors: {
    navy: '#1A3742', // deep teal-slate — primary, dark sections
    cream: '#F4F6F6', // cool off-white — page background
    accent: '#3C7186', // steel blue from the logo — buttons, links on light
    accentLight: '#8DB5C4', // light steel blue — accent on dark sections
    ink: '#17242B', // blue-black body text
  },

  // --- Fonts (next/font keys; see src/app/layout.tsx) ---
  fonts: {
    headingName: 'Rubik',
    bodyName: 'Heebo',
  },

  // --- Hero ---
  hero: {
    /** The line above the headline. */
    eyebrow: 'משרד עו״ד ליאור-קלואי ארז',
    title: 'ליווי משפטי ברגישות ובנחישות',
    subtitle:
      'משפט פלילי, נזיקין ומעמד אישי. ליווי אישי ודיסקרטי מהשיחה הראשונה, ' +
      'כדי שתדעו מה האפשרויות שלכם ותוכלו לפעול בביטחון.',
    primaryCta: 'לקביעת ייעוץ',
    secondaryCta: 'וואטסאפ',
    /**
     * Hero background video. Provide EITHER:
     *  - videoUrl: a direct absolute URL to an .mp4/.webm (e.g. Cloudinary
     *    delivery URL), or
     *  - leave videoUrl empty to fall back to the poster image only.
     * posterId is a Cloudinary public ID shown before/while the video loads and
     * whenever motion is reduced or the video is unavailable.
     */
    videoUrl: 'https://res.cloudinary.com/dptyfvwyo/video/upload/v1793048459/HERO_qpewzw.mp4',
    // First frame of the video, served by Cloudinary as a JPG (absolute URLs
    // pass straight through the custom image loader).
    posterId:
      'https://res.cloudinary.com/dptyfvwyo/video/upload/so_0,f_jpg,q_auto,w_1920/v1793048459/HERO_qpewzw.jpg',
    /** Fallback still background (Cloudinary public ID). */
    imageId: 'lawyer-os/hero-placeholder',
    /**
     * Framing of the hero media. The picture is enlarged by `zoom` around
     * `origin`, which trims the edges furthest from it — used to crop out the
     * AI-generator watermark in the bottom corners. 1 = no crop.
     */
    mediaFrame: { zoom: 1.16, origin: '50% 0%' },
    /**
     * Seconds cut from the end of the loop. The clip restarts this early to hide
     * a glitch in its last frames (the duplicated figure). 0 = play to the end.
     */
    videoTrimEnd: 2,
    /**
     * Stretches of the clip to skip, in seconds from its start: [{ from: 7.5, to: 11 }] jumps from 7.5 s to 11 s.
     * The close-up on the face is at 7.43 to 9.53 s in a re-encoded copy; the cut is wider (7.2 to 9.9 s) so it also covers any timing difference in the original file.
     */
    videoCuts: [{ from: 7.2, to: 9.9 }] as { from: number; to: number }[],
  },

  // --- AI chatbot ---
  chat: {
    /** Shown in the chat header and used by the model as its name. */
    assistantName: 'העוזרת של ליאור',
    /** Round avatar in the chat (a local /public path or a Cloudinary ID). */
    avatar: '/images/lior-avatar.webp',
    greeting:
      'שלום, אני העוזרת של ליאור. אפשר לספר לי במה מדובר, ואכוון אתכם ' +
      'לתחום הנכון, אענה על שאלות כלליות ואעזור לקבוע פגישת ייעוץ.',
    /** Quick-start suggestions shown as chips. */
    suggestedPrompts: [
      'נפגעתי בעבודה, מה אפשר לעשות?',
      'הוזמנתי לחקירה, מה עושים?',
      'קיבלתי זימון לשימוע',
      'הטרדה מינית: מה האפשרויות?',
      'כמה עולה ייעוץ ראשוני?',
      'איך קובעים פגישה?',
      'אני רוצה לדבר עם ליאור',
      'לא בטוח לאיזה תחום זה שייך',
    ],
    disclaimer: 'המידע כללי ואינו מהווה ייעוץ משפטי.',
    /**
     * Welcome video in the chat: the virtual assistant introduces herself and the site. It starts
     * two seconds after the chat opens, once per browser tab. Leave `src` empty to switch it off.
     * It lives in avatar-intro.json, which `npm run avatar` writes: the video path, the poster and
     * the script lines with their start times (captions, transcript and site highlights).
     * See docs/avatar-script.md and .claude/skills/talking-avatar.
     */
    intro: introConfig as IntroConfig,
    /**
     * What the chat opens with, instead of the video: a still photo of the attorney while the welcome is
     * read aloud (the audio track of the intro), with live captions, a transcript and the site highlights.
     * Leave `audio` empty to switch it off. The video pipeline stays in the repo (`intro` above).
     */
    welcome: {
      photo: '/images/lior-about.webp',
      audio: '/audio/intro.mp3',
      segments: (introConfig as IntroConfig).segments,
    },
  },

  // --- Trust strip (E-E-A-T) ---
  // Shown only when it has items. Add verified numbers only (years of
  // experience, cases, etc.) — never placeholders.
  trustStats: [{ value: String(new Date().getFullYear() - PRACTISING_SINCE), label: 'שנות ניסיון' }] as {
    value: string;
    label: string;
  }[],

  // --- About ---
  about: {
    heading: 'אודות המשרד',
    body:
      'עו״ד ליאור-קלואי ארז מנהלת משרד המתמחה בהגנה על זכויות אדם בשלושה תחומים: משפט פלילי, נזיקין ומעמד אישי. ' +
      'אלה עניינים שבהם אדם נמצא לא פעם בנקודה קשה ורגישה בחייו, ולכן הדגש במשרד הוא על הקשבה, ' +
      'דיסקרטיות והסבר ברור של האפשרויות, כך שתוכלו לקבל החלטות בביטחון.',
    /** Pull quote, taken from the approach described in `body`. */
    quote: 'הקשבה, דיסקרטיות והסבר ברור של האפשרויות, כדי שתוכלו לקבל החלטות בביטחון.',
    credentials: [
      'עורכת דין, חברה בלשכת עורכי הדין בישראל',
      'בוגרת הפרקליטות הפלילית בתל אביב',
      'תובעת במשרד הכלכלה לשעבר',
      'התמחות בהגנה על זכויות אדם',
    ],
    /** Certificates shown under the credentials (images in /public/images). */
    certificates: [
      {
        title: 'השתלמות: החקירה הפלילית בראי הסנגור',
        issuer: 'קבוצת פרקטיקל (Practical Law)',
        date: 'יוני 2024',
        image: '/images/cert-practical-law-2024.webp',
        width: 900,
        height: 1308,
      },
    ] as { title: string; issuer: string; date: string; image: string; width: number; height: number }[],
    /** Cloudinary public ID for the attorney portrait. Local /public path or Cloudinary ID. Leave empty for a monogram panel. */
    portraitId: '/images/lior-about.webp',
    /** More about the attorney: short paragraphs shown after the main text. Only approved text; leave empty until then. */
    more: [
      'עו״ד ליאור-קלואי ארז היא בוגרת הפרקליטות הפלילית בתל אביב ותובעת במשרד הכלכלה לשעבר. ' +
        'את הניסיון הזה היא מביאה גם לייצוג בנזיקין, כולל רשלנות רפואית, ובענייני צוואות וייפוי כוח מתמשך.',
      'המשרד בחריש, ואפשר לקיים פגישות גם בזום.',
    ] as string[],
    practisingSince: PRACTISING_SINCE,
    /** Other areas she works in, in her words (the three main areas have their own pages above). */
    additionalAreas: [
    ] as {
      title: string;
      text: string;
      /** Short label for the chat's intake chips; empty = already covered by the main areas. */
      topic: string;
    }[],
    /** Photos shown in a row under the text (images in /public/images). Empty caption = no caption. */
    gallery: [
      {
        src: '/images/lior-lecture.webp',
        width: 900,
        height: 1193,
        alt: 'עו״ד ליאור-קלואי ארז מדברת עם מיקרופון ליד דוכן, באולם עם דגל ישראל',
        caption: 'על הבמה',
      },
      {
        src: '/images/lior-portrait-2.webp',
        width: 800,
        height: 1223,
        alt: 'דיוקן של עו״ד ליאור-קלואי ארז בגלימה שחורה',
        caption: '',
      },
    ] as { src: string; width: number; height: number; alt: string; caption: string }[],
  },

  // --- Scrolling band under the hero (practice areas are added automatically) ---
  marquee: ['רגישות', 'נחישות', 'דיסקרטיות'],

  // --- How it works ---
  process: {
    eyebrow: 'איך זה עובד',
    heading: 'שלושה צעדים פשוטים',
    steps: [
      {
        title: 'שיחה קצרה',
        text: 'מספרים לנו במה מדובר, בצ׳אט, בטלפון או בוואטסאפ. אין צורך לפרט את האירוע.',
      },
      {
        title: 'פגישת ייעוץ',
        text: 'מבינים את התמונה המלאה, והאפשרויות והסיכונים מוסברים בפשטות.',
      },
      {
        title: 'מחליטים ופועלים',
        text: 'בונים יחד את הצעד הבא, ועורכת הדין מלווה אתכם לאורך הדרך.',
      },
    ],
  },

  // --- Why us ---
  whyUsIntro: 'ארבעה עקרונות שמלווים כל פנייה, מהשיחה הראשונה ועד סיום הטיפול.',
  whyUs: [
    {
      title: 'יחס אישי',
      description: 'ליווי צמוד של עורכת הדין עצמה, מהשיחה הראשונה ועד סיום הטיפול.',
      icon: 'HeartHandshake',
    },
    {
      title: 'ניסיון מהצד השני של השולחן',
      description: 'בוגרת הפרקליטות הפלילית בתל אביב ותובעת לשעבר במשרד הכלכלה, עם ניסיון של שנים רבות.',
      icon: 'Award',
    },
    {
      title: 'רגישות ודיסקרטיות',
      description: 'כל פנייה נשארת חסויה, ומטופלת בזהירות ובכבוד.',
      icon: 'ShieldCheck',
    },
    {
      title: 'שקיפות מלאה',
      description: 'הסבר ברור על האפשרויות, הסיכונים והעלויות מראש.',
      icon: 'Eye',
    },
  ],

  // --- Practice areas ---
  // `page` feeds /practice-areas/[slug]. General information only: no advice on
  // a specific case, no promises, no results. Needs the attorney's approval.
  practiceAreas: [
    {
      slug: 'criminal-law',
      title: 'משפט פלילי',
      description:
        'ייצוג וליווי בהליכים פליליים, משלב החקירה ועד סיום ההליך, וליווי נפגעות ונפגעי עבירה בהליך הפלילי לפי חוק זכויות נפגעי עבירה.',
      icon: 'Gavel',
      page: {
        seoTitle: 'עורכת דין פלילי בחריש: חקירה, מעצר וייצוג',
        seoDescription:
          'הוזמנתם לחקירה, נפתח הליך פלילי, או שנפגעתם מעבירה? מה חשוב לדעת על הזכויות ועל שלבי ההליך, ולמה כדאי להתייעץ מוקדם. עו״ד ליאור-קלואי ארז, חריש.',
        intro: [
          'הזמנה לחקירה או הליך פלילי הם מצב מלחיץ, והצעדים הראשונים חשובים. מידע ברור על הזכויות ועל שלבי ההליך עוזר לקבל החלטות ברוגע.',
          'הליך פלילי כולל בדרך כלל כמה שלבים: חקירה, לעיתים מעצר, החלטה אם להגיש כתב אישום, ניהול ההליך בבית המשפט, וגזר דין במקרה של הרשעה. בכל שלב יש החלטות שמשפיעות על ההמשך.',
          'גם מי שנפגע מעבירה נמצא בהליך פלילי, ולא תמיד יודע מה מגיע לו. חוק זכויות נפגעי עבירה מעניק לנפגעים זכויות, כמו קבלת מידע על מהלך ההליך והשמעת קולם. ליווי משפטי עוזר להבין את ההליך ואת הזכויות, ולהתכונן לכל שלב בו, כולל מסירת עדות.',
        ],
        handles: [
          'ליווי לפני חקירה ובמהלכה',
          'ייצוג בהליכי מעצר',
          'ייצוג בבית המשפט, בשלבי ההליך השונים',
          'בחינת האפשרויות והסבר ברור של הסיכונים בכל שלב',
          'ליווי נפגעות ונפגעי עבירה בהליך הפלילי, לפי חוק זכויות נפגעי עבירה',
          'הסבר על הזכויות במהלך ההליך, והכנה למסירת עדות ולהצהרת נפגע',
        ],
        steps: [
          'לזכור שיש לכם זכות להיוועץ בעורך דין לפני חקירה.',
          'לפני שמוסרים גרסה או חותמים על הודעה, להבין מה ההשלכות.',
          'לא למחוק הודעות או חומרים הקשורים לעניין.',
          'לשמור את כל המסמכים שקיבלתם, כמו הזמנה לחקירה או כתב אישום.',
          'מי שנפגע מעבירה: לשמור את מספר התיק ואת ההודעות שהגיעו מהמשטרה או מהתביעה.',
          'לא לתאר את העובדות בהודעות באתר או בצ׳אט. את זה עושים בשיחה ישירה.',
        ],
        faq: [
          {
            question: 'חייבים להגיע לחקירה בעקבות הזמנה?',
            answer:
              'זה תלוי בנסיבות ובסוג ההזמנה, ולכן כדאי להתייעץ לפני שמגיעים או מחליטים לא להגיע.',
          },
          {
            question: 'מהי זכות השתיקה?',
            answer:
              'לחשוד יש זכות שלא להפליל את עצמו. איך ומתי כדאי להשתמש בה תלוי בנסיבות, ולכן מומלץ להתייעץ לפני החקירה.',
          },
          {
            question: 'מתי כדאי לפנות לעורכת דין?',
            answer:
              'הכי טוב לפני החקירה, כי מה שנאמר בה משפיע על המשך ההליך. אבל גם בשלבים מאוחרים יותר אפשר לברר מה האפשרויות.',
          },
          {
            question: 'מה הזכויות של מי שנפגע מעבירה?',
            answer:
              'חוק זכויות נפגעי עבירה מעניק לנפגעים זכויות, כמו קבלת מידע על מהלך ההליך והשמעת הצהרה לפני גזר הדין. הזכויות המדויקות תלויות בסוג העבירה ובשלב ההליך, ואפשר להתייעץ כדי להבין אותן.',
          },
          {
            question: 'אפשר לקבל ליווי גם כשאני העד או הנפגע ולא החשוד?',
            answer:
              'כן. ליווי משפטי מתאים גם לנפגעות ולנפגעי עבירה. הוא עוזר להבין את ההליך, להתכונן למסירת עדות ולדעת מה אפשר לבקש.',
          },
        ],
      },
    },
    {
      slug: 'torts',
      title: 'נזיקין',
      description:
        'רשלנות, אפליה והתעמרות בעבודה, הטרדה מינית, לשון הרע ותביעות בגין חיסוני פייזר.',
      icon: 'Scale',
      page: {
        seoTitle: 'עורכת דין נזיקין בחריש: רשלנות ולשון הרע',
        seoDescription:
          'נפגעתם ברשלנות, באפליה או בהתעמרות בעבודה, בהטרדה מינית או בפרסום מזיק? מה האפשרויות ולמה כדאי להתייעץ. עו״ד ליאור-קלואי ארז, חריש.',
        intro: [
          'נזיקין הוא התחום שבו אדם שנפגע בגופו, בנפשו, בכבודו או ברכושו בגלל מעשה או מחדל של אחר בוחן אם יש מקום לתבוע פיצוי. המשרד מלווה בכמה סוגים של עניינים כאלה, ברגישות ובדיסקרטיות.',
          'רשלנות: כשמי שחב חובת זהירות, כמו גורם רפואי, לא פעל כפי שהיה צפוי ממנו והדבר גרם נזק, אפשר לבחון תביעה. ברשלנות רפואית נדרשת בדרך כלל חוות דעת רפואית.',
          'אפליה והתעמרות בעבודה: אפליה היא יחס פוגעני או לא שוויוני בשל מאפיין אישי, כמו מין, גיל, הריון, הורות, מוצא, דת, נטייה מינית או מוגבלות. התעמרות היא התנהגות חוזרת ומשפילה או מפחידה. שתיהן פוגעות בשכר, בקידום ובתחושת הביטחון.',
          'הטרדה מינית: הטרדה מינית מוסדרת בישראל בחוק למניעת הטרדה מינית, שחל במקום העבודה ובהקשרים נוספים ומטיל חובות על מעסיקים. הפנייה לעזרה היא צעד משמעותי, ואין צורך לתאר את האירוע בפנייה הראשונה.',
          'לשון הרע: פרסום שעלול לפגוע בשמו הטוב של אדם עשוי להיחשב לשון הרע לפי חוק איסור לשון הרע. אפשר לבחון תביעה, וגם הגנה למי שמואשם בכך.',
          'תביעות בגין חיסוני פייזר: מי שחושב שנפגע בעקבות חיסון, ובהם חיסוני פייזר, יכול להתייעץ על האפשרות לתבוע. קיומו של קשר בין החיסון לנזק נבדק לפי חומר רפואי וחוות דעת מקצועיות, ואי אפשר לדעת מראש מה תהיה התוצאה.',
        ],
        handles: [
          'בירור המצב והסבר ברור על האפשרויות העומדות בפניכם',
          'בחינת תביעה בגין רשלנות, כולל רשלנות רפואית',
          'ליווי עובדות ועובדים באפליה והתעמרות: תלונה למעסיק, משא ומתן וייצוג בהליכים',
          'ליווי בעניינים של הטרדה מינית, בשיחה דיסקרטית ובהליכים כשבוחרים בהם',
          'תביעות והגנה בעניין לשון הרע',
          'בחינת תביעות בגין חיסוני פייזר, לפי החומר הרפואי',
        ],
        steps: [
          'לתעד: לרשום תאריכים, מה נאמר או נעשה ומי נכח, ולשמור הודעות, מיילים, מסמכים רפואיים וצילומי מסך.',
          'לא למחוק כלום, וגם להימנע מהעתקת מסמכים סודיים של המעסיק לפני שהתייעצתם.',
          'אם אתם בסכנה מיידית, להתקשר למשטרה בטלפון 100.',
          'להתייעץ לפני שמגישים תלונה, חותמים על מסמך או מסכימים להצעה, כדי להבין את ההשלכות.',
          'אין חובה להחליט מיד. אפשר לקבל מידע ולהתלבט.',
          'לא לחכות זמן רב, כי יש מועדים להגשת תביעות.',
        ],
        faq: [
          {
            question: 'מה ההבדל בין אפליה להתעמרות?',
            answer:
              'אפליה היא יחס שונה ופוגעני בשל מאפיין אישי של העובד, כמו מין, גיל או הריון. התעמרות היא התנהגות חוזרת ופוגענית, כמו השפלה או הטלת משימות מיותרות. לפעמים השתיים מופיעות יחד.',
          },
          {
            question: 'מה כדאי לתעד?',
            answer:
              'תאריכים, מה נאמר או נעשה, מי נכח והודעות כתובות. תיעוד שוטף ומדויק עוזר להבין את התמונה כבר בשלב מוקדם.',
          },
          {
            question: 'אפשר לפנות לפני שהתפטרתי או פוטרתי?',
            answer:
              'כן, ואף מומלץ. התייעצות מוקדמת עוזרת להחליט איך לפעול לפני שמקבלים החלטות שקשה לחזור מהן, כמו התפטרות או חתימה על מסמך.',
          },
          {
            question: 'צריך לספר את כל הפרטים כבר בפנייה הראשונה בהטרדה מינית?',
            answer:
              'לא. אפשר להתחיל בשיחה כללית, ולמסור פרטים בשיחה ישירה ודיסקרטית כשתרגישו מוכנים.',
          },
          {
            question: 'האם הפנייה חסויה?',
            answer:
              'עורכת דין חבה בחובת סודיות כלפי לקוחותיה. ובכל זאת מומלץ לא לפרט את האירוע בהודעות באתר או בצ׳אט, ולהשאיר זאת לשיחה ישירה.',
          },
          {
            question: 'אפשר לפעול גם אם האירוע היה לפני זמן?',
            answer:
              'ייתכן, וזה תלוי בנסיבות ובמועדים החלים על כל הליך. כדאי להתייעץ בהקדם כדי לברר.',
          },
          {
            question: 'מהו לשון הרע?',
            answer:
              'פרסום שעלול להשפיל אדם, לבזות אותו או לפגוע במשרתו או בפרנסתו הוא לשון הרע לפי החוק. כל מקרה נבחן לגופו, וגם אמירה נכונה לא תמיד פטורה. כדאי להתייעץ לפני שמגיבים או מוחקים.',
          },
          {
            question: 'אפשר לתבוע בעקבות פגיעה מחיסון?',
            answer:
              'אפשר להתייעץ ולבדוק. השאלה אם יש קשר בין החיסון לנזק נבדקת לפי חומר רפואי וחוות דעת מקצועיות, ואין דרך לדעת מראש מה תהיה התוצאה. כדאי לשמור את כל המסמכים הרפואיים.',
          },
          {
            question: 'תוך כמה זמן צריך להגיש תביעת נזיקין?',
            answer:
              'יש מועדי התיישנות, והם משתנים לפי סוג העניין. לכן כדאי לא לחכות ולברר בהקדם.',
          },
        ],
      },
    },
    {
      slug: 'personal-status',
      title: 'מעמד אישי',
      description: 'עריכת צוואות, ייפוי כוח מתמשך והצהרה על נעדר.',
      icon: 'Users',
      page: {
        seoTitle: 'צוואות וייפוי כוח מתמשך בחריש',
        seoDescription:
          'איך עורכים צוואה, מה זה ייפוי כוח מתמשך ומה עושים כשאדם נעדר. מידע ברור והסבר על התהליך. עו״ד ליאור-קלואי ארז, חריש.',
        intro: [
          'תכנון והסדרת ענייניו של אדם ושל משפחתו הם צעד אחראי: מה יקרה לרכוש, מי יקבל החלטות כשהאדם לא יוכל להחליט בעצמו, ומה עושים כשאדם נעלם. המשרד מלווה בשלושה עניינים כאלה.',
          'עריכת צוואה: צוואה קובעת איך יתחלק הרכוש אחרי מותו של אדם. כדי שתהיה תקפה יש דרישות צורה, ולכן עריכתה בליווי עורכת דין מונעת טעויות ומחלוקות בהמשך.',
          'ייפוי כוח מתמשך: מסמך שמאפשר לקבוע מראש מי יקבל החלטות בשם האדם אם יאבד את היכולת לעשות זאת בעצמו. כך נמנעים בדרך כלל מהליכי אפוטרופסות. ייפוי כוח מתמשך נערך בליווי עורך דין ונרשם אצל האפוטרופוס הכללי.',
          'הצהרה על נעדר: כשאדם נעלם ולא ידוע היכן הוא, משפחה צריכה לעיתים הליך משפטי כדי להסדיר את ענייניו. אפשר להבין בשיחה איך מתקדמים ומה צריך להכין.',
          'המשרד אינו עוסק בנישואין ובגירושין.',
        ],
        handles: [
          'שיחה שבה מבררים מה רוצים להסדיר, ומה אפשרי',
          'ניסוח ועריכה של צוואה, כולל חתימה כנדרש',
          'ליווי בעריכת ייפוי כוח מתמשך',
          'ליווי בהליך של הצהרה על נעדר',
        ],
        steps: [
          'לחשוב מה חשוב לכם להסדיר ומי האנשים שרוצים לשתף.',
          'לאסוף מידע על הנכסים ועל בני המשפחה הרלוונטיים.',
          'לא להסתפק בנוסח מוכן מהאינטרנט: טעות קטנה בצוואה עלולה לפסול אותה.',
          'בענייני נעדר: לשמור את כל המסמכים וההודעות שקשורים להיעלמות ולמצוא אותם לפגישה.',
        ],
        faq: [
          {
            question: 'מה ההבדל בין צוואה לייפוי כוח מתמשך?',
            answer:
              'צוואה חלה אחרי מות האדם ונוגעת לרכושו. ייפוי כוח מתמשך חל בחיים, כשאדם לא יכול עוד להחליט בעצמו, ונוגע להחלטות בענייניו.',
          },
          {
            question: 'אפשר לשנות צוואה?',
            answer:
              'בדרך כלל כן, כל עוד האדם כשיר לעשות זאת. כדאי לעשות זאת בליווי כדי שהשינוי יהיה תקף וברור.',
          },
          {
            question: 'מתי כדאי לערוך ייפוי כוח מתמשך?',
            answer:
              'כשהאדם עדיין כשיר. אי אפשר לערוך אותו אחרי שהיכולת אבדה, ולכן הזמן הנכון הוא מוקדם.',
          },
          {
            question: 'מה זו הצהרה על נעדר?',
            answer:
              'הליך משפטי שמסדיר את ענייניו של אדם שנעלם. הפרטים תלויים בנסיבות, ואפשר להבין בשיחה איך מתקדמים.',
          },
        ],
      },
    },
  ] satisfies PracticeArea[],

  // --- Testimonials ---
  // Real client reviews only, quoted word for word (spacing normalised), with the
  // reviewer's first name or initial and city as shown at the source. The section
  // stays hidden while this is empty.
  //
  // Keep the list in any order: the page sorts by `date`, newest first.
  //
  // Selection rule: nothing that claims an outcome ("won", "got what I wanted"),
  // describes the client's case or health, or uses the word "specialist", and no
  // quotes with typos. Excluded reviews are listed in docs/seo/backlog.md.
  // Do not add an aggregate rating or review markup: Google treats self-published
  // ratings as ineligible, and the Bar's rules on advertising apply.
  testimonialsSource: 'ביקורות שפורסמו באתר LawReviews',
  testimonials: [
    {
      name: 'ד.',
      date: '2024-02-27',
      rating: 5,
      text: 'עו"ד ליאור ארז, אשה מקסימה, אנושית הוגנת, ומאוד מקצועית, תמיד נמצאת גם בשעות לא שגרתיות בזמן דחיפות ומצוקה, מוכיחה בעשיה אכפתית ועקבית תמיד מחוברת לרעיון קידום והגנה על אזרחים ודאגה על זכויותיהם.',
    },
    {
      name: 'חנה, צפת',
      date: '2024-01-23',
      rating: 5,
      text: 'מעבר להיותה עורכת דין שלוחמת צדק ומוציאה את האמת לאור. אשה ערכית. אנושית. ואמיתית!!!',
    },
    {
      name: 'מ.',
      date: '2024-01-23',
      rating: 5,
      text: 'עורכת דין מאוד יסודית, לא מוותרת עד השגת התוצאות הרצויות והכל במאור פנים ואיכפתיות.',
    },
    {
      name: 'ט.',
      date: '2024-01-23',
      rating: 5,
      text: 'ממליצה על עו"ד ליאור ארז! עו"ד איכפתית, מקצועית, חריפה וזמינה. היא תהיה שם בשבילך לכל שאלה ותמצא דרך יצירתית לפתרון המיטבי עבורך.',
    },
    {
      name: 'קורין, טירת כרמל',
      date: '2024-01-22',
      rating: 5,
      text: 'עו"ד עניינית עושה את עבודתה כראוי ממליצה עליה בחום',
    },
    {
      name: 'הילה ק., מודיעין',
      date: '2024-01-21',
      rating: 5,
      text: 'קיבלתי מעורכת הדין ליאור ארז שירות ראוי לציון, מקצועיות, רצינות, עניינית מאוד, עזרה לי בנושא הרשויות. היחס של ליאור יוצא מגדר הרגיל ועשתה כל שביכולתה להשביע את רצוני.',
    },
    {
      name: 'שולי, רחובות',
      date: '2024-01-21',
      rating: 5,
      text: 'ליאור עו"ד מוכשרת ומיומנת, הוכיחה מקצועיות, חדות מחשבה וחשיבה מחוץ לקופסא. קיבלתי יחס אישי ואדיב, שירות איכותי ובזכות ליאור תהליך המשפט הפך לפשוט. ממליצה בחום!!',
    },
    {
      name: 'אלה, אשדוד',
      date: '2024-01-18',
      rating: 5,
      text: 'עורכת דין מצוינת, נותנת ייעוץ וייצוג מעולה. תמיד זמינה וקשובה. בקיאה בדיני החוקים ויודעת לתת את המקסימום לכל מקרה ולקוח. ממליצה מאוד.',
    },
    {
      name: 'גיא, חיפה',
      date: '2024-01-16',
      rating: 4.6,
      text: 'ליאור קלואי ארז היא לוחמת צדק, בעידן של ימינו כל אחד יכול למצוא את עצמו במלחמה על זכויות יסוד. ליאור תעמוד לצדכם ותקרע לצד השני את הצורה :)',
    },
  ] satisfies Testimonial[],

  // Letters from clients, shown as scans in the reviews list (sorted with the reviews by date).
  // Publish only with the writer's permission.
  testimonialLetters: [
    {
      name: 'ליאה',
      date: '2016-04-03',
      image: '/images/letter-2016.webp',
      width: 1400,
      height: 778,
      alt: 'מכתב תודה בכתב יד מלקוחה בשם ליאה, מתאריך 3.4.2016. היא כותבת שלפני הטיפול חייה היו סערה, ושמהיום הראשון הרגישה נחת, שלווה ותקווה; שהעורכת הייתה שם בשבילה בכל שעה, האזינה בקשב מלא ונתנה לה שקט נפשי.',
    },
  ] as TestimonialLetter[],

  // --- Video reviews ---
  // Local file: put it in /public/videos and add `captions` (.vtt path) to show subtitles.
  // YouTube: { youtubeId: 'dQw4w9WgXcQ', label: '...', landscape: true } (the 11 characters
  // after `v=` in the link, or after `youtu.be/` / `shorts/`). `landscape: true` for wide
  // videos; leave it off for Shorts and vertical videos. Nothing from YouTube loads until
  // a visitor presses play.
  videoReviews: [
    { src: '/videos/review-1.mp4', poster: '/videos/review-1.webp', label: 'ביקורת וידאו מלקוח' },
    { src: '/videos/review-2.mp4', poster: '/videos/review-2.webp', label: 'ביקורת וידאו מלקוח' },
    { src: '/videos/review-3.mp4', poster: '/videos/review-3.webp', label: 'ביקורת וידאו מלקוח' },
    {
      src: '/videos/review-4.mp4',
      poster: '/videos/review-4.webp',
      label: 'ביקורת וידאו מלקוחה',
      // The attorney's own description, without the court, the client's background or what the other side was accused of.
      note: 'מפי עו״ד ליאור: תיק פלילי מורכב שנמשך כארבע שנים, שבסופו זוכו הלקוחה ובן זוגה מעבירות חמורות, והעונש בעבירה נוספת הופחת.',
    },
    { src: '/videos/review-5.mp4', poster: '/videos/review-5.webp', label: 'ביקורת וידאו מלקוחה', landscape: true },
    { youtubeId: 'WgO6rikPJDQ', label: 'ביקורת וידאו מלקוח', landscape: true },
    { youtubeId: 'y84XQuiUilE', label: 'ביקורת וידאו מלקוח' },
    { youtubeId: '9dQtAxuUVqw', label: 'ביקורת וידאו מלקוח' },
    { youtubeId: 'lMKBqDUAPoY', label: 'ביקורת וידאו מלקוח' },
  ].map((v) => {
    const transcript = 'src' in v && v.src ? (videoTranscripts as Record<string, VideoTranscriptLine[]>)[v.src] : undefined;
    return transcript ? { ...v, transcript } : v;
  }) as VideoReview[],

  // --- In the press: pieces published elsewhere (shown under the guides, newest first) ---
  press: [
    {
      title: 'כתבה מאת עו״ד ליאור-קלואי ארז',
      outlet: 'דבר ראשון',
      url: 'https://www.davar1.co.il/218421/',
    },
  ] as PressArticle[],

  // --- FAQ (also rendered as FAQPage JSON-LD) ---
  faq: [
    {
      question: 'כמה עולה פגישת ייעוץ ראשונית?',
      answer:
        'פגישת הייעוץ הראשונה נועדה להבין את עניינכם ולהציג את האפשרויות. ' +
        'עלות הפגישה תימסר מראש ובשקיפות מלאה בעת קביעת התור.',
    },
    {
      question: 'האם הפנייה למשרד חסויה?',
      answer:
        'כן. עורכת דין חבה בחובת סודיות כלפי לקוחותיה, ופניות מטופלות בדיסקרטיות מלאה. ' +
        'עם זאת, מומלץ לא למסור פרטים רגישים בהודעות באתר, ולהשאיר אותם לשיחה ישירה.',
    },
    {
      question: 'נפגעתי בעבודה. מה כדאי לעשות כבר עכשיו?',
      answer:
        'כדאי לתעד מה קרה: תאריכים, מה נאמר, מי נכח, והודעות כתובות. ' +
        'מומלץ להתייעץ לפני שמגישים תלונה או חותמים על מסמך כלשהו, כדי שתדעו מה האפשרויות לפני שמקבלים החלטה.',
    },
    {
      question: 'תוך כמה זמן אקבל מענה?',
      answer:
        'אנו משתדלים לחזור לכל פנייה בהקדם. בפניות דחופות ניתן ליצור קשר טלפוני ' +
        'או בוואטסאפ לקבלת מענה מהיר יותר.',
    },
    {
      question: 'באילו תחומים עוסק המשרד?',
      answer:
        'המשרד עוסק בשלושה תחומים. משפט פלילי, כולל ליווי נפגעי עבירה לפי חוק זכויות נפגעי עבירה. ' +
        'נזיקין: רשלנות, אפליה והתעמרות בעבודה, הטרדה מינית, לשון הרע ותביעות בגין חיסוני פייזר. ' +
        'ומעמד אישי: עריכת צוואות, ייפוי כוח מתמשך והצהרה על נעדר. המשרד אינו עוסק בנישואין ובגירושין. ' +
        'אם העניין שלכם בתחום אחר, אפשר לפנות ולברר, ונאמר בכנות אם הוא מחוץ להתמחות המשרד.',
    },
    {
      question: 'האם אפשר לפנות בלי לפרט את האירוע?',
      answer:
        'כן. בפנייה הראשונה מספיק לציין את התחום ואיך אפשר ליצור קשר. את הפרטים אפשר למסור בשיחה ישירה ודיסקרטית, ' +
        'כשתרגישו מוכנים.',
    },
    {
      question: 'מה ההבדל בין ייעוץ לייצוג?',
      answer:
        'ייעוץ הוא פגישה שבה מבינים את התמונה ואת האפשרויות. ייצוג הוא ליווי מלא בהליך, כמו מו״מ, תלונה או משפט. ' +
        'אפשר להתחיל בייעוץ בלי להתחייב לשום המשך.',
    },
    {
      question: 'האם הצ׳אט באתר נותן ייעוץ משפטי?',
      answer:
        'לא. הצ׳אט הוא עוזרת וירטואלית מבוססת בינה מלאכותית שנותנת מידע כללי, עונה על שאלות נפוצות ומסדרת פנייה למשרד. ' +
        'ייעוץ משפטי אישי ניתן רק בפגישה עם עורכת הדין.',
    },
    {
      question: 'מה לעשות אם קיבלתי הזמנה לחקירה במשטרה?',
      answer:
        'כדאי להתייעץ עם עורכת דין לפני החקירה. לחשוד יש זכות להיוועץ בעורך דין וזכות שתיקה, ' +
        'ומומלץ לא לחתום על שום דבר שלא הבנתם. יש על כך מדריך באתר.',
    },
    {
      question: 'הוזמנתי לשימוע לפני פיטורים. מה עושים?',
      answer:
        'שימוע הוא הזדמנות להשמיע טענות לפני ההחלטה. כדאי לקרוא את הטענות, להתכונן, להתייעץ מראש, ' +
        'ולא לחתום על מכתב התפטרות או הסכם סיום בלי להבין אותם.',
    },
    {
      question: 'איפה נמצא המשרד?',
      answer: 'המשרד נמצא ברחוב רימון 5 בחריש. מומלץ לתאם פגישה מראש בטלפון, בוואטסאפ או דרך הצ׳אט.',
    },
  ] satisfies FaqItem[],

  // --- SEO ---
  seo: {
    /** Absolute <title> of the home page. Aim for about 50-60 characters. */
    homeTitle: 'עורכת דין בחריש: פלילי, נזיקין וצוואות | ליאור-קלואי ארז',
    homeDescription:
      'משרד עו״ד ליאור-קלואי ארז בחריש: ליווי אישי ודיסקרטי במשפט פלילי, נזיקין (רשלנות, לשון הרע) וצוואות וייפוי כוח מתמשך. אפשר לקבוע ייעוץ.',
    /** Appended to inner-page titles. */
    titleSuffix: 'ליאור-קלואי ארז',
    /** Update when public content changes; feeds sitemap lastmod. */
    lastModified: '2026-10-30',
    /** What the firm is an authority on; feeds JSON-LD `knowsAbout` (confirmed topics only). */
    knowsAbout: [
      'אפליה בעבודה',
      'התעמרות בעבודה',
      'שימוע לפני פיטורים',
      'הטרדה מינית',
      'משפט פלילי',
      'חקירה במשטרה',
      'מעצרים',
      'רשלנות רפואית',
      'נפגעי עבירה',
      'נזיקין',
      'לשון הרע',
      'תביעות חיסונים',
      'צוואות',
      'ייפוי כוח מתמשך',
      'הצהרה על נעדר',
    ],
  },

  // --- Legal pages ---
  legal: {
    /** Date the privacy/terms/accessibility statements were last updated. */
    lastUpdated: '2026-10-27',
    /** Accessibility coordinator (Israeli standard 5568 / accessibility regulations). */
    accessibilityCoordinator: 'עו״ד ליאור-קלואי ארז',
    accessibilityContact: 'Lioraere@gmail.com',
    /** Date of the last accessibility review of the site. */
    accessibilityReviewed: '2026-10-26',
    /**
     * Court area that hears disputes about the site's terms of use.
     * OWNER TO CONFIRM with the attorney.
     */
    jurisdiction: 'חדרה',
    /** Business identification shown in the footer. Leave '' to hide. OWNER TO PROVIDE. */
    licenseNumber: '',
    businessId: '',
    /** Third parties that may process visitor data; listed in the privacy policy. */
    processors: [
      'Netlify (אחסון האתר)',
      'Cloudinary (שירות תמונות וסרטונים)',
      'YouTube (Google) (הפעלת סרטוני לקוחות, רק לאחר לחיצה על ההפעלה)',
      'Google או Anthropic (עיבוד שיחות בצ׳אט באמצעות בינה מלאכותית, לפי ההגדרות)',
      'Meta WhatsApp Business (העברת פנייה בוואטסאפ, כשהאפשרות מופעלת)',
    ],
  },
} as const;

export type Brand = typeof brand;

/** Convenience helpers used across the app. */
export const telHref = `tel:+${brand.phoneE164}`;
export const whatsappHref = `https://wa.me/${brand.whatsapp}`;
export const mailHref = `mailto:${brand.email}`;
