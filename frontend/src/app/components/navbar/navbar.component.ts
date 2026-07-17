import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import { ThemeToggleComponent } from '../theme-toggle/theme-toggle.component';
import { LucideShoppingCart, LucideHeart, LucideLayoutGrid, LucideStore, LucideUser, LucideLogOut, LucideLogIn } from '@lucide/angular';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule, 
    RouterLink, 
    ThemeToggleComponent, 
    LucideShoppingCart, 
    LucideHeart, 
    LucideLayoutGrid, 
    LucideStore, 
    LucideUser, 
    LucideLogOut, 
    LucideLogIn
  ],
  host: {
    'class': 'sticky top-0 z-50 w-full block'
  },
  template: `
    <nav class="w-full glass-surface bg-white/70 dark:bg-zinc-950/70 border-b border-zinc-950/5 dark:border-white/10 transition-all duration-300">
      <div class="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <!-- Logo -->
        <a routerLink="/" class="flex items-center gap-2 select-none">
          <span class="text-2xl font-bold tracking-tighter text-zinc-950 dark:text-white">SIREN</span>
          <span class="text-2xl font-bold tracking-tighter uppercase px-3 py-0.5 bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 rounded-full">STORE</span>
        </a>

        <!-- Center Navigation Links -->
        <div class="hidden md:flex items-center gap-8">
          <a routerLink="/products" class="text-sm font-medium text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white transition-colors">Ürünler</a>
          <a *ngIf="authService.user?.role === 'Admin'" routerLink="/admin" class="text-sm font-medium flex items-center gap-1.5 text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white transition-colors">
            <svg lucideLayoutGrid class="w-4 h-4"></svg>
            Admin Paneli
          </a>
          <a *ngIf="authService.user?.role === 'Seller'" routerLink="/seller" class="text-sm font-medium flex items-center gap-1.5 text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white transition-colors">
            <svg lucideStore class="w-4 h-4"></svg>
            Satıcı Paneli
          </a>
        </div>

        <!-- Right Actions -->
        <div class="flex items-center gap-4">
          <app-theme-toggle></app-theme-toggle>

          <!-- Basket Icon -->
          <a routerLink="/cart" class="relative p-2 rounded-full border border-zinc-950/10 dark:border-white/10 bg-zinc-950/[0.02] dark:bg-white/5 hover:bg-zinc-950/5 dark:hover:bg-white/10 transition-all w-10 h-10 flex items-center justify-center" aria-label="Sepetim">
            <svg lucideShoppingCart class="w-5 h-5 text-zinc-900 dark:text-zinc-100"></svg>
            <span *ngIf="cartCount > 0" class="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-zinc-950 dark:bg-white text-[10px] font-bold text-white dark:text-zinc-950 shadow-sm">{{ cartCount }}</span>
          </a>

          <!-- Favorites Icon -->
          <a *ngIf="authService.user" routerLink="/favorites" class="relative p-2 rounded-full border border-zinc-950/10 dark:border-white/10 bg-zinc-950/[0.02] dark:bg-white/5 hover:bg-zinc-950/5 dark:hover:bg-white/10 transition-all w-10 h-10 flex items-center justify-center" aria-label="Favorilerim">
            <svg lucideHeart class="w-5 h-5 text-zinc-900 dark:text-zinc-100"></svg>
          </a>

          <!-- User Account Controls -->
          <ng-container *ngIf="authService.user; else loginButton">
            <div class="relative">
              <button
                (click)="dropdownOpen = !dropdownOpen"
                class="flex items-center gap-2 p-1.5 rounded-full border border-zinc-950/10 dark:border-white/10 bg-zinc-950/[0.02] dark:bg-white/5 hover:bg-zinc-950/5 dark:hover:bg-white/10 transition-all"
              >
                <div class="w-7 h-7 rounded-full bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 flex items-center justify-center font-bold text-xs select-none">
                  {{ authService.user.firstName[0].toUpperCase() }}{{ authService.user.lastName[0].toUpperCase() }}
                </div>
              </button>

              <ng-container *ngIf="dropdownOpen">
                <div class="fixed inset-0 z-40" (click)="dropdownOpen = false"></div>
                <div class="absolute right-0 mt-2 w-52 z-50 glass-surface bg-white/95 dark:bg-zinc-900/95 border border-zinc-950/10 dark:border-white/15 rounded-2xl shadow-xl p-2 text-left">
                  <div class="px-3 py-2.5 border-b border-zinc-950/5 dark:border-white/5 mb-1.5">
                     <p class="text-xs text-zinc-400 dark:text-zinc-500 font-medium">Giriş yapıldı</p>
                     <p class="text-sm font-bold text-zinc-800 dark:text-zinc-200 truncate">{{ authService.user.firstName }} {{ authService.user.lastName }}</p>
                  </div>
                  <a routerLink="/account" (click)="dropdownOpen = false" class="flex items-center gap-2 w-full px-3 py-2 text-sm rounded-lg hover:bg-zinc-950/5 dark:hover:bg-white/5 text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white transition-all">
                    <svg lucideUser class="w-4 h-4"></svg>
                    Profilim / Hesabım
                  </a>
                  <a routerLink="/orders" (click)="dropdownOpen = false" class="flex items-center gap-2 w-full px-3 py-2 text-sm rounded-lg hover:bg-zinc-950/5 dark:hover:bg-white/5 text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white transition-all">
                    <svg lucideShoppingCart class="w-4 h-4"></svg>
                    Siparişlerim
                  </a>
                  <a routerLink="/favorites" (click)="dropdownOpen = false" class="flex items-center gap-2 w-full px-3 py-2 text-sm rounded-lg hover:bg-zinc-950/5 dark:hover:bg-white/5 text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white transition-all">
                    <svg lucideHeart class="w-4 h-4"></svg>
                    Favorilerim
                  </a>
                  <a *ngIf="authService.user.role === 'Admin'" routerLink="/admin" (click)="dropdownOpen = false" class="flex md:hidden items-center gap-2 w-full px-3 py-2 text-sm rounded-lg hover:bg-zinc-950/5 dark:hover:bg-white/5 text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white transition-all">
                    <svg lucideLayoutGrid class="w-4 h-4"></svg>
                    Admin Paneli
                  </a>
                  <a *ngIf="authService.user.role === 'Seller'" routerLink="/seller" (click)="dropdownOpen = false" class="flex md:hidden items-center gap-2 w-full px-3 py-2 text-sm rounded-lg hover:bg-zinc-950/5 dark:hover:bg-white/5 text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white transition-all">
                    <svg lucideStore class="w-4 h-4"></svg>
                    Satıcı Paneli
                  </a>
                  <button (click)="handleLogout()" class="flex items-center gap-2 w-full px-3 py-2 text-sm rounded-lg hover:bg-red-50 dark:hover:bg-red-950/20 text-red-600 hover:text-red-700 transition-all border-t border-zinc-950/5 dark:border-white/5 mt-1.5 pt-2">
                    <svg lucideLogOut class="w-4 h-4"></svg>
                    Çıkış Yap
                  </button>
                </div>
              </ng-container>
            </div>
          </ng-container>

          <ng-template #loginButton>
            <a routerLink="/login" class="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-full bg-zinc-950 text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-100 transition-all duration-300 shadow-sm">
              <svg lucideLogIn class="w-4 h-4"></svg>
              Giriş Yap
            </a>
          </ng-template>
        </div>
      </div>
    </nav>
  `
})
export class NavbarComponent {
  dropdownOpen = false;

  constructor(
    public authService: AuthService,
    private cartService: CartService
  ) {}

  get cartCount(): number {
    const cart = this.cartService.cart;
    return cart?.items.reduce((sum, item) => sum + item.quantity, 0) || 0;
  }

  handleLogout() {
    this.authService.logout();
    this.dropdownOpen = false;
    window.location.href = '/login';
  }
}
