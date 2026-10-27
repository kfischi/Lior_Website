'use client';

import * as React from 'react';
import { Button, type ButtonProps } from '@/components/ui/button';
import { useConcierge } from './ConciergeProvider';

/**
 * A button that opens the conversation. By default it starts the guided
 * intake (the "book a consultation" path); set `intake={false}` to just open
 * the chat for questions.
 */
export function OpenChatButton({
  intake = true,
  children,
  ...props
}: ButtonProps & { intake?: boolean }) {
  const { startIntake, openPanel } = useConcierge();
  return (
    <Button type="button" onClick={intake ? startIntake : openPanel} {...props}>
      {children}
    </Button>
  );
}
