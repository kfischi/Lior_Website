import type { SVGProps } from "react";

/* Minimal Lucide-style line icons (no emoji). 1.6 stroke, currentColor. */

type IconProps = SVGProps<SVGSVGElement>;

function Base({ children, ...props }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  );
}

export const ScaleIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="M12 3v18" />
    <path d="M7 21h10" />
    <path d="M5 6h14" />
    <path d="M8 6 5 13h6L8 6Z" />
    <path d="M16 6l-3 7h6l-3-7Z" />
    <path d="M5 13a3 3 0 0 0 6 0" />
    <path d="M13 13a3 3 0 0 0 6 0" />
  </Base>
);

export const BuildingIcon = (p: IconProps) => (
  <Base {...p}>
    <rect x="4" y="3" width="16" height="18" rx="1.5" />
    <path d="M8 7h2M14 7h2M8 11h2M14 11h2M8 15h2M14 15h2" />
    <path d="M10 21v-3h4v3" />
  </Base>
);

export const HomeIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="m3 10 9-7 9 7" />
    <path d="M5 9v11h14V9" />
    <path d="M10 20v-6h4v6" />
  </Base>
);

export const DocumentIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="M6 2h8l4 4v16H6z" />
    <path d="M14 2v4h4" />
    <path d="M9 12h6M9 16h6" />
  </Base>
);

export const UsersIcon = (p: IconProps) => (
  <Base {...p}>
    <circle cx="9" cy="8" r="3" />
    <path d="M3 20a6 6 0 0 1 12 0" />
    <path d="M16 5.5a3 3 0 0 1 0 5.8" />
    <path d="M17 14.5a6 6 0 0 1 4 5.5" />
  </Base>
);

export const ShieldIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="M12 3 5 6v5c0 4.5 3 8 7 10 4-2 7-5.5 7-10V6l-7-3Z" />
    <path d="m9 12 2 2 4-4" />
  </Base>
);

export const PhoneIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" />
  </Base>
);

export const MailIcon = (p: IconProps) => (
  <Base {...p}>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="m3 7 9 6 9-6" />
  </Base>
);

export const PinIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11Z" />
    <circle cx="12" cy="10" r="2.5" />
  </Base>
);

export const ClockIcon = (p: IconProps) => (
  <Base {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </Base>
);

export const WhatsAppIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="M3 21l1.6-4.5A8 8 0 1 1 8 19.4L3 21Z" />
    <path d="M9 8.5c0 4 2.5 6.5 6.5 6.5.6 0 1-.5 1-1l-.2-1.2a.8.8 0 0 0-.8-.6l-1.3.2a5 5 0 0 1-2.6-2.6l.2-1.3a.8.8 0 0 0-.6-.8L10 7.5c-.5 0-1 .4-1 1Z" />
  </Base>
);

export const MenuIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="M4 6h16M4 12h16M4 18h16" />
  </Base>
);

export const CloseIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="M6 6l12 12M18 6 6 18" />
  </Base>
);

export const CheckIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="M4 12.5 9 17.5 20 6" />
  </Base>
);

export const QuoteIcon = (p: IconProps) => (
  <Base {...p} fill="currentColor" stroke="none">
    <path d="M9 7H5a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h2v2a2 2 0 0 1-2 2H4v2h1a4 4 0 0 0 4-4V7Zm11 0h-4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h2v2a2 2 0 0 1-2 2h-1v2h1a4 4 0 0 0 4-4V7Z" />
  </Base>
);

// RTL-aware "continue" arrow (points left)
export const ArrowIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="M19 12H5" />
    <path d="m11 6-6 6 6 6" />
  </Base>
);

export const ChevronIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="m6 9 6 6 6-6" />
  </Base>
);

export const iconMap = {
  scale: ScaleIcon,
  building: BuildingIcon,
  home: HomeIcon,
  document: DocumentIcon,
  users: UsersIcon,
  shield: ShieldIcon,
} as const;

export type IconName = keyof typeof iconMap;
