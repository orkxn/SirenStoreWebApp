import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuditLogDto, LoginHistoryDto, SellerManagementDto, UserManagementDto, CategoryDto, SellerStatus, UserTypes } from '../../models/api.types';
import { AdminService } from '../../services/admin.service';
import { SellerService } from '../../services/seller.service';
import { CategoryService } from '../../services/category.service';
import { ToastService } from '../../services/toast.service';
import { InputComponent } from '../../components/input/input.component';
import { ButtonComponent } from '../../components/button/button.component';
import { PaginationComponent } from '../../components/pagination/pagination.component';
import { LucideUsers, LucideStore, LucideFolderOpen, LucideFileText, LucideClock, LucideBan, LucideCheck, LucideX, LucidePencil, LucideTrash2 } from '@lucide/angular';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    InputComponent,
    ButtonComponent,
    PaginationComponent,
    LucideUsers,
    LucideStore,
    LucideFolderOpen,
    LucideFileText,
    LucideClock,
    LucideBan,
    LucideCheck,
    LucideX,
    LucidePencil,
    LucideTrash2
  ],
  template: `
    <div class="max-w-6xl mx-auto px-6 py-10 space-y-8 text-left">
      
      <!-- Header -->
      <div class="border-b border-zinc-950/5 dark:border-white/5 pb-6">
        <h1 class="text-4xl font-extrabold tracking-tight text-zinc-950 dark:text-white uppercase leading-none">Yönetici Paneli</h1>
        <p class="text-sm text-zinc-500 dark:text-zinc-400 mt-1.5">Sistem kullanıcılarını denetleyin, satıcı dükkan başvurularını onaylayın, kategorileri yönetin ve sistem loglarını inceleyin.</p>
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
          <svg lucideUsers class="w-4 h-4"></svg> Kullanıcılar ({{ users.length }})
        </button>

        <button
          (click)="setActiveTab('sellers')"
          [class]="'flex items-center gap-2 px-6 py-3 font-semibold text-sm transition-all border-b-2 ' + 
            (activeTab === 'sellers'
              ? 'border-zinc-950 dark:border-white text-zinc-950 dark:text-white'
              : 'border-transparent text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300')"
        >
          <svg lucideStore class="w-4 h-4"></svg> Satıcı Başvuruları ({{ sellers.length }})
        </button>

        <button
          (click)="setActiveTab('categories')"
          [class]="'flex items-center gap-2 px-6 py-3 font-semibold text-sm transition-all border-b-2 ' + 
            (activeTab === 'categories'
              ? 'border-zinc-950 dark:border-white text-zinc-950 dark:text-white'
              : 'border-transparent text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300')"
        >
          <svg lucideFolderOpen class="w-4 h-4"></svg> Kategori Yönetimi ({{ categories.length }})
        </button>

        <button
          (click)="setActiveTab('auditLogs')"
          [class]="'flex items-center gap-2 px-6 py-3 font-semibold text-sm transition-all border-b-2 ' + 
            (activeTab === 'auditLogs'
              ? 'border-zinc-950 dark:border-white text-zinc-950 dark:text-white'
              : 'border-transparent text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300')"
        >
          <svg lucideFileText class="w-4 h-4"></svg> İşlem Logları ({{ auditLogs.length }})
        </button>

        <button
          (click)="setActiveTab('loginHistories')"
          [class]="'flex items-center gap-2 px-6 py-3 font-semibold text-sm transition-all border-b-2 ' + 
            (activeTab === 'loginHistories'
              ? 'border-zinc-950 dark:border-white text-zinc-950 dark:text-white'
              : 'border-transparent text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300')"
        >
          <svg lucideClock class="w-4 h-4"></svg> Giriş Geçmişi ({{ loginHistories.length }})
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
                <tr *ngFor="let u of paginatedUsers" [class.opacity-60]="u.isDeleted" class="hover:bg-zinc-950/[0.01] dark:hover:bg-white/[0.01] transition-all">
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
                    <div class="flex flex-col gap-1.5 items-start">
                      <span *ngIf="u.isDeleted; else activeUser" class="text-red-500 text-xs">Banlı</span>
                      <ng-template #activeUser>
                        <span class="text-emerald-600 text-xs">Aktif</span>
                      </ng-template>
                      
                      <span *ngIf="u.isEmailConfirmed; else unconfirmedEmail" class="text-indigo-600 dark:text-indigo-400 text-[10px] font-semibold bg-indigo-500/5 dark:bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-500/15">E-posta Onaylı</span>
                      <ng-template #unconfirmedEmail>
                        <span class="text-amber-600 dark:text-amber-400 text-[10px] font-semibold bg-amber-500/5 dark:bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/15">E-posta Onaysız</span>
                      </ng-template>
                    </div>
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
                        <svg lucideBan class="w-3.5 h-3.5"></svg> Kullanıcıyı Banla
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <app-pagination
            [currentPage]="usersPage"
            [totalItems]="users.length"
            [pageSize]="9"
            (pageChange)="usersPage = $event"
          ></app-pagination>
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
                  <svg lucideCheck class="w-4 h-4"></svg> Onayla
                </button>
                <button
                  (click)="handleRejectSeller(sel.id)"
                  class="flex-grow flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-red-200 dark:border-red-950/30 text-red-600 font-bold hover:bg-red-50 dark:hover:bg-red-950/20 transition-all cursor-pointer text-xs"
                >
                  <svg lucideX class="w-4 h-4"></svg> Reddet
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
                    class="p-1.5 rounded-full border border-zinc-950/5 dark:border-white/10 text-zinc-500 hover:text-zinc-950 dark:hover:text-white transition-colors cursor-pointer flex items-center justify-center"
                    aria-label="Düzenle"
                  >
                    <svg lucidePencil class="w-3.5 h-3.5"></svg>
                  </button>
                  <button
                    (click)="handleDeleteCategory(cat.id)"
                    class="p-1.5 rounded-full border border-zinc-950/5 dark:border-white/10 text-zinc-400 hover:text-red-500 transition-colors cursor-pointer flex items-center justify-center"
                    aria-label="Sil"
                  >
                    <svg lucideTrash2 class="w-3.5 h-3.5"></svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>

        <!-- Tab 4: Audit Logs (İşlem Logları) -->
        <div *ngIf="activeTab === 'auditLogs'" class="space-y-6">
          <div *ngIf="auditLogs.length === 0" class="text-center py-12 text-zinc-500">Henüz kayıtlı işlem logu bulunmamaktadır.</div>

          <div *ngIf="auditLogs.length > 0" class="overflow-x-auto">
            <table class="w-full text-sm text-left border-collapse">
              <thead>
                <tr class="border-b border-zinc-950/5 dark:border-white/5 text-zinc-400 dark:text-zinc-500 text-[10px] uppercase font-bold tracking-wider">
                  <th class="pb-3 pr-4">Tarih</th>
                  <th class="pb-3 px-4">İşlem</th>
                  <th class="pb-3 px-4">Kullanıcı</th>
                  <th class="pb-3 px-4">Varlık</th>
                  <th class="pb-3 pl-4">Detaylar</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-zinc-950/5 dark:divide-white/5">
                <tr *ngFor="let log of paginatedAuditLogs" class="hover:bg-zinc-950/[0.01] dark:hover:bg-white/[0.01] transition-all">
                  <td class="py-3.5 pr-4 text-zinc-500 text-xs font-mono whitespace-nowrap">
                    {{ formatDate(log.creationDate) }}
                  </td>
                  <td class="py-3.5 px-4">
                    <span [class]="getAuditActionBadgeClass(log.action)">{{ log.action }}</span>
                  </td>
                  <td class="py-3.5 px-4 text-zinc-600 dark:text-zinc-300 text-xs">
                    <div class="flex flex-col">
                      <span class="font-semibold">{{ log.userEmail }}</span>
                      <span class="text-zinc-400 text-[10px]">ID: {{ log.userId ?? '—' }}</span>
                    </div>
                  </td>
                  <td class="py-3.5 px-4 text-xs">
                    <span class="font-mono text-zinc-500 bg-zinc-950/[0.03] dark:bg-white/5 px-2 py-0.5 rounded">{{ log.entityName }}:{{ log.entityId }}</span>
                  </td>
                  <td class="py-3.5 pl-4 text-zinc-500 text-xs max-w-xs truncate" [title]="log.newValues ?? ''">
                    {{ log.newValues || '—' }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <app-pagination
            [currentPage]="logsPage"
            [totalItems]="auditLogs.length"
            [pageSize]="9"
            (pageChange)="logsPage = $event"
          ></app-pagination>
        </div>

        <!-- Tab 5: Login Histories (Giriş Geçmişi) -->
        <div *ngIf="activeTab === 'loginHistories'" class="space-y-6">
          <div *ngIf="loginHistories.length === 0" class="text-center py-12 text-zinc-500">Henüz giriş geçmişi kaydı bulunmamaktadır.</div>

          <div *ngIf="loginHistories.length > 0" class="overflow-x-auto">
            <table class="w-full text-sm text-left border-collapse">
              <thead>
                <tr class="border-b border-zinc-950/5 dark:border-white/5 text-zinc-400 dark:text-zinc-500 text-[10px] uppercase font-bold tracking-wider">
                  <th class="pb-3 pr-4">Tarih</th>
                  <th class="pb-3 px-4">Kullanıcı ID</th>
                  <th class="pb-3 px-4">IP Adresi</th>
                  <th class="pb-3 px-4">Cihaz / Tarayıcı</th>
                  <th class="pb-3 px-4">Durum</th>
                  <th class="pb-3 pl-4">Hata Sebebi</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-zinc-950/5 dark:divide-white/5">
                <tr *ngFor="let h of paginatedLoginHistories" class="hover:bg-zinc-950/[0.01] dark:hover:bg-white/[0.01] transition-all">
                  <td class="py-3.5 pr-4 text-zinc-500 text-xs font-mono whitespace-nowrap">
                    {{ formatDate(h.creationDate) }}
                  </td>
                  <td class="py-3.5 px-4 text-zinc-600 dark:text-zinc-300 text-xs font-semibold">
                    {{ h.userId }}
                  </td>
                  <td class="py-3.5 px-4 text-xs">
                    <span class="font-mono text-zinc-500 bg-zinc-950/[0.03] dark:bg-white/5 px-2 py-0.5 rounded">{{ h.ipAddress }}</span>
                  </td>
                  <td class="py-3.5 px-4 text-zinc-500 text-xs max-w-[200px] truncate" [title]="h.userAgent ?? ''">
                    {{ truncateUserAgent(h.userAgent) }}
                  </td>
                  <td class="py-3.5 px-4">
                    <span *ngIf="h.isSuccessful" class="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/15">Başarılı</span>
                    <span *ngIf="!h.isSuccessful" class="text-[10px] font-bold px-2.5 py-1 rounded-full bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/15">Başarısız</span>
                  </td>
                  <td class="py-3.5 pl-4 text-zinc-500 text-xs">
                    {{ h.failureReason || '—' }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <app-pagination
            [currentPage]="loginPage"
            [totalItems]="loginHistories.length"
            [pageSize]="9"
            (pageChange)="loginPage = $event"
          ></app-pagination>
        </div>

      </main>

    </div>
  `
})
export class AdminPanelComponent implements OnInit {
  activeTab: 'users' | 'sellers' | 'categories' | 'auditLogs' | 'loginHistories' = 'users';
  users: UserManagementDto[] = [];
  sellers: SellerManagementDto[] = [];
  categories: CategoryDto[] = [];
  auditLogs: AuditLogDto[] = [];
  loginHistories: LoginHistoryDto[] = [];
  isLoading = false;
  isSubmitLoading = false;
  editCategory: CategoryDto | null = null;

