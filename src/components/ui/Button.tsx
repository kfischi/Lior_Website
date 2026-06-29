import Link from "next/link";
import type { AnchorHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "ghost";
type Size = "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-medium cursor-pointer transition-all duration-200 ease-out focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-60 disabled:cursor-not-allowed";

const variants: Record<Variant, string> = {
  // Gold CTA — the conversion action
  primary:
    "bg-gold-500 text-navy-900 shadow-sm hover:bg-gold-400 hover:shadow-md hover:-translate-y-0.5 active:translate-y-0",
  // Navy outline / fill for secondary emphasis
  secondary:
    "bg-navy-800 text-white hover:bg-navy-700 hover:-translate-y-0.5 active:translate-y-0",
  ghost:
    "bg-transparent text-navy-800 border border-navy-200 hover:border-gold-400 hover:text-gold-700",
};

const sizes: Record<Size, string> = {
  md: "px-6 py-2.5 text-[0.95rem]",
  lg: "px-8 py-3.5 text-base",
};

type Props = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  variant?: Variant;
  size?: Size;
};

export function Button({
  href,
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...props
}: Props) {
  const cls = `${base} ${variants[variant]} ${sizes[size]} ${className}`;
  const isAnchor = href.startsWith("#") || href.startsWith("tel:") || href.startsWith("mailto:") || href.startsWith("http");

  if (isAnchor) {
    return (
      <a href={href} className={cls} {...props}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={cls}>
      {children}
    </Link>
  );
}
