
import { Product, Category, Banner, CategoryDetail, Brand, Page, User, Order } from '../types';

export const CATEGORIES: Category[] = [
  { id: 1, name: 'แทงค์น้ำ PE', icon: 'https://waree-th.shop/image/thumbnails/19/07/3s5yeLNuSXlQZPps3tVn4SbmdpvUIJlR5R5kATcO_png-102521-190x120.png', iconKey: 'droplets' },
  { id: 2, name: 'เครื่องใช้ไฟฟ้า', icon: 'https://waree-th.shop/image/thumbnails/1b/8b/_______________________1__png-112825-190x120.png', iconKey: 'zap' },
  { id: 3, name: 'ถังเก็บสารเคมี หรือ ถังเคมี PE', icon: 'https://waree-th.shop/image/thumbnails/1b/8b/_______________________2__png-112826-190x120.png', iconKey: 'flask' },
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
  { id: 14, name: 'เครื่องกรองน้ำและอุปกรณ์..', icon: 'https://waree-th.shop/image/thumbnails/1b/8b/__________________________________png-112821-190x120.png', iconKey: 'filter' },
  { id: 15, name: 'แทงค์น้ำ ไฟเบอร์กลาส', icon: 'https://images.unsplash.com/photo-1542013936693-1d56a6e81ed9?w=100', iconKey: 'box' },
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
  // Default detail for category 3 (Flask / Chemical Tanks)
  3: {
    id: 3,
    name: 'ถังเก็บสารเคมี หรือ ถังเคมี PE',
    iconKey: 'flask',
    highlights: [
      { title: 'Chemical Resistant', img: 'https://images.unsplash.com/photo-1579737196098-4b7b2b2b2b2b?w=300' },
      { title: 'Industrial Grade', img: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=300' }
    ],
    subCategories: [
      { title: 'ประเภท', items: ['ถังเคมี PE', 'ถังเก็บกรด', 'ถังเก็บด่าง'] },
      { title: 'ขนาด', items: ['500 ลิตร', '1000 ลิตร', '2000 ลิตร'] }
    ],
    promoText: 'ถังเก็บสารเคมีทนทาน มาตรฐานอุตสาหกรรม ปลอดภัยสูงสุด',
    promoImg: 'https://images.unsplash.com/photo-1626818192341-a18a5e0b0e5c?w=300'
  },
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
    isFeatured: true,
    description: 'เครื่องเติมอากาศคุณภาพสูงจาก SECOH รุ่น EL-60 เหมาะสำหรับบ่อปลาและระบบบำบัดน้ำเสีย ทำงานเงียบ ประหยัดพลังงาน ทนทานต่อการใช้งานต่อเนื่อง'
  },
  { id: 102, name: 'ปั๊มน้ำอัตโนมัติ HITACHI WM-P300EX', price: 7900, originalPrice: 8500, image: 'https://images.unsplash.com/photo-1626818192341-a18a5e0b0e5c?w=400', category: 'ปั๊มน้ำ', stock: 15, sold: 30, discount: 7, isFeatured: true, description: 'ปั๊มน้ำอัตโนมัติแรงดันคงที่ HITACHI WM-P300EX ให้สายน้ำแรงสม่ำเสมอทุกจุดใช้งาน ตัดการทำงานอัตโนมัติเมื่อปิดน้ำ มอเตอร์แข็งแรงทนทาน รับประกัน 5 ปี' },
  { 
    id: 103, 
    name: 'แทงค์น้ำ DOS DURA SHIELD 1000L', 
    price: 6500, 
    originalPrice: 7200, 
    image: 'https://images.unsplash.com/photo-1584622781564-1d9876a13d00?w=400', 
    category: 'แทงค์น้ำ PE', 
    stock: 20, 
    sold: 50, 
    isFlashSale: true, 
    description: 'ถังเก็บน้ำบนดิน DOS DURA SHIELD ขนาด 1000 ลิตร ผลิตจากวัสดุ Polymer Elixir มาตรฐาน Food Grade สะอาด ปลอดภัย ไร้ตะไคร่น้ำ ป้องกัน UV สูงสุดถึงระดับ 20',
    variants: [
      { id: 'v103-1', name: 'สีทราย (Sand)', price: 6500, stock: 15, image: 'https://images.unsplash.com/photo-1584622781564-1d9876a13d00?w=400' },
      { id: 'v103-2', name: 'สีน้ำเงิน (Blue)', price: 6200, stock: 5, image: 'https://images.unsplash.com/photo-1542013936693-1d56a6e81ed9?w=400' }
    ]
  },
  { id: 104, name: 'เครื่องกรองน้ำ Safe รุ่น Alkaline Plus', price: 3990, originalPrice: 4500, image: 'https://images.unsplash.com/photo-1616712398687-0b1a1b1b1b1b?w=400', category: 'เครื่องกรองน้ำและอุปกรณ์..', stock: 10, sold: 25, description: 'เครื่องกรองน้ำดื่ม Safe Alkaline Plus ระบบการกรอง 5 ขั้นตอน พร้อมปรับสภาพน้ำให้มีความเป็นด่างอ่อนๆ ช่วยปรับสมดุลร่างกาย ติดตั้งง่าย ได้มาตรฐาน NSF' },
  { id: 105, name: 'พัดลมไอเย็น Masterkool MIK-20EX', price: 2990, originalPrice: 3500, image: 'https://images.unsplash.com/photo-1563729579040-3f4c6e7f8b9a?w=400', category: 'เครื่องใช้ไฟฟ้า', stock: 5, sold: 18, description: 'พัดลมไอเย็น Masterkool รุ่น MIK-20EX เย็นสดชื่นด้วยแผงรังผึ้งขนาดใหญ่ ครอบคลุมพื้นที่ 20 ตรม. ถังน้ำ 23 ลิตร ใช้งานต่อเนื่อง 5-9 ชม. ประหยัดไฟ' },
  { id: 106, name: 'ถังบำบัดน้ำเสีย AQUATEK AQ-ST 800L', price: 9500, originalPrice: 10200, image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400', category: 'ถังบำบัดน้ำเสีย', stock: 3, sold: 5, isFeatured: true, description: 'ถังบำบัดน้ำเสียสำเร็จรูป AQUATEK รุ่น AQ-ST 800L แข็งแรงทนทาน ผลิตจาก PE คุณภาพสูง บำบัดน้ำเสียได้มาตรฐานกรมควบคุมมลพิษ' },
  { id: 107, name: 'เครื่องทำน้ำอุ่น Panasonic DH-3JL2TH', price: 2200, originalPrice: 2500, image: 'https://images.unsplash.com/photo-1579737196098-4b7b2b2b2b2b?w=400', category: 'เครื่องใช้ไฟฟ้า', stock: 20, sold: 40, isFlashSale: true, description: 'เครื่องทำน้ำอุ่น Panasonic 3500W รุ่น DH-3JL2TH ดีไซน์บางสวย ปลอดภัยด้วยระบบ ELB ตัดไฟอัตโนมัติ พร้อมหัวฝักบัวปรับสายน้ำได้' },
  { id: 108, name: 'ปั๊มจุ่ม Kanto KT-QDX-1500', price: 1800, originalPrice: 2000, image: 'https://images.unsplash.com/photo-1626818192341-a18a5e0b0e5c?w=400', category: 'ปั๊มน้ำ', stock: 7, sold: 10 },
  { id: 109, name: 'แทงค์น้ำ WAVE 500L', price: 3200, originalPrice: 3800, image: 'https://images.unsplash.com/photo-1584622781564-1d9876a13d00?w=400', category: 'แทงค์น้ำ PE', stock: 12, sold: 22 },
  { id: 110, name: 'เครื่องกรองน้ำ RO Purelux', price: 5500, originalPrice: 6000, image: 'https://images.unsplash.com/photo-1616712398687-0b1a1b1b1b1b?w=400', category: 'เครื่องกรองน้ำและอุปกรณ์..', stock: 9, sold: 15, isFlashSale: true },
  { id: 111, name: 'เครื่องดูดฝุ่นไร้สาย Xiaomi G9', price: 4990, originalPrice: 5500, image: 'https://images.unsplash.com/photo-1563729579040-3f4c6e7f8b9a?w=400', category: 'เครื่องใช้ไฟฟ้า', stock: 18, sold: 8 },
  { id: 112, name: 'ถังแรงดัน Pentax', price: 2500, originalPrice: 2800, image: 'https://images.unsplash.com/photo-1579737196098-4b7b2b2b2b2b?w=400', category: 'ถังแรงดันปั๊มน้ำ', stock: 4, sold: 7, isFeatured: true },
  { id: 113, name: 'ตู้เย็น Hitachi R-H200PD', price: 12900, originalPrice: 13500, image: 'https://images.unsplash.com/photo-1626818192341-a18a5e0b0e5c?w=400', category: 'เครื่องใช้ไฟฟ้า', stock: 6, sold: 3 },
  { id: 114, name: 'เครื่องซักผ้า LG FV1208S4W', price: 18900, originalPrice: 19900, image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400', category: 'เครื่องใช้ไฟฟ้า', stock: 11, sold: 9 },
  { id: 115, name: 'แทงค์น้ำสแตนเลส ตราช้าง 1500L', price: 15000, originalPrice: 16000, image: 'https://images.unsplash.com/photo-1584622781564-1d9876a13d00?w=400', category: 'ถังเก็บน้ำสแตนเลส', stock: 2, sold: 1, isFlashSale: true },
  { id: 116, name: 'เครื่องปรับอากาศ Daikin FTKQ12YV2S', price: 21000, originalPrice: 22500, image: 'https://images.unsplash.com/photo-1616712398687-0b1a1b1b1b1b?w=400', category: 'เครื่องใช้ไฟฟ้า', stock: 14, sold: 11 },
  { id: 117, name: 'ปั๊มน้ำ Grundfos CH2-30PC', price: 9800, originalPrice: 10500, image: 'https://images.unsplash.com/photo-1563729579040-3f4c6e7f8b9a?w=400', category: 'ปั๊มน้ำ', stock: 6, sold: 13, isFeatured: true },
  { id: 118, name: 'เครื่องทำน้ำแข็ง HOSHIZAKI IM-30CNE', price: 25000, originalPrice: 27000, image: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=400', category: 'เครื่องทำน้ำแข็ง', stock: 1, sold: 2, isFlashSale: true },
  { id: 119, name: 'เครื่องซักผ้าฝาหน้า Samsung WW70J4246BW', price: 14900, originalPrice: 15500, image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400', category: 'เครื่องใช้ไฟฟ้า', stock: 9, sold: 6 },
  { id: 120, name: 'แทงค์น้ำ PE Diamond 700L', price: 4200, originalPrice: 4800, image: 'https://images.unsplash.com/photo-1584622781564-1d9876a13d00?w=400', category: 'แทงค์น้ำ PE', stock: 10, sold: 19, isFeatured: true },
];

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
  },
  {
    id: 'installation-service',
    title: 'บริการติดตั้งแทงค์น้ำ',
    slug: 'installation-service',
    status: 'published',
    updatedAt: new Date().toISOString(),
    blocks: [
      {
        id: 'hero-inst',
        type: 'hero',
        data: {
          title: 'บริการติดตั้งแทงค์น้ำมาตรฐานมืออาชีพ',
          subtitle: 'มั่นใจด้วยทีมช่างผู้เชี่ยวชาญ รับประกันงานติดตั้ง',
          image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=1200',
          buttonText: 'จองคิวบริการ'
        }
      },
      {
        id: 'text-inst',
        type: 'text',
        data: {
          content: '<h3>ทำไมต้องใช้บริการติดตั้งกับเรา?</h3><ul><li>ช่างผ่านการอบรมมาตรฐานกรมพัฒนาฝีมือแรงงาน</li><li>รับประกันงานติดตั้ง 180 วัน</li><li>ไม่มีค่าใช้จ่ายแฝง</li></ul>'
        }
      }
    ]
  }
];

// Mock Users
export const INITIAL_USERS: User[] = [
  { id: 'u1', name: 'John Doe', email: 'john@example.com', role: 'ADMIN', image: 'https://i.pravatar.cc/150?u=u1', createdAt: new Date().toISOString() },
  { id: 'u2', name: 'Jane Smith', email: 'jane@example.com', role: 'CUSTOMER', image: 'https://i.pravatar.cc/150?u=u2', createdAt: new Date().toISOString() },
];

// Mock Orders
export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-001',
    userId: 'u2',
    userName: 'Jane Smith',
    totalAmount: 4500,
    status: 'COMPLETED',
    items: [
      { id: 'item-1', productId: 101, productName: 'เครื่องเติมอากาศ SECOH EL-60', quantity: 1, price: 4500 }
    ],
    createdAt: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: 'ord-002',
    userId: 'u2',
    userName: 'Jane Smith',
    totalAmount: 12900,
    status: 'PENDING',
    items: [
      { id: 'item-2', productId: 113, productName: 'ตู้เย็น Hitachi R-H200PD', quantity: 1, price: 12900 }
    ],
    createdAt: new Date().toISOString()
  }
];

