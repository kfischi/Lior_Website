import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Phone, Mail, Clock, Printer } from 'lucide-react';
import { brand, telHref, mailHref } from '@/lib/brand';

/** Inline brand glyphs (lucide dropped brand logos in v1). */
function Facebook({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0 0 22 12Z" />
    </svg>
  );
}
function Linkedin({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14ZM7.12 20.45H3.55V9h3.57v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.22.79 24 1.77 24h20.45c.98 0 1.78-.78 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z" />
    </svg>
  );
}
function Instagram({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.72 3.72 0 0 1-1.38-.9 3.72 3.72 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23C2.17 15.58 2.16 15.2 2.16 12s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.17 8.8 2.16 12 2.16Zm0 3.24A6.6 6.6 0 1 0 18.6 12 6.6 6.6 0 0 0 12 5.4Zm0 10.89A4.29 4.29 0 1 1 16.29 12 4.29 4.29 0 0 1 12 16.29Zm6.86-11.15a1.54 1.54 0 1 1-1.54-1.54 1.54 1.54 0 0 1 1.54 1.54Z" />
    </svg>
  );
}

const LEGAL_LINKS = [
  { href: '/legal/privacy', label: 'מדיניות פרטיות' },
  { href: '/legal/accessibility', label: 'הצהרת נגישות' },
  { href: '/legal/terms', label: 'תנאי שימוש' },
];

export function Footer() {
  const year = new Date().getFullYear();
  const { facebook, linkedin, instagram } = brand.social;

  return (
    <footer className="border-t border-cream/10 bg-navy text-cream/85">
      <div className="shell grid gap-10 py-16 md:grid-cols-3">
        <div>
          <h2 className="sr-only">{brand.firmName}</h2>
          <Image
            src={brand.logo.lockup}
            alt=""
            width={brand.logo.lockupSize.width}
            height={brand.logo.lockupSize.height}
            className="h-auto w-80 max-w-full"
          />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-cream/60">{brand.tagline}</p>
          {(facebook || linkedin || instagram) && (
            <div className="mt-5 flex gap-3">
              {facebook && (
                <a href={facebook} aria-label="פייסבוק" className="text-cream/70 hover:text-bronze">
                  <Facebook className="h-5 w-5" />
                </a>
              )}
              {linkedin && (
                <a href={linkedin} aria-label="לינקדאין" className="text-cream/70 hover:text-bronze">
                  <Linkedin className="h-5 w-5" />
                </a>
              )}
              {instagram && (
                <a href={instagram} aria-label="אינסטגרם" className="text-cream/70 hover:text-bronze">
                  <Instagram className="h-5 w-5" />
                </a>
              )}
            </div>
          )}
        </div>

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
            {brand.fax && (
              <li className="flex items-center gap-2">
                <Printer className="h-4 w-4 text-bronze" aria-hidden="true" />
                <span>
                  פקס: <span dir="ltr">{brand.fax}</span>
                </span>
              </li>
            )}
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
        <div className="shell flex flex-col items-center justify-between gap-2 py-5 text-xs text-cream/55 md:flex-row">
          <p>
            © {year} {brand.firmName}. כל הזכויות שמורות.
          </p>
          <p>האמור באתר אינו מהווה ייעוץ משפטי ואין להסתמך עליו ללא קבלת ייעוץ פרטני.</p>
        </div>
      </div>
    </footer>
  );
}
