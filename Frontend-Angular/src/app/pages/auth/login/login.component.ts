import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { ToastService } from '../../../services/toast.service';
import { InputComponent } from '../../../components/input/input.component';
import { ButtonComponent } from '../../../components/button/button.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    FormsModule,
    InputComponent,
    ButtonComponent
  ],
  template: `
    <div class="min-h-[80vh] flex items-center justify-center px-6 py-12">
      <div class="w-full max-w-md glass-surface bg-zinc-950/[0.02] dark:bg-white/5 border border-zinc-950/5 dark:border-white/10 p-8 rounded-3xl shadow-xl">
        
        <!-- LOGIN MODE -->
        <ng-container *ngIf="!isVerificationMode">
          <!-- Header -->
          <div class="text-center mb-8">
            <h2 class="text-3xl font-bold tracking-tight text-zinc-950 dark:text-white">
              Tekrar Hoş Geldiniz
            </h2>
            <p class="text-sm text-zinc-500 dark:text-zinc-400 mt-2">
              Hesabınıza giriş yapın ve alışverişe başlayın.
            </p>
          </div>

          <!-- Form -->
          <form (ngSubmit)="onSubmit()" class="space-y-6">
            <app-input
              label="E-posta Adresi"
              type="email"
              placeholder="örnek@siren.com"
              [(ngModel)]="email"
              name="email"
              [error]="emailError"
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
                class="absolute right-4 top-[42px] text-zinc-400 hover:text-zinc-950 dark:hover:text-white transition-colors"
              >
                <svg *ngIf="showPassword" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/><path d="m15 13-3-3m0 0-3 3"/></svg>
                <svg *ngIf="!showPassword" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.52 13.52 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/></svg>
              </button>
            </div>

            <!-- Forgot Password Link -->
            <div class="flex justify-end -mt-3 text-left">
              <a routerLink="/forgot-password" class="text-xs font-semibold text-zinc-500 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white transition-colors">
                Şifremi Unuttum
              </a>
            </div>

            <app-button
              type="submit"
              variant="primary"
              [fullWidth]="true"
              [disabled]="isLoading"
              className="group"
            >
              <span *ngIf="isLoading; else btnText">Giriş Yapılıyor...</span>
              <ng-template #btnText>
                <span class="flex items-center gap-2">
                  Giriş Yap <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 transition-transform group-hover:translate-x-1"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                </span>
              </ng-template>
            </app-button>
          </form>

          <!-- Footer -->
          <div class="text-center mt-6 pt-6 border-t border-zinc-950/5 dark:border-white/5">
            <p class="text-xs text-zinc-500 dark:text-zinc-400">
              Hesabınız yok mu? 
              <a routerLink="/register" class="font-semibold text-zinc-950 dark:text-white hover:underline">
                Kayıt Olun
              </a>
            </p>
          </div>
        </ng-container>

        <!-- EMAIL VERIFICATION MODE -->
        <ng-container *ngIf="isVerificationMode">
          <!-- Header -->
          <div class="text-center mb-8">
            <h2 class="text-3xl font-bold tracking-tight text-zinc-950 dark:text-white">
              E-posta Doğrulama
            </h2>
            <p class="text-sm text-zinc-500 dark:text-zinc-400 mt-2">
              Hesabınızı kullanabilmeniz için e-posta doğrulaması yapmanız gerekmektedir.
            </p>
            <p class="text-xs text-indigo-600 dark:text-indigo-400 mt-2 font-mono bg-indigo-500/5 py-1 px-3 rounded-md inline-block">
              {{ verificationEmail }}
            </p>
          </div>

          <!-- Form -->
          <form (ngSubmit)="onVerifyCode()" class="space-y-6">
            <div class="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs leading-relaxed">
              Hesabınız henüz doğrulanmamıştır. Lütfen aşağıdaki butona tıklayarak e-posta adresinize bir doğrulama kodu gönderin ve ardından kodu girin.
            </div>

            <div>
              <app-button
                type="button"
                variant="secondary"
                [fullWidth]="true"
                [disabled]="isCodeSending"
                (click)="onSendCode()"
                className="text-xs py-2.5"
              >
                <span>{{ isCodeSending ? 'Kod Gönderiliyor...' : 'Doğrulama Kodu Gönder' }}</span>
              </app-button>
            </div>

            <app-input
              label="Doğrulama Kodu"
              type="text"
              placeholder="E-postanıza gelen kodu girin"
              [(ngModel)]="verificationCode"
              name="verificationCode"
              [error]="codeError"
            ></app-input>

            <app-button
              type="submit"
              variant="primary"
              [fullWidth]="true"
              [disabled]="isVerifying || !verificationCode"
              className="group"
            >
              <span *ngIf="isVerifying; else verifyBtnText">Hesap Doğrulanıyor...</span>
              <ng-template #verifyBtnText>
                <span class="flex items-center gap-2">
                  Hesabı Doğrula <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 transition-transform group-hover:translate-x-1"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                </span>
              </ng-template>
            </app-button>

            <!-- Back to login link -->
            <div class="text-center pt-2">
              <button
                type="button"
                (click)="isVerificationMode = false"
                class="text-xs font-semibold text-zinc-500 hover:text-zinc-950 dark:hover:text-white transition-colors"
              >
                Giriş Ekranına Dön
              </button>
            </div>
          </form>
        </ng-container>

      </div>
    </div>
  `
})
export class LoginComponent {
  email = '';
  password = '';
  showPassword = false;
  isLoading = false;

