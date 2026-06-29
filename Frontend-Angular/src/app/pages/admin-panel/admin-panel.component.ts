import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SellerManagementDto, UserManagementDto, CategoryDto, SellerStatus, UserTypes } from '../../models/api.types';
import { AdminService } from '../../services/admin.service';
import { SellerService } from '../../services/seller.service';
import { CategoryService } from '../../services/category.service';
import { ToastService } from '../../services/toast.service';
import { InputComponent } from '../../components/input/input.component';
import { ButtonComponent } from '../../components/button/button.component';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    InputComponent,
    ButtonComponent
  ],
  template: `
    <div class="max-w-6xl mx-auto px-6 py-10 space-y-8 text-left">
      
      <!-- Header -->
      <div class="border-b border-zinc-950/5 dark:border-white/5 pb-6">
        <h1 class="text-4xl font-extrabold tracking-tight text-zinc-950 dark:text-white uppercase leading-none">Yönetici Paneli</h1>
        <p class="text-sm text-zinc-500 dark:text-zinc-400 mt-1.5">Sistem kullanıcılarını denetleyin, satıcı dükkan başvurularını onaylayın ve kategorileri yönetin.</p>
      </div>

      <!-- Tabs -->
      <div class="flex border-b border-zinc-950/5 dark:border-white/10 gap-2 overflow-x-auto pb-px">
        <button
          (click)="setActiveTab('users')"
          [class]="'flex items-center gap-2 px-6 py-3 font-semibold text-sm transition-all border-b-2 ' + 
            (activeTab === 'users'
              ? 'border-zinc-950 dark:border-white text-zinc-950 dark:text-white'
              : 'border-transparent text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300')"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> Kullanıcılar ({{ users.length }})
        </button>

        <button
          (click)="setActiveTab('sellers')"
          [class]="'flex items-center gap-2 px-6 py-3 font-semibold text-sm transition-all border-b-2 ' + 
            (activeTab === 'sellers'
              ? 'border-zinc-950 dark:border-white text-zinc-950 dark:text-white'
              : 'border-transparent text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300')"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4"><path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"/><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"/><path d="M2 7h20"/></svg> Satıcı Başvuruları ({{ sellers.length }})
        </button>

        <button
          (click)="setActiveTab('categories')"
          [class]="'flex items-center gap-2 px-6 py-3 font-semibold text-sm transition-all border-b-2 ' + 
            (activeTab === 'categories'
              ? 'border-zinc-950 dark:border-white text-zinc-950 dark:text-white'
              : 'border-transparent text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300')"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4"><path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/><path d="M12 10v6"/><path d="M9 13h6"/></svg> Kategori Yönetimi ({{ categories.length }})
        </button>
      </div>

      <div *ngIf="isLoading" class="text-center py-20">
        <div class="animate-spin inline-block w-8 h-8 border-2 border-zinc-950 border-t-transparent dark:border-white rounded-full"></div>
      </div>

      <main *ngIf="!isLoading" class="glass-surface bg-zinc-950/[0.01] dark:bg-white/5 border border-zinc-950/5 dark:border-white/10 rounded-3xl p-6 sm:p-8">
        
        <!-- Tab 1: User Management -->
        <div *ngIf="activeTab === 'users'" class="space-y-6">
          <div class="overflow-x-auto">
            <table class="w-full text-sm text-left border-collapse">
              <thead>
                <tr class="border-b border-zinc-950/5 dark:border-white/5 text-zinc-400 dark:text-zinc-500 text-[10px] uppercase font-bold tracking-wider">
                  <th class="pb-3 pr-4">Ad Soyad</th>
                  <th class="pb-3 px-4">E-posta</th>
                  <th class="pb-3 px-4">Yetki Rolü</th>
                  <th class="pb-3 px-4">Durum</th>
                  <th class="pb-3 pl-4 text-right">İşlemler</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-zinc-950/5 dark:divide-white/5">
                <tr *ngFor="let u of users" [class.opacity-60]="u.isDeleted" class="hover:bg-zinc-950/[0.01] dark:hover:bg-white/[0.01] transition-all">
                  <td class="py-4 pr-4 font-bold text-zinc-900 dark:text-white">
                    {{ u.firstName }} {{ u.lastName }}
                  </td>
                  <td class="py-4 px-4 text-zinc-500">{{ u.email }}</td>
                  <td class="py-4 px-4">
                    <span [class]="getUserTypeBadgeClass(u.userType)">
                      {{ getUserTypeBadgeLabel(u.userType) }}
                    </span>
                  </td>
                  <td class="py-4 px-4 font-semibold">
                    <span *ngIf="u.isDeleted; else activeUser" class="text-red-500 text-xs">Banlı</span>
                    <ng-template #activeUser>
                      <span class="text-emerald-600 text-xs">Aktif</span>
                    </ng-template>
                  </td>
                  <td class="py-4 pl-4 text-right">
                    <div *ngIf="u.userType !== 2 && u.userType !== 3">
                      <button
                        *ngIf="u.isDeleted"
                        (click)="handleUnbanUser(u.id)"
                        class="text-xs font-bold text-zinc-900 dark:text-white underline cursor-pointer hover:opacity-80"
                      >
                        Banı Kaldır
                      </button>
                      <button
                        *ngIf="!u.isDeleted"
                        (click)="handleBanUser(u.id)"
                        class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-red-200 dark:border-red-950/30 text-red-600 font-semibold text-xs hover:bg-red-50 dark:hover:bg-red-950/20 transition-all cursor-pointer"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-3.5 h-3.5"><circle cx="12" cy="12" r="10"/><path d="m4.9 4.9 14.2 14.2"/></svg> Kullanıcıyı Banla
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Tab 2: Seller applications -->
        <div *ngIf="activeTab === 'sellers'" class="space-y-6">
          <div *ngIf="sellers.length === 0" class="text-center py-12 text-zinc-500">Kayıtlı satıcı veya başvuru bulunmamaktadır.</div>
          
          <div *ngIf="sellers.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div
              *ngFor="let sel of sellers"
              class="border border-zinc-950/5 dark:border-white/10 rounded-2xl p-5 bg-zinc-950/[0.01] dark:bg-white/[0.01] text-xs space-y-4"
            >
              <div class="flex justify-between items-center border-b border-zinc-950/5 dark:border-white/5 pb-2.5">
                <h4 class="text-sm font-bold text-zinc-900 dark:text-white uppercase truncate">{{ sel.storeName }}</h4>
                <span [class]="getSellerStatusBadgeClass(sel.status)">{{ getSellerStatusBadgeLabel(sel.status) }}</span>
              </div>

              <div class="space-y-2 text-zinc-500">
                <p><strong>Sahip E-postası:</strong> {{ sel.userEmail }}</p>
                <p><strong>İletişim Tel / Mail:</strong> {{ sel.contactPhone }} / {{ sel.contactEmail }}</p>
                <p><strong>Destek Hattı:</strong> {{ sel.supportLine }}</p>
                <p><strong>Vergi Numarası & Dairesi:</strong> {{ sel.taxNumber }} ({{ sel.taxOffice }})</p>
              </div>

              <div *ngIf="sel.status === 1" class="flex gap-3 pt-2 border-t border-zinc-950/5 dark:border-white/5">
                <button
                  (click)="handleApproveSeller(sel.id)"
                  class="flex-grow flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 font-bold hover:opacity-85 transition-opacity cursor-pointer text-xs"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg> Onayla
                </button>
                <button
                  (click)="handleRejectSeller(sel.id)"
                  class="flex-grow flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-red-200 dark:border-red-950/30 text-red-600 font-bold hover:bg-red-50 dark:hover:bg-red-950/20 transition-all cursor-pointer text-xs"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg> Reddet
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Tab 3: Category Management -->
        <div *ngIf="activeTab === 'categories'" class="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <!-- Category form -->
          <div class="md:col-span-1 border-r border-zinc-950/5 dark:border-white/5 pr-0 md:pr-8 space-y-4">
            <form (ngSubmit)="onCategorySubmit()" class="space-y-4">
              <h4 class="text-sm font-bold uppercase tracking-wider text-zinc-900 dark:text-white">
                {{ editCategory ? 'Kategoriyi Düzenle' : 'Yeni Kategori Ekle' }}
              </h4>

              <app-input
                label="Kategori Adı"
                placeholder="Örn: Ev Dekorasyon"
                [(ngModel)]="categoryName"
                name="categoryName"
                [error]="categoryError"
              ></app-input>

              <div class="flex gap-2">
                <app-button type="submit" variant="primary" [disabled]="isSubmitLoading" className="w-full">
                  {{ isSubmitLoading ? 'Kaydediliyor...' : (editCategory ? 'Güncelle' : 'Ekle') }}
                </app-button>
                <app-button
                  *ngIf="editCategory"
                  type="button"
                  variant="glass"
                  (click)="handleCancelCategoryEdit()"
                >
                  İptal
                </app-button>
              </div>
            </form>
          </div>

          <!-- Categories list -->
          <div class="md:col-span-2 space-y-4">
            <h4 class="text-sm font-bold uppercase tracking-wider text-zinc-900 dark:text-white">Kayıtlı Kategoriler</h4>
            
            <div class="divide-y divide-zinc-950/5 dark:divide-white/5 max-h-96 overflow-y-auto pr-1">
              <div *ngFor="let cat of categories" class="flex justify-between items-center py-3 first:pt-0 last:pb-0">
                <span class="font-semibold text-zinc-800 dark:text-zinc-200 text-sm">{{ cat.name }}</span>
                <div class="flex gap-2">
                  <button
                    (click)="handleEditCategoryClick(cat)"
                    class="p-1.5 rounded-full border border-zinc-950/5 dark:border-white/10 text-zinc-500 hover:text-zinc-950 dark:hover:text-white transition-colors cursor-pointer"
                    aria-label="Düzenle"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-3.5 h-3.5"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
                  </button>
                  <button
                    (click)="handleDeleteCategory(cat.id)"
                    class="p-1.5 rounded-full border border-zinc-950/5 dark:border-white/10 text-zinc-400 hover:text-red-500 transition-colors cursor-pointer"
                    aria-label="Sil"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-3.5 h-3.5"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>

      </main>

    </div>
  `
})
export class AdminPanelComponent implements OnInit {
  activeTab: 'users' | 'sellers' | 'categories' = 'users';
  users: UserManagementDto[] = [];
  sellers: SellerManagementDto[] = [];
  categories: CategoryDto[] = [];
  isLoading = false;
  isSubmitLoading = false;
  editCategory: CategoryDto | null = null;

