import { apiClient } from './apiClient';
import { TokenDto } from '../types/api.types';

// Wait, let's map input types directly to match backend
export const authService = {
  register: async (dto: any): Promise<any> => {
    const response = await apiClient.post('/auth/register', dto);
    return response.data;
  },

  login: async (dto: any): Promise<TokenDto> => {
    const response = await apiClient.post('/auth/login', dto);
    return response.data;
  },

  refresh: async (refreshToken: string): Promise<TokenDto> => {
    const response = await apiClient.post('/auth/refresh', JSON.stringify(refreshToken));
    return response.data;
  }
};
