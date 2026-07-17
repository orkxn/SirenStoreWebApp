import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../services/cart.service';
import { OrderService } from '../../services/order.service';
import { ToastService } from '../../services/toast.service';
import { InputComponent } from '../../components/input/input.component';
import { ButtonComponent } from '../../components/button/button.component';
import { FormatPricePipe } from '../../pipes/format-price.pipe';
import { LucideChevronLeft, LucideCheckCircle, LucideTrash2, LucideCreditCard, LucideShoppingCart } from '@lucide/angular';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    FormsModule,
    InputComponent,
    ButtonComponent,
    FormatPricePipe,
    LucideChevronLeft,
    LucideCheckCircle,
    LucideTrash2,
    LucideCreditCard,
    LucideShoppingCart
  ],
  template: `
    <div class="max-w-6xl mx-auto px-6 py-10 space-y-8 text-left">
      
      <!-- Back to Cart -->
      <div>
        <a routerLink="/cart" class="inline-flex items-center gap-1 text-xs font-semibold text-zinc-500 hover:text-zinc-950 dark:hover:text-white transition-colors">
          <svg lucideChevronLeft class="w-4 h-4"></svg> Sepetime Dön
        </a>
      </div>

      <div class="border-b border-zinc-950/5 dark:border-white/5 pb-6">
        <h1 class="text-4xl font-extrabold tracking-tight text-zinc-950 dark:text-white uppercase leading-none">Ödeme / Checkout</h1>
        <p class="text-sm text-zinc-500 dark:text-zinc-400 mt-1.5">Sipariş teslimat ve ödeme bilgilerini doldurun.</p>
      </div>

      <!-- Success Screen -->
      <div *ngIf="isSuccess && createdOrder" class="max-w-xl mx-auto px-6 py-20 text-center space-y-6">
        <div class="flex flex-col items-center justify-center space-y-4">
          <svg lucideCheckCircle class="w-16 h-16 text-zinc-950 dark:text-white"></svg>
          <h1 class="text-3xl font-extrabold text-zinc-950 dark:text-white uppercase tracking-tight">Sipariş Alındı!</h1>
          <p class="text-sm text-zinc-500 dark:text-zinc-400">Sipariş numaranız: <strong>#{{ createdOrder.id }}</strong></p>
        </div>
        
        <div class="p-6 rounded-2xl glass-surface bg-zinc-950/[0.01] dark:bg-white/5 border border-zinc-950/5 dark:border-white/10 text-left space-y-4 text-sm">
          <div class="flex justify-between border-b border-zinc-950/5 dark:border-white/5 pb-2.5">
            <span class="font-semibold text-zinc-900 dark:text-zinc-100">Adres Başlığı:</span>
            <span>{{ createdOrder.addressTitle }}</span>
          </div>
          <div class="flex justify-between border-b border-zinc-950/5 dark:border-white/5 pb-2.5">
            <span class="font-semibold text-zinc-900 dark:text-zinc-100">Teslimat Adresi:</span>
            <span class="truncate max-w-[200px]">{{ createdOrder.shippingAddress }}</span>
          </div>
          <div class="flex justify-between">
            <span class="font-semibold text-zinc-900 dark:text-zinc-100">Toplam Tutar:</span>
            <span class="font-bold">{{ createdOrder.totalPrice | formatPrice }}</span>
          </div>
        </div>

        <div class="flex flex-col sm:flex-row gap-4">
          <a routerLink="/orders" class="flex-grow">
            <app-button variant="primary" [fullWidth]="true">Sipariş Takibi</app-button>
          </a>
          <a routerLink="/" class="flex-grow">
            <app-button variant="glass" [fullWidth]="true">Ana Sayfaya Dön</app-button>
          </a>
        </div>
      </div>

      <!-- Main Form and Cart view -->
      <ng-container *ngIf="!isSuccess">
        <div *ngIf="!cart || cart.items.length === 0" class="max-w-7xl mx-auto px-6 py-20 text-center space-y-4">
          <p class="text-zinc-500 font-medium">Sipariş oluşturmak için sepetinizde ürün bulunmalıdır.</p>
          <a routerLink="/products">
            <app-button variant="primary">Kataloğa Göz At</app-button>
          </a>
        </div>

        <form *ngIf="cart && cart.items.length > 0" (ngSubmit)="onSubmit()" class="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          <!-- Left Columns - Forms -->
          <div class="lg:col-span-2 space-y-8">
            
            <!-- Section 1: Delivery info -->
            <div class="space-y-4">
              <h3 class="text-lg font-bold text-zinc-950 dark:text-white uppercase tracking-wide border-b border-zinc-950/5 dark:border-white/5 pb-2">
                1. Teslimat Adresi
              </h3>
              
              <div class="space-y-4">
                <!-- Kayıtlı Adres Seçimi -->
                <div *ngIf="savedAddresses.length > 0" class="flex flex-col gap-1.5">
                  <label class="text-sm font-medium text-zinc-700 dark:text-zinc-300">Kayıtlı Adresleriniz</label>
                  <div class="flex gap-2">
                    <select
                      [(ngModel)]="selectedSavedAddressTitle"
                      (change)="onSavedAddressChange()"
                      name="selectedSavedAddressTitle"
                      class="flex-grow bg-transparent border border-zinc-300 dark:border-zinc-800 focus:border-zinc-950 dark:focus:border-white rounded-xl px-4 py-3 outline-none transition text-zinc-900 dark:text-zinc-50 dark:bg-zinc-950"
                    >
                      <option value="new" class="bg-white dark:bg-zinc-950">Yeni Adres Ekle...</option>
                      <option *ngFor="let addr of savedAddresses" [value]="addr.addressTitle" class="bg-white dark:bg-zinc-950">
                        {{ addr.addressTitle }}
                      </option>
                    </select>

                    <button
                      *ngIf="selectedSavedAddressTitle !== 'new'"
                      type="button"
                      (click)="onDeleteAddress()"
                      class="px-3.5 py-3 border border-red-200 dark:border-red-900/30 text-red-600 hover:bg-red-500/10 rounded-xl transition-all flex items-center justify-center shrink-0"
                      title="Kayıtlı Adresi Sil"
                    >
                      <svg lucideTrash2 class="w-[18px] h-[18px]"></svg>
                    </button>
                  </div>
                </div>

                <app-input
                  *ngIf="savedAddresses.length === 0 || selectedSavedAddressTitle === 'new'"
                  label="Adres Başlığı"
                  placeholder="Evim, İş Yerim..."
                  [(ngModel)]="addressTitle"
                  name="addressTitle"
                  [error]="addressTitleError"
                ></app-input>

                <div class="flex flex-col gap-1.5">
                  <label class="text-sm font-medium text-zinc-700 dark:text-zinc-300">Detaylı Adres</label>
                  <textarea
                    placeholder="Mahalle, Sokak, Daire, İlçe/İl..."
                    rows="3"
                    [(ngModel)]="shippingAddress"
                    name="shippingAddress"
                    [class]="'w-full bg-transparent border rounded-xl px-4 py-3 outline-none transition text-zinc-900 dark:text-zinc-50 ' + 
                      (shippingAddressError 
                        ? 'border-red-500' 
                        : 'border-zinc-300 dark:border-zinc-800 focus:border-zinc-950 dark:focus:border-white')"
                  ></textarea>
                  <span *ngIf="shippingAddressError" class="text-xs text-red-500 font-medium">{{ shippingAddressError }}</span>
                </div>
              </div>
            </div>

            <!-- Section 2: Mock Payment info -->
            <div class="space-y-4">
              <h3 class="text-lg font-bold text-zinc-950 dark:text-white uppercase tracking-wide border-b border-zinc-950/5 dark:border-white/5 pb-2">
                2. Ödeme Bilgileri
              </h3>
              
              <div class="p-6 rounded-2xl glass-surface bg-zinc-950/[0.01] dark:bg-white/5 border border-zinc-950/5 dark:border-white/10 space-y-4">
                <div class="flex items-center gap-2 text-zinc-700 dark:text-zinc-300 text-sm font-medium mb-2">
                  <svg lucideCreditCard class="w-5 h-5"></svg> Kredi / Banka Kartı
                </div>

                <app-input
                  label="Kart Üzerindeki İsim"
                  placeholder="John Doe"
                  [(ngModel)]="cardHolderName"
                  name="cardHolderName"
                  [error]="cardHolderNameError"
                ></app-input>

                <app-input
                  label="Kart Numarası"
                  placeholder="4000 1234 5678 9010"
                  [ngModel]="cardNumber"
                  (ngModelChange)="onCardNumberChange($event)"
                  name="cardNumber"
                  [error]="cardNumberError"
                  maxLength="19"
                ></app-input>

                <div class="grid grid-cols-2 gap-4">
                  <app-input
                    label="Son Kullanma Tarihi (AA/YY)"
                    placeholder="12/28"
                    [ngModel]="cardExpiry"
                    (ngModelChange)="onCardExpiryChange($event)"
                    name="cardExpiry"
                    [error]="cardExpiryError"
                    maxLength="5"
                  ></app-input>
                  <app-input
                    label="Güvenlik Kodu (CVV)"
                    placeholder="321"
                    [ngModel]="cardCvv"
                    (ngModelChange)="onCardCvvChange($event)"
                    name="cardCvv"
                    [error]="cardCvvError"
                    maxLength="3"
                  ></app-input>
                </div>
              </div>
            </div>

          </div>

          <!-- Right Column - Order Summary -->
          <div class="lg:col-span-1 space-y-6">
            <div class="glass-surface bg-zinc-950/[0.01] dark:bg-white/5 border border-zinc-950/5 dark:border-white/10 rounded-2xl p-6 space-y-6">
              <h3 class="font-bold text-sm text-zinc-900 dark:text-white uppercase tracking-wider border-b border-zinc-950/5 dark:border-white/5 pb-4 flex items-center gap-2">
                <svg lucideShoppingCart class="w-4 h-4"></svg> Sipariş Kalemleri
              </h3>

              <!-- List items briefly -->
              <div class="space-y-3 max-h-60 overflow-y-auto pr-1">
                <div *ngFor="let item of cart.items" class="flex justify-between text-xs gap-4">
                  <span class="text-zinc-600 dark:text-zinc-400 line-clamp-1">
                    {{ item.productName }} <strong class="text-zinc-900 dark:text-white">x{{ item.quantity }}</strong>
                  </span>
                  <span class="font-semibold text-zinc-900 dark:text-white">{{ item.totalPrice | formatPrice }}</span>
                </div>
              </div>

              <!-- Pricing calculations -->
              <div class="border-t border-zinc-950/5 dark:border-white/5 pt-4 space-y-3 text-sm">
                <div class="flex justify-between text-zinc-500">
                  <span>Sepet Toplamı</span>
                  <span class="font-semibold text-zinc-900 dark:text-white">{{ subtotal | formatPrice }}</span>
                </div>
                <div class="flex justify-between text-zinc-500">
                  <span>Kargo</span>
                  <span *ngIf="shippingCost === 0; else showShipping" class="text-emerald-600 font-bold">Ücretsiz</span>
                  <ng-template #showShipping>
                    <span class="font-semibold text-zinc-900 dark:text-white">{{ shippingCost | formatPrice }}</span>
                  </ng-template>
                </div>
                <div class="flex justify-between border-t border-zinc-950/5 dark:border-white/5 pt-4 text-base font-bold text-zinc-950 dark:text-white">
                  <span>Toplam Tutar</span>
                  <span>{{ grandTotal | formatPrice }}</span>
                </div>
              </div>

              <app-button
                type="submit"
                variant="primary"
                size="lg"
                [fullWidth]="true"
                [disabled]="isLoading"
              >
                {{ isLoading ? 'Sipariş Oluşturuluyor...' : 'Siparişi Onayla' }}
              </app-button>
            </div>
          </div>

        </form>
      </ng-container>

    </div>
  `
})
export class CheckoutComponent implements OnInit {
  addressTitle = '';
  shippingAddress = '';
  cardHolderName = '';
  cardNumber = '';
  cardExpiry = '';
  cardCvv = '';

