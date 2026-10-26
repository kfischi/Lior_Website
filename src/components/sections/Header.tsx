'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useReducedMotion } from 'motion/react';
import { Menu, X, Phone } from 'lucide-react';
import { brand, telHref, whatsappHref } from '@/lib/brand';
import { Button } from '@/components/ui/button';
import { WhatsAppIcon } from '@/components/ui/whatsapp-icon';
import { OpenChatButton } from '@/components/ai/OpenChatButton';
import { cn } from '@/lib/utils';

const NAV = [
  { href: '/#practice', label: 'תחומי עיסוק' },
  { href: '/#about', label: 'אודות' },
  { href: '/#why', label: 'למה אנחנו' },
  ...(brand.testimonials.length > 0 ? [{ href: '/#reviews', label: 'המלצות' }] : []),
  { href: '/articles', label: 'מדריכים' },
  { href: '/#faq', label: 'שאלות' },
  { href: '/#contact', label: 'צור קשר' },
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
            'flex items-center gap-3 font-heading text-lg lg:shrink-0 lg:whitespace-nowrap font-bold transition-colors md:text-xl',
            scrolled ? 'text-navy' : 'text-cream',
          )}
        >
          <Image
            src={scrolled ? brand.logo.iconDark : brand.logo.iconLight}
            alt=""
            width={brand.logo.iconSize.width}
            height={brand.logo.iconSize.height}
            priority
            className="h-11 w-auto"
          />
          {brand.firmNameShort}
        </Link>

        <ul className="hidden items-center gap-5 whitespace-nowrap lg:flex xl:gap-7">
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
                <span
                  className={cn(
                    'absolute -bottom-1 start-0 h-px w-0 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:w-full',
                    scrolled ? 'bg-accent' : 'bg-accent-light',
                  )}
                />
              </a>
            </li>
          ))}
        </ul>

<a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="וואטסאפ: שליחת הודעה למשרד (נפתח בחלון חדש)"
          className="ms-auto flex h-11 shrink-0 animate-ring-green items-center gap-2 rounded-full bg-[#0f7a45] px-3 text-sm font-semibold text-white shadow-md ring-1 ring-white/70 transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent-light sm:px-4 lg:ms-0"
        >
          <WhatsAppIcon className="h-6 w-6" />
          <span className="max-[400px]:hidden">וואטסאפ</span>
        </a>

        <div className="hidden items-center gap-3 lg:flex">
          <Button asChild variant={scrolled ? 'outline' : 'onDark'} size="sm">
            <a href={telHref}>
              <Phone className="h-4 w-4" />
              {brand.phone}
            </a>
          </Button>
        </div>

        <button
          type="button"
          className={cn(
            'flex flex-col items-center gap-0.5 rounded-md px-2 py-1 lg:hidden',
            scrolled ? 'text-navy' : 'text-cream',
          )}
          aria-label={open ? 'סגירת תפריט' : 'פתיחת תפריט'}
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <X className="h-9 w-9" aria-hidden="true" /> : <Menu className="h-9 w-9" aria-hidden="true" />}
          <span aria-hidden="true" className="text-xs font-semibold leading-none">
            {open ? 'סגירה' : 'תפריט'}
          </span>
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
            <li className="space-y-2 pt-2">
              <OpenChatButton
                variant="accent"
                className="w-full"
                onClick={() => setOpen(false)}
              >
                שיחה עם המשרד
              </OpenChatButton>
              <Button asChild variant="outline" className="w-full">
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
