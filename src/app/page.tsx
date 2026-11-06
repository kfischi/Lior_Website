import type { Metadata } from 'next';
import { brand } from '@/lib/brand';
import { buildMetadata, faqJsonLd } from '@/lib/seo';
import { getSiteContent } from '@/lib/sanity/content';
import { Header } from '@/components/sections/Header';
import { Hero } from '@/components/sections/Hero';
import { Marquee } from '@/components/sections/Marquee';
import { TrustBar } from '@/components/sections/TrustBar';
import { Process } from '@/components/sections/Process';
import { WhyUs } from '@/components/sections/WhyUs';
import { About } from '@/components/sections/About';
import { PracticeAreas } from '@/components/sections/PracticeAreas';
import { Reviews } from '@/components/sections/Reviews';
import { VideoReviews } from '@/components/sections/VideoReviews';
import { Articles } from '@/components/sections/Articles';
import { Faq } from '@/components/sections/Faq';
import { Contact } from '@/components/sections/Contact';
import { Footer } from '@/components/sections/Footer';

export const metadata: Metadata = buildMetadata({
  absoluteTitle: brand.seo.homeTitle,
  description: brand.seo.homeDescription,
  path: '/',
});

export default async function HomePage() {
  const { faq } = await getSiteContent();
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(faq)) }}
      />
      <Header />
      <main id="main">
        <Hero />
        <TrustBar />
        <Marquee />
        <WhyUs />
        <PracticeAreas />
        <About />
        <Process />
        <Reviews />
        <VideoReviews />
        <Articles />
        <Faq items={faq} />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
