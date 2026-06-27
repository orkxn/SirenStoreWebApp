import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { ProductListDto } from '../types/api.types';
import { CartContext } from '../context/CartContext';
import { ShoppingBag } from 'lucide-react';

interface ProductCardProps {
  product: ProductListDto;
  onAdded?: () => void;
  onError?: (msg: string) => void;
}

export const formatPrice = (price: number) => {
  return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(price);
};

export const ProductCard: React.FC<ProductCardProps> = ({ product, onAdded, onError }) => {
  const cartContext = useContext(CartContext);
  const [isAdding, setIsAdding] = useState(false);

  const fallbackImage = `https://placehold.co/600x600/0a0a0a/fafafa?text=${encodeURIComponent(product.name)}`;

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault(); // Don't trigger navigation to Product Detail
    if (!cartContext) return;
    
    setIsAdding(true);
    try {
      await cartContext.addToCart(product.id, 1);
      if (onAdded) onAdded();
    } catch (err: any) {
      if (onError) onError(err.message || 'Ürün sepete eklenemedi.');
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <Link 
      to={`/product/${product.id}`}
      className="group relative flex flex-col glass-surface bg-zinc-950/[0.02] dark:bg-white/5 border border-zinc-950/5 dark:border-white/10 rounded-2xl p-4 overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:border-zinc-950/10 dark:hover:border-white/20"
    >
      {/* Product Image */}
      <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-900 mb-4">
        <img
          src={product.mainImageUrl || fallbackImage}
          alt={product.name}
          className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-zinc-950/60 backdrop-blur-sm flex items-center justify-center">
            <span className="text-white text-sm font-semibold tracking-wide uppercase px-3 py-1 border border-white/20 rounded-full">
              Tükendi
            </span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="flex flex-col flex-grow text-left">
        <div className="flex justify-between items-start mb-1">
          <span className="text-xs text-zinc-400 dark:text-zinc-500 font-medium uppercase tracking-wider">
            {product.storeName}
          </span>
          <span className="text-xs bg-zinc-950/5 dark:bg-white/5 px-2 py-0.5 rounded-full text-zinc-500 dark:text-zinc-400">
            {product.categoryName}
          </span>
        </div>
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50 line-clamp-1 group-hover:text-black dark:group-hover:text-white transition-colors">
          {product.name}
        </h3>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2 mt-1 min-h-[2rem]">
          {product.description}
        </p>

        {/* Price & CTA */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-zinc-950/5 dark:border-white/5">
          <span className="text-sm font-bold text-zinc-900 dark:text-zinc-50">
            {formatPrice(product.price)}
          </span>
          
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0 || isAdding}
            className="flex items-center justify-center p-2.5 rounded-full bg-zinc-950 text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300 shadow-md"
            aria-label="Sepete Ekle"
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
        </div>
      </div>
    </Link>
  );
};
