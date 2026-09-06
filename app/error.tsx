'use client';

import { Button } from '@/components/ui/button';

export default function ErrorState({ reset }: { error: Error; reset: () => void }) {
  return <main className="route-state" role="alert"><p className="eyebrow">Something went wrong</p><h1>We could not load this workspace</h1><p>Your work is unchanged. Try loading the workspace again.</p><Button onClick={reset}>Try again</Button></main>;
}
