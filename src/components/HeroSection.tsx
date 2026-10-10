import React from 'react';
import { ArrowRight, Sparkles, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';

interface HeroSectionProps {
  onStartTryOn: () => void;
  onExploreCatalog: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onStartTryOn, onExploreCatalog }) => {
  return (
    <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28">
      {/* Subtle organic green ambient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-emerald-500/10 dark:bg-emerald-500/15 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Text Content */}
          <div className="lg:col-span-7 flex flex-col items-start">
            {/* Top pill badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-50/80 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-xs font-semibold tracking-wide mb-6">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Kwai-Kolors Virtual Try-On Engine</span>
            </div>

            {/* Headline */}
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-neutral-900 dark:text-white leading-[1.12]">
              Try Before You Buy{' '}
              <span className="italic font-normal text-emerald-700 dark:text-emerald-400">
                with AI
              </span>
            </h1>

            {/* Subtitle */}
            <p className="mt-6 text-lg sm:text-xl text-neutral-600 dark:text-neutral-300 max-w-2xl font-normal leading-relaxed">
              See how your favorite outfits look on you using AI-powered virtual try-on technology.
              Upload a snapshot or snap a photo with your camera to instantly preview realistic garment drape, texture, and fit.
            </p>

            {/* CTA Buttons */}
            <div className="mt-8 flex flex-wrap items-center gap-4 w-full sm:w-auto">
              <button
                onClick={onStartTryOn}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-base font-semibold text-white bg-emerald-700 hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 shadow-md shadow-emerald-800/20 active:scale-[0.98] transition-all cursor-pointer"
              >
                <span>Try Virtual Room</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onExploreCatalog}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl text-base font-semibold text-neutral-700 dark:text-neutral-200 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800/60 active:scale-[0.98] transition-all cursor-pointer"
              >
                <span>Explore Clothes</span>
              </button>
            </div>

            {/* Proof Points */}
            <div className="mt-10 pt-8 border-t border-neutral-200 dark:border-neutral-800/80 grid grid-cols-3 gap-6 w-full max-w-lg">
              <div>
                <div className="text-2xl font-bold text-neutral-900 dark:text-white tracking-tight">100%</div>
                <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">Identity Preserved</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-neutral-900 dark:text-white tracking-tight">&lt; 3 sec</div>
                <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">Neural Fitting</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-400 tracking-tight">Zero</div>
                <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">Sizing Guesswork</div>
              </div>
            </div>
          </div>

          {/* Visual Showcase Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md rounded-2xl p-3 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xl shadow-emerald-950/5">
              <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-neutral-100 dark:bg-neutral-800">
                <img
                  src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=85"
                  alt="Virtual Try-On Model Showcase"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-top"
                />

                {/* Overlaid feature chips */}
                <div className="absolute top-4 left-4 backdrop-blur-md bg-black/60 text-white text-xs font-medium px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Live Fitting Preview
                </div>

                <div className="absolute bottom-4 left-4 right-4 backdrop-blur-md bg-white/90 dark:bg-neutral-900/90 border border-white/20 dark:border-neutral-700/50 p-3.5 rounded-xl shadow-lg flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src="https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=200&q=80"
                      alt="Sage Minimalist Tee Garment"
                      referrerPolicy="no-referrer"
                      className="w-12 h-12 rounded-lg object-cover border border-emerald-500/30"
                    />
                    <div>
                      <div className="text-xs font-semibold text-neutral-900 dark:text-white">Sage Minimalist Tee</div>
                      <div className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium">Adapted to upper body</div>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-700 text-white">
                    Fitted ✓
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
