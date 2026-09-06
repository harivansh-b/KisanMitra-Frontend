import api from './client';
import type { FPOProfile, PaginatedResponse } from './types';

export const fposApi = {
  getMyProfile: () => api.get<FPOProfile>('/fpos/me'),
  updateMyProfile: (data: Partial<FPOProfile>) => api.put<FPOProfile>('/fpos/me', data),
  getById: (fpoId: string) => api.get<FPOProfile>(`/fpos/${fpoId}`),
  listMembers: (params?: { page?: number; page_size?: number }) => {
    const qs = new URLSearchParams();
    if (params) Object.entries(params).forEach(([key, value]) => { if (value !== undefined) qs.set(key, String(value)); });
    return api.get<PaginatedResponse<unknown>>(`/fpos/members?${qs}`);
  },
};
