import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return <main className="route-state" aria-label="Loading workspace"><Skeleton className="h-5 w-32" /><Skeleton className="h-10 w-80 max-w-full" /><Skeleton className="h-40 w-full" /></main>;
}
