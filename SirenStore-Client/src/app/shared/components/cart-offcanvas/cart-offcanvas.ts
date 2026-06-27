import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BasketService } from '../../../core/services/basket.service';
import { OffcanvasService } from '../../../core/services/offcanvas.service';

import { OrderService } from '../../../core/services/order.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart-offcanvas',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './cart-offcanvas.html',
})
export class CartOffcanvasComponent {
  basketService = inject(BasketService);
  offcanvasService = inject(OffcanvasService);
  orderService = inject(OrderService);
  router = inject(Router);

  basketCount = this.basketService.basketCount;
  basketTotal = this.basketService.basketTotal;
  basket = this.basketService.basket;

  isOpen = this.offcanvasService.isCartOpen;
  isCheckingOut = false;

  closeCart() {
    this.offcanvasService.closeCart();
  }

  removeItem(productId: number) {
    this.basketService.removeItem(productId).subscribe();
  }

  updateQuantity(productId: number, quantity: number) {
    if (quantity > 0) {
      this.basketService.updateQuantity(productId, quantity).subscribe();
    } else {
      this.removeItem(productId);
    }
  }

  checkout() {
    this.isCheckingOut = true;
    this.orderService.createOrder({
      addressTitle: 'Ev Adresi',
      shippingAddress: 'İstanbul, Türkiye (Otomatik Adres)'
    }).subscribe({
      next: () => {
        this.isCheckingOut = false;
        this.basketService.loadBasket(); // Sepeti sıfırla (backend temizlediği için)
        this.closeCart();
        this.router.navigate(['/profile'], { queryParams: { tab: 'orders' } }); // Siparişlerim kısmına yönlendir
      },
      error: (err) => {
        this.isCheckingOut = false;
        alert('Sipariş oluşturulurken bir hata oluştu: ' + (err.error?.message || 'Bilinmeyen hata'));
      }
    });
  }

  clearCart() {
    if (confirm('Sepetinizdeki tüm ürünleri silmek istediğinize emin misiniz?')) {
      this.basketService.clearBasket().subscribe();
    }
  }
}