  emailError = '';
  passwordError = '';

  // Verification mode properties
  isVerificationMode = false;
  verificationEmail = '';
  verificationCode = '';
  isCodeSending = false;
  isVerifying = false;
  codeError = '';

  constructor(
    private authService: AuthService,
    private toastService: ToastService,
    private router: Router
  ) {}

  validate(): boolean {
    let isValid = true;
    this.emailError = '';
    this.passwordError = '';

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
      await this.authService.login({
        email: this.email,
        password: this.password
      });
      this.toastService.showToast('Giriş işlemi başarıyla gerçekleştirildi!', 'success');
      this.router.navigate(['/']);
    } catch (err: any) {
      const errorData = err.error;
      const type = errorData?.type || errorData?.Type;
      const email = errorData?.email || errorData?.Email;
      const message = errorData?.message || errorData?.Message;

      if (errorData && type === 'EmailNotConfirmed') {
        this.verificationEmail = email || this.email;
        this.isVerificationMode = true;
        this.verificationCode = '';
        this.codeError = '';
        this.toastService.showToast(message || 'Lütfen hesabınızı doğrulayın.', 'warning');
      } else {
        this.toastService.showToast(message || err.message || 'Giriş yapılamadı. Bilgilerinizi kontrol edin.', 'error');
      }
    } finally {
      this.isLoading = false;
    }
  }

  async onSendCode() {
    this.isCodeSending = true;
    this.codeError = '';
    try {
      await this.authService.resendVerificationEmail({ email: this.verificationEmail });
      this.toastService.showToast('Doğrulama kodu e-postanıza gönderildi!', 'success');
    } catch (err: any) {
      this.toastService.showToast(err.error?.message || err.message || 'Kod gönderilemedi.', 'error');
    } finally {
      this.isCodeSending = false;
    }
  }

  async onVerifyCode() {
    if (!this.verificationCode) {
      this.codeError = 'Doğrulama kodu girmelisiniz.';
      return;
    }
    this.isVerifying = true;
    this.codeError = '';
    try {
      await this.authService.verifyEmail({
        email: this.verificationEmail,
        token: this.verificationCode
      });
      this.toastService.showToast('Hesabınız başarıyla doğrulandı ve giriş yapıldı!', 'success');
      this.isVerificationMode = false;
      this.router.navigate(['/']);
    } catch (err: any) {
      this.codeError = err.error?.message || err.message || 'Geçersiz doğrulama kodu.';
      this.toastService.showToast(this.codeError, 'error');
    } finally {
      this.isVerifying = false;
    }
  }
}
