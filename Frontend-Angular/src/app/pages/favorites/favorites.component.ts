import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { ProductListDto } from '../../models/api.types';
import { FavoriteService } from '../../services/favorite.service';
import { ToastService } from '../../services/toast.service';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { ButtonComponent } from '../../components/button/button.component';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule, RouterLink, ProductCardComponent, ButtonComponent],
  template: `
    <div class="max-w-7xl mx-auto px-6 py-10 space-y-8 text-left">
      <!-- Header -->
      <div class="border-b border-zinc-950/5 dark:border-white/5 pb-6">
        <h1 class="text-4xl font-extrabold tracking-tight text-zinc-950 dark:text-white uppercase leading-none">
          Favorilerim
        </h1>
        <p class="text-sm text-zinc-500 dark:text-zinc-400 mt-1.5">
          Beğendiğiniz ve takip ettiğiniz ürünleri buradan yönetebilirsiniz.
        </p>
      </div>

      <!-- Loading State -->
      <div *ngIf="isLoading" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <div *ngFor="let i of [1,2,3,4]" class="animate-pulse flex flex-col space-y-4">
          <div class="aspect-square bg-zinc-200 dark:bg-zinc-800 rounded-2xl w-full"></div>
          <div class="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-2/3"></div>
          <div class="h-3 bg-zinc-200 dark:bg-zinc-800 rounded w-1/2"></div>
        </div>
      </div>

      <!-- Favorites Loaded -->
      <ng-container *ngIf="!isLoading">
        <div *ngIf="favorites.length === 0" class="text-center py-20 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-3xl space-y-4">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-12 h-12 text-zinc-400 mx-auto">
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
          </svg>
          <p class="text-zinc-500 font-medium">Henüz favorilerinize hiçbir ürün eklemediniz.</p>
          <a routerLink="/products" class="inline-block mt-2">
            <app-button variant="primary">Ürünleri Keşfet</app-button>
          </a>
        </div>

        <div *ngIf="favorites.length > 0" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <app-product-card
            *ngFor="let product of favorites"
            [product]="product"
            (error)="handleError($event)"
          ></app-product-card>
        </div>
      </ng-container>
    </div>
  `
})
export class FavoritesComponent implements OnInit, OnDestroy {
  favorites: ProductListDto[] = [];
  isLoading = true;
  private sub?: Subscription;

  constructor(
    private favoriteService: FavoriteService,
    private toastService: ToastService
  ) {}

  async ngOnInit() {
    this.isLoading = true;
    try {
      this.favorites = await this.favoriteService.getFavorites();
      
      // Favori ID'lerindeki değişimleri dinleyip arayüzü anlık güncelle (silindiğinde anında kalkması için)
      this.sub = this.favoriteService.favoriteIds$.subscribe(favIds => {
        this.favorites = this.favorites.filter(f => favIds.has(f.id));
      });
    } catch (err: any) {
      this.toastService.showToast('Favoriler yüklenirken hata oluştu.', 'error');
    } finally {
      this.isLoading = false;
    }
  }

  handleError(msg: string) {
    this.toastService.showToast(msg, 'error');
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }
}
