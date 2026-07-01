import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CustomerService } from '../../services/customer.service';
import { SellerService } from '../../services/seller.service';
import { ToastService } from '../../services/toast.service';
import { CommentService } from '../../services/comment.service';
import { CommentDto } from '../../models/api.types';
import { InputComponent } from '../../components/input/input.component';
import { ButtonComponent } from '../../components/button/button.component';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    InputComponent,
    ButtonComponent
  ],
  template: `
    <div class="max-w-4xl mx-auto px-6 py-10 space-y-8 text-left">
      
      <!-- Header -->
      <div class="border-b border-zinc-950/5 dark:border-white/5 pb-6">
        <h1 class="text-4xl font-extrabold tracking-tight text-zinc-950 dark:text-white uppercase leading-none">
          Hesabım
        </h1>
        <p class="text-sm text-zinc-500 dark:text-zinc-400 mt-1.5">
          Kişisel bilgilerinizi, şifrenizi yönetin ve mağaza başvurularınızı inceleyin.
        </p>
      </div>

      <!-- Tabs Layout -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
        
        <!-- Sidebar Navigation -->
        <nav class="md:col-span-1 flex flex-col gap-2">
          <button
            (click)="setActiveTab('profile')"
            [class]="'flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-semibold text-left transition-all ' + 
              (activeTab === 'profile'
                ? 'bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 shadow-md'
                : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-950/5 dark:hover:bg-white/5')"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> Profilim
          </button>
          
          <button
            (click)="setActiveTab('password')"
            [class]="'flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-semibold text-left transition-all ' + 
              (activeTab === 'password'
                ? 'bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 shadow-md'
                : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-950/5 dark:hover:bg-white/5')"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg> Şifre Değiştir
          </button>

          <button
            (click)="setActiveTab('comments')"
            [class]="'flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-semibold text-left transition-all ' + 
              (activeTab === 'comments'
                ? 'bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 shadow-md'
                : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-950/5 dark:hover:bg-white/5')"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg> Değerlendirmelerim
          </button>
          
          <button
            (click)="setActiveTab('seller')"
            [class]="'flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-semibold text-left transition-all ' + 
              (activeTab === 'seller'
                ? 'bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 shadow-md'
                : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-950/5 dark:hover:bg-white/5')"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4"><path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"/><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"/><path d="M2 7h20"/></svg> Satıcı Paneli / Başvuru
          </button>
        </nav>

        <!-- Tab Contents -->
        <main class="md:col-span-3 glass-surface bg-zinc-950/[0.01] dark:bg-white/5 border border-zinc-950/5 dark:border-white/10 p-8 rounded-3xl">
          
          <!-- Tab 1: Profilim -->
          <div *ngIf="activeTab === 'profile'">
            <form (ngSubmit)="onUpdateProfile()" class="space-y-6">
              <h3 class="text-lg font-bold text-zinc-950 dark:text-white uppercase tracking-wide border-b border-zinc-950/5 dark:border-white/5 pb-2.5 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5 text-zinc-400"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> Profil Bilgileri
              </h3>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <app-input
                  label="Ad"
                  placeholder="Adınız"
                  [(ngModel)]="profileData.firstName"
                  name="firstName"
                  [error]="profileErrors.firstName"
                ></app-input>
                <app-input
                  label="Soyad"
                  placeholder="Soyadınız"
                  [(ngModel)]="profileData.lastName"
                  name="lastName"
                  [error]="profileErrors.lastName"
                ></app-input>
              </div>

              <div class="flex flex-col gap-3">
                <app-input
                  label="E-posta Adresi (Değiştirilemez)"
                  type="email"
                  [disabled]="true"
                  [(ngModel)]="profileEmail"
                  name="email"
                  className="opacity-60 cursor-not-allowed bg-zinc-950/5 dark:bg-white/5"
                ></app-input>

                <app-input
                  label="Telefon Numarası"
                  placeholder="5xxxxxxxxx"
                  [(ngModel)]="profileData.phoneNumber"
                  name="phoneNumber"
                  [error]="profileErrors.phoneNumber"
                ></app-input>
              </div>

              <div class="pt-4">
                <app-button type="submit" variant="primary" [disabled]="isLoading">
                  {{ isLoading ? 'Güncelleniyor...' : 'Profilimi Güncelle' }}
                </app-button>
              </div>
            </form>
          </div>

          <!-- Tab 2: Şifre Değiştir -->
          <div *ngIf="activeTab === 'password'">
            <form (ngSubmit)="onChangePassword()" class="space-y-6">
              <h3 class="text-lg font-bold text-zinc-950 dark:text-white uppercase tracking-wide border-b border-zinc-950/5 dark:border-white/5 pb-2.5 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5 text-zinc-400"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg> Güvenlik & Şifre
              </h3>

              <app-input
                label="Mevcut Şifre"
                type="password"
                placeholder="••••••••"
                [(ngModel)]="passwordData.currentPassword"
                name="currentPassword"
                [error]="passwordErrors.currentPassword"
              ></app-input>

              <app-input
                label="Yeni Şifre"
                type="password"
                placeholder="••••••••"
                [(ngModel)]="passwordData.newPassword"
                name="newPassword"
                [error]="passwordErrors.newPassword"
              ></app-input>

              <app-input
                label="Yeni Şifre Tekrar"
                type="password"
                placeholder="••••••••"
                [(ngModel)]="passwordData.confirmNewPassword"
                name="confirmNewPassword"
                [error]="passwordErrors.confirmNewPassword"
              ></app-input>

              <div class="pt-4">
                <app-button type="submit" variant="primary" [disabled]="isLoading">
                  {{ isLoading ? 'Değiştiriliyor...' : 'Şifreyi Değiştir' }}
                </app-button>
              </div>
            </form>
          </div>

          <!-- Tab 3: Satıcı Paneli / Başvuru -->
          <div *ngIf="activeTab === 'seller'" class="space-y-6">
            <h3 class="text-lg font-bold text-zinc-950 dark:text-white uppercase tracking-wide border-b border-zinc-950/5 dark:border-white/5 pb-2.5 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5 text-zinc-400"><path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"/><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"/><path d="M2 7h20"/></svg> Satıcı Durumu
            </h3>

            <!-- User is already a Seller -->
            <div *ngIf="authService.user?.role === 'Seller'; else notSeller" class="space-y-4 text-center py-8">
              <div class="w-12 h-12 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-6 h-6"><path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"/><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"/><path d="M2 7h20"/></svg>
              </div>
              <h4 class="text-base font-bold text-zinc-900 dark:text-white uppercase">Satıcı Profiliniz Aktif!</h4>
              <p class="text-xs text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto leading-relaxed">
                Mağazanız onaylanmıştır. Ürünlerinizi listelemek, yeni ürün eklemek ve siparişleri yönetmek için satıcı panelini kullanabilirsiniz.
              </p>
              <a href="/seller">
                <app-button variant="primary">
                  Satıcı Paneline Git
                </app-button>
              </a>
            </div>

            <!-- User is not a Seller -->
            <ng-template #notSeller>
              <div *ngIf="loadingStatus" class="text-center py-10">
                <div class="animate-spin inline-block w-6 h-6 border-2 border-zinc-900 border-t-transparent dark:border-white rounded-full"></div>
              </div>

              <div *ngIf="!loadingStatus && sellerStatus">
                
                <!-- Application exists and Pending -->
                <div *ngIf="sellerStatus.hasApplied && sellerStatus.status === 'Pending'" class="flex gap-4 p-5 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-900/30 text-xs leading-relaxed text-left">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5 shrink-0"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
                  <div>
                    <strong class="block text-sm font-semibold uppercase mb-1">Başvurunuz Değerlendiriliyor</strong>
                    <strong>Mağaza Adı:</strong> {{ sellerStatus.storeName }} <br />
                    <strong>Destek Hattı:</strong> {{ sellerStatus.supportLine }} <br />
                    <strong>Vergi Dairesi/No:</strong> {{ sellerStatus.taxOffice }} / {{ sellerStatus.taxNumber }} <br />
                    <p class="mt-2 text-zinc-500 dark:text-zinc-400">Başvurunuz admin ekibi tarafından incelenmektedir. Onaylandıktan sonra otomatik olarak satıcı paneline erişiminiz açılacaktır.</p>
                  </div>
                </div>

                <!-- Application exists and Rejected -->
                <div *ngIf="sellerStatus.hasApplied && sellerStatus.status === 'Rejected'" class="space-y-6">
                  <div class="flex gap-4 p-5 rounded-2xl bg-red-50/50 dark:bg-red-950/20 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-900/30 text-xs leading-relaxed text-left">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5 shrink-0"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" x2="12" y1="9" y2="13"/><line x1="12" x2="12.01" y1="17" y2="17"/></svg>
                    <div>
                      <strong class="block text-sm font-semibold uppercase mb-1">Başvurunuz Reddedildi</strong>
                      Maalesef satıcı başvurunuz inceleme sonucunda reddedilmiştir. Bilgilerinizi kontrol ederek tekrar başvuru yapabilirsiniz.
                    </div>
                  </div>

                  <!-- Render Form again to retry -->
                  <ng-container *ngTemplateOutlet="sellerApplyForm"></ng-container>
                </div>

                <!-- No application yet -->
                <div *ngIf="!sellerStatus.hasApplied">
                  <ng-container *ngTemplateOutlet="sellerApplyForm"></ng-container>
                </div>

              </div>
            </ng-template>

            <!-- Reusable Apply Form Template -->
            <ng-template #sellerApplyForm>
              <form (ngSubmit)="onBecomeSeller()" class="space-y-4 text-left">
                <div class="p-4 rounded-xl bg-zinc-950/5 dark:bg-white/5 border border-zinc-950/5 dark:border-white/10 text-xs flex gap-2.5 text-zinc-500">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5 shrink-0 text-zinc-400"><rect width="16" height="18" x="4" y="4" rx="2"/><path d="M9 9h6"/><path d="M9 13h6"/><path d="M9 17h6"/></svg>
                  <p class="leading-relaxed">
                    Siren Store platformunda kendi mağazanızı açarak ürünlerinizi satabilirsiniz. Başvurunuz onaylandığında profiliniz otomatik olarak <strong>Satıcı</strong> rolüne yükseltilecektir.
                  </p>
                </div>

                <app-input
                  label="Mağaza / Dükkan Adı"
                  placeholder="Örn: Siren Butik"
                  [(ngModel)]="sellerData.storeName"
                  name="storeName"
                  [error]="sellerErrors.storeName"
                ></app-input>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <app-input
                    label="İletişim E-postası"
                    placeholder="shop@siren.com"
                    [(ngModel)]="sellerData.contactEmail"
                    name="contactEmail"
                    [error]="sellerErrors.contactEmail"
                  ></app-input>
                  <app-input
                    label="İletişim Telefonu"
                    placeholder="5xxxxxxxxx"
                    [(ngModel)]="sellerData.contactPhone"
                    name="contactPhone"
                    [error]="sellerErrors.contactPhone"
                  ></app-input>
                </div>

                <app-input
                  label="Müşteri Destek Hattı"
                  placeholder="E-posta Adresi veya Telefon Numarası"
                  [(ngModel)]="sellerData.supportLine"
                  name="supportLine"
                  [error]="sellerErrors.supportLine"
                ></app-input>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <app-input
                    label="Vergi Numarası"
                    placeholder="10 Haneli"
                    [(ngModel)]="sellerData.taxNumber"
                    name="taxNumber"
                    [error]="sellerErrors.taxNumber"
                  ></app-input>
                  <app-input
                    label="Vergi Dairesi"
                    placeholder="Vergi Dairesi Adı"
                    [(ngModel)]="sellerData.taxOffice"
                    name="taxOffice"
                    [error]="sellerErrors.taxOffice"
                  ></app-input>
                </div>

                <div class="pt-4">
                  <app-button type="submit" variant="primary" [disabled]="isLoading">
                    {{ isLoading ? 'Gönderiliyor...' : 'Satıcı Başvurusunu Gönder' }}
                  </app-button>
                </div>
              </form>
            </ng-template>

          </div>

          <!-- Tab 4: Değerlendirmelerim -->
          <div *ngIf="activeTab === 'comments'" class="space-y-6">
            <h3 class="text-lg font-bold text-zinc-950 dark:text-white uppercase tracking-wide border-b border-zinc-950/5 dark:border-white/5 pb-2.5 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5 text-zinc-400"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg> Değerlendirmelerim
            </h3>

            <!-- Loading Spinner -->
            <div *ngIf="loadingComments" class="text-center py-10">
              <div class="animate-spin inline-block w-6 h-6 border-2 border-zinc-900 border-t-transparent dark:border-white rounded-full"></div>
            </div>

            <div *ngIf="!loadingComments">
              <!-- Empty State -->
              <div *ngIf="myComments.length === 0" class="text-center py-12 space-y-3">
                <div class="w-12 h-12 bg-zinc-950/5 dark:bg-white/5 text-zinc-400 rounded-full flex items-center justify-center mx-auto">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                </div>
                <h4 class="text-sm font-semibold text-zinc-900 dark:text-white">Henüz Değerlendirme Yapmadınız</h4>
                <p class="text-xs text-zinc-500 dark:text-zinc-400 max-w-xs mx-auto leading-relaxed">
                  Satın aldığınız veya incelediğiniz ürünlere yorum yaparak diğer kullanıcılarla paylaşabilirsiniz.
                </p>
              </div>

              <!-- Comments List -->
              <div *ngIf="myComments.length > 0" class="space-y-4">
                <div *ngFor="let comment of myComments" class="flex gap-4 p-5 rounded-2xl bg-zinc-950/[0.01] dark:bg-white/[0.02] border border-zinc-950/5 dark:border-white/10 text-left">
                  <!-- Product Image -->
                  <a [routerLink]="'/product/' + comment.productId" class="shrink-0">
                    <img 
                      *ngIf="comment.productImageUrl" 
                      [src]="comment.productImageUrl" 
                      [alt]="comment.productName"
                      class="w-16 h-16 object-cover rounded-xl border border-zinc-950/5 dark:border-white/5 bg-zinc-100 dark:bg-zinc-800"
                    />
                    <div *ngIf="!comment.productImageUrl" class="w-16 h-16 bg-zinc-100 dark:bg-zinc-800 border border-zinc-950/5 dark:border-white/5 rounded-xl flex items-center justify-center text-zinc-400">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5"><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7"/><polyline points="16 5 21 5 21 10"/><line x1="12" y1="12" x2="21" y2="3"/></svg>
                    </div>
                  </a>

                  <!-- Details -->
                  <div class="flex-grow space-y-1">
                    <div class="flex items-start justify-between gap-4">
                      <div>
                        <a [routerLink]="'/product/' + comment.productId" class="text-sm font-bold text-zinc-950 dark:text-white hover:underline line-clamp-1">
                          {{ comment.productName }}
                        </a>
                        <!-- Rating stars -->
                        <div class="flex items-center gap-0.5 mt-0.5">
                          <svg 
                            *ngFor="let star of [1,2,3,4,5]" 
                            xmlns="http://www.w3.org/2000/svg" 
                            width="14" 
                            height="14" 
                            viewBox="0 0 24 24" 
                            [attr.fill]="star <= comment.rating ? 'currentColor' : 'none'" 
                            stroke="currentColor" 
                            stroke-width="2" 
                            stroke-linecap="round" 
                            stroke-linejoin="round" 
                            [class]="star <= comment.rating ? 'text-amber-500' : 'text-zinc-300 dark:text-zinc-600'"
                          >
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                          </svg>
                        </div>
                      </div>
                      
                      <!-- Delete Action -->
                      <button 
                        (click)="onDeleteComment(comment.id)"
                        class="text-zinc-400 hover:text-red-500 transition-colors p-1.5 rounded-lg hover:bg-red-500/10"
                        title="Değerlendirmeyi Sil"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                      </button>
                    </div>

                    <p class="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed pt-1.5 whitespace-pre-line">
                      {{ comment.text }}
                    </p>

                    <div class="text-[10px] text-zinc-400 dark:text-zinc-500 pt-1 flex items-center gap-1.5">
                      <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
                      {{ comment.creationDate | date:'dd.MM.yyyy HH:mm' }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </main>
      </div>

    </div>
  `
})
export class AccountComponent implements OnInit {
  activeTab: 'profile' | 'password' | 'seller' | 'comments' = 'profile';
  isLoading = false;
  loadingStatus = false;
  loadingComments = false;
  myComments: CommentDto[] = [];

