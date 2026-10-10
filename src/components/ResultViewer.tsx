import React, { useState } from 'react';
import { Download, RefreshCw, Shirt, Sparkles, SlidersHorizontal, Columns2, Share2, ShieldAlert, Check, Info, Sparkle, Compass, Layers } from 'lucide-react';
import { BeforeAfterSlider } from './BeforeAfterSlider.js';
import { TryOnResponseData } from '../types.js';

interface ResultViewerProps {
  personImage: string;
  resultData: TryOnResponseData;
  garmentName?: string;
  category?: string;
  onTryAnotherOutfit: () => void;
  onChangePhoto: () => void;
  onShare?: () => void;
}

export const ResultViewer: React.FC<ResultViewerProps> = ({
  personImage,
  resultData,
  garmentName,
  category,
  onTryAnotherOutfit,
  onChangePhoto,
}) => {
  const [viewMode, setViewMode] = useState<'slider' | 'side-by-side'>('slider');
  const [copied, setCopied] = useState(false);

  const stylist = resultData.metadata?.aiStylistAnalysis as {
    fitScore?: number;
    fitSummary?: string;
    drapingPhysics?: string;
    colorHarmony?: string;
    stylingRecommendation?: string;
    garmentHighlights?: string[];
  } | undefined;

  const handleDownload = async () => {
    try {
      const response = await fetch(resultData.resultImage);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'virtual-try-on-result.jpg';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Download failed, using direct anchor fallback', err);
      const a = document.createElement('a');
      a.href = resultData.resultImage;
      a.download = 'virtual-try-on-result.jpg';
      a.target = '_blank';
      a.click();
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My AI Virtual Try-On Look',
          text: `Check out my virtual try-on outfit generated with AuraFit!`,
          url: window.location.href,
        });
      } catch (e) {
        console.log('Share canceled or not allowed', e);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="w-full rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-6 sm:p-8 shadow-xl">
      {/* Top Bar / Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-100 dark:border-neutral-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 mb-1.5">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Virtual Try-On Ready</span>
          </div>
          <h3 className="font-display text-2xl font-bold text-neutral-900 dark:text-white">
            {garmentName ? `Styled with ${garmentName}` : 'Your Virtual Outfit'}
          </h3>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Rendered with {resultData.model} ({Math.round(resultData.processingTimeMs / 100) / 10}s)
          </p>
        </div>

        {/* View mode toggle */}
        <div className="flex items-center gap-1 bg-neutral-100 dark:bg-neutral-800/80 p-1 rounded-xl self-start sm:self-auto border border-neutral-200/60 dark:border-neutral-700/50">
          <button
            onClick={() => setViewMode('slider')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              viewMode === 'slider'
                ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-sm'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            Interactive Slider
          </button>
          <button
            onClick={() => setViewMode('side-by-side')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              viewMode === 'side-by-side'
                ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-sm'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            <Columns2 className="w-3.5 h-3.5" />
            Side by Side
          </button>
        </div>
      </div>

      {/* Main View Area */}
      <div className="mt-6">
        {viewMode === 'slider' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center max-w-5xl mx-auto">
            {/* Feature Highlights matching reference */}
            <div className="lg:col-span-5 flex flex-col justify-center">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-2">
                See the magic in action
              </span>
              <h4 className="font-display text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white leading-snug">
                Realistic Virtual Try-On
              </h4>
              <p className="mt-2 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                Drag the interactive slider to inspect how the outfit drapes, folds, and conforms to the body with authentic lighting and fabric physics.
              </p>

              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2.5">
                {[
                  'Texture-aware draping',
                  'Accurate lighting match',
                  'Natural skin tones',
                  'True-to-size fit preview',
                ].map((feat, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200/80 dark:border-neutral-700/60 text-xs font-medium text-neutral-800 dark:text-neutral-200"
                  >
                    <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Interactive Slider */}
            <div className="lg:col-span-7">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <BeforeAfterSlider
                  originalImage={personImage}
                  resultImage={resultData.resultImage}
                  aspectRatioClass="aspect-[3/4]"
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Original Card */}
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 mb-2 flex items-center gap-1">
                Original Photo
              </span>
              <div className="relative rounded-2xl overflow-hidden aspect-[3/4] bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-md">
                <img
                  src={personImage}
                  alt="Original portrait"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-top"
                />
              </div>
            </div>

            {/* Try-On Result Card */}
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 mb-2 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                AI Virtual Try-On
              </span>
              <div className="relative rounded-2xl overflow-hidden aspect-[3/4] bg-neutral-900 border border-emerald-500/40 shadow-lg shadow-emerald-950/10">
                <img
                  src={resultData.resultImage}
                  alt="AI Try-On Result"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-top"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Gemini AI Stylist Fit & Draping Analysis */}
      {stylist && (
        <div className="mt-8 rounded-2xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200/80 dark:border-neutral-700/70 p-5 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-neutral-200/70 dark:border-neutral-700/60">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                <Sparkle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <h4 className="font-display text-base font-bold text-neutral-900 dark:text-white">
                  AI Stylist & Fit Assessment
                </h4>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  Multimodal vision analysis of your body contours and garment drape
                </p>
              </div>
            </div>

            {stylist.fitScore && (
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white dark:bg-neutral-900 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-xs font-bold shadow-sm self-start sm:self-auto">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>{stylist.fitScore}% Fit Match</span>
              </div>
            )}
          </div>

          <p className="mt-4 text-sm text-neutral-800 dark:text-neutral-200 leading-relaxed">
            {stylist.fitSummary}
          </p>

          <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Drape Physics */}
            <div className="p-3.5 rounded-xl bg-white dark:bg-neutral-900/90 border border-neutral-200/60 dark:border-neutral-700/50">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 mb-1.5">
                <Layers className="w-3.5 h-3.5" />
                Fabric & Draping
              </span>
              <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-normal">
                {stylist.drapingPhysics}
              </p>
            </div>

            {/* Color Harmony */}
            <div className="p-3.5 rounded-xl bg-white dark:bg-neutral-900/90 border border-neutral-200/60 dark:border-neutral-700/50">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 mb-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Color Harmony
              </span>
              <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-normal">
                {stylist.colorHarmony}
              </p>
            </div>

            {/* Styling Recommendation */}
            <div className="p-3.5 rounded-xl bg-white dark:bg-neutral-900/90 border border-neutral-200/60 dark:border-neutral-700/50">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 mb-1.5">
                <Compass className="w-3.5 h-3.5" />
                Styling Advice
              </span>
              <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-normal">
                {stylist.stylingRecommendation}
              </p>
            </div>
          </div>

          {/* Garment Highlights */}
          {stylist.garmentHighlights && stylist.garmentHighlights.length > 0 && (
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-semibold text-neutral-500 dark:text-neutral-400 mr-1">
                Highlights:
              </span>
              {stylist.garmentHighlights.map((hl, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/50 text-[11px] text-emerald-800 dark:text-emerald-300 font-medium"
                >
                  {hl}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Processing Metadata Note */}
      {resultData.metadata?.note && (
        <div className="mt-6 p-3.5 rounded-2xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700/60 text-xs text-neutral-700 dark:text-neutral-300 flex items-start gap-2.5">
          <Info className="w-4 h-4 mt-0.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
          <div>
            <span className="font-semibold text-neutral-900 dark:text-white">Fidelity Details: </span>
            <span>{resultData.metadata.note}</span>
          </div>
        </div>
      )}

      {/* Actions Toolbar */}
      <div className="mt-8 pt-6 border-t border-neutral-100 dark:border-neutral-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={onTryAnotherOutfit}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-emerald-700 hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 shadow-md shadow-emerald-800/20 active:scale-95 transition-all"
          >
            <Shirt className="w-4 h-4" />
            Try Another Outfit
          </button>

          <button
            onClick={onChangePhoto}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-neutral-700 dark:text-neutral-200 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 active:scale-95 transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Change Photo
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800 active:scale-95 transition-all"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Share2 className="w-4 h-4" />}
            <span>{copied ? 'Link Copied' : 'Share'}</span>
          </button>

          <button
            onClick={handleDownload}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-neutral-900 dark:text-white bg-emerald-100 dark:bg-emerald-950/70 border border-emerald-300 dark:border-emerald-700 hover:bg-emerald-200 dark:hover:bg-emerald-900 active:scale-95 transition-all"
          >
            <Download className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
            Download Result
          </button>
        </div>
      </div>

      {/* Safety Disclaimer (Prompt Section 58) */}
      <div className="mt-6 flex items-center justify-center gap-2 text-center text-[11px] text-neutral-500 dark:text-neutral-400 bg-neutral-50 dark:bg-neutral-950/40 p-3 rounded-xl border border-neutral-100 dark:border-neutral-800/80">
        <ShieldAlert className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
        <p>
          AI-generated try-on images are visual previews and may not perfectly represent actual fit, color, fabric texture, or appearance.
        </p>
      </div>
    </div>
  );
};
