import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { ToastService } from '../../../services/toast.service';
import { InputComponent } from '../../../components/input/input.component';
import { ButtonComponent } from '../../../components/button/button.component';
import { LucideArrowRight, LucideSend } from '@lucide/angular';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    CommonModule, 
    RouterLink, 
    FormsModule, 
    InputComponent, 
    ButtonComponent,
    LucideArrowRight,
    LucideSend
  ],
  template: `
    <div class="min-h-[80vh] flex items-center justify-center px-6 py-12 text-left">
      <div class="w-full max-w-md glass-surface bg-zinc-950/[0.02] dark:bg-white/5 border border-zinc-950/5 dark:border-white/10 p-8 rounded-3xl shadow-xl">
        
        <!-- Header -->
        <div class="text-center mb-8">
          <h2 class="text-3xl font-bold tracking-tight text-zinc-950 dark:text-white">
            Şifremi Unuttum
          </h2>
          <p class="text-sm text-zinc-500 dark:text-zinc-400 mt-2">
            E-posta adresinizi girin, şifre sıfırlama bağlantısını gönderelim.
          </p>
        </div>

        <form *ngIf="!emailSent" (ngSubmit)="onSubmit()" class="space-y-6">
          <app-input
            label="E-posta Adresi"
            type="email"
            placeholder="örnek@siren.com"
            [(ngModel)]="email"
            name="email"
            [error]="emailError"
          ></app-input>

          <app-button
            type="submit"
            variant="primary"
            [fullWidth]="true"
            [disabled]="isLoading"
            className="group"
          >
            <span *ngIf="isLoading; else btnText">Bağlantı Gönderiliyor...</span>
            <ng-template #btnText>
              <span class="flex items-center gap-2">
                Sıfırlama Bağlantısı Gönder <svg lucideArrowRight class="w-4 h-4 transition-transform group-hover:translate-x-1"></svg>
              </span>
            </ng-template>
          </app-button>
        </form>

        <!-- Success Message -->
        <div *ngIf="emailSent" class="space-y-6">
          <div class="p-5 rounded-2xl bg-zinc-950/5 dark:bg-white/5 border border-zinc-950/10 dark:border-white/10 text-center space-y-4">
            <div class="w-12 h-12 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto">
              <svg lucideSend class="w-6 h-6"></svg>
            </div>
            <div>
              <p class="text-sm font-semibold text-zinc-900 dark:text-white">Bağlantı Gönderildi</p>
              <p class="text-xs text-zinc-500 dark:text-zinc-400 mt-2 leading-relaxed">
                Eğer girdiğiniz e-posta adresi sistemde kayıtlı ise, şifrenizi sıfırlayabilmeniz için bir bağlantı e-posta adresinize gönderilmiştir.
              </p>
            </div>
          </div>

          <app-button
            variant="secondary"
            [fullWidth]="true"
            routerLink="/login"
          >
            Giriş Yap Sayfasına Dön
          </app-button>
        </div>

        <!-- Footer -->
        <div class="text-center mt-6 pt-6 border-t border-zinc-950/5 dark:border-white/5">
          <p class="text-xs text-zinc-500 dark:text-zinc-400">
            Hatırladınız mı? 
            <a routerLink="/login" class="font-semibold text-zinc-950 dark:text-white hover:underline">
              Giriş Yapın
            </a>
          </p>
        </div>
      </div>
    </div>
  `
})
export class ForgotPasswordComponent {
  email = '';
  emailError = '';
  isLoading = false;
  emailSent = false;

  constructor(
    private authService: AuthService,
    private toastService: ToastService
  ) {}

  async onSubmit() {
    this.emailError = '';
    this.isLoading = true;
    try {
      await this.authService.forgotPassword(this.email);
      this.emailSent = true;
      this.toastService.showToast('Sıfırlama e-postası başarıyla gönderildi.', 'success');
    } catch (err: any) {
      this.emailError = err.message || 'Bir hata oluştu.';
    } finally {
      this.isLoading = false;
    }
  }
}
