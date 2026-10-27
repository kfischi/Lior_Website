import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]',
  {
    variants: {
      variant: {
        primary:
          'bg-navy text-cream shadow-sm hover:bg-navy/90 hover:shadow-md',
        accent:
          'bg-accent text-cream shadow-sm hover:bg-accent/90 hover:shadow-md',
        accentOnDark:
          'bg-accent-light text-navy shadow-sm hover:bg-accent-light/90 hover:shadow-md',
        outline:
          'border border-navy/25 bg-transparent text-navy hover:border-navy/50 hover:bg-navy/5',
        ghost: 'bg-transparent text-navy hover:bg-navy/5',
        link: 'bg-transparent text-navy underline-offset-4 hover:underline',
        onDark:
          'border border-cream/35 bg-transparent text-cream hover:bg-cream hover:text-navy',
      },
      size: {
        sm: 'h-9 px-4',
        md: 'h-11 px-6',
        lg: 'h-13 px-8 text-base',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      />
    );
  },
);
Button.displayName = 'Button';

export { buttonVariants };
