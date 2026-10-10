import React from 'react';
import { Sparkles, Shirt, Wand2 } from 'lucide-react';
import { TryOnStep } from '../types.js';

interface LoadingAnimationProps {
  step: TryOnStep;
  statusMessage: string;
}

export const LoadingAnimation: React.FC<LoadingAnimationProps> = ({ step, statusMessage }) => {
  const stepIndices: Record<TryOnStep, number> = {
    idle: 0,
    preparing: 1,
    analyzing: 2,
    fitting: 3,
    generating: 4,
    finalizing: 5,
    completed: 6,
    failed: 0,
  };

  const currentIdx = stepIndices[step] || 1;
  const totalStages = 5;
  const progressPercent = Math.min(100, Math.round((currentIdx / totalStages) * 100));

  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      {/* Animated Silhouette/Radar Icon */}
      <div className="relative w-24 h-24 mb-6">
        <div className="absolute inset-0 rounded-full border-2 border-emerald-500/20 dark:border-emerald-500/10 animate-ping" />
        <div className="absolute inset-2 rounded-full border border-dashed border-emerald-500/40 animate-spin" style={{ animationDuration: '6s' }} />
        <div className="relative w-full h-full rounded-full bg-gradient-to-tr from-emerald-600/20 to-teal-500/30 border border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 backdrop-blur-sm shadow-lg shadow-emerald-500/10">
          <Shirt className="w-10 h-10 animate-pulse" />
        </div>
      </div>

      {/* Dynamic Status Text */}
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 mb-3">
        <Sparkles className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '3s' }} />
        <span>Gemini AI Synthesis</span>
      </div>

      <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-2 tracking-tight">
        {statusMessage || 'Synthesizing your virtual outfit...'}
      </h3>

      <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-sm">
        Aligning garment contours, computing natural fabric tensions, and preserving your identity.
      </p>

      {/* Progress Bar */}
      <div className="w-full max-w-xs mt-6">
        <div className="flex items-center justify-between text-[11px] text-neutral-400 dark:text-neutral-500 mb-1.5 font-medium">
          <span>Processing</span>
          <span>{progressPercent}%</span>
        </div>
        <div className="w-full h-1.5 rounded-full bg-neutral-200 dark:bg-neutral-800 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>
    </div>
  );
};
