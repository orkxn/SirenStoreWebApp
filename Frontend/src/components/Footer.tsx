import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-zinc-50 dark:bg-zinc-950/20 border-t border-zinc-950/5 dark:border-white/10 text-zinc-500 dark:text-zinc-400 py-12 transition-colors duration-300 mt-auto">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10 text-left text-sm">
        
        {/* Brand Info */}
        <div className="flex flex-col gap-4">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-xl font-bold tracking-tighter text-zinc-950 dark:text-white">
              SIREN
            </span>
            <span className="text-[9px] uppercase font-mono px-2 py-0.5 bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 rounded-full">
              Store
            </span>
          </Link>
          <p className="text-xs text-zinc-400 dark:text-zinc-500 leading-relaxed">
            Monokrom estetik ve yüksek performansa sahip modern alışveriş deneyimi. Yeni nesil e-ticaret platformu.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-semibold text-zinc-950 dark:text-white mb-4 uppercase tracking-wider text-xs">
            Kategoriler
          </h4>
          <ul className="space-y-2.5 text-xs">
            <li>
              <Link to="/products" className="hover:text-zinc-950 dark:hover:text-white transition-colors">Tüm Ürünler</Link>
            </li>
            <li>
              <Link to="/products?category=1" className="hover:text-zinc-950 dark:hover:text-white transition-colors">Moda & Giyim</Link>
            </li>
            <li>
              <Link to="/products?category=2" className="hover:text-zinc-950 dark:hover:text-white transition-colors">Elektronik</Link>
            </li>
            <li>
              <Link to="/products?category=3" className="hover:text-zinc-950 dark:hover:text-white transition-colors">Ev & Yaşam</Link>
            </li>
          </ul>
        </div>

        {/* Corporate Links */}
        <div>
          <h4 className="font-semibold text-zinc-950 dark:text-white mb-4 uppercase tracking-wider text-xs">
            Kurumsal
          </h4>
          <ul className="space-y-2.5 text-xs">
            <li>
              <span className="hover:text-zinc-950 dark:hover:text-white transition-colors cursor-pointer">Hakkımızda</span>
            </li>
            <li>
              <span className="hover:text-zinc-950 dark:hover:text-white transition-colors cursor-pointer">Kullanım Koşulları</span>
            </li>
            <li>
              <span className="hover:text-zinc-950 dark:hover:text-white transition-colors cursor-pointer">Gizlilik Sözleşmesi</span>
            </li>
            <li>
              <span className="hover:text-zinc-950 dark:hover:text-white transition-colors cursor-pointer">Satıcı Olmak İstiyorum</span>
            </li>
          </ul>
        </div>

        {/* Contact info */}
        <div>
          <h4 className="font-semibold text-zinc-950 dark:text-white mb-4 uppercase tracking-wider text-xs">
            İletişim & Destek
          </h4>
          <ul className="space-y-2.5 text-xs text-zinc-400 dark:text-zinc-500">
            <li>
              E-posta:{' '}
              <span className="text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white transition-colors cursor-pointer">
                support@sirenstore.com
              </span>
            </li>
            <li>
              Destek Hattı:{' '}
              <span className="text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white transition-colors cursor-pointer">
                +90 850 555 00 11
              </span>
            </li>
            <li>Çalışma Saatleri: 7/24 Destek</li>
          </ul>
        </div>

      </div>

      <div className="max-w-7xl mx-auto px-6 border-t border-zinc-950/5 dark:border-white/5 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center text-xs text-zinc-400 dark:text-zinc-500 gap-4">
        <div>
          &copy; {currentYear} SIREN Store. Tüm hakları saklıdır.
        </div>
        <div className="flex gap-6">
          <span className="hover:text-zinc-950 dark:hover:text-white transition-colors cursor-pointer">KVKK Aydınlatma Metni</span>
          <span className="hover:text-zinc-950 dark:hover:text-white transition-colors cursor-pointer">Çerez Politikası</span>
        </div>
      </div>
    </footer>
  );
};
