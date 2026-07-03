import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductListDto, OrderDto, CategoryDto, OrderStatus } from '../../models/api.types';
import { ProductService } from '../../services/product.service';
import { OrderService } from '../../services/order.service';
import { CategoryService } from '../../services/category.service';
import { ToastService } from '../../services/toast.service';
import { InputComponent } from '../../components/input/input.component';
import { ButtonComponent } from '../../components/button/button.component';
import { FormatPricePipe } from '../../pipes/format-price.pipe';
import { PaginationComponent } from '../../components/pagination/pagination.component';

@Component({
  selector: 'app-seller-panel',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    InputComponent,
    ButtonComponent,
    FormatPricePipe,
    PaginationComponent
  ],
  template: `
    <div class="max-w-6xl mx-auto px-6 py-10 space-y-8 text-left">
      
      <!-- Header -->
      <div class="border-b border-zinc-950/5 dark:border-white/5 pb-6 flex items-end justify-between flex-wrap gap-4">
        <div>
          <h1 class="text-4xl font-extrabold tracking-tight text-zinc-950 dark:text-white uppercase leading-none">Satıcı Paneli</h1>
          <p class="text-sm text-zinc-500 dark:text-zinc-400 mt-1.5">Mağazanızın ürünlerini listeleyin, siparişleri takip edin ve yeni stoklar ekleyin.</p>
        </div>
        <button
          (click)="handleNewProductClick()"
          class="flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 font-bold text-xs hover:opacity-85 transition-opacity cursor-pointer shadow-md"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4"><path d="M5 12h14"/><path d="M12 5v14"/></svg> Yeni Ürün Ekle
        </button>
      </div>

      <!-- Tabs -->
      <div class="flex border-b border-zinc-950/5 dark:border-white/10 gap-2 overflow-x-auto pb-px">
        <button
          (click)="setActiveTab('products')"
          [class]="'flex items-center gap-2 px-6 py-3 font-semibold text-sm transition-all border-b-2 ' + 
            (activeTab === 'products'
              ? 'border-zinc-950 dark:border-white text-zinc-950 dark:text-white'
              : 'border-transparent text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300')"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4"><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg> Ürünlerim ({{ products.length }})
        </button>

        <button
          (click)="setActiveTab('upsert')"
          [class]="'flex items-center gap-2 px-6 py-3 font-semibold text-sm transition-all border-b-2 ' + 
            (activeTab === 'upsert'
              ? 'border-zinc-950 dark:border-white text-zinc-950 dark:text-white'
              : 'border-transparent text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300')"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4"><path d="M12 20v-6M9 17v-3M15 17v-3M12 8a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"/><path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-3.9a2 2 0 0 1-1.69-.9L13 3h-2L9.59 5.1a2 2 0 0 1-1.69.9H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16Z"/></svg> {{ editProduct ? 'Ürünü Düzenle' : 'Yeni Ürün' }}
        </button>

        <button
          (click)="setActiveTab('orders')"
          [class]="'flex items-center gap-2 px-6 py-3 font-semibold text-sm transition-all border-b-2 ' + 
            (activeTab === 'orders'
              ? 'border-zinc-950 dark:border-white text-zinc-950 dark:text-white'
              : 'border-transparent text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300')"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M9 17h6"/><path d="M9 12h6"/><path d="M9 7h6"/></svg> Gelen Siparişler ({{ orders.length }})
        </button>
      </div>

      <div *ngIf="isLoading" class="text-center py-20">
        <div class="animate-spin inline-block w-8 h-8 border-2 border-zinc-950 border-t-transparent dark:border-white rounded-full"></div>
      </div>

      <main *ngIf="!isLoading" class="glass-surface bg-zinc-950/[0.01] dark:bg-white/5 border border-zinc-950/5 dark:border-white/10 rounded-3xl p-6 sm:p-8">
        
        <!-- Tab 1: Products List -->
        <div *ngIf="activeTab === 'products'" class="space-y-6">
          <div *ngIf="products.length === 0; else productsTable" class="text-center py-12 text-zinc-500 font-medium">
            Henüz bir ürün listelemediniz. Yeni Ürün Ekle butonunu kullanarak başlayabilirsiniz.
          </div>
          
          <ng-template #productsTable>
            <div class="overflow-x-auto">
              <table class="w-full text-sm text-left border-collapse">
                <thead>
                  <tr class="border-b border-zinc-950/5 dark:border-white/5 text-zinc-400 dark:text-zinc-500 text-[10px] uppercase font-bold tracking-wider">
                    <th class="pb-3 pr-4">Ürün</th>
                    <th class="pb-3 px-4">Kategori</th>
                    <th class="pb-3 px-4">Fiyat</th>
                    <th class="pb-3 px-4">Stok</th>
                    <th class="pb-3 pl-4 text-right">İşlemler</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-zinc-950/5 dark:divide-white/5">
                  <tr *ngFor="let prod of paginatedProducts" class="hover:bg-zinc-950/[0.01] dark:hover:bg-white/[0.01] transition-all">
                    <td class="py-4 pr-4 flex items-center gap-3">
                      <div class="w-12 h-12 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-950/5 shrink-0 overflow-hidden">
                        <img [src]="prod.mainImageUrl || getFallbackImg(prod.name)" [alt]="prod.name" class="w-full h-full object-cover" />
                      </div>
                      <div class="min-w-0">
                        <p class="font-bold text-zinc-900 dark:text-white truncate">{{ prod.name }}</p>
                        <p class="text-[10px] text-zinc-400 truncate max-w-[200px] mt-0.5">{{ prod.description }}</p>
                      </div>
                    </td>
                    <td class="py-4 px-4 font-medium text-zinc-500">{{ prod.categoryName }}</td>
                    <td class="py-4 px-4 font-bold text-zinc-900 dark:text-zinc-200">{{ prod.price | formatPrice }}</td>
                    <td class="py-4 px-4 font-bold">
                      <span *ngIf="prod.stock === 0; else inStock" class="text-red-500 text-xs">Tükendi</span>
                      <ng-template #inStock>
                        <span class="text-zinc-700 dark:text-zinc-300">{{ prod.stock }} Adet</span>
                      </ng-template>
                    </td>
                    <td class="py-4 pl-4 text-right space-x-2">
                      <button
                        (click)="handleEditClick(prod)"
                        class="inline-flex items-center justify-center p-2 rounded-full border border-zinc-950/5 hover:border-zinc-950/15 dark:border-white/10 dark:hover:border-white/20 text-zinc-500 hover:text-zinc-950 dark:hover:text-white transition-colors cursor-pointer"
                        aria-label="Düzenle"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-3.5 h-3.5"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
                      </button>
                      <button
                        (click)="handleDeleteProduct(prod.id)"
                        class="inline-flex items-center justify-center p-2 rounded-full border border-zinc-950/5 hover:border-red-200 dark:border-white/10 dark:hover:border-red-950/20 text-zinc-400 hover:text-red-600 transition-colors cursor-pointer"
                        aria-label="Sil"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-3.5 h-3.5"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <app-pagination
              [currentPage]="productsPage"
              [totalItems]="products.length"
              [pageSize]="9"
              (pageChange)="productsPage = $event"
            ></app-pagination>
          </ng-template>
        </div>

        <!-- Tab 2: Add/Edit Product -->
        <div *ngIf="activeTab === 'upsert'" class="space-y-6">
          <form (ngSubmit)="onSubmit()" class="space-y-6">
            <h3 class="text-lg font-bold text-zinc-950 dark:text-white uppercase tracking-wide border-b border-zinc-950/5 dark:border-white/5 pb-2 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5 text-zinc-400"><path d="M12 20v-6M9 17v-3M15 17v-3M12 8a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"/><path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-3.9a2 2 0 0 1-1.69-.9L13 3h-2L9.59 5.1a2 2 0 0 1-1.69.9H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16Z"/></svg>
              {{ editProduct ? 'Ürünü Düzenle: ' + editProduct.name : 'Yeni Ürün Oluştur' }}
            </h3>

            <app-input
              label="Ürün Adı"
              placeholder="Örn: Kablosuz Mat Siyah Kulaklık"
              [(ngModel)]="upsertData.name"
              name="name"
              [error]="upsertErrors.name"
            ></app-input>

            <div class="flex flex-col gap-1.5 text-left">
              <label class="text-sm font-medium text-zinc-700 dark:text-zinc-300">Açıklama</label>
              <textarea
                placeholder="Ürünün detaylı teknik ve görsel açıklamaları..."
                rows="4"
                [(ngModel)]="upsertData.description"
                name="description"
                [class]="'w-full bg-transparent border rounded-xl px-4 py-3 outline-none transition text-zinc-900 dark:text-zinc-50 ' + 
                  (upsertErrors.description 
                    ? 'border-red-500' 
                    : 'border-zinc-300 dark:border-zinc-800 focus:border-zinc-950 dark:focus:border-white')"
              ></textarea>
              <span *ngIf="upsertErrors.description" class="text-xs text-red-500 font-medium">{{ upsertErrors.description }}</span>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <app-input
                label="Satış Fiyatı (₺)"
                type="number"
                step="0.01"
                placeholder="299.99"
                [(ngModel)]="upsertData.price"
                name="price"
                [error]="upsertErrors.price"
              ></app-input>

              <app-input
                label="Stok Adedi"
                type="number"
                placeholder="50"
                [(ngModel)]="upsertData.stock"
                name="stock"
                [error]="upsertErrors.stock"
              ></app-input>
            </div>

            <div class="flex flex-col gap-1.5 text-left">
              <label class="text-sm font-medium text-zinc-700 dark:text-zinc-300">Kategori Seçimi</label>
              <select
                [(ngModel)]="upsertData.categoryId"
                name="categoryId"
                class="w-full bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 rounded-xl px-4 py-3 outline-none transition text-zinc-900 dark:text-zinc-100 focus:border-zinc-950 dark:focus:border-white"
              >
                <option *ngFor="let cat of categories" [value]="cat.id" class="bg-white text-zinc-900 dark:bg-zinc-900 dark:text-zinc-100">
                  {{ cat.name }}
                </option>
              </select>
            </div>

            <div class="flex flex-col gap-1.5 text-left">
              <label class="text-sm font-medium text-zinc-700 dark:text-zinc-300">Etiketler (Virgülle ayırın)</label>
              <input
                type="text"
                placeholder="Örn: kulaklık, mouse, laptop"
                [(ngModel)]="upsertData.tags"
                name="tags"
                class="w-full bg-transparent border border-zinc-300 dark:border-zinc-800 rounded-xl px-4 py-3 outline-none transition text-zinc-900 dark:text-zinc-50 focus:border-zinc-950 dark:focus:border-white"
              />
            </div>

            <!-- Product Images links (up to 3 links) -->
            <div class="space-y-4">
              <label class="text-sm font-medium text-zinc-700 dark:text-zinc-300 block">Ürün Görsel Linkleri</label>
              <div class="p-5 rounded-2xl border border-zinc-300 dark:border-zinc-850 space-y-4">
                <app-input
                  label="Ana Görsel URL (Vitrin resmi)"
                  placeholder="https://example.com/image1.jpg"
                  [(ngModel)]="upsertData.mainImage"
                  name="mainImage"
                  [error]="upsertErrors.mainImage"
                ></app-input>
                <app-input
                  label="Alternatif Görsel 2 URL (Opsiyonel)"
                  placeholder="https://example.com/image2.jpg"
                  [(ngModel)]="upsertData.image2"
                  name="image2"
                ></app-input>
                <app-input
                  label="Alternatif Görsel 3 URL (Opsiyonel)"
                  placeholder="https://example.com/image3.jpg"
                  [(ngModel)]="upsertData.image3"
                  name="image3"
                ></app-input>
              </div>
            </div>

            <div class="flex gap-4">
              <app-button type="submit" variant="primary" [disabled]="isSubmitLoading">
                {{ isSubmitLoading ? 'Kaydediliyor...' : (editProduct ? 'Ürünü Güncelle' : 'Ürünü Ekle') }}
              </app-button>
              <app-button
                type="button"
                variant="glass"
                (click)="handleCancelUpsert()"
              >
                Vazgeç
              </app-button>
            </div>
          </form>
        </div>

        <!-- Tab 3: Seller Orders -->
        <div *ngIf="activeTab === 'orders'" class="space-y-6">
          <div *ngIf="orders.length === 0; else ordersList" class="text-center py-12 text-zinc-500 font-medium">
            Henüz gelen sipariş bulunmuyor.
          </div>
          
          <ng-template #ordersList>
            <div class="space-y-6">
              <div
                *ngFor="let ord of paginatedOrders"
                class="border border-zinc-950/5 dark:border-white/5 rounded-2xl p-5 bg-zinc-950/[0.01] dark:bg-white/[0.01] text-xs space-y-4"
              >
                <!-- Top Row Order Info -->
                <div class="flex flex-wrap justify-between items-start border-b border-zinc-950/5 dark:border-white/5 pb-3">
                  <div class="space-y-1">
                    <p class="text-zinc-400">Sipariş: <strong class="text-zinc-900 dark:text-white">#{{ ord.id }}</strong></p>
                    <p class="text-[10px] text-zinc-400">Tarih: {{ formatDate(ord.createdDate) }}</p>
                  </div>
                  <div class="text-right">
                    <p class="text-zinc-400">Mağazanızın Kazancı</p>
                    <p class="font-extrabold text-sm text-zinc-900 dark:text-white">{{ ord.totalPrice | formatPrice }}</p>
                  </div>
                </div>

                <!-- Client Delivery details -->
                <div class="flex items-start gap-1 text-zinc-500">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 shrink-0 text-zinc-400 mt-0.5"><rect width="16" height="18" x="4" y="4" rx="2"/><path d="M9 9h6"/><path d="M9 13h6"/><path d="M9 17h6"/></svg>
                  <div>
                    <strong>Teslimat Bilgisi:</strong> {{ ord.addressTitle }} - {{ ord.shippingAddress }}
                  </div>
                </div>

                <!-- Items matching this seller -->
                <div class="space-y-3 pt-2">
                  <p class="text-[10px] uppercase font-bold text-zinc-400 tracking-wide">Sipariş Kalemleri & Durumu</p>
                  
                  <div class="divide-y divide-zinc-950/5 dark:divide-white/5">
                    <div *ngFor="let item of ord.orderItems" class="flex items-center justify-between gap-4 py-2.5 first:pt-0 last:pb-0">
                      <div class="flex items-center gap-2">
                        <div class="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center font-bold text-zinc-400 text-xs">
                          {{ item.productName[0] }}
                        </div>
                        <div>
                          <p class="font-bold text-zinc-900 dark:text-white">{{ item.productName }}</p>
                          <p class="text-zinc-400 text-[10px]">{{ item.price | formatPrice }} x {{ item.quantity }}</p>
                        </div>
                      </div>

                      <!-- Status Update Action Dropdown -->
                      <div class="flex items-center gap-2 text-zinc-500">
                        <span>Durum:</span>
                        <span [class]="getStatusBadgeClass(item.status)">{{ getStatusBadgeLabel(item.status) }}</span>
                        <select
                          [ngModel]="getStatusIntValue(item.status)"
                          (change)="handleStatusChange(item.id, $any($event.target).value)"
                          class="ml-2 text-[10px] bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg px-2.5 py-1.5 text-zinc-900 dark:text-zinc-50 outline-none cursor-pointer focus:ring-1 focus:ring-zinc-400 focus:border-zinc-400"
                        >
                          <option [value]="1" class="dark:bg-zinc-900">Alındı</option>
                          <option [value]="2" class="dark:bg-zinc-900">Hazırlanıyor</option>
                          <option [value]="3" class="dark:bg-zinc-900">Kargoya Ver</option>
                          <option [value]="4" class="dark:bg-zinc-900">Teslim Edildi</option>
                          <option [value]="5" class="dark:bg-zinc-900">İptal Et</option>
                        </select>
                      </div>

                    </div>
                  </div>
                </div>

              </div>
              <app-pagination
                [currentPage]="ordersPage"
                [totalItems]="orders.length"
                [pageSize]="9"
                (pageChange)="ordersPage = $event"
              ></app-pagination>
            </div>
          </ng-template>
        </div>

      </main>

    </div>
  `
})
export class SellerPanelComponent implements OnInit {
  activeTab: 'products' | 'upsert' | 'orders' = 'products';
  products: ProductListDto[] = [];
  orders: OrderDto[] = [];
  categories: CategoryDto[] = [];
  isLoading = false;
  isSubmitLoading = false;
  editProduct: ProductListDto | null = null;

