
import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { db } from '../services/mockDb';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { Star, ShoppingCart, Heart, Share2, Truck, ShieldCheck, ArrowLeft, Minus, Plus, CheckCircle2 } from 'lucide-react';

interface ProductDetailPageProps {
  productId: number;
  onBack: () => void;
  onNavigateToProduct: (id: number) => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ productId, onBack, onNavigateToProduct }) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState('');
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);

  useEffect(() => {
    // Scroll to top when product changes
    window.scrollTo(0, 0);
    const foundProduct = db.getProducts().find(p => p.id === productId);
    if (foundProduct) {
      setProduct(foundProduct);
      setSelectedImage(foundProduct.image);
      // Mock related products
      setRelatedProducts(db.getProducts().filter(p => p.category === foundProduct.category && p.id !== foundProduct.id).slice(0, 4));
    }
  }, [productId]);

  if (!product) return <div className="p-10 text-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-24 md:pb-0">
      <Header onHomeClick={onBack} />
      
      {/* Breadcrumb & Back (Mobile) */}
      <div className="container mx-auto px-4 py-4 flex items-center gap-2 text-sm text-gray-500">
        <button onClick={onBack} className="hover:text-[#0056b3] flex items-center gap-1 md:hidden">
            <ArrowLeft size={16} /> Back
        </button>
        <span className="hidden md:inline cursor-pointer hover:text-[#0056b3]" onClick={onBack}>หน้าแรก</span>
        <span className="hidden md:inline">/</span>
        <span className="cursor-pointer hover:text-[#0056b3]">{product.category}</span>
        <span className="hidden md:inline">/</span>
        <span className="text-gray-900 font-medium truncate hidden md:inline">{product.name}</span>
      </div>

      <main className="container mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">
            
            {/* Left Column: Images */}
            <div className="md:col-span-5 lg:col-span-5">
               <div className="aspect-square bg-gray-50 rounded-2xl overflow-hidden mb-4 border border-gray-100 relative group">
                  <img src={selectedImage} alt={product.name} className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500" />
                  {product.discount && (
                     <div className="absolute top-4 right-4 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                        -{product.discount}%
                     </div>
                  )}
               </div>
               <div className="grid grid-cols-4 gap-2 md:gap-4">
                  {[product.image, ...Array(3).fill(product.image)].map((img, idx) => (
                    <div 
                      key={idx} 
                      onClick={() => setSelectedImage(img)}
                      className={`aspect-square rounded-lg border-2 cursor-pointer p-1 ${selectedImage === img && idx === 0 ? 'border-[#0056b3]' : 'border-transparent hover:border-gray-200'}`}
                    >
                       <div className="w-full h-full bg-gray-50 rounded-md overflow-hidden">
                          <img src={img} className="w-full h-full object-contain opacity-80 hover:opacity-100" />
                       </div>
                    </div>
                  ))}
               </div>
            </div>

            {/* Right Column: Info */}
            <div className="md:col-span-7 lg:col-span-7 flex flex-col">
               <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                     <span className="bg-blue-50 text-[#0056b3] px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">{product.brand || 'Generic'}</span>
                     {product.stock > 0 ? (
                        <span className="text-emerald-600 text-[10px] font-bold flex items-center gap-1"><CheckCircle2 size={10} /> มีสินค้า</span>
                     ) : (
                        <span className="text-red-500 text-[10px] font-bold">สินค้าหมด</span>
                     )}
                  </div>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight mb-2">{product.name}</h1>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                     <div className="flex items-center gap-1 text-yellow-400">
                        <Star size={16} fill="currentColor" />
                        <Star size={16} fill="currentColor" />
                        <Star size={16} fill="currentColor" />
                        <Star size={16} fill="currentColor" />
                        <Star size={16} fill="currentColor" className="text-gray-200" />
                        <span className="text-gray-400 ml-1">(4.8)</span>
                     </div>
                     <span>ขายแล้ว {product.sold} ชิ้น</span>
                     <span className="text-gray-300">|</span>
                     <span>รหัส: {product.sku || 'N/A'}</span>
                  </div>
               </div>

               <div className="bg-gray-50 rounded-xl p-4 md:p-6 mb-6 border border-gray-100">
                  <div className="flex items-end gap-3 mb-2">
                     <span className="text-3xl md:text-4xl font-black text-[#0056b3]">฿{product.price.toLocaleString()}</span>
                     {product.originalPrice && (
                        <span className="text-gray-400 text-sm line-through mb-2">฿{product.originalPrice.toLocaleString()}</span>
                     )}
                  </div>
                  <p className="text-xs text-gray-500">ราคาอาจมีการเปลี่ยนแปลงตามโปรโมชั่นและแคมเปญ</p>
               </div>

               {/* Specs Preview */}
               <div className="mb-6 space-y-3">
                  <div className="flex items-start gap-3 text-sm">
                     <ShieldCheck size={18} className="text-[#0056b3] mt-0.5 shrink-0" />
                     <div>
                        <span className="font-bold text-gray-900 block">รับประกันศูนย์ไทย</span>
                        <span className="text-gray-500 text-xs">มั่นใจในคุณภาพ สินค้าของแท้ 100%</span>
                     </div>
                  </div>
                  <div className="flex items-start gap-3 text-sm">
                     <Truck size={18} className="text-[#0056b3] mt-0.5 shrink-0" />
                     <div>
                        <span className="font-bold text-gray-900 block">จัดส่งฟรีทั่วประเทศ</span>
                        <span className="text-gray-500 text-xs">เมื่อซื้อครบ 5,000 บาท ขึ้นไป</span>
                     </div>
                  </div>
               </div>

               {/* Desktop Actions */}
               <div className="mt-auto hidden md:block">
                  <div className="flex items-center gap-4 mb-4">
                     <div className="flex items-center border border-gray-300 rounded-lg bg-white">
                        <button 
                           onClick={() => setQuantity(Math.max(1, quantity - 1))}
                           className="p-3 hover:bg-gray-50 text-gray-600 disabled:opacity-50"
                           disabled={quantity <= 1}
                        >
                           <Minus size={16} />
                        </button>
                        <input 
                           type="text" 
                           value={quantity} 
                           readOnly 
                           className="w-12 text-center font-bold text-gray-900 outline-none" 
                        />
                        <button 
                           onClick={() => setQuantity(quantity + 1)}
                           className="p-3 hover:bg-gray-50 text-gray-600"
                        >
                           <Plus size={16} />
                        </button>
                     </div>
                     <span className="text-sm text-gray-500">มีสินค้า {product.stock} ชิ้น</span>
                  </div>

                  <div className="flex gap-3">
                     <button className="flex-1 bg-[#0056b3] hover:bg-blue-700 text-white py-4 rounded-xl font-bold shadow-lg shadow-blue-500/20 transition-all active:translate-y-0.5 flex items-center justify-center gap-2">
                        <ShoppingCart size={20} /> ใส่ตะกร้าสินค้า
                     </button>
                     <button className="px-4 py-4 border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-colors text-gray-500">
                        <Heart size={20} />
                     </button>
                     <button className="px-4 py-4 border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-colors text-gray-500">
                        <Share2 size={20} />
                     </button>
                  </div>
               </div>
            </div>
          </div>
        </div>

        {/* Product Details Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
           <div className="lg:col-span-2 space-y-8">
               {/* Description */}
               <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                     <div className="w-1 h-6 bg-[#0056b3] rounded-full"></div>
                     รายละเอียดสินค้า
                  </h3>
                  <div className="prose prose-sm text-gray-600 max-w-none leading-relaxed">
                     <p>{product.description || 'ไม่มีรายละเอียดสินค้า'}</p>
                     <p className="mt-4">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                  </div>
               </div>

               {/* Specs */}
               <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
                  <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                     <div className="w-1 h-6 bg-[#0056b3] rounded-full"></div>
                     ข้อมูลจำเพาะ (Specifications)
                  </h3>
                  <div className="overflow-hidden rounded-xl border border-gray-200">
                     <table className="w-full text-sm">
                        <tbody className="divide-y divide-gray-200">
                           <tr className="bg-gray-50">
                              <td className="px-4 py-3 font-bold text-gray-700 w-1/3">แบรนด์</td>
                              <td className="px-4 py-3 text-gray-600">{product.brand || '-'}</td>
                           </tr>
                           <tr className="bg-white">
                              <td className="px-4 py-3 font-bold text-gray-700">หมวดหมู่</td>
                              <td className="px-4 py-3 text-gray-600">{product.category}</td>
                           </tr>
                           <tr className="bg-gray-50">
                              <td className="px-4 py-3 font-bold text-gray-700">ขนาด</td>
                              <td className="px-4 py-3 text-gray-600">{product.dimensions || '-'}</td>
                           </tr>
                           <tr className="bg-white">
                              <td className="px-4 py-3 font-bold text-gray-700">น้ำหนัก</td>
                              <td className="px-4 py-3 text-gray-600">{product.weight ? `${product.weight} kg` : '-'}</td>
                           </tr>
                           <tr className="bg-gray-50">
                              <td className="px-4 py-3 font-bold text-gray-700">SKU</td>
                              <td className="px-4 py-3 text-gray-600">{product.sku}</td>
                           </tr>
                        </tbody>
                     </table>
                  </div>
               </div>
           </div>

           <div className="lg:col-span-1">
               {/* Related Products */}
               <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">สินค้าใกล้เคียง</h3>
                  <div className="space-y-4">
                     {relatedProducts.map(rp => (
                        <div key={rp.id} onClick={() => onNavigateToProduct(rp.id)} className="flex gap-4 group cursor-pointer hover:bg-gray-50 p-2 rounded-xl transition-colors">
                           <div className="w-20 h-20 bg-gray-50 rounded-lg shrink-0 p-1 border border-gray-100">
                              <img src={rp.image} className="w-full h-full object-contain group-hover:scale-105 transition-transform" />
                           </div>
                           <div className="min-w-0">
                              <h4 className="text-xs font-bold text-gray-800 line-clamp-2 mb-1 group-hover:text-[#0056b3] transition-colors">{rp.name}</h4>
                              <div className="text-[#0056b3] font-bold text-sm">฿{rp.price.toLocaleString()}</div>
                              {rp.stock < 5 && <div className="text-[10px] text-red-500 font-bold mt-1">สินค้าใกล้หมด</div>}
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
           </div>
        </div>
      </main>

      {/* Mobile Sticky Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-3 md:hidden z-50 flex items-center gap-3 pb-safe">
         <div className="flex flex-col items-center justify-center px-2 text-gray-500">
            <Share2 size={20} />
            <span className="text-[9px]">แชร์</span>
         </div>
         <div className="w-[1px] h-8 bg-gray-200"></div>
         <button className="flex-1 border border-[#0056b3] text-[#0056b3] py-3 rounded-xl font-bold text-sm hover:bg-blue-50">
            ใส่ตะกร้า
         </button>
         <button className="flex-1 bg-[#0056b3] text-white py-3 rounded-xl font-bold text-sm shadow-lg shadow-blue-500/20">
            ซื้อเลย
         </button>
      </div>
      
      <Footer />
    </div>
  );
};
