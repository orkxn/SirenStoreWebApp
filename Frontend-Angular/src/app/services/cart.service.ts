import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { BasketDto } from '../models/api.types';
import { AuthService } from './auth.service';
import { API_BASE_URL } from '../interceptors/api.interceptor';

@Injectable({ providedIn: 'root' })
export class CartService {
  private cartSubject = new BehaviorSubject<BasketDto | null>(null);
  private loadingSubject = new BehaviorSubject<boolean>(false);

  cart$ = this.cartSubject.asObservable();
  isLoading$ = this.loadingSubject.asObservable();

  get cart(): BasketDto | null { return this.cartSubject.value; }

  constructor(private http: HttpClient, private authService: AuthService) {
    this.authService.user$.subscribe(user => {
      if (user) {
        this.fetchCart();
      } else {
        this.cartSubject.next(null);
      }
    });
  }

  async fetchCart() {
    if (!this.authService.isAuthenticated) {
      this.cartSubject.next(null);
      return;
    }
    this.loadingSubject.next(true);
    try {
      const data = await firstValueFrom(this.http.get<BasketDto>(`${API_BASE_URL}/baskets`));
      this.cartSubject.next(data);
    } catch (err) {
      console.error('Failed to fetch basket from API', err);
    } finally {
      this.loadingSubject.next(false);
    }
  }

  async addToCart(productId: number, quantity: number) {
    if (!this.authService.isAuthenticated) {
      throw new Error('Sepete ürün eklemek için lütfen önce giriş yapın.');
    }
    try {
      await firstValueFrom(this.http.post(`${API_BASE_URL}/baskets/items`, { productId, quantity }));
      await this.fetchCart();
    } catch (err: any) {
      throw new Error(err.message || 'Ürün sepete eklenemedi.');
    }
  }

  async updateItemQuantity(productId: number, quantity: number) {
    if (!this.authService.isAuthenticated) return;
    try {
      await firstValueFrom(this.http.put(`${API_BASE_URL}/baskets/items`, { productId, quantity }));
      await this.fetchCart();
    } catch (err: any) {
      throw new Error(err.message || 'Ürün adedi güncellenemedi.');
    }
  }

  async removeItem(productId: number) {
    if (!this.authService.isAuthenticated) return;
    try {
      await firstValueFrom(this.http.delete(`${API_BASE_URL}/baskets/items/${productId}`));
      await this.fetchCart();
    } catch (err: any) {
      throw new Error(err.message || 'Ürün sepetten silinemedi.');
    }
  }

  async clearCart() {
    if (!this.authService.isAuthenticated) return;
    try {
      await firstValueFrom(this.http.delete(`${API_BASE_URL}/baskets/clear`));
      this.cartSubject.next(null);
    } catch (err: any) {
      throw new Error(err.message || 'Sepet temizlenemedi.');
    }
  }
}