  addressTitleError = '';
  shippingAddressError = '';
  cardHolderNameError = '';
  cardNumberError = '';
  cardExpiryError = '';
  cardCvvError = '';

  isLoading = false;
  isSuccess = false;
  createdOrder: any = null;

  savedAddresses: { addressTitle: string; shippingAddress: string }[] = [];
  selectedSavedAddressTitle = 'new';

  constructor(
    public cartService: CartService,
    private orderService: OrderService,
    private toastService: ToastService
  ) {}

  async ngOnInit() {
    try {
      this.savedAddresses = await this.orderService.getSavedAddresses();
      if (this.savedAddresses.length > 0) {
        this.selectedSavedAddressTitle = this.savedAddresses[0].addressTitle;
        this.addressTitle = this.savedAddresses[0].addressTitle;
        this.shippingAddress = this.savedAddresses[0].shippingAddress;
      }
    } catch (err) {
      console.error('Kayıtlı adresler yüklenemedi:', err);
    }
  }

  onSavedAddressChange() {
    if (this.selectedSavedAddressTitle === 'new') {
      this.addressTitle = '';
      this.shippingAddress = '';
    } else {
      const found = this.savedAddresses.find(a => a.addressTitle === this.selectedSavedAddressTitle);
      if (found) {
        this.addressTitle = found.addressTitle;
        this.shippingAddress = found.shippingAddress;
      }
    }
  }

