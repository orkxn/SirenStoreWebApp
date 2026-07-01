import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { OrderDto, OrderStatus } from '../models/api.types';
import { API_BASE_URL } from '../interceptors/api.interceptor';

@Injectable({ providedIn: 'root' })
export class OrderService {
  constructor(private http: HttpClient) {}

  createOrder(dto: { 
    addressTitle: string; 
    shippingAddress: string;
    cardNumber: string;
    cardHolderName: string;
    cardExpiry: string;
    cardCvv: string;
  }): Promise<OrderDto> {
    return firstValueFrom(this.http.post<OrderDto>(`${API_BASE_URL}/orders`, dto));
  }

  getMyOrders(): Promise<OrderDto[]> {
    return firstValueFrom(this.http.get<OrderDto[]>(`${API_BASE_URL}/orders`));
  }

  getSellerOrders(): Promise<OrderDto[]> {
    return firstValueFrom(this.http.get<OrderDto[]>(`${API_BASE_URL}/orders/seller`));
  }

  getOrderById(id: number): Promise<OrderDto> {
    return firstValueFrom(this.http.get<OrderDto>(`${API_BASE_URL}/orders/${id}`));
  }

  updateOrderItemStatus(orderItemId: number, status: OrderStatus): Promise<any> {
    return firstValueFrom(this.http.put(`${API_BASE_URL}/orders/items/${orderItemId}/status`, status));
  }
}
