import api from './client';
import type { ProduceListing, PaginatedResponse } from './types';

export const listingsApi = {
  list: (params?: {
    crop_id?: string;
    variety?: string;
    quality_grade?: string;
    seller_type?: string;
    status?: string;
    min_price?: number;
    max_price?: number;
    min_quantity?: number;
    max_quantity?: number;
    latitude?: number;
    longitude?: number;
    radius_km?: number;
    page?: number;
    page_size?: number;
  }) => {
    const qs = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([k, v]) => { if (v !== undefined) qs.set(k, String(v)); });
    }
    return api.get<PaginatedResponse<ProduceListing>>(`/listings?${qs}`);
  },
  getMyListings: (params?: { status?: string; page?: number; page_size?: number }) => {
    const qs = new URLSearchParams();
    if (params) Object.entries(params).forEach(([k, v]) => { if (v !== undefined) qs.set(k, String(v)); });
    return api.get<PaginatedResponse<ProduceListing>>(`/listings/me?${qs}`);
  },
  getById: (listingId: string) => api.get<ProduceListing>(`/listings/${listingId}`),
  create: (data: {
    crop_id: string;
    variety?: string;
    quantity: number;
    unit?: string;
    quality_grade?: string;
    harvest_date?: string;
    expected_price: number;
    min_price?: number;
    location_name?: string;
    latitude?: number;
    longitude?: number;
    description?: string;
    available_from?: string;
    available_until?: string;
  }) => api.post<ProduceListing>('/listings', data),
  update: (listingId: string, data: Partial<ProduceListing>) =>
    api.put<ProduceListing>(`/listings/${listingId}`, data),
  cancel: (listingId: string) => api.delete<ProduceListing>(`/listings/${listingId}`),
};
