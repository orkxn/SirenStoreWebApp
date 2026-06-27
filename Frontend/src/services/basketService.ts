import { apiClient } from './apiClient';
import { BasketDto } from '../types/api.types';

export const basketService = {
  getBasket: async (): Promise<BasketDto> => {
    const response = await apiClient.get<BasketDto>('/baskets');
    return response.data;
  },

  addToBasket: async (productId: number, quantity: number): Promise<any> => {
    const response = await apiClient.post('/baskets/items', { productId, quantity });
    return response.data;
  },

  updateQuantity: async (productId: number, quantity: number): Promise<any> => {
    const response = await apiClient.put('/baskets/items', { productId, quantity });
    return response.data;
  },

  removeItem: async (productId: number): Promise<any> => {
    const response = await apiClient.delete(`/baskets/items/${productId}`);
    return response.data;
  },

  clearBasket: async (): Promise<any> => {
    const response = await apiClient.delete('/baskets/clear');
    return response.data;
  }
};
