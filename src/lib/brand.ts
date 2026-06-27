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
  firmName: 'משרד עורכי דין לדוגמה',
  firmNameShort: 'לדוגמה ושות׳',
  tagline: 'ייצוג משפטי מקצועי, אישי וללא פשרות',
  attorneyName: 'עו״ד ישראל ישראלי',
  /** Short legal-services description — used in meta + JSON-LD. */
  description:
    'משרד עורכי דין המתמחה בליטיגציה אזרחית-מסחרית, דיני משפחה ונדל״ן. ' +
    'ליווי משפטי צמוד, מקצועי ודיסקרטי ללקוחות פרטיים ועסקיים.',

  // --- Contact ---
  phone: '03-0000000',
  /** International format, digits only — for tel: and WhatsApp links. */
  phoneE164: '972300000000',
  whatsapp: '972500000000',
  email: 'office@example.co.il',
  address: {
    street: 'רחוב הדוגמה 1',
    city: 'תל אביב',
    postalCode: '0000000',
    country: 'IL',
  },
  hours: 'א׳–ה׳, 09:00–18:00',
  /** Maps embed/link target. */
  mapUrl: 'https://maps.google.com/?q=Tel+Aviv',

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
    title: 'ייצוג משפטי שאפשר לסמוך עליו',
    subtitle:
      'משרד בוטיק המעניק ליווי משפטי אישי, מקצועי ודיסקרטי — מהפגישה הראשונה ועד להשגת התוצאה.',
    primaryCta: 'לקביעת ייעוץ',
    secondaryCta: 'וואטסאפ',
    /** Cloudinary public ID for the hero background. */
    imageId: 'lawyer-os/hero-placeholder',
  },

  // --- Trust strip (E-E-A-T) ---
  trustStats: [
    { value: '25+', label: 'שנות ניסיון' },
    { value: '1,500+', label: 'תיקים שטופלו' },
    { value: '6', label: 'תחומי התמחות' },
    { value: '98%', label: 'שביעות רצון לקוחות' },
  ],

  // --- About ---
  about: {
    heading: 'אודות המשרד',
    body:
      'המשרד הוקם מתוך תפיסה שלפיה ייצוג משפטי איכותי מתחיל בהקשבה. ' +
      'אנו משלבים ניסיון רב-שנים בבתי המשפט עם יחס אישי, זמינות ושקיפות מלאה ' +
      'בכל שלב בתהליך. כל לקוח מקבל אסטרטגיה המותאמת בדיוק לעניינו.',
    credentials: [
      'חבר/ה בלשכת עורכי הדין בישראל',
      'תואר LL.B במשפטים',
      'התמחות בליטיגציה מסחרית',
    ],
    /** Cloudinary public ID for the attorney portrait. */
    portraitId: 'lawyer-os/attorney-placeholder',
  },

  // --- Why us ---
  whyUs: [
    {
      title: 'יחס אישי',
      description: 'ליווי צמוד של עורך הדין עצמו, ללא העברה בין מתמחים.',
      icon: 'HeartHandshake',
    },
    {
      title: 'ניסיון מוכח',
      description: 'מאות תיקים מנוהלים בהצלחה במגוון תחומים משפטיים.',
      icon: 'Award',
    },
    {
      title: 'שקיפות מלאה',
      description: 'הסבר ברור על הסיכויים, הסיכונים והעלויות מראש.',
      icon: 'Eye',
    },
    {
      title: 'זמינות',
      description: 'מענה מהיר ועדכון שוטף לאורך כל הטיפול בתיק.',
      icon: 'Clock',
    },
  ],

  // --- Practice areas ---
  practiceAreas: [
    {
      slug: 'civil-litigation',
      title: 'ליטיגציה אזרחית',
      description: 'ייצוג בתביעות אזרחיות ומסחריות בכל הערכאות.',
      icon: 'Scale',
    },
    {
      slug: 'family-law',
      title: 'דיני משפחה',
      description: 'גירושין, משמורת, הסכמי ממון וצוואות ברגישות הנדרשת.',
      icon: 'Users',
    },
    {
      slug: 'real-estate',
      title: 'נדל״ן ומקרקעין',
      description: 'ליווי עסקאות, מיסוי מקרקעין והתחדשות עירונית.',
      icon: 'Building2',
    },
    {
      slug: 'commercial',
      title: 'מסחרי וחוזים',
      description: 'עריכת חוזים, ליווי עסקאות וייעוץ שוטף לעסקים.',
      icon: 'Briefcase',
    },
    {
      slug: 'labor-law',
      title: 'דיני עבודה',
      description: 'ייצוג עובדים ומעסיקים בסכסוכי עבודה.',
      icon: 'Gavel',
    },
    {
      slug: 'torts',
      title: 'נזיקין ופיצויים',
      description: 'תביעות נזקי גוף, רשלנות וביטוח.',
      icon: 'ShieldCheck',
    },
  ] satisfies PracticeArea[],

  // --- Testimonials ---
  testimonials: [
    {
      name: 'ר. כהן',
      role: 'לקוח פרטי',
      rating: 5,
      text: 'ליווי מקצועי ואנושי לאורך כל הדרך. הרגשתי בידיים טובות בכל רגע.',
    },
    {
      name: 'מ. לוי',
      role: 'בעלת עסק',
      rating: 5,
      text: 'זמינות יוצאת דופן ותוצאה מעבר למצופה. ממליצה בחום.',
    },
    {
      name: 'א. פרץ',
      role: 'לקוח עסקי',
      rating: 5,
      text: 'גישה אסטרטגית וחדה. ידעו בדיוק איך לנהל את התיק שלי.',
    },
  ] satisfies Testimonial[],

  // --- FAQ (also rendered as FAQPage JSON-LD) ---
  faq: [
    {
      question: 'כמה עולה פגישת ייעוץ ראשונית?',
      answer:
        'פגישת הייעוץ הראשונה נועדה להבין את עניינכם ולהציג מסלול פעולה. ' +
        'עלות הפגישה תימסר מראש ובשקיפות מלאה בעת קביעת התור.',
    },
    {
      question: 'תוך כמה זמן אקבל מענה?',
      answer:
        'אנו משתדלים לחזור לכל פנייה בתוך יום עסקים אחד. בפניות דחופות ניתן ' +
        'ליצור קשר טלפוני או בוואטסאפ לקבלת מענה מהיר יותר.',
    },
    {
      question: 'האם המשרד מטפל בתיקים בכל הארץ?',
      answer:
        'כן. המשרד מייצג לקוחות בכל הערכאות ובכל רחבי הארץ, ומקיים פגישות ' +
        'גם באמצעים מקוונים בהתאם לצורך.',
    },
  ] satisfies FaqItem[],

  // --- Legal pages ---
  legal: {
    /** Date the privacy/terms/accessibility statements were last updated. */
    lastUpdated: '2026-06-01',
    /** Accessibility coordinator contact (Israeli standard 5568 requirement). */
    accessibilityContact: 'office@example.co.il',
  },
} as const;

export type Brand = typeof brand;

/** Convenience helpers used across the app. */
export const telHref = `tel:+${brand.phoneE164}`;
export const whatsappHref = `https://wa.me/${brand.whatsapp}`;
export const mailHref = `mailto:${brand.email}`;
