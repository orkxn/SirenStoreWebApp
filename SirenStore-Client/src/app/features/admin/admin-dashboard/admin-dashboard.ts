import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AdminService, UserManagementDto, SellerManagementDto } from '../../../core/services/admin.service';
import { AuthService } from '../../../core/services/auth';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.scss'
})
export class AdminDashboardComponent implements OnInit {
  adminService = inject(AdminService);
  authService = inject(AuthService);
  router = inject(Router);

  users = signal<UserManagementDto[]>([]);
  sellers = signal<SellerManagementDto[]>([]);
  
  activeTab = signal<'users' | 'sellers'>('users');
  
  loading = signal<boolean>(false);
  errorMessage = signal<string>('');
  successMessage = signal<string>('');

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading.set(true);
    this.errorMessage.set('');
    
    if (this.activeTab() === 'users') {
      this.adminService.getUsers().subscribe({
        next: (data) => {
          this.users.set(data);
          this.loading.set(false);
        },
        error: (err) => {
          this.errorMessage.set('Kullanıcı listesi yüklenirken hata oluştu.');
          this.loading.set(false);
        }
      });
    } else {
      this.adminService.getSellers().subscribe({
        next: (data) => {
          this.sellers.set(data);
          this.loading.set(false);
        },
        error: (err) => {
          this.errorMessage.set('Satıcı başvuruları yüklenirken hata oluştu.');
          this.loading.set(false);
        }
      });
    }
  }

  setTab(tab: 'users' | 'sellers'): void {
    this.activeTab.set(tab);
    this.loadData();
  }

  banUser(user: UserManagementDto): void {
    if (!confirm(`${user.firstName} ${user.lastName} adlı kullanıcıyı banlamak istediğinize emin misiniz?`)) return;

    this.adminService.banUser(user.id).subscribe({
      next: () => {
        this.showSuccess('Kullanıcı başarıyla banlandı.');
        this.loadData();
      },
      error: (err) => {
        this.errorMessage.set(err.error?.message || 'Kullanıcı banlanırken hata oluştu.');
      }
    });
  }

  unbanUser(user: UserManagementDto): void {
    if (!confirm(`${user.firstName} ${user.lastName} adlı kullanıcının banını kaldırmak istediğinize emin misiniz?`)) return;

    this.adminService.unbanUser(user.id).subscribe({
      next: () => {
        this.showSuccess('Kullanıcının banı kaldırıldı.');
        this.loadData();
      },
      error: (err) => {
        this.errorMessage.set(err.error?.message || 'Kullanıcı banı kaldırılırken hata oluştu.');
      }
    });
  }

  approveSeller(seller: SellerManagementDto): void {
    if (!confirm(`${seller.storeName} mağaza başvurusunu onaylamak istediğinize emin misiniz?`)) return;

    this.adminService.approveSeller(seller.id).subscribe({
      next: () => {
        this.showSuccess('Satıcı başvurusu onaylandı.');
        this.loadData();
      },
      error: (err) => {
        this.errorMessage.set(err.error?.message || 'Başvuru onaylanırken hata oluştu.');
      }
    });
  }

  rejectSeller(seller: SellerManagementDto): void {
    if (!confirm(`${seller.storeName} mağaza başvurusunu reddetmek istediğinize emin misiniz?`)) return;

    this.adminService.rejectSeller(seller.id).subscribe({
      next: () => {
        this.showSuccess('Satıcı başvurusu reddedildi.');
        this.loadData();
      },
      error: (err) => {
        this.errorMessage.set(err.error?.message || 'Başvuru reddedilirken hata oluştu.');
      }
    });
  }

  private showSuccess(msg: string): void {
    this.successMessage.set(msg);
    setTimeout(() => this.successMessage.set(''), 4000);
  }

  getRoleName(userType: number): string {
    if (userType === 2) return 'Admin';
    if (userType === 1) return 'Satıcı';
    return 'Müşteri';
  }

  getSellerStatusName(status: number): string {
    if (status === 2) return 'Onaylandı';
    if (status === 3) return 'Reddedildi';
    return 'Beklemede';
  }
}
