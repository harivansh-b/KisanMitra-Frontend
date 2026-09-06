import api from './client';
import type { Order, PaginatedResponse } from './types';

export const ordersApi = {
  list: (params?: { status?: string; page?: number; page_size?: number }) => {
    const qs = new URLSearchParams();
    if (params) Object.entries(params).forEach(([k, v]) => { if (v !== undefined) qs.set(k, String(v)); });
    return api.get<PaginatedResponse<Order>>(`/orders?${qs}`);
  },
  getById: (orderId: string) => api.get<Order>(`/orders/${orderId}`),
  create: (data: {
    listing_id: string;
    quantity: number;
    agreed_price: number;
    delivery_location?: string;
    notes?: string;
  }) => api.post<Order>('/orders', data),
  updateStatus: (orderId: string, status: string) =>
    api.patch<Order>(`/orders/${orderId}/status`, { status }),
};
