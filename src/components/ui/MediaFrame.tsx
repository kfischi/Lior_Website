import Image from "next/image";
import { availableImages } from "@/content/images";

type Kind = "hero" | "portrait" | "general";

type Props = {
  src: string;
  alt: string;
  kind?: Kind;
  className?: string;
  /** rendered priority for above-the-fold images */
  priority?: boolean;
};

/**
 * Renders a real photo when its file has been added to /public/images and
 * registered in src/content/images.ts. Until then it shows an on-brand
 * placeholder so the layout stays intentional (no broken images).
 */
export function MediaFrame({
  src,
  alt,
  kind = "general",
  className = "",
  priority = false,
}: Props) {
  const fileName = src.split("/").pop() ?? "";
  const hasImage = availableImages.has(fileName);

  return (
    <div
      className={`relative overflow-hidden rounded-2xl bg-navy-800 ring-1 ring-navy-700/40 ${className}`}
    >
      {hasImage ? (
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
        />
      ) : (
        <Placeholder kind={kind} label={alt} />
      )}
    </div>
  );
}

function Placeholder({ kind, label }: { kind: Kind; label: string }) {
  return (
    <div className="absolute inset-0 grid place-items-center bg-gradient-to-br from-navy-700 via-navy-800 to-navy-900">
      {/* subtle gold corner flourishes */}
      <span className="pointer-events-none absolute inset-4 rounded-xl border border-gold-500/20" />
      <div className="flex flex-col items-center gap-4 px-6 text-center">
        <Motif kind={kind} />
        <span className="text-xs font-medium uppercase tracking-[0.22em] text-gold-300/80">
          {label}
        </span>
      </div>
    </div>
  );
}

function Motif({ kind }: { kind: Kind }) {
  const common = "h-16 w-16 text-gold-400/70";
  if (kind === "portrait") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.2} className={common} aria-hidden>
        <circle cx="12" cy="8.5" r="3.5" />
        <path d="M5 20a7 7 0 0 1 14 0" />
      </svg>
    );
  }
  if (kind === "hero") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.2} className={common} aria-hidden>
        <path d="M3 21h18" />
        <path d="M5 21V8l7-4 7 4v13" />
        <path d="M9 21v-6h6v6" />
        <path d="M9 11h0M15 11h0" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.2} className={common} aria-hidden>
      <path d="M12 3v18M7 21h10M5 6h14" />
      <path d="M8 6 5 13h6L8 6ZM16 6l-3 7h6l-3-7Z" />
    </svg>
  );
}
