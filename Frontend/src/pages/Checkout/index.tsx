import React, { useContext, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { CartContext } from '../../context/CartContext';
import { orderService } from '../../services/orderService';
import { useToast } from '../../context/ToastContext';
import { formatPrice } from '../../components/ProductCard';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { CheckCircle2, ChevronLeft, CreditCard, ShoppingBag } from 'lucide-react';

export const Checkout: React.FC = () => {
  const cartContext = useContext(CartContext);
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [createdOrder, setCreatedOrder] = useState<any>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      addressTitle: '',
      shippingAddress: '',
      cardHolderName: '',
      cardNumber: '',
      cardExpiry: '',
      cardCvv: '',
    },
  });

  if (!cartContext) return null;
  const { cart, refreshCart } = cartContext;

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      // Execute the order creation in the backend
      const result = await orderService.createOrder({
        addressTitle: data.addressTitle,
        shippingAddress: data.shippingAddress,
      });
      setCreatedOrder(result);
      setIsSuccess(true);
      showToast('Siparişiniz başarıyla alındı!', 'success');
      // Clear the local cart context
      await refreshCart();
    } catch (err: any) {
      showToast(err.message || 'Sipariş oluşturulamadı.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const subtotal = cart?.grandTotal || 0;
  const shippingCost = subtotal >= 1500 || subtotal === 0 ? 0 : 50;
  const grandTotal = subtotal + shippingCost;

  if (isSuccess && createdOrder) {
    return (
      <div className="max-w-xl mx-auto px-6 py-20 text-center space-y-6">
        <div className="flex flex-col items-center justify-center space-y-4">
          <CheckCircle2 className="w-16 h-16 text-zinc-950 dark:text-white" />
          <h1 className="text-3xl font-extrabold text-zinc-950 dark:text-white uppercase tracking-tight">Sipariş Alındı!</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Sipariş numaranız: <strong>#{createdOrder.id}</strong></p>
        </div>
        
        <div className="p-6 rounded-2xl glass-surface bg-zinc-950/[0.01] dark:bg-white/5 border border-zinc-950/5 dark:border-white/10 text-left space-y-4 text-sm">
          <div className="flex justify-between border-b border-zinc-950/5 dark:border-white/5 pb-2.5">
            <span className="font-semibold text-zinc-900 dark:text-zinc-100">Adres Başlığı:</span>
            <span>{createdOrder.addressTitle}</span>
          </div>
          <div className="flex justify-between border-b border-zinc-950/5 dark:border-white/5 pb-2.5">
            <span className="font-semibold text-zinc-900 dark:text-zinc-100">Teslimat Adresi:</span>
            <span className="truncate max-w-[200px]">{createdOrder.shippingAddress}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold text-zinc-900 dark:text-zinc-100">Toplam Tutar:</span>
            <span className="font-bold">{formatPrice(createdOrder.totalPrice)}</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link to="/orders" className="flex-grow">
            <Button variant="primary" fullWidth>Sipariş Takibi</Button>
          </Link>
          <Link to="/" className="flex-grow">
            <Button variant="glass" fullWidth>Ana Sayfaya Dön</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-20 text-center space-y-4">
        <p className="text-zinc-500 font-medium">Sipariş oluşturmak için sepetinizde ürün bulunmalıdır.</p>
        <Link to="/products">
          <Button variant="primary">Kataloğa Göz At</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 space-y-8 text-left">
      
      {/* Back to Cart */}
      <div>
        <Link to="/cart" className="inline-flex items-center gap-1 text-xs font-semibold text-zinc-500 hover:text-zinc-950 dark:hover:text-white transition-colors">
          <ChevronLeft className="w-4 h-4" /> Sepetime Dön
        </Link>
      </div>

      <div className="border-b border-zinc-950/5 dark:border-white/5 pb-6">
        <h1 className="text-4xl font-extrabold tracking-tight text-zinc-950 dark:text-white uppercase leading-none">Ödeme / Checkout</h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1.5">Sipariş teslimat ve ödeme bilgilerini doldurun.</p>
      </div>

      {/* Main Grid */}
      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Left Columns - Forms */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Section 1: Delivery info */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-zinc-950 dark:text-white uppercase tracking-wide border-b border-zinc-950/5 dark:border-white/5 pb-2">
              1. Teslimat Adresi
            </h3>
            
            <div className="space-y-4">
              <Input
                label="Adres Başlığı"
                placeholder="Evim, İş Yerim..."
                error={errors.addressTitle?.message}
                {...register('addressTitle', { 
                  required: 'Adres başlığı zorunludur.',
                  maxLength: { value: 100, message: 'En fazla 100 karakter olabilir.' }
                })}
              />

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Detaylı Adres</label>
                <textarea
                  placeholder="Mahalle, Sokak, Daire, İlçe/İl..."
                  rows={3}
                  className={`w-full bg-transparent border rounded-xl px-4 py-3 outline-none transition text-zinc-900 dark:text-zinc-50 ${
                    errors.shippingAddress 
                      ? 'border-red-500' 
                      : 'border-zinc-300 dark:border-zinc-800 focus:border-zinc-950 dark:focus:border-white'
                  }`}
                  {...register('shippingAddress', { 
                    required: 'Adres detayları zorunludur.',
                    minLength: { value: 10, message: 'Lütfen daha detaylı bir adres giriniz (En az 10 karakter).' },
                    maxLength: { value: 500, message: 'En fazla 500 karakter olabilir.' }
                  })}
                />
                {errors.shippingAddress && (
                  <span className="text-xs text-red-500 font-medium">{errors.shippingAddress.message}</span>
                )}
              </div>
            </div>
          </div>

          {/* Section 2: Mock Payment info */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-zinc-950 dark:text-white uppercase tracking-wide border-b border-zinc-950/5 dark:border-white/5 pb-2">
              2. Ödeme Bilgileri
            </h3>
            
            <div className="p-6 rounded-2xl glass-surface bg-zinc-950/[0.01] dark:bg-white/5 border border-zinc-950/5 dark:border-white/10 space-y-4">
              <div className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300 text-sm font-medium mb-2">
                <CreditCard className="w-5 h-5" /> Kredi / Banka Kartı
              </div>

              <Input
                label="Kart Üzerindeki İsim"
                placeholder="John Doe"
                error={errors.cardHolderName?.message}
                {...register('cardHolderName', { required: 'Kart sahibi ismi zorunludur.' })}
              />

              <Input
                label="Kart Numarası"
                placeholder="4000 1234 5678 9010"
                error={errors.cardNumber?.message}
                {...register('cardNumber', { 
                  required: 'Kart numarası zorunludur.',
                  pattern: { value: /^\d{16}$/, message: 'Lütfen 16 haneli kart numarasını aralarında boşluk olmadan giriniz.' }
                })}
              />

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Son Kullanma Tarihi (AA/YY)"
                  placeholder="12/28"
                  error={errors.cardExpiry?.message}
                  {...register('cardExpiry', { required: 'S.K.T. zorunludur.' })}
                />
                <Input
                  label="Güvenlik Kodu (CVV)"
                  placeholder="321"
                  error={errors.cardCvv?.message}
                  {...register('cardCvv', { 
                    required: 'CVV kodu zorunludur.',
                    pattern: { value: /^\d{3}$/, message: 'CVV 3 haneli olmalıdır.' }
                  })}
                />
              </div>
            </div>
          </div>

        </div>

        {/* Right Column - Order Summary */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-surface bg-zinc-950/[0.01] dark:bg-white/5 border border-zinc-950/5 dark:border-white/10 rounded-2xl p-6 space-y-6">
            <h3 className="font-bold text-sm text-zinc-900 dark:text-white uppercase tracking-wider border-b border-zinc-950/5 dark:border-white/5 pb-4 flex items-center gap-2">
              <ShoppingBag className="w-4 h-4" /> Sipariş Kalemleri
            </h3>

            {/* List items briefly */}
            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {cart.items.map((item) => (
                <div key={item.id} className="flex justify-between text-xs gap-4">
                  <span className="text-zinc-600 dark:text-zinc-400 line-clamp-1">{item.productName} <strong className="text-zinc-900 dark:text-white">x{item.quantity}</strong></span>
                  <span className="font-semibold text-zinc-900 dark:text-white">{formatPrice(item.totalPrice)}</span>
                </div>
              ))}
            </div>

            {/* Pricing calculations */}
            <div className="border-t border-zinc-950/5 dark:border-white/5 pt-4 space-y-3 text-sm">
              <div className="flex justify-between text-zinc-500">
                <span>Sepet Toplamı</span>
                <span className="font-semibold text-zinc-900 dark:text-white">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-zinc-500">
                <span>Kargo</span>
                {shippingCost === 0 ? (
                  <span className="text-emerald-600 font-bold">Ücretsiz</span>
                ) : (
                  <span className="font-semibold text-zinc-900 dark:text-white">{formatPrice(shippingCost)}</span>
                )}
              </div>
              <div className="flex justify-between border-t border-zinc-950/5 dark:border-white/5 pt-4 text-base font-bold text-zinc-950 dark:text-white">
                <span>Toplam Tutar</span>
                <span>{formatPrice(grandTotal)}</span>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              disabled={isLoading}
            >
              {isLoading ? 'Sipariş Oluşturuluyor...' : 'Siparişi Onayla'}
            </Button>
          </div>
        </div>

      </form>

    </div>
  );
};
