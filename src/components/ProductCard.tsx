import React from 'react';
import { Product } from '../types.js';
import { Eye, Shirt, Sparkles } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onSelectTryOn: (product: Product) => void;
  onQuickView?: (product: Product) => void;
  isSelected?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onSelectTryOn,
  onQuickView,
  isSelected = false,
}) => {
  return (
    <div
      className={`group relative rounded-2xl overflow-hidden bg-white dark:bg-neutral-900 border transition-all duration-300 flex flex-col justify-between ${
        isSelected
          ? 'border-emerald-600 dark:border-emerald-500 ring-2 ring-emerald-600/30 shadow-lg shadow-emerald-700/10'
          : 'border-neutral-200 dark:border-neutral-800 hover:border-emerald-500/40 hover:shadow-md'
      }`}
    >
      {/* Image Container */}
      <div className="relative aspect-[4/5] overflow-hidden bg-neutral-100 dark:bg-neutral-800">
        <img
          src={product.image}
          alt={product.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
        />

        {/* Category Badge */}
        <div className="absolute top-3 left-3 backdrop-blur-md bg-black/60 text-white text-[11px] font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider">
          {product.category}
        </div>

        {/* Selected Indicator */}
        {isSelected && (
          <div className="absolute top-3 right-3 bg-emerald-600 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-sm flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            Selected
          </div>
        )}

        {/* Quick View Button on Hover */}
        {onQuickView && (
          <button
            onClick={() => onQuickView(product)}
            className="absolute bottom-3 right-3 p-2 rounded-xl bg-white/90 dark:bg-neutral-900/90 text-neutral-800 dark:text-neutral-100 opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm shadow-md hover:bg-white dark:hover:bg-neutral-900"
            aria-label={`Quick view ${product.name}`}
          >
            <Eye className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col flex-grow justify-between">
        <div>
          <div className="flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400 mb-1">
            <span>{product.color}</span>
            <span className="font-medium text-emerald-700 dark:text-emerald-400">In Stock</span>
          </div>
          <h4 className="font-semibold text-sm text-neutral-900 dark:text-white line-clamp-1 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
            {product.name}
          </h4>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 line-clamp-1">
            {product.description}
          </p>
        </div>

        <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between gap-2">
          <div className="text-base font-bold text-neutral-900 dark:text-white">
            ₹{product.price.toLocaleString('en-IN')}
          </div>

          <button
            onClick={() => onSelectTryOn(product)}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all active:scale-95 ${
              isSelected
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-700 hover:text-white dark:hover:bg-emerald-600'
            }`}
          >
            <Shirt className="w-3.5 h-3.5" />
            {isSelected ? 'Selected ✓' : 'Try This On'}
          </button>
        </div>
      </div>
    </div>
  );
};
