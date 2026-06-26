import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BasketService } from '../../../core/services/basket.service';
import { OffcanvasService } from '../../../core/services/offcanvas.service';

@Component({
  selector: 'app-cart-offcanvas',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './cart-offcanvas.html',
})
export class CartOffcanvasComponent {
  basketService = inject(BasketService);
  offcanvasService = inject(OffcanvasService);

  basketCount = this.basketService.basketCount;
  basketTotal = this.basketService.basketTotal;
  basket = this.basketService.basket;

  isOpen = this.offcanvasService.isCartOpen;

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
    this.closeCart();
    // Router navigation to checkout page (to be implemented later)
  }
}
