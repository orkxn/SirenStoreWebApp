import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <footer class="bg-zinc-50 dark:bg-zinc-950/20 border-t border-zinc-950/5 dark:border-white/10 text-zinc-500 dark:text-zinc-400 py-12 transition-colors duration-300 mt-auto">
      <div class="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10 text-left text-sm">
        <!-- Brand Info -->
        <div class="flex flex-col gap-4">
          <a routerLink="/" class="flex items-center gap-2">
            <span class="text-xl font-bold tracking-tighter text-zinc-950 dark:text-white">SIREN</span>
            <span class="text-xl font-bold tracking-tighter uppercase px-2.5 py-0.5 bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 rounded-full">STORE</span>
          </a>
          <p class="text-xs text-zinc-400 dark:text-zinc-500 leading-relaxed">
            Güvenli ve yüksek performansa sahip modern alışveriş deneyimi. Yeni nesil e-ticaret platformu.
          </p>
        </div>

        <!-- Quick Links -->
        <div>
          <h4 class="font-semibold text-zinc-950 dark:text-white mb-4 uppercase tracking-wider text-xs">Kategoriler</h4>
          <ul class="space-y-2.5 text-xs">
            <li><a routerLink="/products" class="hover:text-zinc-950 dark:hover:text-white transition-colors">Tüm Ürünler</a></li>
            <li><a routerLink="/products" [queryParams]="{category: 1}" class="hover:text-zinc-950 dark:hover:text-white transition-colors">Moda & Giyim</a></li>
            <li><a routerLink="/products" [queryParams]="{category: 2}" class="hover:text-zinc-950 dark:hover:text-white transition-colors">Elektronik</a></li>
            <li><a routerLink="/products" [queryParams]="{category: 3}" class="hover:text-zinc-950 dark:hover:text-white transition-colors">Ev & Yaşam</a></li>
          </ul>
        </div>

        <!-- Corporate Links -->
        <div>
          <h4 class="font-semibold text-zinc-950 dark:text-white mb-4 uppercase tracking-wider text-xs">Kurumsal</h4>
          <ul class="space-y-2.5 text-xs">
            <li><span class="hover:text-zinc-950 dark:hover:text-white transition-colors cursor-pointer">Hakkımızda</span></li>
            <li><span class="hover:text-zinc-950 dark:hover:text-white transition-colors cursor-pointer">Kullanım Koşulları</span></li>
            <li><span class="hover:text-zinc-950 dark:hover:text-white transition-colors cursor-pointer">Gizlilik Sözleşmesi</span></li>
            <li><span class="hover:text-zinc-950 dark:hover:text-white transition-colors cursor-pointer">Satıcı Olmak İstiyorum</span></li>
          </ul>
        </div>

        <!-- Contact info -->
        <div>
          <h4 class="font-semibold text-zinc-950 dark:text-white mb-4 uppercase tracking-wider text-xs">İletişim & Destek</h4>
          <ul class="space-y-2.5 text-xs text-zinc-400 dark:text-zinc-500">
            <li>E-posta: <span class="text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white transition-colors cursor-pointer">support&#64;sirenstore.com</span></li>
            <li>Destek Hattı: <span class="text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white transition-colors cursor-pointer">+90 850 555 00 11</span></li>
            <li>Çalışma Saatleri: 7/24 Destek</li>
          </ul>
        </div>
      </div>

      <div class="max-w-7xl mx-auto px-6 border-t border-zinc-950/5 dark:border-white/5 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center text-xs text-zinc-400 dark:text-zinc-500 gap-4">
        <div>&copy; {{ currentYear }} SIREN Store. Tüm hakları saklıdır.</div>
        <div class="flex gap-6">
          <span class="hover:text-zinc-950 dark:hover:text-white transition-colors cursor-pointer">KVKK Aydınlatma Metni</span>
          <span class="hover:text-zinc-950 dark:hover:text-white transition-colors cursor-pointer">Çerez Politikası</span>
        </div>
      </div>
    </footer>
  `
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
}
