import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { ProductListDto } from '../../models/api.types';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { ToastService } from '../../services/toast.service';
import { ButtonComponent } from '../../components/button/button.component';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { SkeletonComponent } from '../../components/skeleton/skeleton.component';
import { FormatPricePipe } from '../../pipes/format-price.pipe';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ButtonComponent,
    ProductCardComponent,
    SkeletonComponent,
    FormatPricePipe
  ],
  template: `
    <div class="max-w-7xl mx-auto px-6 py-10 space-y-16 text-left">
      
      <!-- Back Button -->
      <div>
        <a 
          routerLink="/products"
          class="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-zinc-950 dark:hover:text-white transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4"><path d="m15 18-6-6 6-6"/></svg> Kataloğa Dön
        </a>
      </div>

      <div *ngIf="isLoading; else contentLoaded" class="animate-pulse space-y-8">
        <app-skeleton className="h-6 w-32 mb-4"></app-skeleton>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-10">
          <app-skeleton className="aspect-square w-full rounded-2xl"></app-skeleton>
          <div class="space-y-6">
            <app-skeleton className="h-4 w-20"></app-skeleton>
            <app-skeleton className="h-8 w-3/4"></app-skeleton>
            <app-skeleton className="h-4 w-1/4"></app-skeleton>
            <app-skeleton className="h-6 w-1/3"></app-skeleton>
            <app-skeleton className="h-20 w-full"></app-skeleton>
            <app-skeleton className="h-12 w-full rounded-full"></app-skeleton>
          </div>
        </div>
      </div>

      <ng-template #contentLoaded>
        <div *ngIf="product; else noProduct" class="grid grid-cols-1 md:grid-cols-2 gap-12">
          
          <!-- Left Column: Image Gallery -->
          <div class="space-y-4">
            <div class="aspect-square w-full overflow-hidden rounded-2xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-950/5 dark:border-white/10 relative">
              <img
                [src]="selectedImage || defaultPlaceholder"
                [alt]="product.name"
                class="h-full w-full object-cover object-center transition-all duration-300"
              />
              <div *ngIf="product.stock === 0" class="absolute inset-0 bg-zinc-950/60 backdrop-blur-sm flex items-center justify-center">
                <span class="text-white text-base font-bold tracking-wide uppercase px-4 py-2 border border-white/20 rounded-full">
                  Stokta Yok
                </span>
              </div>
            </div>

            <!-- Thumbnails list -->
            <div *ngIf="allImages.length > 1" class="flex gap-3 overflow-x-auto pb-2">
              <button
                *ngFor="let imgUrl of allImages; let index = index"
                (click)="selectedImage = imgUrl"
                [class]="'relative w-20 h-20 rounded-xl overflow-hidden shrink-0 border-2 transition-all ' + 
                  (selectedImage === imgUrl 
                    ? 'border-zinc-950 dark:border-white' 
                    : 'border-transparent opacity-65 hover:opacity-100')"
              >
                <img [src]="imgUrl" [alt]="'Resim ' + (index + 1)" class="w-full h-full object-cover" />
              </button>
            </div>
          </div>

          <!-- Right Column: Product details -->
          <div class="flex flex-col space-y-6">
            <div class="space-y-2">
              <div class="flex items-center justify-between">
                <span class="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
                  Mağaza: 
                  <a [routerLink]="['/store', product.sellerId]" class="hover:underline text-zinc-900 dark:text-zinc-300 font-bold transition-all normal-case">
                    {{ product.storeName }}
                  </a>
                </span>
                <span class="text-xs bg-zinc-950/5 dark:bg-white/5 border border-zinc-950/5 dark:border-white/10 px-3 py-1 rounded-full text-zinc-500 dark:text-zinc-400 font-medium">
                  {{ product.categoryName }}
                </span>
              </div>
              
              <h1 class="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-950 dark:text-white uppercase leading-none">
                {{ product.name }}
              </h1>
            </div>

            <!-- Pricing -->
            <div class="text-3xl font-extrabold text-zinc-950 dark:text-white">
              {{ product.price | formatPrice }}
            </div>

            <!-- Description -->
            <p class="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">
              {{ product.description }}
            </p>

            <!-- Specifications Box -->
            <div class="grid grid-cols-3 gap-4 py-4 border-y border-zinc-950/5 dark:border-white/5 text-center text-xs">
              <div class="flex flex-col items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-zinc-400"><rect width="16" height="13" x="2" y="6" rx="2"/><path d="M16 8h4l3 3v7a2 2 0 0 1-2 2h-1"/><path d="M3 18h1"/><path d="M18 18h1"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="14.5" cy="18.5" r="2.5"/></svg>
                <span class="font-semibold text-zinc-900 dark:text-white">Hızlı Kargo</span>
                <span class="text-zinc-400">24-48 Saat</span>
              </div>
              <div class="flex flex-col items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-zinc-400"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                <span class="font-semibold text-zinc-900 dark:text-white">Güvenilir Satıcı</span>
                <span class="text-zinc-400">Onaylı Mağaza</span>
              </div>
              <div class="flex flex-col items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-zinc-400"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
                <span class="font-semibold text-zinc-900 dark:text-white">İade Garantisi</span>
                <span class="text-zinc-400">14 Gün Kolay</span>
              </div>
            </div>

            <!-- Action Row: Count and Add to Cart -->
            <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              
              <!-- Quantity Counter -->
              <div class="flex items-center justify-between border border-zinc-300 dark:border-zinc-800 rounded-full px-4 py-3 sm:w-36 bg-zinc-950/[0.01] dark:bg-white/[0.01]">
                <button 
                  (click)="handleDecrement()"
                  [disabled]="product.stock === 0 || quantity <= 1"
                  class="text-zinc-400 hover:text-zinc-950 dark:hover:text-white disabled:opacity-30"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4"><path d="M5 12h14"/></svg>
                </button>
                <span class="text-sm font-bold text-zinc-900 dark:text-white select-none">
                  {{ product.stock === 0 ? 0 : quantity }}
                </span>
                <button 
                  (click)="handleIncrement()"
                  [disabled]="product.stock === 0 || quantity >= product.stock"
                  class="text-zinc-400 hover:text-zinc-950 dark:hover:text-white disabled:opacity-30"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
                </button>
              </div>

              <!-- Add to Cart CTA -->
              <app-button
                (click)="handleAddToCart()"
                [disabled]="product.stock === 0 || isAdding"
                variant="primary"
                size="lg"
                className="flex-grow group shadow-lg"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5 mr-2"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
                {{ isAdding ? 'Sepete Ekleniyor...' : 'Sepete Ekle' }}
              </app-button>

            </div>

            <!-- Stock Info tag -->
            <div class="text-xs font-semibold text-zinc-500">
              <span *ngIf="product.stock > 0; else outOfStock">
                <span>Bilgi: Mağaza Stoğunda <strong class="text-zinc-800 dark:text-zinc-200">{{ product.stock }} adet</strong> mevcut</span>
              </span>
              <ng-template #outOfStock>
                <span class="text-red-500 font-bold">Stokta Kalmadı!</span>
              </ng-template>
            </div>

          </div>

        </div>

        <ng-template #noProduct>
          <div class="text-center py-20">
            <p class="text-zinc-500 font-medium text-lg">Ürün bulunamadı.</p>
            <a routerLink="/products" class="mt-4 inline-flex items-center text-sm font-bold text-zinc-950 dark:text-white underline">
              Kataloğa Dön
            </a>
          </div>
        </ng-template>

        <!-- Similar products Section -->
        <div *ngIf="similarProducts.length > 0" class="border-t border-zinc-950/5 dark:border-white/5 pt-12 space-y-6">
          <div>
            <h2 class="text-2xl font-bold tracking-tight text-zinc-950 dark:text-white uppercase">
              Benzer Ürünler
            </h2>
            <p class="text-xs text-zinc-500">Aynı kategorideki diğer popüler ürünler.</p>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            <app-product-card
              *ngFor="let p of similarProducts"
              [product]="p"
              (added)="onSimilarProductAdded(p.name)"
              (error)="onSimilarProductError($event)"
            ></app-product-card>
          </div>
        </div>
      </ng-template>
      
    </div>
  `
})
export class ProductDetailComponent implements OnInit {
  product: ProductListDto | null = null;
  similarProducts: ProductListDto[] = [];
  selectedImage = '';
  quantity = 1;
  isLoading = true;
  isAdding = false;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService,
    private toastService: ToastService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.loadProductData(parseInt(id, 10));
      }
    });
  }

  async loadProductData(prodId: number) {
    this.isLoading = true;
    try {
      const data = await this.productService.getById(prodId);
      this.product = data;
      
      const fallbackImage = `https://placehold.co/600x600/0a0a0a/fafafa?text=${encodeURIComponent(data.name)}`;
      this.selectedImage = data.mainImageUrl || data.imageUrls[0] || fallbackImage;
      this.quantity = 1;

      // Load similar products in the same category
      const similar = await this.productService.getByCategoryId(data.categoryId);
      this.similarProducts = similar.filter((p) => p.id !== data.id).slice(0, 4);
    } catch (err: any) {
      this.toastService.showToast(err.message || 'Ürün yüklenirken bir hata oluştu.', 'error');
    } finally {
      this.isLoading = false;
    }
  }

  get defaultPlaceholder(): string {
    return this.product ? `https://placehold.co/600x600/0a0a0a/fafafa?text=${encodeURIComponent(this.product.name)}` : '';
  }

  get allImages(): string[] {
    if (!this.product) return [];
    return Array.from(new Set([
      this.product.mainImageUrl, 
      ...(this.product.imageUrls || [])
    ])).filter(Boolean) as string[];
  }

  handleIncrement() {
    if (!this.product) return;
    if (this.quantity < this.product.stock) {
      this.quantity++;
    } else {
      this.toastService.showToast('Mağaza stok limitine ulaştınız.', 'info');
    }
  }

  handleDecrement() {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  async handleAddToCart() {
    if (!this.product) return;
    this.isAdding = true;
    try {
      await this.cartService.addToCart(this.product.id, this.quantity);
      this.toastService.showToast(`${this.quantity} adet ${this.product.name} sepetinize eklendi.`, 'success');
    } catch (err: any) {
      this.toastService.showToast(err.message || 'Ürün sepete eklenemedi.', 'error');
    } finally {
      this.isAdding = false;
    }
  }

  onSimilarProductAdded(productName: string) {
    this.toastService.showToast(`${productName} sepete eklendi!`, 'success');
  }

  onSimilarProductError(errorMsg: string) {
    this.toastService.showToast(errorMsg, 'error');
  }
}
