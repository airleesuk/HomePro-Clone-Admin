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
  rating?: number;
}

export interface Category {
  id: number;
  name: string;
  icon: string; // URL or Lucide icon name placeholder
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