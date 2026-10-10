import { Product, ProductsResponse, TryOnResponseData } from '../types.js';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

export interface TryOnRequestPayload {
  personFile: File | Blob;
  garmentFile?: File | Blob;
  garmentImageUrl?: string;
  category: string;
  garmentName?: string;
}

export class ApiService {
  static async getHealth() {
    const res = await fetch(`${API_BASE}/health`);
    if (!res.ok) throw new Error('Health check failed');
    return res.json();
  }

  static async getProducts(params: { category?: string; search?: string; page?: number; limit?: number } = {}): Promise<ProductsResponse> {
    const url = new URL(`${API_BASE}/products`, window.location.origin);
    if (params.category && params.category !== 'All') url.searchParams.set('category', params.category);
    if (params.search) url.searchParams.set('search', params.search);
    if (params.page) url.searchParams.set('page', String(params.page));
    if (params.limit) url.searchParams.set('limit', String(params.limit));

    const res = await fetch(url.toString());
    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.message || 'Failed to fetch products');
    }
    return json.data;
  }

  static async getProductById(id: string): Promise<Product> {
    const res = await fetch(`${API_BASE}/products/${id}`);
    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.message || 'Product not found');
    }
    return json.data;
  }

  static async generateTryOn(payload: TryOnRequestPayload): Promise<TryOnResponseData> {
    const formData = new FormData();
    const personName = payload.personFile instanceof File ? payload.personFile.name : 'person.jpg';
    formData.append('personImage', payload.personFile, personName);

    if (payload.garmentFile) {
      const garmentName = payload.garmentFile instanceof File ? payload.garmentFile.name : 'garment.jpg';
      formData.append('garmentImage', payload.garmentFile, garmentName);
    } else if (payload.garmentImageUrl) {
      formData.append('garmentImageUrl', payload.garmentImageUrl);
    }

    formData.append('category', payload.category);
    if (payload.garmentName) {
      formData.append('garmentName', payload.garmentName);
    }

    const res = await fetch(`${API_BASE}/try-on`, {
      method: 'POST',
      body: formData,
    });

    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.message || 'Virtual try-on generation failed. Please try again.');
    }

    return json.data;
  }
}
