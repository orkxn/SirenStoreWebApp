import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order, CreateOrderRequest } from '../models/order.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = 'https://localhost:7009/api/orders';

  constructor(private http: HttpClient) {}

  getOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(this.apiUrl);
  }

  getOrderById(id: number): Observable<Order> {
    return this.http.get<Order>(`${this.apiUrl}/${id}`);
  }

  createOrder(request: CreateOrderRequest): Observable<Order> {
    return this.http.post<Order>(this.apiUrl, request);
  }

  getSellerOrders(): Observable<Order[]> {
    const token = localStorage.getItem('token');
    return this.http.get<Order[]>(`${this.apiUrl}/seller`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  updateOrderItemStatus(orderItemId: number, status: number): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.put(`${this.apiUrl}/items/${orderItemId}/status`, status, {
      headers: { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
  }
}
