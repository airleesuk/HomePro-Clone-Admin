
import React, { useState } from 'react';
import { Search, ShoppingCart, User, Heart, Bell, Menu, MapPin, Truck, X, ChevronRight, Phone, FileText, LogIn } from 'lucide-react';
import { CATEGORIES } from '../services/mockDb';

interface HeaderProps {
  onHomeClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onHomeClick }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      {/* Top Bar (Desktop Only) */}
      <div className="bg-[#0056b3] text-white text-xs py-1 px-4 hidden md:flex justify-between items-center">
        <div className="flex space-x-4">
           <span>Professional Service</span>
           <span>Call Center 098 268 7064</span>
        </div>
        <div className="flex space-x-4">
           <span>Download App</span>
           <span>The 1 Card</span>
           <span>Corporate Sales</span>
        </div>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4 py-3">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-6">
          
          {/* Row 1: Logo & Mobile Actions */}
          <div className="flex items-center justify-between w-full md:w-auto">
             <div className="flex items-center gap-2 cursor-pointer" onClick={onHomeClick}>
                <div className="text-[#0056b3] font-bold text-5xl md:text-8xl italic tracking-tighter leading-none">WAREE-TH</div>
             </div>
             
             {/* Mobile Actions (Cart & Menu) */}
             <div className="flex items-center gap-4 md:hidden text-[#0056b3]">
                <div className="relative">
                   <ShoppingCart size={24} />
                   <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center border border-white">3</span>
                </div>
                <button 
                  className="text-gray-600 p-1 hover:bg-gray-100 rounded-full transition-colors"
                  onClick={() => setIsMenuOpen(true)}
                >
                  <Menu size={28} />
                </button>
             </div>
          </div>

          {/* Delivery Toggle (Desktop Only) */}
          <div className="hidden lg:flex items-center bg-gray-100 rounded-full p-1 text-sm font-medium shrink-0">
            <button className="flex items-center gap-1 px-3 py-1 bg-orange-500 text-white rounded-full shadow-sm">
               <MapPin size={14} /> <span>จัดส่ง</span>
            </button>
            <button className="flex items-center gap-1 px-3 py-1 text-gray-500 hover:text-gray-700">
               <Truck size={14} /> <span>รับที่สาขา</span>
            </button>
          </div>

          {/* Search Bar (Full Width on Mobile) */}
          <div className="flex-1 w-full relative">
            <div className="flex shadow-sm md:shadow-none">
              <select className="hidden md:block bg-gray-100 text-gray-700 text-sm border-r border-gray-300 rounded-l-md px-3 outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer">
                <option>ทั้งหมด</option>
                <option>เครื่องใช้ไฟฟ้า</option>
                <option>เฟอร์นิเจอร์</option>
              </select>
              <input 
                type="text" 
                placeholder="ค้นหา... ตู้เย็น, เครื่องซักผ้า" 
                className="w-full bg-gray-100 text-gray-800 py-2.5 px-4 rounded-lg md:rounded-r-md md:rounded-l-none focus:outline-none focus:ring-2 focus:ring-[#0056b3] text-sm" 
              />
              <button className="absolute right-0 top-0 h-full px-4 text-[#0056b3]">
                <Search size={20} />
              </button>
            </div>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-6 text-[#0056b3] shrink-0">
            <div className="flex flex-col items-center cursor-pointer hover:text-blue-700 group">
               <Bell size={24} className="group-hover:scale-110 transition-transform" />
               <span className="text-[10px] mt-1">แจ้งเตือน</span>
            </div>
            <div className="flex flex-col items-center cursor-pointer hover:text-blue-700 group">
               <Heart size={24} className="group-hover:scale-110 transition-transform" />
               <span className="text-[10px] mt-1">รายการโปรด</span>
            </div>
            <div className="flex flex-col items-center cursor-pointer hover:text-blue-700 relative group">
               <ShoppingCart size={24} className="group-hover:scale-110 transition-transform" />
               <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center shadow-sm">3</span>
               <span className="text-[10px] mt-1">รถเข็น</span>
            </div>
            <div className="flex flex-col items-center cursor-pointer hover:text-blue-700 group">
               <User size={24} className="group-hover:scale-110 transition-transform" />
               <span className="text-[10px] mt-1">บัญชีฉัน</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Bar (Desktop Only) */}
      <div className="bg-[#0056b3] text-white hidden md:block shadow-md">
        <div className="container mx-auto px-4">
          <ul className="flex text-sm font-medium overflow-x-auto no-scrollbar">
             <li className="px-4 py-3 hover:bg-blue-800 cursor-pointer flex items-center gap-2 whitespace-nowrap font-bold">
               <Menu size={16} /> เลือกหมวดสินค้า
             </li>
             {['ห้องและเครื่องนอน', 'ห้องน้ำ', 'ห้องครัว', 'เครื่องใช้ไฟฟ้า', 'วัสดุก่อสร้าง', 'บริการเรื่องบ้าน'].map((item) => (
                <li key={item} className="px-4 py-3 hover:bg-blue-800 cursor-pointer whitespace-nowrap">{item}</li>
             ))}
             <li className="px-4 py-3 hover:bg-blue-800 cursor-pointer text-yellow-300 font-bold whitespace-nowrap">โปรโมชั่น</li>
          </ul>
        </div>
      </div>

      {/* MOBILE FULL SCREEN MENU OVERLAY */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-[60] bg-black/50 md:hidden animate-[fadeIn_0.2s_ease-out]">
            <div className="absolute top-0 left-0 w-[85%] h-full bg-white flex flex-col animate-[slideIn_0.3s_ease-out] shadow-2xl">
                <style>{`
                    @keyframes slideIn {
                        from { transform: translateX(-100%); }
                        to { transform: translateX(0); }
                    }
                    @keyframes fadeIn {
                        from { opacity: 0; }
                        to { opacity: 1; }
                    }
                `}</style>
                
                {/* Menu Header */}
                <div className="flex items-center justify-between p-4 border-b bg-white">
                    <div className="text-[#0056b3] font-bold text-4xl italic tracking-tighter">WAREE-TH</div>
                    <button 
                        onClick={() => setIsMenuOpen(false)}
                        className="p-2 bg-gray-50 rounded-full hover:bg-gray-200 text-gray-500 transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Menu Content */}
                <div className="flex-1 overflow-y-auto bg-gray-50 pb-20">
                    {/* User Profile Card */}
                    <div className="bg-white p-6 mb-2 shadow-sm">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 border border-blue-200">
                                <User size={28} />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg text-gray-800">ยินดีต้อนรับ</h3>
                                <p className="text-gray-500 text-xs">เข้าสู่ระบบเพื่อรับสิทธิพิเศษ</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <button className="flex items-center justify-center gap-2 bg-[#0056b3] text-white py-2.5 rounded-lg font-medium shadow-lg shadow-blue-500/20 active:scale-95 transition text-sm">
                                <LogIn size={16} /> เข้าสู่ระบบ
                            </button>
                            <button className="flex items-center justify-center gap-2 border border-[#0056b3] text-[#0056b3] py-2.5 rounded-lg font-medium hover:bg-blue-50 active:scale-95 transition text-sm">
                                สมัครสมาชิก
                            </button>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="bg-white mb-2 py-2 shadow-sm">
                        <a href="#" className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 border-b border-gray-50 active:bg-gray-100">
                            <div className="w-8 flex justify-center text-blue-600"><FileText size={20} /></div>
                            <span className="font-medium text-gray-700 text-sm">โปรโมชั่นประจำเดือน</span>
                            <ChevronRight className="ml-auto text-gray-300" size={18} />
                        </a>
                        <a href="#" className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 border-b border-gray-50 active:bg-gray-100">
                            <div className="w-8 flex justify-center text-orange-500"><Truck size={20} /></div>
                            <span className="font-medium text-gray-700 text-sm">ติดตามสถานะคำสั่งซื้อ</span>
                            <ChevronRight className="ml-auto text-gray-300" size={18} />
                        </a>
                        <a href="#" className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 active:bg-gray-100">
                            <div className="w-8 flex justify-center text-green-600"><MapPin size={20} /></div>
                            <span className="font-medium text-gray-700 text-sm">ค้นหาสาขาใกล้บ้าน</span>
                            <ChevronRight className="ml-auto text-gray-300" size={18} />
                        </a>
                    </div>

                    {/* Categories */}
                    <div className="bg-white py-4 shadow-sm">
                        <h4 className="px-6 mb-3 text-xs font-black text-gray-400 uppercase tracking-widest">หมวดหมู่สินค้า</h4>
                        <div className="flex flex-col">
                            {CATEGORIES.map((cat) => (
                                <div key={cat.id} className="flex items-center gap-4 px-6 py-3 hover:bg-gray-50 cursor-pointer active:bg-blue-50 transition-colors">
                                    <div className="w-10 h-10 rounded-lg bg-gray-100 p-1">
                                        <img src={cat.icon} alt={cat.name} className="w-full h-full object-cover rounded-md" />
                                    </div>
                                    <span className="text-gray-700 font-medium text-sm">{cat.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
      )}
    </header>
  );
};
