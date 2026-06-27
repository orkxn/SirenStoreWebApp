import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { productService } from '../../services/productService';
import { categoryService } from '../../services/categoryService';
import { ProductListDto, CategoryDto } from '../../types/api.types';
import { useToast } from '../../context/ToastContext';
import { ProductCard } from '../../components/ProductCard';
import { ProductGridSkeleton } from '../../components/Skeleton';
import { Button } from '../../components/Button';
import { Search, Filter, ArrowUpDown } from 'lucide-react';

export const Products: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { showToast } = useToast();

  const [products, setProducts] = useState<ProductListDto[]>([]);
  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [minPrice, setMinPrice] = useState<number | ''>('');
  const [maxPrice, setMaxPrice] = useState<number | ''>('');
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [sortBy, setSortBy] = useState<string>('default');

  // URL Category query synchronization
  useEffect(() => {
    const catQuery = searchParams.get('category');
    if (catQuery) {
      setSelectedCategory(parseInt(catQuery, 10));
    } else {
      setSelectedCategory(null);
    }
  }, [searchParams]);

  useEffect(() => {
    const loadFiltersAndProducts = async () => {
      setIsLoading(true);
      try {
        const [prodData, catData] = await Promise.all([
          productService.getAll(),
          categoryService.getAll(),
        ]);
        setProducts(prodData);
        setCategories(catData);
      } catch (err: any) {
        showToast(err.message || 'Ürün kataloğu yüklenemedi.', 'error');
      } finally {
        setIsLoading(false);
      }
    };
    loadFiltersAndProducts();
  }, []);

  const handleCategorySelect = (categoryId: number | null) => {
    setSelectedCategory(categoryId);
    if (categoryId) {
      setSearchParams({ category: categoryId.toString() });
    } else {
      setSearchParams({});
    }
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedCategory(null);
    setMinPrice('');
    setMaxPrice('');
    setOnlyInStock(false);
    setSortBy('default');
    setSearchParams({});
  };

  // Filter & Sort evaluation
  const filteredProducts = products
    .filter((p) => {
      // 1. Search term match
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            p.storeName.toLowerCase().includes(searchTerm.toLowerCase());
      
      // 2. Category match
      const matchesCategory = selectedCategory ? p.categoryId === selectedCategory : true;

      // 3. Price range match
      const matchesMinPrice = minPrice === '' ? true : p.price >= minPrice;
      const matchesMaxPrice = maxPrice === '' ? true : p.price <= maxPrice;

      // 4. Stock match
      const matchesStock = onlyInStock ? p.stock > 0 : true;

      return matchesSearch && matchesCategory && matchesMinPrice && matchesMaxPrice && matchesStock;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        default:
          return 0; // Natural API sort
      }
    });

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-8">
      
      {/* Header Info */}
      <div className="text-left border-b border-zinc-950/5 dark:border-white/5 pb-6">
        <h1 className="text-4xl font-extrabold tracking-tight text-zinc-950 dark:text-white uppercase">
          Tüm Ürünler
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          Aradığınız tarzda yüzlerce monokrom tasarımı keşfedin.
        </p>
      </div>

      {/* Grid containing Sidebar and Results */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left Sidebar Filters (Glass Panel) */}
        <aside className="lg:col-span-1 h-fit glass-surface bg-zinc-950/[0.01] dark:bg-white/5 border border-zinc-950/5 dark:border-white/10 p-6 rounded-2xl space-y-6 text-left">
          
          <div className="flex items-center justify-between border-b border-zinc-950/5 dark:border-white/5 pb-4">
            <span className="font-bold flex items-center gap-2 text-zinc-900 dark:text-white uppercase text-sm">
              <Filter className="w-4 h-4" /> Filtreler
            </span>
            <button 
              onClick={handleResetFilters}
              className="text-xs text-zinc-500 hover:text-zinc-950 dark:hover:text-white underline cursor-pointer"
            >
              Temizle
            </button>
          </div>

          {/* Search Input */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wide">Ürün Ara</span>
            <div className="relative">
              <input
                type="text"
                placeholder="İsim, açıklama veya mağaza..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full text-xs bg-transparent border border-zinc-300 dark:border-zinc-800 rounded-xl pl-9 pr-4 py-2.5 text-zinc-900 dark:text-white outline-none focus:border-zinc-950 dark:focus:border-white transition-all"
              />
              <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
            </div>
          </div>

          {/* Categories list */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wide">Kategoriler</span>
            <div className="flex flex-col gap-1.5 max-h-48 overflow-y-auto pr-1">
              <button
                onClick={() => handleCategorySelect(null)}
                className={`text-xs text-left px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                  selectedCategory === null 
                    ? 'bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 font-semibold' 
                    : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-950/5 dark:hover:bg-white/5'
                }`}
              >
                Tümü
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleCategorySelect(cat.id)}
                  className={`text-xs text-left px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                    selectedCategory === cat.id 
                      ? 'bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 font-semibold' 
                      : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-950/5 dark:hover:bg-white/5'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Filter */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wide">Fiyat Aralığı</span>
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="Min ₺"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full text-xs bg-transparent border border-zinc-300 dark:border-zinc-800 rounded-xl px-3 py-2 text-zinc-900 dark:text-white outline-none focus:border-zinc-950 dark:focus:border-white"
              />
              <span className="text-zinc-400 text-xs">-</span>
              <input
                type="number"
                placeholder="Max ₺"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full text-xs bg-transparent border border-zinc-300 dark:border-zinc-800 rounded-xl px-3 py-2 text-zinc-900 dark:text-white outline-none focus:border-zinc-950 dark:focus:border-white"
              />
            </div>
          </div>

          {/* Stock Filter Switch */}
          <div className="flex items-center justify-between pt-2 border-t border-zinc-950/5 dark:border-white/5">
            <span className="text-xs font-bold text-zinc-600 dark:text-zinc-400">Sadece Stokta Olanlar</span>
            <label className="relative inline-flex items-center cursor-pointer select-none">
              <input
                type="checkbox"
                checked={onlyInStock}
                onChange={(e) => setOnlyInStock(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-zinc-200 dark:bg-zinc-800 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white dark:after:bg-zinc-900 after:border-zinc-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-zinc-950 dark:peer-checked:bg-white" />
            </label>
          </div>

        </aside>

        {/* Right side Products Grid & Sorting */}
        <main className="lg:col-span-3 space-y-6">
          
          {/* Sorting / Header Actions */}
          <div className="flex items-center justify-between flex-wrap gap-4 glass-surface bg-zinc-950/[0.01] dark:bg-white/5 border border-zinc-950/5 dark:border-white/10 px-6 py-3 rounded-2xl text-xs text-zinc-500 text-left">
            <span>
              Toplam <strong className="text-zinc-900 dark:text-white font-semibold">{filteredProducts.length}</strong> ürün listeleniyor
            </span>
            
            <div className="flex items-center gap-2">
              <ArrowUpDown className="w-3.5 h-3.5" />
              <span>Sıralama:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent border-none text-zinc-900 dark:text-white font-bold cursor-pointer outline-none focus:ring-0"
              >
                <option value="default">Önerilen</option>
                <option value="price-low">Fiyat: Artan</option>
                <option value="price-high">Fiyat: Azalan</option>
                <option value="name-asc">İsim: A - Z</option>
                <option value="name-desc">İsim: Z - A</option>
              </select>
            </div>
          </div>

          {/* Grid Products */}
          {isLoading ? (
            <ProductGridSkeleton count={6} />
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAdded={() => showToast(`${product.name} sepete eklendi!`, 'success')}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-3xl">
              <p className="text-zinc-500 font-medium">Aramanıza uygun ürün bulunamadı.</p>
              <button 
                onClick={handleResetFilters}
                className="mt-4 text-xs font-bold bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 px-4 py-2 rounded-full hover:opacity-85 transition-opacity"
              >
                Filtreleri Sıfırla
              </button>
            </div>
          )}

        </main>
      </div>

    </div>
  );
};
