'use client';

import { verifiedProfilesFixture as verifiedProfiles } from '@/data/fixtures';
import { cn } from '@/lib/utils';

const verificationByName = new Map(
  verifiedProfiles
    .filter((profile) => profile.status === 'verified')
    .map((profile) => [profile.name.toLowerCase(), profile]),
);

export function getVerifiedProfile(name: string) {
  return verificationByName.get(name.toLowerCase());
}

export function VerifiedBadge({ name, className }: { name: string; className?: string }) {
  const profile = getVerifiedProfile(name);
  if (!profile) return null;

  return (
    <span className={cn('verified-badge', className)} title={profile.label} aria-hidden="true">
      <span className="verified-leaf" />
    </span>
  );
}

export function VerifiedIdentity({ name, as: Element = 'span', className }: {
  name: string;
  as?: 'span' | 'strong' | 'h3';
  className?: string;
}) {
  const profile = getVerifiedProfile(name);
  return <Element className={cn('verified-identity', className)}><span>{name}</span><VerifiedBadge name={name} />{profile && <span className="identity-verification-label">, {profile.label}</span>}</Element>;
}
