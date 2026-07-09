import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-terms',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="max-w-3xl mx-auto px-6 py-16 space-y-12">
      <!-- Header -->
      <div class="space-y-4 text-center">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-surface bg-zinc-950/[0.03] dark:bg-white/5 border border-zinc-950/10 dark:border-white/10 text-xs font-semibold tracking-wide text-zinc-600 dark:text-zinc-300">
          Sözleşmeler
        </div>
        <h1 class="text-4xl sm:text-5xl font-extrabold tracking-tight text-zinc-950 dark:text-white uppercase">
          Kullanım Koşulları
        </h1>
        <p class="text-zinc-500 dark:text-zinc-400 max-w-xl mx-auto text-base">
          Lütfen sitemizi kullanmadan önce bu kullanım koşullarını dikkatlice okuyunuz.
        </p>
      </div>

      <!-- Main Content -->
      <div class="glass-surface bg-zinc-950/[0.01] dark:bg-white/5 border border-zinc-950/5 dark:border-white/10 rounded-3xl p-8 sm:p-10 space-y-8 text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
        <section class="space-y-3">
          <h2 class="text-lg font-bold text-zinc-950 dark:text-white uppercase tracking-tight">1. Kabul Edilme ve Giriş</h2>
          <p>
            Bu web sitesini (SIRENSTORE) ziyaret ederek veya kullanarak, bu koşulların tamamını kabul etmiş sayılırsınız. Eğer bu koşullardan herhangi birini kabul etmiyorsanız, lütfen siteyi kullanmaya devam etmeyiniz.
          </p>
        </section>

        <section class="space-y-3">
          <h2 class="text-lg font-bold text-zinc-950 dark:text-white uppercase tracking-tight">2. Hizmet ve İçerik Kullanımı</h2>
          <p>
            SIRENSTORE, kullanıcılara ürün listeleme, satın alma ve satıcı hesabı oluşturma gibi e-ticaret altyapı hizmetleri sunar. Sitede yer alan tüm tasarım, kod, logo ve içerik hakları SIRENSTORE'a aittir ve izinsiz kopyalanamaz, çoğaltılamaz.
          </p>
        </section>

        <section class="space-y-3">
          <h2 class="text-lg font-bold text-zinc-950 dark:text-white uppercase tracking-tight">3. Üyelik ve Hesap Güvenliği</h2>
          <p>
            Kullanıcılar kayıt olurken doğru ve güncel bilgiler vermekle yükümlüdür. Şifre ve hesap bilgilerinin güvenliği tamamen kullanıcının sorumluluğundadır. Hesabınızın yetkisiz kişilerce kullanıldığını fark ederseniz derhal bizimle iletişime geçmelisiniz.
          </p>
        </section>

        <section class="space-y-3">
          <h2 class="text-lg font-bold text-zinc-950 dark:text-white uppercase tracking-tight">4. Alıcı ve Satıcı Sorumlulukları</h2>
          <p>
            Satıcılar, yükledikleri ürünlerin yasallığından ve doğruluğundan sorumludur. Alıcılar ise sipariş esnasında doğru teslimat ve fatura adresi girmekle yükümlüdür. SIRENSTORE, alıcı ve satıcı arasındaki uyuşmazlıklarda arabulucu rol üstlenebilir fakat yasal doğrudan sorumluluk kabul etmez.
          </p>
        </section>

        <section class="space-y-3">
          <h2 class="text-lg font-bold text-zinc-950 dark:text-white uppercase tracking-tight">5. Değişiklikler</h2>
          <p>
            SIRENSTORE, bu kullanım koşullarını dilediği zaman güncelleme veya değiştirme hakkını saklı tutar. Değişiklikler sitede yayınlandığı andan itibaren geçerlilik kazanır.
          </p>
        </section>
      </div>
    </div>
  `
})
export class TermsComponent {}
