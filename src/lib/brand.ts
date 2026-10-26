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
 *  DEFAULT PLACEHOLDER PALETTE: deep navy + cream-white + subtle bronze accent.
 *  (No yellow.) Replace per client.
 * =============================================================================
 */

export interface PracticeArea {
  /** Stable slug used for the route /practice-areas/[slug] and anchors. */
  slug: string;
  title: string;
  description: string;
  /** lucide-react icon name (see src/components/sections/PracticeAreas.tsx). */
  icon: string;
}

export interface Testimonial {
  name: string;
  role?: string;
  rating: number; // 1–5
  text: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export const brand = {
  // --- Identity ---
  firmName: 'משרד עורכת דין ליאור-קלואי ארז',
  firmNameShort: 'ליאור-קלואי ארז, עו״ד',
  tagline: 'ליווי משפטי ברגישות, בנחישות ובדיסקרטיות',
  attorneyName: 'עו״ד ליאור-קלואי ארז',
  /** Short legal-services description — used in meta + JSON-LD. */
  description:
    'משרד עורכת דין ליאור-קלואי ארז בחריש: אפליה והתעמרות בעבודה, הטרדה מינית ומשפט פלילי. ' +
    'ליווי אישי, מקצועי ודיסקרטי מהשיחה הראשונה.',
  /** Public website address. */
  website: 'https://www.liorerezadv.com',

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
  hours: 'בתיאום מראש',
  /** Maps embed/link target. */
  mapUrl: 'https://maps.google.com/?q=%D7%A8%D7%99%D7%9E%D7%95%D7%9F+5+%D7%97%D7%A8%D7%99%D7%A9',

  // --- Social ---
  social: {
    facebook: '',
    linkedin: '',
    instagram: '',
  },

  // --- Colors (placeholder palette — replace per client; no yellow) ---
  colors: {
    navy: '#0F2741', // deep navy — primary
    cream: '#F7F4ED', // cream-white — background
    bronze: '#A9743B', // subtle bronze — accent
    ink: '#1A1A1A', // near-black body text
  },

  // --- Fonts (next/font keys; see src/app/layout.tsx) ---
  fonts: {
    headingName: 'Frank Ruhl Libre',
    bodyName: 'Heebo',
  },

  // --- Hero ---
  hero: {
    title: 'ליווי משפטי ברגישות ובנחישות',
    subtitle:
      'אפליה והתעמרות בעבודה, הטרדה מינית ומשפט פלילי. ליווי אישי ודיסקרטי מהשיחה הראשונה, ' +
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
  },

  // --- AI chatbot ---
  chat: {
    assistantName: 'עוזר המשרד',
    greeting:
      'שלום, אני העוזר הדיגיטלי של המשרד. אפשר לספר לי במה מדובר, ואכוון אתכם ' +
      'לתחום הנכון, אענה על שאלות כלליות ואעזור לקבוע פגישת ייעוץ.',
    /** Quick-start suggestions shown as chips. */
    suggestedPrompts: [
      'נפגעתי בעבודה, מה אפשר לעשות?',
      'כמה עולה ייעוץ ראשוני?',
      'איך קובעים פגישה?',
    ],
    disclaimer: 'המידע כללי ואינו מהווה ייעוץ משפטי.',
  },

  // --- Trust strip (E-E-A-T) ---
  // Shown only when it has items. Add verified numbers only (years of
  // experience, cases, etc.) — never placeholders.
  trustStats: [] as { value: string; label: string }[],

  // --- About ---
  about: {
    heading: 'אודות המשרד',
    body:
      'עו״ד ליאור-קלואי ארז מנהלת משרד המתמחה באפליה והתעמרות בעבודה, בהטרדה מינית ובמשפט פלילי. ' +
      'אלה עניינים שבהם אדם נמצא לא פעם בנקודה קשה ורגישה בחייו, ולכן הדגש במשרד הוא על הקשבה, ' +
      'דיסקרטיות והסבר ברור של האפשרויות, כך שתוכלו לקבל החלטות בביטחון.',
    credentials: [
      'עורכת דין, חברה בלשכת עורכי הדין בישראל',
      'התמחות באפליה והתעמרות בעבודה, הטרדה מינית ומשפט פלילי',
    ],
    /** Cloudinary public ID for the attorney portrait. Local /public path or Cloudinary ID. Leave empty for a monogram panel. */
    portraitId: '/images/lior-portrait.webp',
  },

  // --- Why us ---
  whyUs: [
    {
      title: 'יחס אישי',
      description: 'ליווי צמוד של עורכת הדין עצמה, מהשיחה הראשונה ועד סיום הטיפול.',
      icon: 'HeartHandshake',
    },
    {
      title: 'התמחות ממוקדת',
      description: 'המשרד מתמקד בשלושה תחומים: עבודה, הטרדה מינית ופלילי.',
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
  practiceAreas: [
    {
      slug: 'workplace-discrimination',
      title: 'אפליה והתעמרות בעבודה',
      description:
        'ליווי עובדות ועובדים שנפגעו באפליה, בהתעמרות או בפגיעה בזכויותיהם במקום העבודה.',
      icon: 'Briefcase',
    },
    {
      slug: 'sexual-harassment',
      title: 'הטרדה מינית',
      description: 'ייצוג וליווי בעניינים של הטרדה מינית, ברגישות ובדיסקרטיות מלאה.',
      icon: 'ShieldCheck',
    },
    {
      slug: 'criminal-law',
      title: 'משפט פלילי',
      description: 'ייצוג וליווי בהליכים פליליים, משלב החקירה ועד סיום ההליך.',
      icon: 'Gavel',
    },
  ] satisfies PracticeArea[],

  // --- Testimonials ---
  // Real, permitted client reviews only. The section stays hidden while empty.
  testimonials: [] as Testimonial[],

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
  ] satisfies FaqItem[],

  // --- Legal pages ---
  legal: {
    /** Date the privacy/terms/accessibility statements were last updated. */
    lastUpdated: '2026-10-26',
    /** Accessibility coordinator contact (Israeli standard 5568 requirement). */
    accessibilityContact: 'Lioraere@gmail.com',
  },
} as const;

export type Brand = typeof brand;

/** Convenience helpers used across the app. */
export const telHref = `tel:+${brand.phoneE164}`;
export const whatsappHref = `https://wa.me/${brand.whatsapp}`;
export const mailHref = `mailto:${brand.email}`;
