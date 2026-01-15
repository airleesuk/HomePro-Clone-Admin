
import { Product, Category, Banner } from '../types';

export const INITIAL_CATEGORIES: Category[] = [
  { id: 1, name: 'แทงค์น้ำและถังน้ำ', icon: 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=100&h=100&fit=crop', isActive: true },
  { id: 2, name: 'ถังบำบัดน้ำเสีย', icon: 'https://images.unsplash.com/photo-1541625602330-2277a4c46182?w=100&h=100&fit=crop', isActive: true },
  { id: 3, name: 'ตู้กดน้ำและเครื่องกรอง', icon: 'https://images.unsplash.com/photo-1523362628563-e94988d336ef?w=100&h=100&fit=crop', isActive: true },
  { id: 4, name: 'เครื่องใช้ไฟฟ้า', icon: 'https://images.unsplash.com/photo-1556740738-b6a63e27c4df?w=100&h=100&fit=crop', isActive: true },
  { id: 5, name: 'ห้องน้ำและสุขภัณฑ์', icon: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=100&h=100&fit=crop', isActive: true },
  { id: 6, name: 'ห้องครัว', icon: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=100&h=100&fit=crop', isActive: true },
  { id: 7, name: 'สวนและอุปกรณ์', icon: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=100&h=100&fit=crop', isActive: true },
  { id: 8, name: 'เครื่องทำน้ำแข็ง', icon: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=100&h=100&fit=crop', isActive: true },
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 1,
    name: 'แทงค์น้ำบนดิน DOS รุ่น MONEY S',
    brand: 'DOS',
    sku: 'DOS-MON-700',
    price: 4990,
    originalPrice: 5900,
    image: 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=400',
    category: 'แทงค์น้ำและถังน้ำ',
    stock: 25,
    sold: 12,
    discount: 15,
    isFlashSale: true,
    isFeatured: true,
    tags: ['ขายดี', 'ถังเก็บน้ำ'],
    description: 'ถังเก็บน้ำคุณภาพสูง DOS รุ่น MONEY S มาพร้อมนวัตกรรมสารยับยั้งแบคทีเรีย Silver Nano Titanium ปลอดภัย 100%',
    weight: 20,
    dimensions: '70 x 70 x 180 cm',
    seoUrl: 'dos-money-s-water-tank',
    seoKeywords: ['แทงค์น้ำ', 'DOS', 'ถังเก็บน้ำ'],
    seoDescription: 'ถังเก็บน้ำ DOS MONEY S รุ่นขายดี ป้องกันแบคทีเรีย รับประกันยาวนาน'
  },
  {
    id: 2,
    name: 'ตู้กดน้ำเย็นสแตนเลส 2 หัวจ่าย',
    brand: 'WAREE',
    sku: 'WR-COOL-02',
    price: 12500,
    originalPrice: 15900,
    image: 'https://images.unsplash.com/photo-1523362628563-e94988d336ef?w=400',
    category: 'ตู้กดน้ำและเครื่องกรอง',
    stock: 10,
    sold: 5,
    discount: 21,
    isFlashSale: false,
    isFeatured: true,
    tags: ['Professional', 'Stainless'],
    description: 'ตู้กดน้ำเย็นสแตนเลสแท้ 304 ทนทาน ไม่เป็นสนิม เหมาะสำหรับโรงเรียนหรืออาคารสำนักงาน',
    weight: 35,
    dimensions: '40 x 40 x 120 cm',
    seoUrl: 'stainless-water-dispenser-2-heads',
    seoKeywords: ['ตู้กดน้ำ', 'สแตนเลส', 'น้ำเย็น'],
    seoDescription: 'ตู้กดน้ำเย็นสแตนเลส 2 หัว แข็งแรง ทนทาน เหมาะสำหรับสำนักงาน'
  }
];

export class DatabaseService {
  private products: Product[];
  private categories: Category[];

  constructor() {
    const storedProducts = localStorage.getItem('products');
    this.products = storedProducts ? JSON.parse(storedProducts) : INITIAL_PRODUCTS;
    
    const storedCategories = localStorage.getItem('categories');
    this.categories = storedCategories ? JSON.parse(storedCategories) : INITIAL_CATEGORIES;
  }

  getProducts(): Product[] {
    return this.products;
  }

  addProduct(product: Product) {
    this.products.push({ ...product, id: Date.now() });
    this.saveProducts();
  }

  updateProduct(product: Product) {
    this.products = this.products.map(p => p.id === product.id ? product : p);
    this.saveProducts();
  }

  deleteProduct(id: number) {
    this.products = this.products.filter(p => p.id !== id);
    this.saveProducts();
  }

  bulkDeleteProducts(ids: number[]) {
    this.products = this.products.filter(p => !ids.includes(p.id));
    this.saveProducts();
  }

  bulkUpdateFeatured(ids: number[], featured: boolean) {
    this.products = this.products.map(p => ids.includes(p.id) ? { ...p, isFeatured: featured } : p);
    this.saveProducts();
  }

  bulkUpdateCategory(ids: number[], category: string) {
    this.products = this.products.map(p => ids.includes(p.id) ? { ...p, category } : p);
    this.saveProducts();
  }

  getCategories(): Category[] {
    return this.categories;
  }

  addCategory(category: Partial<Category>) {
    this.categories.push({ ...category, id: Date.now(), isActive: true } as Category);
    this.saveCategories();
  }

  updateCategory(category: Category) {
    this.categories = this.categories.map(c => c.id === category.id ? category : c);
    this.saveCategories();
  }

  deleteCategory(id: number) {
    this.categories = this.categories.filter(c => c.id !== id);
    this.saveCategories();
  }

  bulkDeleteCategories(ids: number[]) {
    this.categories = this.categories.filter(c => !ids.includes(c.id));
    this.saveCategories();
  }

  bulkUpdateCategoryStatus(ids: number[], isActive: boolean) {
    this.categories = this.categories.map(c => ids.includes(c.id) ? { ...c, isActive } : c);
    this.saveCategories();
  }

  private saveProducts() {
    localStorage.setItem('products', JSON.stringify(this.products));
  }

  private saveCategories() {
    localStorage.setItem('categories', JSON.stringify(this.categories));
  }
}

export const db = new DatabaseService();
export const CATEGORIES = db.getCategories();
