import api from './client';
import type { User } from './types';

export const authApi = {
  getMe: () => api.get<User>('/auth/me'),
  registerProfile: (data: {
    role: string;
    name?: string;
    phone?: string;
    email?: string;
    organization_name?: string;
    registration_number?: string;
    contact_person?: string;
    address?: string;
    village?: string;
    district?: string;
    state?: string;
    latitude?: number;
    longitude?: number;
    farm_size?: number;
    buyer_type?: string;
    business_description?: string;
  }) => api.post<User>('/auth/register-profile', data),
};
