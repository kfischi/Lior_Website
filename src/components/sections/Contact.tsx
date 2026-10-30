import Image from 'next/image';
import { Clock, MapPin, Mail, Phone, type LucideIcon } from 'lucide-react';
import { brand, telHref, whatsappHref, mailHref } from '@/lib/brand';
import { WhatsAppIcon } from '@/components/ui/whatsapp-icon';
import { Reveal } from '@/components/motion/Reveal';
import { CallbackForm } from './CallbackForm';

interface ContactItem {
  label: string;
  value: string;
  href?: string;
  external?: boolean;
  icon: LucideIcon | typeof WhatsAppIcon;
}

const ITEMS: ContactItem[] = [
  { label: 'טלפון', value: brand.phone, href: telHref, icon: Phone },
  { label: 'וואטסאפ', value: brand.phone, href: whatsappHref, external: true, icon: WhatsAppIcon },
  { label: 'דוא״ל', value: brand.email, href: mailHref, icon: Mail },
  {
    label: 'כתובת',
    value: `${brand.address.street}, ${brand.address.city}`,
    href: brand.mapUrl,
    external: true,
    icon: MapPin,
  },
  { label: 'שעות', value: brand.hours, icon: Clock },
];

/** Direct contact details. The conversation itself lives in the floating chat. */
export function Contact() {
  return (
    <section
      id="contact"
      aria-labelledby="contact-title"
      className="section grain relative overflow-hidden bg-navy text-cream"
    >
      <Image
        src={brand.logo.iconLight}
        alt=""
        width={brand.logo.iconSize.width}
        height={brand.logo.iconSize.height}
        aria-hidden="true"
        className="pointer-events-none absolute -end-10 bottom-0 h-[40rem] w-auto opacity-[0.05]"
      />
      <div className="shell relative z-10 max-w-4xl">
        <Reveal className="text-center">
          <p className="eyebrow mb-3 text-accent-light">זמינים עבורכם</p>
          <h2 id="contact-title" className="text-4xl text-cream md:text-5xl">
            נשמח לשמוע מכם
          </h2>
          <p className="mx-auto mt-6 max-w-xl leading-relaxed text-cream/80">
            אפשר לשוחח עם העוזרת של ליאור, להתקשר או לכתוב בוואטסאפ. בפנייה הראשונה אין צורך לפרט את האירוע.
          </p>
        </Reveal>

        <Reveal delay={0.05}>
          <div className="mx-auto mt-10 max-w-2xl rounded-3xl border border-cream/15 bg-cream/5 p-6 md:p-8">
            <h3 className="text-2xl text-cream">השאירו טלפון ונחזור אליכם</h3>
            <div className="mt-5">
              <CallbackForm />
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <ul className="mt-10 grid gap-4 sm:grid-cols-2">
            {ITEMS.map(({ label, value, href, external, icon: Icon }) => {
              const body = (
                <>
                  <Icon className="h-6 w-6 shrink-0 text-accent-light" aria-hidden="true" />
                  <span className="flex flex-col leading-snug">
                    <span className="text-xs text-cream/70">{label}</span>
                    <span className="text-lg font-medium text-cream">{value}</span>
                  </span>
                </>
              );
              const base = 'flex items-center gap-4 rounded-2xl border border-cream/15 bg-cream/5 p-5';
              return (
                <li key={label} className="sm:last:odd:col-span-2">
                  {href ? (
                    <a
                      href={href}
                      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                      className={`${base} transition-colors hover:border-accent-light hover:bg-cream/10`}
                    >
                      {body}
                    </a>
                  ) : (
                    <div className={base}>{body}</div>
                  )}
                </li>
              );
            })}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
