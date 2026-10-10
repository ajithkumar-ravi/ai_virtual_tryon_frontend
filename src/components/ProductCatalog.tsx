import React, { useState, useEffect } from 'react';
import { Product } from '../types.js';
import { ApiService } from '../services/api.js';
import { ProductCard } from './ProductCard.js';
import { ProductDetailsModal } from './ProductDetailsModal.js';
import { Search, Filter, RefreshCw, Sparkles } from 'lucide-react';

interface ProductCatalogProps {
  onSelectProduct: (product: Product) => void;
  selectedProductId?: string | null;
}

export const ProductCatalog: React.FC<ProductCatalogProps> = ({
  onSelectProduct,
  selectedProductId,
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>(['All']);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function load() {
      setLoading(true);
      try {
        const data = await ApiService.getProducts({
          category: selectedCategory,
          search: searchQuery,
        });
        if (isMounted) {
          setProducts(data.products);
          if (data.categories && data.categories.length > 0) {
            setCategories(data.categories);
          }
        }
      } catch (err) {
        console.error('Failed to load products', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    const timeout = setTimeout(load, searchQuery ? 250 : 0);
    return () => {
      isMounted = false;
      clearTimeout(timeout);
    };
  }, [selectedCategory, searchQuery]);

  return (
    <section id="catalog" className="py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-emerald-700 dark:text-emerald-400 mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              Wardrobe Collection
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-neutral-900 dark:text-white tracking-tight">
              Curated Garment Catalog
            </h2>
            <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400 max-w-xl">
              Select any piece to immediately test the virtual fit on your photo in our AI Virtual Room.
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              placeholder="Search garments, colors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-sm text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-neutral-400 hover:text-neutral-600"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                  isSelected
                    ? 'bg-emerald-700 text-white shadow-sm shadow-emerald-800/20'
                    : 'bg-neutral-100 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-800'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div
                key={i}
                className="rounded-2xl bg-neutral-100 dark:bg-neutral-900/60 aspect-[3/4] animate-pulse border border-neutral-200/50 dark:border-neutral-800/50"
              />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="py-16 text-center rounded-2xl border border-dashed border-neutral-300 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/30">
            <Filter className="w-10 h-10 text-neutral-400 mx-auto mb-3" />
            <h4 className="text-base font-semibold text-neutral-800 dark:text-neutral-200">
              No matching clothing found
            </h4>
            <p className="text-xs text-neutral-500 mt-1">
              Try adjusting your category filter or search query.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
              }}
              className="mt-4 px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                isSelected={selectedProductId === product.id}
                onSelectTryOn={(p) => {
                  onSelectProduct(p);
                  // Scroll smoothly to virtual room
                  const tryRoomEl = document.getElementById('try-room');
                  if (tryRoomEl) {
                    tryRoomEl.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                onQuickView={(p) => setQuickViewProduct(p)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Quick View Modal */}
      {quickViewProduct && (
        <ProductDetailsModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
          onSelectTryOn={(p) => {
            onSelectProduct(p);
            const tryRoomEl = document.getElementById('try-room');
            if (tryRoomEl) {
              tryRoomEl.scrollIntoView({ behavior: 'smooth' });
            }
          }}
        />
      )}
    </section>
  );
};
