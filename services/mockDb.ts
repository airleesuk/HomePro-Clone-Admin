
// ... (imports remain same)
import { Product, Category, Banner, CategoryDetail } from '../types';

export const CATEGORIES: Category[] = [
  { id: 1, name: 'ถังเก็บน้ำบนดิน PE', icon: 'https://waree-th.shop/image/thumbnails/19/07/3s5yeLNuSXlQZPps3tVn4SbmdpvUIJlR5R5kATcO_png-102521-190x120.png', iconKey: 'droplets' },
  { id: 2, name: 'ถังเก็บน้ำใต้ดิน PE', icon: 'https://waree-th.shop/image/thumbnails/19/07/0l4KfUFTu2JhR8qffw4NdwqPkVjDMVtPMAbhWaqW_png-102522-190x120.png', iconKey: 'hard-hat' },
  { id: 3, name: 'ถังเก็บน้ำบนดินไฟเบอร์กลาส', icon: 'https://waree-th.shop/image/thumbnails/1b/8b/___________________________________________png-112818-190x120.png', iconKey: 'droplets' },
  { id: 4, name: 'เครื่องกรองน้ำ', icon: 'https://waree-th.shop/image/thumbnails/1b/8b/__________________________________png-112821-190x120.png', iconKey: 'droplets' },
  { id: 5, name: 'ถังเก็บสารเคมี หรือ ถังยา PE', icon: 'https://waree-th.shop/image/thumbnails/1b/8b/_______________________2__png-112826-190x120.png', iconKey: 'lightbulb' },
  { id: 6, name: 'ถังเก็บน้ำสแตนเลส', icon: 'https://waree-th.shop/image/thumbnails/1b/8b/______________________________________________png-112820-190x120.png', iconKey: 'grid' },
  { id: 7, name: 'ถังดักไขมัน', icon: 'https://waree-th.shop/image/thumbnails/1b/8b/CsW1oJL0eVMTeQUQO8NMbjTKUPBVLvGEBmqPhfSR_png-112822-190x120.png', iconKey: 'hard-hat' },
  { id: 8, name: 'เครื่องทำน้ำแข็ง', icon: 'https://waree-th.shop/image/thumbnails/19/3c/_________________________________________________png-103373-190x120.png', iconKey: 'snowflake' },
  { id: 9, name: 'เครื่องใช้ไฟฟ้า', icon: 'https://waree-th.shop/image/thumbnails/1b/8b/_______________________1__png-112825-190x120.png', iconKey: 'zap' },
  { id: 10, name: 'ถังแรงดันปั๊มน้ำ', icon: 'https://waree-th.shop/image/thumbnails/19/50/_____________________________________jpg-103691-190x120.jpg', iconKey: 'wrench' },
  { id: 11, name: 'ห้องส้วมเคลื่อนที่', icon: 'https://waree-th.shop/image/thumbnails/19/2b/____________________________png-103091-190x120.png', iconKey: 'hard-hat' },
  { id: 12, name: 'แทงค์น้ำ รถยนต์', icon: 'https://waree-th.shop/image/thumbnails/1b/8b/_______________________3__png-112827-190x120.png', iconKey: 'truck' },
  { id: 13, name: 'ถังบำบัดน้ำเสีย', icon: 'https://waree-th.shop/image/thumbnails/19/07/o3UQYTay5ny9Dn8VEACr0bNcRUkXIZAqoN2AsXmI_png-102523-190x120.png', iconKey: 'droplets' },
  { id: 14, name: 'ตู้กดน้ำดื่ม', icon: 'https://waree-th.shop/image/thumbnails/1b/8b/________________________________________png-112824-190x120.png', iconKey: 'snowflake' },
  { id: 15, name: 'ปั๊มน้ำ', icon: 'https://waree-th.shop/image/thumbnails/1b/8b/______________________png-112823-190x120.png', iconKey: 'wrench' },
];

