import type { RoleId } from '@/domain/contracts';

export const roleSections: Record<RoleId, readonly string[]> = {
  farmer: ['overview', 'produce', 'offers', 'trades', 'services'],
  fpo: ['overview', 'campaigns', 'farmer-supply', 'inventory', 'open-demand', 'responses', 'confirmed-trades', 'service-requests', 'services'],
  buyer: ['overview', 'requirements', 'marketplace', 'purchases', 'deliveries'],
  storage: ['overview', 'facilities', 'requests', 'bookings', 'inventory', 'operations'],
  transport: ['overview', 'shipments', 'vehicles', 'quote-requests', 'routes'],
  quality: ['overview', 'requests', 'assessments', 'schedule', 'reports', 'availability'],
  admin: ['overview', 'verification', 'grievances', 'disputes', 'analytics'],
};

export function sectionSlug(label: string) {
  return label.toLowerCase().replace(/\s+/g, '-');
}

export function sectionLabel(slug: string) {
  const label = slug.replace(/-/g, ' ');
  return label.charAt(0).toUpperCase() + label.slice(1);
}

export function isRoleSection(role: RoleId, section: string) {
  return roleSections[role].includes(section);
}