  async onDeleteAddress() {
    if (!this.selectedSavedAddressTitle || this.selectedSavedAddressTitle === 'new') return;

    if (!confirm(`"${this.selectedSavedAddressTitle}" isimli adresi silmek istediğinize emin misiniz?`)) {
      return;
    }

    try {
      await this.orderService.deleteSavedAddress(this.selectedSavedAddressTitle);
      this.toastService.showToast('Kayıtlı adres başarıyla silindi.', 'success');

      // Reload saved addresses
      this.savedAddresses = await this.orderService.getSavedAddresses();

      if (this.savedAddresses.length > 0) {
        this.selectedSavedAddressTitle = this.savedAddresses[0].addressTitle;
        this.addressTitle = this.savedAddresses[0].addressTitle;
        this.shippingAddress = this.savedAddresses[0].shippingAddress;
      } else {
        this.selectedSavedAddressTitle = 'new';
        this.addressTitle = '';
        this.shippingAddress = '';
      }
    } catch (err: any) {
      this.toastService.showToast(err.message || 'Adres silinemedi.', 'error');
    }
  }

  get cart() {
    return this.cartService.cart;
  }

  get subtotal() {
    return this.cart?.grandTotal || 0;
  }

  get shippingCost() {
    return this.subtotal >= 1500 || this.subtotal === 0 ? 0 : 50;
  }

