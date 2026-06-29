import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { adminService } from '../../services/adminService';
import { sellerService } from '../../services/sellerService';
import { categoryService } from '../../services/categoryService';
import { SellerManagementDto, UserManagementDto, CategoryDto, SellerStatus, UserTypes } from '../../types/api.types';
import { useToast } from '../../context/ToastContext';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { Users, Store, FolderHeart, Ban, CheckCircle, XCircle, Plus, Edit3, Trash2 } from 'lucide-react';

export const AdminPanel: React.FC = () => {
  const { showToast } = useToast();
  
  const [activeTab, setActiveTab] = useState<'users' | 'sellers' | 'categories'>('users');
  const [users, setUsers] = useState<UserManagementDto[]>([]);
  const [sellers, setSellers] = useState<SellerManagementDto[]>([]);
  const [categories, setCategories] = useState<CategoryDto[]>([]);
  
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);
  
  const [editCategory, setEditCategory] = useState<CategoryDto | null>(null);

  const loadAdminData = async () => {
    setIsLoading(true);
    try {
      const [userData, sellerData, catData] = await Promise.all([
        adminService.getAllUsers(),
        adminService.getAllSellers(),
        categoryService.getAll()
      ]);
      setUsers(userData);
      setSellers(sellerData);
      setCategories(catData);
    } catch (err: any) {
      showToast(err.message || 'Yönetici verileri yüklenemedi.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  // Category form hook
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      categoryName: ''
    }
  });

  const handleBanUser = async (id: number) => {
    if (!confirm('Bu kullanıcıyı banlamak istediğinize emin misiniz?')) return;
    try {
      await adminService.banUser(id);
      showToast('Kullanıcı başarıyla banlandı. Sisteme giriş yapamaz.', 'success');
      loadAdminData();
    } catch (err: any) {
      showToast(err.message || 'Kullanıcı banlanamadı.', 'error');
    }
  };

  const handleUnbanUser = async (id: number) => {
    try {
      await adminService.unbanUser(id);
      showToast('Kullanıcı banı başarıyla kaldırıldı.', 'success');
      loadAdminData();
    } catch (err: any) {
      showToast(err.message || 'Ban kaldırma başarısız.', 'error');
    }
  };

  const handleApproveSeller = async (id: number) => {
    try {
      await sellerService.approveSeller(id);
      showToast('Satıcı başvurusu onaylandı ve rolü satıcı olarak yükseltildi.', 'success');
      loadAdminData();
    } catch (err: any) {
      showToast(err.message || 'Satıcı onaylanamadı.', 'error');
    }
  };

  const handleRejectSeller = async (id: number) => {
    try {
      await sellerService.rejectSeller(id);
      showToast('Satıcı başvurusu reddedildi.', 'success');
      loadAdminData();
    } catch (err: any) {
      showToast(err.message || 'Satıcı reddedilemedi.', 'error');
    }
  };

  const handleEditCategoryClick = (cat: CategoryDto) => {
    setEditCategory(cat);
    reset({ categoryName: cat.name });
  };

  const handleDeleteCategory = async (id: number) => {
    if (!confirm('Bu kategoriyi silmek istediğinize emin misiniz? (Soft delete)')) return;
    try {
      await categoryService.delete(id);
      showToast('Kategori başarıyla silindi.', 'success');
      loadAdminData();
    } catch (err: any) {
      showToast(err.message || 'Kategori silinemedi.', 'error');
    }
  };

  const onCategorySubmit = async (data: any) => {
    setIsSubmitLoading(true);
    try {
      if (editCategory) {
        await categoryService.update(editCategory.id, { name: data.categoryName });
        showToast('Kategori başarıyla güncellendi.', 'success');
      } else {
        await categoryService.create({ name: data.categoryName });
        showToast('Kategori başarıyla eklendi.', 'success');
      }
      setEditCategory(null);
      reset();
      loadAdminData();
    } catch (err: any) {
      showToast(err.message || 'İşlem gerçekleştirilemedi.', 'error');
    } finally {
      setIsSubmitLoading(false);
    }
  };

  const getUserTypeBadge = (type: UserTypes) => {
    switch (type) {
      case UserTypes.Admin:
      case UserTypes.SuperAdmin:
        return <span className="text-[10px] font-bold bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 px-2 py-0.5 rounded-full">ADMIN</span>;
      case UserTypes.Seller:
        return <span className="text-[10px] font-bold bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200 px-2 py-0.5 rounded-full">SATICI</span>;
      case UserTypes.Customer:
      default:
        return <span className="text-[10px] font-bold bg-zinc-950/5 text-zinc-500 px-2 py-0.5 rounded-full">MÜŞTERİ</span>;
    }
  };

  const getSellerStatusBadge = (status: SellerStatus) => {
    const baseClass = "text-xs font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider ";
    switch (status) {
      case SellerStatus.Pending:
        return <span className={`${baseClass} bg-amber-50 text-amber-600`}>Beklemede</span>;
      case SellerStatus.Approved:
        return <span className={`${baseClass} bg-emerald-50 text-emerald-600`}>Onaylandı</span>;
      case SellerStatus.Rejected:
        return <span className={`${baseClass} bg-red-50 text-red-600`}>Reddedildi</span>;
      default:
        return <span className={`${baseClass} bg-zinc-100 text-zinc-500`}>{status}</span>;
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 space-y-8 text-left">
      
      {/* Header */}
      <div className="border-b border-zinc-950/5 dark:border-white/5 pb-6">
        <h1 className="text-4xl font-extrabold tracking-tight text-zinc-950 dark:text-white uppercase leading-none">Yönetici Paneli</h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1.5">Sistem kullanıcılarını denetleyin, satıcı dükkan başvurularını onaylayın ve kategorileri yönetin.</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-zinc-950/5 dark:border-white/10 gap-2 overflow-x-auto pb-px">
        <button
          onClick={() => setActiveTab('users')}
          className={`flex items-center gap-2 px-6 py-3 font-semibold text-sm transition-all border-b-2 ${
            activeTab === 'users'
              ? 'border-zinc-950 dark:border-white text-zinc-950 dark:text-white'
              : 'border-transparent text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300'
          }`}
        >
          <Users className="w-4 h-4" /> Kullanıcılar ({users.length})
        </button>

        <button
          onClick={() => setActiveTab('sellers')}
          className={`flex items-center gap-2 px-6 py-3 font-semibold text-sm transition-all border-b-2 ${
            activeTab === 'sellers'
              ? 'border-zinc-950 dark:border-white text-zinc-950 dark:text-white'
              : 'border-transparent text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300'
          }`}
        >
          <Store className="w-4 h-4" /> Satıcı Başvuruları ({sellers.length})
        </button>

        <button
          onClick={() => setActiveTab('categories')}
          className={`flex items-center gap-2 px-6 py-3 font-semibold text-sm transition-all border-b-2 ${
            activeTab === 'categories'
              ? 'border-zinc-950 dark:border-white text-zinc-950 dark:text-white'
              : 'border-transparent text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300'
          }`}
        >
          <FolderHeart className="w-4 h-4" /> Kategori Yönetimi ({categories.length})
        </button>
      </div>

      {isLoading ? (
        <div className="text-center py-20">
          <div className="animate-spin inline-block w-8 h-8 border-2 border-zinc-950 border-t-transparent dark:border-white rounded-full" />
        </div>
      ) : (
        <main className="glass-surface bg-zinc-950/[0.01] dark:bg-white/5 border border-zinc-950/5 dark:border-white/10 rounded-3xl p-6 sm:p-8">
          
          {/* Tab 1: User Management */}
          {activeTab === 'users' && (
            <div className="space-y-6">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left border-collapse">
                  <thead>
                    <tr className="border-b border-zinc-950/5 dark:border-white/5 text-zinc-400 dark:text-zinc-500 text-[10px] uppercase font-bold tracking-wider">
                      <th className="pb-3 pr-4">Ad Soyad</th>
                      <th className="pb-3 px-4">E-posta</th>
                      <th className="pb-3 px-4">Yetki Rolü</th>
                      <th className="pb-3 px-4">Durum</th>
                      <th className="pb-3 pl-4 text-right">İşlemler</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-950/5 dark:divide-white/5">
                    {users.map((u) => (
                      <tr key={u.id} className={`hover:bg-zinc-950/[0.01] dark:hover:bg-white/[0.01] transition-all ${u.isDeleted ? 'opacity-60' : ''}`}>
                        <td className="py-4 pr-4 font-bold text-zinc-900 dark:text-white">
                          {u.firstName} {u.lastName}
                        </td>
                        <td className="py-4 px-4 text-zinc-500">{u.email}</td>
                        <td className="py-4 px-4">{getUserTypeBadge(u.userType)}</td>
                        <td className="py-4 px-4 font-semibold">
                          {u.isDeleted ? (
                            <span className="text-red-500 text-xs">Banlı</span>
                          ) : (
                            <span className="text-emerald-600 text-xs">Aktif</span>
                          )}
                        </td>
                        <td className="py-4 pl-4 text-right">
                          {u.userType !== UserTypes.Admin && u.userType !== UserTypes.SuperAdmin && (
                            u.isDeleted ? (
                              <button
                                onClick={() => handleUnbanUser(u.id)}
                                className="text-xs font-bold text-zinc-900 dark:text-white underline cursor-pointer hover:opacity-80"
                              >
                                Banı Kaldır
                              </button>
                            ) : (
                              <button
                                onClick={() => handleBanUser(u.id)}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-red-200 dark:border-red-950/30 text-red-600 font-semibold text-xs hover:bg-red-50 dark:hover:bg-red-950/20 transition-all cursor-pointer"
                              >
                                <Ban className="w-3.5 h-3.5" /> Kullanıcıyı Banla
                              </button>
                            )
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Tab 2: Seller applications */}
          {activeTab === 'sellers' && (
            <div className="space-y-6">
              {sellers.length === 0 ? (
                <div className="text-center py-12 text-zinc-500">Kayıtlı satıcı veya başvuru bulunmamaktadır.</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {sellers.map((sel) => (
                    <div
                      key={sel.id}
                      className="border border-zinc-950/5 dark:border-white/10 rounded-2xl p-5 bg-zinc-950/[0.01] dark:bg-white/[0.01] text-xs space-y-4"
                    >
                      <div className="flex justify-between items-center border-b border-zinc-950/5 dark:border-white/5 pb-2.5">
                        <h4 className="text-sm font-bold text-zinc-900 dark:text-white uppercase truncate">{sel.storeName}</h4>
                        {getSellerStatusBadge(sel.status)}
                      </div>

                      <div className="space-y-2 text-zinc-500">
                        <p><strong>Sahip E-postası:</strong> {sel.userEmail}</p>
                        <p><strong>İletişim Tel / Mail:</strong> {sel.contactPhone} / {sel.contactEmail}</p>
                        <p><strong>Destek Hattı:</strong> {sel.supportLine}</p>
                        <p><strong>Vergi Numarası & Dairesi:</strong> {sel.taxNumber} ({sel.taxOffice})</p>
                      </div>

                      {sel.status === SellerStatus.Pending && (
                        <div className="flex gap-3 pt-2 border-t border-zinc-950/5 dark:border-white/5">
                          <button
                            onClick={() => handleApproveSeller(sel.id)}
                            className="flex-grow flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 font-bold hover:opacity-85 transition-opacity cursor-pointer text-xs"
                          >
                            <CheckCircle className="w-4 h-4" /> Onayla
                          </button>
                          <button
                            onClick={() => handleRejectSeller(sel.id)}
                            className="flex-grow flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-red-200 dark:border-red-950/30 text-red-600 font-bold hover:bg-red-50 dark:hover:bg-red-950/20 transition-all cursor-pointer text-xs"
                          >
                            <XCircle className="w-4 h-4" /> Reddet
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Tab 3: Category Management */}
          {activeTab === 'categories' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              
              {/* Category form */}
              <div className="md:col-span-1 border-r border-zinc-950/5 dark:border-white/5 pr-0 md:pr-8 space-y-4">
                <form onSubmit={handleSubmit(onCategorySubmit)} className="space-y-4">
                  <h4 className="text-sm font-bold uppercase tracking-wider text-zinc-900 dark:text-white">
                    {editCategory ? 'Kategoriyi Düzenle' : 'Yeni Kategori Ekle'}
                  </h4>

                  <Input
                    label="Kategori Adı"
                    placeholder="Örn: Ev Dekorasyon"
                    error={errors.categoryName?.message}
                    {...register('categoryName', { required: 'Kategori adı zorunludur.' })}
                  />

                  <div className="flex gap-2">
                    <Button type="submit" variant="primary" disabled={isSubmitLoading} className="w-full">
                      {isSubmitLoading ? 'Kaydediliyor...' : (editCategory ? 'Güncelle' : 'Ekle')}
                    </Button>
                    {editCategory && (
                      <Button
                        type="button"
                        variant="glass"
                        onClick={() => {
                          setEditCategory(null);
                          reset();
                        }}
                      >
                        İptal
                      </Button>
                    )}
                  </div>
                </form>
              </div>

              {/* Categories list */}
              <div className="md:col-span-2 space-y-4">
                <h4 className="text-sm font-bold uppercase tracking-wider text-zinc-900 dark:text-white">Kayıtlı Kategoriler</h4>
                
                <div className="divide-y divide-zinc-950/5 dark:divide-white/5 max-h-96 overflow-y-auto pr-1">
                  {categories.map((cat) => (
                    <div key={cat.id} className="flex justify-between items-center py-3 first:pt-0 last:pb-0">
                      <span className="font-semibold text-zinc-800 dark:text-zinc-200 text-sm">{cat.name}</span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditCategoryClick(cat)}
                          className="p-1.5 rounded-full border border-zinc-950/5 dark:border-white/10 text-zinc-500 hover:text-zinc-950 dark:hover:text-white transition-colors cursor-pointer"
                          aria-label="Düzenle"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteCategory(cat.id)}
                          className="p-1.5 rounded-full border border-zinc-950/5 dark:border-white/10 text-zinc-400 hover:text-red-500 transition-colors cursor-pointer"
                          aria-label="Sil"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

        </main>
      )}

    </div>
  );
};
