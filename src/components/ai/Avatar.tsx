'use client';

import Image from 'next/image';
import { useBrand } from '@/components/layout/BrandProvider';
import { cn } from '@/lib/utils';

/** The assistant's round photo. It is a brand image, so it carries no alt text. */
export function Avatar({ className, speaking }: { className?: string; speaking?: boolean }) {
  const brand = useBrand();
  return (
    <Image
      src={brand.chat.avatar}
      alt=""
      width={96}
      height={96}
      className={cn(
        'shrink-0 rounded-full object-cover ring-2 ring-accent-light/70',
        speaking && 'motion-safe:animate-speaking',
        className,
      )}
    />
  );
}
