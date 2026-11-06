'use client';

import { createContext, useContext, type ReactNode } from 'react';
import { brand as staticBrand, links } from '@/lib/brand';
import { toClientBrand, type ClientBrand } from '@/lib/client-brand';

const fallback: ClientBrand = toClientBrand(staticBrand, staticBrand.testimonials.length > 0);
const Ctx = createContext<ClientBrand>(fallback);

export function BrandProvider({ value, children }: { value: ClientBrand; children: ReactNode }) {
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

/** The brand inside client components. Falls back to brand.ts outside a provider. */
export function useBrand(): ClientBrand & { href: ReturnType<typeof links> } {
  const b = useContext(Ctx);
  return { ...b, href: links(b) };
}
