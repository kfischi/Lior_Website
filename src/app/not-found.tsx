import Link from 'next/link';
import { brand, telHref } from '@/lib/brand';
import { Header } from '@/components/sections/Header';
import { Footer } from '@/components/sections/Footer';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <>
      <Header />
      <main id="main" className="grain relative flex min-h-[80svh] items-center bg-navy pb-20 pt-40 text-cream">
        <div className="shell max-w-2xl text-center">
          <p className="font-heading text-8xl font-semibold leading-none text-accent-light md:text-9xl">404</p>
          <h1 className="mt-6 text-3xl text-cream md:text-5xl">העמוד לא נמצא</h1>
          <p className="mx-auto mt-5 max-w-md text-lg leading-relaxed text-cream/80">
            ייתכן שהקישור ישן או שהכתובת הוקלדה בטעות. אפשר לחזור לעמוד הבית, או להתקשר אלינו:{' '}
            <a href={telHref} className="font-semibold underline">
              {brand.phone}
            </a>
            .
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Button asChild size="lg" variant="accentOnDark">
              <Link href="/">לעמוד הבית</Link>
            </Button>
            <Button asChild size="lg" variant="onDark">
              <Link href="/articles">למדריכים</Link>
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
