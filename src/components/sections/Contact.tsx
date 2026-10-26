import { Clock, Lock, MapPin, Mail, MessageCircle, Phone } from 'lucide-react';
import { brand, telHref, whatsappHref, mailHref } from '@/lib/brand';
import { ConciergePanel } from '@/components/ai/ConciergePanel';
import { Reveal } from '@/components/motion/Reveal';

const POINTS = [
  { icon: MessageCircle, text: 'מספרים במה מדובר, בלי לפרט את האירוע' },
  { icon: Lock, text: 'הפרטים נשלחים למשרד רק באישור שלכם' },
  { icon: Clock, text: 'מענה ראשוני מיד, והמשרד חוזר אליכם בהקדם' },
];

/**
 * Contact is a conversation, not a form: the panel on the right is the same
 * thread as the floating window (shared state in ConciergeProvider).
 */
export function Contact() {
  return (
    <section id="contact" aria-labelledby="contact-title" className="section bg-navy text-cream">
      <div className="shell grid gap-12 lg:grid-cols-2 lg:gap-16">
        <Reveal>
          <p className="eyebrow mb-3 text-accent-light">זמינים עבורכם</p>
          <h2 id="contact-title" className="text-3xl text-cream md:text-4xl">
            מתחילים בשיחה
          </h2>
          <p className="mt-6 max-w-md leading-relaxed text-cream/80">
            במקום למלא טופס, פשוט שוחחו איתנו. העוזר הדיגיטלי של המשרד יענה על שאלות, ואם תרצו, יאסוף
            כמה פרטים קצרים כדי שנחזור אליכם.
          </p>

          <ul className="mt-8 space-y-3">
            {POINTS.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-start gap-3 text-cream/90">
                <Icon className="mt-0.5 h-5 w-5 shrink-0 text-accent-light" aria-hidden="true" />
                {text}
              </li>
            ))}
          </ul>

          <p className="mt-10 text-sm font-medium text-cream/70">מעדיפים ליצור קשר ישירות?</p>
          <ul className="mt-3 space-y-3 text-cream/90">
            <li>
              <a href={telHref} className="flex items-center gap-3 hover:text-accent-light">
                <Phone className="h-5 w-5 text-accent-light" aria-hidden="true" />
                {brand.phone}
              </a>
            </li>
            <li>
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 hover:text-accent-light"
              >
                <MessageCircle className="h-5 w-5 text-accent-light" aria-hidden="true" />
                וואטסאפ
              </a>
            </li>
            <li>
              <a href={mailHref} className="flex items-center gap-3 hover:text-accent-light">
                <Mail className="h-5 w-5 text-accent-light" aria-hidden="true" />
                {brand.email}
              </a>
            </li>
            <li className="flex items-center gap-3">
              <MapPin className="h-5 w-5 text-accent-light" aria-hidden="true" />
              {brand.address.street}, {brand.address.city}
            </li>
          </ul>
        </Reveal>

        <Reveal delay={0.1}>
          <ConciergePanel className="h-[34rem] max-h-[85dvh] rounded-2xl shadow-2xl" />
        </Reveal>
      </div>
    </section>
  );
}
