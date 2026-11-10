import type { Metadata } from 'next';
import { buildMetadata, faqJsonLd } from '@/lib/seo';
import { getSiteContent } from '@/lib/sanity/content';
import { SectionBand } from '@/components/ui/SectionBand';
import { Header } from '@/components/sections/Header';
import { Hero } from '@/components/sections/Hero';
import { Marquee } from '@/components/sections/Marquee';
import { TrustBar } from '@/components/sections/TrustBar';
import { Process } from '@/components/sections/Process';
import { WhyUs } from '@/components/sections/WhyUs';
import { About } from '@/components/sections/About';
import { LecturesTeaser } from '@/components/sections/LecturesTeaser';
import { PracticeAreas } from '@/components/sections/PracticeAreas';
import { Reviews } from '@/components/sections/Reviews';
import { VideoReviews } from '@/components/sections/VideoReviews';
import { Articles } from '@/components/sections/Articles';
import { Faq } from '@/components/sections/Faq';
import { Contact } from '@/components/sections/Contact';
import { Footer } from '@/components/sections/Footer';

export async function generateMetadata(): Promise<Metadata> {
  const { brand } = await getSiteContent();
  return buildMetadata({
    brand,
    absoluteTitle: brand.seo.homeTitle,
    description: brand.seo.homeDescription,
    path: '/',
  });
}

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
        <SectionBand name="about" into="cream" focus="max-md:object-[50%_20%]" />
        <WhyUs />
        <SectionBand name="torts" into="navy" focus="max-md:object-[35%_50%]" />
        <PracticeAreas />
        <SectionBand name="criminal" into="cream" focus="max-md:object-[60%_50%]" />
        <About />
        <SectionBand name="lectures" into="navy" focus="max-md:object-[70%_50%]" />
        <LecturesTeaser />
        <SectionBand name="family" into="navy" focus="max-md:object-[50%_40%]" />
        <Process />
        <SectionBand name="articles" into="cream" focus="max-md:object-[30%_50%]" />
        <Reviews />
        <SectionBand name="contact" into="navy" focus="max-md:object-[50%_30%]" />
        <VideoReviews />
        <SectionBand name="about" into="white" focus="max-md:object-[50%_85%]" />
        <Articles />
        <SectionBand name="faq" into="cream" focus="max-md:object-[50%_0%]" />
        <Faq items={faq} />
        <SectionBand name="torts" into="navy" focus="max-md:object-[75%_60%]" />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
