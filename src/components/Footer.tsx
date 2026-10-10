import React from 'react';
import { Shirt, Sparkles, Shield, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-neutral-200 dark:border-neutral-800/80 bg-white dark:bg-neutral-950 py-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo & Tagline */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-700 flex items-center justify-center text-white shadow-sm">
              <Shirt className="w-5 h-5" />
            </div>
            <div>
              <span className="font-display font-bold text-lg text-neutral-900 dark:text-white">
                Aura<span className="text-emerald-700 dark:text-emerald-400">Fit</span>
              </span>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                AI-Powered Virtual Trial Room Studio
              </p>
            </div>
          </div>

          {/* Quick links */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-medium text-neutral-600 dark:text-neutral-400">
            <a href="#try-room" className="hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors">
              Virtual Try-On
            </a>
            <a href="#catalog" className="hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors">
              Collection
            </a>
            <a href="#how-it-works" className="hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors">
              How It Works
            </a>
            <span className="inline-flex items-center gap-1 text-emerald-800 dark:text-emerald-300">
              <Sparkles className="w-3.5 h-3.5" />
              AI Synthesis
            </span>
          </div>

          {/* Copyright & Privacy Notice */}
          <div className="text-xs text-neutral-400 text-center md:text-right">
            <p>© {new Date().getFullYear()} AuraFit Virtual Room. All rights reserved.</p>
            <p className="text-[11px] text-neutral-500 mt-0.5">
              Secure image processing for virtual trial simulation.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
