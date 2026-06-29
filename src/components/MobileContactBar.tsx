import { site } from "@/content/site";
import { PhoneIcon, WhatsAppIcon } from "./icons";

/** Fixed call / WhatsApp bar shown on small screens for quick conversion. */
export function MobileContactBar() {
  const { contact } = site;
  const wa = `https://wa.me/${contact.whatsapp.replace(/\D/g, "")}`;
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-2 border-t border-line bg-surface/95 shadow-[0_-4px_20px_rgba(10,20,40,0.08)] backdrop-blur lg:hidden">
      <a
        href={contact.phoneHref}
        className="flex items-center justify-center gap-2 py-3.5 text-sm font-semibold text-navy-800 transition-colors hover:bg-navy-50"
      >
        <PhoneIcon className="h-5 w-5 text-gold-600" />
        חיוג
      </a>
      <a
        href={wa}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 bg-gold-500 py-3.5 text-sm font-semibold text-navy-900 transition-colors hover:bg-gold-400"
      >
        <WhatsAppIcon className="h-5 w-5" />
        וואטסאפ
      </a>
    </div>
  );
}
