import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../hooks/useAuth';
import { customerService } from '../../services/customerService';
import { sellerService } from '../../services/sellerService';
import { useToast } from '../../context/ToastContext';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { User, Key, Store, ClipboardList, Info, ShieldAlert } from 'lucide-react';

export const Account: React.FC = () => {
  const { user, profile, refreshProfile } = useAuth();
  const { showToast } = useToast();
  
  const [activeTab, setActiveTab] = useState<'profile' | 'password' | 'seller'>('profile');
  const [isLoading, setIsLoading] = useState(false);

  // Seller application status
  const [sellerStatus, setSellerStatus] = useState<any>(null);
  const [loadingStatus, setLoadingStatus] = useState(false);

  const fetchSellerStatus = async () => {
    if (!user) return;
    setLoadingStatus(true);
    try {
      const data = await sellerService.getMyStatus();
      setSellerStatus(data);
    } catch (err: any) {
      console.error('Failed to get seller status', err);
    } finally {
      setLoadingStatus(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'seller' && user?.role !== 'Seller') {
      fetchSellerStatus();
    }
  }, [activeTab, user]);

  // Form hooks
  const profileForm = useForm({
    defaultValues: {
      firstName: profile?.firstName || '',
      lastName: profile?.lastName || '',
      phoneNumber: profile?.phoneNumber || '',
    },
  });

  const passwordForm = useForm({
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: '',
    },
  });

  const sellerForm = useForm({
    defaultValues: {
      storeName: '',
      contactEmail: '',
      contactPhone: '',
      supportLine: '',
      taxNumber: '',
      taxOffice: '',
    },
  });

  // Sync profile details when loaded
  useEffect(() => {
    if (profile) {
      profileForm.reset({
        firstName: profile.firstName,
        lastName: profile.lastName,
        phoneNumber: profile.phoneNumber || '',
      });
    }
  }, [profile]);

  const onUpdateProfile = async (data: any) => {
    setIsLoading(true);
    try {
      await customerService.updateProfile({
        firstName: data.firstName,
        lastName: data.lastName,
        phoneNumber: data.phoneNumber || null,
      });
      await refreshProfile();
      showToast('Profil bilgileriniz başarıyla güncellendi.', 'success');
    } catch (err: any) {
      showToast(err.message || 'Profil güncellenemedi.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const onChangePassword = async (data: any) => {
    setIsLoading(true);
    try {
      await customerService.changePassword(data);
      showToast('Şifreniz başarıyla değiştirildi.', 'success');
      passwordForm.reset();
    } catch (err: any) {
      showToast(err.message || 'Şifre değiştirilemedi.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const onBecomeSeller = async (data: any) => {
    setIsLoading(true);
    try {
      await sellerService.becomeSeller(data);
      showToast('Satıcı başvurunuz başarıyla alındı. Admin onayı bekleniyor.', 'success');
      await fetchSellerStatus();
      sellerForm.reset();
    } catch (err: any) {
      showToast(err.message || 'Satıcı başvurusu tamamlanamadı.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 space-y-8 text-left">
      
      {/* Header */}
      <div className="border-b border-zinc-950/5 dark:border-white/5 pb-6">
        <h1 className="text-4xl font-extrabold tracking-tight text-zinc-950 dark:text-white uppercase leading-none">
          Hesabım
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1.5">
          Kişisel bilgilerinizi, şifrenizi yönetin ve mağaza başvurularınızı inceleyin.
        </p>
      </div>

      {/* Tabs Layout */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Sidebar Navigation */}
        <nav className="md:col-span-1 flex flex-col gap-2">
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-semibold text-left transition-all ${
              activeTab === 'profile'
                ? 'bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 shadow-md'
                : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-950/5 dark:hover:bg-white/5'
            }`}
          >
            <User className="w-4 h-4" /> Profilim
          </button>
          
          <button
            onClick={() => setActiveTab('password')}
            className={`flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-semibold text-left transition-all ${
              activeTab === 'password'
                ? 'bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 shadow-md'
                : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-950/5 dark:hover:bg-white/5'
            }`}
          >
            <Key className="w-4 h-4" /> Şifre Değiştir
          </button>
          
          <button
            onClick={() => setActiveTab('seller')}
            className={`flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-semibold text-left transition-all ${
              activeTab === 'seller'
                ? 'bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 shadow-md'
                : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-950/5 dark:hover:bg-white/5'
            }`}
          >
            <Store className="w-4 h-4" /> Satıcı Paneli / Başvuru
          </button>
        </nav>

        {/* Tab Contents */}
        <main className="md:col-span-3 glass-surface bg-zinc-950/[0.01] dark:bg-white/5 border border-zinc-950/5 dark:border-white/10 p-8 rounded-3xl">
          
          {/* Tab 1: Profilim */}
          {activeTab === 'profile' && (
            <form onSubmit={profileForm.handleSubmit(onUpdateProfile)} className="space-y-6">
              <h3 className="text-lg font-bold text-zinc-950 dark:text-white uppercase tracking-wide border-b border-zinc-950/5 dark:border-white/5 pb-2.5 flex items-center gap-2">
                <User className="w-5 h-5 text-zinc-400" /> Profil Bilgileri
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Ad"
                  placeholder="Adınız"
                  error={profileForm.formState.errors.firstName?.message}
                  {...profileForm.register('firstName', { required: 'Ad alanı zorunludur.' })}
                />
                <Input
                  label="Soyad"
                  placeholder="Soyadınız"
                  error={profileForm.formState.errors.lastName?.message}
                  {...profileForm.register('lastName', { required: 'Soyad alanı zorunludur.' })}
                />
              </div>

              <Input
                label="E-posta Adresi (Değiştirilemez)"
                type="email"
                disabled
                value={profile?.email || ''}
                className="opacity-60 cursor-not-allowed bg-zinc-950/5 dark:bg-white/5"
              />

              <Input
                label="Telefon Numarası"
                placeholder="5xxxxxxxxx"
                error={profileForm.formState.errors.phoneNumber?.message}
                {...profileForm.register('phoneNumber', {
                  required: 'Telefon numarası zorunludur.',
                  pattern: {
                    value: /^5\d{9}$/,
                    message: 'Telefon numaranız 5 ile başlayan 10 haneli olmalıdır (Örn: 5XXXXXXXXX).',
                  },
                })}
              />

              <Button type="submit" variant="primary" disabled={isLoading}>
                {isLoading ? 'Güncelleniyor...' : 'Profilimi Güncelle'}
              </Button>
            </form>
          )}

          {/* Tab 2: Şifre Değiştir */}
          {activeTab === 'password' && (
            <form onSubmit={passwordForm.handleSubmit(onChangePassword)} className="space-y-6">
              <h3 className="text-lg font-bold text-zinc-950 dark:text-white uppercase tracking-wide border-b border-zinc-950/5 dark:border-white/5 pb-2.5 flex items-center gap-2">
                <Key className="w-5 h-5 text-zinc-400" /> Güvenlik & Şifre
              </h3>

              <Input
                label="Mevcut Şifre"
                type="password"
                placeholder="••••••••"
                error={passwordForm.formState.errors.currentPassword?.message}
                {...passwordForm.register('currentPassword', { required: 'Mevcut şifreniz zorunludur.' })}
              />

              <Input
                label="Yeni Şifre"
                type="password"
                placeholder="••••••••"
                error={passwordForm.formState.errors.newPassword?.message}
                {...passwordForm.register('newPassword', { 
                  required: 'Yeni şifreniz zorunludur.',
                  minLength: { value: 6, message: 'Şifre en az 6 karakter olmalıdır.' }
                })}
              />

              <Input
                label="Yeni Şifre Tekrar"
                type="password"
                placeholder="••••••••"
                error={passwordForm.formState.errors.confirmNewPassword?.message}
                {...passwordForm.register('confirmNewPassword', { 
                  required: 'Şifre doğrulaması zorunludur.',
                  validate: (value) => value === passwordForm.getValues('newPassword') || 'Şifreler eşleşmiyor!'
                })}
              />

              <Button type="submit" variant="primary" disabled={isLoading}>
                {isLoading ? 'Değiştiriliyor...' : 'Şifreyi Değiştir'}
              </Button>
            </form>
          )}

          {/* Tab 3: Satıcı Paneli / Başvuru */}
          {activeTab === 'seller' && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-zinc-950 dark:text-white uppercase tracking-wide border-b border-zinc-950/5 dark:border-white/5 pb-2.5 flex items-center gap-2">
                <Store className="w-5 h-5 text-zinc-400" /> Satıcı Durumu
              </h3>

              {user?.role === 'Seller' ? (
                /* User is already a Seller */
                <div className="space-y-4 text-center py-8">
                  <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Store className="w-6 h-6" />
                  </div>
                  <h4 className="text-base font-bold text-zinc-900 dark:text-white uppercase">Satıcı Profiliniz Aktif!</h4>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto leading-relaxed">
                    Mağazanız onaylanmıştır. Ürünlerinizi listelemek, yeni ürün eklemek ve siparişleri yönetmek için satıcı panelini kullanabilirsiniz.
                  </p>
                  <Button variant="primary" onClick={() => (window.location.href = '/seller')}>
                    Satıcı Paneline Git
                  </Button>
                </div>
              ) : loadingStatus ? (
                <div className="text-center py-10">
                  <div className="animate-spin inline-block w-6 h-6 border-2 border-zinc-900 border-t-transparent dark:border-white rounded-full" />
                </div>
              ) : sellerStatus?.hasApplied ? (
                /* Application exists */
                sellerStatus.status === 'Pending' ? (
                  <div className="flex gap-4 p-5 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-900/30 text-xs leading-relaxed">
                    <Info className="w-5 h-5 shrink-0" />
                    <div>
                      <strong className="block text-sm font-semibold uppercase mb-1">Başvurunuz Değerlendiriliyor</strong>
                      <strong>Mağaza Adı:</strong> {sellerStatus.storeName} <br />
                      <strong>Destek Hattı:</strong> {sellerStatus.supportLine} <br />
                      <strong>Vergi Dairesi/No:</strong> {sellerStatus.taxOffice} / {sellerStatus.taxNumber} <br />
                      <p className="mt-2 text-zinc-500 dark:text-zinc-400">Başvurunuz admin ekibi tarafından incelenmektedir. Onaylandıktan sonra otomatik olarak satıcı paneline erişiminiz açılacaktır.</p>
                    </div>
                  </div>
                ) : sellerStatus.status === 'Rejected' ? (
                  <div className="space-y-6">
                    <div className="flex gap-4 p-5 rounded-2xl bg-red-50/50 dark:bg-red-950/20 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-900/30 text-xs leading-relaxed">
                      <ShieldAlert className="w-5 h-5 shrink-0" />
                      <div>
                        <strong className="block text-sm font-semibold uppercase mb-1">Başvurunuz Reddedildi</strong>
                        Maalesef satıcı başvurunuz inceleme sonucunda reddedilmiştir. Bilgilerinizi kontrol ederek tekrar başvuru yapabilirsiniz.
                      </div>
                    </div>

                    <form onSubmit={sellerForm.handleSubmit(onBecomeSeller)} className="space-y-4 text-left">
                      <h4 className="text-sm font-bold uppercase tracking-wider text-zinc-400">Yeni Satıcı Başvurusu</h4>
                      
                      <Input
                        label="Mağaza / Dükkan Adı"
                        placeholder="Örn: Siren Butik"
                        error={sellerForm.formState.errors.storeName?.message}
                        {...sellerForm.register('storeName', { required: 'Mağaza adı zorunludur.' })}
                      />
                      
                      <div className="grid grid-cols-2 gap-4">
                        <Input
                          label="İletişim E-postası"
                          placeholder="shop@siren.com"
                          error={sellerForm.formState.errors.contactEmail?.message}
                          {...sellerForm.register('contactEmail', { required: 'İletişim maili zorunludur.' })}
                        />
                        <Input
                          label="İletişim Telefonu"
                          placeholder="5xxxxxxxxx"
                          error={sellerForm.formState.errors.contactPhone?.message}
                          {...sellerForm.register('contactPhone', { required: 'Telefon zorunludur.' })}
                        />
                      </div>

                      <Input
                        label="Müşteri Destek Hattı"
                        placeholder="0850xxxxxxx veya 0212xxxxxxx"
                        error={sellerForm.formState.errors.supportLine?.message}
                        {...sellerForm.register('supportLine', { required: 'Müşteri destek hattı zorunludur.' })}
                      />

                      <div className="grid grid-cols-2 gap-4">
                        <Input
                          label="Vergi Numarası"
                          placeholder="10 Haneli"
                          error={sellerForm.formState.errors.taxNumber?.message}
                          {...sellerForm.register('taxNumber', { required: 'Vergi no zorunludur.' })}
                        />
                        <Input
                          label="Vergi Dairesi"
                          placeholder="Vergi Dairesi Adı"
                          error={sellerForm.formState.errors.taxOffice?.message}
                          {...sellerForm.register('taxOffice', { required: 'Vergi dairesi zorunludur.' })}
                        />
                      </div>

                      <Button type="submit" variant="primary" disabled={isLoading}>
                        {isLoading ? 'Gönderiliyor...' : 'Satıcı Başvurusunu Gönder'}
                      </Button>
                    </form>
                  </div>
                ) : null
              ) : (
                /* No application yet - Render application form */
                <form onSubmit={sellerForm.handleSubmit(onBecomeSeller)} className="space-y-4 text-left">
                  <div className="p-4 rounded-xl bg-zinc-950/5 dark:bg-white/5 border border-zinc-950/5 dark:border-white/10 text-xs flex gap-2.5 text-zinc-500">
                    <ClipboardList className="w-5 h-5 shrink-0 text-zinc-400" />
                    <p className="leading-relaxed">
                      Siren Store platformunda kendi mağazanızı açarak ürünlerinizi satabilirsiniz. Başvurunuz onaylandığında profiliniz otomatik olarak <strong>Satıcı</strong> rolüne yükseltilecektir.
                    </p>
                  </div>

                  <Input
                    label="Mağaza / Dükkan Adı"
                    placeholder="Örn: Siren Butik"
                    error={sellerForm.formState.errors.storeName?.message}
                    {...sellerForm.register('storeName', { required: 'Mağaza adı zorunludur.' })}
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="İletişim E-postası"
                      placeholder="shop@siren.com"
                      error={sellerForm.formState.errors.contactEmail?.message}
                      {...sellerForm.register('contactEmail', { required: 'İletişim maili zorunludur.' })}
                    />
                    <Input
                      label="İletişim Telefonu"
                      placeholder="5xxxxxxxxx"
                      error={sellerForm.formState.errors.contactPhone?.message}
                      {...sellerForm.register('contactPhone', { required: 'Telefon zorunludur.' })}
                    />
                  </div>

                  <Input
                    label="Müşteri Destek Hattı"
                    placeholder="0850xxxxxxx veya 0212xxxxxxx"
                    error={sellerForm.formState.errors.supportLine?.message}
                    {...sellerForm.register('supportLine', { required: 'Müşteri destek hattı zorunludur.' })}
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Vergi Numarası"
                      placeholder="10 Haneli"
                      error={sellerForm.formState.errors.taxNumber?.message}
                      {...sellerForm.register('taxNumber', { required: 'Vergi no zorunludur.' })}
                    />
                    <Input
                      label="Vergi Dairesi"
                      placeholder="Vergi Dairesi Adı"
                      error={sellerForm.formState.errors.taxOffice?.message}
                      {...sellerForm.register('taxOffice', { required: 'Vergi dairesi zorunludur.' })}
                    />
                  </div>

                  <Button type="submit" variant="primary" disabled={isLoading} className="mt-2">
                    {isLoading ? 'Gönderiliyor...' : 'Satıcı Başvurusunu Gönder'}
                  </Button>
                </form>
              )}

            </div>
          )}

        </main>
      </div>

    </div>
  );
};
