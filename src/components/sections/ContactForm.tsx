'use client';

import * as React from 'react';
import { brand, telHref, whatsappHref, mailHref } from '@/lib/brand';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { Phone, MessageCircle, Mail, CheckCircle2, Loader2 } from 'lucide-react';

type Status = 'idle' | 'sending' | 'success' | 'error';

/**
 * Smart lead form. Submits to the internal /api/lead route (which relays to
 * n8n server-side). Uses an onSubmit handler with preventDefault — no full-page
 * reload — and shows inline validation + a success state.
 */
export function ContactForm() {
  const [status, setStatus] = React.useState<Status>('idle');
  const [error, setError] = React.useState('');
  const [matter, setMatter] = React.useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === 'sending') return;
    setStatus('sending');
    setError('');

    const fd = new FormData(e.currentTarget);
    const payload = {
      name: String(fd.get('name') || ''),
      phone: String(fd.get('phone') || ''),
      matter,
      message: String(fd.get('message') || ''),
      company: String(fd.get('company') || ''), // honeypot
    };

    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (json.ok) {
        setStatus('success');
      } else {
        setStatus('error');
        setError(json.error || 'אירעה שגיאה. נסו שוב.');
      }
    } catch {
      setStatus('error');
      setError('אירעה שגיאה בשליחה. נסו שוב או התקשרו אלינו.');
    }
  }

  return (
    <section id="contact" aria-labelledby="contact-title" className="bg-navy text-cream">
      <div className="container-section">
        <div className="grid gap-12 lg:grid-cols-2">
          {/* Info side */}
          <div>
            <p className="font-medium text-bronze">זמינים עבורכם</p>
            <h2 id="contact-title" className="mt-2 text-3xl font-bold md:text-4xl">
              קביעת ייעוץ
            </h2>
            <p className="mt-6 max-w-md leading-relaxed text-cream/80">
              השאירו פרטים ונחזור אליכם בהקדם, או צרו קשר ישירות בכל אחת מהדרכים:
            </p>

            <ul className="mt-8 space-y-4">
              <li>
                <a href={telHref} className="flex items-center gap-3 hover:text-bronze">
                  <Phone className="h-5 w-5 text-bronze" aria-hidden="true" />
                  {brand.phone}
                </a>
              </li>
              <li>
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 hover:text-bronze"
                >
                  <MessageCircle className="h-5 w-5 text-bronze" aria-hidden="true" />
                  וואטסאפ
                </a>
              </li>
              <li>
                <a href={mailHref} className="flex items-center gap-3 hover:text-bronze">
                  <Mail className="h-5 w-5 text-bronze" aria-hidden="true" />
                  {brand.email}
                </a>
              </li>
            </ul>
          </div>

          {/* Form side */}
          <div className="rounded-xl bg-cream p-6 text-ink shadow-xl md:p-8">
            {status === 'success' ? (
              <div
                role="status"
                className="flex h-full min-h-[20rem] flex-col items-center justify-center text-center"
              >
                <CheckCircle2 className="h-14 w-14 text-accent" aria-hidden="true" />
                <h3 className="mt-4 text-xl font-bold text-navy">הפנייה נשלחה!</h3>
                <p className="mt-2 text-muted-foreground">
                  תודה שפניתם אלינו. נחזור אליכם בהקדם האפשרי.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-5">
                {/* Honeypot — hidden from users */}
                <div className="hidden" aria-hidden="true">
                  <label htmlFor="company">חברה</label>
                  <input id="company" name="company" tabIndex={-1} autoComplete="off" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name">שם מלא *</Label>
                  <Input id="name" name="name" required autoComplete="name" placeholder="ישראל ישראלי" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">טלפון *</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    inputMode="tel"
                    autoComplete="tel"
                    placeholder="050-0000000"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="matter">סוג העניין</Label>
                  <Select value={matter} onValueChange={setMatter}>
                    <SelectTrigger id="matter" aria-label="בחירת סוג העניין">
                      <SelectValue placeholder="בחרו תחום" />
                    </SelectTrigger>
                    <SelectContent>
                      {brand.practiceAreas.map((a) => (
                        <SelectItem key={a.slug} value={a.title}>
                          {a.title}
                        </SelectItem>
                      ))}
                      <SelectItem value="אחר">אחר</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">פרטים נוספים</Label>
                  <Textarea id="message" name="message" placeholder="ספרו לנו בקצרה על העניין..." />
                </div>

                {status === 'error' && (
                  <p role="alert" className="text-sm font-medium text-destructive">
                    {error}
                  </p>
                )}

                <Button
                  type="submit"
                  variant="accent"
                  size="lg"
                  className="w-full"
                  disabled={status === 'sending'}
                >
                  {status === 'sending' ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      שולח...
                    </>
                  ) : (
                    'שליחה'
                  )}
                </Button>
                <p className="text-center text-xs text-muted-foreground">
                  שליחת הפרטים אינה יוצרת יחסי עו״ד–לקוח ואינה מהווה ייעוץ משפטי.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