  usersPage = 1;
  logsPage = 1;
  loginPage = 1;

  get paginatedUsers(): UserManagementDto[] {
    return this.users.slice((this.usersPage - 1) * 9, this.usersPage * 9);
  }

  get paginatedAuditLogs(): AuditLogDto[] {
    return this.auditLogs.slice((this.logsPage - 1) * 9, this.logsPage * 9);
  }

  get paginatedLoginHistories(): LoginHistoryDto[] {
    return this.loginHistories.slice((this.loginPage - 1) * 9, this.loginPage * 9);
  }

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
      const [userData, sellerData, catData, auditData, loginData] = await Promise.all([
        this.adminService.getAllUsers(),
        this.adminService.getAllSellers(),
        this.categoryService.getAll(),
        this.adminService.getAuditLogs(),
        this.adminService.getLoginHistories()
      ]);
      this.users = userData;
      this.sellers = sellerData;
      this.categories = catData;
      this.auditLogs = auditData;
      this.loginHistories = loginData;
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

  // ─── Helpers ────────────────────────────────────────────────

  formatDate(dateStr: string): string {
    const d = new Date(dateStr);
    return d.toLocaleString('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  truncateUserAgent(ua: string | null): string {
    if (!ua) return '—';
    return ua.length > 60 ? ua.substring(0, 60) + '…' : ua;
  }

  getAuditActionBadgeClass(action: string): string {
    const base = 'text-[10px] font-bold px-2.5 py-1 rounded-full border ';
    const upper = action.toUpperCase();

    if (upper.includes('BAN'))
      return base + 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/15';
    if (upper.includes('UNBAN'))
      return base + 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/15';
    if (upper.includes('LOGIN'))
      return base + 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/15';
    if (upper.includes('REGISTER'))
      return base + 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/15';
    if (upper.includes('VERIFIED') || upper.includes('VERIFICATION'))
      return base + 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/15';
    if (upper.includes('SELLER'))
      return base + 'bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/15';
    if (upper.includes('ORDER'))
      return base + 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/15';

    return base + 'bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border-zinc-500/15';
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

  setActiveTab(tab: 'users' | 'sellers' | 'categories' | 'auditLogs' | 'loginHistories') {
    this.activeTab = tab;
  }
}
