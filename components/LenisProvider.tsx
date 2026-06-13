import { ReactNode } from "react";

// Lenis removed — native scroll is more stable across devices
export default function LenisProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
