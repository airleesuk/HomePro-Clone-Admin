
import React, { useState, useEffect, useRef } from 'react';
import { Search, ShoppingCart, User, Heart, Bell, Menu, MapPin, Truck, ChevronDown, ArrowLeft, X } from 'lucide-react';
import { MegaMenu } from './MegaMenu';

interface NavSubLink {
  label: string;
  slug?: string; // If present, it's a page
}

interface NavLink {
  label: string;
  href: string;
  isPromo?: boolean;
  subLinks?: (string | NavSubLink)[]; // Allow both strings (legacy) and objects
}

const NAV_LINKS: NavLink[] = [
  { label: 'หน้าแรก', href: '#' },
  { label: 'สินค้าทั้งหมด', href: '#' },
  { label: 'โปรโมชั่น', href: '#', isPromo: true },
  { 
    label: 'บริการงานระบบ', 
    href: '#', 
    subLinks: [
      { label: 'บริการติดตั้งแทงค์น้ำ', slug: 'installation-service' },
      { label: 'บริการติดตั้งปั๊มน้ำ', slug: 'pump-service' }, // Mock slugs
      { label: 'บริการล้างถังเก็บน้ำ', slug: 'cleaning-service' },
      { label: 'งานเดินท่อประปา', slug: 'plumbing-service' }
    ]
  },
  { label: 'เกี่ยวกับเรา', href: '#', subLinks: [{label: 'ประวัติความเป็นมา', slug: 'about-us'}] },
  { label: 'ติดต่อเรา', href: '#' },
];

