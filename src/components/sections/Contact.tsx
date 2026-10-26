'use client';

import * as React from 'react';
import { CheckCircle2, Loader2, Phone, MessageCircle, Mail, MapPin } from 'lucide-react';
import { brand, telHref, whatsappHref, mailHref } from '@/lib/brand';
import { submitLead, type LeadState } from '@/lib/actions/lead';
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
import { Reveal } from '@/components/motion/Reveal';

const initialState: LeadState = { status: 'idle' };

export function Contact() {
  const [state, formAction, pending] = React.useActionState(submitLead, initialState);
  const [matter, setMatter] = React.useState('');

  return (
    <section id="contact" aria-labelledby="contact-title" className="section bg-navy text-cream">
      <div className="shell grid gap-12 lg:grid-cols-2 lg:gap-16">
        <Reveal>
          <p className="eyebrow mb-3">זמינים עבורכם</p>
          <h2 id="contact-title" className="text-3xl text-cream md:text-4xl">
            קביעת ייעוץ
          </h2>
          <p className="mt-6 max-w-md leading-relaxed text-cream/80">
            השאירו פרטים ונחזור אליכם בהקדם, או צרו קשר ישירות בכל אחת מהדרכים:
          </p>

          <ul className="mt-8 space-y-4 text-cream/90">
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
            <li className="flex items-center gap-3">
              <MapPin className="h-5 w-5 text-bronze" aria-hidden="true" />
              {brand.address.street}, {brand.address.city}
            </li>
          </ul>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="rounded-2xl bg-cream p-6 text-ink shadow-2xl md:p-8">
            {state.status === 'sent' || state.status === 'handoff' ? (
              <div
                role="status"
                className="flex h-full min-h-80 flex-col items-center justify-center text-center"
              >
                <CheckCircle2 className="h-14 w-14 text-bronze" aria-hidden="true" />
                {state.status === 'sent' ? (
                  <>
                    <h3 className="mt-4 font-heading text-xl font-bold text-navy">הפנייה נשלחה!</h3>
                    <p className="mt-2 text-ink/65">
                      קיבלנו את הפרטים ונחזור אליכם בהקדם. אפשר גם להמשיך את השיחה בוואטסאפ.
                    </p>
                  </>
                ) : (
                  <>
                    <h3 className="mt-4 font-heading text-xl font-bold text-navy">רגע אחד לפני שמסיימים</h3>
                    <p className="mt-2 text-ink/65">
                      הכנו לכם הודעה מוכנה. לחצו כדי לשלוח אותה למשרד בוואטסאפ.
                    </p>
                  </>
                )}
                {state.waHref && (
                  <Button asChild variant="accent" size="lg" className="mt-6">
                    <a href={state.waHref} target="_blank" rel="noopener noreferrer">
                      <MessageCircle className="h-5 w-5" />
                      {state.status === 'sent' ? 'המשך בוואטסאפ' : 'שליחה בוואטסאפ'}
                    </a>
                  </Button>
                )}
              </div>
            ) : (
              <form action={formAction} className="space-y-5" noValidate>
                {/* Honeypot */}
                <div className="hidden" aria-hidden="true">
                  <label htmlFor="company">חברה</label>
                  <input id="company" name="company" tabIndex={-1} autoComplete="off" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name">שם מלא *</Label>
                  <Input
                    id="name"
                    name="name"
                    required
                    autoComplete="name"
                    placeholder="ישראל ישראלי"
                    aria-invalid={Boolean(state.errors?.name)}
                  />
                  {state.errors?.name && (
                    <p className="text-sm text-red-600">{state.errors.name}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">טלפון *</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    inputMode="tel"
                    required
                    autoComplete="tel"
                    placeholder="050-0000000"
                    aria-invalid={Boolean(state.errors?.phone)}
                  />
                  {state.errors?.phone && (
                    <p className="text-sm text-red-600">{state.errors.phone}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="matter">סוג העניין</Label>
                  <input type="hidden" name="matter" value={matter} />
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

                {state.status === 'error' && state.message && (
                  <p role="alert" className="text-sm font-medium text-red-600">
                    {state.message}
                  </p>
                )}

                <Button type="submit" variant="accent" size="lg" className="w-full" disabled={pending}>
                  {pending ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      שולח...
                    </>
                  ) : (
                    'שליחה'
                  )}
                </Button>
                <p className="text-center text-xs text-ink/50">
                  שליחת הפרטים אינה יוצרת יחסי עו״ד–לקוח ואינה מהווה ייעוץ משפטי.
                </p>
              </form>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
