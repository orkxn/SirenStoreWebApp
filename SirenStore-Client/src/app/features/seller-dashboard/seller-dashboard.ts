import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../core/services/product.service';
import { OrderService } from '../../core/services/order.service';
import { CategoryService } from '../../core/services/category.service';
import { Product } from '../../core/models/product.model';
import { Order, OrderItem } from '../../core/models/order.model';
import { Category } from '../../core/models/category.model';

@Component({
  selector: 'app-seller-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './seller-dashboard.html',
  styleUrl: './seller-dashboard.scss'
})
export class SellerDashboardComponent implements OnInit {
  activeTab: 'products' | 'orders' = 'products';
  
  productService = inject(ProductService);
  orderService = inject(OrderService);
  categoryService = inject(CategoryService);

  products: Product[] = [];
  orders: Order[] = [];
  categories: Category[] = [];

  // Modal State
  isModalOpen = false;
  modalMode: 'add' | 'edit' = 'add';
  currentProduct: Partial<Product> = {
    name: '',
    description: '',
    price: 0,
    stock: 0,
    categoryId: 0,
    mainImageUrl: ''
  };

  orderStatuses = [
    { value: 0, label: 'Alındı (Received)' },
    { value: 1, label: 'Hazırlanıyor (Preparing)' },
    { value: 2, label: 'Kargoda (Shipped)' },
    { value: 3, label: 'Teslim Edildi (Delivered)' },
    { value: 4, label: 'İptal Edildi (Cancelled)' }
  ];

  ngOnInit(): void {
    this.loadProducts();
    this.loadCategories();
    this.loadOrders();
  }

  loadProducts() {
    this.productService.getMyProducts().subscribe({
      next: (res) => this.products = res,
      error: (err) => console.error('Ürünler yüklenemedi', err)
    });
  }

  loadOrders() {
    this.orderService.getSellerOrders().subscribe({
      next: (res) => this.orders = res,
      error: (err) => console.error('Siparişler yüklenemedi', err)
    });
  }

  loadCategories() {
    this.categoryService.getCategories().subscribe({
      next: (res) => this.categories = res,
      error: (err) => console.error('Kategoriler yüklenemedi', err)
    });
  }

  // --- Ürün İşlemleri ---
  openAddModal() {
    this.modalMode = 'add';
    this.currentProduct = { name: '', description: '', price: 0, stock: 0, categoryId: this.categories[0]?.id || 0, mainImageUrl: '' };
    this.isModalOpen = true;
  }

  openEditModal(product: Product) {
    this.modalMode = 'edit';
    this.currentProduct = { ...product };
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  saveProduct() {
    if (this.modalMode === 'add') {
      this.productService.createProduct(this.currentProduct).subscribe({
        next: () => {
          this.loadProducts();
          this.closeModal();
        },
        error: (err) => alert('Ürün eklenirken hata: ' + (err.error?.message || 'Hata'))
      });
    } else {
      this.productService.updateProduct(this.currentProduct).subscribe({
        next: () => {
          this.loadProducts();
          this.closeModal();
        },
        error: (err) => alert('Ürün güncellenirken hata: ' + (err.error?.message || 'Hata'))
      });
    }
  }

  deleteProduct(id: number) {
    if (confirm('Bu ürünü silmek istediğinize emin misiniz?')) {
      this.productService.deleteProduct(id).subscribe({
        next: () => this.loadProducts(),
        error: (err) => alert('Ürün silinirken hata oluştu.')
      });
    }
  }

  // --- Sipariş İşlemleri ---
  updateOrderStatus(orderItem: OrderItem, event: Event) {
    const target = event.target as HTMLSelectElement;
    const newStatus = parseInt(target.value, 10);

    if (orderItem.id) {
      this.orderService.updateOrderItemStatus(orderItem.id, newStatus).subscribe({
        next: (res) => alert(res.message || 'Durum başarıyla güncellendi.'),
        error: (err) => {
          alert('Durum güncellenirken hata oluştu.');
          this.loadOrders(); // Revert back
        }
      });
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'Received': return 'Alındı';
      case 'Preparing': return 'Hazırlanıyor';
      case 'Shipped': return 'Kargoda';
      case 'Delivered': return 'Teslim Edildi';
      case 'Cancelled': return 'İptal Edildi';
      default: return status;
    }
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Received': return 'bg-blue-100 text-blue-800';
      case 'Preparing': return 'bg-yellow-100 text-yellow-800';
      case 'Shipped': return 'bg-indigo-100 text-indigo-800';
      case 'Delivered': return 'bg-green-100 text-green-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  getStatusValue(statusString: string): number {
    switch (statusString) {
      case 'Received': return 0;
      case 'Preparing': return 1;
      case 'Shipped': return 2;
      case 'Delivered': return 3;
      case 'Cancelled': return 4;
      default: return 0;
    }
  }
}