  // Profile data
  profileData = {
    firstName: '',
    lastName: '',
    phoneNumber: ''
  };
  profileEmail = '';
  profileErrors = {
    firstName: '',
    lastName: '',
    phoneNumber: ''
  };

  // Password data
  passwordData = {
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  };
  passwordErrors = {
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  };

  // Seller application data
  sellerData = {
    storeName: '',
    contactEmail: '',
    contactPhone: '',
    supportLine: '',
    taxNumber: '',
    taxOffice: ''
  };
  sellerErrors = {
    storeName: '',
    contactEmail: '',
    contactPhone: '',
    supportLine: '',
    taxNumber: '',
    taxOffice: ''
  };
  sellerStatus: any = null;

  constructor(
    public authService: AuthService,
    private customerService: CustomerService,
    private sellerService: SellerService,
    private toastService: ToastService,
    private commentService: CommentService
  ) { }

  ngOnInit() {
    this.authService.profile$.subscribe(prof => {
      if (prof) {
        this.profileData.firstName = prof.firstName;
        this.profileData.lastName = prof.lastName;
        this.profileData.phoneNumber = prof.phoneNumber || '';
        this.profileEmail = prof.email;
      }
    });

    if (this.authService.user?.role !== 'Seller') {
      this.fetchSellerStatus();
    }
  }

