import { apiClient } from './apiClient';
import { ProductListDto } from '../types/api.types';

export const productService = {
  getAll: async (): Promise<ProductListDto[]> => {
    const response = await apiClient.get<ProductListDto[]>('/products');
    return response.data;
  },

  getById: async (id: number): Promise<ProductListDto> => {
    const response = await apiClient.get<ProductListDto>(`/products/${id}`);
    return response.data;
  },

  getByCategoryId: async (categoryId: number): Promise<ProductListDto[]> => {
    const response = await apiClient.get<ProductListDto[]>(`/products/category/${categoryId}`);
    return response.data;
  },

  getMyProducts: async (): Promise<ProductListDto[]> => {
    const response = await apiClient.get<ProductListDto[]>('/products/my-products');
    return response.data;
  },

  create: async (dto: { name: string; description: string; price: number; stock: number; categoryId: number; imageUrls: string[] }): Promise<any> => {
    const response = await apiClient.post('/products', dto);
    return response.data;
  },

  update: async (dto: { id: number; name: string; description: string; price: number; stock: number; categoryId: number; imageUrls: string[] }): Promise<any> => {
    const response = await apiClient.put('/products', dto);
    return response.data;
  },

  delete: async (id: number): Promise<any> => {
    const response = await apiClient.delete(`/products/${id}`);
    return response.data;
  }
};
