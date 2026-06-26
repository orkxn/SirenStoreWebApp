import { Routes } from '@angular/router';

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