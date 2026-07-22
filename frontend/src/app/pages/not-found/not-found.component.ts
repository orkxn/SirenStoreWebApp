import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="min-h-[70vh] flex items-center justify-center px-6 py-16">
      <div class="max-w-md w-full text-center space-y-6">
        <div class="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-zinc-950/5 dark:bg-white/5 border border-zinc-950/10 dark:border-white/10 text-3xl font-black text-zinc-950 dark:text-white">
          404
        </div>
        <div class="space-y-2">
          <h1 class="text-2xl sm:text-3xl font-extrabold text-zinc-950 dark:text-white tracking-tight uppercase">
            Sayfa Bulunamadı
          </h1>
          <p class="text-sm text-zinc-500 dark:text-zinc-400">
            Aradığınız sayfa mevcut değil, kaldırılmış veya erişim izniniz bulunmuyor olabilir.
          </p>
        </div>
        <div>
          <a routerLink="/" class="inline-flex items-center justify-center px-6 py-3 rounded-full bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 font-bold text-sm hover:opacity-90 transition-opacity">
            Ana Sayfaya Dön
          </a>
        </div>
      </div>
    </div>
  `
})
export class NotFoundComponent {}
