'use client';

import { MessageCircle } from 'lucide-react';
import { useConcierge } from '@/components/ai/ConciergeProvider';

/** Opens the assistant and sends a line, so a visitor can try a capability on the spot. */
export function TryPrompt({ text }: { text: string }) {
  const { openPanel, send } = useConcierge();
  return (
    <button
      type="button"
      onClick={() => {
        openPanel();
        window.setTimeout(() => send(text), 250);
      }}
      className="mt-4 inline-flex items-center gap-2 rounded-full border border-accent/40 bg-white px-4 py-2 text-sm font-medium text-navy transition-colors hover:border-accent hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
    >
      <MessageCircle className="h-4 w-4 text-accent" aria-hidden="true" />
      לנסות עכשיו: ״{text}״
    </button>
  );
}
