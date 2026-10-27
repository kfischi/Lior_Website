import {
  Scale,
  Users,
  Building2,
  Briefcase,
  Gavel,
  ShieldCheck,
  HeartHandshake,
  Award,
  Eye,
  Clock,
  type LucideIcon,
} from 'lucide-react';

/**
 * Maps the icon name strings stored in brand.ts to lucide-react components,
 * so brand.ts stays plain serializable data (no imports).
 */
const ICONS: Record<string, LucideIcon> = {
  Scale,
  Users,
  Building2,
  Briefcase,
  Gavel,
  ShieldCheck,
  HeartHandshake,
  Award,
  Eye,
  Clock,
};

export function Icon({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  const Cmp = ICONS[name] ?? Scale;
  return <Cmp className={className} aria-hidden="true" />;
}
