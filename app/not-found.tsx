import Link from 'next/link';

export default function NotFound() {
  return <main className="route-state"><p className="eyebrow">Workspace unavailable</p><h1>That workspace could not be found</h1><p>Choose a valid KisanMitra actor and workspace to continue.</p><Link href="/farmer/overview">Return to Farmer overview</Link></main>;
}
