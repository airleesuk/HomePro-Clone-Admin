import { Product, Category, Banner } from '../types';

export const CATEGORIES: Category[] = [
  { id: 1, name: 'เครื่องใช้ไฟฟ้า', icon: 'https://images.unsplash.com/photo-1556740738-b6a63e27c4df?w=100&h=100&fit=crop' },
  { id: 2, name: 'เครื่องใช้ไฟฟ้าเล็ก', icon: 'https://images.unsplash.com/photo-1542393545-facac42e67e8?w=100&h=100&fit=crop' },
  { id: 3, name: 'ทีวีและเครื่องเสียง', icon: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=100&h=100&fit=crop' },
  { id: 4, name: 'โคมไฟและหลอดไฟ', icon: 'https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=100&h=100&fit=crop' },
  { id: 5, name: 'ห้องนอน', icon: 'https://images.unsplash.com/photo-1505693416388-b0346ef41439?w=100&h=100&fit=crop' },
  { id: 6, name: 'ห้องน้ำ', icon: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=100&h=100&fit=crop' },
  { id: 7, name: 'ห้องครัว', icon: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=100&h=100&fit=crop' },
  { id: 8, name: 'สวนและอุปกรณ์', icon: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=100&h=100&fit=crop' },
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 1,
    name: 'เครื่องซักผ้าฝาหน้า 10KG LG',
    price: 15990,
    originalPrice: 22900,
    image: 'https://images.unsplash.com/photo-1626806775351-5c0c256385a1?w=400',
    category: 'เครื่องใช้ไฟฟ้า',
    stock: 50,
    sold: 120,
    discount: 30,
    isFlashSale: true
  },
  {
    id: 2,
    name: 'ตู้เย็น 2 ประตู Samsung',
    price: 8990,
    originalPrice: 12900,
    image: 'https://images.unsplash.com/photo-1571175443880-49e1d58b794a?w=400',
    category: 'เครื่องใช้ไฟฟ้า',
    stock: 20,
    sold: 45,
    discount: 30,
    isFlashSale: true
  },
  {
    id: 3,
    name: 'Dyson V8 Slim Fluffy',
    price: 12900,
    originalPrice: 14900,
    image: 'https://images.unsplash.com/photo-1558317374-a35498f3ffa9?w=400',
    category: 'เครื่องใช้ไฟฟ้าเล็ก',
    stock: 15,
    sold: 80,
    discount: 13,
    isFlashSale: false
  },
  {
    id: 4,
    name: 'โซฟาเบด 3 ที่นั่ง HomeLiving',
    price: 5590,
    originalPrice: 9900,
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400',
    category: 'ห้องนอน',
    stock: 5,
    sold: 200,
    discount: 44,
    isFlashSale: true
  },
  {
    id: 5,
    name: 'Samsung Smart TV 55"',
    price: 13490,
    originalPrice: 18990,
    image: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?w=400',
    category: 'ทีวีและเครื่องเสียง',
    stock: 30,
    sold: 15,
    discount: 29,
    isFlashSale: false
  },
  {
    id: 6,
    name: 'เครื่องทำน้ำอุ่น Panasonic',
    price: 2990,
    originalPrice: 3590,
    image: 'https://images.unsplash.com/photo-1507652313519-d4e917a520ce?w=400',
    category: 'ห้องน้ำ',
    stock: 100,
    sold: 500,
    discount: 17,
    isFlashSale: true
  },
  {
    id: 7,
    name: 'ชุดเครื่องนอน 6 ฟุต',
    price: 1290,
    originalPrice: 2590,
    image: 'https://images.unsplash.com/photo-1631048309714-96d00156a8af?w=400',
    category: 'ห้องนอน',
    stock: 60,
    sold: 30,
    discount: 50,
    isFlashSale: false
  },
  {
    id: 8,
    name: 'โต๊ะทำงาน Modern Loft',
    price: 2490,
    originalPrice: 4500,
    image: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=400',
    category: 'เฟอร์นิเจอร์',
    stock: 10,
    sold: 88,
    discount: 45,
    isFlashSale: true
  }
];

export const BANNERS: Banner[] = [
  { id: 1, image: 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=1200&h=400&fit=crop', alt: 'Brand Day Sale' },
  { id: 2, image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=1200&h=400&fit=crop', alt: 'Furniture Sale' },
];

export class DatabaseService {
  private products: Product[];

  constructor() {
    const stored = localStorage.getItem('products');
    this.products = stored ? JSON.parse(stored) : INITIAL_PRODUCTS;
  }

  getProducts(): Product[] {
    return this.products;
  }

  addProduct(product: Product) {
    this.products.push({ ...product, id: Date.now() });
    this.save();
  }

  updateProduct(product: Product) {
    this.products = this.products.map(p => p.id === product.id ? product : p);
    this.save();
  }

  deleteProduct(id: number) {
    this.products = this.products.filter(p => p.id !== id);
    this.save();
  }

  private save() {
    localStorage.setItem('products', JSON.stringify(this.products));
  }
}

export const db = new DatabaseService();