'use client';

import { brand } from '@/lib/brand';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion';

export function Faq() {
  return (
    <section id="faq" aria-labelledby="faq-title" className="section bg-cream">
      <div className="shell max-w-3xl">
        <div className="mb-12 text-center">
          <p className="eyebrow mb-3">שאלות ותשובות</p>
          <h2 id="faq-title" className="text-4xl text-navy md:text-5xl">
            שאלות נפוצות
          </h2>
        </div>

        <Accordion type="single" collapsible className="w-full border-t border-navy/10">
          {brand.faq.map((item, i) => (
            <AccordionItem key={i} value={`item-${i}`}>
              <AccordionTrigger>{item.question}</AccordionTrigger>
              <AccordionContent>{item.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
