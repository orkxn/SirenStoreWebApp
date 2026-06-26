import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth';
import { BasketService } from '../../../core/services/basket.service';
import { OffcanvasService } from '../../../core/services/offcanvas.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class NavbarComponent {
  @Input() hideCart: boolean = false;
  @Input() hideLogin: boolean = false;
  @Input() hideRegister: boolean = false;

  authService = inject(AuthService);
  basketService = inject(BasketService);
  offcanvasService = inject(OffcanvasService);
  router = inject(Router);

  constructor() {}

  handleCartClick() {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/auth/login']);
    } else {
      this.offcanvasService.openCart();
    }
  }

  logout() {
    this.authService.logout();
    this.basketService.resetBasket();
    this.router.navigate(['/']);
  }
}