interface ProductQueryParams {
  searchQuery?: string;
  categoryFilter?: string;
  stockFilter?: 'all' | 'low' | 'out' | 'in';
  typeFilter?: 'all' | 'flash' | 'featured' | 'normal';
  brandFilter?: string;
  sortKey?: keyof Product;
  sortDirection?: 'asc' | 'desc';
  page?: number;
  itemsPerPage?: number;
}

export class DatabaseService {
  private products: Product[];
  private categories: Category[];
  private brands: Brand[];
  private banners: Banner[];
  private categoryDetails: Record<number, CategoryDetail>;
  private pages: Page[];
  private users: User[];
  private orders: Order[];

  constructor() {
    if (typeof window !== 'undefined' && window.localStorage) {
      const storedProducts = localStorage.getItem('products');
      const parsedProducts = storedProducts ? JSON.parse(storedProducts) : null;
      this.products = Array.isArray(parsedProducts) ? parsedProducts : INITIAL_PRODUCTS;

      const storedCategories = localStorage.getItem('categories');
      const parsedCategories = storedCategories ? JSON.parse(storedCategories) : null;
      this.categories = Array.isArray(parsedCategories) ? parsedCategories : CATEGORIES;

      const storedBrands = localStorage.getItem('brands');
      const parsedBrands = storedBrands ? JSON.parse(storedBrands) : null;
      this.brands = Array.isArray(parsedBrands) ? parsedBrands : BRANDS;

      const storedBanners = localStorage.getItem('banners');
      const parsedBanners = storedBanners ? JSON.parse(storedBanners) : null;
      this.banners = Array.isArray(parsedBanners) ? parsedBanners : BANNERS;

      const storedDetails = localStorage.getItem('categoryDetails');
      const parsedDetails = storedDetails ? JSON.parse(storedDetails) : null;
      this.categoryDetails = (parsedDetails && typeof parsedDetails === 'object') ? parsedDetails : CATEGORY_DETAILS;

      const storedPages = localStorage.getItem('pages');
      const parsedPages = storedPages ? JSON.parse(storedPages) : null;
      this.pages = Array.isArray(parsedPages) ? parsedPages : INITIAL_PAGES;

      const storedUsers = localStorage.getItem('users');
      this.users = storedUsers ? JSON.parse(storedUsers) : INITIAL_USERS;

      const storedOrders = localStorage.getItem('orders');
      this.orders = storedOrders ? JSON.parse(storedOrders) : INITIAL_ORDERS;
    } else {
      this.products = INITIAL_PRODUCTS;
      this.categories = CATEGORIES;
      this.brands = BRANDS;
      this.banners = BANNERS;
      this.categoryDetails = CATEGORY_DETAILS;
      this.pages = INITIAL_PAGES;
      this.users = INITIAL_USERS;
      this.orders = INITIAL_ORDERS;
    }
  }

