import type { Metadata } from "next";
import { Playfair_Display, Heebo } from "next/font/google";
import "./globals.css";
import LenisProvider from "@/components/LenisProvider";
import WhatsAppButton from "@/components/WhatsAppButton";
import CookieBanner from "@/components/CookieBanner";
import AccessibilityWidget from "@/components/AccessibilityWidget";
import AIChat from "@/components/AIChat";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const heebo = Heebo({
  variable: "--font-heebo",
  subsets: ["hebrew", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const BASE_URL = "https://www.lior-kloay-erez.co.il";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "ליאור קלואי ארז | עורכת דין פלילית בכירה — הגנה פלילית מקצועית",
    template: "%s | ליאור קלואי ארז עו\"ד",
  },
  description:
    "עורכת דין פלילית מובילה בישראל — ליאור קלואי ארז. ניסיון של עשרות שנים בהגנה פלילית: עבירות סמים, אלימות, כלכליות ותעבורה. ייעוץ חסוי ראשוני ללא עלות.",
  keywords: [
    "עורכת דין פלילית",
    "עורך דין פלילי",
    "הגנה פלילית",
    "עורכת דין פלילית בכירה",
    "ייעוץ משפטי פלילי",
    "עורך דין מעצר",
    "הגנה במשפט פלילי",
    "עורכת דין סמים",
    "עורכת דין אלימות",
    "עורכת דין כלכלית",
    "עורכת דין תעבורה",
    "עורכת דין נוער",
    "ליאור קלואי ארז",
    "משרד עורכי דין פלילי",
    "עורך דין 24 שעות",
    "עורך דין מעצר ראשוני",
    "הגנה פלילית ישראל",
    "עורך דין חירום",
  ],
  authors: [{ name: "ליאור קלואי ארז", url: BASE_URL }],
  creator: "ליאור קלואי ארז",
  publisher: "משרד עורכת הדין ליאור קלואי ארז",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
  alternates: {
    canonical: BASE_URL,
    languages: { "he-IL": BASE_URL },
  },
  openGraph: {
    type: "website",
    locale: "he_IL",
    url: BASE_URL,
    siteName: "ליאור קלואי ארז — עורכת דין פלילית",
    title: "ליאור קלואי ארז | עורכת דין פלילית בכירה",
    description:
      "הגנה פלילית מקצועית ואגרסיבית. ייעוץ ראשוני ללא עלות.",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "ליאור קלואי ארז — עורכת דין פלילית" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "ליאור קלואי ארז | עורכת דין פלילית",
    description: "הגנה פלילית מקצועית. ייעוץ ראשוני ללא עלות.",
    images: ["/og-image.jpg"],
  },
  verification: {
    google: "ADD_YOUR_GOOGLE_VERIFICATION_CODE",
  },
  category: "legal",
};

// JSON-LD Structured Data — Attorney + LocalBusiness + FAQ
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": ["LegalService", "LocalBusiness"],
      "@id": `${BASE_URL}/#organization`,
      name: "משרד עורכת הדין ליאור קלואי ארז",
      alternateName: ["ליאור קלואי ארז עו\"ד", "Lior Kloay Erez Attorney"],
      url: BASE_URL,
      logo: `${BASE_URL}/logo.png`,
      image: `${BASE_URL}/og-image.jpg`,
      telephone: process.env.NEXT_PUBLIC_LAWYER_PHONE || "+972-52-4694158",
      email: "office@lior-kloay-erez.co.il",
      address: {
        "@type": "PostalAddress",
        addressCountry: "IL",
        addressLocality: "תל אביב",
        addressRegion: "תל אביב",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: "32.0853",
        longitude: "34.7818",
      },
      openingHoursSpecification: {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],
        opens: "00:00",
        closes: "23:59",
      },
      priceRange: "$$",
      description:
        "עורכת דין פלילית בכירה עם ניסיון של עשרות שנים. מתמחה בהגנה פלילית, עבירות סמים, אלימות, עבירות כלכליות ותעבורה.",
      knowsAbout: [
        "הגנה פלילית", "עבירות סמים", "עבירות אלימות", "עבירות מין",
        "עבירות כלכליות", "עבירות תעבורה", "עבירות נוער",
      ],
      areaServed: { "@type": "Country", name: "Israel" },
      hasMap: `https://maps.google.com/?q=תל+אביב+ישראל`,
      sameAs: [],
    },
    {
      "@type": "Person",
      "@id": `${BASE_URL}/#attorney`,
      name: "ליאור קלואי ארז",
      jobTitle: "עורכת דין פלילית",
      worksFor: { "@id": `${BASE_URL}/#organization` },
      url: BASE_URL,
      knowsAbout: ["Criminal Law", "Israeli Criminal Law", "Defense Attorney"],
    },
    {
      "@type": "WebSite",
      "@id": `${BASE_URL}/#website`,
      url: BASE_URL,
      name: "ליאור קלואי ארז — עורכת דין פלילית",
      inLanguage: "he-IL",
      publisher: { "@id": `${BASE_URL}/#organization` },
      potentialAction: {
        "@type": "SearchAction",
        target: { "@type": "EntryPoint", urlTemplate: `${BASE_URL}/?q={search_term_string}` },
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "כמה עולה ייעוץ ראשוני עם עורכת הדין?",
          acceptedAnswer: { "@type": "Answer", text: "השיחה הראשונה היא ללא עלות וללא התחייבות. צרו קשר בכל שעה." },
        },
        {
          "@type": "Question",
          name: "האם עורכת הדין זמינה בשעות חירום?",
          acceptedAnswer: { "@type": "Answer", text: "כן. המשרד זמין 24/7, כולל לילות, שבתות וחגים — עבור מעצרים ומצבי חירום." },
        },
        {
          "@type": "Question",
          name: "באילו תחומים מתמחה עורכת הדין?",
          acceptedAnswer: { "@type": "Answer", text: "הגנה פלילית כוללת: עבירות סמים, אלימות, עבירות מין, עבירות כלכליות, תעבורה ועבירות נוער." },
        },
        {
          "@type": "Question",
          name: "האם הייעוץ חסוי?",
          acceptedAnswer: { "@type": "Answer", text: "כן, כל מידע שיועבר במסגרת הייעוץ חסוי לחלוטין תחת חיסיון עורך דין-לקוח." },
        },
      ],
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="he" dir="rtl" className={`${playfair.variable} ${heebo.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <link rel="canonical" href={BASE_URL} />
        <meta name="theme-color" content="#0a0a0a" />
        <meta name="format-detection" content="telephone=yes" />
      </head>
      <body className="font-heebo bg-noir-bg text-noir-text antialiased">
        <div className="grain-overlay" aria-hidden="true" />
        <LenisProvider>
          {children}
          <WhatsAppButton />
          <AccessibilityWidget />
          <AIChat />
          <CookieBanner />
        </LenisProvider>
      </body>
    </html>
  );
}
