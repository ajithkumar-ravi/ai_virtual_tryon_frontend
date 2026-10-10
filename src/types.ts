export interface Product {
  id: string;
  name: string;
  category: 'T-Shirt' | 'Shirt' | 'Hoodie' | 'Jacket' | 'Dress' | 'Top' | 'Pants' | 'Jeans' | 'Skirt';
  price: number;
  color: string;
  image: string;
  description: string;
  sizes: string[];
  inStock: boolean;
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  page: number;
  totalPages: number;
  categories: string[];
}

export interface TryOnMetadata {
  note?: string;
  category?: string;
  isSimulated?: boolean;
  isFallback?: boolean;
  aspectRatio?: string;
  imageDimensions?: string;
  primaryProvider?: string;
  primaryProviderError?: string;
  isQuotaExceeded?: boolean;
  [key: string]: unknown;
}

export interface TryOnResponseData {
  resultImage: string;
  provider: string;
  model: string;
  processingTimeMs: number;
  metadata?: TryOnMetadata;
}

export type TryOnStep =
  | 'idle'
  | 'preparing'
  | 'analyzing'
  | 'fitting'
  | 'generating'
  | 'finalizing'
  | 'completed'
  | 'failed';

export interface Toast {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  message: string;
}
