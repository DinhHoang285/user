'use client';

import { createElement } from 'react';
import { SessionProvider as Session, SessionProviderProps } from 'next-auth/react';

function SessionProvider(props: SessionProviderProps) {
  return createElement(Session, props);
}
export default SessionProvider;
