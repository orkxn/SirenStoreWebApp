import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { ProductListDto } from '../../models/api.types';
import { FavoriteService } from '../../services/favorite.service';
import { ToastService } from '../../services/toast.service';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { ButtonComponent } from '../../components/button/button.component';
import { PaginationComponent } from '../../components/pagination/pagination.component';
import { LucideHeart } from '@lucide/angular';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [
    CommonModule, 
    RouterLink, 
    ProductCardComponent, 
    ButtonComponent, 
    PaginationComponent,
    LucideHeart
  ],
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
          <svg lucideHeart class="w-12 h-12 text-zinc-400 mx-auto"></svg>
          <p class="text-zinc-500 font-medium">Henüz favorilerinize hiçbir ürün eklemediniz.</p>
          <a routerLink="/products" class="inline-block mt-2">
            <app-button variant="primary">Ürünleri Keşfet</app-button>
          </a>
        </div>

        <div *ngIf="favorites.length > 0" class="space-y-4">
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <app-product-card
              *ngFor="let product of paginatedFavorites"
              [product]="product"
              (error)="handleError($event)"
            ></app-product-card>
          </div>
          <app-pagination
            [currentPage]="currentPage"
            [totalItems]="favorites.length"
            [pageSize]="9"
            (pageChange)="currentPage = $event"
          ></app-pagination>
        </div>
      </ng-container>
    </div>
  `
})
export class FavoritesComponent implements OnInit, OnDestroy {
  favorites: ProductListDto[] = [];
  isLoading = true;
  currentPage = 1;
  private sub?: Subscription;

  get paginatedFavorites(): ProductListDto[] {
    return this.favorites.slice((this.currentPage - 1) * 9, this.currentPage * 9);
  }

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
        this.currentPage = Math.min(this.currentPage, Math.ceil(this.favorites.length / 9) || 1);
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
