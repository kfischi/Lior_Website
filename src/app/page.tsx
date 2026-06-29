import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/sections/Hero";
import { Stats } from "@/components/sections/Stats";
import { PracticeAreas } from "@/components/sections/PracticeAreas";
import { About } from "@/components/sections/About";
import { Process } from "@/components/sections/Process";
import { Testimonials } from "@/components/sections/Testimonials";
import { Faq } from "@/components/sections/Faq";
import { Contact } from "@/components/sections/Contact";
import { MobileContactBar } from "@/components/MobileContactBar";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Stats />
        <PracticeAreas />
        <About />
        <Process />
        <Testimonials />
        <Faq />
        <Contact />
      </main>
      <Footer />
      <MobileContactBar />
    </>
  );
}