export const CATEGORY_DETAILS: Record<number, CategoryDetail> = {
  // ... (Category Details remain the same)
  1: {
    id: 1,
    name: 'ถังเก็บน้ำบนดิน PE',
    iconKey: 'droplets',
    highlights: [
      { title: 'DOS', img: 'https://waree-th.shop/image/thumbnails/19/a8/_______________________________DOS_1000___________________________ICE1000-105093-420x400.webp' },
      { title: 'Safe', img: 'https://waree-th.shop/image/thumbnails/19/7b/_____________________________________________PE_Safe_________________________________1000___________________________WTG_1000__FOOD_Grade_________________________________________________-104370-420x400.jpg' },
      { title: 'P&S', img: 'https://waree-th.shop/image/thumbnails/1a/5e/______________________________________________P_S__________________________________________1000___________________________PSGN1000-108001-420x400.webp' }
    ],
    subCategories: [
      { title: 'ขนาดความจุ', items: ['100 ลิตร', '200 ลิตร', '300 ลิตร', '400 ลิตร', '500 ลิตร', '700 ลิตร', '1000 ลิตร', '1500 ลิตร', '2000 ลิตร', '3000 ลิตร', '4000 ลิตร', '5000 ลิตร', '10000 ลิตร'] }
    ],
    promoText: 'ถังเก็บน้ำพลาสติกคุณภาพสูง ทนทาน ปลอดภัย รับประกันยาวนาน',
    promoImg: 'https://waree-th.shop/image/thumbnails/19/07/3s5yeLNuSXlQZPps3tVn4SbmdpvUIJlR5R5kATcO_png-102521-190x120.png'
  },
  2: {
    id: 2,
    name: 'ถังเก็บน้ำใต้ดิน PE',
    iconKey: 'hard-hat',
    highlights: [],
    subCategories: [
      { title: 'แบรนด์ชั้นนำ', items: ['ถังเก็บน้ำใต้ดิน PE WAVE', 'ถังเก็บน้ำใต้ดิน PE Safe', 'ถังเก็บน้ำใต้ดิน PE P&S', 'ถังเก็บน้ำใต้ดิน PE DOS'] }
    ],
    promoText: 'ถังเก็บน้ำใต้ดินทุกรุ่น คุณภาพมาตรฐาน ติดตั้งง่าย แข็งแรง',
    promoImg: 'https://waree-th.shop/image/thumbnails/19/07/0l4KfUFTu2JhR8qffw4NdwqPkVjDMVtPMAbhWaqW_png-102522-190x120.png'
  },
  3: {
    id: 3,
    name: 'ถังเก็บน้ำบนดินไฟเบอร์กลาส',
    iconKey: 'droplets',
    highlights: [],
    subCategories: [
      { title: 'ทรงยอดนิยม', items: ['ทรงถ้วยแก้ว', 'ทรงแอปเปิ้ล', 'แทงค์น้ำ ไฟเบอร์กลาส'] }
    ],
    promoText: 'ถังไฟเบอร์กลาสทนทาน ไม่เป็นสนิม เหมาะสำหรับทุกสภาพการใช้งาน',
    promoImg: 'https://waree-th.shop/image/thumbnails/1b/8b/___________________________________________png-112818-190x120.png'
  },
  4: {
    id: 4,
    name: 'เครื่องกรองน้ำ',
    iconKey: 'droplets',
    highlights: [],
    subCategories: [
      { title: 'ประเภท', items: ['เครื่องกรองน้ำดื่ม', 'เครื่องกรองน้ำใช้', 'ไส้กรอง', 'สารกรองน้ำ'] }
    ],
    promoText: 'เครื่องกรองน้ำทุกประเภท คุณภาพมาตรฐาน น้ำสะอาดบริสุทธิ์',
    promoImg: 'https://waree-th.shop/image/thumbnails/1b/8b/__________________________________png-112821-190x120.png'
  },
  5: {
    id: 5,
    name: 'ถังเก็บสารเคมี หรือ ถังยา PE',
    iconKey: 'lightbulb',
    highlights: [
        { title: 'ENTECH', img: 'https://waree-th.shop/image/thumbnails/1b/00/ENTECH_____________________________________________CW_1000_____________1000_____________1000__________-110597-420x400.jpg' }
    ],
    subCategories: [
      { title: 'ประเภท', items: ['ถังเก็บยา เวชภัณฑ์ PE', 'ถังเก็บสารเคมี PE', 'ทรงก้นกรวย', 'ทรงเหลี่ยม'] }
    ],
    promoText: 'ถังเก็บสารเคมีและยาปลอดภัย ต้านทานสารเคมีกัดกร่อนได้ดีเยี่ยม',
    promoImg: 'https://waree-th.shop/image/thumbnails/1b/8b/_______________________2__png-112826-190x120.png'
  },
  6: {
    id: 6,
    name: 'ถังเก็บน้ำสแตนเลส',
    iconKey: 'grid',
    highlights: [],
    subCategories: [
      { title: 'JUMBO', items: ['350L', '500L', '700L', '1000L', '1500L', '2000L', '3000L', '5000L', '6000L'] },
      { title: 'ตราเพชร', items: ['150L', '350L', '1100L', '1250L', '15000L'] },
      { title: 'ADVANCE', items: ['150L', '200L', '300L', '400L', '500L', '600L'] }
    ],
    promoText: 'ถังสแตนเลสคุณภาพสูง ไม่เป็นสนิม สะอาด ปลอดภัย 100%',
    promoImg: 'https://waree-th.shop/image/thumbnails/1b/8b/______________________________________________png-112820-190x120.png'
  },
  12: {
    id: 12,
    name: 'แทงค์น้ำ รถยนต์',
    iconKey: 'truck',
    highlights: [
        { title: 'Safe', img: 'https://waree-th.shop/image/thumbnails/19/79/_______________________________________________________PE_Safe______________2000___________________________WTC_2000-104349-420x400.jpg' }
    ],
    subCategories: [
      { title: 'ประเภท', items: ['ถังน้ำรถบรรทุก', 'ถังน้ำรถกู้ภัย', 'ถังน้ำรถดับเพลิง', 'ถังน้ำรถเกษตร'] }
    ],
    promoText: 'ถังน้ำสำหรับรถยนต์และยานพาหนะ ออกแบบมาเพื่อการขนส่งโดยเฉพาะ',
    promoImg: 'https://waree-th.shop/image/thumbnails/1b/8b/_______________________3__png-112827-190x120.png'
  },
  15: {
    id: 15,
    name: 'ปั๊มน้ำ',
    iconKey: 'wrench',
    highlights: [],
    subCategories: [
      { title: 'แบรนด์', items: ['ปั๊มน้ำ EBARA', 'ปั๊มน้ำ LOWARA', 'ปั๊มน้ำ MITSUBISHI', 'ปั๊มน้ำ HITACHI'] }
    ],
    promoText: 'ปั๊มน้ำคุณภาพสูงทุกประเภท แรงดันดี ทนทาน ประหยัดไฟ',
    promoImg: 'https://waree-th.shop/image/thumbnails/1b/8b/______________________png-112823-190x120.png'
  }
};

