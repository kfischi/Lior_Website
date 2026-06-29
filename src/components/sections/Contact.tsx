"use client";

import { useState, type FormEvent } from "react";
import { site } from "@/content/site";
import { Reveal } from "../ui/Reveal";
import {
  PhoneIcon,
  MailIcon,
  PinIcon,
  ClockIcon,
  WhatsAppIcon,
  CheckIcon,
  ArrowIcon,
} from "../icons";

export function Contact() {
  const { contact } = site;
  const [sent, setSent] = useState(false);

  const channels = [
    { icon: PhoneIcon, label: "טלפון", value: contact.phone, href: contact.phoneHref },
    {
      icon: WhatsAppIcon,
      label: "וואטסאפ",
      value: "שליחת הודעה",
      href: `https://wa.me/${contact.whatsapp.replace(/\D/g, "")}`,
    },
    { icon: MailIcon, label: 'דוא"ל', value: contact.email, href: `mailto:${contact.email}` },
    { icon: PinIcon, label: "כתובת", value: contact.address },
    { icon: ClockIcon, label: "שעות פעילות", value: contact.hours },
  ];

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // No backend wired yet — compose an email to the office as a graceful
    // fallback and show the confirmation state.
    const form = e.currentTarget;
    const data = new FormData(form);
    const body = [
      `שם: ${data.get("name") ?? ""}`,
      `טלפון: ${data.get("phone") ?? ""}`,
      `דוא"ל: ${data.get("email") ?? ""}`,
      "",
      `${data.get("message") ?? ""}`,
    ].join("\n");
    const subject = encodeURIComponent(`פנייה מהאתר — ${data.get("name") ?? ""}`);
    window.location.href = `mailto:${contact.email}?subject=${subject}&body=${encodeURIComponent(body)}`;
    setSent(true);
  }

  return (
    <section id="contact" className="py-24 md:py-28">
      <div className="container-page">
        <div className="overflow-hidden rounded-3xl border border-line bg-surface shadow-xl shadow-navy-900/5 lg:grid lg:grid-cols-[0.9fr_1.1fr]">
          {/* Info panel */}
          <div className="relative bg-navy-900 p-8 text-white md:p-10">
            <div
              aria-hidden
              className="pointer-events-none absolute -top-20 left-0 h-64 w-64 rounded-full bg-gold-500/10 blur-3xl"
            />
            <p className="eyebrow-rule mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-gold-300">
              {contact.eyebrow}
            </p>
            <h2 className="text-3xl font-bold sm:text-4xl">{contact.title}</h2>
            <p className="mt-4 leading-relaxed text-navy-100">{contact.subtitle}</p>

            <ul className="mt-9 space-y-5">
              {channels.map((c) => {
                const Icon = c.icon;
                const content = (
                  <div className="flex items-center gap-4">
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white/10 text-gold-400">
                      <Icon className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="text-xs uppercase tracking-wide text-navy-300">
                        {c.label}
                      </p>
                      <p className="font-medium text-white">{c.value}</p>
                    </div>
                  </div>
                );
                return (
                  <li key={c.label}>
                    {c.href ? (
                      <a
                        href={c.href}
                        target={c.href.startsWith("http") ? "_blank" : undefined}
                        rel={c.href.startsWith("http") ? "noopener noreferrer" : undefined}
                        className="block rounded-xl p-2 transition-colors hover:bg-white/5"
                      >
                        {content}
                      </a>
                    ) : (
                      <div className="p-2">{content}</div>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Form panel */}
          <div className="p-8 md:p-10">
            {sent ? (
              <Reveal className="flex h-full min-h-72 flex-col items-center justify-center text-center">
                <span className="grid h-16 w-16 place-items-center rounded-full bg-gold-100 text-gold-700">
                  <CheckIcon className="h-8 w-8" />
                </span>
                <h3 className="mt-5 text-2xl font-bold text-navy-900">
                  תודה על פנייתכם
                </h3>
                <p className="mt-3 max-w-sm text-muted">
                  נפתח עבורכם חלון לשליחת ההודעה. נחזור אליכם בהקדם האפשרי.
                </p>
              </Reveal>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field id="name" label="שם מלא" required />
                  <Field id="phone" label="טלפון" type="tel" required />
                </div>
                <Field id="email" label='דוא"ל' type="email" />
                <div>
                  <label htmlFor="message" className="mb-1.5 block text-sm font-medium text-navy-800">
                    פרטי הפנייה
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    required
                    className="w-full resize-y rounded-xl border border-line bg-background px-4 py-3 text-navy-900 outline-none transition-colors placeholder:text-muted/60 focus:border-gold-400 focus:ring-2 focus:ring-gold-200"
                    placeholder="כתבו לנו במה נוכל לסייע..."
                  />
                </div>
                <button
                  type="submit"
                  className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-gold-500 px-8 py-3.5 font-medium text-navy-900 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-gold-400 hover:shadow-md active:translate-y-0"
                >
                  שליחת פנייה
                  <ArrowIcon className="h-5 w-5" />
                </button>
                <p className="text-center text-xs text-muted">
                  הפנייה אינה מהווה ייעוץ משפטי ואינה יוצרת יחסי עו״ד–לקוח.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function Field({
  id,
  label,
  type = "text",
  required = false,
}: {
  id: string;
  label: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-navy-800">
        {label}
        {required && <span className="text-gold-600"> *</span>}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        required={required}
        className="w-full rounded-xl border border-line bg-background px-4 py-3 text-navy-900 outline-none transition-colors placeholder:text-muted/60 focus:border-gold-400 focus:ring-2 focus:ring-gold-200"
      />
    </div>
  );
}
