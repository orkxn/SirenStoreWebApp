import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { orderService } from '../../services/orderService';
import { OrderDto } from '../../types/api.types';
import { useToast } from '../../context/ToastContext';
import { formatPrice } from '../../components/ProductCard';
import { OrderRowSkeleton } from '../../components/Skeleton';
import { Button } from '../../components/Button';
import { Calendar, MapPin, Package, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Orders: React.FC = () => {
  const { showToast } = useToast();
  const [orders, setOrders] = useState<OrderDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState<number | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await orderService.getMyOrders();
        setOrders(data);
      } catch (err: any) {
        showToast(err.message || 'Siparişleriniz yüklenirken bir hata oluştu.', 'error');
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const toggleExpand = (id: number) => {
    setExpandedOrderId((prev) => (prev === id ? null : id));
  };

  const getStatusBadge = (status: string) => {
    const baseClass = "text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider border ";
    
    switch (status) {
      case 'Received':
        return <span className={`${baseClass} bg-blue-50/50 dark:bg-blue-950/20 text-blue-600 border-blue-200 dark:border-blue-900/30`}>Alındı</span>;
      case 'Preparing':
        return <span className={`${baseClass} bg-amber-50/50 dark:bg-amber-950/20 text-amber-600 border-amber-200 dark:border-amber-900/30`}>Hazırlanıyor</span>;
      case 'Shipped':
        return <span className={`${baseClass} bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 border-zinc-950 dark:border-white`}>Kargoda</span>;
      case 'Delivered':
        return <span className={`${baseClass} bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-600 border-emerald-200 dark:border-emerald-900/30`}>Teslim Edildi</span>;
      case 'Cancelled':
        return <span className={`${baseClass} bg-red-50/50 dark:bg-red-950/20 text-red-600 border-red-200 dark:border-red-900/30`}>İptal Edildi</span>;
      default:
        return <span className={`${baseClass} bg-zinc-100 text-zinc-600 border-zinc-200`}>{status}</span>;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 space-y-8 text-left">
      
      {/* Header */}
      <div className="border-b border-zinc-950/5 dark:border-white/5 pb-6">
        <h1 className="text-4xl font-extrabold tracking-tight text-zinc-950 dark:text-white uppercase leading-none">
          Siparişlerim
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1.5">
          Geçmiş alışverişlerinizi ve güncel sipariş durumlarını buradan takip edebilirsiniz.
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          <OrderRowSkeleton />
          <OrderRowSkeleton />
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-3xl space-y-4">
          <Package className="w-12 h-12 text-zinc-400 mx-auto" />
          <p className="text-zinc-500 font-medium">Henüz hiçbir siparişiniz bulunmuyor.</p>
          <Link to="/products" className="inline-block mt-2">
            <Button variant="primary">Alışverişe Başla</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const isExpanded = expandedOrderId === order.id;
            const formattedDate = new Date(order.createdDate).toLocaleDateString('tr-TR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            });

            return (
              <div
                key={order.id}
                className="border border-zinc-950/5 dark:border-white/10 rounded-2xl overflow-hidden glass-surface bg-zinc-950/[0.01] dark:bg-white/[0.02]"
              >
                {/* Header Row */}
                <div
                  onClick={() => toggleExpand(order.id)}
                  className="p-6 cursor-pointer flex flex-wrap justify-between items-center gap-4 hover:bg-zinc-950/[0.02] dark:hover:bg-white/5 transition-all select-none"
                >
                  <div className="flex flex-wrap gap-6 text-xs text-zinc-500">
                    <div>
                      <p className="text-[10px] uppercase font-bold text-zinc-400 dark:text-zinc-500 tracking-wider">Sipariş No</p>
                      <p className="font-bold text-zinc-900 dark:text-white mt-1 text-sm">#{order.id}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-bold text-zinc-400 dark:text-zinc-500 tracking-wider flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> Tarih
                      </p>
                      <p className="font-bold text-zinc-950 dark:text-zinc-300 mt-1">{formattedDate}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-bold text-zinc-400 dark:text-zinc-500 tracking-wider">Toplam Tutar</p>
                      <p className="font-extrabold text-zinc-950 dark:text-zinc-200 mt-1">{formatPrice(order.totalPrice)}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    {getStatusBadge(order.status)}
                    {isExpanded ? <ChevronUp className="w-4 h-4 text-zinc-400" /> : <ChevronDown className="w-4 h-4 text-zinc-400" />}
                  </div>
                </div>

                {/* Details Accordion Panel */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: 'auto' }}
                      exit={{ height: 0 }}
                      className="overflow-hidden border-t border-zinc-950/5 dark:border-white/5"
                    >
                      <div className="p-6 bg-zinc-950/[0.02] dark:bg-white/[0.01] space-y-6 text-sm">
                        
                        {/* Address detail */}
                        <div className="flex items-start gap-2 text-xs text-zinc-500 dark:text-zinc-400">
                          <MapPin className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />
                          <div>
                            <strong className="text-zinc-800 dark:text-zinc-200">{order.addressTitle}:</strong> {order.shippingAddress}
                          </div>
                        </div>

                        {/* Order Items Table */}
                        <div className="space-y-4">
                          <p className="text-xs uppercase font-bold tracking-wider text-zinc-400 dark:text-zinc-500">Sipariş İçeriği</p>
                          <div className="divide-y divide-zinc-950/5 dark:divide-white/5">
                            {order.orderItems.map((item) => (
                              <div
                                key={item.id}
                                className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-lg bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center font-bold text-zinc-500 text-xs shrink-0 select-none">
                                    {item.productName[0].toUpperCase()}
                                  </div>
                                  <div className="text-xs">
                                    <Link to={`/product/${item.productId}`} className="font-semibold text-zinc-950 dark:text-white hover:underline">
                                      {item.productName}
                                    </Link>
                                    <p className="text-zinc-400 mt-0.5">{formatPrice(item.price)} x {item.quantity}</p>
                                  </div>
                                </div>

                                <div className="flex items-center gap-4 text-xs font-semibold">
                                  <span className="text-zinc-400 dark:text-zinc-500">Durum:</span>
                                  {getStatusBadge(item.status)}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
