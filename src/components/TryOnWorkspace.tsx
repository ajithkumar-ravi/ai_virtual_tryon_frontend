import React, { useState, useRef } from 'react';
import { Shirt, Sparkles, UploadCloud, CheckCircle2, ArrowRight, Layers, AlertCircle, RefreshCw, X } from 'lucide-react';
import { Product, TryOnResponseData, TryOnStep } from '../types.js';
import { ImageUploader } from './ImageUploader.js';
import { LoadingAnimation } from './LoadingAnimation.js';
import { ResultViewer } from './ResultViewer.js';

interface TryOnWorkspaceProps {
  personFile: File | Blob | null;
  personPreviewUrl: string | null;
  onSetPersonPhoto: (file: File | Blob) => void;
  onRemovePersonPhoto: () => void;

  garmentFile: File | Blob | null;
  garmentPreviewUrl: string | null;
  selectedProduct: Product | null;
  onSelectProductGarment: (product: Product) => void;
  onUploadCustomGarment: (file: File | Blob, category?: string) => void;
  onRemoveGarment: () => void;

  category: string;
  onSetCategory: (cat: string) => void;

  loading: boolean;
  step: TryOnStep;
  statusMessage: string;
  resultData: TryOnResponseData | null;
  error: string | null;

  onGenerateTryOn: () => void;
  onTryAnotherOutfit: () => void;
  onResetAll: () => void;
  catalogProducts: Product[];
}

