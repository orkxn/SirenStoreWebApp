import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { ToastService } from '../../../services/toast.service';
import { InputComponent } from '../../../components/input/input.component';
import { ButtonComponent } from '../../../components/button/button.component';
import { LucideEye, LucideEyeOff, LucideArrowRight } from '@lucide/angular';

@Component({
  selector: 'app-reset-password',
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
              class="absolute right-4 top-[42px] text-zinc-400 hover:text-zinc-950 dark:hover:text-white transition-colors flex items-center justify-center"
            >
              <svg *ngIf="showPassword" lucideEye class="w-4 h-4"></svg>
              <svg *ngIf="!showPassword" lucideEyeOff class="w-4 h-4"></svg>
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
                Şifremi Güncelle <svg lucideArrowRight class="w-4 h-4 transition-transform group-hover:translate-x-1"></svg>
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