export const Header: React.FC = () => {
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [wishlistCount, setWishlistCount] = useState(5); // Mock count
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  
  // Mobile Search State
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const mobileSearchInputRef = useRef<HTMLInputElement>(null);

  // Focus management for dropdowns
  const navTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // SEO: Add Meta Tags
  useEffect(() => {
    document.title = "Waree-TH | ศูนย์รวมเรื่องบ้าน แทงค์น้ำ ปั๊มน้ำ ครบวงจร";
    
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', 'Waree-TH จำหน่ายแทงค์น้ำ ปั๊มน้ำ เครื่องกรองน้ำ และอุปกรณ์เรื่องบ้านคุณภาพสูง ราคาถูก พร้อมบริการติดตั้งและจัดส่งทั่วไทย');
  }, []);

  // Mobile search focus
  useEffect(() => {
    if (isMobileSearchOpen && mobileSearchInputRef.current) {
        // Small delay to ensure animation doesn't cause jank
        setTimeout(() => mobileSearchInputRef.current?.focus(), 100);
    }
  }, [isMobileSearchOpen]);

  const handleSearchFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    // Only trigger mobile full screen search on small screens
    if (window.innerWidth < 768) {
      e.target.blur(); // Prevent keyboard on the background input
      setIsMobileSearchOpen(true);
    }
  };

  const handleDropdownFocus = (label: string) => {
    if (navTimeoutRef.current) clearTimeout(navTimeoutRef.current);
    setActiveDropdown(label);
  };

  const handleDropdownBlur = (e: React.FocusEvent) => {
    // Close dropdown if focus moves outside the parent li
    const currentTarget = e.currentTarget;
    navTimeoutRef.current = setTimeout(() => {
        if (!currentTarget.contains(document.activeElement)) {
            setActiveDropdown(null);
        }
    }, 100);
  };

  const handlePageNavigation = (slug?: string) => {
    if (slug) {
      // Dispatch custom event for App.tsx to listen
      window.dispatchEvent(new CustomEvent('navigate-page', { detail: { slug } }));
      setActiveDropdown(null);
    }
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      {/* Mobile Full Screen Search Overlay */}
      {isMobileSearchOpen && (
        <div 
            className="fixed inset-0 bg-white/95 backdrop-blur-md z-[100] flex flex-col md:hidden animate-in fade-in slide-in-from-top-10 duration-300 origin-top" 
            role="dialog" 
            aria-modal="true" 
            aria-label="Mobile Search"
        >
           <div className="flex items-center gap-2 p-4 border-b border-gray-100 shadow-sm bg-white">
              <button 
                onClick={() => setIsMobileSearchOpen(false)}
                className="p-2 -ml-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Close search"
              >
                <ArrowLeft size={24} />
              </button>
              <div className="flex-1 relative group">
                <input 
                  ref={mobileSearchInputRef}
                  type="text"
                  placeholder="ค้นหาสินค้าที่ต้องการ..."
                  className="w-full bg-gray-100 text-gray-800 py-3 pl-10 pr-4 rounded-xl outline-none focus:ring-2 focus:ring-[#0056b3] text-base transition-all"
                  aria-label="Search input mobile"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#0056b3]" size={18} />
              </div>
           </div>
           
           <div className="flex-1 p-4 overflow-y-auto animate-in slide-in-from-bottom-4 duration-500 delay-75 fill-mode-both">
              <div className="mb-6">
                <h4 className="font-bold text-gray-800 mb-3 text-sm flex items-center gap-2">🔥 การค้นหายอดนิยม</h4>
                <div className="flex flex-wrap gap-2">
                  {['ปั๊มน้ำ Mitsubishi', 'แทงค์น้ำ DOS', 'เครื่องกรองน้ำ', 'พัดลมไอเย็น', 'ถังบำบัด'].map((tag, idx) => (
                    <button key={idx} className="bg-gray-50 border border-gray-100 px-3 py-1.5 rounded-lg text-sm text-gray-600 active:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-200">
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                 <h4 className="font-bold text-gray-800 mb-3 text-sm">ประวัติการค้นหา</h4>
                 <ul className="space-y-2 text-sm text-gray-500">
                    <li className="flex items-center gap-2 py-2 border-b border-gray-50 cursor-pointer active:bg-gray-50">
                       <Search size={14} className="text-gray-300" /> ถังเก็บน้ำ 1000 ลิตร
                    </li>
                    <li className="flex items-center gap-2 py-2 border-b border-gray-50 cursor-pointer active:bg-gray-50">
                       <Search size={14} className="text-gray-300" /> ปั๊มน้ำอัตโนมัติ
                    </li>
                 </ul>
              </div>
           </div>
        </div>
      )}

      {/* Top Bar - Accessibility: Hidden from screen readers if strictly decorative, but links are functional */}
      <div className="bg-[#0056b3] text-white text-xs py-1 px-4 hidden md:flex justify-between items-center" role="navigation" aria-label="Top bar navigation">
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
          
          {/* Logo & Mobile Menu Toggle */}
          <div className="flex items-center justify-between w-full md:w-auto">
             <div 
               className="flex items-center gap-2 cursor-pointer focus:ring-2 focus:ring-blue-500 rounded-lg p-1" 
               onClick={() => window.location.reload()}
               role="button"
               tabIndex={0}
               aria-label="Waree-TH Home"
               onKeyPress={(e) => e.key === 'Enter' && window.location.reload()}
             >
                <div className="text-[#0056b3] font-black text-3xl italic tracking-tighter">Waree-TH</div>
             </div>
             <button 
               className="md:hidden text-gray-600 p-2 hover:bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
               onClick={() => setIsMegaMenuOpen(true)}
               aria-label="Open menu"
               aria-expanded={isMegaMenuOpen}
               aria-controls="mobile-navigation-drawer"
             >
               <Menu />
             </button>
          </div>

          {/* Delivery Toggle (Desktop) */}
          <div className="hidden lg:flex items-center bg-gray-100 rounded-full p-1 text-sm font-medium border border-gray-200 shadow-inner" role="group" aria-label="Delivery options">
            <button 
              className="flex items-center gap-1 px-3 py-1 bg-orange-500 text-white rounded-full shadow-sm transition active:scale-95 focus:ring-2 focus:ring-orange-300 outline-none"
              aria-pressed="true"
            >
               <MapPin size={14} aria-hidden="true" /> <span>จัดส่ง</span>
            </button>
            <button 
              className="flex items-center gap-1 px-3 py-1 text-gray-500 hover:text-gray-700 transition focus:ring-2 focus:ring-gray-300 outline-none rounded-full"
              aria-pressed="false"
            >
               <Truck size={14} aria-hidden="true" /> <span>รับที่สาขา</span>
            </button>
          </div>

          {/* Search */}
          <div className="flex-1 w-full relative" role="search">
            <div className="flex">
              <select 
                className="hidden md:block bg-gray-100 text-gray-700 text-sm border-r border-gray-300 rounded-l-xl px-3 outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer"
                aria-label="Select search category"
              >
                <option>ทั้งหมด</option>
                <option>แทงค์น้ำ</option>
                <option>ปั๊มน้ำ</option>
              </select>
              <input 
                ref={searchInputRef}
                type="text" 
                placeholder="ค้นหา... แทงค์น้ำ, ปั๊มน้ำ, ถังบำบัด" 
                className="w-full bg-gray-100 text-gray-800 py-3 px-4 md:rounded-r-xl rounded-xl md:rounded-l-none focus:outline-none focus:ring-2 focus:ring-[#0056b3] transition shadow-inner" 
                aria-label="Search products"
                onFocus={handleSearchFocus}
              />
              <button 
                className="absolute right-0 top-0 h-full px-4 text-[#0056b3] hover:scale-110 transition focus:outline-none focus:text-blue-800"
                aria-label="Submit search"
              >
                <Search size={22} aria-hidden="true" />
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-6 text-[#0056b3]" role="toolbar" aria-label="User actions">
            <button className="flex flex-col items-center cursor-pointer hover:text-blue-800 transition group focus:outline-none focus:text-blue-800" aria-label="Notifications">
               <Bell size={24} className="group-hover:animate-swing" aria-hidden="true" />
               <span className="text-[10px] mt-1 font-bold">แจ้งเตือน</span>
            </button>
            <button className="flex flex-col items-center cursor-pointer hover:text-blue-800 transition relative group focus:outline-none focus:text-blue-800" aria-label={`Wishlist, ${wishlistCount} items`}>
               <Heart size={24} className="group-hover:scale-110 transition" aria-hidden="true" />
               {wishlistCount > 0 && (
                 <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-[9px] rounded-full w-4 h-4 flex items-center justify-center font-bold ring-2 ring-white" aria-hidden="true">
                   {wishlistCount}
                 </span>
               )}
               <span className="text-[10px] mt-1 font-bold">รายการโปรด</span>
            </button>
            <button className="flex flex-col items-center cursor-pointer hover:text-blue-800 transition relative group focus:outline-none focus:text-blue-800" aria-label="Shopping Cart, 3 items">
               <ShoppingCart size={24} className="group-hover:scale-110 transition" aria-hidden="true" />
               <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] rounded-full w-4 h-4 flex items-center justify-center font-bold ring-2 ring-white" aria-hidden="true">3</span>
               <span className="text-[10px] mt-1 font-bold">รถเข็น</span>
            </button>
            <button className="flex flex-col items-center cursor-pointer hover:text-blue-800 transition group focus:outline-none focus:text-blue-800" aria-label="User Account">
               <User size={24} className="group-hover:scale-110 transition" aria-hidden="true" />
               <span className="text-[10px] mt-1 font-bold">บัญชีฉัน</span>
            </button>
          </div>
        </div>
      </div>

      {/* Dynamic Navigation Bar */}
      <nav className="bg-[#0056b3] text-white hidden md:block" aria-label="Main navigation">
        <div className="container mx-auto px-4">
          <ul className="flex text-sm font-medium" role="menubar">
             <li className="relative">
                <button 
                  className={`px-4 py-3 hover:bg-blue-800 cursor-pointer flex items-center gap-2 transition-colors border-r border-blue-400 h-full w-full text-left focus:outline-none focus:bg-blue-800 ${isMegaMenuOpen ? 'bg-blue-800' : ''}`}
                  onClick={() => setIsMegaMenuOpen(true)}
                  aria-expanded={isMegaMenuOpen}
                  aria-haspopup="true"
                  role="menuitem"
                >
                  <Menu size={16} aria-hidden="true" /> เลือกหมวดสินค้า
                </button>
             </li>
             {NAV_LINKS.map((link) => (
               <li 
                 key={link.label} 
                 className="relative group h-full"
                 onMouseEnter={() => handleDropdownFocus(link.label)}
                 onMouseLeave={() => setActiveDropdown(null)}
                 onFocus={() => handleDropdownFocus(link.label)}
                 onBlur={handleDropdownBlur}
               >
                 <a 
                   href={link.href} 
                   className={`px-4 py-3 hover:bg-blue-800 cursor-pointer transition-colors flex items-center gap-1.5 h-full focus:bg-blue-800 focus:outline-none ${link.isPromo ? 'text-yellow-300 font-bold' : ''}`}
                   aria-haspopup={!!link.subLinks}
                   aria-expanded={activeDropdown === link.label}
                   role="menuitem"
                 >
                   {link.label}
                   {link.subLinks && <ChevronDown size={14} className="opacity-70 group-hover:rotate-180 transition-transform" aria-hidden="true" />}
                 </a>
                 
                 {link.subLinks && activeDropdown === link.label && (
                   <div className="absolute top-full left-0 w-64 bg-white shadow-2xl rounded-b-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 z-[60]">
                     <ul className="py-2" role="menu" aria-label={link.label}>
                       {link.subLinks.map((sub, i) => {
                         // Type guard/check
                         const label = typeof sub === 'string' ? sub : sub.label;
                         const slug = typeof sub === 'string' ? undefined : sub.slug;
                         
                         return (
                           <li key={i} role="none">
                              <button 
                                onClick={() => handlePageNavigation(slug)}
                                className="block w-full text-left px-4 py-2.5 text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors cursor-pointer text-sm font-medium border-l-2 border-transparent hover:border-blue-500 focus:bg-gray-50 focus:border-blue-500 outline-none" 
                                role="menuitem"
                              >
                                {label}
                              </button>
                           </li>
                         );
                       })}
                     </ul>
                   </div>
                 )}
               </li>
             ))}
          </ul>
        </div>
      </nav>

      {/* Mega Menu Component */}
      <MegaMenu 
        isOpen={isMegaMenuOpen} 
        onClose={() => setIsMegaMenuOpen(false)} 
      />
    </header>
  );
};
