import React, { useRef, useState, useEffect } from 'react';
import { Camera, RefreshCw, Check, X, AlertCircle } from 'lucide-react';

interface CameraCaptureProps {
  onPhotoCaptured: (blob: Blob) => void;
  onCancel: () => void;
}

export const CameraCapture: React.FC<CameraCaptureProps> = ({ onPhotoCaptured, onCancel }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedBlob, setCapturedBlob] = useState<Blob | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState<boolean>(true);

  useEffect(() => {
    let activeStream: MediaStream | null = null;

    async function initCamera() {
      setIsInitializing(true);
      setError(null);
      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          throw new Error('Camera access is not supported on this browser or device.');
        }

        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: 'user',
            width: { ideal: 1280 },
            height: { ideal: 1280 },
          },
          audio: false,
        });

        activeStream = mediaStream;
        setStream(mediaStream);

        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          await videoRef.current.play();
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Camera permission was denied or camera is unavailable.';
        setError(msg);
      } finally {
        setIsInitializing(false);
      }
    }

    initCamera();

    return () => {
      if (activeStream) {
        activeStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const handleCapture = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;

    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 800;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(
      (blob) => {
        if (blob) {
          setCapturedBlob(blob);
          const url = URL.createObjectURL(blob);
          setPreviewUrl(url);
        }
      },
      'image/jpeg',
      0.92
    );
  };

  const handleRetake = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setCapturedBlob(null);
    setPreviewUrl(null);
  };

  const handleUsePhoto = () => {
    if (capturedBlob) {
      // Stop camera tracks before exiting
      if (stream) {
        stream.getTracks().forEach((t) => t.stop());
      }
      onPhotoCaptured(capturedBlob);
    }
  };

  const handleClose = () => {
    if (stream) {
      stream.getTracks().forEach((t) => t.stop());
    }
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    onCancel();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-lg rounded-2xl bg-neutral-900 border border-neutral-800 text-white shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-emerald-400" />
            <span className="font-semibold text-sm">Capture Your Photo</span>
          </div>
          <button
            onClick={handleClose}
            className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Viewport */}
        <div className="relative aspect-[3/4] bg-neutral-950 flex items-center justify-center overflow-hidden">
          {isInitializing && (
            <div className="flex flex-col items-center gap-3 text-neutral-400">
              <RefreshCw className="w-8 h-8 animate-spin text-emerald-500" />
              <p className="text-sm">Accessing camera...</p>
            </div>
          )}

          {error && (
            <div className="p-6 text-center max-w-sm">
              <AlertCircle className="w-10 h-10 text-rose-500 mx-auto mb-3" />
              <p className="text-sm font-medium text-rose-300 mb-2">Camera Unavailable</p>
              <p className="text-xs text-neutral-400 mb-4">{error}</p>
              <button
                onClick={handleClose}
                className="px-4 py-2 rounded-xl bg-neutral-800 text-white text-xs font-semibold hover:bg-neutral-700"
              >
                Close & Use File Upload
              </button>
            </div>
          )}

          {/* Hidden Canvas for snapshot */}
          <canvas ref={canvasRef} className="hidden" />

          {/* Live Video Feed */}
          {!error && !previewUrl && (
            <video
              ref={videoRef}
              playsInline
              muted
              className="w-full h-full object-cover -scale-x-100" // mirrored selfie
            />
          )}

          {/* Captured Preview */}
          {previewUrl && (
            <img
              src={previewUrl}
              alt="Captured snapshot"
              className="w-full h-full object-cover -scale-x-100"
            />
          )}

          {/* Guidelines overlay for centering */}
          {!error && !previewUrl && !isInitializing && (
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center border-2 border-dashed border-emerald-500/30 rounded-2xl m-8">
              <span className="text-[11px] font-medium text-white/70 bg-black/40 px-3 py-1 rounded-full backdrop-blur-sm">
                Position your upper body here
              </span>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="p-4 bg-neutral-900 border-t border-neutral-800 flex items-center justify-between">
          <button
            onClick={handleClose}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold text-neutral-400 hover:text-white hover:bg-neutral-800"
          >
            Cancel
          </button>

          {!previewUrl ? (
            <button
              onClick={handleCapture}
              disabled={isInitializing || !!error}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 active:scale-95 transition-all shadow-md shadow-emerald-700/30"
            >
              <Camera className="w-4 h-4" />
              Capture Photo
            </button>
          ) : (
            <div className="flex items-center gap-3">
              <button
                onClick={handleRetake}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold bg-neutral-800 text-neutral-200 hover:bg-neutral-700"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Retake
              </button>
              <button
                onClick={handleUsePhoto}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 shadow-md shadow-emerald-700/30"
              >
                <Check className="w-4 h-4" />
                Use Photo
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
