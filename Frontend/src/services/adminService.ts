import { apiClient } from './apiClient';
import { SellerManagementDto, UserManagementDto } from '../types/api.types';

export const adminService = {
  getAllUsers: async (): Promise<UserManagementDto[]> => {
    const response = await apiClient.get<UserManagementDto[]>('/admin/users');
    return response.data;
  },

  getAllSellers: async (): Promise<SellerManagementDto[]> => {
    const response = await apiClient.get<SellerManagementDto[]>('/admin/sellers');
    return response.data;
  },

  banUser: async (id: number): Promise<any> => {
    const response = await apiClient.post(`/admin/users/${id}/ban`);
    return response.data;
  },

  unbanUser: async (id: number): Promise<any> => {
    const response = await apiClient.post(`/admin/users/${id}/unban`);
    return response.data;
  }
};
