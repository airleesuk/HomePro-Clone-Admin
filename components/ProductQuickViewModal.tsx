
import React, { useState } from 'react';
import { Product, ProductVariant } from '../types';
import { Star, ShoppingCart, Check, Minus, Plus, ShieldCheck, Truck, X } from 'lucide-react';

interface ProductQuickViewModalProps {
  product: Product | null;
  onClose: () => void;
}

export const ProductQuickViewModal: React.FC<ProductQuickViewModalProps> = ({ product, onClose }) => {
  if (!product) return null;

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const displayPrice = selectedVariant ? selectedVariant.price : product.price;
  const displayImage = selectedVariant?.image ? selectedVariant.image : product.image;

  // Use real description if available, otherwise fallback
  const description = product.description || `พบกับนวัตกรรมใหม่แห่งการอยู่อาศัย ด้วย ${product.name} ที่ได้รับการออกแบบมาอย่างพิถีพิถัน เพื่อตอบโจทย์ทุกความต้องการของบ้านคุณ สินค้าคุณภาพสูงในหมวด ${product.category} มั่นใจได้ในความทนทานและประสิทธิภาพการใช้งานที่ยาวนาน`;

  // Determine if we should show image thumbnails for variants in Modal
  const showVariantThumbnails = product.variants?.some(v => v.image);

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose} />
      <div className="relative bg-white w-full max-w-4xl rounded-[2rem] shadow-2xl overflow-hidden flex flex-col md:flex-row animate-in zoom-in-95 duration-300">
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 z-20 bg-gray-100 hover:bg-gray-200 text-gray-500 p-2 rounded-full transition-all active:scale-90"
        >
          <X size={24} />
        </button>

        {/* Left: Image */}
        <div className="w-full md:w-1/2 bg-gray-50 p-8 flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white to-gray-100 opacity-50"></div>
          <img src={displayImage} alt={product.name} className="max-w-full max-h-[400px] object-contain drop-shadow-2xl relative z-10 hover:scale-110 transition duration-700" />
        </div>

        {/* Right: Info */}
        <div className="w-full md:w-1/2 p-8 md:p-12 overflow-y-auto max-h-[80vh] no-scrollbar bg-white">
          <div className="mb-2">
            <span className="bg-blue-100 text-blue-600 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">{product.category}</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-2 leading-tight">{product.name}</h2>
          
          <div className="flex items-center gap-2 mb-4">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => <Star key={i} size={16} fill={i < 4 ? "currentColor" : "none"} />)}
            </div>
            <span className="text-xs text-gray-400 font-bold">(4.8 / 5 รีวิวลูกค้า)</span>
          </div>

          <p className="text-sm text-gray-500 mb-6 leading-relaxed border-l-2 border-gray-200 pl-3">
             {description}
          </p>

          <div className="bg-blue-50/50 p-6 rounded-2xl mb-8 border border-blue-100/50">
            <div className="flex items-baseline gap-3 mb-2">
               <span className="text-4xl font-black text-blue-600">฿{displayPrice.toLocaleString()}</span>
               {product.originalPrice && (
                 <span className="text-lg text-gray-400 line-through italic font-medium">฿{product.originalPrice.toLocaleString()}</span>
               )}
            </div>
            {product.discount && (
              <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-md font-bold uppercase tracking-tighter animate-pulse">
                ประหยัด {product.discount}% ทันที
              </span>
            )}
          </div>

          {product.variants && product.variants.length > 0 && (
            <div className="mb-8">
              <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">เลือกตัวเลือกสินค้า:</h4>
              <div className="flex flex-wrap gap-3">
                {product.variants.map((v) => (
                  <button 
                    key={v.id} 
                    onClick={() => setSelectedVariant(selectedVariant?.id === v.id ? null : v)}
                    className={`
                        relative transition-all duration-200 border-2
                        ${showVariantThumbnails && v.image ? 'w-16 h-16 rounded-xl p-1' : 'px-4 py-2.5 rounded-xl font-bold text-sm'}
                        ${selectedVariant?.id === v.id 
                            ? 'border-blue-600 bg-blue-50 text-blue-600 shadow-md ring-2 ring-blue-100' 
                            : 'border-gray-100 hover:border-gray-300 text-gray-600'}
                    `}
                    title={v.name}
                  >
                    {showVariantThumbnails && v.image ? (
                        <>
                            <img src={v.image} alt={v.name} className="w-full h-full object-cover rounded-lg" />
                            {selectedVariant?.id === v.id && (
                                <div className="absolute top-0 right-0 bg-blue-600 text-white rounded-bl-lg rounded-tr-sm p-0.5">
                                    <Check size={10} />
                                </div>
                            )}
                        </>
                    ) : v.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-4 mb-8">
             <div className="flex items-center gap-3 text-sm font-medium text-gray-600">
                <Truck size={18} className="text-blue-500" />
                <span>จัดส่งฟรีเมื่อซื้อครบ ฿500 ขึ้นไป</span>
             </div>
             <div className="flex items-center gap-3 text-sm font-medium text-gray-600">
                <ShieldCheck size={18} className="text-green-500" />
                <span>รับประกันศูนย์ไทย 1 ปีเต็ม</span>
             </div>
          </div>

          <div className="flex gap-4">
            <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden shadow-sm">
               <button className="p-3 hover:bg-gray-50 transition text-gray-400"><Minus size={18} /></button>
               <span className="px-4 font-black text-lg">1</span>
               <button className="p-3 hover:bg-gray-50 transition text-gray-400"><Plus size={18} /></button>
            </div>
            <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-black flex items-center justify-center gap-3 shadow-xl hover:shadow-blue-200 transition-all active:scale-95">
              <ShoppingCart size={22} /> เพิ่มลงรถเข็น
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
