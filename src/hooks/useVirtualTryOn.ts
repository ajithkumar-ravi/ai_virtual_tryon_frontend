import { useState, useCallback, useEffect } from 'react';
import { ApiService } from '../services/api.js';
import { Product, TryOnResponseData, TryOnStep } from '../types.js';

export function useVirtualTryOn(onNotify?: (msg: string, type: 'success' | 'info' | 'warning' | 'error') => void) {
  const [personFile, setPersonFile] = useState<File | Blob | null>(null);
  const [personPreviewUrl, setPersonPreviewUrl] = useState<string | null>(null);

  const [garmentFile, setGarmentFile] = useState<File | Blob | null>(null);
  const [garmentPreviewUrl, setGarmentPreviewUrl] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const [category, setCategory] = useState<string>('T-Shirt');
  const [loading, setLoading] = useState<boolean>(false);
  const [step, setStep] = useState<TryOnStep>('idle');
  const [statusMessage, setStatusMessage] = useState<string>('');

  const [resultData, setResultData] = useState<TryOnResponseData | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Clean up object URLs on change
  const setPersonPhoto = useCallback((file: File | Blob) => {
    if (personPreviewUrl && personPreviewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(personPreviewUrl);
    }
    const url = URL.createObjectURL(file);
    setPersonFile(file);
    setPersonPreviewUrl(url);
    setError(null);
    onNotify?.('Photo uploaded successfully', 'success');
  }, [personPreviewUrl, onNotify]);

  const removePersonPhoto = useCallback(() => {
    if (personPreviewUrl && personPreviewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(personPreviewUrl);
    }
    setPersonFile(null);
    setPersonPreviewUrl(null);
    onNotify?.('Photo removed', 'info');
  }, [personPreviewUrl, onNotify]);

  const selectProductGarment = useCallback((product: Product) => {
    if (garmentPreviewUrl && garmentPreviewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(garmentPreviewUrl);
    }
    setGarmentFile(null);
    setSelectedProduct(product);
    setGarmentPreviewUrl(product.image);
    setCategory(product.category);
    setError(null);
    onNotify?.(`Selected ${product.name}`, 'success');
  }, [garmentPreviewUrl, onNotify]);

  const uploadCustomGarment = useCallback((file: File | Blob, specifiedCategory?: string) => {
    if (garmentPreviewUrl && garmentPreviewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(garmentPreviewUrl);
    }
    const url = URL.createObjectURL(file);
    setSelectedProduct(null);
    setGarmentFile(file);
    setGarmentPreviewUrl(url);
    if (specifiedCategory) {
      setCategory(specifiedCategory);
    }
    setError(null);
    onNotify?.('Garment image uploaded successfully', 'success');
  }, [garmentPreviewUrl, onNotify]);

  const removeGarment = useCallback(() => {
    if (garmentPreviewUrl && garmentPreviewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(garmentPreviewUrl);
    }
    setGarmentFile(null);
    setSelectedProduct(null);
    setGarmentPreviewUrl(null);
    onNotify?.('Garment removed', 'info');
  }, [garmentPreviewUrl, onNotify]);

  const generateTryOn = useCallback(async () => {
    if (!personFile) {
      setError('Please upload or take a photo of yourself first.');
      onNotify?.('Please upload a photo of yourself.', 'warning');
      return;
    }

    if (!garmentFile && !selectedProduct) {
      setError('Please choose or upload an outfit to try on.');
      onNotify?.('Please choose an outfit first.', 'warning');
      return;
    }

    setLoading(true);
    setError(null);
    setStep('preparing');
    setStatusMessage('Preparing your outfit...');
    onNotify?.('Try-on process started...', 'info');

    // Progressive status stages
    const timer1 = setTimeout(() => {
      setStep('analyzing');
      setStatusMessage('Analyzing your photo and pose...');
    }, 800);

    const timer2 = setTimeout(() => {
      setStep('fitting');
      setStatusMessage('Fitting the garment contours and fabric drape...');
    }, 1800);

    const timer3 = setTimeout(() => {
      setStep('generating');
      setStatusMessage('Generating realistic lighting and fabric textures...');
    }, 2900);

    const timer4 = setTimeout(() => {
      setStep('finalizing');
      setStatusMessage('Almost ready...');
    }, 4200);

    try {
      const response = await ApiService.generateTryOn({
        personFile,
        garmentFile: garmentFile || undefined,
        garmentImageUrl: selectedProduct ? selectedProduct.image : undefined,
        category,
        garmentName: selectedProduct?.name || `${category} outfit`,
      });

      setResultData(response);
      setStep('completed');
      setStatusMessage('Your virtual try-on is ready!');
      onNotify?.('Virtual try-on completed!', 'success');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Try-on generation failed. Please try again.';
      setError(msg);
      setStep('failed');
      onNotify?.(msg, 'error');
    } finally {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      setLoading(false);
    }
  }, [personFile, garmentFile, selectedProduct, category, onNotify]);

  const tryAnotherOutfit = useCallback(() => {
    // Retain person photo, clear garment and result
    if (garmentPreviewUrl && garmentPreviewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(garmentPreviewUrl);
    }
    setGarmentFile(null);
    setSelectedProduct(null);
    setGarmentPreviewUrl(null);
    setResultData(null);
    setStep('idle');
    setError(null);
    onNotify?.('Ready to choose another outfit!', 'info');
  }, [garmentPreviewUrl, onNotify]);

  const resetAll = useCallback(() => {
    if (personPreviewUrl && personPreviewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(personPreviewUrl);
    }
    if (garmentPreviewUrl && garmentPreviewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(garmentPreviewUrl);
    }
    setPersonFile(null);
    setPersonPreviewUrl(null);
    setGarmentFile(null);
    setSelectedProduct(null);
    setGarmentPreviewUrl(null);
    setResultData(null);
    setStep('idle');
    setError(null);
  }, [personPreviewUrl, garmentPreviewUrl]);

  return {
    personFile,
    personPreviewUrl,
    setPersonPhoto,
    removePersonPhoto,
    garmentFile,
    garmentPreviewUrl,
    selectedProduct,
    selectProductGarment,
    uploadCustomGarment,
    removeGarment,
    category,
    setCategory,
    loading,
    step,
    statusMessage,
    resultData,
    error,
    generateTryOn,
    tryAnotherOutfit,
    resetAll,
  };
}
