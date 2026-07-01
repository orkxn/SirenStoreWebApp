import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom, BehaviorSubject } from 'rxjs';
import { ProductListDto } from '../models/api.types';
import { API_BASE_URL } from '../interceptors/api.interceptor';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class FavoriteService {
  private favoriteIdsSubject = new BehaviorSubject<Set<number>>(new Set());
  favoriteIds$ = this.favoriteIdsSubject.asObservable();

  constructor(private http: HttpClient, private authService: AuthService) {
    // Kullanıcı değiştiğinde favori ID'lerini otomatik güncelle
    this.authService.user$.subscribe(user => {
      if (user) {
        this.fetchFavoriteIds();
      } else {
        this.favoriteIdsSubject.next(new Set());
      }
    });
  }

  async fetchFavoriteIds() {
    try {
      const ids = await firstValueFrom(this.http.get<number[]>(`${API_BASE_URL}/favorites/ids`));
      this.favoriteIdsSubject.next(new Set(ids));
    } catch (err) {
      console.error('Favori IDleri yüklenemedi', err);
    }
  }

  getFavorites(): Promise<ProductListDto[]> {
    return firstValueFrom(this.http.get<ProductListDto[]>(`${API_BASE_URL}/favorites`));
  }

  async toggleFavorite(productId: number): Promise<boolean> {
    const currentSet = new Set(this.favoriteIdsSubject.value);
    const isFav = currentSet.has(productId);

    if (isFav) {
      await firstValueFrom(this.http.delete(`${API_BASE_URL}/favorites/${productId}`));
      currentSet.delete(productId);
    } else {
      await firstValueFrom(this.http.post(`${API_BASE_URL}/favorites/${productId}`, null));
      currentSet.add(productId);
    }

    this.favoriteIdsSubject.next(currentSet);
    return !isFav;
  }

  isFavorite(productId: number): boolean {
    return this.favoriteIdsSubject.value.has(productId);
  }
}