  // Products
  getProducts(): Product[] { return this.products; }

  queryProducts(params: ProductQueryParams): { products: Product[]; totalCount: number } {
    const { 
      searchQuery = '', 
      categoryFilter = 'All', 
      stockFilter = 'all', 
      typeFilter = 'all', 
      brandFilter = 'all', 
      sortKey = null, 
      sortDirection = 'asc', 
      page = 1, 
      itemsPerPage = 10 
    } = params;

    let result = this.products.filter(product => {
      const searchLower = searchQuery.toLowerCase().trim();
      const matchesSearch = 
        product.name.toLowerCase().includes(searchLower) ||
        product.category.toLowerCase().includes(searchLower) ||
        product.id.toString().includes(searchLower);
        
      const matchesCategory = categoryFilter === 'All' || product.category === categoryFilter;

      const matchesStock = 
        stockFilter === 'all' ? true :
        stockFilter === 'low' ? product.stock > 0 && product.stock < 5 :
        stockFilter === 'out' ? product.stock === 0 :
        stockFilter === 'in' ? product.stock >= 5 : true;

      const matchesType = 
        typeFilter === 'all' ? true :
        typeFilter === 'flash' ? product.isFlashSale :
        typeFilter === 'featured' ? product.isFeatured :
        typeFilter === 'normal' ? !product.isFlashSale && !product.isFeatured : true;

      const matchesBrand = 
        brandFilter === 'all' ? true :
        product.brandId?.toString() === brandFilter;

      return matchesSearch && matchesCategory && matchesStock && matchesType && matchesBrand;
    });

    if (sortKey !== null) {
      result.sort((a, b) => {
        const aValue = a[sortKey];
        const bValue = b[sortKey];

        if (aValue === undefined || bValue === undefined) return 0;

        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return sortDirection === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
        }
        
        if (typeof aValue === 'number' && typeof bValue === 'number') {
          return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
        }
        
        return sortDirection === 'asc' ? 
          String(aValue).localeCompare(String(bValue)) : 
          String(bValue).localeCompare(String(aValue));
      });
    }

