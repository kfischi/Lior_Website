import { Award, Gavel, Landmark, Scale, type LucideIcon } from 'lucide-react';
import { brand } from '@/lib/brand';
import { Reveal } from '@/components/motion/Reveal';

/** One icon per credential, in the order they are listed in `brand.about.credentials`. */
const ICONS: LucideIcon[] = [Scale, Landmark, Gavel, Award];

/**
 * The proof a visitor looks for in the first seconds: how long, and where from. It shows only what the brand file
 * states (years of experience, listed credentials), never a placeholder.
 */
export function TrustBar() {
  const stats = brand.trustStats;
  const credentials = brand.about.credentials.slice(0, 3);
  if (stats.length === 0 && credentials.length === 0) return null;

  return (
    <section aria-label="ניסיון והסמכות" className="border-b border-navy/10 bg-white">
      <Reveal className="shell">
        <ul className="grid divide-navy/10 sm:grid-cols-2 sm:divide-x-0 lg:grid-cols-4 lg:divide-x lg:divide-x-reverse">
          {stats.map((s) => (
            <li key={s.label} className="flex items-center gap-4 px-2 py-5 lg:px-6">
              <span className="font-heading text-5xl font-semibold leading-none text-accent">{s.value}</span>
              <span className="text-base font-medium leading-snug text-navy">{s.label}</span>
            </li>
          ))}
          {credentials.map((text, i) => {
            const Icon = ICONS[i % ICONS.length] ?? Scale;
            return (
              <li key={text} className="flex items-center gap-4 px-2 py-5 lg:px-6">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent">
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </span>
                <span className="text-base font-medium leading-snug text-navy">{text}</span>
              </li>
            );
          })}
        </ul>
      </Reveal>
    </section>
  );
}
