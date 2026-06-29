import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { sellerService } from '../../services/sellerService';
import { SellerPublicProfileDto } from '../../types/api.types';
import { useToast } from '../../context/ToastContext';
import { ProductCard } from '../../components/ProductCard';
import { Skeleton } from '../../components/Skeleton';
import { ChevronLeft, Store, User, Phone } from 'lucide-react';

export const StoreDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { showToast } = useToast();
  
  const [profile, setProfile] = useState<SellerPublicProfileDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStoreProfile = async () => {
      if (!id) return;
      setIsLoading(true);
      try {
        const sellerId = parseInt(id, 10);
        const data = await sellerService.getSellerProfile(sellerId);
        setProfile(data);
      } catch (err: any) {
        showToast(err.message || 'Mağaza bilgileri yüklenirken bir hata oluştu.', 'error');
      } finally {
        setIsLoading(false);
      }
    };

    fetchStoreProfile();
  }, [id]);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-10 space-y-8 animate-pulse text-left">
        <Skeleton className="h-6 w-32 mb-4" />
        <div className="glass-surface bg-zinc-950/[0.02] dark:bg-white/5 border border-zinc-950/5 dark:border-white/10 p-8 rounded-3xl flex gap-6 items-center">
          <Skeleton className="w-20 h-20 rounded-2xl" />
          <div className="space-y-3 flex-grow">
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-4 w-1/3" />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          <Skeleton className="h-80 w-full rounded-2xl" />
          <Skeleton className="h-80 w-full rounded-2xl" />
          <Skeleton className="h-80 w-full rounded-2xl" />
          <Skeleton className="h-80 w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-20 text-center">
        <p className="text-zinc-500 font-medium text-lg">Mağaza bulunamadı.</p>
        <Link to="/products" className="mt-4 inline-flex items-center text-sm font-bold text-zinc-950 dark:text-white underline">
          Kataloğa Dön
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-12 text-left">
      
      {/* Back Button */}
      <div>
        <Link 
          to="/products"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-zinc-950 dark:hover:text-white transition-colors"
        >
          <ChevronLeft className="w-4 h-4" /> Kataloğa Dön
        </Link>
      </div>

      {/* Store Header Card */}
      <div className="glass-surface bg-zinc-950/[0.02] dark:bg-white/5 border border-zinc-950/5 dark:border-white/10 p-8 rounded-3xl shadow-lg flex flex-col md:flex-row gap-6 items-start md:items-center">
        {profile.storeLogoUrl ? (
          <img 
            src={profile.storeLogoUrl} 
            alt={profile.storeName} 
            className="w-20 h-20 rounded-2xl border border-zinc-950/10 dark:border-white/10 object-cover shrink-0" 
          />
        ) : (
          <div className="w-20 h-20 rounded-2xl bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 flex items-center justify-center shrink-0">
            <Store className="w-10 h-10" />
          </div>
        )}
        
        <div className="space-y-2 flex-grow">
          <h1 className="text-3xl font-extrabold tracking-tight text-zinc-950 dark:text-white uppercase leading-none">
            {profile.storeName}
          </h1>
          
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-zinc-500 dark:text-zinc-400">
            <span className="flex items-center gap-1.5">
              <User className="w-4 h-4 text-zinc-400" />
              <strong>Mağaza Sahibi:</strong> {profile.ownerFullName}
            </span>
            {profile.contactLine && (
              <span className="flex items-center gap-1.5">
                <Phone className="w-4 h-4 text-zinc-400" />
                <strong>Müşteri Destek Hattı:</strong> {profile.contactLine}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Store Products List */}
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-zinc-950 dark:text-white uppercase">
            Mağazanın Ürünleri
          </h2>
          <p className="text-xs text-zinc-500">Bu mağaza tarafından listelenen tüm ürünler.</p>
        </div>

        {profile.products.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-3xl">
            <p className="text-zinc-500 font-medium">Bu mağazaya ait henüz ürün bulunmamaktadır.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {profile.products.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                onAdded={() => showToast(`${p.name} sepete eklendi!`, 'success')}
              />
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