    const totalCount = result.length;
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedProducts = result.slice(startIndex, endIndex);

    return { products: paginatedProducts, totalCount };
  }


  addProduct(product: Product): Product {
    const newProduct = { ...product, id: Date.now() };
    if (!newProduct.images && newProduct.image) newProduct.images = [newProduct.image];
    this.products.push(newProduct);
    this.saveProducts();
    return newProduct;
  }
  updateProduct(product: Product) {
    this.products = this.products.map(p => p.id === product.id ? product : p);
    this.saveProducts();
  }
  deleteProduct(id: number) {
    this.products = this.products.filter(p => p.id !== id);
    this.saveProducts();
  }

  // Categories
  getCategories(): Category[] { return this.categories; }
  getCategoryDetail(id: number): CategoryDetail | undefined { return this.categoryDetails[id]; }
  
  addCategory(category: Category): Category {
    const newCategory = { ...category, id: Date.now() };
    this.categories.push(newCategory);
    
    if (!this.categoryDetails[newCategory.id]) {
      this.categoryDetails[newCategory.id] = {
        id: newCategory.id,
        name: newCategory.name,
        iconKey: newCategory.iconKey || 'box',
        highlights: [],
        subCategories: [],
        promoText: '',
        promoImg: ''
      };
      this.saveCategoryDetails();
    }
    this.saveCategories();
    return newCategory;
  }
  
  updateCategory(category: Category) {
    this.categories = this.categories.map(c => c.id === category.id ? category : c);
    
    if (this.categoryDetails[category.id]) {
      this.categoryDetails[category.id].name = category.name;
      this.categoryDetails[category.id].iconKey = category.iconKey || 'box';
      this.saveCategoryDetails();
    }
    this.saveCategories();
  }

  reorderCategories(newCategories: Category[]) {
    this.categories = newCategories;
    this.saveCategories();
  }
  
  deleteCategory(id: number) {
    this.categories = this.categories.filter(c => c.id !== id);
    if (this.categoryDetails[id]) {
      delete this.categoryDetails[id];
      this.saveCategoryDetails();
    }
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
    return newBrand;
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
    return newBanner;
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

  // New Data Getters
  getUsers(): User[] { return this.users; }
  getOrders(): Order[] { return this.orders; }

  // Helper to flatten variants
  getAllVariants() {
    return this.products.flatMap(p => (p.variants || []).map(v => ({
      ...v,
      productId: p.id,
      productName: p.name
    })));
  }

  // Storage Helpers
  private saveProducts() { if (typeof window !== 'undefined') localStorage.setItem('products', JSON.stringify(this.products)); }
  private saveCategories() { if (typeof window !== 'undefined') localStorage.setItem('categories', JSON.stringify(this.categories)); }
  private saveBrands() { if (typeof window !== 'undefined') localStorage.setItem('brands', JSON.stringify(this.brands)); }
  private saveBanners() { if (typeof window !== 'undefined') localStorage.setItem('banners', JSON.stringify(this.banners)); }
  private saveCategoryDetails() { if (typeof window !== 'undefined') localStorage.setItem('categoryDetails', JSON.stringify(this.categoryDetails)); }
  private savePages() { if (typeof window !== 'undefined') localStorage.setItem('pages', JSON.stringify(this.pages)); }
}

export const db = new DatabaseService();
