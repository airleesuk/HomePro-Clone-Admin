
import React, { useState } from 'react';
import { Search, ShoppingCart, User, Heart, Bell, Menu, MapPin, Truck, ChevronDown, X, Trash2 } from 'lucide-react';
import { MegaMenu } from './MegaMenu';
import { db } from '../services/mockDb';

interface NavLink {
  label: string;
  href: string;
  isPromo?: boolean;
  subLinks?: string[];
}

const NAV_LINKS: NavLink[] = [
  { 
    label: 'ห้องและเครื่องนอน', 
    href: '#', 
    subLinks: ['ที่นอน', 'เตียงนอน', 'ตู้เสื้อผ้า', 'โต๊ะเครื่องแป้ง', 'หมอนและผ้าห่ม'] 
  },
  { 
    label: 'ห้องน้ำ', 
    href: '#', 
    subLinks: ['สุขภัณฑ์', 'อ่างล้างหน้า', 'ฝักบัว', 'กระจกห้องน้ำ', 'อุปกรณ์ในห้องน้ำ'] 
  },
  { 
    label: 'ห้องครัว', 
    href: '#', 
    subLinks: ['ชุดครัวสำเร็จรูป', 'เตาแก๊สและเตาไฟฟ้า', 'เครื่องดูดควัน', 'อ่างล้างจาน'] 
  },
  { 
    label: 'เครื่องใช้ไฟฟ้า', 
    href: '#', 
    subLinks: ['ทีวี', 'ตู้เย็น', 'เครื่องซักผ้า', 'เครื่องปรับอากาศ', 'ไมโครเวฟ'] 
  },
  { 
    label: 'วัสดุก่อสร้าง', 
    href: '#', 
    subLinks: ['ปูน', 'หลังคา', 'ไม้ระแนง', 'รั้วและประตูชัย'] 
  },
  { label: 'โปรโมชั่น', href: '#', isPromo: true },
  { label: 'บริการเรื่องบ้าน', href: '#' },
];