export const TryOnWorkspace: React.FC<TryOnWorkspaceProps> = ({
  personFile,
  personPreviewUrl,
  onSetPersonPhoto,
  onRemovePersonPhoto,
  garmentFile,
  garmentPreviewUrl,
  selectedProduct,
  onSelectProductGarment,
  onUploadCustomGarment,
  onRemoveGarment,
  category,
  onSetCategory,
  loading,
  step,
  statusMessage,
  resultData,
  error,
  onGenerateTryOn,
  onTryAnotherOutfit,
  onResetAll,
  catalogProducts,
}) => {
  const [garmentSourceTab, setGarmentSourceTab] = useState<'catalog' | 'upload'>('catalog');
  const garmentFileInputRef = useRef<HTMLInputElement | null>(null);

  const categories = ['T-Shirt', 'Shirt', 'Hoodie', 'Jacket', 'Dress', 'Top', 'Pants', 'Jeans', 'Skirt'];

  const handleCustomGarmentFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onUploadCustomGarment(e.target.files[0], category);
    }
  };

  // Compute CTA button state text & readiness
  const isPersonReady = Boolean(personFile);
  const isGarmentReady = Boolean(garmentFile || selectedProduct);
  const canGenerate = isPersonReady && isGarmentReady && !loading;

  let buttonText = 'Generate Virtual Try-On';
  if (loading) {
    buttonText = 'Creating your virtual outfit...';
  } else if (!isPersonReady) {
    buttonText = 'Upload your photo to begin';
  } else if (!isGarmentReady) {
    buttonText = 'Photo ready ✓ — Choose an outfit';
  }

  return (
    <section id="try-room" className="py-12 md:py-20 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Workspace Title Bar */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-500/20 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Interactive Virtual Fitting Room</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-neutral-900 dark:text-white tracking-tight">
            AI Virtual Trial Room
          </h2>
          <p className="mt-3 text-sm sm:text-base text-neutral-600 dark:text-neutral-400">
            Select or snap your photo, choose any outfit from the catalog or upload your own, and let Gemini render a photorealistic try-on preview.
          </p>
        </div>

        {/* If result is ready, present the ResultViewer first */}
        {resultData && personPreviewUrl ? (
          <div className="animate-in fade-in zoom-in-95 duration-300">
            <ResultViewer
              personImage={personPreviewUrl}
              resultData={resultData}
              garmentName={selectedProduct?.name || `${category} outfit`}
              category={category}
              onTryAnotherOutfit={onTryAnotherOutfit}
              onChangePhoto={onRemovePersonPhoto}
            />
          </div>
        ) : (
          /* Main 2-Column Fitting Studio Layout */
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Column 1: Person Photo */}
              <div className="lg:col-span-5 flex flex-col">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-emerald-700 text-white text-xs font-bold flex items-center justify-center">
                      1
                    </span>
                    <h3 className="font-bold text-base text-neutral-900 dark:text-white">
                      Your Photo
                    </h3>
                  </div>
                  {personPreviewUrl && (
                    <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Ready
                    </span>
                  )}
                </div>

                <div className="w-full">
                  <ImageUploader
                    previewUrl={personPreviewUrl}
                    onImageSelected={onSetPersonPhoto}
                    onImageRemoved={onRemovePersonPhoto}
                  />
                </div>
              </div>

              {/* Column 2: Garment Selection */}
              <div className="lg:col-span-7 flex flex-col">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-emerald-700 text-white text-xs font-bold flex items-center justify-center">
                      2
                    </span>
                    <h3 className="font-bold text-base text-neutral-900 dark:text-white">
                      Choose Garment
                    </h3>
                  </div>

                  {isGarmentReady && (
                    <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Outfit ready ✓
                    </span>
                  )}
                </div>

                {/* Garment Studio Container */}
                <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-5 shadow-sm flex flex-col justify-between">
                  {/* Tabs: Select Existing vs Upload Custom */}
                  <div className="flex items-center gap-2 p-1 rounded-xl bg-neutral-100 dark:bg-neutral-800/80 border border-neutral-200/50 dark:border-neutral-700/50 mb-5">
                    <button
                      type="button"
                      onClick={() => setGarmentSourceTab('catalog')}
                      className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-2 ${
                        garmentSourceTab === 'catalog'
                          ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-sm'
                          : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                      }`}
                    >
                      <Layers className="w-3.5 h-3.5" />
                      Select from Collection
                    </button>
                    <button
                      type="button"
                      onClick={() => setGarmentSourceTab('upload')}
                      className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-2 ${
                        garmentSourceTab === 'upload'
                          ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-sm'
                          : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                      }`}
                    >
                      <UploadCloud className="w-3.5 h-3.5" />
                      Upload Your Garment
                    </button>
                  </div>

                  {/* Active Garment Selection Banner if garment selected */}
                  {garmentPreviewUrl && (
                    <div className="mb-5 p-3.5 rounded-xl border border-emerald-500/30 bg-emerald-50/70 dark:bg-emerald-950/40 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={garmentPreviewUrl}
                          alt="Selected Garment"
                          referrerPolicy="no-referrer"
                          className="w-14 h-14 rounded-lg object-cover border border-emerald-500/40"
                        />
                        <div>
                          <div className="text-xs font-bold text-neutral-900 dark:text-white">
                            {selectedProduct ? selectedProduct.name : 'Custom Uploaded Garment'}
                          </div>
                          <div className="text-[11px] text-emerald-800 dark:text-emerald-300 font-medium mt-0.5">
                            Category: {category} {selectedProduct ? `• ₹${selectedProduct.price}` : ''}
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={onRemoveGarment}
                        className="p-1.5 rounded-lg text-neutral-500 hover:text-rose-600 hover:bg-white dark:hover:bg-neutral-900 transition-colors"
                        aria-label="Remove garment"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  {/* Category Filter Selector */}
                  <div className="mb-5">
                    <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 block mb-2">
                      Garment Category:
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {categories.map((cat) => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => onSetCategory(cat)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                            category === cat
                              ? 'bg-emerald-700 text-white font-semibold shadow-sm'
                              : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700'
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Tab 1: Collection Grid Picker */}
                  {garmentSourceTab === 'catalog' ? (
                    <div>
                      <div className="text-xs text-neutral-500 dark:text-neutral-400 mb-3 flex items-center justify-between">
                        <span>Click an item to select it for try-on:</span>
                        <span>{catalogProducts.length} styles</span>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-80 overflow-y-auto pr-1">
                        {catalogProducts.map((prod) => {
                          const isSelected = selectedProduct?.id === prod.id;
                          return (
                            <div
                              key={prod.id}
                              onClick={() => onSelectProductGarment(prod)}
                              className={`cursor-pointer rounded-xl p-2 border transition-all flex flex-col justify-between ${
                                isSelected
                                  ? 'border-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/40 ring-2 ring-emerald-500/30'
                                  : 'border-neutral-200 dark:border-neutral-800 hover:border-emerald-500/40'
                              }`}
                            >
                              <div className="aspect-[4/5] rounded-lg overflow-hidden bg-neutral-100 dark:bg-neutral-800 mb-2">
                                <img
                                  src={prod.image}
                                  alt={prod.name}
                                  referrerPolicy="no-referrer"
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div>
                                <div className="text-[11px] font-semibold text-neutral-900 dark:text-white truncate">
                                  {prod.name}
                                </div>
                                <div className="flex items-center justify-between text-[10px] text-neutral-500 dark:text-neutral-400 mt-0.5">
                                  <span>{prod.category}</span>
                                  <span className="font-bold text-neutral-900 dark:text-white">₹{prod.price}</span>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    /* Tab 2: Custom Garment Upload */
                    <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-neutral-300 dark:border-neutral-800 rounded-xl text-center bg-neutral-50/50 dark:bg-neutral-900/30">
                      <input
                        ref={garmentFileInputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={handleCustomGarmentFile}
                        className="hidden"
                      />
                      <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center mb-3">
                        <UploadCloud className="w-6 h-6" />
                      </div>
                      <h4 className="text-sm font-bold text-neutral-900 dark:text-white">
                        Upload your garment image
                      </h4>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 max-w-sm leading-relaxed">
                        For better results, upload a clear front-facing clothing image with minimal background.
                      </p>

                      <button
                        type="button"
                        onClick={() => garmentFileInputRef.current?.click()}
                        className="mt-4 px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-700 text-white hover:bg-emerald-800 shadow-sm transition-all"
                      >
                        Choose Garment File
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Error Banner */}
            {error && (
              <div className="p-4 rounded-xl border border-rose-500/30 bg-rose-50/80 dark:bg-rose-950/40 text-rose-800 dark:text-rose-200 flex items-center gap-3 text-xs">
                <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Processing State Animated Banner (Section 13) */}
            {loading && (
              <div className="rounded-2xl border border-emerald-500/30 bg-white dark:bg-neutral-900 shadow-xl overflow-hidden animate-in fade-in">
                <LoadingAnimation step={step} statusMessage={statusMessage} />
              </div>
            )}

            {/* Generation CTA Button */}
            <div className="flex flex-col items-center justify-center pt-4">
              <button
                type="button"
                onClick={onGenerateTryOn}
                disabled={!canGenerate}
                className={`relative group inline-flex items-center justify-center gap-3 px-10 py-4 rounded-2xl text-base font-bold transition-all shadow-lg active:scale-[0.98] ${
                  canGenerate
                    ? 'bg-emerald-700 hover:bg-emerald-800 text-white shadow-emerald-800/25 cursor-pointer'
                    : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-400 dark:text-neutral-500 cursor-not-allowed'
                }`}
              >
                {loading ? (
                  <RefreshCw className="w-5 h-5 animate-spin text-white" />
                ) : (
                  <Sparkles className="w-5 h-5 text-emerald-300" />
                )}
                <span>{buttonText}</span>
                {canGenerate && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
              </button>

              <div className="mt-3 text-[11px] text-neutral-400 dark:text-neutral-500 flex items-center gap-2">
                <span>Powered by Kwai-Kolors Diffusion VTON</span>
                <span>•</span>
                <span>High Accuracy Face & Garment Texture Preservation</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
