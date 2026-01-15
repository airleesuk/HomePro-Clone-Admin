
export interface ProductVariant {
  id: string;
  name: string;
  sku: string;
  price: number;
  stock: number;
}

export interface Product {
  id: number;
  name: string;
  brand?: string;
  sku?: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  stock: number;
  sold: number;
  discount?: number;
  isFlashSale?: boolean;
  isFeatured?: boolean;
  tags?: string[];
  rating?: number;
  description?: string;
  weight?: number;
  dimensions?: string;
  variants?: ProductVariant[];
  // SEO Fields
  seoUrl?: string;
  seoKeywords?: string[];
  seoDescription?: string;
}

export interface Category {
  id: number;
  name: string;
  icon: string;
  isActive?: boolean;
}

export interface Banner {
  id: number;
  image: string;
  alt: string;
}

export enum ViewMode {
  CLIENT = 'CLIENT',
  ADMIN = 'ADMIN'
}
