import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductListDto } from '../../models/api.types';
import { ProductService } from '../../services/product.service';
import { ToastService } from '../../services/toast.service';
import { ButtonComponent } from '../../components/button/button.component';
import { MarqueeComponent } from '../../components/marquee/marquee.component';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { ProductGridSkeletonComponent } from '../../components/skeleton/skeleton.component';
import { LucideSparkles, LucideArrowRight, LucideShieldCheck, LucideTruck, LucideStar } from '@lucide/angular';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ButtonComponent,
    MarqueeComponent,
    ProductCardComponent,
    ProductGridSkeletonComponent,
    LucideSparkles,
    LucideArrowRight,
    LucideShieldCheck,
    LucideTruck,
    LucideStar
  ],
  template: `
    <div class="space-y-20 pb-20">
      
      <!-- 1. HERO SECTION -->
      <section class="relative min-h-[85vh] flex flex-col items-center justify-center px-6 text-center overflow-hidden">
        <!-- Background Decorative Gradient Grid -->
        <div class="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
        
        <div class="max-w-4xl space-y-6">
          <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass-surface bg-zinc-950/[0.03] dark:bg-white/5 border border-zinc-950/10 dark:border-white/10 text-xs font-semibold tracking-wide text-zinc-600 dark:text-zinc-300">
            <svg lucideSparkles class="w-3.5 h-3.5"></svg>
            Yeni Sezon Ürünleri
          </div>
          
          <h1 class="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-none text-zinc-950 dark:text-white uppercase">
            EN YENİ <br />
            <span class="text-transparent bg-clip-text bg-gradient-to-r from-zinc-400 via-zinc-200 to-zinc-500 dark:from-zinc-100 dark:via-zinc-500 dark:to-zinc-300">
              TRENDLERİ KEŞFET
            </span>
          </h1>
          
          <p class="max-w-2xl mx-auto text-base sm:text-lg text-zinc-500 dark:text-zinc-400 font-normal leading-relaxed">
            Geniş ürün yelpazemiz ve kaliteli hizmet anlayışımızla en iyi alışveriş deneyimini keşfedin.
          </p>
 
          <div class="flex flex-wrap items-center justify-center gap-4 pt-4">
            <a routerLink="/products">
              <app-button variant="primary" size="lg" className="group">
                Alışverişe Başla
                <svg lucideArrowRight class="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1"></svg>
              </app-button>
            </a>
            <a routerLink="/products" [queryParams]="{category: 1}">
              <app-button variant="glass" size="lg">
                Moda Koleksiyonu
              </app-button>
            </a>
          </div>
        </div>
      </section>
 
      <!-- 2. INFINITE SCROLLING MARQUEE BANNER -->
      <section class="-mx-6">
        <app-marquee speed="medium">
          <span class="text-sm font-bold uppercase tracking-widest mx-4 flex items-center gap-3">
            <svg lucideSparkles class="w-4 h-4"></svg> SIREN EXCLUSIVE
          </span>
          <span class="text-sm font-bold uppercase tracking-widest mx-4 flex items-center gap-3">
            <svg lucideSparkles class="w-4 h-4"></svg> TREND ÜRÜNLER
          </span>
          <span class="text-sm font-bold uppercase tracking-widest mx-4 flex items-center gap-3">
            <svg lucideShieldCheck class="w-4 h-4"></svg> PREMIUM QUALITY
          </span>
          <span class="text-sm font-bold uppercase tracking-widest mx-4 flex items-center gap-3">
            <svg lucideTruck class="w-4 h-4"></svg> FAST SHIPPING
          </span>
          <span class="text-sm font-bold uppercase tracking-widest mx-4 flex items-center gap-3">
            <svg lucideShieldCheck class="w-4 h-4"></svg> GÜVENLİ ÖDEME
          </span>
        </app-marquee>
      </section>
 
      <!-- 3. FEATURED PRODUCTS GRID -->
      <section class="max-w-7xl mx-auto px-6 text-left space-y-8">
        <div class="flex justify-between items-end">
          <div>
            <h2 class="text-3xl font-bold tracking-tight text-zinc-950 dark:text-white uppercase">
              ÖNE ÇIKANLAR
            </h2>
            <p class="text-sm text-zinc-500 mt-1">En çok tercih edilen modellerimiz.</p>
          </div>
          <a routerLink="/products" class="text-sm font-bold text-zinc-950 dark:text-white hover:underline flex items-center gap-1.5">
            Tümünü Gör <svg lucideArrowRight class="w-4 h-4"></svg>
          </a>
        </div>
 
        <app-product-grid-skeleton *ngIf="isLoading; else productsLoaded" [count]="4"></app-product-grid-skeleton>
        <ng-template #productsLoaded>
          <div *ngIf="products.length > 0; else noProducts" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <app-product-card
              *ngFor="let product of products"
              [product]="product"
              (added)="onProductAdded(product.name)"
              (error)="onProductError($event)"
            ></app-product-card>
          </div>
          <ng-template #noProducts>
            <div class="text-center py-12 border border-dashed border-zinc-300 dark:border-zinc-800 rounded-2xl">
              <p class="text-zinc-500">Henüz ürün eklenmemiş.</p>
            </div>
          </ng-template>
        </ng-template>
      </section>
 
      <!-- 4. CATEGORY SHOWCASE -->
      <section class="max-w-7xl mx-auto px-6 text-left space-y-8">
        <div>
          <h2 class="text-3xl font-bold tracking-tight text-zinc-950 dark:text-white uppercase">
            KATEGORİLER
          </h2>
          <p class="text-sm text-zinc-500 mt-1">Stilinize uygun kategoriyi seçin.</p>
        </div>
 
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <a
            *ngFor="let cat of showcaseCategories"
            [routerLink]="'/products'"
            [queryParams]="{category: cat.id}"
            class="group relative h-80 rounded-2xl overflow-hidden glass-surface border border-zinc-950/5 dark:border-white/10 flex flex-col justify-end p-6 transition-all duration-500 hover:scale-[1.01]"
          >
            <div class="absolute inset-0 bg-gradient-to-t from-zinc-950/90 via-zinc-950/40 to-transparent z-10"></div>
            <img 
              [src]="cat.image" 
              [alt]="cat.name" 
              class="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
            />
            <div class="relative z-20 space-y-2">
              <h3 class="text-xl font-bold text-white uppercase tracking-wide">
                {{ cat.name }}
              </h3>
              <p class="text-xs text-zinc-300 leading-relaxed font-normal">
                {{ cat.desc }}
              </p>
              <span class="inline-flex items-center gap-1 text-xs font-semibold text-white pt-2 group-hover:underline">
                Keşfet <svg lucideArrowRight class="w-3 h-3"></svg>
              </span>
            </div>
          </a>
        </div>
      </section>
 
      <!-- 5. PROMOTION MARQUEE BAND -->
      <section class="-mx-6">
        <app-marquee speed="slow" [reverse]="true">
          <span class="text-sm font-bold tracking-widest mx-4 uppercase">
            ₺1.500 ÜZERİ SİPARİŞLERDE ÜCRETSİZ KARGO
          </span>
          <span class="text-sm font-bold tracking-widest mx-4 uppercase">
            VADE FARKSIZ 3 TAKSİT İMKANI
          </span>
          <span class="text-sm font-bold tracking-widest mx-4 uppercase">
            KOLAY VE HIZLI İADE
          </span>
          <span class="text-sm font-bold tracking-widest mx-4 uppercase">
            GÜVENLİ ÖDEME ALTYAPISI
          </span>
        </app-marquee>
      </section>
 
      <!-- 6. TESTIMONIALS -->
      <section class="max-w-7xl mx-auto px-6 text-left space-y-8">
        <div class="text-center max-w-2xl mx-auto space-y-2">
          <h2 class="text-3xl font-bold tracking-tight text-zinc-950 dark:text-white uppercase">
            Müşteri Deneyimleri
          </h2>
          <p class="text-sm text-zinc-500">Siren Store topluluğunun paylaşımları.</p>
        </div>
 
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div 
            *ngFor="let t of testimonials"
            class="p-6 rounded-2xl glass-surface bg-zinc-950/[0.01] dark:bg-white/5 border border-zinc-950/5 dark:border-white/10 space-y-4"
          >
            <div class="flex justify-between items-center">
              <span class="text-xs font-bold text-zinc-950 dark:text-white">{{ t.user }}</span>
              <div class="flex items-center gap-0.5 text-zinc-950 dark:text-white">
                <svg lucideStar class="w-3 h-3" fill="currentColor"></svg>
                <svg lucideStar class="w-3 h-3" fill="currentColor"></svg>
                <svg lucideStar class="w-3 h-3" fill="currentColor"></svg>
                <svg lucideStar class="w-3 h-3" fill="currentColor"></svg>
                <svg lucideStar class="w-3 h-3" fill="currentColor"></svg>
              </div>
            </div>
            <p class="text-xs text-zinc-500 dark:text-zinc-400 italic leading-relaxed">
              "{{ t.comment }}"
            </p>
          </div>
        </div>
      </section>
 
    </div>
  `
})
export class HomeComponent implements OnInit {
  products: ProductListDto[] = [];
  isLoading = true;