export const Header: React.FC = () => {
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [wishlistCount, setWishlistCount] = useState(2); // Mock count
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);

  // Mock Wishlist Items
  const wishlistItems = db.getProducts().slice(0, 2);

  return (
    <>
      <header className="bg-white shadow-sm sticky top-0 z-50">
        {/* Top Bar */}
        <div role="navigation" aria-label="Top bar links" className="bg-[#0056b3] text-white text-xs py-1 px-4 hidden md:flex justify-between items-center">
          <div className="flex space-x-4">
             <a href="#" className="hover:text-yellow-300 cursor-pointer transition focus:outline-none focus:text-yellow-300">Professional Service</a>
             <a href="#" className="hover:text-yellow-300 cursor-pointer transition focus:outline-none focus:text-yellow-300">Call Center 1284</a>
          </div>
          <div className="flex space-x-4">
             <a href="#" className="hover:text-yellow-300 cursor-pointer transition focus:outline-none focus:text-yellow-300">Download App</a>
             <a href="#" className="hover:text-yellow-300 cursor-pointer transition focus:outline-none focus:text-yellow-300">The 1 Card</a>
             <a href="#" className="hover:text-yellow-300 cursor-pointer transition focus:outline-none focus:text-yellow-300">Corporate Sales</a>
          </div>
        </div>

        {/* Main Header */}
        <div className="container mx-auto px-2 md:px-4 py-3">
          <div className="flex flex-col md:flex-row items-center gap-4">
            
            {/* Logo */}
            <div className="flex items-center justify-between w-full md:w-auto">
               <div 
                 role="button"
                 tabIndex={0}
                 className="flex items-center gap-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#0056b3] rounded-lg p-1" 
                 onClick={() => window.location.reload()}
                 onKeyDown={(e) => e.key === 'Enter' && window.location.reload()}
                 aria-label="HomePro Home - Reload Page"
               >
                  <div className="text-[#0056b3] font-black text-3xl italic tracking-tighter">HomePro</div>
               </div>
               <button 
                className="md:hidden text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded p-1" 
                onClick={() => setIsMegaMenuOpen(true)}
                aria-label="Open menu"
                aria-expanded={isMegaMenuOpen}
               >
                 <Menu />
               </button>
            </div>

            {/* Delivery Toggle (Desktop) */}
            <div className="hidden lg:flex items-center bg-gray-100 rounded-full p-1 text-sm font-medium border border-gray-200 shadow-inner">
              <button 
                className="flex items-center gap-1 px-3 py-1 bg-orange-500 text-white rounded-full shadow-sm transition active:scale-95 focus:outline-none focus:ring-2 focus:ring-orange-300"
                aria-label="Select delivery mode"
              >
                 <MapPin size={14} /> <span>จัดส่ง</span>
              </button>
              <button 
                className="flex items-center gap-1 px-3 py-1 text-gray-500 hover:text-gray-700 transition focus:outline-none focus:ring-2 focus:ring-gray-300 rounded-full"
                aria-label="Select pickup at store mode"
              >
                 <Truck size={14} /> <span>รับที่สาขา</span>
              </button>
            </div>

            {/* Search */}
            <div className="flex-1 w-full relative" role="search">
              <div className="flex">
                <select 
                  className="hidden md:block bg-gray-100 text-gray-700 text-sm border-r border-gray-300 rounded-l-xl px-3 outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                  aria-label="Select product category"
                >
                  <option>ทั้งหมด</option>
                  <option>เครื่องใช้ไฟฟ้า</option>
                  <option>เฟอร์นิเจอร์</option>
                </select>
                <input 
                  type="text" 
                  placeholder="ค้นหา... ตู้เย็น, เครื่องซักผ้า" 
                  aria-label="Search for products"
                  className="w-full bg-gray-100 text-gray-800 py-3 px-4 md:rounded-r-xl rounded-xl md:rounded-l-none focus:outline-none focus:ring-2 focus:ring-[#0056b3] transition shadow-inner" 
                />
                <button 
                  className="absolute right-0 top-0 h-full px-4 text-[#0056b3] hover:scale-110 transition focus:outline-none focus:bg-blue-50 rounded-r-xl"
                  aria-label="Submit search"
                >
                  <Search size={22} />
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="hidden md:flex items-center gap-6 text-[#0056b3]">
              <button 
                className="flex flex-col items-center cursor-pointer hover:text-blue-800 transition group focus:outline-none focus:text-blue-800"
                aria-label="Notifications"
              >
                 <Bell size={24} className="group-hover:animate-swing" />
                 <span className="text-[10px] mt-1 font-bold">แจ้งเตือน</span>
              </button>
              <button 
                className="flex flex-col items-center cursor-pointer hover:text-pink-600 transition relative group focus:outline-none focus:text-pink-600"
                onClick={() => setIsWishlistOpen(true)}
                aria-label={`Wishlist, ${wishlistCount} items`}
              >
                 <Heart size={24} className="group-hover:scale-110 group-hover:fill-pink-100 transition-all duration-300" />
                 {wishlistCount > 0 && (
                   <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-[9px] rounded-full w-4 h-4 flex items-center justify-center font-bold ring-2 ring-white animate-pulse" aria-hidden="true">
                     {wishlistCount}
                   </span>
                 )}
                 <span className="text-[10px] mt-1 font-bold">รายการโปรด</span>
              </button>
              <button 
                className="flex flex-col items-center cursor-pointer hover:text-orange-500 transition relative group focus:outline-none focus:text-orange-500"
                aria-label="Shopping Cart, 3 items"
              >
                 <ShoppingCart size={24} className="group-hover:animate-wiggle" />
                 <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] rounded-full w-4 h-4 flex items-center justify-center font-bold ring-2 ring-white" aria-hidden="true">3</span>
                 <span className="text-[10px] mt-1 font-bold">รถเข็น</span>
              </button>
              <button 
                className="flex flex-col items-center cursor-pointer hover:text-blue-800 transition group focus:outline-none focus:text-blue-800"
                aria-label="User Account"
              >
                 <User size={24} className="group-hover:scale-110 group-hover:drop-shadow-md transition" />
                 <span className="text-[10px] mt-1 font-bold">บัญชีฉัน</span>
              </button>
            </div>
          </div>
        </div>

        {/* Dynamic Navigation Bar */}
        <div className="bg-[#0056b3] text-white hidden md:block" role="navigation" aria-label="Main Navigation">
          <div className="container mx-auto px-4">
            <ul className="flex text-sm font-medium">
               <li 
                 className={`px-4 py-3 hover:bg-blue-800 cursor-pointer flex items-center gap-2 transition-colors border-r border-blue-400 focus-within:bg-blue-800 ${isMegaMenuOpen ? 'bg-blue-800' : ''}`}
                 onClick={() => setIsMegaMenuOpen(true)}
               >
                 <button 
                  className="flex items-center gap-2 w-full h-full text-left focus:outline-none"
                  aria-expanded={isMegaMenuOpen}
                  aria-haspopup="true"
                  aria-label="Browse all product categories"
                 >
                   <Menu size={16} /> เลือกหมวดสินค้า
                 </button>
               </li>
               {NAV_LINKS.map((link) => (
                 <li 
                   key={link.label} 
                   className="relative group h-full"
                   onMouseEnter={() => setActiveDropdown(link.label)}
                   onMouseLeave={() => setActiveDropdown(null)}
                 >
                   <a 
                     href={link.href} 
                     className={`px-4 py-3 hover:bg-blue-800 cursor-pointer transition-colors flex items-center gap-1.5 h-full focus:outline-none focus:bg-blue-800 ${link.isPromo ? 'text-yellow-300 font-bold' : ''}`}
                     aria-haspopup={link.subLinks ? "true" : undefined}
                     aria-expanded={link.subLinks ? activeDropdown === link.label : undefined}
                   >
                     {link.label}
                     {link.subLinks && <ChevronDown size={14} className="opacity-70 group-hover:rotate-180 transition-transform" aria-hidden="true" />}
                   </a>
                   
                   {link.subLinks && activeDropdown === link.label && (
                     <div 
                        className="absolute top-full left-0 w-56 bg-white shadow-2xl rounded-b-xl overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-300 z-[60]"
                        role="menu"
                        aria-label={`${link.label} submenu`}
                     >
                       <ul className="py-2">
                         {link.subLinks.map((sub, i) => (
                           <li key={i} role="none">
                             <a 
                               href="#" 
                               className="block px-4 py-2.5 text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors cursor-pointer text-sm font-medium border-l-2 border-transparent hover:border-blue-500 focus:outline-none focus:bg-gray-50 focus:text-blue-600 focus:border-blue-500"
                               role="menuitem"
                               onClick={(e) => e.preventDefault()}
                             >
                               {sub}
                             </a>
                           </li>
                         ))}
                       </ul>
                     </div>
                   )}
                 </li>
               ))}
            </ul>
          </div>
        </div>

        {/* Mega Menu Component */}
        <MegaMenu 
          isOpen={isMegaMenuOpen} 
          onClose={() => setIsMegaMenuOpen(false)} 
        />
      </header>

      {/* Wishlist Drawer/Modal */}
      {isWishlistOpen && (
        <div 
          className="fixed inset-0 z-[120] flex justify-end"
          role="dialog"
          aria-modal="true"
          aria-labelledby="wishlist-title"
        >
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" onClick={() => setIsWishlistOpen(false)} aria-hidden="true" />
          <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            
            {/* Drawer Header */}
            <div className="p-5 bg-gradient-to-r from-blue-900 to-blue-800 text-white flex justify-between items-center shadow-lg">
              <div className="flex items-center gap-3">
                 <Heart size={20} className="fill-white" aria-hidden="true" />
                 <h2 id="wishlist-title" className="font-bold text-lg">รายการโปรด ({wishlistCount})</h2>
              </div>
              <button 
                onClick={() => setIsWishlistOpen(false)} 
                className="hover:bg-white/20 p-2 rounded-full transition focus:outline-none focus:ring-2 focus:ring-white"
                aria-label="Close wishlist"
              >
                <X size={20} />
              </button>
            </div>

            {/* Wishlist Items */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
               {wishlistItems.length > 0 ? (
                 wishlistItems.map((item) => (
                   <div key={item.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex gap-4 group hover:shadow-md transition">
                      <div className="w-20 h-20 bg-gray-50 rounded-lg overflow-hidden shrink-0">
                         <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 flex flex-col justify-between">
                         <div>
                            <h4 className="text-sm font-bold text-gray-800 line-clamp-2">{item.name}</h4>
                            <p className="text-xs text-gray-500 mt-1">{item.category}</p>
                         </div>
                         <div className="flex justify-between items-end mt-2">
                            <span className="text-[#0056b3] font-black">฿{item.price.toLocaleString()}</span>
                            <div className="flex gap-2">
                               <button 
                                className="text-gray-400 hover:text-red-500 p-1 transition focus:outline-none focus:text-red-500" 
                                title="ลบ"
                                aria-label={`Remove ${item.name} from wishlist`}
                               >
                                 <Trash2 size={16} />
                               </button>
                               <button 
                                className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition shadow-sm active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                aria-label={`Add ${item.name} to cart`}
                               >
                                 <ShoppingCart size={16} />
                               </button>
                            </div>
                         </div>
                      </div>
                   </div>
                 ))
               ) : (
                 <div className="h-full flex flex-col items-center justify-center text-gray-400">
                    <Heart size={48} className="mb-4 opacity-20" aria-hidden="true" />
                    <p>ไม่มีสินค้าในรายการโปรด</p>
                 </div>
               )}
            </div>

            {/* Footer */}
            <div className="p-4 bg-white border-t border-gray-100">
               <button className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition shadow-lg hover:shadow-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500">
                 ดูรายการทั้งหมด
               </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
};
