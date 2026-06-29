import type { Metadata } from "next";
import { Frank_Ruhl_Libre, Heebo } from "next/font/google";
import "./globals.css";
import { site } from "@/content/site";

// Authoritative Hebrew serif for headings (the EB Garamond equivalent for Hebrew)
const frankRuhl = Frank_Ruhl_Libre({
  variable: "--font-display",
  subsets: ["hebrew", "latin"],
  weight: ["400", "500", "700", "900"],
  display: "swap",
});

// Clean Hebrew sans for body copy (the Lato equivalent for Hebrew)
const heebo = Heebo({
  variable: "--font-body",
  subsets: ["hebrew", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.firmName} | ${site.tagline}`,
    template: `%s | ${site.firmName}`,
  },
  description: site.description,
  keywords: [...site.keywords],
  openGraph: {
    type: "website",
    locale: "he_IL",
    siteName: site.firmName,
    title: `${site.firmName} | ${site.tagline}`,
    description: site.description,
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="he"
      dir="rtl"
      className={`${frankRuhl.variable} ${heebo.variable} h-full antialiased`}
    >
      <head>
        {/* Mark JS as available before paint so reveal-on-scroll elements
            only hide when animations can actually run (no-JS = visible). */}
        <script
          dangerouslySetInnerHTML={{
            __html: "document.documentElement.classList.add('js')",
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-background text-ink font-body">
        {children}
      </body>
    </html>
  );
}
