import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { firstValueFrom, filter, take } from 'rxjs';

export const roleGuard: CanActivateFn = async (route: ActivatedRouteSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const requiredRole = route.data['role'] as string;

  if (authService.isLoading) {
    await firstValueFrom(authService.isLoading$.pipe(filter(loading => !loading), take(1)));
  }

  if (authService.user?.role === (route.data['role'] as string)) return true;
  router.navigate([authService.isAuthenticated ? '/' : '/login']);
  return false;
};
