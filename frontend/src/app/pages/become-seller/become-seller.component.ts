import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-become-seller',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="max-w-3xl mx-auto px-6 py-16 space-y-12">
      <!-- Header -->
      <div class="space-y-4 text-center">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-surface bg-zinc-950/[0.03] dark:bg-white/5 border border-zinc-950/10 dark:border-white/10 text-xs font-semibold tracking-wide text-zinc-600 dark:text-zinc-300">
          Satış Ortaklığı
        </div>
        <h1 class="text-4xl sm:text-5xl font-extrabold tracking-tight text-zinc-950 dark:text-white uppercase">
          SIRENSTORE'da Satıcı Olun
        </h1>
        <p class="text-zinc-500 dark:text-zinc-400 max-w-xl mx-auto text-base">
          Kendi mağazanızı kurun, ürünlerinizi yükleyin ve binlerce alıcıya hemen ulaşın.
        </p>
      </div>

      <!-- Features grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="glass-surface bg-zinc-950/[0.01] dark:bg-white/5 border border-zinc-950/5 dark:border-white/10 rounded-2xl p-6 space-y-3">
          <div class="w-10 h-10 rounded-xl bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 flex items-center justify-center font-bold text-lg">1</div>
          <h3 class="font-bold text-zinc-950 dark:text-white uppercase text-sm">Hızlı Mağaza Açılışı</h3>
          <p class="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
            Karmaşık belgelerle uğraşmadan, hesap panelinizden tek tıkla mağaza adınızı ve e-postanızı girerek başvurunuzu yapın.
          </p>
        </div>

        <div class="glass-surface bg-zinc-950/[0.01] dark:bg-white/5 border border-zinc-950/5 dark:border-white/10 rounded-2xl p-6 space-y-3">
          <div class="w-10 h-10 rounded-xl bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 flex items-center justify-center font-bold text-lg">2</div>
          <h3 class="font-bold text-zinc-950 dark:text-white uppercase text-sm">%0 Komisyon Avantajı</h3>
          <p class="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
            SIRENSTORE üzerinde yaptığınız satışlardan komisyon alınmaz. Kazancınız doğrudan sizin olur.
          </p>
        </div>

        <div class="glass-surface bg-zinc-950/[0.01] dark:bg-white/5 border border-zinc-950/5 dark:border-white/10 rounded-2xl p-6 space-y-3">
          <div class="w-10 h-10 rounded-xl bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 flex items-center justify-center font-bold text-lg">3</div>
          <h3 class="font-bold text-zinc-950 dark:text-white uppercase text-sm">Modern Satıcı Paneli</h3>
          <p class="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
            Stoklarınızı güncelleyin, ürünlerinizi listeleyin ve tüm sipariş süreçlerini gelişmiş panelimizden anlık takip edin.
          </p>
        </div>

        <div class="glass-surface bg-zinc-950/[0.01] dark:bg-white/5 border border-zinc-950/5 dark:border-white/10 rounded-2xl p-6 space-y-3">
          <div class="w-10 h-10 rounded-xl bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 flex items-center justify-center font-bold text-lg">4</div>
          <h3 class="font-bold text-zinc-950 dark:text-white uppercase text-sm">Güvenli Altyapı</h3>
          <p class="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
            Sipariş ve ödeme süreçlerinizi güvence altına alan gelişmiş şifreleme ve denetim loglama (audit logs) sistemleri.
          </p>
        </div>
      </div>

      <!-- Steps to apply -->
      <div class="glass-surface bg-zinc-950/[0.01] dark:bg-white/5 border border-zinc-950/5 dark:border-white/10 rounded-3xl p-8 sm:p-10 space-y-6">
        <h2 class="text-xl font-bold text-zinc-950 dark:text-white uppercase tracking-tight">Nasıl Başvurulur?</h2>
        <div class="space-y-4 text-sm text-zinc-600 dark:text-zinc-300">
          <p><strong>Adım 1:</strong> Üye girişi yapın. Üye değilseniz hızlıca yeni bir hesap oluşturun.</p>
          <p><strong>Adım 2:</strong> Sağ üst köşeden profilinize giderek <strong>Hesabım</strong> sayfasına geçin.</p>
          <p><strong>Adım 3:</strong> Hesabım sayfasında yer alan <strong>"Satıcı Başvurusu"</strong> formunu doldurarak gönderin.</p>
          <p><strong>Adım 4:</strong> Yönetici (Admin) onayından sonra mağazanız anında aktif edilecek ve satıcı paneliniz açılacaktır.</p>
        </div>
      </div>

      <!-- Action Button -->
      <div class="text-center pt-4">
        <a routerLink="/account" class="inline-flex items-center justify-center px-6 py-3 rounded-full bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 font-bold text-sm hover:opacity-90 transition-opacity">
          Şimdi Mağaza Başvurusu Yap
        </a>
      </div>
    </div>
  `
})
export class BecomeSellerComponent {}
