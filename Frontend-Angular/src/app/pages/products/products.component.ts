import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductListDto, CategoryDto } from '../../models/api.types';
import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../services/category.service';
import { ToastService } from '../../services/toast.service';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { ProductGridSkeletonComponent } from '../../components/skeleton/skeleton.component';
import { PaginationComponent } from '../../components/pagination/pagination.component';
import { LucideSlidersHorizontal, LucideSearch, LucideArrowUpDown } from '@lucide/angular';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ProductCardComponent,
    ProductGridSkeletonComponent,
    PaginationComponent,
    LucideSlidersHorizontal,
    LucideSearch,
    LucideArrowUpDown
  ],
  template: `
    <div class="max-w-7xl mx-auto px-6 py-10 space-y-8">
      
      <!-- Header Info -->
      <div class="text-left border-b border-zinc-950/5 dark:border-white/5 pb-6">
        <h1 class="text-4xl font-extrabold tracking-tight text-zinc-950 dark:text-white uppercase">
          Tüm Ürünler
        </h1>
        <p class="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          Aradığınız tarza uygun yüzlerce ürünü keşfedin.
        </p>
      </div>

      <!-- Grid containing Sidebar and Results -->
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        <!-- Left Sidebar Filters (Glass Panel) -->
        <aside class="lg:col-span-1 h-fit glass-surface bg-zinc-950/[0.01] dark:bg-white/5 border border-zinc-950/5 dark:border-white/10 p-6 rounded-2xl space-y-6 text-left">
          
          <div class="flex items-center justify-between border-b border-zinc-950/5 dark:border-white/5 pb-4">
            <span class="font-bold flex items-center gap-2 text-zinc-900 dark:text-white uppercase text-sm">
              <svg lucideSlidersHorizontal class="w-4 h-4"></svg> Filtreler
            </span>
            <button 
              (click)="handleResetFilters()"
              class="text-xs text-zinc-500 hover:text-zinc-950 dark:hover:text-white underline cursor-pointer"
            >
              Temizle
            </button>
          </div>

          <!-- Search Input -->
          <div class="space-y-2">
            <span class="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wide">Ürün Ara</span>
            <div class="relative">
              <input
                type="text"
                placeholder="İsim, açıklama veya mağaza..."
                [(ngModel)]="searchTerm"
                (ngModelChange)="currentPage = 1"
                class="w-full text-xs bg-transparent border border-zinc-300 dark:border-zinc-800 rounded-xl pl-9 pr-4 py-2.5 text-zinc-900 dark:text-white outline-none focus:border-zinc-950 dark:focus:border-white transition-all"
              />
              <svg lucideSearch class="w-4 h-4 text-zinc-400 absolute left-3 top-3.5"></svg>
            </div>
          </div>

          <!-- Categories list -->
          <div class="space-y-2">
            <span class="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wide">Kategoriler</span>
            <div class="flex flex-col gap-1.5 max-h-48 overflow-y-auto pr-1">
              <button
                (click)="handleCategorySelect(null)"
                [class]="'text-xs text-left px-3 py-2 rounded-lg transition-colors cursor-pointer ' + 
                  (selectedCategory === null 
                    ? 'bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 font-semibold' 
                    : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-950/5 dark:hover:bg-white/5')"
              >
                Tümü
              </button>
              <button
                *ngFor="let cat of categories"
                (click)="handleCategorySelect(cat.id)"
                [class]="'text-xs text-left px-3 py-2 rounded-lg transition-colors cursor-pointer ' + 
                  (selectedCategory === cat.id 
                    ? 'bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 font-semibold' 
                    : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-950/5 dark:hover:bg-white/5')"
              >
                {{ cat.name }}
              </button>
            </div>
          </div>

          <!-- Price Range Filter -->
          <div class="space-y-2">
            <span class="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wide">Fiyat Aralığı</span>
            <div class="flex items-center gap-2">
              <input
                type="number"
                placeholder="Min ₺"
                [(ngModel)]="minPrice"
                (ngModelChange)="currentPage = 1"
                class="w-full text-xs bg-transparent border border-zinc-300 dark:border-zinc-800 rounded-xl px-3 py-2 text-zinc-900 dark:text-white outline-none focus:border-zinc-950 dark:focus:border-white"
              />
              <span class="text-zinc-400 text-xs">-</span>
              <input
                type="number"
                placeholder="Max ₺"
                [(ngModel)]="maxPrice"
                (ngModelChange)="currentPage = 1"
                class="w-full text-xs bg-transparent border border-zinc-300 dark:border-zinc-800 rounded-xl px-3 py-2 text-zinc-900 dark:text-white outline-none focus:border-zinc-950 dark:focus:border-white"
              />
            </div>
          </div>

          <!-- Stock Filter Switch -->
          <div class="flex items-center justify-between pt-2 border-t border-zinc-950/5 dark:border-white/5">
            <span class="text-xs font-bold text-zinc-600 dark:text-zinc-400">Sadece Stokta Olanlar</span>
            <label class="relative inline-flex items-center cursor-pointer select-none">
              <input
                type="checkbox"
                [(ngModel)]="onlyInStock"
                (ngModelChange)="currentPage = 1"
                class="sr-only peer"
              />
              <div class="w-9 h-5 bg-zinc-200 dark:bg-zinc-800 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white dark:after:bg-zinc-900 after:border-zinc-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-zinc-950 dark:peer-checked:bg-white"></div>
            </label>
          </div>

        </aside>

        <!-- Right side Products Grid & Sorting -->
        <main class="lg:col-span-3 space-y-6">
          
          <!-- Sorting / Header Actions -->
          <div class="flex items-center justify-between flex-wrap gap-4 glass-surface bg-zinc-950/[0.01] dark:bg-white/5 border border-zinc-950/5 dark:border-white/10 px-6 py-3 rounded-2xl text-xs text-zinc-500 text-left">
            <span>
              Toplam <strong class="text-zinc-900 dark:text-white font-semibold">{{ filteredProducts.length }}</strong> ürün listeleniyor
            </span>
            
            <div class="flex items-center gap-2">
              <svg lucideArrowUpDown class="w-3.5 h-3.5"></svg>
              <span>Sıralama:</span>
              <select
                [(ngModel)]="sortBy"
                (ngModelChange)="currentPage = 1"
                class="bg-transparent border-none text-zinc-900 dark:text-white font-bold cursor-pointer outline-none focus:ring-0"
              >
                <option value="default" class="bg-white text-zinc-900 dark:bg-zinc-900 dark:text-zinc-100">Önerilen</option>
                <option value="price-low" class="bg-white text-zinc-900 dark:bg-zinc-900 dark:text-zinc-100">Fiyat: Artan</option>
                <option value="price-high" class="bg-white text-zinc-900 dark:bg-zinc-900 dark:text-zinc-100">Fiyat: Azalan</option>
                <option value="name-asc" class="bg-white text-zinc-900 dark:bg-zinc-900 dark:text-zinc-100">İsim: A - Z</option>
                <option value="name-desc" class="bg-white text-zinc-900 dark:bg-zinc-900 dark:text-zinc-100">İsim: Z - A</option>
              </select>
            </div>
          </div>

          <!-- Grid Products -->
          <app-product-grid-skeleton *ngIf="isLoading; else productsLoaded" [count]="6"></app-product-grid-skeleton>
          <ng-template #productsLoaded>
            <div *ngIf="filteredProducts.length > 0; else noProducts" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              <app-product-card
                *ngFor="let product of paginatedProducts"
                [product]="product"
                (added)="onProductAdded(product.name)"
                (error)="onProductError($event)"
              ></app-product-card>
            </div>
            <app-pagination
              [currentPage]="currentPage"
              [totalItems]="filteredProducts.length"
              [pageSize]="9"
              (pageChange)="onPageChange($event)"
            ></app-pagination>
            <ng-template #noProducts>
              <div class="text-center py-20 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-3xl">
                <p class="text-zinc-500 font-medium">Aramanıza uygun ürün bulunamadı.</p>
                <button 
                  (click)="handleResetFilters()"
                  class="mt-4 text-xs font-bold bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 px-4 py-2 rounded-full hover:opacity-85 transition-opacity"
                >
                  Filtreleri Sıfırla
                </button>
              </div>
            </ng-template>
          </ng-template>

        </main>
      </div>

    </div>
  `
})
export class ProductsComponent implements OnInit {
  products: ProductListDto[] = [];
  categories: CategoryDto[] = [];
  isLoading = true;

