import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { ToastService } from '../../services/toast.service';
import { ButtonComponent } from '../../components/button/button.component';
import { FormatPricePipe } from '../../pipes/format-price.pipe';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ButtonComponent,
    FormatPricePipe
  ],
  template: `
    <div class="max-w-6xl mx-auto px-6 py-10 space-y-8 text-left">
      
      <!-- Header -->
      <div class="border-b border-zinc-950/5 dark:border-white/5 pb-6 flex items-end justify-between flex-wrap gap-4">
        <div>
          <h1 class="text-4xl font-extrabold tracking-tight text-zinc-950 dark:text-white uppercase leading-none">
            Alışveriş Sepeti
          </h1>
          <p class="text-sm text-zinc-500 dark:text-zinc-400 mt-1.5">
            Seçtiğiniz ürünlerin listesi ve sepet toplamı.
          </p>
        </div>
        <button
          *ngIf="items.length > 0"
          (click)="handleClear()"
          class="text-xs text-zinc-400 hover:text-red-500 hover:underline flex items-center gap-1 cursor-pointer transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-3.5 h-3.5"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg> Sepeti Temizle
        </button>
      </div>

      <div *ngIf="(cartService.isLoading$ | async) && !cart" class="max-w-4xl mx-auto px-6 py-20 text-center animate-pulse">
        <div class="h-6 bg-zinc-200 dark:bg-zinc-800 w-32 mx-auto mb-6 rounded"></div>
        <div class="space-y-4">
          <div class="h-20 bg-zinc-200 dark:bg-zinc-800 rounded-xl"></div>
          <div class="h-20 bg-zinc-200 dark:bg-zinc-800 rounded-xl"></div>
        </div>
      </div>

      <ng-container *ngIf="!(cartService.isLoading$ | async) || cart">
        <div *ngIf="items.length === 0; else cartGrid" class="text-center py-20 glass-surface bg-zinc-950/[0.01] dark:bg-white/5 border border-zinc-950/5 dark:border-white/10 rounded-3xl flex flex-col items-center justify-center space-y-6">
          <div class="p-4 bg-zinc-100 dark:bg-zinc-900 rounded-full text-zinc-400">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-12 h-12"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
          </div>
          <div class="space-y-1">
            <h2 class="text-xl font-bold text-zinc-900 dark:text-white uppercase">Sepetiniz Boş</h2>
            <p class="text-sm text-zinc-500 dark:text-zinc-400">Görünüşe göre sepetinize henüz hiçbir ürün eklemediniz.</p>
          </div>
          <a routerLink="/products">
            <app-button variant="primary" size="md">
              Alışverişe Devam Et
            </app-button>
          </a>
        </div>

        <ng-template #cartGrid>
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-10">
            
            <!-- Items List -->
            <div class="lg:col-span-2 space-y-4">
              <div
                *ngFor="let item of items"
                class="flex items-center gap-4 p-4 rounded-2xl glass-surface bg-zinc-950/[0.01] dark:bg-white/5 border border-zinc-950/5 dark:border-white/10 relative hover:border-zinc-950/10 dark:hover:border-white/20 transition-all"
              >
                <!-- Thumbnail -->
                <div class="w-20 h-20 rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-900 border border-zinc-950/5 shrink-0">
                  <img 
                    [src]="item.productImageUrl || getFallbackImg(item.productName)" 
                    [alt]="item.productName" 
                    class="w-full h-full object-cover" 
                  />
                </div>

                <!-- Info details -->
                <div class="flex-grow flex flex-col min-w-0">
                  <a [routerLink]="'/product/' + item.productId" class="text-sm font-bold text-zinc-950 dark:text-white hover:underline truncate">
                    {{ item.productName }}
                  </a>
                  <span class="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5">
                    Birim Fiyat: {{ item.price | formatPrice }}
                  </span>
                  
                  <!-- Actions panel -->
                  <div class="flex items-center justify-between mt-3">
                    
                    <!-- Counter -->
                    <div class="flex items-center gap-3 border border-zinc-200 dark:border-zinc-800 rounded-full px-2 py-1 bg-transparent shrink-0">
                      <button
                        (click)="handleQuantityChange(item.productId, item.quantity, -1)"
                        [disabled]="item.quantity <= 1"
                        class="text-zinc-400 hover:text-zinc-950 dark:hover:text-white disabled:opacity-30"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-3.5 h-3.5"><path d="M5 12h14"/></svg>
                      </button>
                      <span class="text-xs font-bold text-zinc-900 dark:text-white select-none w-4 text-center">
                        {{ item.quantity }}
                      </span>
                      <button
                        (click)="handleQuantityChange(item.productId, item.quantity, 1)"
                        class="text-zinc-400 hover:text-zinc-950 dark:hover:text-white"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-3.5 h-3.5"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
                      </button>
                    </div>

                    <!-- Total for this row -->
                    <span class="text-sm font-bold text-zinc-950 dark:text-white">
                      {{ item.totalPrice | formatPrice }}
                    </span>

                  </div>
                </div>

                <!-- Remove Button -->
                <button
                  (click)="handleRemove(item.productId, item.productName)"
                  class="absolute top-4 right-4 text-zinc-400 hover:text-red-500 transition-colors p-1"
                  aria-label="Ürünü Kaldır"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                </button>

              </div>
            </div>

            <!-- Checkout / Order Summary Box -->
            <div class="lg:col-span-1 h-fit glass-surface bg-zinc-950/[0.01] dark:bg-white/5 border border-zinc-950/5 dark:border-white/10 rounded-2xl p-6 space-y-6">
              <h3 class="font-bold text-sm text-zinc-900 dark:text-white uppercase tracking-wider border-b border-zinc-950/5 dark:border-white/5 pb-4">
                Sipariş Özeti
              </h3>

              <!-- Calculations -->
              <div class="space-y-3.5 text-sm">
                <div class="flex justify-between text-zinc-600 dark:text-zinc-400">
                  <span>Ara Toplam</span>
                  <span class="font-semibold text-zinc-900 dark:text-white">{{ subtotal | formatPrice }}</span>
                </div>
                
                <div class="flex justify-between text-zinc-600 dark:text-zinc-400">
                  <span>Kargo Bedeli</span>
                  <span *ngIf="shippingCost === 0; else showShippingCost" class="text-emerald-600 font-bold">Ücretsiz</span>
                  <ng-template #showShippingCost>
                    <span class="font-semibold text-zinc-900 dark:text-white">{{ shippingCost | formatPrice }}</span>
                  </ng-template>
                </div>

                <div *ngIf="shippingCost > 0" class="flex items-center gap-1.5 p-3 bg-zinc-950/5 dark:bg-white/5 rounded-xl text-xs text-zinc-500 dark:text-zinc-400 leading-normal">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 shrink-0 text-zinc-400"><rect width="16" height="13" x="2" y="6" rx="2"/><path d="M16 8h4l3 3v7a2 2 0 0 1-2 2h-1"/><path d="M3 18h1"/><path d="M18 18h1"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="14.5" cy="18.5" r="2.5"/></svg>
                  <span>
                    Fırsat: Sepetinize <strong>{{ (shippingThreshold - subtotal) | formatPrice }}</strong> değerinde ürün daha ekleyin, kargo ücretsiz olsun!
                  </span>
                </div>

                <div class="flex justify-between border-t border-zinc-950/5 dark:border-white/5 pt-4 text-base font-bold text-zinc-950 dark:text-white">
                  <span>Genel Toplam</span>
                  <span>{{ grandTotal | formatPrice }}</span>
                </div>
              </div>

              <!-- Proceed Button -->
              <app-button
                (click)="navigateToCheckout()"
                variant="primary"
                size="lg"
                [fullWidth]="true"
                className="group"
              >
                Ödemeye Geç
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </app-button>
            </div>

          </div>
        </ng-template>
      </ng-container>

    </div>
  `
})
export class CartComponent {
  shippingThreshold = 1500;

