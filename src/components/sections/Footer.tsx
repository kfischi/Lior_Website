import Link from 'next/link';
import { brand, telHref, mailHref } from '@/lib/brand';
import { Facebook, Linkedin, Instagram, MapPin, Phone, Mail, Clock } from 'lucide-react';

const LEGAL_LINKS = [
  { href: '/legal/privacy', label: 'מדיניות פרטיות' },
  { href: '/legal/accessibility', label: 'הצהרת נגישות' },
  { href: '/legal/terms', label: 'תנאי שימוש' },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-navy text-cream/90">
      <div className="container grid gap-10 py-14 md:grid-cols-3">
        {/* Brand */}
        <div>
          <h2 className="font-heading text-xl font-bold text-cream">{brand.firmName}</h2>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-cream/70">
            {brand.tagline}
          </p>
          {(brand.social.facebook || brand.social.linkedin || brand.social.instagram) && (
            <div className="mt-5 flex gap-3">
              {brand.social.facebook && (
                <a href={brand.social.facebook} aria-label="פייסבוק" className="hover:text-bronze">
                  <Facebook className="h-5 w-5" />
                </a>
              )}
              {brand.social.linkedin && (
                <a href={brand.social.linkedin} aria-label="לינקדאין" className="hover:text-bronze">
                  <Linkedin className="h-5 w-5" />
                </a>
              )}
              {brand.social.instagram && (
                <a href={brand.social.instagram} aria-label="אינסטגרם" className="hover:text-bronze">
                  <Instagram className="h-5 w-5" />
                </a>
              )}
            </div>
          )}
        </div>

        {/* Contact */}
        <div>
          <h3 className="font-semibold text-cream">יצירת קשר</h3>
          <ul className="mt-4 space-y-3 text-sm">
            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-bronze" aria-hidden="true" />
              <span>
                {brand.address.street}, {brand.address.city}
              </span>
            </li>
            <li>
              <a href={telHref} className="flex items-center gap-2 hover:text-bronze">
                <Phone className="h-4 w-4 text-bronze" aria-hidden="true" />
                {brand.phone}
              </a>
            </li>
            <li>
              <a href={mailHref} className="flex items-center gap-2 hover:text-bronze">
                <Mail className="h-4 w-4 text-bronze" aria-hidden="true" />
                {brand.email}
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-bronze" aria-hidden="true" />
              {brand.hours}
            </li>
          </ul>
        </div>

        {/* Legal links */}
        <nav aria-label="קישורים משפטיים">
          <h3 className="font-semibold text-cream">מידע</h3>
          <ul className="mt-4 space-y-2 text-sm">
            {LEGAL_LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="hover:text-bronze">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="border-t border-cream/10">
        <div className="container flex flex-col items-center justify-between gap-2 py-5 text-xs text-cream/60 md:flex-row">
          <p>
            © {year} {brand.firmName}. כל הזכויות שמורות.
          </p>
          <p>
            האמור באתר אינו מהווה ייעוץ משפטי ואין להסתמך עליו ללא קבלת ייעוץ פרטני.
          </p>
        </div>
      </div>
    </footer>
  );
}
