import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { productService } from '../../services/productService';
import { orderService } from '../../services/orderService';
import { categoryService } from '../../services/categoryService';
import { ProductListDto, OrderDto, CategoryDto, OrderStatus } from '../../types/api.types';
import { useToast } from '../../context/ToastContext';
import { formatPrice } from '../../components/ProductCard';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { Trash2, Edit3, Plus, ArrowRight, Package, ListPlus, KanbanSquare, ClipboardList, CheckCircle } from 'lucide-react';

export const SellerPanel: React.FC = () => {
  const { showToast } = useToast();
  
  const [activeTab, setActiveTab] = useState<'products' | 'upsert' | 'orders'>('products');
  const [products, setProducts] = useState<ProductListDto[]>([]);
  const [orders, setOrders] = useState<OrderDto[]>([]);
  const [categories, setCategories] = useState<CategoryDto[]>([]);
  
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);
  const [editProduct, setEditProduct] = useState<ProductListDto | null>(null);

  // Load products, orders, categories
  const loadSellerData = async () => {
    setIsLoading(true);
    try {
      const [prodData, orderData, catData] = await Promise.all([
        productService.getMyProducts(),
        orderService.getSellerOrders(),
        categoryService.getAll()
      ]);
      setProducts(prodData);
      setOrders(orderData);
      setCategories(catData);
    } catch (err: any) {
      showToast(err.message || 'Satıcı verileri yüklenemedi.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSellerData();
  }, []);

  // Form hook
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      stock: 0,
      categoryId: 0,
      mainImage: '',
      image2: '',
      image3: '',
    },
  });

  // Handle setting edit product
  const handleEditClick = (prod: ProductListDto) => {
    setEditProduct(prod);
    setActiveTab('upsert');
    reset({
      name: prod.name,
      description: prod.description,
      price: prod.price,
      stock: prod.stock,
      categoryId: prod.categoryId,
      mainImage: prod.mainImageUrl || '',
      image2: prod.imageUrls[1] || '',
      image3: prod.imageUrls[2] || '',
    });
  };

  const handleNewProductClick = () => {
    setEditProduct(null);
    reset({
      name: '',
      description: '',
      price: 0,
      stock: 0,
      categoryId: categories[0]?.id || 0,
      mainImage: '',
      image2: '',
      image3: '',
    });
    setActiveTab('upsert');
  };

  const handleDeleteProduct = async (id: number) => {
    if (!confirm('Bu ürünü silmek istediğinize emin misiniz? (Soft delete)')) return;
    try {
      await productService.delete(id);
      showToast('Ürün başarıyla silindi.', 'success');
      loadSellerData();
    } catch (err: any) {
      showToast(err.message || 'Ürün silinemedi.', 'error');
    }
  };

  const onSubmit = async (data: any) => {
    setIsSubmitLoading(true);
    // Collect non-empty images into list
    const imageUrlsList = [data.mainImage, data.image2, data.image3].filter(Boolean) as string[];
    
    try {
      if (editProduct) {
        // Edit flow
        await productService.update({
          id: editProduct.id,
          name: data.name,
          description: data.description,
          price: Number(data.price),
          stock: Number(data.stock),
          categoryId: Number(data.categoryId),
          imageUrls: imageUrlsList
        });
        showToast('Ürün başarıyla güncellendi.', 'success');
      } else {
        // Create flow
        await productService.create({
          name: data.name,
          description: data.description,
          price: Number(data.price),
          stock: Number(data.stock),
          categoryId: Number(data.categoryId),
          imageUrls: imageUrlsList
        });
        showToast('Yeni ürün kataloğa başarıyla eklendi.', 'success');
      }
      
      // Reset flow
      setEditProduct(null);
      reset();
      setActiveTab('products');
      loadSellerData();
    } catch (err: any) {
      showToast(err.message || 'İşlem gerçekleştirilemedi.', 'error');
    } finally {
      setIsSubmitLoading(false);
    }
  };

  const handleStatusChange = async (orderItemId: number, newStatusValue: string) => {
    const statusEnumInt = parseInt(newStatusValue, 10) as OrderStatus;
    try {
      await orderService.updateOrderItemStatus(orderItemId, statusEnumInt);
      showToast('Sipariş kalemi durumu güncellendi.', 'success');
      loadSellerData();
    } catch (err: any) {
      showToast(err.message || 'Durum güncellenemedi.', 'error');
    }
  };

  const getStatusBadge = (status: string) => {
    const baseClass = "text-xs font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider ";
    switch (status) {
      case 'Received':
        return <span className={`${baseClass} bg-blue-50 text-blue-600`}>Alındı</span>;
      case 'Preparing':
        return <span className={`${baseClass} bg-amber-50 text-amber-600`}>Hazırlanıyor</span>;
      case 'Shipped':
        return <span className={`${baseClass} bg-zinc-900 text-white`}>Kargoda</span>;
      case 'Delivered':
        return <span className={`${baseClass} bg-emerald-50 text-emerald-600`}>Teslim Edildi</span>;
      case 'Cancelled':
        return <span className={`${baseClass} bg-red-50 text-red-600`}>İptal Edildi</span>;
      default:
        return <span className={`${baseClass} bg-zinc-100 text-zinc-600`}>{status}</span>;
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 space-y-8 text-left">
      
      {/* Header */}
      <div className="border-b border-zinc-950/5 dark:border-white/5 pb-6 flex items-end justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-zinc-950 dark:text-white uppercase leading-none">Satıcı Paneli</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1.5">Mağazanızın ürünlerini listeleyin, siparişleri takip edin ve yeni stoklar ekleyin.</p>
        </div>
        <button
          onClick={handleNewProductClick}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 font-bold text-xs hover:opacity-85 transition-opacity cursor-pointer shadow-md"
        >
          <Plus className="w-4 h-4" /> Yeni Ürün Ekle
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-zinc-950/5 dark:border-white/10 gap-2 overflow-x-auto pb-px">
        <button
          onClick={() => setActiveTab('products')}
          className={`flex items-center gap-2 px-6 py-3 font-semibold text-sm transition-all border-b-2 ${
            activeTab === 'products'
              ? 'border-zinc-950 dark:border-white text-zinc-950 dark:text-white'
              : 'border-transparent text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300'
          }`}
        >
          <Package className="w-4 h-4" /> Ürünlerim ({products.length})
        </button>

        <button
          onClick={() => setActiveTab('upsert')}
          className={`flex items-center gap-2 px-6 py-3 font-semibold text-sm transition-all border-b-2 ${
            activeTab === 'upsert'
              ? 'border-zinc-950 dark:border-white text-zinc-950 dark:text-white'
              : 'border-transparent text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300'
          }`}
        >
          <ListPlus className="w-4 h-4" /> {editProduct ? 'Ürünü Düzenle' : 'Yeni Ürün'}
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`flex items-center gap-2 px-6 py-3 font-semibold text-sm transition-all border-b-2 ${
            activeTab === 'orders'
              ? 'border-zinc-950 dark:border-white text-zinc-950 dark:text-white'
              : 'border-transparent text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300'
          }`}
        >
          <KanbanSquare className="w-4 h-4" /> Gelen Siparişler ({orders.length})
        </button>
      </div>

      {isLoading ? (
        <div className="text-center py-20">
          <div className="animate-spin inline-block w-8 h-8 border-2 border-zinc-950 border-t-transparent dark:border-white rounded-full" />
        </div>
      ) : (
        <main className="glass-surface bg-zinc-950/[0.01] dark:bg-white/5 border border-zinc-950/5 dark:border-white/10 rounded-3xl p-6 sm:p-8">
          
          {/* Tab 1: Products List */}
          {activeTab === 'products' && (
            <div className="space-y-6">
              {products.length === 0 ? (
                <div className="text-center py-12 text-zinc-500 font-medium">
                  Henüz bir ürün listelemediniz. Yeni Ürün Ekle butonunu kullanarak başlayabilirsiniz.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left border-collapse">
                    <thead>
                      <tr className="border-b border-zinc-950/5 dark:border-white/5 text-zinc-400 dark:text-zinc-500 text-[10px] uppercase font-bold tracking-wider">
                        <th className="pb-3 pr-4">Ürün</th>
                        <th className="pb-3 px-4">Kategori</th>
                        <th className="pb-3 px-4">Fiyat</th>
                        <th className="pb-3 px-4">Stok</th>
                        <th className="pb-3 pl-4 text-right">İşlemler</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-950/5 dark:divide-white/5">
                      {products.map((prod) => {
                        const fallbackImg = `https://placehold.co/100x100/0a0a0a/fafafa?text=${encodeURIComponent(prod.name)}`;
                        return (
                          <tr key={prod.id} className="hover:bg-zinc-950/[0.01] dark:hover:bg-white/[0.01] transition-all">
                            <td className="py-4 pr-4 flex items-center gap-3">
                              <div className="w-12 h-12 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-950/5 shrink-0 overflow-hidden">
                                <img src={prod.mainImageUrl || fallbackImg} alt={prod.name} className="w-full h-full object-cover" />
                              </div>
                              <div className="min-w-0">
                                <p className="font-bold text-zinc-900 dark:text-white truncate">{prod.name}</p>
                                <p className="text-[10px] text-zinc-400 truncate max-w-[200px] mt-0.5">{prod.description}</p>
                              </div>
                            </td>
                            <td className="py-4 px-4 font-medium text-zinc-500">{prod.categoryName}</td>
                            <td className="py-4 px-4 font-bold text-zinc-900 dark:text-zinc-200">{formatPrice(prod.price)}</td>
                            <td className="py-4 px-4 font-bold">
                              {prod.stock === 0 ? (
                                <span className="text-red-500 text-xs">Tükendi</span>
                              ) : (
                                <span className="text-zinc-700 dark:text-zinc-300">{prod.stock} Adet</span>
                              )}
                            </td>
                            <td className="py-4 pl-4 text-right space-x-2">
                              <button
                                onClick={() => handleEditClick(prod)}
                                className="inline-flex items-center justify-center p-2 rounded-full border border-zinc-950/5 hover:border-zinc-950/15 dark:border-white/10 dark:hover:border-white/20 text-zinc-500 hover:text-zinc-950 dark:hover:text-white transition-colors cursor-pointer"
                                aria-label="Düzenle"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(prod.id)}
                                className="inline-flex items-center justify-center p-2 rounded-full border border-zinc-950/5 hover:border-red-200 dark:border-white/10 dark:hover:border-red-950/20 text-zinc-400 hover:text-red-600 transition-colors cursor-pointer"
                                aria-label="Sil"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Tab 2: Add/Edit Product */}
          {activeTab === 'upsert' && (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <h3 className="text-lg font-bold text-zinc-950 dark:text-white uppercase tracking-wide border-b border-zinc-950/5 dark:border-white/5 pb-2 flex items-center gap-2">
                <ListPlus className="w-5 h-5 text-zinc-400" /> 
                {editProduct ? `Ürünü Düzenle: ${editProduct.name}` : 'Yeni Ürün Oluştur'}
              </h3>

              <Input
                label="Ürün Adı"
                placeholder="Örn: Kablosuz Mat Siyah Kulaklık"
                error={errors.name?.message}
                {...register('name', { 
                  required: 'Ürün adı zorunludur.',
                  maxLength: { value: 150, message: 'En fazla 150 karakter olabilir.' }
                })}
              />

              <div className="flex flex-col gap-1.5 text-left">
                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Açıklama</label>
                <textarea
                  placeholder="Ürünün detaylı teknik ve görsel açıklamaları..."
                  rows={4}
                  className={`w-full bg-transparent border rounded-xl px-4 py-3 outline-none transition text-zinc-900 dark:text-zinc-50 ${
                    errors.description 
                      ? 'border-red-500' 
                      : 'border-zinc-300 dark:border-zinc-800 focus:border-zinc-950 dark:focus:border-white'
                  }`}
                  {...register('description', { 
                    required: 'Açıklama zorunludur.',
                    maxLength: { value: 1000, message: 'En fazla 1000 karakter olabilir.' }
                  })}
                />
                {errors.description && (
                  <span className="text-xs text-red-500 font-medium">{errors.description.message}</span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Satış Fiyatı (₺)"
                  type="number"
                  step="0.01"
                  placeholder="299.99"
                  error={errors.price?.message}
                  {...register('price', { 
                    required: 'Fiyat zorunludur.',
                    min: { value: 0.01, message: 'Fiyat 0\'dan büyük olmalıdır.' }
                  })}
                />

                <Input
                  label="Stok Adedi"
                  type="number"
                  placeholder="50"
                  error={errors.stock?.message}
                  {...register('stock', { 
                    required: 'Stok zorunludur.',
                    min: { value: 0, message: 'Stok negatif olamaz.' }
                  })}
                />
              </div>

              <div className="flex flex-col gap-1.5 text-left">
                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Kategori Seçimi</label>
                <select
                  className="w-full bg-transparent border border-zinc-300 dark:border-zinc-800 rounded-xl px-4 py-3 outline-none transition text-zinc-900 dark:text-zinc-50"
                  {...register('categoryId', { required: 'Kategori seçimi zorunludur.' })}
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id} className="dark:bg-zinc-900">
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Product Images links (up to 3 links) */}
              <div className="space-y-4">
                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 block">Ürün Görsel Linkleri</label>
                <div className="p-5 rounded-2xl border border-zinc-300 dark:border-zinc-850 space-y-4">
                  <Input
                    label="Ana Görsel URL (Vitrin resmi)"
                    placeholder="https://example.com/image1.jpg"
                    {...register('mainImage', { required: 'Ana görsel URL zorunludur.' })}
                    error={errors.mainImage?.message}
                  />
                  <Input
                    label="Alternatif Görsel 2 URL (Opsiyonel)"
                    placeholder="https://example.com/image2.jpg"
                    {...register('image2')}
                  />
                  <Input
                    label="Alternatif Görsel 3 URL (Opsiyonel)"
                    placeholder="https://example.com/image3.jpg"
                    {...register('image3')}
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <Button type="submit" variant="primary" disabled={isSubmitLoading}>
                  {isSubmitLoading ? 'Kaydediliyor...' : (editProduct ? 'Ürünü Güncelle' : 'Ürünü Ekle')}
                </Button>
                <Button
                  type="button"
                  variant="glass"
                  onClick={() => {
                    setEditProduct(null);
                    reset();
                    setActiveTab('products');
                  }}
                >
                  Vazgeç
                </Button>
              </div>
            </form>
          )}

          {/* Tab 3: Seller Orders */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              {orders.length === 0 ? (
                <div className="text-center py-12 text-zinc-500 font-medium">
                  Henüz gelen sipariş bulunmuyor.
                </div>
              ) : (
                <div className="space-y-6">
                  {orders.map((ord) => (
                    <div
                      key={ord.id}
                      className="border border-zinc-950/5 dark:border-white/5 rounded-2xl p-5 bg-zinc-950/[0.01] dark:bg-white/[0.01] text-xs space-y-4"
                    >
                      {/* Top Row Order Info */}
                      <div className="flex flex-wrap justify-between items-start border-b border-zinc-950/5 dark:border-white/5 pb-3">
                        <div className="space-y-1">
                          <p className="text-zinc-400">Sipariş: <strong className="text-zinc-900 dark:text-white">#{ord.id}</strong></p>
                          <p className="text-[10px] text-zinc-400">Tarih: {new Date(ord.createdDate).toLocaleDateString('tr-TR')}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-zinc-400">Mağazanızın Kazancı</p>
                          <p className="font-extrabold text-sm text-zinc-900 dark:text-white">{formatPrice(ord.totalPrice)}</p>
                        </div>
                      </div>

                      {/* Client Delivery details */}
                      <div className="flex items-start gap-1 text-zinc-500">
                        <ClipboardList className="w-4 h-4 shrink-0 text-zinc-400 mt-0.5" />
                        <div>
                          <strong>Teslimat Bilgisi:</strong> {ord.addressTitle} - {ord.shippingAddress}
                        </div>
                      </div>

                      {/* Items matching this seller */}
                      <div className="space-y-3 pt-2">
                        <p className="text-[10px] uppercase font-bold text-zinc-400 tracking-wide">Sipariş Kalemleri & Durumu</p>
                        
                        <div className="divide-y divide-zinc-950/5 dark:divide-white/5">
                          {ord.orderItems.map((item) => (
                            <div key={item.id} className="flex items-center justify-between gap-4 py-2.5 first:pt-0 last:pb-0">
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center font-bold text-zinc-400 text-xs">
                                  {item.productName[0]}
                                </div>
                                <div>
                                  <p className="font-bold text-zinc-900 dark:text-white">{item.productName}</p>
                                  <p className="text-zinc-400 text-[10px]">{formatPrice(item.price)} x {item.quantity}</p>
                                </div>
                              </div>

                              {/* Status Update Action Dropdown */}
                              <div className="flex items-center gap-2">
                                <span>Durum:</span>
                                {getStatusBadge(item.status)}
                                <select
                                  value={item.status === 'Received' ? 1 : item.status === 'Preparing' ? 2 : item.status === 'Shipped' ? 3 : item.status === 'Delivered' ? 4 : 5}
                                  onChange={(e) => handleStatusChange(item.id, e.target.value)}
                                  className="ml-2 text-[10px] bg-transparent border border-zinc-300 dark:border-zinc-800 rounded-lg px-2 py-1 text-zinc-700 dark:text-zinc-300 outline-none cursor-pointer"
                                >
                                  <option value={1} className="dark:bg-zinc-900">Alındı</option>
                                  <option value={2} className="dark:bg-zinc-900">Hazırlanıyor</option>
                                  <option value={3} className="dark:bg-zinc-900">Kargoya Ver</option>
                                  <option value={4} className="dark:bg-zinc-900">Teslim Edildi</option>
                                  <option value={5} className="dark:bg-zinc-900">İptal Et</option>
                                </select>
                              </div>

                            </div>
                          ))}
                        </div>
                      </div>

                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </main>
      )}

    </div>
  );
};