  constructor(
    public cartService: CartService,
    private toastService: ToastService,
    private router: Router
  ) {}

  get cart() {
    return this.cartService.cart;
  }

  get items() {
    return this.cart?.items || [];
  }

  get subtotal(): number {
    return this.cart?.grandTotal || 0;
  }

  get shippingCost(): number {
    const sub = this.subtotal;
    return sub >= this.shippingThreshold || sub === 0 ? 0 : 50;
  }

  get grandTotal(): number {
    return this.subtotal + this.shippingCost;
  }

  getFallbackImg(productName: string): string {
    return `https://placehold.co/150x150/0a0a0a/fafafa?text=${encodeURIComponent(productName)}`;
  }

  async handleQuantityChange(productId: number, currentQty: number, change: number) {
    const newQty = currentQty + change;
    if (newQty <= 0) return;
    try {
      await this.cartService.updateItemQuantity(productId, newQty);
    } catch (err: any) {
      this.toastService.showToast(err.message || 'Ürün adedi güncellenemedi.', 'error');
    }
  }

  async handleRemove(productId: number, productName: string) {
    try {
      await this.cartService.removeItem(productId);
      this.toastService.showToast(`${productName} sepetinizden kaldırıldı.`, 'success');
    } catch (err: any) {
      this.toastService.showToast(err.message || 'Ürün sepetten silinemedi.', 'error');
    }
  }

  async handleClear() {
    try {
      await this.cartService.clearCart();
      this.toastService.showToast('Sepetiniz tamamen temizlendi.', 'success');
    } catch (err: any) {
      this.toastService.showToast(err.message || 'Sepet temizlenemedi.', 'error');
    }
  }

  navigateToCheckout() {
    this.router.navigate(['/checkout']);
  }
}
