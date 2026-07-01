import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductListDto, CommentDto } from '../../models/api.types';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { ToastService } from '../../services/toast.service';
import { CommentService } from '../../services/comment.service';
import { AuthService } from '../../services/auth.service';
import { SellerService } from '../../services/seller.service';
import { ButtonComponent } from '../../components/button/button.component';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { SkeletonComponent } from '../../components/skeleton/skeleton.component';
import { FormatPricePipe } from '../../pipes/format-price.pipe';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    FormsModule,
    ButtonComponent,
    ProductCardComponent,
    SkeletonComponent,
    FormatPricePipe
  ],
  template: `
    <div class="max-w-7xl mx-auto px-6 py-10 space-y-16 text-left">
      
      <!-- Back Button -->
      <div>
        <a 
          routerLink="/products"
          class="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-zinc-950 dark:hover:text-white transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4"><path d="m15 18-6-6 6-6"/></svg> Kataloğa Dön
        </a>
      </div>

      <div *ngIf="isLoading; else contentLoaded" class="animate-pulse space-y-8">
        <app-skeleton className="h-6 w-32 mb-4"></app-skeleton>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-10">
          <app-skeleton className="aspect-square w-full rounded-2xl"></app-skeleton>
          <div class="space-y-6">
            <app-skeleton className="h-4 w-20"></app-skeleton>
            <app-skeleton className="h-8 w-3/4"></app-skeleton>
            <app-skeleton className="h-4 w-1/4"></app-skeleton>
            <app-skeleton className="h-6 w-1/3"></app-skeleton>
            <app-skeleton className="h-20 w-full"></app-skeleton>
            <app-skeleton className="h-12 w-full rounded-full"></app-skeleton>
          </div>
        </div>
      </div>

      <ng-template #contentLoaded>
        <div *ngIf="product; else noProduct" class="grid grid-cols-1 md:grid-cols-2 gap-12">
          
          <!-- Left Column: Image Gallery -->
          <div class="space-y-4">
            <div class="aspect-square w-full overflow-hidden rounded-2xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-950/5 dark:border-white/10 relative">
              <img
                [src]="selectedImage || defaultPlaceholder"
                [alt]="product.name"
                class="h-full w-full object-cover object-center transition-all duration-300"
              />
              <div *ngIf="product.stock === 0" class="absolute inset-0 bg-zinc-950/60 backdrop-blur-sm flex items-center justify-center">
                <span class="text-white text-base font-bold tracking-wide uppercase px-4 py-2 border border-white/20 rounded-full">
                  Stokta Yok
                </span>
              </div>
            </div>

            <!-- Thumbnails list -->
            <div *ngIf="allImages.length > 1" class="flex gap-3 overflow-x-auto pb-2">
              <button
                *ngFor="let imgUrl of allImages; let index = index"
                (click)="selectedImage = imgUrl"
                [class]="'relative w-20 h-20 rounded-xl overflow-hidden shrink-0 border-2 transition-all ' + 
                  (selectedImage === imgUrl 
                    ? 'border-zinc-950 dark:border-white' 
                    : 'border-transparent opacity-65 hover:opacity-100')"
              >
                <img [src]="imgUrl" [alt]="'Resim ' + (index + 1)" class="w-full h-full object-cover" />
              </button>
            </div>
          </div>

          <!-- Right Column: Product details -->
          <div class="flex flex-col space-y-6">
            <div class="space-y-2">
              <div class="flex items-center justify-between">
                <span class="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
                  Mağaza: 
                  <a [routerLink]="['/store', product.sellerId]" class="hover:underline text-zinc-900 dark:text-zinc-300 font-bold transition-all normal-case">
                    {{ product.storeName }}
                  </a>
                </span>
                <span class="text-xs bg-zinc-950/5 dark:bg-white/5 border border-zinc-950/5 dark:border-white/10 px-3 py-1 rounded-full text-zinc-500 dark:text-zinc-400 font-medium">
                  {{ product.categoryName }}
                </span>
              </div>
              
              <h1 class="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-950 dark:text-white uppercase leading-none">
                {{ product.name }}
              </h1>
            </div>

            <!-- Pricing -->
            <div class="text-3xl font-extrabold text-zinc-950 dark:text-white">
              {{ product.price | formatPrice }}
            </div>

            <!-- Description -->
            <p class="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed whitespace-pre-wrap">
              {{ product.description }}
            </p>

            <!-- Specifications Box -->
            <div class="grid grid-cols-3 gap-4 py-4 border-y border-zinc-950/5 dark:border-white/5 text-center text-xs">
              <div class="flex flex-col items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-zinc-400"><rect width="16" height="13" x="2" y="6" rx="2"/><path d="M16 8h4l3 3v7a2 2 0 0 1-2 2h-1"/><path d="M3 18h1"/><path d="M18 18h1"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="14.5" cy="18.5" r="2.5"/></svg>
                <span class="font-semibold text-zinc-900 dark:text-white">Hızlı Kargo</span>
                <span class="text-zinc-400">24-48 Saat</span>
              </div>
              <div class="flex flex-col items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-zinc-400"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                <span class="font-semibold text-zinc-900 dark:text-white">Güvenilir Satıcı</span>
                <span class="text-zinc-400">Onaylı Mağaza</span>
              </div>
              <div class="flex flex-col items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-zinc-400"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
                <span class="font-semibold text-zinc-900 dark:text-white">İade Garantisi</span>
                <span class="text-zinc-400">14 Gün Kolay</span>
              </div>
            </div>

            <!-- Action Row: Count and Add to Cart -->
            <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              
              <!-- Quantity Counter -->
              <div class="flex items-center justify-between border border-zinc-300 dark:border-zinc-800 rounded-full px-4 py-3 sm:w-36 bg-zinc-950/[0.01] dark:bg-white/[0.01]">
                <button 
                  (click)="handleDecrement()"
                  [disabled]="product.stock === 0 || quantity <= 1"
                  class="text-zinc-400 hover:text-zinc-950 dark:hover:text-white disabled:opacity-30"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4"><path d="M5 12h14"/></svg>
                </button>
                <span class="text-sm font-bold text-zinc-900 dark:text-white select-none">
                  {{ product.stock === 0 ? 0 : quantity }}
                </span>
                <button 
                  (click)="handleIncrement()"
                  [disabled]="product.stock === 0 || quantity >= product.stock"
                  class="text-zinc-400 hover:text-zinc-950 dark:hover:text-white disabled:opacity-30"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
                </button>
              </div>

              <!-- Add to Cart CTA -->
              <app-button
                (click)="handleAddToCart()"
                [disabled]="product.stock === 0 || isAdding"
                variant="primary"
                size="lg"
                className="flex-grow group shadow-lg"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5 mr-2"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
                {{ isAdding ? 'Sepete Ekleniyor...' : 'Sepete Ekle' }}
              </app-button>

            </div>

            <!-- Stock Info tag -->
            <div class="text-xs font-semibold text-zinc-500">
              <span *ngIf="product.stock > 0; else outOfStock">
                <span>Bilgi: Mağaza Stoğunda <strong class="text-zinc-800 dark:text-zinc-200">{{ product.stock }} adet</strong> mevcut</span>
              </span>
              <ng-template #outOfStock>
                <span class="text-red-500 font-bold">Stokta Kalmadı!</span>
              </ng-template>
            </div>

          </div>

        </div>

        <!-- Comments Section -->
        <div class="border-t border-zinc-950/5 dark:border-white/5 pt-12 space-y-8">
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 class="text-2xl font-bold tracking-tight text-zinc-950 dark:text-white uppercase flex items-center gap-2">
                Değerlendirmeler & Yorumlar
                <span *ngIf="comments.length > 0" class="text-sm bg-zinc-950/5 dark:bg-white/5 text-zinc-500 px-2.5 py-0.5 rounded-full font-medium">
                  {{ comments.length }}
                </span>
              </h2>
              <p class="text-xs text-zinc-500">Bu ürün hakkında alıcılar tarafından yapılan yorumlar.</p>
            </div>

            <!-- Summary Rating Badge -->
            <div *ngIf="comments.length > 0" class="flex items-center gap-3 bg-zinc-950/[0.02] dark:bg-white/[0.02] border border-zinc-950/5 dark:border-white/10 px-4 py-2.5 rounded-2xl w-fit">
              <div class="flex items-center text-amber-500">
                <span class="text-2xl font-black mr-2">{{ averageRating }}</span>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5"><path fill-rule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clip-rule="evenodd" /></svg>
              </div>
              <div class="text-left">
                <div class="text-xs font-semibold text-zinc-800 dark:text-zinc-200">Ortalama Puan</div>
                <div class="text-[10px] text-zinc-500">{{ comments.length }} değerlendirme</div>
              </div>
            </div>
          </div>

          <!-- Yorum Ekleme Formu -->
          <div class="glass-surface bg-zinc-950/[0.01] dark:bg-white/5 border border-zinc-950/5 dark:border-white/10 p-6 rounded-3xl space-y-4">
            <h3 class="text-sm font-bold uppercase tracking-wider text-zinc-950 dark:text-white">
              Değerlendirme Yazın
            </h3>

            <!-- If Not Logged In -->
            <div *ngIf="!authService.isAuthenticated" class="text-center py-4 bg-zinc-950/[0.02] dark:bg-white/[0.02] border border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl">
              <p class="text-xs text-zinc-500 mb-3">Bu ürüne yorum yapabilmek için üye girişi yapmanız gerekmektedir.</p>
              <a routerLink="/login" class="inline-block">
                <app-button variant="primary" size="sm">Giriş Yap</app-button>
              </a>
            </div>

            <!-- If Logged In -->
            <div *ngIf="authService.isAuthenticated" class="space-y-4 text-left">
              <!-- If User is the Seller/Owner of this product -->
              <div *ngIf="isProductOwner" class="text-center py-4 bg-zinc-950/[0.02] dark:bg-white/[0.02] border border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl">
                <p class="text-xs text-zinc-500 font-semibold">Kendi sattığınız ürüne değerlendirme yazamazsınız.</p>
              </div>

              <!-- If User is NOT the Seller/Owner -->
              <ng-container *ngIf="!isProductOwner">
                <ng-container *ngIf="isEligibleToComment; else notEligible">
                  <div class="flex items-center gap-2">
                    <span class="text-xs font-semibold text-zinc-500 mr-2">Ürün Puanı:</span>
                    <div class="flex items-center gap-1 text-zinc-300 dark:text-zinc-755 text-zinc-400">
                      <button 
                        *ngFor="let star of [1,2,3,4,5]" 
                        (click)="newCommentRating = star"
                        type="button"
                        class="transition-colors hover:scale-110 focus:outline-none"
                        [class.text-amber-500]="newCommentRating >= star"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6"><path fill-rule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clip-rule="evenodd" /></svg>
                      </button>
                    </div>
                    <span class="text-xs font-bold text-zinc-900 dark:text-zinc-100 ml-2">({{ newCommentRating }} / 5)</span>
                  </div>

                  <div class="space-y-1">
                    <textarea 
                      [(ngModel)]="newCommentText" 
                      rows="3" 
                      placeholder="Ürün hakkındaki görüşlerinizi, deneyimlerinizi buraya yazın..."
                      class="w-full text-sm bg-zinc-950/[0.02] dark:bg-zinc-950/20 text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-500 border border-zinc-300 dark:border-zinc-800 focus:border-zinc-950 dark:focus:border-white focus:ring-0 rounded-2xl p-4 transition-all resize-none focus:outline-none"
                    ></textarea>
                  </div>

                  <div class="flex justify-end">
                    <app-button 
                      (click)="submitComment()"
                      [disabled]="isSubmittingComment || !newCommentText.trim()"
                      variant="primary"
                      size="sm"
                    >
                      {{ isSubmittingComment ? 'Yorumunuz İletiliyor...' : 'Yorum Yap' }}
                    </app-button>
                  </div>
                </ng-container>

                <ng-template #notEligible>
                  <div class="text-center py-6 bg-zinc-950/[0.02] dark:bg-white/[0.02] border border-dashed border-zinc-200 dark:border-white/10 rounded-2xl p-4">
                    <p class="text-xs text-zinc-500 dark:text-zinc-400 font-semibold leading-relaxed">
                      Bu ürüne yorum yapabilmek için ürünü satın almış olmanız ve siparişinizin teslim edilmiş olması gerekmektedir.
                    </p>
                  </div>
                </ng-template>
              </ng-container>
            </div>
          </div>

          <!-- Yorumlar Listesi -->
          <div *ngIf="commentsLoading" class="flex justify-center py-10">
            <div class="animate-spin inline-block w-6 h-6 border-2 border-zinc-900 border-t-transparent dark:border-white rounded-full"></div>
          </div>

          <div *ngIf="!commentsLoading && comments.length === 0" class="text-center py-12 bg-zinc-950/[0.01] dark:bg-white/[0.01] border border-zinc-950/5 dark:border-white/5 rounded-3xl">
            <p class="text-xs font-medium text-zinc-500">Bu ürün için henüz yorum yapılmamış. İlk yorumu siz yapın!</p>
          </div>

          <div *ngIf="!commentsLoading && comments.length > 0" class="space-y-4">
            <div 
              *ngFor="let comment of comments" 
              class="border-b border-zinc-950/5 dark:border-white/5 pb-4 last:border-b-0 space-y-2 text-left"
            >
              <div class="flex items-start justify-between gap-4">
                <div class="space-y-1">
                  <div class="flex items-center gap-2">
                    <span class="text-xs font-bold text-zinc-950 dark:text-white">{{ comment.userFullName }}</span>
                    <!-- Star Rating display -->
                    <div class="flex items-center text-amber-500">
                      <svg 
                        *ngFor="let star of getStarsArray(comment.rating)" 
                        xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-3.5 h-3.5"
                      >
                        <path fill-rule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clip-rule="evenodd" />
                      </svg>
                      <svg 
                        *ngFor="let star of getEmptyStarsArray(comment.rating)" 
                        xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-3.5 h-3.5 text-zinc-300 dark:text-zinc-700"
                      >
                        <path stroke-linecap="round" stroke-linejoin="round" d="M11.48 3.499c.173-.439.821-.439.993 0l3.181 3.183a.75.75 0 00.56.56l3.183 3.181c.439.173.439.821 0 .993l-3.181 3.182a.75.75 0 00-.56.56l-3.183 3.182a.75.75 0 00-.993 0l-3.183-3.182a.75.75 0 00-.56-.56l-3.182-3.182c-.439-.173-.439-.821 0-.993l3.182-3.182a.75.75 0 00.56-.56l3.182-3.182z" />
                      </svg>
                    </div>
                  </div>
                  <span class="block text-[10px] text-zinc-400 dark:text-zinc-500">
                    {{ comment.creationDate | date:'dd.MM.yyyy HH:mm' }}
                  </span>
                </div>

                <!-- Comment Action Buttons (Edit / Delete) -->
                <div *ngIf="isCommentAuthor(comment) || isAdmin()" class="flex items-center gap-2">
                  <button 
                    *ngIf="isCommentAuthor(comment) && editingCommentId !== comment.id"
                    (click)="startEditComment(comment)"
                    class="text-xs font-semibold text-zinc-500 hover:text-zinc-950 dark:hover:text-white transition-colors"
                  >
                    Düzenle
                  </button>
                  <button 
                    (click)="deleteComment(comment.id)"
                    class="text-xs font-semibold text-red-500 hover:text-red-600 transition-colors"
                  >
                    Sil
                  </button>
                </div>
              </div>

              <!-- Comment edit form (Inline) -->
              <div *ngIf="editingCommentId === comment.id" class="space-y-3 pt-2">
                <div class="flex items-center gap-2">
                  <span class="text-xs font-semibold text-zinc-500 mr-2">Yeni Puan:</span>
                  <div class="flex items-center gap-1 text-zinc-300 dark:text-zinc-700">
                    <button 
                      *ngFor="let star of [1,2,3,4,5]" 
                      (click)="editingCommentRating = star"
                      type="button"
                      class="transition-colors hover:scale-110 focus:outline-none"
                      [class.text-amber-500]="editingCommentRating >= star"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5"><path fill-rule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clip-rule="evenodd" /></svg>
                    </button>
                  </div>
                </div>
                <textarea 
                  [(ngModel)]="editingCommentText" 
                  rows="2" 
                  class="w-full text-sm bg-zinc-950/[0.02] dark:bg-zinc-950/20 text-zinc-900 dark:text-white border border-zinc-300 dark:border-zinc-800 focus:border-zinc-950 dark:focus:border-white focus:ring-0 rounded-2xl p-4 transition-all resize-none focus:outline-none"
                ></textarea>
                <div class="flex justify-end gap-2">
                  <app-button 
                    (click)="cancelEditComment()"
                    variant="secondary"
                    size="sm"
                  >
                    Vazgeç
                  </app-button>
                  <app-button 
                    (click)="saveEditComment()"
                    [disabled]="!editingCommentText.trim()"
                    variant="primary"
                    size="sm"
                  >
                    Güncelle
                  </app-button>
                </div>
              </div>

              <!-- Comment Text (Standard view) -->
              <p *ngIf="editingCommentId !== comment.id" class="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed font-medium">
                {{ comment.text }}
              </p>
            </div>
          </div>

        </div>

        <ng-template #noProduct>
          <div class="text-center py-20">
            <p class="text-zinc-500 font-medium text-lg">Ürün bulunamadı.</p>
            <a routerLink="/products" class="mt-4 inline-flex items-center text-sm font-bold text-zinc-950 dark:text-white underline">
              Kataloğa Dön
            </a>
          </div>
        </ng-template>

        <!-- Similar products Section -->
        <div *ngIf="similarProducts.length > 0" class="border-t border-zinc-950/5 dark:border-white/5 pt-12 space-y-6">
          <div>
            <h2 class="text-2xl font-bold tracking-tight text-zinc-950 dark:text-white uppercase">
              Benzer Ürünler
            </h2>
            <p class="text-xs text-zinc-500">Aynı kategorideki diğer popüler ürünler.</p>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            <app-product-card
              *ngFor="let p of similarProducts"
              [product]="p"
              (added)="onSimilarProductAdded(p.name)"
              (error)="onSimilarProductError($event)"
            ></app-product-card>
          </div>
        </div>
      </ng-template>
      
    </div>
  `
})
export class ProductDetailComponent implements OnInit {
  product: ProductListDto | null = null;
  similarProducts: ProductListDto[] = [];
  selectedImage = '';
  quantity = 1;
  isLoading = true;
  isAdding = false;

