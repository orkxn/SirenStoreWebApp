import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const requiredRole = route.data['role'] as string;

  if (authService.isLoading) {
    return new Promise<boolean>(resolve => {
      const check = setInterval(() => {
        if (!authService.isLoading) {
          clearInterval(check);
          if (!authService.isAuthenticated) {
            router.navigate(['/login']);
            resolve(false);
          } else if (authService.user?.role === requiredRole) {
            resolve(true);
          } else {
            router.navigate(['/']);
            resolve(false);
          }
        }
      }, 50);
    });
  }

  if (!authService.isAuthenticated) {
    router.navigate(['/login']);
    return false;
  }
  if (authService.user?.role === requiredRole) return true;
  router.navigate(['/']);
  return false;
};
