import api from './client';
import type { BuyerProfile } from './types';

export const buyersApi = {
  getMyProfile: () => api.get<BuyerProfile>('/buyers/me'),
  updateMyProfile: (data: Partial<BuyerProfile>) => api.put<BuyerProfile>('/buyers/me', data),
  getById: (buyerId: string) => api.get<BuyerProfile>(`/buyers/${buyerId}`),
};
