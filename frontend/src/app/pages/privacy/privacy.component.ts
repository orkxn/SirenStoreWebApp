import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-privacy',
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
          Gizlilik Sözleşmesi
        </h1>
        <p class="text-zinc-500 dark:text-zinc-400 max-w-xl mx-auto text-base">
          Verilerinizin güvenliği bizim için en öncelikli konudur.
        </p>
      </div>

      <!-- Main Content -->
      <div class="glass-surface bg-zinc-950/[0.01] dark:bg-white/5 border border-zinc-950/5 dark:border-white/10 rounded-3xl p-8 sm:p-10 space-y-8 text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
        <section class="space-y-3">
          <h2 class="text-lg font-bold text-zinc-950 dark:text-white uppercase tracking-tight">1. Toplanan Veriler</h2>
          <p>
            Kayıt olurken ve alışveriş yaparken bize sağladığınız ad, soyad, e-posta adresi, fatura ve teslimat adresi ile telefon numarası gibi kişisel verileriniz sistemlerimizde güvenle saklanır. Kredi kartı bilgileriniz hiçbir şekilde sunucularımızda saklanmaz veya kaydedilmez.
          </p>
        </section>

        <section class="space-y-3">
          <h2 class="text-lg font-bold text-zinc-950 dark:text-white uppercase tracking-tight">2. Verilerin Kullanım Amacı</h2>
          <p>
            Toplanan veriler; siparişlerinizin sorunsuz teslim edilmesi, hesap güvenliğinizin sağlanması, şifre sıfırlama işlemlerinin yapılması ve gerektiğinde müşteri desteği sunulabilmesi amacıyla işlenir.
          </p>
        </section>

        <section class="space-y-3">
          <h2 class="text-lg font-bold text-zinc-950 dark:text-white uppercase tracking-tight">3. Çerezler (Cookies)</h2>
          <p>
            Sitemizin kullanıcı deneyimini artırmak, oturumunuzu açık tutmak ve sepet bilgilerinizi tarayıcı yenilendiğinde korumak amacıyla temel çerezler kullanılmaktadır. Tarayıcı ayarlarınızdan çerezleri dilediğiniz zaman devre dışı bırakabilirsiniz.
          </p>
        </section>

        <section class="space-y-3">
          <h2 class="text-lg font-bold text-zinc-950 dark:text-white uppercase tracking-tight">4. Veri Paylaşımı</h2>
          <p>
            Kişisel verileriniz, yasal zorunluluklar haricinde hiçbir üçüncü şahıs veya reklam şirketiyle ticari amaçlarla paylaşılmaz. Yalnızca teslimat işlemleri için kargo firmasıyla adres ve telefon bilginiz paylaşılmaktadır.
          </p>
        </section>

        <section class="space-y-3">
          <h2 class="text-lg font-bold text-zinc-950 dark:text-white uppercase tracking-tight">5. Kullanıcı Hakları</h2>
          <p>
            KVKK kapsamında, dilediğiniz zaman sistemlerimizde kayıtlı olan kişisel verilerinizin silinmesini, güncellenmesini veya düzeltilmesini talep etme hakkınız saklıdır.
          </p>
        </section>
      </div>
    </div>
  `
})
export class PrivacyComponent {}
