import { Injectable, computed, signal } from '@angular/core';
import { Product } from '../models/product.model';

export interface CartItem {
  product: Product;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems = signal<CartItem[]>(this.loadCartFromStorage());

  // Derived state
  cartCount = computed(() => this.cartItems().reduce((acc, item) => acc + item.quantity, 0));
  cartTotal = computed(() => this.cartItems().reduce((acc, item) => acc + (item.product.price * item.quantity), 0));
  items = computed(() => this.cartItems());

  constructor() { }

  private loadCartFromStorage(): CartItem[] {
    try {
      const stored = localStorage.getItem('sirenstore_cart');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  private saveCartToStorage(items: CartItem[]) {
    localStorage.setItem('sirenstore_cart', JSON.stringify(items));
    this.cartItems.set(items);
  }

  addToCart(product: Product, quantity: number = 1) {
    const currentItems = [...this.cartItems()];
    const existingItemIndex = currentItems.findIndex(item => item.product.id === product.id);

    if (existingItemIndex > -1) {
      currentItems[existingItemIndex].quantity += quantity;
    } else {
      currentItems.push({ product, quantity });
    }

    this.saveCartToStorage(currentItems);
  }

  removeFromCart(productId: number) {
    const currentItems = this.cartItems().filter(item => item.product.id !== productId);
    this.saveCartToStorage(currentItems);
  }

  updateQuantity(productId: number, quantity: number) {
    if (quantity <= 0) {
      this.removeFromCart(productId);
      return;
    }
    
    const currentItems = [...this.cartItems()];
    const itemIndex = currentItems.findIndex(item => item.product.id === productId);
    
    if (itemIndex > -1) {
      currentItems[itemIndex].quantity = quantity;
      this.saveCartToStorage(currentItems);
    }
  }

  clearCart() {
    this.saveCartToStorage([]);
  }
}
