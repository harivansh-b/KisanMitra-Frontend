import type { RoleId } from '@/domain/contracts';

export const roleSections: Record<RoleId, readonly string[]> = {
  farmer: ['overview', 'produce', 'offers', 'trades', 'services', 'mandi', 'rankings', 'geography', 'documents', 'verification'],
  fpo: ['overview', 'campaigns', 'farmer-supply', 'inventory', 'open-demand', 'responses', 'confirmed-trades', 'service-requests', 'services', 'mandi', 'geography', 'documents', 'verification'],
  buyer: ['overview', 'requirements', 'marketplace', 'purchases', 'deliveries', 'mandi', 'rankings', 'geography', 'documents', 'verification'],
  storage: ['overview', 'facilities', 'requests', 'bookings', 'inventory', 'operations', 'mandi', 'geography', 'documents', 'verification'],
  transport: ['overview', 'shipments', 'vehicles', 'quote-requests', 'routes', 'mandi', 'geography', 'documents', 'verification'],
  quality: ['overview', 'requests', 'assessments', 'schedule', 'reports', 'availability', 'mandi', 'geography', 'documents', 'verification'],
  admin: ['overview', 'verification', 'grievances', 'disputes', 'analytics', 'mandi', 'geography', 'documents'],
};

export function sectionSlug(label: string) {
  return label.toLowerCase().replace(/\s+/g, '-');
}

export function sectionLabel(slug: string) {
  const label = slug.replace(/-/g, ' ');
  return label.charAt(0).toUpperCase() + label.slice(1);
}

export function isRoleSection(role: RoleId, section: string) {
  return roleSections[role]?.includes(section) ?? false;
}
