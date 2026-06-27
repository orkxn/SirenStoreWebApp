import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth';
import { UserTypes } from '../models/user.model';

export const sellerGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  const user = authService.getCurrentUser();
  if (user && user.userType === UserTypes.Seller) {
    return true;
  }
  
  router.navigate(['/']);
  return false;
};
