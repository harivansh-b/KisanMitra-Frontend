import api from './client';
import type { Mandi, MandiPrice, NearbyMandi, PaginatedResponse } from './types';

export const mandiApi = {
  listMandis: (params?: { district?: string; is_active?: boolean; page?: number; page_size?: number }) => {
    const qs = new URLSearchParams();
    if (params) Object.entries(params).forEach(([k, v]) => { if (v !== undefined) qs.set(k, String(v)); });
    return api.get<PaginatedResponse<Mandi>>(`/mandi/mandis?${qs}`);
  },
  getMandi: (mandiId: string) => api.get<Mandi>(`/mandi/mandis/${mandiId}`),
  getMandiPrices: (mandiId: string, params?: { page?: number; page_size?: number }) => {
    const qs = new URLSearchParams();
    if (params) Object.entries(params).forEach(([k, v]) => { if (v !== undefined) qs.set(k, String(v)); });
    return api.get<PaginatedResponse<MandiPrice>>(`/mandi/mandis/${mandiId}/prices?${qs}`);
  },
  listPrices: (params?: {
    mandi_id?: string;
    district?: string;
    commodity?: string;
    variety?: string;
    from_date?: string;
    to_date?: string;
    min_price?: number;
    max_price?: number;
    page?: number;
    page_size?: number;
  }) => {
    const qs = new URLSearchParams();
    if (params) Object.entries(params).forEach(([k, v]) => { if (v !== undefined) qs.set(k, String(v)); });
    return api.get<PaginatedResponse<MandiPrice>>(`/mandi/prices?${qs}`);
  },
  latestPrices: (params?: { commodity?: string; district?: string; limit?: number }) => {
    const qs = new URLSearchParams();
    if (params) Object.entries(params).forEach(([k, v]) => { if (v !== undefined) qs.set(k, String(v)); });
    return api.get<MandiPrice[]>(`/mandi/prices/latest?${qs}`);
  },
  nearbyMandis: (params: {
    latitude: number;
    longitude: number;
    radius_km?: number;
    commodity?: string;
  }) => {
    const qs = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => { if (v !== undefined) qs.set(k, String(v)); });
    return api.get<NearbyMandi[]>(`/mandi/nearby?${qs}`);
  },
};