  setActiveTab(tab: 'profile' | 'password' | 'seller' | 'comments') {
    this.activeTab = tab;
    if (tab === 'seller' && this.authService.user?.role !== 'Seller') {
      this.fetchSellerStatus();
    } else if (tab === 'comments') {
      this.fetchMyComments();
    }
  }

  async fetchMyComments() {
    this.loadingComments = true;
    try {
      this.myComments = await this.commentService.getMyComments();
    } catch (err: any) {
      this.toastService.showToast('Değerlendirmeleriniz yüklenemedi.', 'error');
      console.error(err);
    } finally {
      this.loadingComments = false;
    }
  }

  async onDeleteComment(commentId: number) {
    if (!confirm('Bu değerlendirmeyi silmek istediğinize emin misiniz?')) {
      return;
    }
    try {
      await this.commentService.delete(commentId);
      this.toastService.showToast('Değerlendirmeniz silindi.', 'success');
      await this.fetchMyComments();
    } catch (err: any) {
      this.toastService.showToast('Değerlendirme silinemedi.', 'error');
      console.error(err);
    }
  }

  async fetchSellerStatus() {
    this.loadingStatus = true;
    try {
      this.sellerStatus = await this.sellerService.getMyStatus();
    } catch (err) {
      console.error('Failed to get seller status', err);
    } finally {
      this.loadingStatus = false;
    }
  }

