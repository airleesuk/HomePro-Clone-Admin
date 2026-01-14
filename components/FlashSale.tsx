import React from 'react';
import { Product } from '../types';
import { ShoppingCart } from 'lucide-react';

interface FlashSaleProps {
  products: Product[];
}

export const FlashSale: React.FC<FlashSaleProps> = ({ products }) => {
  return (
    <div className="bg-gradient-to-r from-orange-500 to-red-600 py-6 mt-6">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 text-white">
           <div className="flex items-center gap-4">
              <h2 className="text-3xl font-bold italic">F⚡ASH SALE</h2>
              <div className="flex gap-2 items-center text-black">
                 <span className="bg-white px-2 py-1 rounded font-bold">00</span> :
                 <span className="bg-white px-2 py-1 rounded font-bold">45</span> :
                 <span className="bg-white px-2 py-1 rounded font-bold">12</span>
              </div>
           </div>
           <button className="text-sm underline mt-2 md:mt-0 hover:text-yellow-200">ดูทั้งหมด &gt;&gt;</button>
        </div>

        {/* Product Carousel (Simulated with scroll) */}
        <div className="flex overflow-x-auto gap-4 pb-4 no-scrollbar snap-x">
          {products.filter(p => p.isFlashSale).map((product) => (
             <div key={product.id} className="min-w-[160px] md:min-w-[200px] bg-white rounded-lg p-3 snap-start cursor-pointer hover:shadow-xl transition-shadow flex flex-col justify-between">
                <div className="relative">
                   <div className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-bl-lg rounded-tr-lg">
                     -{product.discount}%
                   </div>
                   <img src={product.image} alt={product.name} className="w-full h-40 object-contain mb-2 hover:scale-105 transition-transform" />
                </div>
                
                <div>
                  <h3 className="text-sm text-gray-700 font-medium line-clamp-2 mb-1 h-10">{product.name}</h3>
                  <div className="flex items-end gap-2 mb-2">
                     <span className="text-red-600 font-bold text-lg">฿{product.price.toLocaleString()}</span>
                     {product.originalPrice && (
                       <span className="text-gray-400 text-xs line-through mb-1">฿{product.originalPrice.toLocaleString()}</span>
                     )}
                  </div>
                  
                  {/* Stock Bar */}
                  <div className="relative w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                     <div 
                       className="absolute top-0 left-0 h-full bg-red-500" 
                       style={{ width: `${(product.sold / (product.stock + product.sold)) * 100}%` }}
                     />
                     <div className="absolute inset-0 flex items-center justify-center text-[8px] text-white font-bold drop-shadow-md">
                        ขายแล้ว {product.sold} ชิ้น
                     </div>
                  </div>
                </div>
             </div>
          ))}
        </div>
      </div>
    </div>
  );
};