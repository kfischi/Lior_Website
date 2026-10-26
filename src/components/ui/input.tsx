import * as React from 'react';
import { cn } from '@/lib/utils';

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => (
    <input
      type={type}
      ref={ref}
      className={cn(
        'flex h-11 w-full rounded-md border border-navy/15 bg-cream/40 px-3.5 py-2 text-sm text-ink shadow-sm transition-colors',
        'placeholder:text-ink/40 focus-visible:border-bronze focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bronze/30',
        'disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-red-500',
        className,
      )}
      {...props}
    />
  ),
);
Input.displayName = 'Input';
