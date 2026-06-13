import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import CredentialsBar from "@/components/CredentialsBar";
import AboutSection from "@/components/AboutSection";
import PracticeAreas from "@/components/PracticeAreas";
import Testimonials from "@/components/Testimonials";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import AIChat from "@/components/AIChat";

export default function Home() {
  return (
    <main className="relative z-10 min-h-screen">
      <Navbar />
      <Hero />
      <CredentialsBar />
      <AboutSection />
      <PracticeAreas />
      <Testimonials />
      <ContactSection />
      <Footer />
      <AIChat />
    </main>
  );
}
