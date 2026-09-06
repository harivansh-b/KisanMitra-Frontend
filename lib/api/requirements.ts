import api from './client';
import type { BuyerRequirement, PaginatedResponse } from './types';

export const requirementsApi = {
  list: (params?: { crop_id?: string; variety?: string; status?: string; min_price?: number; max_price?: number; page?: number; page_size?: number }) => {
    const qs = new URLSearchParams();
    if (params) Object.entries(params).forEach(([k, v]) => { if (v !== undefined) qs.set(k, String(v)); });
    return api.get<PaginatedResponse<BuyerRequirement>>(`/requirements?${qs}`);
  },
  getMyRequirements: (params?: { status?: string; page?: number; page_size?: number }) => {
    const qs = new URLSearchParams();
    if (params) Object.entries(params).forEach(([k, v]) => { if (v !== undefined) qs.set(k, String(v)); });
    return api.get<PaginatedResponse<BuyerRequirement>>(`/requirements/me?${qs}`);
  },
  getById: (reqId: string) => api.get<BuyerRequirement>(`/requirements/${reqId}`),
  create: (data: {
    crop_id: string;
    variety?: string;
    required_quantity: number;
    unit?: string;
    quality_grade?: string;
    target_price: number;
    delivery_location?: string;
    required_from?: string;
    description?: string;
  }) => api.post<BuyerRequirement>('/requirements', data),
  update: (reqId: string, data: Partial<BuyerRequirement>) =>
    api.put<BuyerRequirement>(`/requirements/${reqId}`, data),
  cancel: (reqId: string) => api.delete<BuyerRequirement>(`/requirements/${reqId}`),
};
