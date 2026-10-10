import React, { useRef, useState } from 'react';
import { UploadCloud, Camera, X, RefreshCw, AlertCircle, Shield, User } from 'lucide-react';
import { CameraCapture } from './CameraCapture.js';

interface ImageUploaderProps {
  previewUrl: string | null;
  onImageSelected: (file: File | Blob) => void;
  onImageRemoved: () => void;
  onError?: (msg: string) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  previewUrl,
  onImageSelected,
  onImageRemoved,
  onError,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  const validateAndProcessFile = (file: File) => {
    const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowed.includes(file.type.toLowerCase())) {
      onError?.('Please upload a JPG, PNG, or WEBP image.');
      return;
    }

    const maxMb = 10;
    if (file.size > maxMb * 1024 * 1024) {
      onError?.(`Image exceeds ${maxMb}MB size limit.`);
      return;
    }

    onImageSelected(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndProcessFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndProcessFile(e.target.files[0]);
    }
    // reset input value so re-uploading same file works
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="flex flex-col h-full">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileChange}
        className="hidden"
      />

      {previewUrl ? (
        /* Preview Card */
        <div className="relative rounded-2xl overflow-hidden border border-emerald-500/30 dark:border-emerald-500/20 bg-neutral-900 aspect-[3/4] flex flex-col justify-between group shadow-md">
          <img
            src={previewUrl}
            alt="Uploaded person"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-top"
          />

          {/* Top Status Tag */}
          <div className="absolute top-3 left-3 backdrop-blur-md bg-black/60 text-white text-xs font-medium px-3 py-1 rounded-full flex items-center gap-1.5 border border-white/10">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            Photo ready ✓
          </div>

          {/* Action Overlay */}
          <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-center justify-between gap-2">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white/20 hover:bg-white/30 text-white backdrop-blur-md transition-all active:scale-95"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Replace Photo
            </button>

            <button
              onClick={onImageRemoved}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-rose-500/80 hover:bg-rose-600 text-white backdrop-blur-md transition-all active:scale-95"
            >
              <X className="w-3.5 h-3.5" />
              Remove
            </button>
          </div>
        </div>
      ) : (
        /* Dropzone Upload Area */
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`relative rounded-2xl border-2 border-dashed p-6 sm:p-8 flex flex-col items-center justify-center text-center transition-all aspect-[3/4] ${
            isDragging
              ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30 scale-[1.01]'
              : 'border-neutral-300 dark:border-neutral-800 bg-white dark:bg-neutral-900/60 hover:border-emerald-500/50 hover:bg-neutral-50 dark:hover:bg-neutral-900'
          }`}
        >
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/60 flex items-center justify-center text-emerald-700 dark:text-emerald-400 mb-4 shadow-sm">
            <User className="w-8 h-8 stroke-[1.8]" />
          </div>

          <h3 className="text-base font-bold text-neutral-900 dark:text-white">
            Upload your photo to begin
          </h3>
          <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400 max-w-xs leading-relaxed">
            Drag & drop your portrait here, or select from your computer / phone.
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3 w-full">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 transition-colors shadow-sm shadow-emerald-800/20 active:scale-95"
            >
              <UploadCloud className="w-4 h-4" />
              Choose File
            </button>

            <button
              type="button"
              onClick={() => setIsCameraOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-neutral-700 dark:text-neutral-200 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors active:scale-95"
            >
              <Camera className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              Take Photo
            </button>
          </div>

          {/* Quick Trial Room Models */}
          <div className="mt-5 w-full pt-4 border-t border-neutral-100 dark:border-neutral-800/80">
            <span className="text-[11px] font-medium text-neutral-500 dark:text-neutral-400 block mb-2">
              Or test with a sample model:
            </span>
            <div className="flex items-center justify-center gap-2">
              {[
                { name: 'Model 1 (Emma)', img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80' },
                { name: 'Model 2 (Alex)', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80' },
                { name: 'Model 3 (Maya)', img: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80' },
              ].map((m, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={async () => {
                    try {
                      const res = await fetch(m.img);
                      const blob = await res.blob();
                      onImageSelected(blob);
                    } catch (e) {
                      console.error('Failed to load preset model', e);
                    }
                  }}
                  className="group flex flex-col items-center gap-1 p-1 rounded-xl hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors"
                  title={`Use ${m.name}`}
                >
                  <img
                    src={m.img}
                    alt={m.name}
                    referrerPolicy="no-referrer"
                    className="w-10 h-10 rounded-full object-cover border-2 border-transparent group-hover:border-emerald-500 transition-all shadow-sm"
                  />
                  <span className="text-[10px] text-neutral-500 dark:text-neutral-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 font-medium">
                    {m.name.split(' ')[0]}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4 flex items-center gap-3 text-[11px] text-neutral-400 dark:text-neutral-500">
            <span>JPG, PNG, WEBP</span>
            <span>•</span>
            <span>Max 10 MB</span>
          </div>
        </div>
      )}

      {/* Privacy Notice (Prompt Section 42) */}
      <div className="mt-3.5 flex items-start gap-2 p-3 rounded-xl bg-neutral-100/70 dark:bg-neutral-900/60 border border-neutral-200/70 dark:border-neutral-800/80 text-[11px] text-neutral-500 dark:text-neutral-400">
        <Shield className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
        <p className="leading-normal">
          <span className="font-semibold text-neutral-700 dark:text-neutral-300">Privacy Notice: </span>
          Your photo is processed securely for virtual try-on and is not permanently retained. Avoid uploading images containing sensitive personal information.
        </p>
      </div>

      {/* Camera Modal */}
      {isCameraOpen && (
        <CameraCapture
          onPhotoCaptured={(blob) => {
            setIsCameraOpen(false);
            onImageSelected(blob);
          }}
          onCancel={() => setIsCameraOpen(false)}
        />
      )}
    </div>
  );
};
