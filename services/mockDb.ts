
import { Product, Category, Banner, CategoryDetail, Brand, Page } from '../types';

export const CATEGORIES: Category[] = [
  { id: 1, name: 'แทงค์น้ำ PE', icon: 'https://waree-th.shop/image/thumbnails/19/07/3s5yeLNuSXlQZPps3tVn4SbmdpvUIJlR5R5kATcO_png-102521-190x120.png', iconKey: 'droplets' },
  { id: 2, name: 'เครื่องใช้ไฟฟ้า', icon: 'https://waree-th.shop/image/thumbnails/1b/8b/_______________________1__png-112825-190x120.png', iconKey: 'zap' },
  { id: 3, name: 'ถังเก็บสารเคมี หรือ ถังยา PE', icon: 'https://waree-th.shop/image/thumbnails/1b/8b/_______________________2__png-112826-190x120.png', iconKey: 'flask' },
  { id: 4, name: 'ถังเก็บน้ำสแตนเลส', icon: 'https://waree-th.shop/image/thumbnails/1b/8b/______________________________________________png-112820-190x120.png', iconKey: 'database' },
  { id: 5, name: 'ถังดักไขมัน', icon: 'https://waree-th.shop/image/thumbnails/1b/8b/CsW1oJL0eVMTeQUQO8NMbjTKUPBVLvGEBmqPhfSR_png-112822-190x120.png', iconKey: 'utensils' },
  { id: 6, name: 'เครื่องทำน้ำแข็ง', icon: 'https://waree-th.shop/image/thumbnails/19/3c/_________________________________________________png-103373-190x120.png', iconKey: 'snowflake' },
  { id: 7, name: 'ถังแรงดันปั๊มน้ำ', icon: 'https://waree-th.shop/image/thumbnails/19/50/_____________________________________jpg-103691-190x120.jpg', iconKey: 'gauge' },
  { id: 8, name: 'ห้องส้วมเคลื่อนที่', icon: 'https://waree-th.shop/image/thumbnails/19/2b/____________________________png-103091-190x120.png', iconKey: 'bath' },
  { id: 9, name: 'แทงค์น้ำ รถยนต์', icon: 'https://waree-th.shop/image/thumbnails/1b/8b/_______________________3__png-112827-190x120.png', iconKey: 'truck' },
  { id: 10, name: 'ถังบำบัดน้ำเสีย', icon: 'https://waree-th.shop/image/thumbnails/19/07/o3UQYTay5ny9Dn8VEACr0bNcRUkXIZAqoN2AsXmI_png-102523-190x120.png', iconKey: 'recycle' },
  { id: 11, name: 'ปั๊มน้ำ', icon: 'https://waree-th.shop/image/thumbnails/1b/8b/______________________png-112823-190x120.png', iconKey: 'waves' },
  { id: 12, name: 'ตู้กดน้ำดื่ม', icon: 'https://waree-th.shop/image/thumbnails/1b/8b/________________________________________png-112824-190x120.png', iconKey: 'glass-water' },
  { id: 13, name: 'ถังเก็บน้ำใต้ดิน', icon: 'https://waree-th.shop/image/thumbnails/19/07/0l4KfUFTu2JhR8qffw4NdwqPkVjDMVtPMAbhWaqW_png-102522-190x120.png', iconKey: 'arrow-down-to-line' },
  { id: 14, name: 'เครื่องกรองน้ำและอุปกรณ์', icon: 'https://waree-th.shop/image/thumbnails/1b/8b/__________________________________png-112821-190x120.png', iconKey: 'filter' },
  { id: 15, name: 'แทงค์น้ำ ไฟเบอร์กลาส', icon: 'https://images.unsplash.com/photo-1542013936693-884638332954?w=100', iconKey: 'box' },
  { id: 16, name: 'Water Filter Accessories', icon: 'https://waree-th.shop/image/thumbnails/1b/8b/__________________________________png-112821-190x120.png', iconKey: 'filter-cog' },
];

