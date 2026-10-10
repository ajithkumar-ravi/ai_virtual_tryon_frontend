import React, { useState } from 'react';
import { Product } from '../types.js';
import { X, Shirt, Check, Sparkles, ShieldCheck, Truck } from 'lucide-react';

interface ProductDetailsModalProps {
  product: Product;
  onClose: () => void;
  onSelectTryOn: (product: Product) => void;
}

export const ProductDetailsModal: React.FC<ProductDetailsModalProps> = ({
  product,
  onClose,
  onSelectTryOn,
}) => {
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[0] || 'M');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-2xl rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-2xl overflow-hidden flex flex-col md:flex-row">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/80 dark:bg-neutral-800/80 text-neutral-600 dark:text-neutral-300 hover:bg-white dark:hover:bg-neutral-800"
          aria-label="Close product preview"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Image Column */}
        <div className="md:w-1/2 aspect-[4/5] md:aspect-auto relative bg-neutral-100 dark:bg-neutral-800">
          <img
            src={product.image}
            alt={product.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute top-4 left-4 backdrop-blur-md bg-black/60 text-white text-xs font-semibold px-3 py-1 rounded-full">
            {product.category}
          </div>
        </div>

        {/* Details Column */}
        <div className="p-6 md:w-1/2 flex flex-col justify-between">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
              {product.color}
            </div>
            <h3 className="text-xl font-bold text-neutral-900 dark:text-white mt-1">
              {product.name}
            </h3>
            <div className="text-2xl font-bold text-neutral-900 dark:text-white mt-2">
              ₹{product.price.toLocaleString('en-IN')}
            </div>

            <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-4 leading-relaxed">
              {product.description}
            </p>

            {/* Size Selector */}
            <div className="mt-6">
              <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 block mb-2">
                Select Size
              </label>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((sz) => (
                  <button
                    key={sz}
                    onClick={() => setSelectedSize(sz)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                      selectedSize === sz
                        ? 'border-emerald-600 bg-emerald-600 text-white shadow-sm'
                        : 'border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:border-emerald-500'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            {/* Micro value props */}
            <div className="mt-6 pt-4 border-t border-neutral-100 dark:border-neutral-800 grid grid-cols-2 gap-3 text-[11px] text-neutral-500 dark:text-neutral-400">
              <div className="flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Express Shipping</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Quality Verified</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-6 pt-4 border-t border-neutral-100 dark:border-neutral-800 flex gap-3">
            <button
              onClick={() => {
                onSelectTryOn(product);
                onClose();
              }}
              className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold text-white bg-emerald-700 hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 shadow-md shadow-emerald-700/20 active:scale-95 transition-all"
            >
              <Sparkles className="w-4 h-4" />
              Try On In Virtual Room
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
