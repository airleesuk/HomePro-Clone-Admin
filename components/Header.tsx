import React, { useState } from 'react';
import { Search, ShoppingCart, User, Heart, Bell, Menu, MapPin, Truck, X, ChevronRight, Phone, FileText, LogIn } from 'lucide-react';
import { CATEGORIES } from '../services/mockDb';

export const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      {/* Top Bar */}
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
      <div className="container mx-auto px-2 md:px-4 py-3">
        <div className="flex flex-col md:flex-row items-center gap-4">
          
          {/* Logo & Mobile Menu Trigger */}
          <div className="flex items-center justify-between w-full md:w-auto">
             <div className="flex items-center gap-2">
                <div className="text-[#0056b3] font-bold text-6xl md:text-8xl italic tracking-tighter leading-none">WAREE-TH</div>
             </div>
             <button 
                className="md:hidden text-gray-600 p-2 -mr-2 hover:bg-gray-100 rounded-full transition-colors"
                onClick={() => setIsMenuOpen(true)}
             >
               <Menu size={28} />
             </button>
          </div>

          {/* Delivery Toggle (Desktop) */}
          <div className="hidden lg:flex items-center bg-gray-100 rounded-full p-1 text-sm font-medium">
            <button className="flex items-center gap-1 px-3 py-1 bg-orange-500 text-white rounded-full shadow-sm">
               <MapPin size={14} /> <span>จัดส่ง</span>
            </button>
            <button className="flex items-center gap-1 px-3 py-1 text-gray-500 hover:text-gray-700">
               <Truck size={14} /> <span>รับที่สาขา</span>
            </button>
          </div>

          {/* Search */}
          <div className="flex-1 w-full relative">
            <div className="flex">
              <select className="hidden md:block bg-gray-100 text-gray-700 text-sm border-r border-gray-300 rounded-l-md px-3 outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer">
                <option>ทั้งหมด</option>
                <option>เครื่องใช้ไฟฟ้า</option>
                <option>เฟอร์นิเจอร์</option>
              </select>
              <input 
                type="text" 
                placeholder="ค้นหา... ตู้เย็น, เครื่องซักผ้า" 
                className="w-full bg-gray-100 text-gray-800 py-2 px-4 md:rounded-r-md rounded-md md:rounded-l-none focus:outline-none focus:ring-2 focus:ring-[#0056b3]" 
              />
              <button className="absolute right-0 top-0 h-full px-4 text-[#0056b3]">
                <Search size={20} />
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-6 text-[#0056b3]">
            <div className="flex flex-col items-center cursor-pointer hover:text-blue-700">
               <Bell size={24} />
               <span className="text-[10px] mt-1">แจ้งเตือน</span>
            </div>
            <div className="flex flex-col items-center cursor-pointer hover:text-blue-700">
               <Heart size={24} />
               <span className="text-[10px] mt-1">รายการโปรด</span>
            </div>
            <div className="flex flex-col items-center cursor-pointer hover:text-blue-700 relative">
               <ShoppingCart size={24} />
               <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">3</span>
               <span className="text-[10px] mt-1">รถเข็น</span>
            </div>
            <div className="flex flex-col items-center cursor-pointer hover:text-blue-700">
               <User size={24} />
               <span className="text-[10px] mt-1">บัญชีฉัน</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Bar */}
      <div className="bg-[#0056b3] text-white hidden md:block">
        <div className="container mx-auto px-4">
          <ul className="flex text-sm font-medium">
             <li className="px-4 py-3 hover:bg-blue-800 cursor-pointer flex items-center gap-2">
               <Menu size={16} /> เลือกหมวดสินค้า
             </li>
             <li className="px-4 py-3 hover:bg-blue-800 cursor-pointer">ห้องและเครื่องนอน</li>
             <li className="px-4 py-3 hover:bg-blue-800 cursor-pointer">ห้องน้ำ</li>
             <li className="px-4 py-3 hover:bg-blue-800 cursor-pointer">ห้องครัว</li>
             <li className="px-4 py-3 hover:bg-blue-800 cursor-pointer">เครื่องใช้ไฟฟ้า</li>
             <li className="px-4 py-3 hover:bg-blue-800 cursor-pointer">วัสดุก่อสร้าง</li>
             <li className="px-4 py-3 hover:bg-blue-800 cursor-pointer text-yellow-300">โปรโมชั่น</li>
             <li className="px-4 py-3 hover:bg-blue-800 cursor-pointer">บริการเรื่องบ้าน</li>
          </ul>
        </div>
      </div>

      {/* MOBILE FULL SCREEN MENU OVERLAY */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-[60] bg-white flex flex-col md:hidden animate-[slideIn_0.3s_ease-out]">
            <style>{`
                @keyframes slideIn {
                    from { transform: translateX(-100%); }
                    to { transform: translateX(0); }
                }
            `}</style>
            
            {/* Menu Header */}
            <div className="flex items-center justify-between p-4 border-b shadow-sm sticky top-0 bg-white z-10">
                <div className="text-[#0056b3] font-bold text-5xl italic tracking-tighter">WAREE-TH</div>
                <button 
                    onClick={() => setIsMenuOpen(false)}
                    className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 text-gray-500 transition-colors"
                >
                    <X size={24} />
                </button>
            </div>

            {/* Menu Content */}
            <div className="flex-1 overflow-y-auto bg-gray-50">
                {/* User Profile Card */}
                <div className="bg-white p-6 mb-2">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                            <User size={32} />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg text-gray-800">ยินดีต้อนรับ</h3>
                            <p className="text-gray-500 text-sm">กรุณาเข้าสู่ระบบ เพื่อสิทธิประโยชน์</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <button className="flex items-center justify-center gap-2 bg-[#0056b3] text-white py-2.5 rounded-lg font-medium shadow-blue-200 shadow-lg hover:bg-blue-700 transition">
                            <LogIn size={18} /> เข้าสู่ระบบ
                        </button>
                        <button className="flex items-center justify-center gap-2 border border-[#0056b3] text-[#0056b3] py-2.5 rounded-lg font-medium hover:bg-blue-50 transition">
                            สมัครสมาชิก
                        </button>
                    </div>
                </div>

                {/* Main Links */}
                <div className="bg-white mb-2 py-2">
                    <a href="#" className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 border-b border-gray-50">
                        <div className="w-8 flex justify-center text-blue-600"><FileText /></div>
                        <span className="font-medium text-gray-700">โปรโมชั่นประจำเดือน</span>
                        <ChevronRight className="ml-auto text-gray-300" size={20} />
                    </a>
                    <a href="#" className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 border-b border-gray-50">
                        <div className="w-8 flex justify-center text-orange-500"><Truck /></div>
                        <span className="font-medium text-gray-700">ติดตามสถานะคำสั่งซื้อ</span>
                        <ChevronRight className="ml-auto text-gray-300" size={20} />
                    </a>
                    <a href="#" className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50">
                        <div className="w-8 flex justify-center text-green-600"><MapPin /></div>
                        <span className="font-medium text-gray-700">ค้นหาสาขาใกล้บ้าน</span>
                        <ChevronRight className="ml-auto text-gray-300" size={20} />
                    </a>
                </div>

                {/* Categories */}
                <div className="bg-white py-4">
                    <h4 className="px-6 mb-4 text-sm font-bold text-gray-400 uppercase tracking-wider">หมวดหมู่สินค้า</h4>
                    <div className="grid grid-cols-1">
                        {CATEGORIES.map((cat) => (
                            <div key={cat.id} className="flex items-center gap-4 px-6 py-3 hover:bg-gray-50 cursor-pointer active:bg-blue-50 transition-colors">
                                <img src={cat.icon} alt={cat.name} className="w-10 h-10 rounded-lg object-cover bg-gray-100" />
                                <span className="text-gray-700 font-medium">{cat.name}</span>
                            </div>
                        ))}
                         <div className="flex items-center gap-4 px-6 py-3 hover:bg-gray-50 cursor-pointer text-[#0056b3]">
                                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                                    <ChevronRight size={20} />
                                </div>
                                <span className="font-medium">ดูหมวดหมู่ทั้งหมด</span>
                            </div>
                    </div>
                </div>

                {/* Support */}
                <div className="p-6 text-center text-gray-500 text-sm pb-10">
                    <p className="flex items-center justify-center gap-2 mb-2 font-medium">
                        <Phone size={16} /> Call Center 098 268 7064
                    </p>
                    <p>เปิดบริการทุกวัน 24 ชั่วโมง</p>
                </div>
            </div>
        </div>
      )}
    </header>
  );
};