export const INITIAL_PRODUCTS: Product[] = [
  // --- ถังเก็บน้ำบนดิน PE (Sample Items) ---
  {
    id: 10259,
    name: 'แทงค์น้ำพลาสติก P&S ลายแกรนิต ขนาด 2000 ลิตร รุ่น PSGN2000',
    price: 6646,
    originalPrice: 8500,
    image: 'https://waree-th.shop/image/thumbnails/1a/5e/______________________________________________P_S__________________________________________2000___________________________PSGN2000-108005-420x400.webp',
    category: 'ถังเก็บน้ำบนดิน PE',
    stock: 999,
    sold: 154,
    isFlashSale: true,
    isFeatured: true,
    variants: [
      { id: 'v1', name: 'สีทราย', price: 6646, stock: 250 },
      { id: 'v2', name: 'สีเทา', price: 6646, stock: 250 },
      { id: 'v3', name: 'สีแดง', price: 6800, stock: 249 },
      { id: 'v4', name: 'สีเขียว', price: 6646, stock: 250 }
    ]
  },
  {
    id: 10260,
    name: 'แทงค์น้ำ PE P&S ขนาด 3000 ลิตร รุ่น PS3000',
    price: 7982,
    originalPrice: 9500,
    image: 'https://waree-th.shop/image/thumbnails/1a/5e/_________________________PE_P_S______________3000___________________________PS3000-108006-420x400.webp',
    category: 'ถังเก็บน้ำบนดิน PE',
    stock: 999,
    sold: 85,
    discount: 16,
    variants: [
        { id: 'v1', name: 'สีน้ำเงิน', price: 7982, stock: 300 },
        { id: 'v2', name: 'สีน้ำตาล', price: 7982, stock: 300 },
        { id: 'v3', name: 'สีเขียว', price: 7982, stock: 300 },
        { id: 'v4', name: 'สีขาว', price: 8100, stock: 99 }
    ]
  },
  {
    id: 6863,
    name: 'แทงค์น้ำ ถังเก็บน้ำบนดิน PE 1000 ลิตร Safe รุ่น GN1000SA (FOOD Grade)',
    price: 3500,
    originalPrice: 4200,
    image: 'https://waree-th.shop/image/thumbnails/19/7b/_____________________________________________PE_Safe_________________________________1000___________________________WTG_1000__FOOD_Grade_________________________________________________-104370-420x400.jpg',
    category: 'ถังเก็บน้ำบนดิน PE',
    stock: 999,
    sold: 542,
    isFlashSale: true,
    isFeatured: true
  },
  {
    id: 7504,
    name: 'ถังเก็บน้ำ DOS 1000 ลิตร รุ่น ICE1000',
    price: 2660,
    originalPrice: 3200,
    image: 'https://waree-th.shop/image/thumbnails/19/a8/_______________________________DOS_1000___________________________ICE1000-105093-420x400.webp',
    category: 'ถังเก็บน้ำบนดิน PE',
    stock: 999,
    sold: 320,
    discount: 17
  },
  {
    id: 6845,
    name: 'แทงค์น้ำ ถังเก็บน้ำบนดิน PE 10000 ลิตร Safe รุ่น GN10000SA',
    price: 38800,
    originalPrice: 45000,
    image: 'https://waree-th.shop/image/thumbnails/19/7a/_____________________________________________PE_Safe_________________________________10000___________________________WTG_10000__FOOD_Grade__________________________________________-104352-420x400.jpg',
    category: 'ถังเก็บน้ำบนดิน PE',
    stock: 10,
    sold: 2,
    isFeatured: true
  },
  {
    id: 4706,
    name: 'ถังเก็บน้ำบนดิน PE WAVE (Sand Beach) ขนาด 1000 ลิตร รุ่น WSB-1000',
    price: 4645,
    image: 'https://waree-th.shop/image/thumbnails/19/77/_____________________________________________PE_WAVE__Wave_Sand_Beach_______________1000___________________________WSB_1000_________________________________________-104315-420x400.jpg',
    category: 'ถังเก็บน้ำบนดิน PE',
    stock: 999,
    sold: 120,
    isFlashSale: false
  },
  
  // --- ถังเก็บสารเคมี (Sample) ---
  {
    id: 11246,
    name: 'ENTECH ถังเก็บน้ำ รุ่น CW-2000 ขนาด 2000 ลิตร สีฟ้า',
    price: 7425,
    image: 'https://waree-th.shop/image/thumbnails/1b/00/ENTECH_____________________________________________CW_2000_____________2000_____________2000__________-110595-420x400.jpg',
    category: 'ถังเก็บสารเคมี หรือ ถังยา PE',
    stock: 999,
    sold: 45
  },
  {
    id: 11252,
    name: 'ENTECH ถังเก็บน้ำ รุ่น CW-5000GS ขนาด 5000 ลิตร แกรนิตเหลือง',
    price: 28125,
    image: 'https://waree-th.shop/image/thumbnails/1b/00/ENTECH_____________________________________________CW_5000GS_____________5000_____________5000_____________________________________-110601-420x400.jpg',
    category: 'ถังเก็บสารเคมี หรือ ถังยา PE',
    stock: 50,
    sold: 10
  },

  // --- ถังเก็บน้ำสแตนเลส (Sample) ---
  {
    id: 105,
    name: 'ถังเก็บน้ำสแตนเลส JUMBO 1000L',
    price: 9500,
    originalPrice: 12000,
    image: 'https://waree-th.shop/image/thumbnails/1b/8b/______________________________________________png-112820-190x120.png',
    category: 'ถังเก็บน้ำสแตนเลส',
    stock: 5,
    sold: 2,
    discount: 20,
    isFeatured: true
  },

  // --- จับคู่ปั๊มน้ำ (Package) ---
  {
    id: 7424,
    name: 'แทงค์น้ำพลาสติก PE DOS 1000 ลิตร + ปั๊มน้ำ HITACHI 250 วัตต์',
    price: 22960,
    image: 'https://waree-th.shop/image/thumbnails/19/a3/______________________________________________PE_DOS_1000______________________________________HITACHI_250______________________________NSN_1000___WMP250-105013-420x400.webp',
    category: 'ถังเก็บน้ำบนดิน PE',
    stock: 50,
    sold: 15,
    isFlashSale: true
  },
  {
    id: 7469,
    name: 'แทงค์น้ำพลาสติก PE DOS 2000 ลิตร + ปั๊มน้ำ GRUNDFOS 500 วัตต์',
    price: 36260,
    image: 'https://waree-th.shop/image/thumbnails/19/a6/______________________________________________PE_DOS_2000______________________________________GRUNDFOS_500______________________________NSN2000_CMB3_37-105058-420x400.webp',
    category: 'ถังเก็บน้ำบนดิน PE',
    stock: 20,
    sold: 5
  },

  // --- แทงค์น้ำรถยนต์ ---
  {
    id: 6842,
    name: 'แทงค์น้ำรถยนต์ PE Safe ขนาด 2000 ลิตร รุ่น SFOC2000BL',
    price: 10880,
    image: 'https://waree-th.shop/image/thumbnails/19/79/_______________________________________________________PE_Safe______________2000___________________________WTC_2000-104349-420x400.jpg',
    category: 'แทงค์น้ำ รถยนต์',
    stock: 999,
    sold: 22,
    isFeatured: true
  },

  // --- ปั๊มน้ำ (General) ---
  {
    id: 102,
    name: 'ปั๊มน้ำ MITSUBISHI WP-205R',
    price: 5900,
    originalPrice: 6500,
    image: 'https://waree-th.shop/image/thumbnails/1b/8b/______________________png-112823-190x120.png',
    category: 'ปั๊มน้ำ',
    stock: 10,
    sold: 45,
    discount: 9,
    isFlashSale: true
  }
];

export const BANNERS: Banner[] = [
  { id: 1, image: 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=1200&h=400&fit=crop', alt: 'Water Systems Sale' },
  { id: 2, image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=1200&h=400&fit=crop', alt: 'Industrial Pump Expo' },
];

// ... (DatabaseService class remains the same)
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
