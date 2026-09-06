'use client';

import { useEffect } from 'react';
import { ClerkProvider, useAuth } from '@clerk/react';
import { setAuthToken } from '@/lib/api/client';

/** Makes the current Clerk session JWT available to the existing API client. */
export function ClerkAuthBridge({ children }: { children: React.ReactNode }) {
  const { isSignedIn, getToken } = useAuth();
  useEffect(() => {
    if (!isSignedIn) { setAuthToken(null); return; }
    void getToken().then((token) => setAuthToken(token)).catch(() => setAuthToken(null));
  }, [getToken, isSignedIn]);
  return children;
}

export function ClerkRootProvider({ children }: { children: React.ReactNode }) {
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  if (!publishableKey) return children;
  return <ClerkProvider publishableKey={publishableKey}>{children}</ClerkProvider>;
}
