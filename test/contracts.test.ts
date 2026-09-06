import { describe, expect, it } from 'vitest';
import { moneySchema, quantitySchema, roleIdSchema } from '@/domain/contracts';
import { isRoleSection, sectionLabel, sectionSlug } from '@/domain/navigation';

describe('backend boundary contracts', () => {
  it('accepts canonical values and rejects display strings', () => {
    expect(quantitySchema.parse({ value: 4280, unit: 'kg' })).toEqual({ value: 4280, unit: 'kg' });
    expect(moneySchema.parse({ amountMinor: 2950, currency: 'INR' })).toEqual({ amountMinor: 2950, currency: 'INR' });
    expect(quantitySchema.safeParse('4,280 kg').success).toBe(false);
    expect(moneySchema.safeParse('₹29.50/kg').success).toBe(false);
  });

  it('validates actors and stable section slugs', () => {
    expect(roleIdSchema.safeParse('farmer').success).toBe(true);
    expect(roleIdSchema.safeParse('unknown').success).toBe(false);
    expect(sectionSlug('Farmer supply')).toBe('farmer-supply');
    expect(sectionLabel('farmer-supply')).toBe('Farmer supply');
    expect(isRoleSection('buyer', 'requirements')).toBe(true);
    expect(isRoleSection('buyer', 'admin')).toBe(false);
  });
});
