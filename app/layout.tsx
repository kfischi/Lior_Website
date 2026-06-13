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
    default: 'עו״ד ליאור-קלואי ארז | משפט פלילי, רשלנות רפואית, דיני משפחה',
    template: '%s | עו״ד ליאור-קלואי ארז',
  },
  description:
    "משרד עורכת דין ליאור-קלואי ארז — התמחות במשפט פלילי, רשלנות רפואית, דיני עבודה ומשפחה. משרד בחריש, שירות גם בזום. לתיאום פגישה: 052-469-4158",
  keywords: [
    "עורכת דין חריש",
    "משפט פלילי",
    "רשלנות רפואית",
    "דיני משפחה",
    "ליאור קלואי ארז",
    'עו״ד חריש',
    "עורכת דין פלילית",
    "הגנה פלילית",
    "דיני עבודה",
    "נזיקין",
    "הטרדה מינית",
    "אפליה בעבודה",
    "עורכת דין 052-469-4158",
  ],
  authors: [{ name: 'עו״ד ליאור-קלואי ארז', url: BASE_URL }],
  creator: 'עו״ד ליאור-קלואי ארז',
  publisher: 'משרד עו״ד ליאור-קלואי ארז',
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
    siteName: 'עו״ד ליאור-קלואי ארז',
    title: 'עו״ד ליאור-קלואי ארז | משפט פלילי, רשלנות רפואית, דיני משפחה',
    description: "21 שנות ניסיון במשפט הפלילי, רשלנות רפואית ודיני משפחה. משרד בחריש.",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: 'עו״ד ליאור-קלואי ארז' }],
  },
  twitter: {
    card: "summary_large_image",
    title: 'עו״ד ליאור-קלואי ארז',
    description: "21 שנות ניסיון במשפט הפלילי, רשלנות רפואית ודיני משפחה.",
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
      name: 'משרד עו״ד ליאור-קלואי ארז',
      alternateName: ['עו״ד ליאור-קלואי ארז', "Lior-Clohe Erez, Attorney at Law"],
      url: BASE_URL,
      logo: `${BASE_URL}/logo.png`,
      image: `${BASE_URL}/og-image.jpg`,
      telephone: "052-469-4158",
      faxNumber: "077-4702353",
      email: "Lioraere@gmail.com",
      address: {
        "@type": "PostalAddress",
        streetAddress: "רח׳ רימון 5",
        addressLocality: "חריש",
        postalCode: "3786100",
        addressCountry: "IL",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: "32.4597",
        longitude: "35.0241",
      },
      openingHoursSpecification: {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],
        opens: "00:00",
        closes: "23:59",
      },
      priceRange: "$$",
      description:
        'עורכת דין עם 21 שנות ניסיון. מתמחה במשפט פלילי, רשלנות רפואית, דיני משפחה ונזיקין. משרד בחריש.',
      knowsAbout: [
        "משפט פלילי", "רשלנות רפואית", "דיני משפחה", "נזיקין",
        "הטרדה מינית", "אפליה והתעמרות בעבודה", "עבירות תעבורה",
      ],
      areaServed: { "@type": "Country", name: "Israel" },
      hasMap: "https://maps.google.com/?q=רימון+5+חריש",
      sameAs: [],
    },
    {
      "@type": "Person",
      "@id": `${BASE_URL}/#attorney`,
      name: 'ליאור-קלואי ארז',
      jobTitle: "עורכת דין",
      worksFor: { "@id": `${BASE_URL}/#organization` },
      url: BASE_URL,
      telephone: "052-469-4158",
      email: "Lioraere@gmail.com",
      knowsAbout: ["Criminal Law", "Medical Malpractice", "Family Law", "Israeli Law"],
    },
    {
      "@type": "WebSite",
      "@id": `${BASE_URL}/#website`,
      url: BASE_URL,
      name: 'עו״ד ליאור-קלואי ארז',
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
          acceptedAnswer: { "@type": "Answer", text: "משפט פלילי, רשלנות רפואית, דיני משפחה, נזיקין, הטרדה מינית ואפליה בעבודה." },
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
        {/* Global cinematic video background — all pages */}
        <div className="fixed inset-0 z-0 pointer-events-none" aria-hidden="true">
          <video
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            className="absolute inset-0 w-full h-full object-cover"
            style={{ opacity: 0.22 }}
          >
            <source
              src={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "dptyfvwyo"}/video/upload/q_auto:good,w_1280,vc_auto,f_auto/${process.env.NEXT_PUBLIC_CLOUDINARY_VIDEO_PUBLIC_ID || "HERO_u4uu8h"}.mp4`}
              type="video/mp4"
            />
          </video>
          {/* Dark overlay to keep content readable */}
          <div className="absolute inset-0" style={{ background: "rgba(10,10,10,0.55)" }} />
        </div>
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
