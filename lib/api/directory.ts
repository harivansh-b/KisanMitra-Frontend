import api from './client';
import type { NearbyParticipant } from './types';

export const directoryApi = {
  nearby: (params: { latitude: number; longitude: number; radius_km: number; participant_types: Array<'FARMER' | 'BUYER' | 'FPO'> }) => {
    const qs = new URLSearchParams({ latitude: String(params.latitude), longitude: String(params.longitude), radius_km: String(params.radius_km) });
    params.participant_types.forEach((type) => qs.append('participant_types', type));
    return api.get<NearbyParticipant[]>(`/directory/nearby?${qs}`);
  },
};
