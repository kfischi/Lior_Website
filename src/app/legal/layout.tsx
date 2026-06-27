import { Header } from '@/components/sections/Header';
import { Footer } from '@/components/sections/Footer';

export default function LegalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main id="main" className="bg-cream">
        <article className="container max-w-3xl py-16 md:py-20 [&_h2]:mt-10 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-navy [&_h3]:mt-6 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-navy [&_p]:mt-4 [&_p]:leading-relaxed [&_p]:text-ink/80 [&_ul]:mt-4 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:ps-6 [&_ul]:text-ink/80 [&_a]:text-accent [&_a]:underline [&_a]:underline-offset-2">
          {children}
        </article>
      </main>
      <Footer />
    </>
  );
}
