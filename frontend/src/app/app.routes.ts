import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { roleGuard } from './guards/role.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent),
    title: 'SIRENSTORE | Trend Alışverişin Adresi'
  },
  {
    path: 'products',
    loadComponent: () => import('./pages/products/products.component').then(m => m.ProductsComponent),
    title: 'Ürünler | SIRENSTORE'
  },
  {
    path: 'product/:id',
    loadComponent: () => import('./pages/product-detail/product-detail.component').then(m => m.ProductDetailComponent),
    title: 'Ürün Detayı | SIRENSTORE'
  },
  {
    path: 'store/:id',
    loadComponent: () => import('./pages/store-detail/store-detail.component').then(m => m.StoreDetailComponent),
    title: 'Mağaza | SIRENSTORE'
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/auth/login/login.component').then(m => m.LoginComponent),
    title: 'Giriş Yap | SIRENSTORE'
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/auth/register/register.component').then(m => m.RegisterComponent),
    title: 'Kayıt Ol | SIRENSTORE'
  },
  {
    path: 'forgot-password',
    loadComponent: () => import('./pages/auth/forgot-password/forgot-password.component').then(m => m.ForgotPasswordComponent),
    title: 'Şifremi Unuttum | SIRENSTORE'
  },
  {
    path: 'reset-password',
    loadComponent: () => import('./pages/auth/reset-password/reset-password.component').then(m => m.ResetPasswordComponent),
    title: 'Şifre Sıfırla | SIRENSTORE'
  },
  {
    path: 'cart',
    loadComponent: () => import('./pages/cart/cart.component').then(m => m.CartComponent),
    title: 'Sepetim | SIRENSTORE'
  },
  {
    path: 'checkout',
    loadComponent: () => import('./pages/checkout/checkout.component').then(m => m.CheckoutComponent),
    canActivate: [authGuard],
    title: 'Ödeme | SIRENSTORE'
  },
  {
    path: 'favorites',
    loadComponent: () => import('./pages/favorites/favorites.component').then(m => m.FavoritesComponent),
    canActivate: [authGuard],
    title: 'Favorilerim | SIRENSTORE'
  },
  {
    path: 'orders',
    loadComponent: () => import('./pages/orders/orders.component').then(m => m.OrdersComponent),
    canActivate: [authGuard],
    title: 'Siparişlerim | SIRENSTORE'
  },
  {
    path: 'account',
    loadComponent: () => import('./pages/account/account.component').then(m => m.AccountComponent),
    canActivate: [authGuard],
    title: 'Hesabım | SIRENSTORE'
  },
  {
    path: 'seller',
    loadComponent: () => import('./pages/seller-panel/seller-panel.component').then(m => m.SellerPanelComponent),
    canActivate: [roleGuard],
    data: { role: 'Seller' },
    title: 'Satıcı Paneli | SIRENSTORE'
  },
  {
    path: 'admin',
    loadComponent: () => import('./pages/admin-panel/admin-panel.component').then(m => m.AdminPanelComponent),
    canActivate: [roleGuard],
    data: { role: 'Admin' },
    title: 'Yönetim Paneli | SIRENSTORE'
  },
  {
    path: 'about',
    loadComponent: () => import('./pages/about/about.component').then(m => m.AboutComponent),
    title: 'Hakkımızda | SIRENSTORE'
  },
  {
    path: 'terms',
    loadComponent: () => import('./pages/terms/terms.component').then(m => m.TermsComponent),
    title: 'Kullanım Koşulları | SIRENSTORE'
  },
  {
    path: 'privacy',
    loadComponent: () => import('./pages/privacy/privacy.component').then(m => m.PrivacyComponent),
    title: 'Gizlilik Politikası | SIRENSTORE'
  },
  {
    path: 'become-seller',
    loadComponent: () => import('./pages/become-seller/become-seller.component').then(m => m.BecomeSellerComponent),
    title: 'Satıcı Ol | SIRENSTORE'
  },
  {
    path: 'not-found',
    loadComponent: () => import('./pages/not-found/not-found.component').then(m => m.NotFoundComponent),
    title: 'Sayfa Bulunamadı | SIRENSTORE'
  },
  {
    path: '**',
    redirectTo: 'not-found'
  }
];
