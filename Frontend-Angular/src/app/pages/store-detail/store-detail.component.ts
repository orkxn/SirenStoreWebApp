import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { SellerPublicProfileDto } from '../../models/api.types';
import { SellerService } from '../../services/seller.service';
import { ToastService } from '../../services/toast.service';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { SkeletonComponent } from '../../components/skeleton/skeleton.component';

@Component({
  selector: 'app-store-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ProductCardComponent,
    SkeletonComponent
  ],
  template: `
    <div class="max-w-7xl mx-auto px-6 py-10 space-y-12 text-left">
      
      <!-- Back Button -->
      <div>
        <a 
          routerLink="/products"
          class="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-zinc-950 dark:hover:text-white transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4"><path d="m15 18-6-6 6-6"/></svg> Kataloğa Dön
        </a>
      </div>

      <!-- Loading skeleton -->
      <div *ngIf="isLoading; else storeLoaded" class="space-y-8 animate-pulse">
        <app-skeleton className="h-6 w-32 mb-4"></app-skeleton>
        <div class="glass-surface bg-zinc-950/[0.02] dark:bg-white/5 border border-zinc-950/5 dark:border-white/10 p-8 rounded-3xl flex gap-6 items-center">
          <app-skeleton className="w-20 h-20 rounded-2xl"></app-skeleton>
          <div class="space-y-3 flex-grow">
            <app-skeleton className="h-6 w-1/4"></app-skeleton>
            <app-skeleton className="h-4 w-1/3"></app-skeleton>
          </div>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          <app-skeleton className="h-80 w-full rounded-2xl"></app-skeleton>
          <app-skeleton className="h-80 w-full rounded-2xl"></app-skeleton>
          <app-skeleton className="h-80 w-full rounded-2xl"></app-skeleton>
          <app-skeleton className="h-80 w-full rounded-2xl"></app-skeleton>
        </div>
      </div>

      <ng-template #storeLoaded>
        <div *ngIf="profile; else noStore" class="space-y-12">
          <!-- Store Header Card -->
          <div class="glass-surface bg-zinc-950/[0.02] dark:bg-white/5 border border-zinc-950/5 dark:border-white/10 p-8 rounded-3xl shadow-lg flex flex-col md:flex-row gap-6 items-start md:items-center">
            <img 
              *ngIf="profile.storeLogoUrl; else defaultStoreIcon"
              [src]="profile.storeLogoUrl" 
              [alt]="profile.storeName" 
              class="w-20 h-20 rounded-2xl border border-zinc-950/10 dark:border-white/10 object-cover shrink-0" 
            />
            <ng-template #defaultStoreIcon>
              <div class="w-20 h-20 rounded-2xl bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 flex items-center justify-center shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-10 h-10"><path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"/><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"/><path d="M2 7h20"/><path d="M22 7v3a2 2 0 0 1-2 2a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12a2 2 0 0 1-2-2V7"/></svg>
              </div>
            </ng-template>
            
            <div class="space-y-2 flex-grow">
              <h1 class="text-3xl font-extrabold tracking-tight text-zinc-950 dark:text-white uppercase leading-none">
                {{ profile.storeName }}
              </h1>
              
              <div class="flex flex-wrap gap-x-6 gap-y-2 text-sm text-zinc-500 dark:text-zinc-400">
                <span class="flex items-center gap-1.5">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 text-zinc-400"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  <strong>Mağaza Sahibi:</strong> {{ profile.ownerFullName }}
                </span>
                <span *ngIf="profile.contactLine" class="flex items-center gap-1.5">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 text-zinc-400"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                  <strong>Müşteri Destek Hattı:</strong> {{ profile.contactLine }}
                </span>
              </div>
            </div>
          </div>

          <!-- Store Products List -->
          <div class="space-y-6">
            <div>
              <h2 class="text-2xl font-bold tracking-tight text-zinc-950 dark:text-white uppercase">
                Mağazanın Ürünleri
              </h2>
              <p class="text-xs text-zinc-500">Bu mağaza tarafından listelenen tüm ürünler.</p>
            </div>

            <div *ngIf="profile.products.length === 0; else storeProductsLoaded" class="text-center py-20 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-3xl">
              <p class="text-zinc-500 font-medium">Bu mağazaya ait henüz ürün bulunmamaktadır.</p>
            </div>
            
            <ng-template #storeProductsLoaded>
              <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                <app-product-card
                  *ngFor="let p of profile.products"
                  [product]="p"
                  (added)="onProductAdded(p.name)"
                  (error)="onProductError($event)"
                ></app-product-card>
              </div>
            </ng-template>
          </div>
        </div>

        <ng-template #noStore>
          <div class="text-center py-20">
            <p class="text-zinc-500 font-medium text-lg">Mağaza bulunamadı.</p>
            <a routerLink="/products" class="mt-4 inline-flex items-center text-sm font-bold text-zinc-950 dark:text-white underline">
              Kataloğa Dön
            </a>
          </div>
        </ng-template>
      </ng-template>

    </div>
  `
})
export class StoreDetailComponent implements OnInit {
  profile: SellerPublicProfileDto | null = null;
  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private sellerService: SellerService,
    private toastService: ToastService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.fetchStoreProfile(parseInt(id, 10));
      }
    });
  }

  async fetchStoreProfile(sellerId: number) {
    this.isLoading = true;
    try {
      const data = await this.sellerService.getSellerProfile(sellerId);
      this.profile = data;
    } catch (err: any) {
      this.toastService.showToast(err.message || 'Mağaza bilgileri yüklenirken bir hata oluştu.', 'error');
    } finally {
      this.isLoading = false;
    }
  }

  onProductAdded(productName: string) {
    this.toastService.showToast(`${productName} sepete eklendi!`, 'success');
  }

  onProductError(errorMsg: string) {
    this.toastService.showToast(errorMsg, 'error');
  }
}
