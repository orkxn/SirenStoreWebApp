import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProfileService } from '../../core/services/profile.service';
import { OrderService } from '../../core/services/order.service';
import { SellerService } from '../../core/services/seller.service';
import { AuthService } from '../../core/services/auth';
import { UserProfile, UserTypes } from '../../core/models/user.model';
import { Order } from '../../core/models/order.model';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  UserTypes = UserTypes;
  profile: UserProfile | null = null;
  orders: Order[] = [];
  
  profileForm: FormGroup;
  passwordForm: FormGroup;
  sellerApplyForm: FormGroup;
  
  activeTab: 'info' | 'orders' | 'password' | 'seller-apply' = 'info';
  sellerStatus: { hasApplied: boolean; status: string; storeName?: string; contactEmail?: string; contactPhone?: string; supportLine?: string } | null = null;
  
  isLoading = false;
  successMessage = '';
  errorMessage = '';

  constructor(
    private profileService: ProfileService,
    private orderService: OrderService,
    private sellerService: SellerService,
    public authService: AuthService,
    private fb: FormBuilder,
    private route: ActivatedRoute
  ) {
    this.profileForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phoneNumber: ['', [Validators.required, Validators.pattern('^5[0-9]{9}$')]]
    });

    this.passwordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmNewPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });

    this.sellerApplyForm = this.fb.group({
      storeName: ['', Validators.required],
      contactEmail: ['', [Validators.required, Validators.email]],
      contactPhone: ['', [Validators.required, Validators.pattern('^5[0-9]{9}$')]],
      supportLine: ['', Validators.required],
      taxNumber: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      taxOffice: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['tab'] === 'orders' || params['tab'] === 'info' || params['tab'] === 'password' || params['tab'] === 'seller-apply') {
        this.activeTab = params['tab'] as any;
      }
    });
    this.loadProfile();
    this.loadOrders();
    this.loadSellerStatus();
  }

  loadProfile(): void {
    this.isLoading = true;
    this.profileService.getProfile().subscribe({
      next: (data: UserProfile) => {
        this.profile = data;
        this.profileForm.patchValue({
          firstName: data.firstName,
          lastName: data.lastName,
          phoneNumber: data.phoneNumber
        });
        this.isLoading = false;
      },
      error: (err: any) => {
        console.error('Profil yüklenemedi', err);
        this.errorMessage = 'Profil bilgileri yüklenemedi.';
        this.isLoading = false;
      }
    });
  }

  loadOrders(): void {
    this.orderService.getOrders().subscribe({
      next: (data: Order[]) => {
        this.orders = data;
      },
      error: (err: any) => {
        console.error('Siparişler yüklenemedi', err);
      }
    });
  }

  loadSellerStatus(): void {
    const user = this.authService.getCurrentUser();
    if (!user || user.userType !== UserTypes.Customer) return;

    this.sellerService.getMySellerStatus().subscribe({
      next: (data) => {
        this.sellerStatus = data;
        if (data.hasApplied) {
          this.sellerApplyForm.patchValue({
            storeName: data.storeName,
            contactEmail: data.contactEmail,
            contactPhone: data.contactPhone,
            supportLine: data.supportLine,
            taxNumber: data.taxNumber,
            taxOffice: data.taxOffice
          });
          if (data.status === 'Pending') {
            this.sellerApplyForm.disable();
          } else {
            this.sellerApplyForm.enable();
          }
        }
      },
      error: (err) => console.error('Satıcı durumu alınamadı', err)
    });
  }

  updateProfile(): void {
    if (this.profileForm.invalid) return;
    
    this.isLoading = true;
    this.successMessage = '';
    this.errorMessage = '';

    this.profileService.updateProfile(this.profileForm.value).subscribe({
      next: (res: any) => {
        this.successMessage = res.message || res.Message || 'Profil başarıyla güncellendi.';
        this.isLoading = false;
        this.loadProfile();
      },
      error: (err: any) => {
        this.errorMessage = err.error?.message || err.error?.Message || 'Güncelleme başarısız.';
        this.isLoading = false;
      }
    });
  }

  changePassword(): void {
    if (this.passwordForm.invalid) return;

    this.isLoading = true;
    this.successMessage = '';
    this.errorMessage = '';

    this.profileService.changePassword(this.passwordForm.value).subscribe({
      next: (res: any) => {
        this.successMessage = res.message || res.Message || 'Şifreniz başarıyla değiştirildi.';
        this.passwordForm.reset();
        this.isLoading = false;
      },
      error: (err: any) => {
        this.errorMessage = err.error?.message || err.error?.Message || 'Şifre değiştirilemedi.';
        this.isLoading = false;
      }
    });
  }

  applyToBeSeller(): void {
    if (this.sellerApplyForm.invalid) return;

    this.isLoading = true;
    this.successMessage = '';
    this.errorMessage = '';

    this.sellerService.applyToBecomeSeller(this.sellerApplyForm.value).subscribe({
      next: (res) => {
        this.successMessage = res.message || 'Satıcı başvurunuz başarıyla alındı. Admin onayı bekleniyor.';
        this.isLoading = false;
        this.loadSellerStatus();
      },
      error: (err) => {
        this.errorMessage = err.error?.message || err.error?.Message || 'Başvuru yapılamadı.';
        this.isLoading = false;
      }
    });
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('newPassword')?.value === g.get('confirmNewPassword')?.value
      ? null : { mismatch: true };
  }

  setTab(tab: 'info' | 'orders' | 'password' | 'seller-apply'): void {
    this.activeTab = tab;
    this.successMessage = '';
    this.errorMessage = '';
    if (tab === 'seller-apply') {
      this.loadSellerStatus();
    }
  }
}
