import React, { useEffect, useState, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { productService } from '../../services/productService';
import { ProductListDto } from '../../types/api.types';
import { useToast } from '../../context/ToastContext';
import { CartContext } from '../../context/CartContext';
import { formatPrice, ProductCard } from '../../components/ProductCard';
import { Button } from '../../components/Button';
import { Skeleton } from '../../components/Skeleton';
import { ChevronLeft, ShoppingBag, Plus, Minus, Info, ShieldCheck, Truck } from 'lucide-react';

export const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { showToast } = useToast();
  const cartContext = useContext(CartContext);

  const [product, setProduct] = useState<ProductListDto | null>(null);
  const [similarProducts, setSimilarProducts] = useState<ProductListDto[]>([]);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    const loadProductData = async () => {
      if (!id) return;
      setIsLoading(true);
      try {
        const prodId = parseInt(id, 10);
        const data = await productService.getById(prodId);
        setProduct(data);
        
        // Default select main image
        const fallbackImage = `https://placehold.co/600x600/0a0a0a/fafafa?text=${encodeURIComponent(data.name)}`;
        setSelectedImage(data.mainImageUrl || data.imageUrls[0] || fallbackImage);

        // Reset quantity
        setQuantity(1);

        // Load similar products in the same category
        const similar = await productService.getByCategoryId(data.categoryId);
        setSimilarProducts(similar.filter((p) => p.id !== data.id).slice(0, 4));
      } catch (err: any) {
        showToast(err.message || 'Ürün yüklenirken bir hata oluştu.', 'error');
      } finally {
        setIsLoading(false);
      }
    };
    loadProductData();
  }, [id]);

  const handleIncrement = () => {
    if (!product) return;
    if (quantity < product.stock) {
      setQuantity((prev) => prev + 1);
    } else {
      showToast('Mağaza stok limitine ulaştınız.', 'info');
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleAddToCart = async () => {
    if (!product || !cartContext) return;
    setIsAdding(true);
    try {
      await cartContext.addToCart(product.id, quantity);
      showToast(`${quantity} adet ${product.name} sepetinize eklendi.`, 'success');
    } catch (err: any) {
      showToast(err.message || 'Ürün sepete eklenemedi.', 'error');
    } finally {
      setIsAdding(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-10 space-y-8 animate-pulse text-left">
        <Skeleton className="h-6 w-32 mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <Skeleton className="aspect-square w-full rounded-2xl" />
          <div className="space-y-6">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-12 w-full rounded-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-20 text-center">
        <p className="text-zinc-500 font-medium text-lg">Ürün bulunamadı.</p>
        <Link to="/products" className="mt-4 inline-flex items-center text-sm font-bold text-zinc-950 dark:text-white underline">
          Kataloğa Dön
        </Link>
      </div>
    );
  }

  const defaultPlaceholder = `https://placehold.co/600x600/0a0a0a/fafafa?text=${encodeURIComponent(product.name)}`;
  // Compile list of all images, deduplicating mainImageUrl
  const allImages = Array.from(new Set([
    product.mainImageUrl, 
    ...(product.imageUrls || [])
  ])).filter(Boolean) as string[];

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-16 text-left">
      
      {/* Back Button */}
      <div>
        <Link 
          to="/products"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-zinc-950 dark:hover:text-white transition-colors"
        >
          <ChevronLeft className="w-4 h-4" /> Kataloğa Dön
        </Link>
      </div>

      {/* Grid container for Images and Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        
        {/* Left Column: Image Gallery */}
        <div className="space-y-4">
          <div className="aspect-square w-full overflow-hidden rounded-2xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-950/5 dark:border-white/10 relative">
            <img
              src={selectedImage || defaultPlaceholder}
              alt={product.name}
              className="h-full w-full object-cover object-center transition-all duration-300"
            />
            {product.stock === 0 && (
              <div className="absolute inset-0 bg-zinc-950/60 backdrop-blur-sm flex items-center justify-center">
                <span className="text-white text-base font-bold tracking-wide uppercase px-4 py-2 border border-white/20 rounded-full">
                  Stokta Yok
                </span>
              </div>
            )}
          </div>

          {/* Thumbnails list */}
          {allImages.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {allImages.map((imgUrl, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(imgUrl)}
                  className={`relative w-20 h-20 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                    selectedImage === imgUrl 
                      ? 'border-zinc-950 dark:border-white' 
                      : 'border-transparent opacity-65 hover:opacity-100'
                  }`}
                >
                  <img src={imgUrl} alt={`Resim ${index + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Product details */}
        <div className="flex flex-col space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
                Mağaza:{' '}
                <Link to={`/store/${product.sellerId}`} className="hover:underline text-zinc-900 dark:text-zinc-300 font-bold transition-all normal-case">
                  {product.storeName}
                </Link>
              </span>
              <span className="text-xs bg-zinc-950/5 dark:bg-white/5 border border-zinc-950/5 dark:border-white/10 px-3 py-1 rounded-full text-zinc-500 dark:text-zinc-400 font-medium">
                {product.categoryName}
              </span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-950 dark:text-white uppercase leading-none">
              {product.name}
            </h1>
          </div>

          {/* Pricing */}
          <div className="text-3xl font-extrabold text-zinc-950 dark:text-white">
            {formatPrice(product.price)}
          </div>

          {/* Description */}
          <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">
            {product.description}
          </p>

          {/* Specifications Box */}
          <div className="grid grid-cols-3 gap-4 py-4 border-y border-zinc-950/5 dark:border-white/5 text-center text-xs">
            <div className="flex flex-col items-center gap-1">
              <Truck className="w-5 h-5 text-zinc-400" />
              <span className="font-semibold text-zinc-900 dark:text-white">Hızlı Kargo</span>
              <span className="text-zinc-400">24-48 Saat</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <ShieldCheck className="w-5 h-5 text-zinc-400" />
              <span className="font-semibold text-zinc-900 dark:text-white">Güvenilir Satıcı</span>
              <span className="text-zinc-400">Onaylı Mağaza</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <Info className="w-5 h-5 text-zinc-400" />
              <span className="font-semibold text-zinc-900 dark:text-white">İade Garantisi</span>
              <span className="text-zinc-400">14 Gün Kolay</span>
            </div>
          </div>

          {/* Action Row: Count and Add to Cart */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
            
            {/* Quantity Counter */}
            <div className="flex items-center justify-between border border-zinc-300 dark:border-zinc-800 rounded-full px-4 py-3 sm:w-36 bg-zinc-950/[0.01] dark:bg-white/[0.01]">
              <button 
                onClick={handleDecrement}
                disabled={product.stock === 0}
                className="text-zinc-400 hover:text-zinc-950 dark:hover:text-white disabled:opacity-30"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="text-sm font-bold text-zinc-900 dark:text-white select-none">
                {product.stock === 0 ? 0 : quantity}
              </span>
              <button 
                onClick={handleIncrement}
                disabled={product.stock === 0}
                className="text-zinc-400 hover:text-zinc-950 dark:hover:text-white disabled:opacity-30"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Add to Cart CTA */}
            <Button
              onClick={handleAddToCart}
              disabled={product.stock === 0 || isAdding}
              variant="primary"
              size="lg"
              className="flex-grow group shadow-lg"
            >
              <ShoppingBag className="w-5 h-5 mr-2" />
              {isAdding ? 'Sepete Ekleniyor...' : 'Sepete Ekle'}
            </Button>

          </div>

          {/* Stock Info tag */}
          <div className="text-xs font-semibold text-zinc-500">
            {product.stock > 0 ? (
              <span>Mağaza Stoğu: <strong className="text-zinc-800 dark:text-zinc-200">{product.stock} adet</strong> mevcut</span>
            ) : (
              <span className="text-red-500 font-bold">Stokta Kalmadı!</span>
            )}
          </div>

        </div>

      </div>

      {/* Similar products Section */}
      {similarProducts.length > 0 && (
        <div className="border-t border-zinc-950/5 dark:border-white/5 pt-12 space-y-6">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-zinc-950 dark:text-white uppercase">
              Benzer Ürünler
            </h2>
            <p className="text-xs text-zinc-500">Aynı kategorideki diğer popüler ürünler.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {similarProducts.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                onAdded={() => showToast(`${p.name} sepete eklendi!`, 'success')}
              />
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
