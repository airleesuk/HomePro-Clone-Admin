
export interface ProductVariant {
  id: string;
  name: string;
  price: number;
  stock: number;
  image?: string;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  stock: number;
  sold: number;
  discount?: number;
  isFlashSale?: boolean;
  isFeatured?: boolean;
  rating?: number;
  variants?: ProductVariant[];
}

export interface Category {
  id: number;
  name: string;
  icon: string; // URL for image
  iconKey?: string; // Key for Lucide icon lookup
}

export interface Banner {
  id: number;
  image: string;
  alt: string;
}

export interface SubCategory {
  title: string;
  items: string[];
}

export interface CategoryDetail {
  id: number;
  name: string;
  iconKey: string;
  highlights: { title: string; img: string }[];
  subCategories: SubCategory[];
  promoText: string;
  promoImg: string;
}

export enum ViewMode {
  CLIENT = 'CLIENT',
  ADMIN = 'ADMIN'
}
