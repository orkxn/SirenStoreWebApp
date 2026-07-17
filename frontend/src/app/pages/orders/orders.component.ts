import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { OrderDto } from '../../models/api.types';
import { OrderService } from '../../services/order.service';
import { ToastService } from '../../services/toast.service';
import { ButtonComponent } from '../../components/button/button.component';
import { OrderRowSkeletonComponent } from '../../components/skeleton/skeleton.component';
import { FormatPricePipe } from '../../pipes/format-price.pipe';
import { PaginationComponent } from '../../components/pagination/pagination.component';
import { LucidePackage, LucideCalendar, LucideChevronDown, LucideChevronUp, LucideMapPin } from '@lucide/angular';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ButtonComponent,
    OrderRowSkeletonComponent,
    FormatPricePipe,
    PaginationComponent,
    LucidePackage,
    LucideCalendar,
    LucideChevronDown,
    LucideChevronUp,
    LucideMapPin
  ],
  template: `
    <div class="max-w-4xl mx-auto px-6 py-10 space-y-8 text-left">
      
      <!-- Header -->
      <div class="border-b border-zinc-950/5 dark:border-white/5 pb-6">
        <h1 class="text-4xl font-extrabold tracking-tight text-zinc-950 dark:text-white uppercase leading-none">
          Siparişlerim
        </h1>
        <p class="text-sm text-zinc-500 dark:text-zinc-400 mt-1.5">
          Geçmiş alışverişlerinizi ve güncel sipariş durumlarını buradan takip edebilirsiniz.
        </p>
      </div>

      <div *ngIf="isLoading; else ordersLoaded" class="space-y-4">
        <app-order-row-skeleton></app-order-row-skeleton>
        <app-order-row-skeleton></app-order-row-skeleton>
      </div>

      <ng-template #ordersLoaded>
        <div *ngIf="orders.length === 0; else ordersList" class="text-center py-20 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-3xl space-y-4">
          <svg lucidePackage class="w-12 h-12 text-zinc-400 mx-auto"></svg>
          <p class="text-zinc-500 font-medium">Henüz hiçbir siparişiniz bulunmuyor.</p>
          <a routerLink="/products" class="inline-block mt-2">
            <app-button variant="primary">Alışverişe Başla</app-button>
          </a>
        </div>

        <ng-template #ordersList>
          <div class="space-y-4">
            <div
              *ngFor="let order of paginatedOrders"
              class="border border-zinc-950/5 dark:border-white/10 rounded-2xl overflow-hidden glass-surface bg-zinc-950/[0.01] dark:bg-white/[0.02]"
            >
              <!-- Header Row -->
              <div
                (click)="toggleExpand(order.id)"
                class="p-6 cursor-pointer flex flex-wrap justify-between items-center gap-4 hover:bg-zinc-950/[0.02] dark:hover:bg-white/5 transition-all select-none"
              >
                <div class="flex flex-wrap gap-6 text-xs text-zinc-500">
                  <div>
                    <p class="text-[10px] uppercase font-bold text-zinc-400 dark:text-zinc-500 tracking-wider">Sipariş No</p>
                    <p class="font-bold text-zinc-900 dark:text-white mt-1 text-sm">#{{ order.id }}</p>
                  </div>
                  <div>
                    <p class="text-[10px] uppercase font-bold text-zinc-400 dark:text-zinc-500 tracking-wider flex items-center gap-1">
                      <svg lucideCalendar class="w-3 h-3"></svg> Tarih
                    </p>
                    <p class="font-bold text-zinc-950 dark:text-zinc-300 mt-1">{{ formatDate(order.createdDate) }}</p>
                  </div>
                  <div>
                    <p class="text-[10px] uppercase font-bold text-zinc-400 dark:text-zinc-500 tracking-wider">Toplam Tutar</p>
                    <p class="font-extrabold text-zinc-950 dark:text-zinc-200 mt-1">{{ order.totalPrice | formatPrice }}</p>
                  </div>
                </div>

                <div class="flex items-center gap-4">
                  <span [class]="getStatusClass(order.status)">{{ getStatusLabel(order.status) }}</span>
                  <svg *ngIf="expandedOrderId !== order.id" lucideChevronDown class="w-4 h-4 text-zinc-400"></svg>
                  <svg *ngIf="expandedOrderId === order.id" lucideChevronUp class="w-4 h-4 text-zinc-400"></svg>
                </div>
              </div>

              <!-- Details Accordion Panel -->
              <div
                *ngIf="expandedOrderId === order.id"
                class="overflow-hidden border-t border-zinc-950/5 dark:border-white/5 transition-all duration-300"
              >
                <div class="p-6 bg-zinc-950/[0.02] dark:bg-white/[0.01] space-y-6 text-sm">
                  
                  <!-- Address detail -->
                  <div class="flex items-start gap-2 text-xs text-zinc-500 dark:text-zinc-400">
                    <svg lucideMapPin class="w-4 h-4 text-zinc-400 shrink-0 mt-0.5"></svg>
                    <div>
                      <strong class="text-zinc-800 dark:text-zinc-200">{{ order.addressTitle }}:</strong> {{ order.shippingAddress }}
                    </div>
                  </div>

                  <!-- Order Items Table -->
                  <div class="space-y-4">
                    <p class="text-xs uppercase font-bold tracking-wider text-zinc-400 dark:text-zinc-500">Sipariş İçeriği</p>
                    <div class="divide-y divide-zinc-950/5 dark:divide-white/5">
                      <div
                        *ngFor="let item of order.orderItems"
                        class="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0"
                      >
                        <div class="flex items-center gap-3">
                          <div class="w-10 h-10 rounded-lg bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center font-bold text-zinc-500 text-xs shrink-0 select-none">
                            {{ item.productName[0].toUpperCase() }}
                          </div>
                          <div class="text-xs">
                            <a [routerLink]="'/product/' + item.productId" class="font-semibold text-zinc-950 dark:text-white hover:underline">
                              {{ item.productName }}
                            </a>
                            <p class="text-zinc-400 mt-0.5">{{ item.price | formatPrice }} x {{ item.quantity }}</p>
                          </div>
                        </div>

                        <div class="flex items-center gap-4 text-xs font-semibold">
                          <span class="text-zinc-400 dark:text-zinc-500">Durum:</span>
                          <span [class]="getStatusClass(item.status)">{{ getStatusLabel(item.status) }}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>

            </div>
            <app-pagination
              [currentPage]="currentPage"
              [totalItems]="orders.length"
              [pageSize]="9"
              (pageChange)="currentPage = $event"
            ></app-pagination>
          </div>
        </ng-template>
      </ng-template>

    </div>
  `
})
export class OrdersComponent implements OnInit {
  orders: OrderDto[] = [];
  isLoading = true;
  expandedOrderId: number | null = null;
  currentPage = 1;