  // Comments state
  comments: CommentDto[] = [];
  commentsLoading = false;
  newCommentText = '';
  newCommentRating = 5;
  isSubmittingComment = false;
  editingCommentId: number | null = null;
  editingCommentText = '';
  editingCommentRating = 5;
  averageRating = 0;
  isProductOwner = false;
  isEligibleToComment = false;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService,
    private toastService: ToastService,
    public commentService: CommentService,
    public authService: AuthService,
    private sellerService: SellerService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.loadProductData(parseInt(id, 10));
      }
    });
  }

  async loadProductData(prodId: number) {
    this.isLoading = true;
    try {
      const data = await this.productService.getById(prodId);
      this.product = data;
      
      const fallbackImage = `https://placehold.co/600x600/0a0a0a/fafafa?text=${encodeURIComponent(data.name)}`;
      this.selectedImage = data.mainImageUrl || data.imageUrls[0] || fallbackImage;
      this.quantity = 1;

      // Load similar products in the same category
      const similar = await this.productService.getByCategoryId(data.categoryId);
      this.similarProducts = similar.filter((p) => p.id !== data.id).slice(0, 4);

      // Load comments
      await this.loadComments(prodId);

      // Check product ownership
      await this.checkOwnership();

      // Check commenting eligibility
      await this.checkCommentEligibility(prodId);
    } catch (err: any) {
      this.toastService.showToast(err.message || 'Ürün yüklenirken bir hata oluştu.', 'error');
    } finally {
      this.isLoading = false;
    }
  }

  async checkOwnership() {
    this.isProductOwner = false;
    if (!this.product || !this.authService.isAuthenticated || this.authService.user?.role !== 'Seller') {
      return;
    }
    try {
      const status = await this.sellerService.getMyStatus();
      if (status && status.hasApplied && status.id === this.product.sellerId) {
        this.isProductOwner = true;
      }
    } catch (err) {
      console.error('Kullanıcı satıcı bilgileri yüklenemedi', err);
    }
  }

  async checkCommentEligibility(prodId: number) {
    this.isEligibleToComment = false;
    if (!this.authService.isAuthenticated) {
      return;
    }
    try {
      const res = await this.commentService.checkEligibility(prodId);
      this.isEligibleToComment = res.isEligible;
    } catch (err) {
      console.error('Yorum yapabilme uygunluğu kontrol edilemedi', err);
    }
  }

  async loadComments(prodId: number) {
    this.commentsLoading = true;
    try {
      this.comments = await this.commentService.getByProductId(prodId);
      this.calculateAverageRating();
    } catch (err: any) {
      this.toastService.showToast(err.message || 'Yorumlar yüklenirken bir hata oluştu.', 'error');
    } finally {
      this.commentsLoading = false;
    }
  }

  calculateAverageRating() {
    if (this.comments.length === 0) {
      this.averageRating = 0;
      return;
    }
    const sum = this.comments.reduce((acc, c) => acc + c.rating, 0);
    this.averageRating = parseFloat((sum / this.comments.length).toFixed(1));
  }

  async submitComment() {
    if (!this.product) return;
    if (!this.newCommentText.trim()) {
      this.toastService.showToast('Yorum metni boş olamaz.', 'error');
      return;
    }
    this.isSubmittingComment = true;
    try {
      await this.commentService.create({
        productId: this.product.id,
        text: this.newCommentText,
        rating: this.newCommentRating
      });
      this.toastService.showToast('Yorumunuz başarıyla eklendi.', 'success');
      this.newCommentText = '';
      this.newCommentRating = 5;
      await this.loadComments(this.product.id);
      await this.checkCommentEligibility(this.product.id);
    } catch (err: any) {
      this.toastService.showToast(err.message || 'Yorum gönderilirken bir hata oluştu.', 'error');
    } finally {
      this.isSubmittingComment = false;
    }
  }

  startEditComment(comment: CommentDto) {
    this.editingCommentId = comment.id;
    this.editingCommentText = comment.text;
    this.editingCommentRating = comment.rating;
  }

  cancelEditComment() {
    this.editingCommentId = null;
    this.editingCommentText = '';
    this.editingCommentRating = 5;
  }

  async saveEditComment() {
    if (!this.product || !this.editingCommentId) return;
    if (!this.editingCommentText.trim()) {
      this.toastService.showToast('Yorum metni boş olamaz.', 'error');
      return;
    }
    try {
      await this.commentService.update(this.editingCommentId, {
        text: this.editingCommentText,
        rating: this.editingCommentRating
      });
      this.toastService.showToast('Yorumunuz başarıyla güncellendi.', 'success');
      this.cancelEditComment();
      await this.loadComments(this.product.id);
    } catch (err: any) {
      this.toastService.showToast(err.message || 'Yorum güncellenirken bir hata oluştu.', 'error');
    }
  }

  async deleteComment(commentId: number) {
    if (!this.product) return;
    if (confirm('Yorumunuzu silmek istediğinize emin misiniz?')) {
      try {
        await this.commentService.delete(commentId);
        this.toastService.showToast('Yorumunuz silindi.', 'success');
        await this.loadComments(this.product.id);
        await this.checkCommentEligibility(this.product.id);
      } catch (err: any) {
        this.toastService.showToast(err.message || 'Yorum silinirken bir hata oluştu.', 'error');
      }
    }
  }

  getStarsArray(rating: number): number[] {
    return Array(rating).fill(0);
  }

  getEmptyStarsArray(rating: number): number[] {
    return Array(5 - rating).fill(0);
  }

  isCommentAuthor(comment: CommentDto): boolean {
    return this.authService.user?.id === comment.userId;
  }

  isAdmin(): boolean {
    return this.authService.user?.role === 'Admin' || this.authService.user?.role === 'SuperAdmin';
  }

  get defaultPlaceholder(): string {
    return this.product ? `https://placehold.co/600x600/0a0a0a/fafafa?text=${encodeURIComponent(this.product.name)}` : '';
  }

  get allImages(): string[] {
    if (!this.product) return [];
    return Array.from(new Set([
      this.product.mainImageUrl, 
      ...(this.product.imageUrls || [])
    ])).filter(Boolean) as string[];
  }

  handleIncrement() {
    if (!this.product) return;
    if (this.quantity < this.product.stock) {
      this.quantity++;
    } else {
      this.toastService.showToast('Mağaza stok limitine ulaştınız.', 'info');
    }
  }

  handleDecrement() {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  async handleAddToCart() {
    if (!this.product) return;
    this.isAdding = true;
    try {
      await this.cartService.addToCart(this.product.id, this.quantity);
      this.toastService.showToast(`${this.quantity} adet ${this.product.name} sepetinize eklendi.`, 'success');
    } catch (err: any) {
      this.toastService.showToast(err.message || 'Ürün sepete eklenemedi.', 'error');
    } finally {
      this.isAdding = false;
    }
  }

  onSimilarProductAdded(productName: string) {
    this.toastService.showToast(`${productName} sepete eklendi!`, 'success');
  }

  onSimilarProductError(errorMsg: string) {
    this.toastService.showToast(errorMsg, 'error');
  }
}