export const BRANDS: Brand[] = [
  { id: 1, name: 'DOS', logo: 'https://via.placeholder.com/50x50?text=DOS' },
  { id: 2, name: 'WAVE', logo: 'https://via.placeholder.com/50x50?text=WAVE' },
  { id: 3, name: 'MITSUBISHI', logo: 'https://via.placeholder.com/50x50?text=MITSUBISHI' },
  { id: 4, name: 'HITACHI', logo: 'https://via.placeholder.com/50x50?text=HITACHI' }
];

export const CATEGORY_DETAILS: Record<number, CategoryDetail> = {
  1: {
    id: 1,
    name: 'แทงค์น้ำ PE',
    iconKey: 'droplets',
    highlights: [
      { title: 'WAVE', img: 'https://waree-th.shop/image/thumbnails/19/07/3s5yeLNuSXlQZPps3tVn4SbmdpvUIJlR5R5kATcO_png-102521-190x120.png' },
      { title: 'DOS', img: 'https://images.unsplash.com/photo-1584622781564-1d9876a13d00?w=300' },
      { title: 'ADVANCED', img: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=300' }
    ],
    subCategories: [
      { title: 'WAVE', items: ['300-5000 ลิตร', 'WAVE FLORA', 'WAVE PRUKSA'] },
      { title: 'DOS', items: ['DOS LIFE', 'DOS GREEN', 'DOS NATURA'] },
      { title: 'แบรนด์อื่นๆ', items: ['ADVANCED', 'P&S', 'WORLD', 'SABUY', 'SAFE', 'JUMBO', 'PP', 'ENTECH', 'GREENTREE'] },
      { title: 'Eco Friendly Tanks', items: ['Biodegradable PE', 'Recycled Materials'] }
    ],
    promoText: 'Discover our premium PE water tanks, built for durability and reliability. Special offers available now!',
    promoImg: 'https://images.unsplash.com/photo-1584622781564-1d9876a13d00?w=300'
  },
  // ... (Other categories omitted for brevity in this mock data set.)
};

const RAW_PRODUCTS: Product[] = [
  {
    id: 101,
    name: 'เครื่องเติมอากาศ SECOH EL-60',
    price: 4500,
    originalPrice: 5200,
    image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400',
    category: 'เครื่องใช้ไฟฟ้า',
    stock: 25,
    sold: 12,
    discount: 13,
    isFlashSale: true,
    isFeatured: true
  },
  // ... (Other products omitted for brevity)
];

// Initialize images array if missing
export const INITIAL_PRODUCTS: Product[] = RAW_PRODUCTS.map(p => ({
  ...p,
  images: p.images || [p.image]
}));

export const BANNERS: Banner[] = [
  { id: 1, image: 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=1200&h=400&fit=crop', alt: 'Water Systems Sale' },
  { id: 2, image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=1200&h=400&fit=crop', alt: 'Industrial Pump Expo' },
];

export const INITIAL_PAGES: Page[] = [
  {
    id: 'about-us',
    title: 'เกี่ยวกับเรา',
    slug: 'about-us',
    status: 'published',
    updatedAt: new Date().toISOString(),
    blocks: [
      {
        id: 'hero-1',
        type: 'hero',
        data: {
          title: 'เกี่ยวกับ Waree-TH',
          subtitle: 'ผู้เชี่ยวชาญด้านระบบน้ำครบวงจรที่คุณวางใจ',
          image: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=1200',
          buttonText: 'ติดต่อเรา'
        }
      },
      {
        id: 'text-1',
        type: 'text',
        data: {
          content: '<h2>วิสัยทัศน์ของเรา</h2><p>มุ่งมั่นที่จะเป็นผู้นำด้านการจัดจำหน่ายและติดตั้งระบบน้ำที่ทันสมัยที่สุดในประเทศไทย ด้วยประสบการณ์กว่า 20 ปี เราพร้อมให้บริการด้วยความซื่อสัตย์และเป็นมืออาชีพ</p>'
        }
      }
    ]
  }
];

export class DatabaseService {
  private products: Product[];
  private categories: Category[];
  private brands: Brand[];
  private banners: Banner[];
  private categoryDetails: Record<number, CategoryDetail>;
  private pages: Page[];

  constructor() {
    const storedProducts = localStorage.getItem('products');
    this.products = storedProducts ? JSON.parse(storedProducts) : INITIAL_PRODUCTS;

    const storedCategories = localStorage.getItem('categories');
    this.categories = storedCategories ? JSON.parse(storedCategories) : CATEGORIES;

    const storedBrands = localStorage.getItem('brands');
    this.brands = storedBrands ? JSON.parse(storedBrands) : BRANDS;

    const storedBanners = localStorage.getItem('banners');
    this.banners = storedBanners ? JSON.parse(storedBanners) : BANNERS;

    const storedDetails = localStorage.getItem('categoryDetails');
    this.categoryDetails = storedDetails ? JSON.parse(storedDetails) : CATEGORY_DETAILS;

    const storedPages = localStorage.getItem('pages');
    this.pages = storedPages ? JSON.parse(storedPages) : INITIAL_PAGES;
  }

  // Products
  getProducts(): Product[] { return this.products; }
  addProduct(product: Product) {
    const newProduct = { ...product, id: Date.now() };
    if (!newProduct.images && newProduct.image) newProduct.images = [newProduct.image];
    this.products.push(newProduct);
    this.saveProducts();
  }
  updateProduct(product: Product) {
    const normalizedProduct = { ...product };
    if (!normalizedProduct.images && normalizedProduct.image) {
      normalizedProduct.images = [normalizedProduct.image];
    }
    this.products = this.products.map(p => p.id === product.id ? normalizedProduct : p);
    this.saveProducts();
  }
  deleteProduct(id: number) {
    this.products = this.products.filter(p => p.id !== id);
    this.saveProducts();
  }

  // Categories
  getCategories(): Category[] { return this.categories; }
  getCategoryDetail(id: number): CategoryDetail | undefined { return this.categoryDetails[id]; }
  addCategory(category: Category) {
    const newCategory = { ...category, id: Date.now() };
    this.categories.push(newCategory);
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
  updateCategoryDetail(detail: CategoryDetail) {
    this.categoryDetails[detail.id] = detail;
    this.saveCategoryDetails();
  }

  // Brands
  getBrands(): Brand[] { return this.brands; }
  addBrand(brand: Brand) {
    const newBrand = { ...brand, id: Date.now() };
    this.brands.push(newBrand);
    this.saveBrands();
  }
  updateBrand(brand: Brand) {
    this.brands = this.brands.map(b => b.id === brand.id ? brand : b);
    this.saveBrands();
  }
  deleteBrand(id: number) {
    this.brands = this.brands.filter(b => b.id !== id);
    this.saveBrands();
  }

  // Banners
  getBanners(): Banner[] { return this.banners; }
  addBanner(banner: Banner) {
    const newBanner = { ...banner, id: Date.now() };
    this.banners.push(newBanner);
    this.saveBanners();
  }
  updateBanner(banner: Banner) {
    this.banners = this.banners.map(b => b.id === banner.id ? banner : b);
    this.saveBanners();
  }
  deleteBanner(id: number) {
    this.banners = this.banners.filter(b => b.id !== id);
    this.saveBanners();
  }

  // Pages
  getPages(): Page[] { return this.pages; }
  getPage(id: string): Page | undefined { return this.pages.find(p => p.id === id); }
  addPage(page: Page) {
    this.pages.push(page);
    this.savePages();
  }
  updatePage(page: Page) {
    this.pages = this.pages.map(p => p.id === page.id ? page : p);
    this.savePages();
  }
  deletePage(id: string) {
    this.pages = this.pages.filter(p => p.id !== id);
    this.savePages();
  }

  // Storage Helpers
  private saveProducts() { localStorage.setItem('products', JSON.stringify(this.products)); }
  private saveCategories() { localStorage.setItem('categories', JSON.stringify(this.categories)); }
  private saveBrands() { localStorage.setItem('brands', JSON.stringify(this.brands)); }
  private saveBanners() { localStorage.setItem('banners', JSON.stringify(this.banners)); }
  private saveCategoryDetails() { localStorage.setItem('categoryDetails', JSON.stringify(this.categoryDetails)); }
  private savePages() { localStorage.setItem('pages', JSON.stringify(this.pages)); }
}

export const db = new DatabaseService();
