
import React from 'react';

export const Hero: React.FC = () => {
  return (
    <div className="bg-blue-50 py-4">
      <div className="container mx-auto px-2 md:px-4">
        <div className="grid grid-cols-12 gap-4">
          
          {/* Main Banner Slider */}
          <div className="col-span-12 lg:col-span-8 relative rounded-lg overflow-hidden shadow-md group h-48 md:h-80 lg:h-96">
            <img 
              src="https://waree-th.shop/resources/image/1b/95/0.png" 
              alt="Main Promo" 
              className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent flex items-center p-8 md:p-12">
               <div className="text-white">
                  <h2 className="text-2xl md:text-5xl font-bold mb-4">BRAND DAY</h2>
                  <p className="text-xl mb-6">ลดสูงสุด 80% + โค้ดลดเพิ่ม 15%</p>
                  <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-md font-bold transition">ช้อปเลย</button>
               </div>
            </div>
            {/* Arrows */}
            <div className="absolute top-1/2 left-2 -translate-y-1/2 bg-white/30 p-2 rounded-full cursor-pointer hover:bg-white/50 hidden group-hover:block">
               ◀
            </div>
             <div className="absolute top-1/2 right-2 -translate-y-1/2 bg-white/30 p-2 rounded-full cursor-pointer hover:bg-white/50 hidden group-hover:block">
               ▶
            </div>
          </div>

          {/* Right Side Promos */}
          <div className="col-span-12 lg:col-span-4 flex flex-col gap-4">
            <div className="h-28 md:h-32 lg:h-46 bg-blue-100 rounded-lg overflow-hidden relative shadow-sm">
                <img src="https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=600&q=80" className="w-full h-full object-cover"/>
                <div className="absolute inset-0 p-4 flex flex-col justify-center bg-white/60">
                    <span className="text-[#0056b3] font-bold text-lg">ผ่อน 0% ทั้งเว็บ</span>
                    <span className="text-sm text-gray-700">นานสูงสุด 12 เดือน</span>
                </div>
            </div>
            <div className="h-28 md:h-32 lg:h-46 bg-orange-100 rounded-lg overflow-hidden relative shadow-sm">
                <img src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=600&q=80" className="w-full h-full object-cover"/>
                 <div className="absolute inset-0 p-4 flex flex-col justify-center bg-white/60">
                    <span className="text-orange-600 font-bold text-xl">ลดเพิ่มสูงสุด</span>
                    <span className="text-3xl font-bold text-orange-600">500.-</span>
                </div>
            </div>
          </div>

        </div>

        {/* Delivery Options Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-4">
           {['ส่งทันที (Same Day)', 'ส่งภายในวัน', 'ส่งปกติ', 'รับที่สาขา'].map((text, idx) => (
             <div key={idx} className="bg-blue-600 text-white rounded flex items-center justify-center py-3 px-2 text-sm md:text-base shadow cursor-pointer hover:bg-blue-700 transition">
                <span className="mr-2">🚛</span> {text}
             </div>
           ))}
        </div>

        {/* Service Icons */}
        <div className="flex flex-wrap justify-between items-start mt-8 bg-white p-4 rounded-lg shadow-sm">
           {[
             {name: 'จัดส่ง', icon: '🚚'},
             {name: 'ติดตั้งฟรี', icon: '🔧'},
             {name: 'HomePro Mall', icon: '🏬'},
             {name: 'โฮมการ์ด', icon: '💳'},
             {name: 'สินค้าแลกเก่า', icon: '♻️'},
             {name: 'ลดล้างสต็อก', icon: '🏷️'},
             {name: 'คูปองส่วนลด', icon: '🎫'},
             {name: 'รวมโปรเด็ด', icon: '🔥'},
           ].map((item, idx) => (
             <div key={idx} className="flex flex-col items-center gap-2 w-1/4 md:w-auto p-2 cursor-pointer hover:bg-gray-50 rounded">
                <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center text-2xl md:text-3xl">
                  {item.icon}
                </div>
                <span className="text-xs md:text-sm text-gray-600 text-center">{item.name}</span>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
};
