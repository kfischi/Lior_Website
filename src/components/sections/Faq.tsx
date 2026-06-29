"use client";

import { useState } from "react";
import { site } from "@/content/site";
import { SectionHeading } from "../ui/SectionHeading";
import { ChevronIcon } from "../icons";

export function Faq() {
  const { faq } = site;
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="bg-navy-50/60 py-24 md:py-28">
      <div className="container-page">
        <SectionHeading eyebrow={faq.eyebrow} title={faq.title} />

        <div className="mx-auto mt-12 max-w-3xl divide-y divide-line overflow-hidden rounded-2xl border border-line bg-surface">
          {faq.items.map((item, i) => {
            const isOpen = open === i;
            return (
              <div key={item.q}>
                <h3>
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="flex w-full cursor-pointer items-center justify-between gap-4 px-6 py-5 text-start transition-colors hover:bg-gold-50"
                    aria-expanded={isOpen}
                  >
                    <span className="font-display text-lg font-semibold text-navy-900">
                      {item.q}
                    </span>
                    <ChevronIcon
                      className={`h-5 w-5 shrink-0 text-gold-600 transition-transform duration-300 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                </h3>
                <div
                  className={`grid transition-all duration-300 ease-out ${
                    isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="px-6 pb-5 leading-relaxed text-muted">
                      {item.a}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
