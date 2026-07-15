import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { ToastService } from '../../../services/toast.service';
import { InputComponent } from '../../../components/input/input.component';
import { ButtonComponent } from '../../../components/button/button.component';
import { LucideEye, LucideEyeOff, LucideArrowRight } from '@lucide/angular';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    FormsModule,
    InputComponent,
    ButtonComponent,
    LucideEye,
    LucideEyeOff,
    LucideArrowRight
  ],
  template: `
    <div class="min-h-[85vh] flex items-center justify-center px-6 py-12">
      <div class="w-full max-w-md glass-surface bg-zinc-950/[0.02] dark:bg-white/5 border border-zinc-950/5 dark:border-white/10 p-8 rounded-3xl shadow-xl">
        
        <!-- Header -->
        <div class="text-center mb-8">
          <h2 class="text-3xl font-bold tracking-tight text-zinc-950 dark:text-white">
            Yeni Hesap Oluştur
          </h2>
          <p class="text-sm text-zinc-500 dark:text-zinc-400 mt-2">
            Hemen kaydolun ve ayrıcalıklardan yararlanın.
          </p>
        </div>

        <!-- Form -->
        <form (ngSubmit)="onSubmit()" class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <app-input
              label="Ad"
              placeholder="Ahmet"
              [(ngModel)]="firstName"
              name="firstName"
              [error]="firstNameError"
            ></app-input>
            <app-input
              label="Soyad"
              placeholder="Yılmaz"
              [(ngModel)]="lastName"
              name="lastName"
              [error]="lastNameError"
            ></app-input>
          </div>

          <app-input
            label="E-posta Adresi"
            type="email"
            placeholder="örnek@siren.com"
            [(ngModel)]="email"
            name="email"
            [error]="emailError"
          ></app-input>

          <app-input
            label="Telefon Numarası"
            type="tel"
            placeholder="5xxxxxxxxx"
            [(ngModel)]="phoneNumber"
            name="phoneNumber"
            [error]="phoneNumberError"
          ></app-input>

          <div class="relative">
            <app-input
              label="Şifre"
              [type]="showPassword ? 'text' : 'password'"
              placeholder="••••••••"
              [(ngModel)]="password"
              name="password"
              [error]="passwordError"
            ></app-input>
            <button
              type="button"
              (click)="showPassword = !showPassword"
              class="absolute right-4 top-[42px] text-zinc-400 hover:text-zinc-950 dark:hover:text-white transition-colors flex items-center justify-center"
            >
              <svg *ngIf="showPassword" lucideEye class="w-4 h-4"></svg>
              <svg *ngIf="!showPassword" lucideEyeOff class="w-4 h-4"></svg>
            </button>
          </div>

          <app-button
            type="submit"
            variant="primary"
            [fullWidth]="true"
            [disabled]="isLoading"
            className="group mt-2"
          >
            <span *ngIf="isLoading; else btnText">Kaydediliyor...</span>
            <ng-template #btnText>
              <span class="flex items-center gap-2">
                Hesap Oluştur <svg lucideArrowRight class="w-4 h-4 transition-transform group-hover:translate-x-1"></svg>
              </span>
            </ng-template>
          </app-button>
        </form>

        <!-- Footer -->
        <div class="text-center mt-6 pt-6 border-t border-zinc-950/5 dark:border-white/5">
          <p class="text-xs text-zinc-500 dark:text-zinc-400">
            Zaten hesabınız var mı? 
            <a routerLink="/login" class="font-semibold text-zinc-950 dark:text-white hover:underline">
              Giriş Yapın
            </a>
          </p>
        </div>

      </div>
    </div>
  `
})
export class RegisterComponent {
  firstName = '';
  lastName = '';
  email = '';
  phoneNumber = '';
  password = '';

  firstNameError = '';
  lastNameError = '';
  emailError = '';
  phoneNumberError = '';
  passwordError = '';

  showPassword = false;
  isLoading = false;

  constructor(
    private authService: AuthService,
    private toastService: ToastService,
    private router: Router
  ) {}

  validate(): boolean {
    let isValid = true;
    this.firstNameError = '';
    this.lastNameError = '';
    this.emailError = '';
    this.phoneNumberError = '';
    this.passwordError = '';

    if (!this.firstName) {
      this.firstNameError = 'Ad alanı zorunludur.';
      isValid = false;
    }
    if (!this.lastName) {
      this.lastNameError = 'Soyad alanı zorunludur.';
      isValid = false;
    }

    if (!this.email) {
      this.emailError = 'E-posta adresi zorunludur.';
      isValid = false;
    } else {
      const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
      if (!emailRegex.test(this.email)) {
        this.emailError = 'Geçersiz e-posta adresi.';
        isValid = false;
      }
    }

    if (!this.phoneNumber) {
      this.phoneNumberError = 'Telefon numarası zorunludur.';
      isValid = false;
    } else {
      const phoneRegex = /^5\d{9}$/;
      if (!phoneRegex.test(this.phoneNumber)) {
        this.phoneNumberError = 'Telefon numaranız 5 ile başlayan 10 haneli olmalıdır (Örn: 5XXXXXXXXX).';
        isValid = false;
      }
    }

    if (!this.password) {
      this.passwordError = 'Şifre zorunludur.';
      isValid = false;
    } else if (this.password.length < 6) {
      this.passwordError = 'Şifre en az 6 karakter olmalıdır.';
      isValid = false;
    }

    return isValid;
  }

  async onSubmit() {
    if (!this.validate()) return;

    this.isLoading = true;
    try {
      await this.authService.register({
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
        phoneNumber: this.phoneNumber,
        password: this.password
      });
      this.toastService.showToast('Kayıt işleminiz başarılı! Şimdi giriş yapabilirsiniz.', 'success');
      this.router.navigate(['/login']);
    } catch (err: any) {
      this.toastService.showToast(err.message || 'Kayıt başarısız. Lütfen bilgilerinizi kontrol edin.', 'error');
    } finally {
      this.isLoading = false;
    }
  }
}
