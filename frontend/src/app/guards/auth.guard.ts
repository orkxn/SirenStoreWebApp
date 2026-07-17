import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { firstValueFrom, filter, take } from 'rxjs';

export const authGuard: CanActivateFn = async () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoading) {
    await firstValueFrom(authService.isLoading$.pipe(filter(loading => !loading), take(1)));
  }

  if (authService.isAuthenticated) return true;
  router.navigate(['/login']);
  return false;
};
