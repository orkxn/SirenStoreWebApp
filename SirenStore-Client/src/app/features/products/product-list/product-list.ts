import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';
import { CategoryService } from '../../../core/services/category.service';
import { Product } from '../../../core/models/product.model';
import { Category } from '../../../core/models/category.model';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './product-list.html',
  styleUrl: './product-list.scss',
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  categories: Category[] = [];
  
  isLoading = true;
  errorMessage: string | null = null;
  
  currentSort = 'newest';
  selectedCategoryId: number | null = null;

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this.loadCategories();
    this.loadProducts();
  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (data) => this.categories = data,
      error: (err) => console.error('Kategoriler yüklenemedi', err)
    });
  }

  loadProducts(): void {
    this.isLoading = true;
    this.productService.getProducts().subscribe({
      next: (data) => {
        this.products = data;
        this.applyFilters();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Ürünler yüklenirken hata oluştu', err);
        this.errorMessage = 'Ürünler yüklenemedi. Lütfen daha sonra tekrar deneyin.';
        this.isLoading = false;
      }
    });
  }

  onCategorySelect(categoryId: number | null): void {
    this.selectedCategoryId = categoryId;
    this.applyFilters();
  }

  onSort(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.currentSort = value;
    this.applyFilters();
  }

  applyFilters(): void {
    // 1. Kategoriye göre filtrele
    let temp = [...this.products];
    if (this.selectedCategoryId !== null) {
      temp = temp.filter(p => p.categoryId === this.selectedCategoryId);
    }

    // 2. Sırala
    if (this.currentSort === 'priceAsc') {
      temp.sort((a, b) => a.price - b.price);
    } else if (this.currentSort === 'priceDesc') {
      temp.sort((a, b) => b.price - a.price);
    } else {
      temp.sort((a, b) => b.id - a.id);
    }
    
    this.filteredProducts = temp;
  }
}