  // Filter States
  searchTerm = '';
  selectedCategory: number | null = null;
  minPrice: number | '' = '';
  maxPrice: number | '' = '';
  onlyInStock = false;
  sortBy = 'default';
  currentPage = 1;

  get paginatedProducts(): ProductListDto[] {
    return this.filteredProducts.slice((this.currentPage - 1) * 9, this.currentPage * 9);
  }

  onPageChange(page: number) {
    this.currentPage = page;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private categoryService: CategoryService,
    private toastService: ToastService
  ) { }

  ngOnInit() {
    this.loadFiltersAndProducts();

    // Subscribe to query parameters to sync selected category
    this.route.queryParams.subscribe(params => {
      const catQuery = params['category'];
      if (catQuery) {
        this.selectedCategory = parseInt(catQuery, 10);
      } else {
        this.selectedCategory = null;
      }
    });
  }

  async loadFiltersAndProducts() {
    this.isLoading = true;
    try {
      const [prodData, catData] = await Promise.all([
        this.productService.getAll(),
        this.categoryService.getAll(),
      ]);
      this.products = prodData;
      this.categories = catData;
    } catch (err: any) {
      this.toastService.showToast(err.message || 'Ürün kataloğu yüklenemedi.', 'error');
    } finally {
      this.isLoading = false;
    }
  }

