'use client';

import * as React from 'react';

interface Props {
  children: React.ReactNode;
  /** Rendered when a child throws. Keep it calm and non-alarming. */
  fallback?: React.ReactNode;
}

interface State {
  hasError: boolean;
}

/**
 * Error boundary — isolates a risky subtree (e.g. the chatbot) so a runtime
 * error there never blanks the whole page.
 */
export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    // Swallow to console; a production app can forward this to a logger.
    console.error('ErrorBoundary caught:', error);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? null;
    }
    return this.props.children;
  }
}