  get grandTotal() {
    return this.subtotal + this.shippingCost;
  }

  validate(): boolean {
    let isValid = true;

    this.addressTitleError = '';
    this.shippingAddressError = '';
    this.cardHolderNameError = '';
    this.cardNumberError = '';
    this.cardExpiryError = '';
    this.cardCvvError = '';

    if (!this.addressTitle) {
      this.addressTitleError = 'Adres başlığı zorunludur.';
      isValid = false;
    } else if (this.addressTitle.length > 100) {
      this.addressTitleError = 'En fazla 100 karakter olabilir.';
      isValid = false;
    }

    if (!this.shippingAddress) {
      this.shippingAddressError = 'Adres detayları zorunludur.';
      isValid = false;
    } else if (this.shippingAddress.length < 10) {
      this.shippingAddressError = 'Lütfen daha detaylı bir adres giriniz (En az 10 karakter).';
      isValid = false;
    } else if (this.shippingAddress.length > 500) {
      this.shippingAddressError = 'En fazla 500 karakter olabilir.';
      isValid = false;
    }

    if (!this.cardHolderName) {
      this.cardHolderNameError = 'Kart sahibi ismi zorunludur.';
      isValid = false;
    }

    if (!this.cardNumber) {
      this.cardNumberError = 'Kart numarası zorunludur.';
      isValid = false;
    } else {
      const cleanNum = this.cardNumber.replace(/\s+/g, '');
      if (!/^\d{16}$/.test(cleanNum)) {
        this.cardNumberError = 'Lütfen 16 haneli kart numarasını giriniz.';
        isValid = false;
      }
    }

    if (!this.cardExpiry) {
      this.cardExpiryError = 'S.K.T. zorunludur.';
      isValid = false;
    }

    if (!this.cardCvv) {
      this.cardCvvError = 'CVV kodu zorunludur.';
      isValid = false;
    } else if (!/^\d{3}$/.test(this.cardCvv)) {
      this.cardCvvError = 'CVV 3 haneli olmalıdır.';
      isValid = false;
    }

    return isValid;
  }

  async onSubmit() {
    if (!this.validate()) return;

    this.isLoading = true;
    try {
      const result = await this.orderService.createOrder({
        addressTitle: this.addressTitle,
        shippingAddress: this.shippingAddress,
        cardNumber: this.cardNumber,
        cardHolderName: this.cardHolderName,
        cardExpiry: this.cardExpiry,
        cardCvv: this.cardCvv
      });
      this.createdOrder = result;
      this.isSuccess = true;
      this.toastService.showToast('Siparişiniz başarıyla alındı!', 'success');
      await this.cartService.fetchCart();
    } catch (err: any) {
      this.toastService.showToast(err.message || 'Sipariş oluşturulamadı.', 'error');
    } finally {
      this.isLoading = false;
    }
  }

  onCardNumberChange(val: string) {
    let clean = val.replace(/\D/g, '');
    if (clean.length > 16) {
      clean = clean.substring(0, 16);
    }
    const parts = [];
    for (let i = 0; i < clean.length; i += 4) {
      parts.push(clean.substring(i, i + 4));
    }
    this.cardNumber = parts.join(' ');
  }

  onCardExpiryChange(val: string) {
    let clean = val.replace(/\D/g, '');
    if (clean.length > 4) {
      clean = clean.substring(0, 4);
    }
    if (clean.length > 2) {
      this.cardExpiry = clean.substring(0, 2) + '/' + clean.substring(2);
    } else {
      this.cardExpiry = clean;
    }
  }

  onCardCvvChange(val: string) {
    let clean = val.replace(/\D/g, '');
    if (clean.length > 3) {
      clean = clean.substring(0, 3);
    }
    this.cardCvv = clean;
  }
}
