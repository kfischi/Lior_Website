// app/layout.tsx of the host project: add the two marked lines. (Paths here are relative to this example; in a host project use e.g. '@/chat-kit/src' or '../chat-kit/src'.)
import type { ReactNode } from 'react';
import { ChatWidget } from '../src'; // 1. import
import { chatConfig } from '../chat.config';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="he" dir="rtl">
      <body>
        {children}
        <ChatWidget config={chatConfig} /> {/* 2. render once */}
      </body>
    </html>
  );
}