  // Update Profile Form submission
  async onUpdateProfile() {
    this.profileErrors.firstName = '';
    this.profileErrors.lastName = '';
    this.profileErrors.phoneNumber = '';

    let isValid = true;
    if (!this.profileData.firstName) {
      this.profileErrors.firstName = 'Ad alanı zorunludur.';
      isValid = false;
    }
    if (!this.profileData.lastName) {
      this.profileErrors.lastName = 'Soyad alanı zorunludur.';
      isValid = false;
    }
    if (!this.profileData.phoneNumber) {
      this.profileErrors.phoneNumber = 'Telefon numarası zorunludur.';
      isValid = false;
    } else if (!/^5\d{9}$/.test(this.profileData.phoneNumber)) {
      this.profileErrors.phoneNumber = 'Telefon numaranız 5 ile başlayan 10 haneli olmalıdır.';
      isValid = false;
    }

    if (!isValid) return;

    this.isLoading = true;
    try {
      await this.customerService.updateProfile({
        firstName: this.profileData.firstName,
        lastName: this.profileData.lastName,
        phoneNumber: this.profileData.phoneNumber || null
      });
      await this.authService.refreshProfile();
      this.toastService.showToast('Profil bilgileriniz başarıyla güncellendi.', 'success');
    } catch (err: any) {
      this.toastService.showToast(err.message || 'Profil güncellenemedi.', 'error');
    } finally {
      this.isLoading = false;
    }
  }

