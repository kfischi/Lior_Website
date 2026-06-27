'use client';

import * as React from 'react';
import Link from 'next/link';
import { Menu, X, Phone } from 'lucide-react';
import { brand, telHref } from '@/lib/brand';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const NAV = [
  { href: '#practice-areas', label: 'תחומי עיסוק' },
  { href: '#about', label: 'אודות' },
  { href: '#why-us', label: 'למה אנחנו' },
  { href: '#reviews', label: 'המלצות' },
  { href: '#contact', label: 'צור קשר' },
];

export function Header() {
  const [open, setOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-cream/90 backdrop-blur">
      <nav
        aria-label="ניווט ראשי"
        className="container flex h-16 items-center justify-between gap-4"
      >
        <Link href="/" className="font-heading text-lg font-bold text-navy md:text-xl">
          {brand.firmNameShort}
        </Link>

        {/* Desktop nav */}
        <ul className="hidden items-center gap-7 md:flex">
          {NAV.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                className="text-sm font-medium text-ink/80 transition-colors hover:text-accent"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden md:block">
          <Button asChild variant="accent" size="sm">
            <a href={telHref}>
              <Phone className="h-4 w-4" />
              {brand.phone}
            </a>
          </Button>
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          className="md:hidden"
          aria-label={open ? 'סגירת תפריט' : 'פתיחת תפריט'}
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {/* Mobile menu */}
      <div className={cn('md:hidden', open ? 'block' : 'hidden')}>
        <ul className="container flex flex-col gap-1 pb-4">
          {NAV.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                onClick={() => setOpen(false)}
                className="block rounded-md px-2 py-2 text-base font-medium text-ink/80 hover:bg-secondary"
              >
                {item.label}
              </a>
            </li>
          ))}
          <li className="pt-2">
            <Button asChild variant="accent" className="w-full">
              <a href={telHref}>
                <Phone className="h-4 w-4" />
                {brand.phone}
              </a>
            </Button>
          </li>
        </ul>
      </div>
    </header>
  );
}
