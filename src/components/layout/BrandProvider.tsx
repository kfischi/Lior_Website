'use client';

import { createContext, useContext, type ReactNode } from 'react';
import { links } from '@/lib/brand-links';
import type { ClientBrand } from '@/lib/client-brand';

const Ctx = createContext<ClientBrand | null>(null);

export function BrandProvider({ value, children }: { value: ClientBrand; children: ReactNode }) {
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

/** The brand inside client components. Falls back to brand.ts outside a provider. */
export function useBrand(): ClientBrand & { href: ReturnType<typeof links> } {
  const b = useContext(Ctx);
  if (!b) throw new Error('useBrand must be used inside <BrandProvider>');
  return { ...b, href: links(b) };
}
