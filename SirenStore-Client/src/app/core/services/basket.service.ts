import { Injectable, computed, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, switchMap } from 'rxjs';
import { Basket, BasketItem, AddToBasketRequest } from '../models/basket.model';
import { AuthService } from './auth';

@Injectable({
  providedIn: 'root'
})
export class BasketService {
  // Backend route: api/baskets (çoğul!)
  private apiUrl = 'https://localhost:7009/api/baskets';
  
  // Reaktif state
  private currentBasket = signal<Basket | null>(null);

  basket = computed(() => this.currentBasket());
  basketCount = computed(() => {
    const b = this.currentBasket();
    return b ? b.items.reduce((acc, item) => acc + item.quantity, 0) : 0;
  });
  basketTotal = computed(() => {
    const b = this.currentBasket();
    return b ? b.grandTotal : 0;
  });

  constructor(private http: HttpClient, private authService: AuthService) {
    // Kullanıcı giriş yapmışsa sepeti yükle
    if (this.authService.isAuthenticated()) {
      this.loadBasket();
    }
  }

  // GET api/baskets
  loadBasket(): void {
    this.http.get<Basket>(this.apiUrl).subscribe({
      next: (b) => this.currentBasket.set(b),
      error: () => this.currentBasket.set(null)
    });
  }

  // POST api/baskets/items — Yanıt: { message: string }
  addToBasket(request: AddToBasketRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/items`, request).pipe(
      tap(() => this.loadBasket()) // İşlem sonrası sepeti yeniden çek
    );
  }

  // PUT api/baskets/items — Yanıt: { message: string }
  updateQuantity(productId: number, quantity: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/items`, { productId, quantity }).pipe(
      tap(() => this.loadBasket())
    );
  }

  // DELETE api/baskets/items/{productId}
  removeItem(productId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/items/${productId}`).pipe(
      tap(() => this.loadBasket())
    );
  }

  // DELETE api/baskets/clear
  clearBasket(): Observable<any> {
    return this.http.delete(`${this.apiUrl}/clear`).pipe(
      tap(() => this.currentBasket.set(null))
    );
  }

  // Logout olunca sepeti temizle
  resetBasket(): void {
    this.currentBasket.set(null);
  }
}
