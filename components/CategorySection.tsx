import React from 'react';
import { CATEGORIES } from '../services/mockDb';

export const CategorySection: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
       {/* Trending Section */}
       <div className="mb-10">
          <h2 className="text-xl md:text-2xl font-bold text-[#0056b3] mb-4">เทรนด์สินค้ายอดฮิต</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
             {/* Large Item */}
             <div className="lg:col-span-1 h-64 rounded-xl overflow-hidden relative group cursor-pointer">
                <img src="https://images.unsplash.com/photo-1517991104123-1d56a6e81ed9?w=600&q=80" className="w-full h-full object-cover transition duration-500 group-hover:scale-110"/>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex flex-col justify-end p-6">
                   <h3 className="text-white text-xl font-bold">เตรียมพร้อมรับมือฝุ่น PM 2.5</h3>
                   <button className="bg-white text-blue-600 text-sm py-1 px-3 rounded mt-2 w-fit">ช้อปเลย</button>
                </div>
             </div>
             
             {/* 4 Small Items */}
             <div className="lg:col-span-2 grid grid-cols-2 gap-4">
                {[
                  { title: "ซักและอบผ้าสะอาด", img: "https://images.unsplash.com/photo-1626806819282-2c1dc01a5e0c?w=400" },
                  { title: "ไอเทมป้องกันฝุ่น", img: "https://images.unsplash.com/photo-1585776245991-cf79dd6903bf?w=400" },
                  { title: "น้ำดื่มสะอาด ปลอดภัย", img: "https://images.unsplash.com/photo-1521977637891-139998077460?w=400" },
                  { title: "ออกกำลังกายในบ้าน", img: "https://images.unsplash.com/photo-1593079831268-3381b0db4a77?w=400" }
                ].map((item, idx) => (
                  <div key={idx} className="h-30 md:h-32 bg-gray-100 rounded-lg overflow-hidden relative group cursor-pointer">
                     <img src={item.img} className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition" />
                     <div className="absolute top-2 left-2 bg-white/80 backdrop-blur-sm px-2 py-1 rounded text-xs md:text-sm font-bold text-[#0056b3]">
                        {item.title}
                     </div>
                  </div>
                ))}
             </div>
          </div>
       </div>

       {/* Categories Grid */}
       <div>
          <h2 className="text-xl md:text-2xl font-bold text-[#0056b3] mb-4">หมวดหมู่สินค้า</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
             {CATEGORIES.map(cat => (
               <div key={cat.id} className="bg-white border rounded-lg p-4 flex flex-col items-center justify-center gap-3 hover:shadow-lg transition cursor-pointer group h-32">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-50 group-hover:scale-110 transition">
                     <img src={cat.icon} alt={cat.name} className="w-full h-full object-cover"/>
                  </div>
                  <span className="text-xs md:text-sm text-center font-medium text-gray-700 group-hover:text-[#0056b3]">{cat.name}</span>
               </div>
             ))}
          </div>
       </div>
    </div>
  );
};