'use client';

import { Show, SignInButton, SignUpButton, UserButton } from '@clerk/react';
import { LogIn, UserRound } from 'lucide-react';

export function AuthControl() {
  return <div className="flex items-center gap-2"><Show when="signed-out"><SignInButton><button type="button" className="inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm"><UserRound className="h-4 w-4" />Sign in</button></SignInButton><SignUpButton><button type="button" className="inline-flex items-center gap-2 rounded-md bg-primary px-3 py-2 text-sm text-primary-foreground"><LogIn className="h-4 w-4" />Create account</button></SignUpButton></Show><Show when="signed-in"><UserButton /></Show></div>;
}
