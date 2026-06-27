import { apiClient } from './apiClient';
import { CategoryDto } from '../types/api.types';

export const categoryService = {
  getAll: async (): Promise<CategoryDto[]> => {
    const response = await apiClient.get<CategoryDto[]>('/categories');
    return response.data;
  },

  getById: async (id: number): Promise<CategoryDto> => {
    const response = await apiClient.get<CategoryDto>(`/categories/${id}`);
    return response.data;
  },

  create: async (dto: { name: string }): Promise<CategoryDto> => {
    const response = await apiClient.post<CategoryDto>('/categories', dto);
    return response.data;
  },

  update: async (id: number, dto: { name: string }): Promise<CategoryDto> => {
    const response = await apiClient.put<CategoryDto>(`/categories/${id}`, dto);
    return response.data;
  },

  delete: async (id: number): Promise<any> => {
    const response = await apiClient.delete(`/categories/${id}`);
    return response.data;
  }
};
