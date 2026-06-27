import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { productService } from '../../services/productService';
import { ProductListDto } from '../../types/api.types';
import { useToast } from '../../context/ToastContext';
import { ProductCard } from '../../components/ProductCard';
import { Marquee } from '../../components/Marquee';
import { Button } from '../../components/Button';
import { ProductGridSkeleton } from '../../components/Skeleton';
import { ArrowRight, Sparkles, TrendingUp, ShieldCheck, Truck } from 'lucide-react';
import { motion } from 'framer-motion';

export const Home: React.FC = () => {
  const [products, setProducts] = useState<ProductListDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const allProducts = await productService.getAll();
        // Take first 4 as featured
        setProducts(allProducts.slice(0, 4));
      } catch (err: any) {
        showToast(err.message || 'Ürünler yüklenirken bir hata oluştu.', 'error');
      } finally {
        setIsLoading(false);
      }
    };
    fetchFeaturedProducts();
  }, []);

  return (
    <div className="space-y-20 pb-20">
      
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[85vh] flex flex-col items-center justify-center px-6 text-center overflow-hidden">
        {/* Background Decorative Gradient Grid */}
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl space-y-6"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass-surface bg-zinc-950/[0.03] dark:bg-white/5 border border-zinc-950/10 dark:border-white/10 text-xs font-semibold tracking-wide text-zinc-600 dark:text-zinc-300">
            <Sparkles className="w-3.5 h-3.5" /> Yeni Sezon Ürünleri
          </div>
          
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-none text-zinc-950 dark:text-white uppercase">
            EN YENİ <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-400 via-zinc-200 to-zinc-500 dark:from-zinc-100 dark:via-zinc-500 dark:to-zinc-300">
              TRENDLERİ KEŞFET
            </span>
          </h1>
          
          <p className="max-w-2xl mx-auto text-base sm:text-lg text-zinc-500 dark:text-zinc-400 font-normal leading-relaxed">
            Geniş ürün yelpazemiz ve kaliteli hizmet anlayışımızla en iyi alışveriş deneyimini keşfedin.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link to="/products">
              <Button variant="primary" size="lg" className="group">
                Alışverişe Başla
                <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link to="/products?category=7">
              <Button variant="glass" size="lg">
                Moda Koleksiyonu
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* 2. INFINITE SCROLLING MARQUEE BANNER */}
      <section className="-mx-6">
        <Marquee speed="medium">
          <span className="text-sm font-bold uppercase tracking-widest mx-4 flex items-center gap-3">
            <Sparkles className="w-4 h-4" /> SIREN EXCLUSIVE
          </span>
          <span className="text-sm font-bold uppercase tracking-widest mx-4 flex items-center gap-3">
            <TrendingUp className="w-4 h-4" /> TREND ÜRÜNLER
          </span>
          <span className="text-sm font-bold uppercase tracking-widest mx-4 flex items-center gap-3">
            <ShieldCheck className="w-4 h-4" /> PREMIUM QUALITY
          </span>
          <span className="text-sm font-bold uppercase tracking-widest mx-4 flex items-center gap-3">
            <Truck className="w-4 h-4" /> FAST SHIPPING
          </span>
          <span className="text-sm font-bold uppercase tracking-widest mx-4 flex items-center gap-3">
            <Sparkles className="w-4 h-4" /> GÜVENLİ ALIŞVERİŞ
          </span>
        </Marquee>
      </section>

      {/* 3. FEATURED PRODUCTS GRID */}
      <section className="max-w-7xl mx-auto px-6 text-left space-y-8">
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-zinc-950 dark:text-white uppercase">
              ÖNE ÇIKANLAR
            </h2>
            <p className="text-sm text-zinc-500 mt-1">En çok tercih edilen modellerimiz.</p>
          </div>
          <Link to="/products" className="text-sm font-bold text-zinc-950 dark:text-white hover:underline flex items-center gap-1">
            Tümünü Gör <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {isLoading ? (
          <ProductGridSkeleton count={4} />
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAdded={() => showToast(`${product.name} sepete eklendi!`, 'success')}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 border border-dashed border-zinc-300 dark:border-zinc-800 rounded-2xl">
            <p className="text-zinc-500">Henüz ürün eklenmemiş.</p>
          </div>
        )}
      </section>

      {/* 4. CATEGORY SHOWCASE */}
      <section className="max-w-7xl mx-auto px-6 text-left space-y-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-zinc-950 dark:text-white uppercase">
            KATEGORİLER
          </h2>
          <p className="text-sm text-zinc-500 mt-1">Stilinize uygun kategoriyi seçin.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { id: 1, name: 'Giyim & Stil', desc: 'Her tarza ve mevsime uygun en şık giyim koleksiyonları.', image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop' },
            { id: 2, name: 'Elektronik', desc: 'Hayatınızı kolaylaştıracak en yeni teknolojik aletler ve aksesuarlar.', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800&auto=format&fit=crop' },
            { id: 3, name: 'Ev & Yaşam', desc: 'Evinize şıklık katacak en güzel mobilya ve dekorasyon ürünleri.', image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=800&auto=format&fit=crop' }
          ].map((cat) => (
            <Link 
              key={cat.id} 
              to={`/products?category=${cat.id}`}
              className="group relative h-80 rounded-2xl overflow-hidden glass-surface border border-zinc-950/5 dark:border-white/10 flex flex-col justify-end p-6 transition-all duration-500 hover:scale-[1.01]"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/90 via-zinc-950/40 to-transparent z-10" />
              <img 
                src={cat.image} 
                alt={cat.name} 
                className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
              />
              <div className="relative z-20 space-y-2">
                <h3 className="text-xl font-bold text-white uppercase tracking-wide">
                  {cat.name}
                </h3>
                <p className="text-xs text-zinc-300 leading-relaxed font-normal">
                  {cat.desc}
                </p>
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-white pt-2 group-hover:underline">
                  Keşfet <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 5. PROMOTION MARQUEE BAND */}
      <section className="-mx-6">
        <Marquee speed="slow" reverse={true}>
          <span className="text-sm font-bold tracking-widest mx-4 uppercase">
            ₺1.500 ÜZERİ SİPARİŞLERDE ÜCRETSİZ KARGO
          </span>
          <span className="text-sm font-bold tracking-widest mx-4 uppercase">
            VADE FARKSIZ 3 TAKSİT İMKANI
          </span>
          <span className="text-sm font-bold tracking-widest mx-4 uppercase">
            KOLAY VE HIZLI İADE
          </span>
          <span className="text-sm font-bold tracking-widest mx-4 uppercase">
            GÜVENLİ ÖDEME ALTYAPISI
          </span>
        </Marquee>
      </section>

      {/* 6. TESTIMONIALS */}
      <section className="max-w-7xl mx-auto px-6 text-left space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-950 dark:text-white uppercase">
            Müşteri Deneyimleri
          </h2>
          <p className="text-sm text-zinc-500">Siren Store topluluğunun paylaşımları.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { user: 'Buse T.', comment: 'Siparişim ertesi gün kargoya verildi. Mat siyah kulaklıkların ses kalitesi ve performansı muazzam!', rating: '★★★★★' },
            { user: 'Can K.', comment: 'Sitenin karanlık teması ve gezinme kolaylığı harika. Aldığım vazo salonuma çok yakıştı.', rating: '★★★★★' },
            { user: 'Selin A.', comment: 'Sepete ekleme ve ödeme adımları çok akıcıydı. Paketleme o kadar özenli ve premium ki hayran kaldım.', rating: '★★★★★' }
          ].map((t, idx) => (
            <div 
              key={idx} 
              className="p-6 rounded-2xl glass-surface bg-zinc-950/[0.01] dark:bg-white/5 border border-zinc-950/5 dark:border-white/10 space-y-4"
            >
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-zinc-950 dark:text-white">{t.user}</span>
                <span className="text-xs text-zinc-900 dark:text-zinc-100 font-serif tracking-wider">{t.rating}</span>
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 italic leading-relaxed">
                "{t.comment}"
              </p>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};