  // Change Password Form submission
  async onChangePassword() {
    this.passwordErrors.currentPassword = '';
    this.passwordErrors.newPassword = '';
    this.passwordErrors.confirmNewPassword = '';

    let isValid = true;
    if (!this.passwordData.currentPassword) {
      this.passwordErrors.currentPassword = 'Mevcut şifreniz zorunludur.';
      isValid = false;
    }
    if (!this.passwordData.newPassword) {
      this.passwordErrors.newPassword = 'Yeni şifreniz zorunludur.';
      isValid = false;
    } else if (this.passwordData.newPassword.length < 6) {
      this.passwordErrors.newPassword = 'Şifre en az 6 karakter olmalıdır.';
      isValid = false;
    }
    if (!this.passwordData.confirmNewPassword) {
      this.passwordErrors.confirmNewPassword = 'Şifre doğrulaması zorunludur.';
      isValid = false;
    } else if (this.passwordData.confirmNewPassword !== this.passwordData.newPassword) {
      this.passwordErrors.confirmNewPassword = 'Şifreler eşleşmiyor!';
      isValid = false;
    }

    if (!isValid) return;

    this.isLoading = true;
    try {
      await this.customerService.changePassword(this.passwordData);
      this.toastService.showToast('Şifreniz başarıyla değiştirildi.', 'success');
      this.passwordData = { currentPassword: '', newPassword: '', confirmNewPassword: '' };
    } catch (err: any) {
      this.toastService.showToast(err.message || 'Şifre değiştirilemedi.', 'error');
    } finally {
      this.isLoading = false;
    }
  }

