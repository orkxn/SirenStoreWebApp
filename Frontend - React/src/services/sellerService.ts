import { apiClient } from './apiClient';
import { SellerPublicProfileDto } from '../types/api.types';

export const sellerService = {
  getSellerProfile: async (id: number): Promise<SellerPublicProfileDto> => {
    const response = await apiClient.get<SellerPublicProfileDto>(`/sellers/${id}/profile`);
    return response.data;
  },

  becomeSeller: async (dto: { storeName: string; contactEmail: string; contactPhone: string; supportLine: string; taxNumber: string; taxOffice: string }): Promise<any> => {
    const response = await apiClient.post('/sellers/apply', dto);
    return response.data;
  },

  getMyStatus: async (): Promise<{ hasApplied: boolean; status: string; storeName?: string; contactEmail?: string; contactPhone?: string; supportLine?: string; taxNumber?: string; taxOffice?: string }> => {
    const response = await apiClient.get('/sellers/my-status');
    return response.data;
  },

  approveSeller: async (sellerId: number): Promise<any> => {
    const response = await apiClient.post(`/sellers/approve/${sellerId}`);
    return response.data;
  },

  rejectSeller: async (sellerId: number): Promise<any> => {
    const response = await apiClient.post(`/sellers/reject/${sellerId}`);
    return response.data;
  }
};
