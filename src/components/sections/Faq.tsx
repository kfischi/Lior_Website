'use client';

import Link from 'next/link';
import { MessagesSquare } from 'lucide-react';
import type { FaqItem } from '@/lib/brand';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion';
import { OpenChatButton } from '@/components/ai/OpenChatButton';
import { HeroBackdrop } from '@/components/ui/HeroBackdrop';

/** The most common questions; the full list lives on /faq. */
const SHOWN = 7;

export function Faq({ items }: { items: FaqItem[] }) {
  return (
    <section id="faq" aria-labelledby="faq-title" className="section relative isolate overflow-hidden bg-cream">
      <HeroBackdrop name="faq" tone="light" />
      <div className="shell grid gap-12 lg:grid-cols-[1fr_1.7fr] lg:gap-20">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <p className="eyebrow mb-4">שאלות ותשובות</p>
          <h2 id="faq-title" className="display-xl text-navy">
            שאלות נפוצות
          </h2>
          <p className="mt-6 max-w-sm text-lg leading-relaxed text-ink/75">
            לא מצאתם את התשובה? אפשר לשאול את העוזרת של ליאור, והיא תענה.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
            <OpenChatButton intake={false} variant="accent" size="lg">
              <MessagesSquare className="h-5 w-5" />
              לשאול את העוזרת
            </OpenChatButton>
            <Link href="/faq" className="font-medium text-accent underline underline-offset-4">
              לכל השאלות והתשובות
            </Link>
          </div>
        </div>

        <Accordion type="single" collapsible className="w-full border-t border-navy/15">
          {items.slice(0, SHOWN).map((item, i) => (
            <AccordionItem key={item.question} value={`item-${i}`}>
              <AccordionTrigger>{item.question}</AccordionTrigger>
              <AccordionContent>{item.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
