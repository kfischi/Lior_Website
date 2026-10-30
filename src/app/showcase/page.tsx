import type { Metadata } from 'next';
import Link from 'next/link';
import { CheckCircle2, Hammer, Lightbulb } from 'lucide-react';
import { brand } from '@/lib/brand';
import { buildMetadata } from '@/lib/seo';
import { showcase, type Capability, type CapabilityGroup, type CapabilityStatus } from '@/lib/showcase';
import { Reveal } from '@/components/motion/Reveal';
import { LiveEngine } from '@/components/showcase/LiveEngine';
import { TryPrompt } from '@/components/showcase/TryPrompt';

// A sales page for other firms: out of search, out of the menu, out of the sitemap.
export const metadata: Metadata = buildMetadata({
  title: showcase.eyebrow,
  description: showcase.intro,
  path: '/showcase',
  noindex: true,
});

const STATUS: Record<CapabilityStatus, { label: string; Icon: typeof CheckCircle2; className: string }> = {
  live: { label: 'פעיל באתר', Icon: CheckCircle2, className: 'bg-accent/10 text-accent' },
  building: { label: 'בבנייה', Icon: Hammer, className: 'bg-navy/10 text-navy' },
  planned: { label: 'בתכנון', Icon: Lightbulb, className: 'bg-ink/10 text-ink/80' },
};

const GROUP_ORDER: CapabilityGroup[] = ['chat', 'avatar', 'growth', 'trust', 'platform'];

function StatusBadge({ status }: { status: CapabilityStatus }) {
  const { label, Icon, className } = STATUS[status];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${className}`}>
      <Icon className="h-3.5 w-3.5" aria-hidden="true" />
      {label}
    </span>
  );
}

function Card({ item }: { item: Capability }) {
  return (
    <li className="flex flex-col rounded-2xl border border-navy/10 bg-white p-6 shadow-sm">
      <div className="mb-3 flex items-start justify-between gap-3">
        <h4 className="text-lg font-semibold text-navy">{item.title}</h4>
        <StatusBadge status={item.status} />
      </div>
      <p className="flex-1 leading-relaxed text-ink/85">{item.text}</p>
      {item.tryPrompt && item.status === 'live' && <TryPrompt text={item.tryPrompt} />}
    </li>
  );
}

export default function ShowcasePage() {
  const live = showcase.capabilities.filter((c) => c.status === 'live').length;
  const next = showcase.capabilities.length - live;
  const { whatsapp, email } = showcase.contact;
  const contactHref = whatsapp || (email ? `mailto:${email}` : '');

  return (
    <main id="main">
      <header className="bg-navy pb-16 pt-12 text-cream md:pb-24 md:pt-16">
        <div className="shell max-w-4xl">
          <Link href="/" className="mb-10 inline-block text-sm text-cream/80 underline-offset-4 hover:underline">
            חזרה לאתר
          </Link>
          <p className="eyebrow mb-4 text-accent-light">{showcase.eyebrow}</p>
          <h1 className="text-4xl font-semibold text-cream md:text-6xl">{showcase.title}</h1>
          <p className="mt-6 max-w-3xl text-lg leading-relaxed text-cream/85">{showcase.intro}</p>
          <dl className="mt-8 flex flex-wrap gap-x-10 gap-y-3 text-cream">
            <div>
              <dt className="text-sm text-cream/75">פעיל באתר</dt>
              <dd className="text-3xl font-semibold">{live}</dd>
            </div>
            <div>
              <dt className="text-sm text-cream/75">בבנייה ובתכנון</dt>
              <dd className="text-3xl font-semibold">{next}</dd>
            </div>
          </dl>
          <div className="mt-6">
            <LiveEngine />
          </div>
        </div>
      </header>

      <div className="bg-cream">
        <div className="shell max-w-6xl space-y-16 py-16 md:py-24">
          {GROUP_ORDER.map((group) => {
            const items = showcase.capabilities.filter((c) => c.group === group);
            if (items.length === 0) return null;
            const { title, text } = showcase.groups[group];
            return (
              <Reveal as="section" key={group}>
                <h2 className="text-3xl text-navy md:text-4xl">{title}</h2>
                <p className="mt-2 max-w-2xl text-ink/80">{text}</p>
                <ul className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                  {items.map((item) => (
                    <Card key={item.id} item={item} />
                  ))}
                </ul>
              </Reveal>
            );
          })}

          <Reveal as="section">
            <h2 className="text-3xl text-navy md:text-4xl">מה מאחורי הקלעים</h2>
            <ul className="mt-6 grid gap-3 md:grid-cols-2">
              {showcase.stack.map(([name, role]) => (
                <li key={name} className="rounded-xl border border-navy/10 bg-white px-5 py-4">
                  <p className="font-semibold text-navy">{name}</p>
                  <p className="text-sm text-ink/80">{role}</p>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal as="section">
            <h2 className="text-3xl text-navy md:text-4xl">חבילות להצעה</h2>
            <p className="mt-2 max-w-2xl text-ink/80">המחיר נקבע לפי היקף והתאמה, ומוצג בשיחה.</p>
            <ul className="mt-6 grid gap-5 md:grid-cols-3">
              {showcase.packages.map((p) => (
                <li key={p.name} className="rounded-2xl border border-navy/10 bg-white p-6 shadow-sm">
                  <h3 className="text-xl font-semibold text-navy">{p.name}</h3>
                  <p className="mt-1 text-sm text-ink/75">{p.forWho}</p>
                  <ul className="mt-4 space-y-2 text-ink/85">
                    {p.includes.map((line) => (
                      <li key={line} className="flex gap-2">
                        <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
                        <span>{line}</span>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal as="section" className="rounded-2xl bg-navy p-8 text-cream md:p-10">
            <h2 className="text-2xl text-cream md:text-3xl">שקיפות ואחריות</h2>
            <ul className="mt-4 space-y-2 text-cream/90">
              {showcase.notes.map((n) => (
                <li key={n} className="flex gap-2">
                  <span aria-hidden="true">•</span>
                  <span>{n}</span>
                </li>
              ))}
            </ul>
            {contactHref && (
              <a
                href={contactHref}
                target={whatsapp ? '_blank' : undefined}
                rel={whatsapp ? 'noopener noreferrer' : undefined}
                className="mt-8 inline-flex rounded-full bg-accent px-6 py-3 font-medium text-cream transition-colors hover:bg-accent/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-light"
              >
                רוצים כזה למשרד שלכם?
              </a>
            )}
            <p className="mt-6 text-sm text-cream/75">
              האתר והעוזרת שלו נבנו עבור {brand.firmName}. הפרטים הציבוריים שלו אינם חלק מההצעה.
            </p>
          </Reveal>
        </div>
      </div>
    </main>
  );
}