  productsPage = 1;
  ordersPage = 1;

  get paginatedProducts(): ProductListDto[] {
    return this.products.slice((this.productsPage - 1) * 9, this.productsPage * 9);
  }

  get paginatedOrders(): OrderDto[] {
    return this.orders.slice((this.ordersPage - 1) * 9, this.ordersPage * 9);
  }

  upsertData = {
    name: '',
    description: '',
    price: 0,
    stock: 0,
    categoryId: 1,
    mainImage: '',
    image2: '',
    image3: '',
    tags: ''
  };

  upsertErrors = {
    name: '',
    description: '',
    price: '',
    stock: '',
    mainImage: ''
  };

  constructor(
    private productService: ProductService,
    private orderService: OrderService,
    private categoryService: CategoryService,
    private toastService: ToastService
  ) {}

  ngOnInit() {
    this.loadSellerData();
  }

  async loadSellerData() {
    this.isLoading = true;
    try {
      const [prodData, orderData, catData] = await Promise.all([
        this.productService.getMyProducts(),
        this.orderService.getSellerOrders(),
        this.categoryService.getAll()
      ]);
      this.products = prodData;
      this.orders = orderData;
      this.categories = catData;

      this.productsPage = Math.min(this.productsPage, Math.ceil(this.products.length / 9) || 1);
      this.ordersPage = Math.min(this.ordersPage, Math.ceil(this.orders.length / 9) || 1);

      if (catData.length > 0 && !this.upsertData.categoryId) {
        this.upsertData.categoryId = 1;
      }
    } catch (err: any) {
      this.toastService.showToast(err.message || 'Satıcı verileri yüklenemedi.', 'error');
    } finally {
      this.isLoading = false;
    }
  }

