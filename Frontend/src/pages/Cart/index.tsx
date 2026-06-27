import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../../context/CartContext';
import { formatPrice } from '../../components/ProductCard';
import { Button } from '../../components/Button';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Truck } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const Cart: React.FC = () => {
  const cartContext = useContext(CartContext);
  const { showToast } = useToast();
  const navigate = useNavigate();

  if (!cartContext) return null;

  const { cart, isLoading, updateItemQuantity, removeItem, clearCart } = cartContext;

  const handleQuantityChange = async (productId: number, currentQty: number, change: number) => {
    const newQty = currentQty + change;
    if (newQty <= 0) return;
    try {
      await updateItemQuantity(productId, newQty);
    } catch (err: any) {
      showToast(err.message || 'Ürün adedi güncellenemedi.', 'error');
    }
  };

  const handleRemove = async (productId: number, productName: string) => {
    try {
      await removeItem(productId);
      showToast(`${productName} sepetinizden kaldırıldı.`, 'success');
    } catch (err: any) {
      showToast(err.message || 'Ürün sepetten silinemedi.', 'error');
    }
  };

  const handleClear = async () => {
    try {
      await clearCart();
      showToast('Sepetiniz tamamen temizlendi.', 'success');
    } catch (err: any) {
      showToast(err.message || 'Sepet temizlenemedi.', 'error');
    }
  };

  const subtotal = cart?.grandTotal || 0;
  const shippingThreshold = 1500;
  const shippingCost = subtotal >= shippingThreshold || subtotal === 0 ? 0 : 50;
  const grandTotal = subtotal + shippingCost;

  if (isLoading && !cart) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-20 text-center animate-pulse">
        <div className="h-6 bg-zinc-200 dark:bg-zinc-800 w-32 mx-auto mb-6 rounded" />
        <div className="space-y-4">
          <div className="h-20 bg-zinc-200 dark:bg-zinc-800 rounded-xl" />
          <div className="h-20 bg-zinc-200 dark:bg-zinc-800 rounded-xl" />
        </div>
      </div>
    );
  }

  const items = cart?.items || [];

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 space-y-8 text-left">
      
      {/* Header */}
      <div className="border-b border-zinc-950/5 dark:border-white/5 pb-6 flex items-end justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-zinc-950 dark:text-white uppercase leading-none">
            Alışveriş Sepeti
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1.5">
            Seçtiğiniz ürünlerin listesi ve sepet toplamı.
          </p>
        </div>
        {items.length > 0 && (
          <button
            onClick={handleClear}
            className="text-xs text-zinc-400 hover:text-red-500 hover:underline flex items-center gap-1 cursor-pointer transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" /> Sepeti Temizle
          </button>
        )}
      </div>

      {items.length === 0 ? (
        /* Empty State */
        <div className="text-center py-20 glass-surface bg-zinc-950/[0.01] dark:bg-white/5 border border-zinc-950/5 dark:border-white/10 rounded-3xl flex flex-col items-center justify-center space-y-6">
          <div className="p-4 bg-zinc-100 dark:bg-zinc-900 rounded-full text-zinc-400">
            <ShoppingBag className="w-12 h-12" />
          </div>
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white uppercase">Sepetiniz Boş</h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">Görünüşe göre sepetinize henüz hiçbir ürün eklemediniz.</p>
          </div>
          <Link to="/products">
            <Button variant="primary" size="md">
              Alışverişe Devam Et
            </Button>
          </Link>
        </div>
      ) : (
        /* Cart Contents Grid */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Items List */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => {
              const fallbackImg = `https://placehold.co/150x150/0a0a0a/fafafa?text=${encodeURIComponent(item.productName)}`;
              return (
                <div
                  key={item.id}
                  className="flex items-center gap-4 p-4 rounded-2xl glass-surface bg-zinc-950/[0.01] dark:bg-white/5 border border-zinc-950/5 dark:border-white/10 relative hover:border-zinc-950/10 dark:hover:border-white/20 transition-all"
                >
                  {/* Thumbnail */}
                  <div className="w-20 h-20 rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-900 border border-zinc-950/5 shrink-0">
                    <img 
                      src={item.productImageUrl || fallbackImg} 
                      alt={item.productName} 
                      className="w-full h-full object-cover" 
                    />
                  </div>

                  {/* Info details */}
                  <div className="flex-grow flex flex-col min-w-0">
                    <Link to={`/product/${item.productId}`} className="text-sm font-bold text-zinc-950 dark:text-white hover:underline truncate">
                      {item.productName}
                    </Link>
                    <span className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5">
                      Birim Fiyat: {formatPrice(item.price)}
                    </span>
                    
                    {/* Actions panel */}
                    <div className="flex items-center justify-between mt-3">
                      
                      {/* Counter */}
                      <div className="flex items-center gap-3 border border-zinc-200 dark:border-zinc-800 rounded-full px-2 py-1 bg-transparent shrink-0">
                        <button
                          onClick={() => handleQuantityChange(item.productId, item.quantity, -1)}
                          disabled={item.quantity <= 1}
                          className="text-zinc-400 hover:text-zinc-950 dark:hover:text-white disabled:opacity-30"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-xs font-bold text-zinc-900 dark:text-white select-none w-4 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleQuantityChange(item.productId, item.quantity, 1)}
                          className="text-zinc-400 hover:text-zinc-950 dark:hover:text-white"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Total for this row */}
                      <span className="text-sm font-bold text-zinc-950 dark:text-white">
                        {formatPrice(item.totalPrice)}
                      </span>

                    </div>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => handleRemove(item.productId, item.productName)}
                    className="absolute top-4 right-4 text-zinc-400 hover:text-red-500 transition-colors p-1"
                    aria-label="Ürünü Kaldır"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                </div>
              );
            })}
          </div>

          {/* Checkout / Order Summary Box */}
          <div className="lg:col-span-1 h-fit glass-surface bg-zinc-950/[0.01] dark:bg-white/5 border border-zinc-950/5 dark:border-white/10 rounded-2xl p-6 space-y-6">
            <h3 className="font-bold text-sm text-zinc-900 dark:text-white uppercase tracking-wider border-b border-zinc-950/5 dark:border-white/5 pb-4">
              Sipariş Özeti
            </h3>

            {/* Calculations */}
            <div className="space-y-3.5 text-sm">
              <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                <span>Ara Toplam</span>
                <span className="font-semibold text-zinc-900 dark:text-white">{formatPrice(subtotal)}</span>
              </div>
              
              <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                <span>Kargo Bedeli</span>
                {shippingCost === 0 ? (
                  <span className="text-emerald-600 font-bold">Ücretsiz</span>
                ) : (
                  <span className="font-semibold text-zinc-900 dark:text-white">{formatPrice(shippingCost)}</span>
                )}
              </div>

              {shippingCost > 0 && (
                <div className="flex items-center gap-1.5 p-3 bg-zinc-950/5 dark:bg-white/5 rounded-xl text-xs text-zinc-500 dark:text-zinc-400 leading-normal">
                  <Truck className="w-4 h-4 shrink-0 text-zinc-400" />
                  <span>
                    Fırsat: Sepetinize <strong>{formatPrice(shippingThreshold - subtotal)}</strong> değerinde ürün daha ekleyin, kargo ücretsiz olsun!
                  </span>
                </div>
              )}

              <div className="flex justify-between border-t border-zinc-950/5 dark:border-white/5 pt-4 text-base font-bold text-zinc-950 dark:text-white">
                <span>Genel Toplam</span>
                <span>{formatPrice(grandTotal)}</span>
              </div>
            </div>

            {/* Proceed Button */}
            <Button
              onClick={() => navigate('/checkout')}
              variant="primary"
              size="lg"
              fullWidth
              className="group"
            >
              Ödemeye Geç{' '}
              <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>

        </div>
      )}

    </div>
  );
};
