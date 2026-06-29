import { site } from "@/content/site";
import { PhoneIcon, MailIcon, PinIcon } from "./icons";

export function Footer() {
  const year = 2026;
  return (
    <footer className="bg-navy-900 text-navy-100">
      <div className="container-page grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr]">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-full border border-gold-500/60 bg-navy-800 font-display text-lg font-bold text-gold-400">
              {site.lawyerName.charAt(0)}
            </span>
            <span className="font-display text-xl font-bold text-white">
              {site.firmName}
            </span>
          </div>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-navy-200">
            {site.footer.blurb}
          </p>
        </div>

        {/* Quick links */}
        <nav aria-label="ניווט תחתון">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gold-300">
            ניווט
          </h3>
          <ul className="space-y-2.5">
            {site.nav.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="text-sm text-navy-200 transition-colors hover:text-gold-300"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Contact */}
        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gold-300">
            יצירת קשר
          </h3>
          <ul className="space-y-3 text-sm">
            <li>
              <a href={site.contact.phoneHref} className="flex items-center gap-2.5 text-navy-200 transition-colors hover:text-gold-300">
                <PhoneIcon className="h-4 w-4 shrink-0 text-gold-400" />
                {site.contact.phone}
              </a>
            </li>
            <li>
              <a href={`mailto:${site.contact.email}`} className="flex items-center gap-2.5 text-navy-200 transition-colors hover:text-gold-300">
                <MailIcon className="h-4 w-4 shrink-0 text-gold-400" />
                {site.contact.email}
              </a>
            </li>
            <li className="flex items-center gap-2.5 text-navy-200">
              <PinIcon className="h-4 w-4 shrink-0 text-gold-400" />
              {site.contact.address}
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 pb-16 lg:pb-0">
        <div className="container-page flex flex-col items-center justify-between gap-2 py-5 text-xs text-navy-300 sm:flex-row">
          <p>
            © {year} {site.firmName}. כל הזכויות שמורות.
          </p>
          <p>אתר זה אינו מהווה ייעוץ משפטי.</p>
        </div>
      </div>
    </footer>
  );
}
