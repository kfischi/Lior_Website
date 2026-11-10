'use client';

import * as React from 'react';
import { Button, type ButtonProps } from '@/components/ui/button';
import { useConcierge } from './ConciergeProvider';

/**
 * A button that opens the conversation. By default it starts the guided
 * intake (the "book a consultation" path); set `intake={false}` to just open
 * the chat for questions, or `lecture` to start the guided booking of a talk.
 */
export function OpenChatButton({
  intake = true,
  lecture = false,
  children,
  ...props
}: ButtonProps & { intake?: boolean; lecture?: boolean }) {
  const { startIntake, startLectureIntake, openPanel } = useConcierge();
  const onClick = lecture ? startLectureIntake : intake ? startIntake : openPanel;
  return (
    <Button type="button" onClick={onClick} {...props}>
      {children}
    </Button>
  );
}
