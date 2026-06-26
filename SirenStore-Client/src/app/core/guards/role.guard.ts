import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth';
import { UserTypes } from '../models/user.model';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const currentUser = authService.getCurrentUser();
  
  // Rota tanımından beklenen rolleri alıyoruz (örn: [UserTypes.Admin])
  const expectedRoles = route.data['roles'] as Array<UserTypes>;

  // Kullanıcı giriş yapmışsa ve rolü bu sayfa için izin verilen rollerden biriyse geçişe izin ver
  if (authService.isAuthenticated() && currentUser && expectedRoles.includes(currentUser.userType)) {
    return true;
  }

  // Yetkisi yoksa ana sayfaya veya "Yetkisiz Erişim" sayfasına postala
  router.navigate(['/']);
  return false;
};