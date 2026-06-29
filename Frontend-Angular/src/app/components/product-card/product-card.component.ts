import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductListDto } from '../../models/api.types';
import { CartService } from '../../services/cart.service';
import { FormatPricePipe } from '../../pipes/format-price.pipe';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, RouterLink, FormatPricePipe],
  template: `
    <a
      [routerLink]="'/product/' + product.id"
      class="group relative flex flex-col glass-surface bg-zinc-950/[0.02] dark:bg-white/5 border border-zinc-950/5 dark:border-white/10 rounded-2xl p-4 overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:border-zinc-950/10 dark:hover:border-white/20"
    >
      <!-- Product Image -->
      <div class="relative aspect-square w-full overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-900 mb-4">
        <img
          [src]="product.mainImageUrl || fallbackImage"
          [alt]="product.name"
          class="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div *ngIf="product.stock === 0" class="absolute inset-0 bg-zinc-950/60 backdrop-blur-sm flex items-center justify-center">
          <span class="text-white text-sm font-semibold tracking-wide uppercase px-3 py-1 border border-white/20 rounded-full">Tükendi</span>
        </div>
      </div>

      <!-- Product Info -->
      <div class="flex flex-col flex-grow text-left">
        <div class="flex justify-between items-start mb-1">
          <span class="text-xs text-zinc-400 dark:text-zinc-500 font-medium uppercase tracking-wider">{{ product.storeName }}</span>
          <span class="text-xs bg-zinc-950/5 dark:bg-white/5 px-2 py-0.5 rounded-full text-zinc-500 dark:text-zinc-400">{{ product.categoryName }}</span>
        </div>
        <h3 class="text-sm font-semibold text-zinc-900 dark:text-zinc-50 line-clamp-1 group-hover:text-black dark:group-hover:text-white transition-colors">{{ product.name }}</h3>
        <p class="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2 mt-1 min-h-[2rem]">{{ product.description }}</p>

        <!-- Price & CTA -->
        <div class="flex items-center justify-between mt-4 pt-3 border-t border-zinc-950/5 dark:border-white/5">
          <span class="text-sm font-bold text-zinc-900 dark:text-zinc-50">{{ product.price | formatPrice }}</span>
          <button
            (click)="handleAddToCart($event)"
            [disabled]="product.stock === 0 || isAdding"
            class="flex items-center justify-center p-2.5 rounded-full bg-zinc-950 text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300 shadow-md"
            aria-label="Sepete Ekle"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
          </button>
        </div>
      </div>
    </a>
  `
})
export class ProductCardComponent {
  @Input() product!: ProductListDto;
  @Output() added = new EventEmitter<void>();
  @Output() error = new EventEmitter<string>();

  isAdding = false;

  get fallbackImage(): string {
    return `https://placehold.co/600x600/0a0a0a/fafafa?text=${encodeURIComponent(this.product.name)}`;
  }

  constructor(private cartService: CartService) {}

  async handleAddToCart(e: Event) {
    e.preventDefault();
    e.stopPropagation();
    this.isAdding = true;
    try {
      await this.cartService.addToCart(this.product.id, 1);
      this.added.emit();
    } catch (err: any) {
      this.error.emit(err.message || 'Ürün sepete eklenemedi.');
    } finally {
      this.isAdding = false;
    }
  }
}