  categoryName = '';
  categoryError = '';

  constructor(
    private adminService: AdminService,
    private sellerService: SellerService,
    private categoryService: CategoryService,
    private toastService: ToastService
  ) {}

  ngOnInit() {
    this.loadAdminData();
  }

  async loadAdminData() {
    this.isLoading = true;
    try {
      const [userData, sellerData, catData] = await Promise.all([
        this.adminService.getAllUsers(),
        this.adminService.getAllSellers(),
        this.categoryService.getAll()
      ]);
      this.users = userData;
      this.sellers = sellerData;
      this.categories = catData;
    } catch (err: any) {
      this.toastService.showToast(err.message || 'Yönetici verileri yüklenemedi.', 'error');
    } finally {
      this.isLoading = false;
    }
  }

  async handleBanUser(id: number) {
    if (!confirm('Bu kullanıcıyı banlamak istediğinize emin misiniz?')) return;
    try {
      await this.adminService.banUser(id);
      this.toastService.showToast('Kullanıcı başarıyla banlandı. Sisteme giriş yapamaz.', 'success');
      this.loadAdminData();
    } catch (err: any) {
      this.toastService.showToast(err.message || 'Kullanıcı banlanamadı.', 'error');
    }
  }

  async handleUnbanUser(id: number) {
    try {
      await this.adminService.unbanUser(id);
      this.toastService.showToast('Kullanıcı banı başarıyla kaldırıldı.', 'success');
      this.loadAdminData();
    } catch (err: any) {
      this.toastService.showToast(err.message || 'Ban kaldırma başarısız.', 'error');
    }
  }