  handleCategorySelect(categoryId: number | null) {
    this.selectedCategory = categoryId;
    this.currentPage = 1;
    if (categoryId) {
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { category: categoryId.toString() },
        queryParamsHandling: 'merge'
      });
    } else {
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { category: null },
        queryParamsHandling: 'merge'
      });
    }
  }

  handleResetFilters() {
    this.searchTerm = '';
    this.selectedCategory = null;
    this.minPrice = '';
    this.maxPrice = '';
    this.onlyInStock = false;
    this.sortBy = 'default';
    this.currentPage = 1;
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { category: null },
      queryParamsHandling: 'merge'
    });
  }

  get filteredProducts(): ProductListDto[] {
    return this.products
      .filter((p) => {
        // 1. Search term match
        const matchesSearch = !this.searchTerm ||
          p.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          p.description.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          p.storeName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          (p.tags && p.tags.some(t => t.toLowerCase().includes(this.searchTerm.toLowerCase())));

        // 2. Category match
        const matchesCategory = this.selectedCategory ? p.categoryId === this.selectedCategory : true;

        // 3. Price range match
        const matchesMinPrice = this.minPrice === '' || this.minPrice === null ? true : p.price >= this.minPrice;
        const matchesMaxPrice = this.maxPrice === '' || this.maxPrice === null ? true : p.price <= this.maxPrice;

        // 4. Stock match
        const matchesStock = this.onlyInStock ? p.stock > 0 : true;

        return matchesSearch && matchesCategory && matchesMinPrice && matchesMaxPrice && matchesStock;
      })
      .sort((a, b) => {
        switch (this.sortBy) {
          case 'price-low':
            return a.price - b.price;
          case 'price-high':
            return b.price - a.price;
          case 'name-asc':
            return a.name.localeCompare(b.name);
          case 'name-desc':
            return b.name.localeCompare(a.name);
          default:
            return 0; // Natural API sort
        }
      });
  }

  onProductAdded(productName: string) {
    this.toastService.showToast(`${productName} sepete eklendi!`, 'success');
  }

  onProductError(errorMsg: string) {
    this.toastService.showToast(errorMsg, 'error');
  }
}
