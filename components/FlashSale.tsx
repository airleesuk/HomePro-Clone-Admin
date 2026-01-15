
import React from 'react';
import { Product } from '../types';
import { ShoppingCart, Zap } from 'lucide-react';

interface FlashSaleProps {
  products: Product[];
  onProductClick?: (id: number) => void;
}

export const FlashSale: React.FC<FlashSaleProps> = ({ products, onProductClick }) => {
  return (
    <div className="bg-gradient-to-r from-orange-500 to-red-600 py-6 md:py-8 mt-6">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 text-white gap-3">
           <div className="flex flex-wrap items-center gap-3 md:gap-4">
              <h2 className="text-2xl md:text-3xl font-black italic flex items-center gap-1">
                 <Zap className="fill-yellow-300 text-yellow-300" /> F⚡ASH SALE
              </h2>
              <div className="flex gap-1.5 items-center text-black text-sm md:text-base">
                 <span className="bg-white px-2 py-1 rounded font-bold min-w-[2rem] text-center">00</span> :
                 <span className="bg-white px-2 py-1 rounded font-bold min-w-[2rem] text-center">45</span> :
                 <span className="bg-white px-2 py-1 rounded font-bold min-w-[2rem] text-center">12</span>
              </div>
           </div>
           <button className="text-xs md:text-sm font-medium text-white/90 underline hover:text-yellow-200 ml-auto md:ml-0">ดูทั้งหมด &gt;&gt;</button>
        </div>

        {/* Product Carousel */}
        <div className="flex overflow-x-auto gap-3 md:gap-4 pb-4 no-scrollbar snap-x snap-mandatory scroll-pl-4">
          {products.filter(p => p.isFlashSale).map((product) => (
             <div 
                key={product.id} 
                onClick={() => onProductClick?.(product.id)}
                className="min-w-[150px] md:min-w-[200px] w-[150px] md:w-[200px] bg-white rounded-xl p-3 snap-start cursor-pointer hover:shadow-xl transition-shadow flex flex-col justify-between shrink-0"
             >
                <div className="relative mb-2">
                   <div className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-bl-lg rounded-tr-lg z-10 shadow-sm">
                     -{product.discount}%
                   </div>
                   <div className="aspect-square flex items-center justify-center bg-gray-50 rounded-lg p-2">
                     <img src={product.image} alt={product.name} className="w-full h-full object-contain hover:scale-105 transition-transform duration-300" />
                   </div>
                </div>
                
                <div>
                  <h3 className="text-xs md:text-sm text-gray-700 font-medium line-clamp-2 mb-1.5 h-8 md:h-10 leading-tight">{product.name}</h3>
                  <div className="flex flex-wrap items-end gap-1.5 mb-2">
                     <span className="text-red-600 font-black text-sm md:text-lg">฿{product.price.toLocaleString()}</span>
                     {product.originalPrice && (
                       <span className="text-gray-400 text-[10px] md:text-xs line-through mb-0.5">฿{product.originalPrice.toLocaleString()}</span>
                     )}
                  </div>
                  
                  {/* Stock Bar */}
                  <div className="relative w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                     <div 
                       className="absolute top-0 left-0 h-full bg-gradient-to-r from-red-500 to-orange-500" 
                       style={{ width: `${(product.sold / (product.stock + product.sold)) * 100}%` }}
                     />
                     <div className="absolute inset-0 flex items-center justify-center text-[8px] text-white font-bold drop-shadow-md uppercase tracking-wide">
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
