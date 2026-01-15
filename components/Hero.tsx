
import React from 'react';

export const Hero: React.FC = () => {
  return (
    <div className="bg-white py-4">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-12 gap-4">
          
          {/* Main Banner Slider */}
          <div className="col-span-12 lg:col-span-9 relative rounded-2xl overflow-hidden shadow-sm group h-[350px] md:h-96 border border-blue-50 bg-gray-100">
            <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/50 to-transparent z-10 md:from-white md:via-white/40"></div>
            <img 
              src="https://images.unsplash.com/photo-1581244277943-fe4a9c777189?auto=format&fit=crop&w=1400&q=80" 
              alt="WAREE-TH Products" 
              className="w-full h-full object-cover absolute inset-0 mix-blend-multiply md:mix-blend-normal"
            />
            <div className="absolute inset-0 flex flex-col justify-center p-6 md:p-16 z-20 max-w-2xl">
               <div className="text-[#0056b3]">
                  <h1 className="text-4xl md:text-6xl font-black mb-2 md:mb-4 tracking-tighter italic drop-shadow-sm">WAREE-TH</h1>
                  <h2 className="text-lg md:text-2xl font-bold mb-3 md:mb-6 text-gray-800 leading-tight md:max-w-xl">
                    จำหน่ายแทงค์น้ำ, ถังบำบัดน้ำเสีย, ตู้กดน้ำเย็นสแตนเลส และเครื่องใช้ไฟฟ้า
                  </h2>
                  <p className="text-gray-600 mb-6 font-medium text-sm md:text-base md:max-w-lg line-clamp-2 md:line-clamp-none">
                    ศูนย์รวมอุปกรณ์ระบบน้ำครบวงจร และสินค้าเครื่องใช้ไฟฟ้าคุณภาพสูง ราคาโรงงาน
                  </p>
                  <div className="flex gap-3">
                    <button className="bg-[#0056b3] hover:bg-blue-700 text-white px-6 md:px-10 py-3 md:py-4 rounded-xl font-bold transition shadow-lg shadow-blue-200 text-sm md:text-base">
                      ดูสินค้าทั้งหมด
                    </button>
                    <button className="bg-white border-2 border-gray-100 hover:border-blue-200 text-gray-600 px-6 md:px-10 py-3 md:py-4 rounded-xl font-bold transition text-sm md:text-base">
                      ติดต่อเรา
                    </button>
                  </div>
               </div>
            </div>
            {/* Scroll Indicator */}
            <div className="absolute bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 z-30 flex gap-2">
               <div className="w-6 md:w-8 h-1.5 md:h-2 bg-blue-600 rounded-full"></div>
               <div className="w-1.5 md:w-2 h-1.5 md:h-2 bg-gray-300 rounded-full"></div>
               <div className="w-1.5 md:w-2 h-1.5 md:h-2 bg-gray-300 rounded-full"></div>
            </div>
          </div>

          {/* Right Side Promos */}
          <div className="col-span-12 lg:col-span-3 flex flex-row lg:flex-col gap-4 overflow-x-auto lg:overflow-visible no-scrollbar pb-2 lg:pb-0">
            <div className="flex-1 min-w-[280px] lg:min-w-0 bg-blue-600 rounded-2xl overflow-hidden relative shadow-md p-6 flex flex-col justify-between group cursor-pointer h-40 lg:h-auto">
                <div className="relative z-10 text-white">
                    <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Professional</span>
                    <h3 className="text-xl md:text-2xl font-black mt-1 md:mt-2">ตู้กดน้ำเย็น<br/>สแตนเลส</h3>
                </div>
                <div className="relative z-10 text-white font-black text-right">
                  <span className="text-[10px] md:text-xs opacity-80">เริ่มต้นเพียง</span>
                  <div className="text-2xl md:text-3xl">฿7,xxx</div>
                </div>
                <div className="absolute bottom-[-20px] right-[-20px] w-32 h-32 md:w-40 md:h-40 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition duration-700"></div>
            </div>
            <div className="flex-1 min-w-[280px] lg:min-w-0 bg-gray-100 rounded-2xl overflow-hidden relative shadow-sm p-6 flex flex-col justify-between group cursor-pointer border border-gray-200 h-40 lg:h-auto">
                 <div className="relative z-10 text-gray-800">
                    <span className="text-[10px] font-black uppercase tracking-widest text-blue-600">Flash Sales</span>
                    <h3 className="text-xl md:text-2xl font-black mt-1 md:mt-2">โปรแทงค์น้ำ<br/>ลดกระหน่ำ</h3>
                </div>
                <div className="relative z-10 text-[#0056b3] font-black text-right">
                  <div className="text-2xl md:text-3xl">ลด 30%</div>
                  <span className="text-[10px] md:text-xs text-gray-400">เมื่อสั่งซื้อวันนี้</span>
                </div>
            </div>
          </div>

        </div>

        {/* Delivery Options Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mt-6">
           {[
             { title: 'ส่งด่วนถึงที่', sub: 'ภายในวัน (กทม.)', icon: '⚡' },
             { title: 'ติดตั้งโดยช่าง', sub: 'มืออาชีพผู้เชี่ยวชาญ', icon: '🔧' },
             { title: 'สินค้าแท้ 100%', sub: 'รับประกันคุณภาพ', icon: '✔️' },
             { title: 'ยินดีให้คำปรึกษา', sub: 'เรื่องระบบน้ำฟรี', icon: '💬' }
           ].map((item, idx) => (
             <div key={idx} className="bg-white border border-gray-100 text-gray-700 rounded-xl flex items-center p-3 md:p-4 shadow-sm hover:border-blue-200 transition cursor-pointer">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-50 rounded-xl flex items-center justify-center text-xl md:text-2xl mr-3 md:mr-4 shrink-0">
                  {item.icon}
                </div>
                <div className="min-w-0">
                   <div className="font-bold text-xs md:text-sm truncate">{item.title}</div>
                   <div className="text-[10px] text-gray-400 font-medium truncate">{item.sub}</div>
                </div>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
};
