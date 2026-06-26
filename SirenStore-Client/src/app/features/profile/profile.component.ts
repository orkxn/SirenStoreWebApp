import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProfileService } from '../../../core/services/profile.service';
import { OrderService } from '../../../core/services/order.service';
import { UserProfile } from '../../../core/models/user.model';
import { Order } from '../../../core/models/order.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  profile: UserProfile | null = null;
  orders: Order[] = [];
  
  profileForm: FormGroup;
  passwordForm: FormGroup;
  
  activeTab: 'info' | 'orders' | 'password' = 'info';
  
  isLoading = false;
  successMessage = '';
  errorMessage = '';

  constructor(
    private profileService: ProfileService,
    private orderService: OrderService,
    private fb: FormBuilder
  ) {
    this.profileForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phoneNumber: ['']
    });

    this.passwordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmNewPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit(): void {
    this.loadProfile();
    this.loadOrders();
  }

  loadProfile(): void {
    this.isLoading = true;
    this.profileService.getProfile().subscribe({
      next: (data) => {
        this.profile = data;
        this.profileForm.patchValue({
          firstName: data.firstName,
          lastName: data.lastName,
          phoneNumber: data.phoneNumber
        });
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Profil yüklenemedi', err);
        this.errorMessage = 'Profil bilgileri yüklenemedi.';
        this.isLoading = false;
      }
    });
  }

  loadOrders(): void {
    this.orderService.getOrders().subscribe({
      next: (data) => {
        this.orders = data;
      },
      error: (err) => {
        console.error('Siparişler yüklenemedi', err);
      }
    });
  }

  updateProfile(): void {
    if (this.profileForm.invalid) return;
    
    this.isLoading = true;
    this.successMessage = '';
    this.errorMessage = '';

    this.profileService.updateProfile(this.profileForm.value).subscribe({
      next: (res) => {
        this.successMessage = res.message || res.Message || 'Profil başarıyla güncellendi.';
        this.isLoading = false;
        this.loadProfile();
      },
      error: (err) => {
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
      next: (res) => {
        this.successMessage = res.message || res.Message || 'Şifreniz başarıyla değiştirildi.';
        this.passwordForm.reset();
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = err.error?.message || err.error?.Message || 'Şifre değiştirilemedi.';
        this.isLoading = false;
      }
    });
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('newPassword')?.value === g.get('confirmNewPassword')?.value
      ? null : { mismatch: true };
  }

  setTab(tab: 'info' | 'orders' | 'password'): void {
    this.activeTab = tab;
    this.successMessage = '';
    this.errorMessage = '';
  }
}
