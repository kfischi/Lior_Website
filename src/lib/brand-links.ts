/** Contact links built from any brand-shaped object. Kept apart from brand.ts so the browser need not load all of its content. */
export function links(b: { phoneE164: string; whatsapp: string; email: string }) {
  return {
    tel: `tel:+${b.phoneE164}`,
    whatsapp: `https://wa.me/${b.whatsapp}`,
    mail: `mailto:${b.email}`,
  };
}
