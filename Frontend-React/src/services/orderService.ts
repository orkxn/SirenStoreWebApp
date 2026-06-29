import { apiClient } from './apiClient';
import { OrderDto, OrderStatus } from '../types/api.types';

export const orderService = {
  createOrder: async (dto: { addressTitle: string; shippingAddress: string }): Promise<OrderDto> => {
    const response = await apiClient.post<OrderDto>('/orders', dto);
    return response.data;
  },

  getMyOrders: async (): Promise<OrderDto[]> => {
    const response = await apiClient.get<OrderDto[]>('/orders');
    return response.data;
  },

  getSellerOrders: async (): Promise<OrderDto[]> => {
    const response = await apiClient.get<OrderDto[]>('/orders/seller');
    return response.data;
  },

  getOrderById: async (id: number): Promise<OrderDto> => {
    const response = await apiClient.get<OrderDto>(`/orders/${id}`);
    return response.data;
  },

  // Note: Backend expects OrderStatus enum integer in the body
  updateOrderItemStatus: async (orderItemId: number, status: OrderStatus): Promise<any> => {
    const response = await apiClient.put(`/orders/items/${orderItemId}/status`, status);
    return response.data;
  }
};
