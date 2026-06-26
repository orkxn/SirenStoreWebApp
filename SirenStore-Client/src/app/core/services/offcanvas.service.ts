import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class OffcanvasService {
  isCartOpen = signal(false);

  openCart() {
    this.isCartOpen.set(true);
  }

  closeCart() {
    this.isCartOpen.set(false);
  }

  toggleCart() {
    this.isCartOpen.set(!this.isCartOpen());
  }
}
