
import { 
  Product, Category, Brand, Banner, Page, SavedBlock, 
  User, Order, ProductVariant, CategoryDetail, PageLayout
} from '../types';

export const CATEGORY_DETAILS: Record<number, CategoryDetail> = {
  1: {
    id: 1,
    name: 'ถังเก็บน้ำบนดิน PE',
    iconKey: 'droplets',
    highlights: [
      { title: 'Best Seller', img: 'https://images.unsplash.com/photo-1584622781564-1d9876a13d00?w=300' },
      { title: 'New Arrival', img: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=300' },
      { title: 'Promotion', img: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=300' }
    ],
    subCategories: [
      { title: 'ขนาดเล็ก (100-550 ลิตร)', items: ['100 ลิตร', '200 ลิตร', '300 ลิตร', '330 ลิตร', '400 ลิตร', '500 ลิตร', '550 ลิตร'] },
      { title: 'ขนาดกลาง (600-1050 ลิตร)', items: ['600 ลิตร', '620 ลิตร', '700 ลิตร', '750 ลิตร', '800 ลิตร', '900 ลิตร', '1000 ลิตร', '1050 ลิตร'] },
      { title: 'ขนาดใหญ่ (1200-2500 ลิตร)', items: ['1200 ลิตร', '1500 ลิตร', '2000 ลิตร', '2200 ลิตร', '2500 ลิตร'] },
      { title: 'ขนาดจัมโบ้ (3000+ ลิตร)', items: ['3000 ลิตร', '4000 ลิตร', '5000 ลิตร', '6000 ลิตร', '8000 ลิตร', '10000 ลิตร', '11500 ลิตร', '12000 ลิตร', '16500 ลิตร'] }
    ],
    promoText: 'ถังน้ำ PE คุณภาพสูง หลากขนาด ตอบโจทย์ทุกความต้องการ',
    promoImg: 'https://images.unsplash.com/photo-1584622781564-1d9876a13d00?w=300'
  },
  2: {
    id: 2,
    name: 'ถังเก็บน้ำใต้ดิน PE',
    iconKey: 'arrow-down-to-line',
    highlights: [
      { title: 'WAVE', img: 'https://images.unsplash.com/photo-1542013936693-1d56a6e81ed9?w=300' },
      { title: 'DOS', img: 'https://images.unsplash.com/photo-1533630737487-7313ba40a7dc?w=300' }
    ],
    subCategories: [
      { title: 'แบรนด์ชั้นนำ', items: ['ถังเก็บน้ำใต้ดิน PE WAVE', 'ถังเก็บน้ำใต้ดิน PE Safe', 'ถังเก็บน้ำใต้ดิน PE P&S', 'ถังเก็บน้ำใต้ดิน PE DOS'] }
    ],
    promoText: 'ประหยัดพื้นที่ แข็งแรง ทนทาน รับแรงกดทับได้ดีเยี่ยม',
    promoImg: 'https://images.unsplash.com/photo-1542013936693-1d56a6e81ed9?w=300'
  },
  3: {
    id: 3,
    name: 'ถังเก็บน้ำบนดินไฟเบอร์กลาส',
    iconKey: 'box',
    highlights: [
      { title: 'Large Scale', img: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=300' },
      { title: 'Design', img: 'https://images.unsplash.com/photo-1579737196098-4b7b2b2b2b2b?w=300' }
    ],
    subCategories: [
      { title: 'รูปทรง', items: ['ทรงถ้วยแก้ว', 'ทรงแอปเปิ้ล'] }
    ],
    promoText: 'ถังไฟเบอร์กลาส แข็งแรง น้ำหนักเบา ทนแดดทนฝน',
    promoImg: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=300'
  },
  4: {
    id: 4,
    name: 'เครื่องกรองน้ำและอุปกรณ์',
    iconKey: 'filter',
    highlights: [
      { title: 'Pure Water', img: 'https://images.unsplash.com/photo-1521977637891-139998077460?w=300' },
      { title: 'Filter Parts', img: 'https://images.unsplash.com/photo-1616712398687-0b1a1b1b1b1b?w=300' }
    ],
    subCategories: [
      { title: 'ประเภทเครื่องกรอง', items: ['เครื่องกรองน้ำดื่ม แบบมีถังสำรองน้ำ', 'เครื่องกรองน้ำดื่ม แบบแขวน', 'เครื่องกรองน้ำอุตสาหกรรม', 'เครื่องกรองน้ำดื่ม'] },
      { title: 'อุปกรณ์และอะไหล่', items: ['ไส้กรองเครื่องกรองน้ำ/สารกรองน้ำ', 'ถังกรองน้ำใช้/เครื่องกรองน้ำใช้'] }
    ],
    promoText: 'น้ำดื่มสะอาด เพื่อสุขภาพที่ดีของทุกคนในครอบครัว',
    promoImg: 'https://images.unsplash.com/photo-1521977637891-139998077460?w=300'
  },
  5: {
    id: 5,
    name: 'ถังเก็บสารเคมี หรือ ถังยา PE',
    iconKey: 'flask',
    highlights: [
      { title: 'Industrial', img: 'https://images.unsplash.com/photo-1626818192341-a18a5e0b0e5c?w=300' }
    ],
    subCategories: [
      { title: 'ประเภทถัง', items: ['ถังเก็บยา เวชภัณฑ์ PE', 'ถังเก็บสารเคมี PE'] },
      { title: 'รูปทรง', items: ['ทรงก้นกรวย', 'ทรงเหลี่ยม'] }
    ],
    promoText: 'ถังเคมีเกรดพิเศษ ทนการกัดกร่อน ปลอดภัยมาตรฐานโรงงาน',
    promoImg: 'https://images.unsplash.com/photo-1626818192341-a18a5e0b0e5c?w=300'
  },
  6: {
    id: 6,
    name: 'ถังเก็บน้ำสแตนเลส',
    iconKey: 'database',
    highlights: [
      { title: 'Premium', img: 'https://images.unsplash.com/photo-1565514020176-892eb5b3770a?w=300' }
    ],
    subCategories: [
      { title: 'แบรนด์', items: ['สแตนเลส JUMBO', 'ตราเพชร', 'ADVANCE'] }
    ],
    promoText: 'สแตนเลสเกรด 304 แท้ สะอาด ปลอดสนิม',
    promoImg: 'https://images.unsplash.com/photo-1565514020176-892eb5b3770a?w=300'
  },
  7: {
    id: 7,
    name: 'ถังดักไขมัน',
    iconKey: 'utensils',
    highlights: [
      { title: 'Kitchen', img: 'https://images.unsplash.com/photo-1584622781564-1d9876a13d00?w=300' }
    ],
    subCategories: [
      { title: 'วัสดุ', items: ['ถังดักไขมันไฟเบอร์กลาส'] },
      { title: 'รูปแบบการติดตั้ง', items: ['แบบติดใต้ซิงค์', 'แบบฝังดิน'] }
    ],
    promoText: 'บอกลาท่อตัน ด้วยถังดักไขมันประสิทธิภาพสูง',
    promoImg: 'https://images.unsplash.com/photo-1584622781564-1d9876a13d00?w=300'
  },
  8: {
    id: 8,
    name: 'เครื่องทำน้ำแข็ง',
    iconKey: 'snowflake',
    highlights: [
      { title: 'Cooling', img: 'https://images.unsplash.com/photo-1579737196098-4b7b2b2b2b2b?w=300' }
    ],
    subCategories: [
      { title: 'ประเภท', items: ['เครื่องจ่ายน้ำแข็ง'] },
      { title: 'ชนิดน้ำแข็ง', items: ['เครื่องทำน้ำแข็ง ก้อนสี่เหลี่ยม', 'เครื่องทำน้ำแข็ง เกล็ด', 'เครื่องทำน้ำแข็ง ยูนิตถ้วยเล็ก/ใหญ่', 'เครื่องผลิตน้ำแข็งหลอดเล็ก'] }
    ],
    promoText: 'น้ำแข็งสะอาด ผลิตเองได้ ประหยัดกว่า',
    promoImg: 'https://images.unsplash.com/photo-1579737196098-4b7b2b2b2b2b?w=300'
  },
  9: {
    id: 9,
    name: 'เครื่องใช้ไฟฟ้า',
    iconKey: 'zap',
    highlights: [
      { title: 'Air Pump', img: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=300' }
    ],
    subCategories: [
      { title: 'เครื่องเติมอากาศ', items: ['เครื่องเติมอากาศ FujiMAC', 'เครื่องเติมอากาศ Hiblow', 'เครื่องเติมอากาศ SECOH'] }
    ],
    promoText: 'เครื่องเติมอากาศและอุปกรณ์ไฟฟ้าสำหรับระบบน้ำ',
    promoImg: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=300'
  },
  10: {
    id: 10,
    name: 'ถังแรงดันปั๊มน้ำ',
    iconKey: 'gauge',
    highlights: [
      { title: 'Pressure', img: 'https://images.unsplash.com/photo-1626818192341-a18a5e0b0e5c?w=300' }
    ],
    subCategories: [
      { title: 'รุ่น', items: ['BESTTANK 10BAR', 'ไดอะแฟรม AQUA/Hydroline/เหล็กกาวาไนซ์'] },
      { title: 'วัสดุ', items: ['ถังแรงดันน้ำสแตนเลส', 'ถังแรงดันน้ำเหล็ก'] }
    ],
    promoText: 'รักษาแรงดันน้ำสม่ำเสมอ ยืดอายุปั๊มน้ำ',
    promoImg: 'https://images.unsplash.com/photo-1626818192341-a18a5e0b0e5c?w=300'
  },
  11: {
    id: 11,
    name: 'ห้องส้วมเคลื่อนที่',
    iconKey: 'bath',
    highlights: [
      { title: 'Portable', img: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=300' }
    ],
    subCategories: [
      { title: 'ประเภท', items: ['ห้องน้ำมาตรฐาน', 'ห้องน้ำพรีเมี่ยม', 'ห้องน้ำพิเศษ', 'ห้องน้ำสำหรับผู้พิการ'] }
    ],
    promoText: 'สะดวก สะอาด เคลื่อนย้ายง่าย พร้อมใช้งานทันที',
    promoImg: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=300'
  },
  12: {
    id: 12,
    name: 'แทงค์น้ำ รถยนต์',
    iconKey: 'truck',
    highlights: [
      { title: 'Mobile Tank', img: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=300' }
    ],
    subCategories: [
      { title: 'ประเภทรถ', items: ['ถังน้ำรถบรรทุก', 'ถังน้ำรถกู้ภัย', 'ถังน้ำรถดับเพลิง', 'ถังน้ำรถเกษตร'] }
    ],
    promoText: 'ถังน้ำสำหรับติดรถ แข็งแรงพิเศษ ทนแรงกระแทก',
    promoImg: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=300'
  },
  13: {
    id: 13,
    name: 'ถังบำบัดน้ำเสีย',
    iconKey: 'recycle',
    highlights: [
      { title: 'Septic', img: 'https://images.unsplash.com/photo-1542013936693-1d56a6e81ed9?w=300' }
    ],
    subCategories: [
      { title: 'วัสดุ', items: ['ถังบำบัดน้ำเสีย PE', 'ถังบำบัดน้ำเสียไฟเบอร์กลาส'] }
    ],
    promoText: 'ระบบบำบัดน้ำเสียมาตรฐาน เป็นมิตรต่อสิ่งแวดล้อม',
    promoImg: 'https://images.unsplash.com/photo-1542013936693-1d56a6e81ed9?w=300'
  },
  14: {
    id: 14,
    name: 'ตู้กดน้ำดื่ม',
    iconKey: 'glass-water',
    highlights: [
      { title: 'Dispenser', img: 'https://images.unsplash.com/photo-1521977637891-139998077460?w=300' }
    ],
    subCategories: [
      { title: 'ระบบอุณหภูมิ', items: ['ตู้กดน้ำดื่มร้อน-เย็น', 'ตู้กดน้ำดื่มธรรมดา'] },
      { title: 'วัสดุตัวเครื่อง', items: ['ตู้กดน้ำดื่มสแตนเลส', 'ตู้กดน้ำดื่มพลาสติก'] }
    ],
    promoText: 'ตู้กดน้ำเย็นชื่นใจ สะอาด ปลอดภัย',
    promoImg: 'https://images.unsplash.com/photo-1521977637891-139998077460?w=300'
  },
  15: {
    id: 15,
    name: 'ปั๊มน้ำ',
    iconKey: 'waves',
    highlights: [
      { title: 'Powerful', img: 'https://images.unsplash.com/photo-1626818192341-a18a5e0b0e5c?w=300' }
    ],
    subCategories: [
      { title: 'แบรนด์', items: ['ปั๊มน้ำ EBARA', 'ปั๊มน้ำ LOWARA', 'ปั๊มน้ำ MITSUBISHI', 'ปั๊มน้ำ HITACHI'] }
    ],
    promoText: 'ปั๊มน้ำแรง เงียบ ประหยัดไฟ',
    promoImg: 'https://images.unsplash.com/photo-1626818192341-a18a5e0b0e5c?w=300'
  }
};

export const CATEGORIES: Category[] = [
  { id: 1, name: 'ถังเก็บน้ำบนดิน PE', icon: 'https://images.unsplash.com/photo-1584622781564-1d9876a13d00?w=100', iconKey: 'droplets' },
  { id: 2, name: 'ถังเก็บน้ำใต้ดิน PE', icon: 'https://images.unsplash.com/photo-1542013936693-1d56a6e81ed9?w=100', iconKey: 'arrow-down-to-line' },
  { id: 3, name: 'ถังเก็บน้ำบนดินไฟเบอร์กลาส', icon: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=100', iconKey: 'box' },
  { id: 4, name: 'เครื่องกรองน้ำและอุปกรณ์', icon: 'https://images.unsplash.com/photo-1521977637891-139998077460?w=100', iconKey: 'filter' },
  { id: 5, name: 'ถังเก็บสารเคมี หรือ ถังยา PE', icon: 'https://images.unsplash.com/photo-1626818192341-a18a5e0b0e5c?w=100', iconKey: 'flask' },
  { id: 6, name: 'ถังเก็บน้ำสแตนเลส', icon: 'https://images.unsplash.com/photo-1565514020176-892eb5b3770a?w=100', iconKey: 'database' },
  { id: 7, name: 'ถังดักไขมัน', icon: 'https://images.unsplash.com/photo-1584622781564-1d9876a13d00?w=100', iconKey: 'utensils' },
  { id: 8, name: 'เครื่องทำน้ำแข็ง', icon: 'https://images.unsplash.com/photo-1579737196098-4b7b2b2b2b2b?w=100', iconKey: 'snowflake' },
  { id: 9, name: 'เครื่องใช้ไฟฟ้า', icon: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=100', iconKey: 'zap' },
  { id: 10, name: 'ถังแรงดันปั๊มน้ำ', icon: 'https://images.unsplash.com/photo-1626818192341-a18a5e0b0e5c?w=100', iconKey: 'gauge' },
  { id: 11, name: 'ห้องส้วมเคลื่อนที่', icon: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=100', iconKey: 'bath' },
  { id: 12, name: 'แทงค์น้ำ รถยนต์', icon: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=100', iconKey: 'truck' },
  { id: 13, name: 'ถังบำบัดน้ำเสีย', icon: 'https://images.unsplash.com/photo-1542013936693-1d56a6e81ed9?w=100', iconKey: 'recycle' },
  { id: 14, name: 'ตู้กดน้ำดื่ม', icon: 'https://images.unsplash.com/photo-1521977637891-139998077460?w=100', iconKey: 'glass-water' },
  { id: 15, name: 'ปั๊มน้ำ', icon: 'https://images.unsplash.com/photo-1626818192341-a18a5e0b0e5c?w=100', iconKey: 'waves' },
];

const MOCK_PRODUCTS: Product[] = [
    {
        id: 101,
        name: 'ถังเก็บน้ำ DOS Life NATURA 1000L',
        price: 6990,
        originalPrice: 8500,
        category: 'ถังเก็บน้ำบนดิน PE',
        image: 'https://images.unsplash.com/photo-1584622781564-1d9876a13d00?w=500',
        stock: 25,
        sold: 154,
        discount: 18,
        isFeatured: true,
        isFlashSale: true,
        description: 'ถังเก็บน้ำคุณภาพสูง ป้องกัน UV ระดับ 20 รับประกัน 25 ปี',
        variants: []
    },
    {
        id: 102,
        name: 'ปั๊มน้ำอัตโนมัติ Mitsubishi WP-205R',
        price: 5400,
        category: 'ปั๊มน้ำ',
        image: 'https://images.unsplash.com/photo-1626818192341-a18a5e0b0e5c?w=500',
        stock: 10,
        sold: 89,
        isFeatured: true,
        variants: []
    },
    {
        id: 103,
        name: 'เครื่องทำน้ำอุ่น Panasonic 3500W',
        price: 2990,
        originalPrice: 3590,
        category: 'เครื่องใช้ไฟฟ้า',
        image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=500',
        stock: 45,
        sold: 320,
        discount: 15,
        isFlashSale: true,
        variants: []
    },
    {
        id: 104,
        name: 'ถังเก็บน้ำ P&S Fiberglass PE 3000 ลิตร',
        price: 8500,
        originalPrice: 9900,
        category: 'ถังเก็บน้ำบนดิน PE',
        image: 'https://images.unsplash.com/photo-1617103994363-c74238b3b3a6?w=500',
        stock: 15,
        sold: 42,
        discount: 14,
        isFeatured: false,
        isFlashSale: true,
        description: 'ถังเก็บน้ำ P&S รุ่นยอดนิยม ความจุ 3000 ลิตร ผลิตจากวัสดุ PE คุณภาพสูง ทนทานต่อแสงแดด รับประกัน 15 ปี',
        variants: []
    },
    {
        id: 105,
        name: 'ถังเก็บน้ำ WORLD WT 1000 ลิตร (Food Grade)',
        price: 5500,
        originalPrice: 6200,
        category: 'ถังเก็บน้ำบนดิน PE',
        image: 'https://images.unsplash.com/photo-1543237939-b68c2fe0c14c?w=500',
        stock: 30,
        sold: 112,
        discount: 11,
        isFeatured: true,
        isFlashSale: false,
        description: 'ถังเก็บน้ำ WORLD รุ่น WT1000 ปลอดภัยสำหรับน้ำดื่ม (Food Grade) ความจุ 1000 ลิตร สีทราย สวยงามเข้ากับทุกสไตล์บ้าน',
        variants: []
    },
    {
        id: 106,
        name: 'ถังแรงดันน้ำสแตนเลส พร้อมเกจวัด',
        price: 7800,
        category: 'ถังแรงดันปั๊มน้ำ',
        image: 'https://images.unsplash.com/photo-1628126744837-5645a2a5f4f8?w=500',
        stock: 8,
        sold: 25,
        isFeatured: false,
        isFlashSale: false,
        description: 'ถังแรงดันน้ำสแตนเลสเกรด 304 ทนทาน ไม่เป็นสนิม มาพร้อมเกจวัดแรงดันและวาล์วคุณภาพสูง เหมาะสำหรับระบบปั๊มน้ำในบ้านและโรงงาน',
        variants: []
    },
    {
        id: 107,
        name: 'เครื่องกรองน้ำ Pentair 3-Stage Drinking Water System',
        price: 4590,
        originalPrice: 5200,
        category: 'เครื่องกรองน้ำและอุปกรณ์',
        image: 'https://images.unsplash.com/photo-1563502874-5692078a8a23?w=500',
        stock: 50,
        sold: 210,
        discount: 12,
        isFeatured: true,
        isFlashSale: true,
        description: 'เครื่องกรองน้ำดื่ม 3 ขั้นตอนจาก Pentair มาตรฐาน NSF/ANSI ลดแบคทีเรีย ไวรัส และซีสต์ได้ 99.9% พร้อมก๊อกน้ำดีไซน์สวยงาม',
        variants: []
    }
];

class Database {
    private products: Product[] = MOCK_PRODUCTS;
    private categories: Category[] = CATEGORIES;
    private categoryDetails: Record<number, CategoryDetail> = CATEGORY_DETAILS;
    private brands: Brand[] = [
        { id: 1, name: 'DOS', logo: 'https://via.placeholder.com/100?text=DOS' },
        { id: 2, name: 'Mitsubishi', logo: 'https://via.placeholder.com/100?text=Mitsubishi' },
        { id: 3, name: 'Panasonic', logo: 'https://via.placeholder.com/100?text=Panasonic' },
        { id: 4, name: 'WAVE', logo: 'https://via.placeholder.com/100?text=WAVE' },
        { id: 5, name: 'P&S', logo: 'https://via.placeholder.com/100?text=P&S' },
        { id: 6, name: 'WORLD', logo: 'https://via.placeholder.com/100?text=WORLD' },
        { id: 7, name: 'Pentair', logo: 'https://via.placeholder.com/100?text=Pentair' },
    ];
    private banners: Banner[] = [
        { id: 1, image: 'https://images.unsplash.com/photo-1584622781564-1d9876a13d00?w=1200', alt: 'Summer Sale' }
    ];
    private pages: Page[] = [];
    private savedBlocks: SavedBlock[] = [];
    private layouts: PageLayout[] = [
      {
        id: 'layout-default',
        name: 'Default Page Layout',
        description: 'Standard layout with hero, features, and product row.',
        isDefault: true,
        blocks: [
          {
            id: 'block-def-1',
            type: 'hero',
            data: { title: 'Welcome to Our Store', subtitle: 'Best products for your home', image: 'https://images.unsplash.com/photo-1584622781564-1d9876a13d00?w=1200', buttonText: 'Shop Now' }
          },
          {
            id: 'block-def-2',
            type: 'grid',
            data: { columns: 3, items: [
              { title: 'Free Shipping', description: 'On orders over 2000 THB', image: '' },
              { title: 'Warranty', description: '1 Year official warranty', image: '' },
              { title: 'Support', description: '24/7 Customer support', image: '' }
            ]}
          },
          {
            id: 'block-def-3',
            type: 'product-row',
            data: { title: 'New Arrivals', category: 'All', count: 4 }
          }
        ]
      }
    ];
    private users: User[] = [];
    private orders: Order[] = [];

    // Products
    getProducts(): Product[] { return this.products; }
    setProducts(p: Product[]) { this.products = p; }
    
    queryProducts(params: {
        searchQuery?: string,
        categoryFilter?: string,
        stockFilter?: string,
        typeFilter?: string,
        brandFilter?: string,
        sortKey?: keyof Product,
        sortDirection?: 'asc' | 'desc',
        page?: number,
        itemsPerPage?: number,
    }) {
        let filtered = [...this.products];

        if (params.searchQuery) {
            const q = params.searchQuery.toLowerCase();
            filtered = filtered.filter(p => p.name.toLowerCase().includes(q) || p.id.toString().includes(q));
        }
        if (params.categoryFilter && params.categoryFilter !== 'All') {
            filtered = filtered.filter(p => p.category === params.categoryFilter);
        }
        if (params.stockFilter && params.stockFilter !== 'all') {
            if (params.stockFilter === 'out') filtered = filtered.filter(p => p.stock === 0);
            else if (params.stockFilter === 'low') filtered = filtered.filter(p => p.stock > 0 && p.stock < 5);
            else if (params.stockFilter === 'in') filtered = filtered.filter(p => p.stock >= 5);
        }
        if (params.typeFilter && params.typeFilter !== 'all') {
            if (params.typeFilter === 'flash') filtered = filtered.filter(p => p.isFlashSale);
            else if (params.typeFilter === 'featured') filtered = filtered.filter(p => p.isFeatured);
            else if (params.typeFilter === 'normal') filtered = filtered.filter(p => !p.isFlashSale && !p.isFeatured);
        }
        if (params.brandFilter && params.brandFilter !== 'all') {
            filtered = filtered.filter(p => p.brandId === Number(params.brandFilter));
        }

        if (params.sortKey) {
            filtered.sort((a, b) => {
                const valA = a[params.sortKey!] as any;
                const valB = b[params.sortKey!] as any;
                if (valA < valB) return params.sortDirection === 'asc' ? -1 : 1;
                if (valA > valB) return params.sortDirection === 'asc' ? 1 : -1;
                return 0;
            });
        }

        const totalCount = filtered.length;
        if (params.page && params.itemsPerPage) {
            const start = (params.page - 1) * params.itemsPerPage;
            filtered = filtered.slice(start, start + params.itemsPerPage);
        }

        return { products: filtered, totalCount };
    }

    addProduct(p: Product) {
        const newProduct = { ...p, id: p.id || Date.now() };
        this.products.push(newProduct);
    }
    updateProduct(p: Product) {
        const idx = this.products.findIndex(x => x.id === p.id);
        if (idx > -1) this.products[idx] = p;
    }
    deleteProduct(id: number) {
        this.products = this.products.filter(x => x.id !== id);
    }
    getAllVariants() {
        return this.products.flatMap(p => p.variants || []);
    }

    // Categories
    getCategories(): Category[] { return this.categories; }
    setCategories(c: Category[]) { this.categories = c; }
    addCategory(c: Category) { this.categories.push({ ...c, id: Date.now() }); }
    updateCategory(c: Category) {
        const idx = this.categories.findIndex(x => x.id === c.id);
        if (idx > -1) this.categories[idx] = c;
    }
    deleteCategory(id: number) { this.categories = this.categories.filter(x => x.id !== id); }
    reorderCategories(c: Category[]) { this.categories = c; }
    
    getCategoryDetail(id: number) { return this.categoryDetails[id]; }
    updateCategoryDetail(detail: CategoryDetail) {
        this.categoryDetails[detail.id] = detail;
    }

    // Brands
    getBrands(): Brand[] { return this.brands; }
    setBrands(b: Brand[]) { this.brands = b; }
    addBrand(b: Brand) { this.brands.push({ ...b, id: Date.now() }); }
    updateBrand(b: Brand) {
        const idx = this.brands.findIndex(x => x.id === b.id);
        if (idx > -1) this.brands[idx] = b;
    }
    deleteBrand(id: number) { this.brands = this.brands.filter(x => x.id !== id); }

    // Banners
    getBanners(): Banner[] { return this.banners; }
    addBanner(b: Banner) { this.banners.push({ ...b, id: Date.now() }); }
    updateBanner(b: Banner) {
        const idx = this.banners.findIndex(x => x.id === b.id);
        if (idx > -1) this.banners[idx] = b;
    }
    deleteBanner(id: number) { this.banners = this.banners.filter(x => x.id !== id); }

    // Pages
    getPages(): Page[] { return this.pages; }
    getPage(id: string) { return this.pages.find(p => p.id === id); }
    addPage(p: Page) { this.pages.push(p); }
    updatePage(p: Page) {
        const idx = this.pages.findIndex(x => x.id === p.id);
        if (idx > -1) this.pages[idx] = p;
    }
    deletePage(id: string) { this.pages = this.pages.filter(x => x.id !== id); }

    // Layouts
    getLayouts(): PageLayout[] { return this.layouts; }
    addLayout(l: PageLayout) { 
        if (l.isDefault) {
            this.layouts.forEach(layout => layout.isDefault = false);
        }
        this.layouts.push(l); 
    }
    updateLayout(l: PageLayout) {
        if (l.isDefault) {
            this.layouts.forEach(layout => layout.isDefault = false);
        }
        const idx = this.layouts.findIndex(x => x.id === l.id);
        if (idx > -1) this.layouts[idx] = l;
    }
    deleteLayout(id: string) { this.layouts = this.layouts.filter(x => x.id !== id); }
    getDefaultLayout(): PageLayout | undefined { return this.layouts.find(l => l.isDefault); }

    // Saved Blocks
    getSavedBlocks(): SavedBlock[] { return this.savedBlocks; }
    addSavedBlock(b: SavedBlock) { this.savedBlocks.push(b); }
    deleteSavedBlock(id: string) { this.savedBlocks = this.savedBlocks.filter(x => x.id !== id); }

    // Users & Orders (Mock)
    getUsers() { return this.users; }
    setUsers(u: User[]) { this.users = u; }
    getOrders() { return this.orders; }
    setOrders(o: Order[]) { this.orders = o; }
}

export const db = new Database();