  // Become Seller Form submission
  async onBecomeSeller() {
    this.sellerErrors.storeName = '';
    this.sellerErrors.contactEmail = '';
    this.sellerErrors.contactPhone = '';
    this.sellerErrors.supportLine = '';
    this.sellerErrors.taxNumber = '';
    this.sellerErrors.taxOffice = '';

    let isValid = true;
    if (!this.sellerData.storeName) {
      this.sellerErrors.storeName = 'Mağaza adı zorunludur.';
      isValid = false;
    }
    if (!this.sellerData.contactEmail) {
      this.sellerErrors.contactEmail = 'İletişim maili zorunludur.';
      isValid = false;
    }
    if (!this.sellerData.contactPhone) {
      this.sellerErrors.contactPhone = 'Telefon zorunludur.';
      isValid = false;
    }
    if (!this.sellerData.supportLine) {
      this.sellerErrors.supportLine = 'Müşteri destek hattı zorunludur.';
      isValid = false;
    }
    if (!this.sellerData.taxNumber) {
      this.sellerErrors.taxNumber = 'Vergi no zorunludur.';
      isValid = false;
    }
    if (!this.sellerData.taxOffice) {
      this.sellerErrors.taxOffice = 'Vergi dairesi zorunludur.';
      isValid = false;
    }

    if (!isValid) return;

    this.isLoading = true;
    try {
      await this.sellerService.becomeSeller(this.sellerData);
      this.toastService.showToast('Satıcı başvurunuz başarıyla alındı. Admin onayı bekleniyor.', 'success');
      await this.fetchSellerStatus();
      this.sellerData = { storeName: '', contactEmail: '', contactPhone: '', supportLine: '', taxNumber: '', taxOffice: '' };
    } catch (err: any) {
      this.toastService.showToast(err.message || 'Satıcı başvurusu tamamlanamadı.', 'error');
    } finally {
      this.isLoading = false;
    }
  }
}
