import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="max-w-3xl mx-auto px-6 py-16 space-y-12">
      <!-- Header -->
      <div class="space-y-4 text-center">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-surface bg-zinc-950/[0.03] dark:bg-white/5 border border-zinc-950/10 dark:border-white/10 text-xs font-semibold tracking-wide text-zinc-600 dark:text-zinc-300">
          Hikayemiz
        </div>
        <h1 class="text-4xl sm:text-5xl font-extrabold tracking-tight text-zinc-950 dark:text-white uppercase">
          SIRENSTORE Hakkında
        </h1>
        <p class="text-zinc-500 dark:text-zinc-400 max-w-xl mx-auto text-base">
          Sade çizgiler, yüksek performans ve premium e-ticaret deneyimi.
        </p>
      </div>

      <!-- Main Content -->
      <div class="glass-surface bg-zinc-950/[0.01] dark:bg-white/5 border border-zinc-950/5 dark:border-white/10 rounded-3xl p-8 sm:p-10 space-y-8">
        <section class="space-y-4">
          <h2 class="text-xl font-bold text-zinc-950 dark:text-white uppercase tracking-tight">Biz Kimiz?</h2>
          <p class="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
            SIRENSTORE, modern alışveriş deneyimini yeniden tanımlamak amacıyla kurulmuş yenilikçi bir e-ticaret platformudur. Tasarımda sadeliği, performansta ise kusursuzluğu ön planda tutarak kullanıcılarımıza hızlı ve güvenilir bir alışveriş dünyası sunuyoruz.
          </p>
        </section>

        <section class="space-y-4">
          <h2 class="text-xl font-bold text-zinc-950 dark:text-white uppercase tracking-tight">Vizyonumuz</h2>
          <p class="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
            Karmaşadan uzak, göz yormayan ve tamamen ürüne odaklanan bir arayüz ile alışverişi bir yük olmaktan çıkarıp premium bir deneyime dönüştürmek. Teknolojinin en son imkanlarını kullanarak hızlı, güvenli ve estetik bir altyapı sunuyoruz.
          </p>
        </section>

        <section class="space-y-4">
          <h2 class="text-xl font-bold text-zinc-950 dark:text-white uppercase tracking-tight">Değerlerimiz</h2>
          <ul class="space-y-3 text-sm text-zinc-600 dark:text-zinc-300">
            <li class="flex items-start gap-2">
              <span class="font-bold text-zinc-950 dark:text-white">•</span>
              <span><strong>Sadelik:</strong> Gereksiz hiçbir görsel veya teknik karmaşıklığa yer vermeden alışverişi kolaylaştırıyoruz.</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="font-bold text-zinc-950 dark:text-white">•</span>
              <span><strong>Güvenilirlik:</strong> Kullanıcı verilerini en üst düzey şifreleme standartlarıyla koruyoruz.</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="font-bold text-zinc-950 dark:text-white">•</span>
              <span><strong>Destek:</strong> Satıcılarımız ve alıcılarımız için 7/24 kesintisiz destek sunuyoruz.</span>
            </li>
          </ul>
        </section>
      </div>

      <!-- Action Button -->
      <div class="text-center pt-4">
        <a routerLink="/products" class="inline-flex items-center justify-center px-6 py-3 rounded-full bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 font-bold text-sm hover:opacity-90 transition-opacity">
          Alışverişe Başla
        </a>
      </div>
    </div>
  `
})
export class AboutComponent {}
