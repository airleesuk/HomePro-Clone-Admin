
import React from 'react';
import { CATEGORIES } from '../services/mockDb';

export const CategorySection: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
       {/* Trending Section */}
       <div className="mb-12">
          <h2 className="text-xl md:text-2xl font-bold text-[#0056b3] mb-4 flex items-center gap-2">
            <span className="w-1 h-6 bg-[#0056b3] rounded-full block"></span> 
            เทรนด์สินค้ายอดฮิต
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
             {/* Large Item */}
             <div className="lg:col-span-1 h-60 md:h-64 rounded-2xl overflow-hidden relative group cursor-pointer shadow-sm">
                <img src="https://images.unsplash.com/photo-1517991104123-1d56a6e81ed9?w=600&q=80" className="w-full h-full object-cover transition duration-700 group-hover:scale-110"/>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent flex flex-col justify-end p-6">
                   <h3 className="text-white text-xl md:text-2xl font-bold leading-tight">เตรียมพร้อม<br/>รับมือฝุ่น PM 2.5</h3>
                   <button className="bg-white text-blue-600 text-xs md:text-sm font-bold py-2 px-4 rounded-lg mt-3 w-fit hover:bg-blue-50 transition">ช้อปเลย</button>
                </div>
             </div>
             
             {/* 4 Small Items */}
             <div className="lg:col-span-2 grid grid-cols-2 gap-3 md:gap-4">
                {[
                  { title: "ซักและอบผ้าสะอาด", img: "https://images.unsplash.com/photo-1626806819282-2c1dc01a5e0c?w=400" },
                  { title: "ไอเทมป้องกันฝุ่น", img: "https://images.unsplash.com/photo-1585776245991-cf79dd6903bf?w=400" },
                  { title: "น้ำดื่มสะอาด ปลอดภัย", img: "https://images.unsplash.com/photo-1521977637891-139998077460?w=400" },
                  { title: "ออกกำลังกายในบ้าน", img: "https://images.unsplash.com/photo-1593079831268-3381b0db4a77?w=400" }
                ].map((item, idx) => (
                  <div key={idx} className="h-28 md:h-32 bg-gray-100 rounded-xl overflow-hidden relative group cursor-pointer shadow-sm">
                     <img src={item.img} className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition duration-500 group-hover:scale-105" />
                     <div className="absolute top-2 left-2 right-2">
                       <span className="bg-white/90 backdrop-blur-md px-2 py-1 rounded-md text-[10px] md:text-xs font-bold text-[#0056b3] shadow-sm inline-block">
                          {item.title}
                       </span>
                     </div>
                  </div>
                ))}
             </div>
          </div>
       </div>

       {/* Categories Grid */}
       <div>
          <h2 className="text-xl md:text-2xl font-bold text-[#0056b3] mb-4 flex items-center gap-2">
            <span className="w-1 h-6 bg-[#0056b3] rounded-full block"></span> 
            หมวดหมู่สินค้า
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3 md:gap-4">
             {CATEGORIES.map(cat => (
               <div key={cat.id} className="bg-white border border-gray-100 rounded-xl p-4 flex flex-col items-center justify-center gap-3 hover:shadow-lg hover:border-blue-100 transition cursor-pointer group h-32 md:h-36 active:scale-95">
                  <div className="w-12 h-12 md:w-14 md:h-14 rounded-full overflow-hidden bg-gray-50 group-hover:scale-110 transition duration-300 border border-gray-100 group-hover:border-blue-200">
                     <img src={cat.icon} alt={cat.name} className="w-full h-full object-cover"/>
                  </div>
                  <span className="text-xs md:text-sm text-center font-medium text-gray-700 group-hover:text-[#0056b3] leading-tight px-1">{cat.name}</span>
               </div>
             ))}
          </div>
       </div>
    </div>
  );
};
