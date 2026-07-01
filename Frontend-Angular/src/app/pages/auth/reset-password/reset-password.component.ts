import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { ToastService } from '../../../services/toast.service';
import { InputComponent } from '../../../components/input/input.component';
import { ButtonComponent } from '../../../components/button/button.component';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, InputComponent, ButtonComponent],
  template: `
    <div class="min-h-[80vh] flex items-center justify-center px-6 py-12 text-left">
      <div class="w-full max-w-md glass-surface bg-zinc-950/[0.02] dark:bg-white/5 border border-zinc-950/5 dark:border-white/10 p-8 rounded-3xl shadow-xl">
        
        <!-- Header -->
        <div class="text-center mb-8">
          <h2 class="text-3xl font-bold tracking-tight text-zinc-950 dark:text-white">
            Yeni Şifre Belirle
          </h2>
          <p class="text-sm text-zinc-500 dark:text-zinc-400 mt-2">
            Güçlü ve benzersiz yeni şifrenizi girin.
          </p>
        </div>

        <form (ngSubmit)="onSubmit()" class="space-y-6">
          <div class="relative">
            <app-input
              label="Yeni Şifre"
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

          <app-input
            label="Şifre Tekrarı"
            type="password"
            placeholder="••••••••"
            [(ngModel)]="confirmPassword"
            name="confirmPassword"
            [error]="confirmPasswordError"
          ></app-input>

          <app-button
            type="submit"
            variant="primary"
            [fullWidth]="true"
            [disabled]="isLoading"
            className="group"
          >
            <span *ngIf="isLoading; else btnText">Şifre Güncelleniyor...</span>
            <ng-template #btnText>
              <span class="flex items-center gap-2">
                Şifremi Güncelle <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 transition-transform group-hover:translate-x-1"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </span>
            </ng-template>
          </app-button>
        </form>

        <!-- Footer -->
        <div class="text-center mt-6 pt-6 border-t border-zinc-950/5 dark:border-white/5">
          <p class="text-xs text-zinc-500 dark:text-zinc-400">
            Giriş sayfasına dönmek için 
            <a routerLink="/login" class="font-semibold text-zinc-950 dark:text-white hover:underline">
              tıklayın
            </a>
          </p>
        </div>
      </div>
    </div>
  `
})
export class ResetPasswordComponent implements OnInit {
  email = '';
  token = '';
  password = '';
  confirmPassword = '';

  passwordError = '';
  confirmPasswordError = '';
  isLoading = false;
  showPassword = false;

  constructor(
    private authService: AuthService,
    private toastService: ToastService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.email = this.route.snapshot.queryParams['email'] || '';
    this.token = this.route.snapshot.queryParams['token'] || '';

    if (!this.email || !this.token) {
      this.toastService.showToast('Geçersiz şifre sıfırlama bağlantısı. Lütfen e-postanızı kontrol edin.', 'error');
      this.router.navigate(['/login']);
    }
  }

  async onSubmit() {
    this.passwordError = '';
    this.confirmPasswordError = '';

    if (!this.password) {
      this.passwordError = 'Şifre boş bırakılamaz.';
      return;
    }
    if (this.password.length < 6) {
      this.passwordError = 'Şifre en az 6 karakter olmalıdır.';
      return;
    }
    if (this.password !== this.confirmPassword) {
      this.confirmPasswordError = 'Şifreler uyuşmuyor.';
      return;
    }

    this.isLoading = true;
    try {
      await this.authService.resetPassword({
        email: this.email,
        token: this.token,
        password: this.password,
        confirmPassword: this.confirmPassword
      });
      this.toastService.showToast('Şifreniz başarıyla güncellendi. Giriş yapabilirsiniz.', 'success');
      this.router.navigate(['/login']);
    } catch (err: any) {
      this.toastService.showToast(err.message || 'Şifre güncellenirken bir hata oluştu.', 'error');
    } finally {
      this.isLoading = false;
    }
  }
}
