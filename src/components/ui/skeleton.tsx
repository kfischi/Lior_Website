import { cn } from '@/lib/utils';

/** Subtle shimmer skeleton for loading states. */
export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn('animate-pulse rounded-md bg-navy/10', className)}
    />
  );
}
