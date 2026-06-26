import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartService } from '../../../core/services/cart.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './cart.component.html',
})
export class CartComponent {
  cartService = inject(CartService);
  
  cartItems = this.cartService.items;
  cartTotal = this.cartService.cartTotal;
  cartCount = this.cartService.cartCount;

  shippingCost = computed(() => this.cartTotal() > 500 ? 0 : 49.99);
  finalTotal = computed(() => this.cartTotal() + this.shippingCost());

  constructor() {}

  increaseQuantity(productId: number, currentQuantity: number) {
    this.cartService.updateQuantity(productId, currentQuantity + 1);
  }

  decreaseQuantity(productId: number, currentQuantity: number) {
    this.cartService.updateQuantity(productId, currentQuantity - 1);
  }

  removeItem(productId: number) {
    this.cartService.removeFromCart(productId);
  }

  clearCart() {
    if (confirm('Sepetinizdeki tüm ürünleri silmek istediğinize emin misiniz?')) {
      this.cartService.clearCart();
    }
  }

  checkout() {
    alert('Sipariş işlemleri henüz yapım aşamasındadır.');
  }
}
