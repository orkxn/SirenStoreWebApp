import { Component, Input, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth';
import { BasketService } from '../../../core/services/basket.service';
import { OffcanvasService } from '../../../core/services/offcanvas.service';
import { UserTypes } from '../../../core/models/user.model';
import { CategoryService } from '../../../core/services/category.service';
import { Category } from '../../../core/models/category.model';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class NavbarComponent implements OnInit {
  UserTypes = UserTypes; // for template access
  @Input() hideCart: boolean = false;
  @Input() hideLogin: boolean = false;
  @Input() hideRegister: boolean = false;

  authService = inject(AuthService);
  basketService = inject(BasketService);
  offcanvasService = inject(OffcanvasService);
  router = inject(Router);
  categoryService = inject(CategoryService);

  categories: Category[] = [];

  constructor() {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (data) => this.categories = data,
      error: (err) => console.error('Navbar kategorileri yüklenemedi', err)
    });
  }

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
