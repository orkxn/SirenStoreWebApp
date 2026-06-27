import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { sellerGuard } from './core/guards/seller.guard';
import { roleGuard } from './core/guards/role.guard';
import { UserTypes } from './core/models/user.model';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./shared/components/layout/layout').then(m => m.LayoutComponent),
        children: [
            { 
                path: '', 
                loadComponent: () => import('./features/products/product-list/product-list').then(m => m.ProductListComponent)
            },
            {
                path: 'products',
                loadComponent: () => import('./features/products/product-list/product-list').then(m => m.ProductListComponent)
            },
            {
                path: 'products/:id',
                loadComponent: () => import('./features/products/product-detail/product-detail.component').then(m => m.ProductDetailComponent)
            },
            {
                path: 'seller/:id',
                loadComponent: () => import('./features/seller-detail/seller-detail').then(m => m.SellerDetailComponent)
            },
            {
                path: 'seller-dashboard',
                loadComponent: () => import('./features/seller-dashboard/seller-dashboard').then(m => m.SellerDashboardComponent),
                canActivate: [sellerGuard]
            },
            {
                path: 'admin-dashboard',
                loadComponent: () => import('./features/admin/admin-dashboard/admin-dashboard').then(m => m.AdminDashboardComponent),
                canActivate: [roleGuard],
                data: { roles: [UserTypes.Admin] }
            },
            {
                path: 'profile',
                loadComponent: () => import('./features/profile/profile.component').then(m => m.ProfileComponent),
                canActivate: [authGuard]
            }
        ]
    },
    {
        path: 'auth/login',
        loadComponent: () => import('./features/auth/login/login').then(m => m.LoginComponent)
    },
    {
        path: 'auth/register',
        loadComponent: () => import('./features/auth/register/register').then(m => m.RegisterComponent)
    }
];