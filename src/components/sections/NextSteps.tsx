'use client';

import { useBrand } from '@/components/layout/BrandProvider';

/** Shown after details are sent: what happens next, in plain steps, so waiting feels less uncertain. */
export function NextSteps() {
  const { afterInquiry } = useBrand();
  return (
    <div className="mt-5 text-start">
      <p className="font-heading text-lg font-semibold text-cream">{afterInquiry.title}</p>
      <ol className="mt-3 space-y-2 text-base leading-relaxed text-cream/90">
        {afterInquiry.steps.map((step, i) => (
          <li key={step} className="flex gap-3">
            <span
              aria-hidden="true"
              className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent-light text-sm font-semibold text-navy"
            >
              {i + 1}
            </span>
            <span>{step}</span>
          </li>
        ))}
      </ol>
      <p className="mt-4 text-sm text-cream/75">{afterInquiry.tip}</p>
    </div>
  );
}