  async handleApproveSeller(id: number) {
    try {
      await this.sellerService.approveSeller(id);
      this.toastService.showToast('Satıcı başvurusu onaylandı ve rolü satıcı olarak yükseltildi.', 'success');
      this.loadAdminData();
    } catch (err: any) {
      this.toastService.showToast(err.message || 'Satıcı onaylanamadı.', 'error');
    }
  }

  async handleRejectSeller(id: number) {
    try {
      await this.sellerService.rejectSeller(id);
      this.toastService.showToast('Satıcı başvurusu reddedildi.', 'success');
      this.loadAdminData();
    } catch (err: any) {
      this.toastService.showToast(err.message || 'Satıcı reddedilemedi.', 'error');
    }
  }

  handleEditCategoryClick(cat: CategoryDto) {
    this.editCategory = cat;
    this.categoryName = cat.name;
    this.categoryError = '';
  }

  handleCancelCategoryEdit() {
    this.editCategory = null;
    this.categoryName = '';
    this.categoryError = '';
  }

  async handleDeleteCategory(id: number) {
    if (!confirm('Bu kategoriyi silmek istediğinize emin misiniz? (Soft delete)')) return;
    try {
      await this.categoryService.delete(id);
      this.toastService.showToast('Kategori başarıyla silindi.', 'success');
      this.loadAdminData();
    } catch (err: any) {
      this.toastService.showToast(err.message || 'Kategori silinemedi.', 'error');
    }
  }