  handleEditClick(prod: ProductListDto) {
    this.editProduct = prod;
    this.activeTab = 'upsert';
    this.upsertData = {
      name: prod.name,
      description: prod.description,
      price: prod.price,
      stock: prod.stock,
      categoryId: prod.categoryId,
      mainImage: prod.mainImageUrl || '',
      image2: prod.imageUrls[1] || '',
      image3: prod.imageUrls[2] || '',
      tags: prod.tags ? prod.tags.join(', ') : ''
    };
    this.resetUpsertErrors();
  }

  handleNewProductClick() {
    this.editProduct = null;
    this.activeTab = 'upsert';
    this.upsertData = {
      name: '',
      description: '',
      price: 0,
      stock: 0,
      categoryId: 1,
      mainImage: '',
      image2: '',
      image3: '',
      tags: ''
    };
    this.resetUpsertErrors();
  }

  handleCancelUpsert() {
    this.editProduct = null;
    this.activeTab = 'products';
    this.resetUpsertErrors();
  }

  resetUpsertErrors() {
    this.upsertErrors = {
      name: '',
      description: '',
      price: '',
      stock: '',
      mainImage: ''
    };
  }

  getFallbackImg(name: string): string {
    return `https://placehold.co/100x100/0a0a0a/fafafa?text=${encodeURIComponent(name)}`;
  }

