import { faqJsonLd } from '@/lib/seo-config';
import { Header } from '@/components/sections/Header';
import { Hero } from '@/components/sections/Hero';
import { WhyUs } from '@/components/sections/WhyUs';
import { PracticeAreas } from '@/components/sections/PracticeAreas';
import { About } from '@/components/sections/About';
import { Reviews } from '@/components/sections/Reviews';
import { ContactForm } from '@/components/sections/ContactForm';
import { Footer } from '@/components/sections/Footer';

export default function HomePage() {
  return (
    <>
      {/* FAQ structured data for GEO / rich results */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd()) }}
      />

      <Header />
      <main id="main">
        <Hero />
        <WhyUs />
        <PracticeAreas />
        <About />
        <Reviews />
        <ContactForm />
      </main>
      <Footer />
    </>
  );
}