  get paginatedOrders(): OrderDto[] {
    return this.orders.slice((this.currentPage - 1) * 9, this.currentPage * 9);
  }

  constructor(
    private orderService: OrderService,
    private toastService: ToastService
  ) {}

  ngOnInit() {
    this.fetchOrders();
  }

  async fetchOrders() {
    try {
      this.orders = await this.orderService.getMyOrders();
    } catch (err: any) {
      this.toastService.showToast(err.message || 'Siparişleriniz yüklenirken bir hata oluştu.', 'error');
    } finally {
      this.isLoading = false;
    }
  }

  toggleExpand(id: number) {
    this.expandedOrderId = this.expandedOrderId === id ? null : id;
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'Received': return 'Alındı';
      case 'Preparing': return 'Hazırlanıyor';
      case 'Shipped': return 'Kargoda';
      case 'Delivered': return 'Teslim Edildi';
      case 'Cancelled': return 'İptal Edildi';
      default: return status;
    }
  }

  getStatusClass(status: string): string {
    const base = "text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider border ";
    switch (status) {
      case 'Received':
        return base + "bg-blue-50/50 dark:bg-blue-950/20 text-blue-600 border-blue-200 dark:border-blue-900/30";
      case 'Preparing':
        return base + "bg-amber-50/50 dark:bg-amber-950/20 text-amber-600 border-amber-200 dark:border-amber-900/30";
      case 'Shipped':
        return base + "bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 border-zinc-950 dark:border-white";
      case 'Delivered':
        return base + "bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-600 border-emerald-200 dark:border-emerald-900/30";
      case 'Cancelled':
        return base + "bg-red-50/50 dark:bg-red-950/20 text-red-600 border-red-200 dark:border-red-900/30";
      default:
        return base + "bg-zinc-100 text-zinc-600 border-zinc-200";
    }
  }
}
