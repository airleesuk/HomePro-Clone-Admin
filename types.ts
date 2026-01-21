
export interface ProductVariant {
  id: string;
  name: string;
  price: number;
  stock: number;
  image?: string;
  images?: string[]; // Added for gallery support
}

export interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  images?: string[]; // Added for gallery support
  category: string;
  stock: number;
  sold: number;
  discount?: number;
  isFlashSale?: boolean;
  isFeatured?: boolean;
  rating?: number;
  variants?: ProductVariant[];
  brandId?: number;
  description?: string; // Added description
}

export interface Category {
  id: number;
  name: string;
  icon: string; // URL for image
  iconKey?: string; // Key for Lucide icon lookup
}

export interface Brand {
  id: number;
  name: string;
  logo: string;
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

export interface AdminNotification {
  id: string;
  title: string;
  message: string;
  type: 'warning' | 'info' | 'success';
  timestamp: Date;
}

// New Types for Database Management
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'CUSTOMER' | 'ADMIN';
  image?: string;
  createdAt: string;
}

export interface OrderItem {
  id: string;
  productId: number;
  productName: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  userId: string;
  userName?: string; // Denormalized for display
  totalAmount: number;
  status: 'PENDING' | 'PAID' | 'SHIPPED' | 'COMPLETED' | 'CANCELLED';
  items: OrderItem[];
  createdAt: string;
}

export enum ViewMode {
  CLIENT = 'CLIENT',
  ADMIN = 'ADMIN',
  PRODUCT_DETAIL = 'PRODUCT_DETAIL',
  PAGE_VIEW = 'PAGE_VIEW'
}

// Page Builder Types
export type BlockType = 'hero' | 'product-row' | 'text' | 'image' | 'spacer' | 'grid' | 'testimonial';

export interface PageBlock {
  id: string;
  type: BlockType;
  data: any; // Flexible data depending on type
}

export interface SavedBlock {
  id: string;
  name: string;
  category: string;
  block: PageBlock;
  createdAt: string;
}

export interface PageLayout {
  id: string;
  name: string;
  description?: string;
  blocks: PageBlock[];
  isDefault?: boolean;
  thumbnail?: string;
}

export interface Page {
  id: string;
  title: string;
  slug: string;
  blocks: PageBlock[];
  status: 'published' | 'draft';
  updatedAt: string;
}
