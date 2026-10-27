/**
 * Removes personal details from visitor text before it reaches any model or any storage.
 * The chat asks people not to share them, but people do; this makes sure the system never holds them.
 * Pure and safe for client and server. Conservative on purpose: it only matches shapes that are
 * clearly a phone number, an Israeli ID number (checksum verified), a payment card (Luhn verified)
 * or an email address, so ordinary numbers ("עשרים וארבע שעות", "3 חודשים", dates) are left alone.
 */

export type RedactionKind = 'email' | 'card' | 'id' | 'phone';

export interface Redaction {
  text: string;
  /** What was removed, without the values. */
  found: RedactionKind[];
}

const TAGS: Record<RedactionKind, string> = {
  email: '[כתובת דוא״ל הוסרה]',
  card: '[מספר כרטיס הוסר]',
  id: '[מספר זהות הוסר]',
  phone: '[מספר טלפון הוסר]',
};

function luhn(digits: string): boolean {
  let sum = 0;
  let alt = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let n = Number(digits[i]);
    if (alt) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    sum += n;
    alt = !alt;
  }
  return sum % 10 === 0;
}

/** The check digit of an Israeli ID number (9 digits, weights 1 and 2). */
export function isIsraeliId(raw: string): boolean {
  const id = raw.padStart(9, '0');
  if (!/^\d{9}$/.test(id) || /^0+$/.test(id)) return false;
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    let n = Number(id[i]) * ((i % 2) + 1);
    if (n > 9) n -= 9;
    sum += n;
  }
  return sum % 10 === 0;
}

const EMAIL = /[\p{L}\p{N}._%+-]+@[\p{L}\p{N}-]+(?:\.[\p{L}\p{N}-]+)+/gu;
// Digits separated by single spaces or dashes: "4580 1234 5678 9010", "050-123-4567".
const DIGIT_RUN = /(?<![\d])(?:\+?\d[\d -]{6,}\d)(?![\d])/g;
// Israeli numbers: mobile 05x, landline 0[2-4,8,9], VoIP 07x, and +972 / 972 forms.
const IL_PHONE = /^(?:\+?972|0)(?:5\d|7\d|[23489])\d{7}$/;

export function redactPersonalDetails(input: string): Redaction {
  const found = new Set<RedactionKind>();
  let text = input.replace(EMAIL, () => {
    found.add('email');
    return TAGS.email;
  });

  text = text.replace(DIGIT_RUN, (run) => {
    const digits = run.replace(/\D/g, '');
    if (digits.length >= 13 && digits.length <= 19 && luhn(digits)) {
      found.add('card');
      return TAGS.card;
    }
    if (IL_PHONE.test(digits)) {
      found.add('phone');
      return TAGS.phone;
    }
    if (digits.length === 9 || digits.length === 8) {
      if (isIsraeliId(digits)) {
        found.add('id');
        return TAGS.id;
      }
    }
    return run;
  });

  return { text, found: [...found] };
}