  async onCategorySubmit() {
    this.categoryError = '';
    if (!this.categoryName) {
      this.categoryError = 'Kategori adı zorunludur.';
      return;
    }

    this.isSubmitLoading = true;
    try {
      if (this.editCategory) {
        await this.categoryService.update(this.editCategory.id, { name: this.categoryName });
        this.toastService.showToast('Kategori başarıyla güncellendi.', 'success');
      } else {
        await this.categoryService.create({ name: this.categoryName });
        this.toastService.showToast('Kategori başarıyla eklendi.', 'success');
      }
      this.editCategory = null;
      this.categoryName = '';
      await this.loadAdminData();
    } catch (err: any) {
      this.toastService.showToast(err.message || 'İşlem gerçekleştirilemedi.', 'error');
    } finally {
      this.isSubmitLoading = false;
    }
  }

  getUserTypeBadgeLabel(type: UserTypes): string {
    switch (type) {
      case UserTypes.Admin:
      case UserTypes.SuperAdmin:
        return 'ADMIN';
      case UserTypes.Seller:
        return 'SATICI';
      case UserTypes.Customer:
      default:
        return 'MÜŞTERİ';
    }
  }

  getUserTypeBadgeClass(type: UserTypes): string {
    const base = "text-[10px] font-bold px-2 py-0.5 rounded-full ";
    switch (type) {
      case UserTypes.Admin:
      case UserTypes.SuperAdmin:
        return base + "bg-zinc-950 text-white dark:bg-white dark:text-zinc-950";
      case UserTypes.Seller:
        return base + "bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200";
      case UserTypes.Customer:
      default:
        return base + "bg-zinc-950/5 text-zinc-500";
    }
  }

  getSellerStatusBadgeLabel(status: SellerStatus): string {
    switch (status) {
      case SellerStatus.Pending: return 'Beklemede';
      case SellerStatus.Approved: return 'Onaylandı';
      case SellerStatus.Rejected: return 'Reddedildi';
      default: return '';
    }
  }

  getSellerStatusBadgeClass(status: SellerStatus): string {
    const base = "text-xs font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider ";
    switch (status) {
      case SellerStatus.Pending: return base + "bg-amber-50 text-amber-600";
      case SellerStatus.Approved: return base + "bg-emerald-50 text-emerald-600";
      case SellerStatus.Rejected: return base + "bg-red-50 text-red-600";
      default: return base + "bg-zinc-100 text-zinc-500";
    }
  }

  setActiveTab(tab: 'users' | 'sellers' | 'categories') {
    this.activeTab = tab;
  }
}
