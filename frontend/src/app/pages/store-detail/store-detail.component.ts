import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { SellerPublicProfileDto } from '../../models/api.types';
import { SellerService } from '../../services/seller.service';
import { ToastService } from '../../services/toast.service';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { SkeletonComponent } from '../../components/skeleton/skeleton.component';
import { LucideChevronLeft, LucideStore, LucideUser, LucidePhone } from '@lucide/angular';

@Component({
  selector: 'app-store-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ProductCardComponent,
    SkeletonComponent,
    LucideChevronLeft,
    LucideStore,
    LucideUser,
    LucidePhone
  ],
  template: `
    <div class="max-w-7xl mx-auto px-6 py-10 space-y-12 text-left">
      
      <!-- Back Button -->
      <div>
        <a 
          routerLink="/products"
          class="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-zinc-950 dark:hover:text-white transition-colors"
        >
          <svg lucideChevronLeft class="w-4 h-4"></svg> Kataloğa Dön
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
                <svg lucideStore class="w-10 h-10"></svg>
              </div>
            </ng-template>
            
            <div class="space-y-2 flex-grow">
              <h1 class="text-3xl font-extrabold tracking-tight text-zinc-950 dark:text-white uppercase leading-none">
                {{ profile.storeName }}
              </h1>
              
              <div class="flex flex-wrap gap-x-6 gap-y-2 text-sm text-zinc-500 dark:text-zinc-400">
                <span class="flex items-center gap-1.5">
                  <svg lucideUser class="w-4 h-4 text-zinc-400"></svg>
                  <strong>Mağaza Sahibi:</strong> {{ profile.ownerFullName }}
                </span>
                <span *ngIf="profile.contactLine" class="flex items-center gap-1.5">
                  <svg lucidePhone class="w-4 h-4 text-zinc-400"></svg>
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
