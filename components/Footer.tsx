import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-gray-300 py-10 mt-12">
       <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
             <div>
                <h3 className="text-white font-bold mb-4">เกี่ยวกับ WAREE-TH</h3>
                <ul className="space-y-2 text-sm">
                   <li>เกี่ยวกับเรา</li>
                   <li>ติดต่อเรา</li>
                   <li>สมัครงาน</li>
                   <li>สาขา WAREE-TH</li>
                </ul>
             </div>
             <div>
                <h3 className="text-white font-bold mb-4">บริการลูกค้า</h3>
                <ul className="space-y-2 text-sm">
                   <li>ศูนย์ช่วยเหลือ</li>
                   <li>การสั่งซื้อสินค้า</li>
                   <li>การส่งสินค้า</li>
                   <li>การคืนสินค้า</li>
                   <li>การรับประกัน</li>
                </ul>
             </div>
             <div>
                <h3 className="text-white font-bold mb-4">ชำระเงิน & จัดส่ง</h3>
                 <div className="flex gap-2 mb-4">
                    <div className="w-10 h-6 bg-white rounded"></div>
                    <div className="w-10 h-6 bg-white rounded"></div>
                    <div className="w-10 h-6 bg-white rounded"></div>
                 </div>
                 <h3 className="text-white font-bold mb-4">ติดตามเรา</h3>
                 <div className="flex gap-4">
                    <span>FB</span>
                    <span>IG</span>
                    <span>LN</span>
                    <span>YT</span>
                 </div>
             </div>
             <div>
                <h3 className="text-white font-bold mb-4">ดาวน์โหลดแอปพลิเคชัน</h3>
                <div className="flex flex-col gap-2">
                   <button className="bg-gray-700 px-4 py-2 rounded text-left">
                      App Store
                   </button>
                   <button className="bg-gray-700 px-4 py-2 rounded text-left">
                      Google Play
                   </button>
                </div>
             </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-6 text-center text-xs">
             <p>&copy; {new Date().getFullYear()} WAREE-TH. All rights reserved.</p>
          </div>
       </div>
    </footer>
  );
};