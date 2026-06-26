import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Eğer kullanıcı giriş yapmışsa sayfaya girmesine izin ver
  if (authService.isAuthenticated()) {
    return true;
  }

  // Giriş yapmamışsa kullanıcıyı login sayfasına yönlendir
  router.navigate(['/auth/login']);
  return false;
};