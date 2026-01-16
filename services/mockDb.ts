
import { Product, Category, Banner, CategoryDetail } from '../types';

export const CATEGORIES: Category[] = [
  { id: 1, name: 'เครื่องเติมอากาศ', icon: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=100', iconKey: 'zap' },
  { id: 2, name: 'ถังเก็บน้ำและเคมี', icon: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=100', iconKey: 'droplets' },
  { id: 3, name: 'ปั๊มน้ำและถังแรงดัน', icon: 'https://images.unsplash.com/photo-1558317374-a35498f3ffa9?w=100', iconKey: 'wrench' },
  { id: 4, name: 'เครื่องกรองน้ำ', icon: 'https://images.unsplash.com/photo-1521977637891-139998077460?w=100', iconKey: 'grid' },
  { id: 5, name: 'ถังดักไขมัน', icon: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=100', iconKey: 'hard-hat' },
  { id: 6, name: 'ไส้กรองและสารกรอง', icon: 'https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?w=100', iconKey: 'lightbulb' },
];

export const CATEGORY_DETAILS: Record<number, CategoryDetail> = {
  1: {
    id: 1,
    name: 'เครื่องเติมอากาศ',
    iconKey: 'zap',
    highlights: [
      { title: 'SECOH', img: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=300' },
      { title: 'FUJIMAC', img: 'https://images.unsplash.com/photo-1581092348103-07d60b370771?w=300' },
      { title: 'HIBLOW', img: 'https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?w=300' }
    ],
    subCategories: [
      { title: 'SECOH Series', items: ['EL Series (EL-60, EL-80)', 'JDK Series', 'SLL Series', 'EL-120/150 Twin'] },
      { title: 'FUJIMAC Series', items: ['MAC-40N', 'MAC-60N', 'MAC-80N', 'MAC-100R'] },
      { title: 'HIBLOW Series', items: ['HP Series', 'XP Series', 'DUO Series', 'อะไหล่ไดอะแฟรม'] },
      { title: 'อุปกรณ์เสริม', items: ['ท่อแยก', 'หัวทราย', 'สายยางซิลิโคน', 'วาล์วปรับลม'] }
    ],
    promoText: 'เครื่องเติมอากาศแบรนด์ดัง ลดสูงสุด 20% พร้อมรับประกันศูนย์ไทยทุกเครื่อง',
    promoImg: 'https://images.unsplash.com/photo-1581092162384-8987c1d64718?w=600'
  },
  2: {
    id: 2,
    name: 'ถังเก็บน้ำและเคมี',
    iconKey: 'droplets',
    highlights: [
      { title: 'ถังยา PE', img: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=300' },
      { title: 'ถังทรงเหลี่ยม', img: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=300' },
      { title: 'ถังรถยนต์', img: 'https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?w=300' }
    ],
    subCategories: [
      { title: 'ถังเก็บสารเคมี PE', items: ['ถังยา PE (50L - 1000L)', 'ทรงกันกรวย', 'ทรงเหลี่ยม', 'ถังเก็บน้ำบนดิน'] },
      { title: 'ถังสำหรับรถยนต์', items: ['แทงค์น้ำรถบรรทุก', 'ถังน้ำติดรถกระบะ', 'ถังสารเคมีเคลื่อนที่'] },
      { title: 'ถังสแตนเลส', items: ['ถังตราเพชร', 'ถัง JUMBO', 'ถัง ADVANCE', 'ถังแรงดันสแตนเลส'] },
      { title: 'ทรงพิเศษ', items: ['ทรงแอปเปิ้ล', 'ทรงกรวยแก้ว', 'ถังน้ำแข็ง', 'พาเลทพลาสติก'] }
    ],
    promoText: 'ถังเก็บน้ำคุณภาพสูง ปลอดภัยสำหรับอุปโภคบริโภค จัดส่งทั่วประเทศ',
    promoImg: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600'
  },
  3: {
    id: 3,
    name: 'ปั๊มน้ำและถังแรงดัน',
    iconKey: 'wrench',
    highlights: [
      { title: 'ปั๊มน้ำอัตโนมัติ', img: 'https://images.unsplash.com/photo-1558317374-a35498f3ffa9?w=300' },
      { title: 'ถังแรงดัน', img: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=300' },
      { title: 'ปั๊มอุตสาหกรรม', img: 'https://images.unsplash.com/photo-1571175443880-49e1d58b794a?w=300' }
    ],
    subCategories: [
      { title: 'แบรนด์ปั๊มน้ำ', items: ['HITACHI', 'MITSUBISHI', 'GRUNDFOS', 'FRANKLIN'] },
      { title: 'ถังแรงดัน (Pressure Tank)', items: ['HYDROLINE', 'VAREM', 'AQUA', 'BESTTANK'] },
      { title: 'ระบบปั๊ม', items: ['Booster Pump', 'Transfer Pump', 'Submersible Pump (ปั๊มแช่)'] },
      { title: 'อะไหล่และอุปกรณ์', items: ['Pressure Switch', 'Flow Switch', 'Check Valve', 'เกจวัดแรงดัน'] }
    ],
    promoText: 'ปั๊มน้ำเสียงเงียบ แรงดันคงที่ ลดแรงสั่นสะเทือน ติดตั้งฟรีในกทม.',
    promoImg: 'https://images.unsplash.com/photo-1584622781564-1d9876a13d00?w=600'
  },
  4: {
    id: 4,
    name: 'เครื่องกรองน้ำ',
    iconKey: 'grid',
    highlights: [
      { title: 'กรองน้ำดื่ม', img: 'https://images.unsplash.com/photo-1521977637891-139998077460?w=300' },
      { title: 'กรองน้ำใช้', img: 'https://images.unsplash.com/photo-1626806819282-2c1dc01a5e0c?w=300' },
      { title: 'ตู้น้ำหยอดเหรียญ', img: 'https://images.unsplash.com/photo-1585776245991-cf79dd6903bf?w=300' }
    ],
    subCategories: [
      { title: 'ระบบ RO', items: ['เครื่องกรอง 5 ขั้นตอน', 'เมมเบรน RO', 'ปั๊มอัด RO', 'ถังเก็บน้ำ RO'] },
      { title: 'ระบบ UF', items: ['เครื่องกรอง UF', 'ไส้กรอง UF', 'Inline Filter'] },
      { title: 'สารกรอง', items: ['Carbon', 'Resin', 'Manganese', 'Anthracite'] },
      { title: 'อุปกรณ์', items: ['กระบอกกรอง Housing', 'ก๊อกน้ำดื่ม', 'ข้อต่อ Fitting'] }
    ],
    promoText: 'น้ำดื่มสะอาด มั่นใจทุกหยด ด้วยเครื่องกรองน้ำมาตรฐานสากล',
    promoImg: 'https://images.unsplash.com/photo-1521977637891-139998077460?w=600'
  },
  5: {
    id: 5,
    name: 'ถังดักไขมัน',
    iconKey: 'hard-hat',
    highlights: [
      { title: 'ตั้งพื้น', img: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=300' },
      { title: 'ฝังดิน', img: 'https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?w=300' },
      { title: 'สแตนเลส', img: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=300' }
    ],
    subCategories: [
      { title: 'ประเภทวัสดุ', items: ['ไฟเบอร์กลาส (Fiberglass)', 'พลาสติก PE', 'สแตนเลส 304'] },
      { title: 'ขนาดความจุ', items: ['15 ลิตร (ครัวเรือน)', '30-60 ลิตร (ร้านอาหารเล็ก)', '140+ ลิตร (อุตสาหกรรม)'] },
      { title: 'แบรนด์', items: ['DOS', 'WAVE', 'SAFE', 'AQUA'] },
      { title: 'อุปกรณ์เสริม', items: ['ตะแกรงดักเศษอาหาร', 'ท่อน้ำทิ้ง', 'จุลินทรีย์ย่อยสลาย'] }
    ],
    promoText: 'แก้ปัญหท่อน้ำอุดตันและกลิ่นรบกวน ด้วยถังดักไขมันประสิทธิภาพสูง',
    promoImg: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=600'
  },
  6: {
    id: 6,
    name: 'ไส้กรองและสารกรอง',
    iconKey: 'lightbulb',
    highlights: [
      { title: 'Carbon', img: 'https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?w=300' },
      { title: 'Resin', img: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=300' },
      { title: 'Sand', img: 'https://images.unsplash.com/photo-1558317374-a35498f3ffa9?w=300' }
    ],
    subCategories: [
      { title: 'สารกรองน้ำ', items: ['Carbon (ดูดซับกลิ่น)', 'Resin (ลดความกระด้าง)', 'Manganese (กำจัดสนิมเหล็ก)', 'Anthracite (กรองตะกอน)'] },
      { title: 'ไส้กรอง PP', items: ['10 นิ้ว', '20 นิ้ว', 'Big Blue', 'จีบ (Pleated)'] },
      { title: 'ไส้กรอง CTO/GAC', items: ['Carbon Block', 'Granular Carbon', 'Post Carbon'] },
      { title: 'ชุดไส้กรอง', items: ['ชุด 3 ขั้นตอน', 'ชุด 5 ขั้นตอน', 'ชุดปี'] }
    ],
    promoText: 'เปลี่ยนไส้กรองตามกำหนด เพื่อสุขภาพน้ำดื่มที่ดีของคุณและครอบครัว',
    promoImg: 'https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?w=600'
  }
};

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 101,
    name: 'เครื่องเติมอากาศ SECOH EL-60',
    price: 4500,
    originalPrice: 5200,
    image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400',
    category: 'เครื่องเติมอากาศ',
    stock: 25,
    sold: 12,
    discount: 13,
    isFlashSale: true,
    isFeatured: true
  },
  {
    id: 102,
    name: 'ถังเก็บสารเคมี PE ทรงเหลี่ยม 200L',
    price: 3200,
    originalPrice: 3800,
    image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400',
    category: 'ถังเก็บน้ำและเคมี',
    stock: 10,
    sold: 5,
    discount: 15,
    isFlashSale: false,
    isFeatured: true
  },
  {
    id: 103,
    name: 'ปั๊มน้ำอัตโนมัติ HITACHI WM-P250XX',
    price: 7800,
    originalPrice: 8500,
    image: 'https://images.unsplash.com/photo-1558317374-a35498f3ffa9?w=400',
    category: 'ปั๊มน้ำและถังแรงดัน',
    stock: 15,
    sold: 45,
    isFlashSale: true
  },
  {
    id: 104,
    name: 'ถังแรงดัน HYDROLINE 24 ลิตร',
    price: 2100,
    originalPrice: 2500,
    image: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?w=400',
    category: 'ปั๊มน้ำและถังแรงดัน',
    stock: 30,
    sold: 8,
    discount: 16,
    isFlashSale: false
  }
];

export const BANNERS: Banner[] = [
  { id: 1, image: 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=1200&h=400&fit=crop', alt: 'Water Systems Sale' },
  { id: 2, image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=1200&h=400&fit=crop', alt: 'Industrial Pump Expo' },
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

  getCategoryDetail(id: number): CategoryDetail | undefined {
    return CATEGORY_DETAILS[id];
  }

  addProduct(product: Product) {
    const newProduct = { ...product, id: Date.now() };
    this.products.push(newProduct);
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