  async handleDeleteProduct(id: number) {
    if (!confirm('Bu ürünü silmek istediğinize emin misiniz? (Soft delete)')) return;
    try {
      await this.productService.delete(id);
      this.toastService.showToast('Ürün başarıyla silindi.', 'success');
      this.loadSellerData();
    } catch (err: any) {
      this.toastService.showToast(err.message || 'Ürün silinemedi.', 'error');
    }
  }

  validateUpsert(): boolean {
    let isValid = true;
    this.resetUpsertErrors();

    if (!this.upsertData.name) {
      this.upsertErrors.name = 'Ürün adı zorunludur.';
      isValid = false;
    } else if (this.upsertData.name.length > 150) {
      this.upsertErrors.name = 'En fazla 150 karakter olabilir.';
      isValid = false;
    }

    if (!this.upsertData.description) {
      this.upsertErrors.description = 'Açıklama zorunludur.';
      isValid = false;
    } else if (this.upsertData.description.length > 10000) {
      this.upsertErrors.description = 'En fazla 10000 karakter olabilir.';
      isValid = false;
    }

    if (this.upsertData.price === null || this.upsertData.price === undefined || this.upsertData.price <= 0) {
      this.upsertErrors.price = 'Fiyat 0\'dan büyük olmalıdır.';
      isValid = false;
    }

    if (this.upsertData.stock === null || this.upsertData.stock === undefined || this.upsertData.stock < 0) {
      this.upsertErrors.stock = 'Stok negatif olamaz.';
      isValid = false;
    }

    if (!this.upsertData.mainImage) {
      this.upsertErrors.mainImage = 'Ana görsel URL zorunludur.';
      isValid = false;
    }

    return isValid;
  }

