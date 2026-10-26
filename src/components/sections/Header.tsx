'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion, useReducedMotion } from 'motion/react';
import { Menu, X, Phone } from 'lucide-react';
import { brand, telHref } from '@/lib/brand';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const NAV = [
  { href: '#practice', label: 'תחומי עיסוק' },
  { href: '#about', label: 'אודות' },
  { href: '#why', label: 'למה אנחנו' },
  { href: '#reviews', label: 'המלצות' },
  { href: '#faq', label: 'שאלות' },
  { href: '#contact', label: 'צור קשר' },
];

export function Header() {
  const reduced = useReducedMotion();
  const [open, setOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <motion.header
      initial={reduced ? false : { y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        'fixed inset-x-0 top-0 z-40 transition-all duration-300',
        scrolled
          ? 'border-b border-navy/10 bg-cream/85 backdrop-blur-md'
          : 'border-b border-transparent bg-transparent',
      )}
    >
      <nav aria-label="ניווט ראשי" className="shell flex h-18 items-center justify-between gap-4">
        <Link
          href="/"
          className={cn(
            'font-heading text-lg font-bold transition-colors md:text-xl',
            scrolled ? 'text-navy' : 'text-cream',
          )}
        >
          {brand.firmNameShort}
        </Link>

        <ul className="hidden items-center gap-7 lg:flex">
          {NAV.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                className={cn(
                  'group relative text-sm font-medium transition-colors',
                  scrolled ? 'text-ink/80 hover:text-navy' : 'text-cream/90 hover:text-cream',
                )}
              >
                {item.label}
                <span className="absolute -bottom-1 start-0 h-px w-0 bg-bronze transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:w-full" />
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden lg:block">
          <Button asChild variant={scrolled ? 'primary' : 'onDark'} size="sm">
            <a href={telHref}>
              <Phone className="h-4 w-4" />
              {brand.phone}
            </a>
          </Button>
        </div>

        <button
          type="button"
          className={cn('lg:hidden', scrolled ? 'text-navy' : 'text-cream')}
          aria-label={open ? 'סגירת תפריט' : 'פתיחת תפריט'}
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-navy/10 bg-cream lg:hidden">
          <ul className="shell flex flex-col gap-1 py-4">
            {NAV.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-md px-2 py-2.5 text-base font-medium text-ink/80 hover:bg-navy/5"
                >
                  {item.label}
                </a>
              </li>
            ))}
            <li className="pt-2">
              <Button asChild variant="primary" className="w-full">
                <a href={telHref}>
                  <Phone className="h-4 w-4" />
                  {brand.phone}
                </a>
              </Button>
            </li>
          </ul>
        </div>
      )}
    </motion.header>
  );
}
