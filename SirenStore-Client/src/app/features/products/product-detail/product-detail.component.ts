import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';
import { Product } from '../../../core/models/product.model';
import { BasketService } from '../../../core/services/basket.service';
import { OffcanvasService } from '../../../core/services/offcanvas.service';
import { AuthService } from '../../../core/services/auth';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './product-detail.component.html',
})
export class ProductDetailComponent implements OnInit {
  product: Product | null = null;
  isLoading = true;
  errorMessage = '';
  quantity = 1;
  isAddingToCart = false;
  showToast = false;

  route = inject(ActivatedRoute);
  router = inject(Router);
  productService = inject(ProductService);
  basketService = inject(BasketService);
  offcanvasService = inject(OffcanvasService);
  authService = inject(AuthService);

  constructor() {}

  ngOnInit() {
    const productId = this.route.snapshot.paramMap.get('id');
    if (productId) {
      this.loadProduct(Number(productId));
    } else {
      this.errorMessage = 'Ürün bulunamadı.';
      this.isLoading = false;
    }
  }

  loadProduct(id: number) {
    this.isLoading = true;
    this.productService.getProductById(id).subscribe({
      next: (data) => {
        this.product = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching product:', err);
        this.errorMessage = 'Ürün bilgileri yüklenirken bir hata oluştu.';
        this.isLoading = false;
      }
    });
  }

  increaseQuantity() {
    this.quantity++;
  }

  decreaseQuantity() {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  addToCart() {
    if (!this.product) return;

    if (!this.authService.isAuthenticated()) {
      // Eğer giriş yapmamışsa
      this.router.navigate(['/auth/login'], { queryParams: { returnUrl: `/products/${this.product.id}` } });
      return;
    }

    this.isAddingToCart = true;
    
    this.basketService.addToBasket({
      productId: this.product.id,
      quantity: this.quantity
    }).subscribe({
      next: () => {
        this.isAddingToCart = false;
        this.showToast = true;
        setTimeout(() => {
          this.showToast = false;
        }, 3000);
      },
      error: (err) => {
        console.error('Sepete eklenemedi', err);
        this.isAddingToCart = false;
      }
    });
  }
}
