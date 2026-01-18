
import React, { useState } from 'react';
import { Product, ProductVariant } from '../types';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { db } from '../services/mockDb';
import { ShoppingCart, Heart, ShieldCheck, Truck, Star, Share2, ArrowLeft, Check, Minus, Plus } from 'lucide-react';

interface ProductDetailPageProps {
  product: Product;
  onBack: () => void;
  onProductClick: (product: Product) => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ product, onBack, onProductClick }) => {
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(selectedVariant?.image || product.image);
  const [activeTab, setActiveTab] = useState<'details' | 'specs' | 'reviews'>('details');

  const displayPrice = selectedVariant ? selectedVariant.price : product.price;
  
  // Update active image if variant changes
  React.useEffect(() => {
    if (selectedVariant?.image) {
        setActiveImage(selectedVariant.image);
    } else {
        setActiveImage(product.image);
    }
  }, [selectedVariant, product.image]);

  const currentStock = selectedVariant ? selectedVariant.stock : product.stock;

  const handleAddToCart = () => {
    alert(`เพิ่ม ${product.name} ${selectedVariant ? `(${selectedVariant.name})` : ''} จำนวน ${quantity} ชิ้น ลงตะกร้าแล้ว`);
  };

  const images = [product.image, ...(product.variants?.map(v => v.image).filter(Boolean) as string[])];

  // Logic for Related Products
  const relatedProducts = db.getProducts()
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Header />
      
      <div className="container mx-auto px-4 py-6">
        <button onClick={onBack} className="flex items-center gap-2 text-gray-500 hover:text-blue-600 mb-6 transition font-medium">
           <ArrowLeft size={18} /> กลับสู่หน้ารวมสินค้า
        </button>

        {/* Main Product Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            {/* Left: Images */}
            <div className="p-8 bg-gray-50 flex flex-col gap-6">
               <div className="w-full aspect-square bg-white rounded-2xl overflow-hidden border border-gray-100 flex items-center justify-center p-4 shadow-sm relative group">
                  <img src={activeImage} alt={product.name} className="max-w-full max-h-full object-contain transition-transform duration-500 group-hover:scale-110" />
                  {product.discount && (
                    <span className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-lg font-black shadow-lg">-{product.discount}%</span>
                  )}
               </div>
               
               {/* Image Carousel / Thumbnails */}
               {images.length > 1 && (
                 <div className="flex gap-4 overflow-x-auto pb-4 snap-x scroll-smooth no-scrollbar px-1">
                    {images.map((img, idx) => (
                      <div 
                        key={idx} 
                        onClick={() => setActiveImage(img)}
                        className={`w-20 h-20 shrink-0 rounded-xl border-2 cursor-pointer p-1 bg-white snap-start transition-all duration-200 ${activeImage === img ? 'border-blue-600 ring-2 ring-blue-100 scale-105 shadow-md' : 'border-gray-200 hover:border-blue-300 opacity-80 hover:opacity-100'}`}
                      >
                         <img src={img} className="w-full h-full object-contain" alt={`View ${idx + 1}`} />
                      </div>
                    ))}
                 </div>
               )}
            </div>

            {/* Right: Info */}
            <div className="p-8 lg:p-12 flex flex-col">
              <div className="mb-2 flex items-center justify-between">
                 <span className="text-blue-600 font-bold bg-blue-50 px-3 py-1 rounded-lg text-xs tracking-wide uppercase">{product.category}</span>
                 <div className="flex gap-2">
                    <button className="text-gray-400 hover:text-red-500 transition"><Heart size={20} /></button>
                    <button className="text-gray-400 hover:text-blue-500 transition"><Share2 size={20} /></button>
                 </div>
              </div>

              <h1 className="text-3xl lg:text-4xl font-black text-gray-900 mb-4 leading-tight">{product.name}</h1>
              
              <div className="flex items-center gap-4 mb-8">
                 <div className="flex text-yellow-400">
                    {[1,2,3,4,5].map(s => <Star key={s} size={18} fill="currentColor" />)}
                 </div>
                 <span className="text-gray-400 text-sm font-medium">120 รีวิว | ขายแล้ว {product.sold} ชิ้น</span>
              </div>

              <div className="bg-blue-50/50 p-6 rounded-2xl border border-blue-100 mb-8">
                 <div className="flex items-baseline gap-3">
                    <span className="text-4xl font-black text-blue-700">฿{displayPrice.toLocaleString()}</span>
                    {product.originalPrice && (
                       <span className="text-lg text-gray-400 line-through font-medium">฿{product.originalPrice.toLocaleString()}</span>
                    )}
                 </div>
                 <div className="flex items-center gap-4 mt-2">
                    <p className="text-blue-600 text-xs font-bold flex items-center gap-2">
                        <Truck size={14}/> ส่งฟรีทั่วไทย เมื่อช้อปครบ 2,000.-
                    </p>
                    <div className={`px-2 py-0.5 rounded text-[10px] font-bold border ${currentStock < 5 ? 'bg-red-50 text-red-600 border-red-100' : 'bg-green-50 text-green-600 border-green-100'}`}>
                        {currentStock === 0 ? 'สินค้าหมด' : currentStock < 5 ? `เหลือเพียง ${currentStock} ชิ้น` : 'มีสินค้าพร้อมส่ง'}
                    </div>
                 </div>
              </div>

              {product.variants && product.variants.length > 0 && (
                <div className="mb-8">
                   <h3 className="text-sm font-black text-gray-900 mb-3 uppercase tracking-wider">ตัวเลือกสินค้า:</h3>
                   <div className="flex flex-wrap gap-3">
                      {product.variants.map(variant => (
                        <button
                          key={variant.id}
                          onClick={() => setSelectedVariant(variant)}
                          className={`px-4 py-2 rounded-xl border-2 font-bold text-sm flex items-center gap-2 transition-all ${
                             selectedVariant?.id === variant.id 
                             ? 'border-blue-600 bg-blue-600 text-white shadow-lg shadow-blue-200' 
                             : 'border-gray-200 text-gray-600 hover:border-gray-300'
                          }`}
                        >
                          {variant.name}
                          {selectedVariant?.id === variant.id && <Check size={14} strokeWidth={3} />}
                        </button>
                      ))}
                   </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-4 mt-auto">
                 <div className="flex items-center border-2 border-gray-100 rounded-xl w-fit h-14">
                    <button 
                        onClick={() => setQuantity(Math.max(1, quantity - 1))} 
                        disabled={currentStock === 0}
                        className="px-4 h-full hover:bg-gray-50 text-gray-500 rounded-l-xl transition disabled:opacity-30"
                    >
                        <Minus size={18}/>
                    </button>
                    <input type="number" value={quantity} readOnly className="w-12 text-center font-bold text-lg outline-none" />
                    <button 
                        onClick={() => setQuantity(Math.min(currentStock, quantity + 1))} 
                        disabled={currentStock === 0 || quantity >= currentStock}
                        className="px-4 h-full hover:bg-gray-50 text-gray-500 rounded-r-xl transition disabled:opacity-30"
                    >
                        <Plus size={18}/>
                    </button>
                 </div>
                 
                 <button 
                   onClick={handleAddToCart}
                   disabled={currentStock === 0}
                   className={`flex-1 h-14 rounded-xl font-black text-lg shadow-xl shadow-blue-200 transition-all active:scale-[0.98] flex items-center justify-center gap-3 ${currentStock === 0 ? 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-none' : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-2xl'}`}
                 >
                    <ShoppingCart size={22} /> {currentStock === 0 ? 'สินค้าหมด' : 'เพิ่มลงตะกร้า'}
                 </button>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-8 pt-6 border-t border-gray-100">
                 <div className="flex items-start gap-3">
                    <ShieldCheck className="text-green-500 shrink-0" />
                    <div>
                       <h4 className="font-bold text-sm">รับประกันของแท้</h4>
                       <p className="text-xs text-gray-500">สินค้าทุกชิ้นรับประกันศูนย์ไทย</p>
                    </div>
                 </div>
                 <div className="flex items-start gap-3">
                    <Truck className="text-orange-500 shrink-0" />
                    <div>
                       <h4 className="font-bold text-sm">จัดส่งรวดเร็ว</h4>
                       <p className="text-xs text-gray-500">กทม. ส่งภายในวัน ตจว. 1-3 วัน</p>
                    </div>
                 </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs Section */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Tab Headers */}
            <div className="flex border-b border-gray-100 overflow-x-auto no-scrollbar">
                <button 
                    onClick={() => setActiveTab('details')}
                    className={`flex-1 min-w-[150px] py-4 text-sm font-bold text-center transition-colors ${activeTab === 'details' ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/30' : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'}`}
                >
                    รายละเอียดสินค้า
                </button>
                <button 
                    onClick={() => setActiveTab('specs')}
                    className={`flex-1 min-w-[150px] py-4 text-sm font-bold text-center transition-colors ${activeTab === 'specs' ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/30' : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'}`}
                >
                    ข้อมูลจำเพาะ
                </button>
                <button 
                    onClick={() => setActiveTab('reviews')}
                    className={`flex-1 min-w-[150px] py-4 text-sm font-bold text-center transition-colors ${activeTab === 'reviews' ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/30' : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'}`}
                >
                    รีวิว (120)
                </button>
            </div>

            {/* Tab Content */}
            <div className="p-6 md:p-8 min-h-[300px]">
                {activeTab === 'details' && (
                    <div className="space-y-4 animate-in fade-in duration-300">
                        <h3 className="text-lg font-bold text-gray-800">รายละเอียดสินค้า</h3>
                        <p className="text-gray-600 leading-relaxed">
                            พบกับนวัตกรรมใหม่แห่งการอยู่อาศัย ด้วย {product.name} ที่ได้รับการออกแบบมาอย่างพิถีพิถัน 
                            เพื่อตอบโจทย์ทุกความต้องการของบ้านคุณ สินค้าคุณภาพสูงจากแบรนด์ชั้นนำ มั่นใจได้ในความทนทานและประสิทธิภาพการใช้งานที่ยาวนาน 
                            ผลิตจากวัสดุเกรดพรีเมียม ปลอดภัยต่อการใช้งานและเป็นมิตรต่อสิ่งแวดล้อม
                        </p>
                        <ul className="list-disc pl-5 text-gray-600 space-y-2 mt-4">
                            <li>ดีไซน์ทันสมัย เข้ากับบ้านทุกสไตล์</li>
                            <li>ติดตั้งง่าย ใช้งานสะดวก</li>
                            <li>ประหยัดพลังงานและเป็นมิตรกับสิ่งแวดล้อม</li>
                            <li>รับประกันคุณภาพสินค้าจากผู้ผลิต</li>
                            <li>รองรับการใช้งานที่หลากหลาย</li>
                        </ul>
                    </div>
                )}

                {activeTab === 'specs' && (
                    <div className="animate-in fade-in duration-300">
                        <h3 className="text-lg font-bold text-gray-800 mb-4">ข้อมูลจำเพาะ (Specifications)</h3>
                        <div className="border border-gray-200 rounded-xl overflow-hidden">
                            <table className="w-full text-sm text-left">
                                <tbody className="divide-y divide-gray-100">
                                    <tr className="bg-gray-50">
                                        <td className="py-3 px-4 font-semibold text-gray-600 w-1/3">แบรนด์</td>
                                        <td className="py-3 px-4 text-gray-800">HomePro Select</td>
                                    </tr>
                                    <tr>
                                        <td className="py-3 px-4 font-semibold text-gray-600">หมวดหมู่</td>
                                        <td className="py-3 px-4 text-gray-800">{product.category}</td>
                                    </tr>
                                    <tr className="bg-gray-50">
                                        <td className="py-3 px-4 font-semibold text-gray-600">วัสดุ</td>
                                        <td className="py-3 px-4 text-gray-800">High Quality Polymer / Stainless Steel</td>
                                    </tr>
                                    <tr>
                                        <td className="py-3 px-4 font-semibold text-gray-600">สี</td>
                                        <td className="py-3 px-4 text-gray-800">มาตรฐาน (Standard)</td>
                                    </tr>
                                    <tr className="bg-gray-50">
                                        <td className="py-3 px-4 font-semibold text-gray-600">ขนาด</td>
                                        <td className="py-3 px-4 text-gray-800">ตามรุ่นที่ระบุ</td>
                                    </tr>
                                    <tr>
                                        <td className="py-3 px-4 font-semibold text-gray-600">การรับประกัน</td>
                                        <td className="py-3 px-4 text-gray-800">1 ปี (เงื่อนไขตามบริษัทกำหนด)</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'reviews' && (
                    <div className="space-y-6 animate-in fade-in duration-300">
                        <div className="flex items-center justify-between mb-6 bg-gray-50 p-4 rounded-xl border border-gray-100">
                            <div>
                                <h3 className="text-lg font-bold text-gray-800">คะแนนและรีวิวจากลูกค้า</h3>
                                <p className="text-xs text-gray-500">ความพึงพอใจโดยรวม</p>
                            </div>
                            <div className="flex flex-col items-end">
                                <div className="flex items-center gap-2">
                                    <span className="text-4xl font-black text-yellow-400">4.8</span>
                                    <div className="flex flex-col">
                                        <div className="flex text-yellow-400 text-sm">
                                            {[1,2,3,4,5].map(s => <Star key={s} size={16} fill={s <= 4 ? "currentColor" : "none"} className={s === 5 ? "text-gray-300" : ""} />)}
                                        </div>
                                        <span className="text-gray-400 text-xs text-right">จาก 120 รีวิว</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Mock Review Items */}
                        {[1, 2, 3].map((item) => (
                            <div key={item} className="border-b border-gray-100 pb-6 last:border-0 last:pb-0">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center font-bold text-blue-600 text-xs shadow-inner">
                                        U{item}
                                    </div>
                                    <div>
                                        <p className="font-bold text-sm text-gray-800">คุณลูกค้า {item}</p>
                                        <div className="flex text-yellow-400 text-xs">
                                            {[1,2,3,4,5].map(s => <Star key={s} size={12} fill="currentColor" />)}
                                        </div>
                                    </div>
                                    <span className="ml-auto text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">2 วันที่แล้ว</span>
                                </div>
                                <p className="text-gray-600 text-sm leading-relaxed bg-gray-50/50 p-3 rounded-lg">
                                    สินค้าคุณภาพดีมากครับ จัดส่งรวดเร็ว แพ็คของมาอย่างดี พนักงานสุภาพ บริการประทับใจ ไว้จะมาอุดหนุนใหม่แน่นอนครับ 
                                    {item === 1 && " แนะนำเลยสำหรับคนที่กำลังมองหาสินค้าตัวนี้ คุ้มค่าราคามาก"}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="mt-12 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
               สินค้าที่เกี่ยวข้อง
               <span className="text-sm font-normal text-gray-400 bg-gray-100 px-3 py-1 rounded-full">Selected for you</span>
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {relatedProducts.map(relProduct => (
                <div 
                   key={relProduct.id} 
                   onClick={() => onProductClick(relProduct)}
                   className="bg-white p-4 rounded-2xl border border-gray-100 hover:shadow-xl transition-all cursor-pointer group"
                >
                   {/* Card Content */}
                   <div className="relative aspect-square mb-4 rounded-xl overflow-hidden bg-gray-50">
                      <img src={relProduct.image} className="w-full h-full object-contain group-hover:scale-110 transition duration-500" alt={relProduct.name} />
                      {relProduct.discount && <span className="absolute top-2 right-2 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded">- {relProduct.discount}%</span>}
                   </div>
                   <h4 className="font-bold text-gray-800 text-sm line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors">{relProduct.name}</h4>
                   <div className="flex items-end justify-between">
                      <div className="flex flex-col">
                        <span className="text-blue-600 font-black">฿{relProduct.price.toLocaleString()}</span>
                        {relProduct.originalPrice && <span className="text-[10px] text-gray-400 line-through">฿{relProduct.originalPrice.toLocaleString()}</span>}
                      </div>
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                         <ShoppingCart size={14} />
                      </div>
                   </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
      <Footer />
    </div>
  );
};
