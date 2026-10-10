import React, { useState, useRef, useCallback, useEffect } from 'react';
import { ChevronsLeftRight, Sparkles, User } from 'lucide-react';

interface BeforeAfterSliderProps {
  originalImage: string;
  resultImage: string;
  aspectRatioClass?: string;
}

export const BeforeAfterSlider: React.FC<BeforeAfterSliderProps> = ({
  originalImage,
  resultImage,
  aspectRatioClass = 'aspect-[3/4]',
}) => {
  const [sliderPos, setSliderPos] = useState<number>(50); // percentage 0 to 100
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isDraggingRef = useRef<boolean>(false);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const clamped = Math.max(0, Math.min(rect.width, x));
    const percentage = (clamped / rect.width) * 100;
    setSliderPos(percentage);
  }, []);

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (!isDraggingRef.current) return;
      handleMove(e.touches[0].clientX);
    },
    [handleMove]
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDraggingRef.current) return;
      handleMove(e.clientX);
    },
    [handleMove]
  );

  const stopDragging = useCallback(() => {
    isDraggingRef.current = false;
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', stopDragging);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('touchend', stopDragging);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', stopDragging);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', stopDragging);
    };
  }, [handleMouseMove, handleTouchMove, stopDragging]);

  const handlePointerDown = (clientX: number) => {
    isDraggingRef.current = true;
    handleMove(clientX);
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full ${aspectRatioClass} rounded-2xl overflow-hidden select-none bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xl cursor-ew-resize`}
      onMouseDown={(e) => handlePointerDown(e.clientX)}
      onTouchStart={(e) => handlePointerDown(e.touches[0].clientX)}
    >
      {/* Background Image: AI Result */}
      <img
        src={resultImage}
        alt="AI Virtual Try-On Result"
        referrerPolicy="no-referrer"
        className="absolute inset-0 w-full h-full object-cover object-top pointer-events-none"
      />

      {/* Foreground Image: Original (Clipped via clip-path) */}
      <div
        className="absolute inset-0 overflow-hidden pointer-events-none"
        style={{
          clipPath: `polygon(0 0, ${sliderPos}% 0, ${sliderPos}% 100%, 0 100%)`,
        }}
      >
        <img
          src={originalImage}
          alt="Original photo"
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover object-top"
        />
      </div>

      {/* Vertical Split Line */}
      <div
        className="absolute top-0 bottom-0 w-0.5 bg-white shadow-lg pointer-events-none transition-transform"
        style={{ left: `${sliderPos}%` }}
      >
        {/* Slider Handle Knob */}
        <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-emerald-600 text-white border-2 border-white shadow-xl flex items-center justify-center">
          <ChevronsLeftRight className="w-4 h-4 stroke-[2.5]" />
        </div>
      </div>

      {/* Badges matching reference screenshot */}
      <div className="absolute top-3.5 left-3.5 backdrop-blur-md bg-black/60 text-white text-[11px] font-semibold px-3 py-1 rounded-full flex items-center gap-1.5 border border-white/10 pointer-events-none shadow-sm">
        <User className="w-3 h-3 text-neutral-300" />
        Your photo
      </div>

      <div className="absolute top-3.5 right-3.5 backdrop-blur-md bg-white/20 dark:bg-black/60 text-white text-[11px] font-semibold px-3 py-1 rounded-full flex items-center gap-1.5 border border-white/20 pointer-events-none shadow-sm">
        <Sparkles className="w-3 h-3 text-emerald-400" />
        With the outfit
      </div>

      {/* Interactive Helper Prompt */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 backdrop-blur-md bg-black/50 text-white/90 text-[10px] font-medium px-3 py-1 rounded-full pointer-events-none">
        Drag slider to compare
      </div>
    </div>
  );
};
