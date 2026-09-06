import api from './client';
import type { FarmerProfile, FPOProfile } from './types';

export const farmersApi = {
  getMyProfile: () => api.get<FarmerProfile>('/farmers/me'),
  updateMyProfile: (data: Partial<FarmerProfile>) => api.put<FarmerProfile>('/farmers/me', data),
  getById: (farmerId: string) => api.get<FarmerProfile>(`/farmers/${farmerId}`),
  getRelevantFpos: (radiusKm?: number) =>
    api.get<FPOProfile[]>(`/farmers/me/relevant-fpos${radiusKm ? `?radius_km=${radiusKm}` : ''}`),
};