  async onSubmit() {
    if (!this.validateUpsert()) return;

    this.isSubmitLoading = true;
    const imageUrlsList = [this.upsertData.mainImage, this.upsertData.image2, this.upsertData.image3].filter(Boolean) as string[];
    const tagsList = this.upsertData.tags
      ? this.upsertData.tags.split(',').map(t => t.trim()).filter(Boolean)
      : [];

    try {
      if (this.editProduct) {
        // Edit product
        await this.productService.update({
          id: this.editProduct.id,
          name: this.upsertData.name,
          description: this.upsertData.description,
          price: Number(this.upsertData.price),
          stock: Number(this.upsertData.stock),
          categoryId: Number(this.upsertData.categoryId),
          imageUrls: imageUrlsList,
          tags: tagsList
        });
        this.toastService.showToast('Ürün başarıyla güncellendi.', 'success');
      } else {
        // Create product
        await this.productService.create({
          name: this.upsertData.name,
          description: this.upsertData.description,
          price: Number(this.upsertData.price),
          stock: Number(this.upsertData.stock),
          categoryId: Number(this.upsertData.categoryId),
          imageUrls: imageUrlsList,
          tags: tagsList
        });
        this.toastService.showToast('Yeni ürün kataloğa başarıyla eklendi.', 'success');
      }

      this.editProduct = null;
      this.activeTab = 'products';
      await this.loadSellerData();
    } catch (err: any) {
      this.toastService.showToast(err.message || 'İşlem gerçekleştirilemedi.', 'error');
    } finally {
      this.isSubmitLoading = false;
    }
  }