  showcaseCategories = [
    { id: 1, name: 'Giyim & Stil', desc: 'Her tarza ve mevsime uygun en şık giyim koleksiyonları.', image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop' },
    { id: 2, name: 'Elektronik', desc: 'Hayatınızı kolaylaştıracak en yeni teknolojik aletler ve aksesuarlar.', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800&auto=format&fit=crop' },
    { id: 3, name: 'Ev & Yaşam', desc: 'Evinize şıklık katacak en güzel mobilya ve dekorasyon ürünleri.', image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=800&auto=format&fit=crop' }
  ];

  testimonials = [
    { user: 'Buse T.', comment: 'Siparişim ertesi gün kargoya verildi. Mat siyah kulaklıkların ses kalitesi ve performansı muazzam!', rating: '★★★★★' },
    { user: 'Can K.', comment: 'Sitenin karanlık teması ve gezinme kolaylığı harika. Aldığım vazo salonuma çok yakıştı.', rating: '★★★★★' },
    { user: 'Selin A.', comment: 'Sepete ekleme ve ödeme adımları çok akıcıydı. Paketleme o kadar özenli ve premium ki hayran kaldım.', rating: '★★★★★' }
  ];

  constructor(
    private productService: ProductService,
    private toastService: ToastService
  ) { }

  ngOnInit() {
    this.fetchFeaturedProducts();
  }

  async fetchFeaturedProducts() {
    try {
      const result = await this.productService.getAll({ page: 1, pageSize: 4 });
      this.products = result.items;
    } catch (err: any) {
      this.toastService.showToast(err.message || 'Ürünler yüklenirken bir hata oluştu.', 'error');
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
