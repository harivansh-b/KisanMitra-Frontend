import api from './client';
import type { Crop, PaginatedResponse } from './types';

export const cropsApi = {
  list: (params?: { category?: string; search?: string; page?: number; page_size?: number }) => {
    const qs = new URLSearchParams();
    if (params?.category) qs.set('category', params.category);
    if (params?.search) qs.set('search', params.search);
    if (params?.page) qs.set('page', String(params.page));
    if (params?.page_size) qs.set('page_size', String(params.page_size));
    return api.get<PaginatedResponse<Crop>>(`/crops?${qs}`);
  },
  getById: (cropId: string) => api.get<Crop>(`/crops/${cropId}`),
};
