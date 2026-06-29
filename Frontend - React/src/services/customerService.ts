import { apiClient } from './apiClient';
import { UserProfileDto } from '../types/api.types';

export const customerService = {
  getProfile: async (): Promise<UserProfileDto> => {
    const response = await apiClient.get<UserProfileDto>('/customer/profile');
    return response.data;
  },

  updateProfile: async (dto: { firstName: string; lastName: string; phoneNumber: string | null }): Promise<any> => {
    const response = await apiClient.post('/customer/profile/update', dto);
    return response.data;
  },

  changePassword: async (dto: any): Promise<any> => {
    const response = await apiClient.post('/customer/change-password', dto);
    return response.data;
  }
};
