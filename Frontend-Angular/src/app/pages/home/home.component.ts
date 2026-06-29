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

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ButtonComponent,
    MarqueeComponent,
    ProductCardComponent,
    ProductGridSkeletonComponent
  ],
  template: `
    <div class="space-y-20 pb-20">
      
      <!-- 1. HERO SECTION -->
      <section class="relative min-h-[85vh] flex flex-col items-center justify-center px-6 text-center overflow-hidden">
        <!-- Background Decorative Gradient Grid -->
        <div class="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
        
        <div class="max-w-4xl space-y-6">
          <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass-surface bg-zinc-950/[0.03] dark:bg-white/5 border border-zinc-950/10 dark:border-white/10 text-xs font-semibold tracking-wide text-zinc-600 dark:text-zinc-300">
            <!-- Sparkles Icon -->
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-3.5 h-3.5"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275Z"/><path d="m5 3 1 2.5L8.5 6 6 7 5 9.5 4 7 1.5 6 4 5.5Z"/><path d="m19 17 1 2.5 2.5.5-2.5 1-1 2.5-1-2.5-2.5-1 2.5-1Z"/></svg>
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
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </app-button>
            </a>
            <a routerLink="/products" [queryParams]="{category: 7}">
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
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275Z"/><path d="m5 3 1 2.5L8.5 6 6 7 5 9.5 4 7 1.5 6 4 5.5Z"/><path d="m19 17 1 2.5 2.5.5-2.5 1-1 2.5-1-2.5-2.5-1 2.5-1Z"/></svg> SIREN EXCLUSIVE
          </span>
          <span class="text-sm font-bold uppercase tracking-widest mx-4 flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg> TREND ÜRÜNLER
          </span>
          <span class="text-sm font-bold uppercase tracking-widest mx-4 flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> PREMIUM QUALITY
          </span>
          <span class="text-sm font-bold uppercase tracking-widest mx-4 flex items-center gap-3">
            <svg xmlns="http://www.w3.org/205" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4"><rect width="16" height="13" x="2" y="6" rx="2"/><path d="M16 8h4l3 3v7a2 2 0 0 1-2 2h-1"/><path d="M3 18h1"/><path d="M18 18h1"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="14.5" cy="18.5" r="2.5"/></svg> FAST SHIPPING
          </span>
          <span class="text-sm font-bold uppercase tracking-widest mx-4 flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275Z"/></svg> GÜVENLİ ALIŞVERİŞ
          </span>
          
          <!-- Cloned for Marquee loop -->
          <span clone class="text-sm font-bold uppercase tracking-widest mx-4 flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275Z"/><path d="m5 3 1 2.5L8.5 6 6 7 5 9.5 4 7 1.5 6 4 5.5Z"/><path d="m19 17 1 2.5 2.5.5-2.5 1-1 2.5-1-2.5-2.5-1 2.5-1Z"/></svg> SIREN EXCLUSIVE
          </span>
          <span clone class="text-sm font-bold uppercase tracking-widest mx-4 flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg> TREND ÜRÜNLER
          </span>
          <span clone class="text-sm font-bold uppercase tracking-widest mx-4 flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> PREMIUM QUALITY
          </span>
          <span clone class="text-sm font-bold uppercase tracking-widest mx-4 flex items-center gap-3">
            <svg xmlns="http://www.w3.org/205" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4"><rect width="16" height="13" x="2" y="6" rx="2"/><path d="M16 8h4l3 3v7a2 2 0 0 1-2 2h-1"/><path d="M3 18h1"/><path d="M18 18h1"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="14.5" cy="18.5" r="2.5"/></svg> FAST SHIPPING
          </span>
          <span clone class="text-sm font-bold uppercase tracking-widest mx-4 flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275Z"/></svg> GÜVENLİ ALIŞVERİŞ
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
          <a routerLink="/products" class="text-sm font-bold text-zinc-950 dark:text-white hover:underline flex items-center gap-1">
            Tümünü Gör <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
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
                Keşfet <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-3 h-3"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
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
          
          <!-- Cloned for Marquee loop -->
          <span clone class="text-sm font-bold tracking-widest mx-4 uppercase">
            ₺1.500 ÜZERİ SİPARİŞLERDE ÜCRETSİZ KARGO
          </span>
          <span clone class="text-sm font-bold tracking-widest mx-4 uppercase">
            VADE FARKSIZ 3 TAKSİT İMKANI
          </span>
          <span clone class="text-sm font-bold tracking-widest mx-4 uppercase">
            KOLAY VE HIZLI İADE
          </span>
          <span clone class="text-sm font-bold tracking-widest mx-4 uppercase">
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
              <span class="text-xs text-zinc-900 dark:text-zinc-100 font-serif tracking-wider">{{ t.rating }}</span>
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
      const allProducts = await this.productService.getAll();
      this.products = allProducts.slice(0, 4);
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
