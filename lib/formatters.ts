import type { Money, Quantity } from '@/domain/contracts';

export function formatMoney(value: Money) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: value.currency, maximumFractionDigits: 2 }).format(value.amountMinor / 100);
}

export function formatQuantity(quantity: Quantity) {
  return `${new Intl.NumberFormat('en-IN', { maximumFractionDigits: 2 }).format(quantity.value)} ${quantity.unit}`;
}

export function formatIndiaDate(value: string) {
  return new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Asia/Kolkata' }).format(new Date(value));
}

