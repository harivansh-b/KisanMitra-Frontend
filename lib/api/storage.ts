import api from './client';
import type { UploadedDocument } from './types';

export const storageApi = {
  listMyDocuments: () => api.get<UploadedDocument[]>('/storage'),
  upload: (file: File, ownerType: 'FARMER' | 'FPO' | 'BUYER') => {
    const form = new FormData();
    form.append('file', file);
    form.append('owner_type', ownerType);
    return api.upload<UploadedDocument>('/storage/upload', form);
  },
};
