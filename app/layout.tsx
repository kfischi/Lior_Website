import type { Metadata } from "next";
import { Playfair_Display, Heebo } from "next/font/google";
import "./globals.css";
import LenisProvider from "@/components/LenisProvider";

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

export const metadata: Metadata = {
  title: "עורך דין פלילי בכיר | הגנה משפטית מקצועית",
  description:
    "משרד עורכי דין פלילי מוביל בישראל. ניסיון של עשרות שנים, זמינות 24/7, שיקול דעת מוחלט. צרו קשר לייעוץ חסוי ראשוני ללא עלות.",
  keywords: "עורך דין פלילי, הגנה פלילית, ייעוץ משפטי, ישראל, עבירות, מעצר",
  openGraph: {
    title: "עורך דין פלילי בכיר | הגנה משפטית מקצועית",
    description:
      "משרד עורכי דין פלילי מוביל בישראל. ניסיון של עשרות שנים, זמינות 24/7.",
    locale: "he_IL",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="he" dir="rtl" className={`${playfair.variable} ${heebo.variable}`}>
      <body className="font-heebo bg-noir-bg text-noir-text antialiased">
        {/* Global noise grain overlay */}
        <div className="grain-overlay" aria-hidden="true" />
        <LenisProvider>{children}</LenisProvider>
      </body>
    </html>
  );
}