  async handleStatusChange(orderItemId: number, newStatusValue: string) {
    const statusEnumInt = parseInt(newStatusValue, 10) as OrderStatus;
    try {
      await this.orderService.updateOrderItemStatus(orderItemId, statusEnumInt);
      this.toastService.showToast('Sipariş kalemi durumu güncellendi.', 'success');
      this.loadSellerData();
    } catch (err: any) {
      this.toastService.showToast(err.message || 'Durum güncellenemedi.', 'error');
    }
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('tr-TR');
  }

  getStatusBadgeLabel(status: string): string {
    switch (status) {
      case 'Received': return 'Alındı';
      case 'Preparing': return 'Hazırlanıyor';
      case 'Shipped': return 'Kargoda';
      case 'Delivered': return 'Teslim Edildi';
      case 'Cancelled': return 'İptal Edildi';
      default: return status;
    }
  }

  getStatusBadgeClass(status: string): string {
    const base = "text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider ";
    switch (status) {
      case 'Received': return base + "bg-blue-50 text-blue-600";
      case 'Preparing': return base + "bg-amber-50 text-amber-600";
      case 'Shipped': return base + "bg-zinc-900 text-white";
      case 'Delivered': return base + "bg-emerald-50 text-emerald-600";
      case 'Cancelled': return base + "bg-red-50 text-red-600";
      default: return base + "bg-zinc-100 text-zinc-600";
    }
  }

  getStatusIntValue(status: string): number {
    switch (status) {
      case 'Received': return 1;
      case 'Preparing': return 2;
      case 'Shipped': return 3;
      case 'Delivered': return 4;
      case 'Cancelled': return 5;
      default: return 1;
    }
  }

  setActiveTab(tab: 'products' | 'upsert' | 'orders') {
    this.activeTab = tab;
  }
}
