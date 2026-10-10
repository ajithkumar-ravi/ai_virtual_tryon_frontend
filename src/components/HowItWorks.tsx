import React from 'react';
import { Camera, Shirt, Sparkles, CheckCircle2 } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      num: '01',
      title: 'Upload Your Photo',
      desc: 'Snap a front-facing portrait with your device camera or upload an existing photo. We protect your privacy and only process the outfit area.',
      icon: <Camera className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />,
      tips: 'Natural lighting & standing pose work best',
    },
    {
      num: '02',
      title: 'Choose Your Outfit',
      desc: 'Browse our curated collection of contemporary shirts, dresses, hoodies, and jackets — or upload your own favorite clothing piece.',
      icon: <Shirt className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />,
      tips: 'Filter by category: Upper, Lower, or Full-body',
    },
    {
      num: '03',
      title: 'See Your AI Try-On',
      desc: 'Our Kwai-Kolors AI engine synthesizes realistic fabric drape, shadows, and contours while preserving your exact facial identity and pose.',
      icon: <Sparkles className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />,
      tips: 'Compare before & after with the interactive slider',
    },
  ];

  return (
    <section id="how-it-works" className="py-16 md:py-24 border-t border-neutral-200/80 dark:border-neutral-800/80 bg-neutral-50/50 dark:bg-neutral-900/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-700 dark:text-emerald-400">
            Simple 3-Step Process
          </span>
          <h2 className="mt-2 font-display text-3xl sm:text-4xl font-bold text-neutral-900 dark:text-white tracking-tight">
            How The Virtual Trial Room Works
          </h2>
          <p className="mt-4 text-base text-neutral-600 dark:text-neutral-400">
            Experience the future of personal styling in seconds without stepping foot in a physical store.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step) => (
            <div
              key={step.num}
              className="relative p-8 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm hover:shadow-md hover:border-emerald-500/30 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/60 flex items-center justify-center">
                    {step.icon}
                  </div>
                  <span className="font-display text-3xl font-bold text-emerald-900/20 dark:text-emerald-400/20">
                    {step.num}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-3">
                  {step.title}
                </h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  {step.desc}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-neutral-100 dark:border-neutral-800 flex items-center gap-2 text-xs text-emerald-700 dark:text-emerald-400 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                <span>{step.tips}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
