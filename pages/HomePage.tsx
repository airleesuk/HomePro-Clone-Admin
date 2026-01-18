
import React, { useEffect, useState } from 'react';
import { Header } from '../components/Header';
import { Hero } from '../components/Hero';
import { FlashSale } from '../components/FlashSale';
import { CategorySection } from '../components/CategorySection';
import { Footer } from '../components/Footer';
import { AiAssistant } from '../components/AiAssistant';
import { db } from '../services/mockDb';
import { Product, ProductVariant } from '../types';
import { Star, ShoppingCart, Check, ChevronRight, ArrowLeft, Filter, Grid, Eye, X, Plus, Minus, ShieldCheck, Truck, Layers, ChevronDown, Circle, AlertCircle } from 'lucide-react';

interface HomePageProps {
  onProductClick?: (product: Product) => void;
}

const ProductCard: React.FC<{ product: Product; onQuickView: (p: Product) => void; onClick?: (p: Product) => void }> = ({ product, onQuickView, onClick }) => {
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);

  const displayPrice = selectedVariant ? selectedVariant.price : product.price;
  const displayImage = selectedVariant?.image ? selectedVariant.image : product.image;
  const hasVariants = product.variants && product.variants.length > 0;
  
  // Calculate stock based on selection or aggregate
  const currentStock = selectedVariant ? selectedVariant.stock : product.stock;

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { label: 'สินค้าหมด', color: 'text-gray-500 bg-gray-100 border-gray-200', dot: 'bg-gray-400' };
    if (stock < 5) return { label: `เหลือ ${stock} ชิ้น`, color: 'text-red-600 bg-red-50 border-red-100', dot: 'bg-red-500 animate-pulse' };
    return { label: 'มีสินค้า', color: 'text-green-600 bg-green-50 border-green-100', dot: 'bg-green-500' };
  };

  const stockInfo = getStockStatus(currentStock);

  return (
    <div 
      onClick={() => onClick && onClick(product)}
      className={`bg-white rounded-2xl border hover:shadow-2xl transition-all duration-300 p-4 group cursor-pointer flex flex-col h-full relative ${product.isFeatured ? 'border-yellow-200 ring-1 ring-yellow-100' : 'border-gray-100'}`}
    >
      {/* Badges Overlay */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5 items-start pointer-events-none">
        {product.isFeatured && (
          <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
            <Star size={10} className="fill-white" /> แนะนำ
          </div>
        )}
        {hasVariants && (
           <div className="bg-white/90 backdrop-blur-sm text-purple-600 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm border border-purple-100">
             <Layers size={10} /> มีตัวเลือก
           </div>
        )}
      </div>
      
      {product.discount && (
          <span className="absolute top-3 right-3 z-10 bg-red-600 text-white text-[11px] font-black px-2 py-1 rounded-lg shadow-sm transform group-hover:scale-110 transition-transform">
            -{product.discount}%
          </span>
      )}
      
      {/* Image Area */}
      <div className="relative mb-4 flex-shrink-0 overflow-hidden rounded-xl h-48 bg-gray-50 flex items-center justify-center group-hover:bg-gray-100 transition-colors">
        <img 
          src={displayImage} 
          alt={product.name} 
          className="w-full h-full object-contain group-hover:scale-110 transition duration-700 p-4 mix-blend-multiply" 
        />
        
        {/* Quick View Button (Hover) */}
        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center backdrop-blur-[1px]">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onQuickView(product);
            }}
            className="bg-white text-gray-800 px-5 py-2.5 rounded-full shadow-lg font-bold text-xs flex items-center gap-2 hover:bg-[#0056b3] hover:text-white transition-all transform translate-y-4 group-hover:translate-y-0 duration-300 active:scale-95 border border-gray-100"
          >
            <Eye size={14} /> ดูตัวอย่าง
          </button>
        </div>
      </div>
      
      {/* Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Category & Brand */}
        <div className="flex justify-between items-center mb-2">
           <span className="text-[10px] text-gray-500 font-medium bg-gray-100 px-2 py-0.5 rounded-md">{product.category}</span>
        </div>

        {/* Product Name */}
        <h3 className="text-gray-800 text-sm font-bold line-clamp-2 min-h-[2.5em] mb-2 group-hover:text-[#0056b3] transition-colors leading-relaxed">
          {product.name}
        </h3>
        
        {/* Stock Status Indicator */}
        <div className="mb-3">
           <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-bold border ${stockInfo.color}`}>
              <div className={`w-1.5 h-1.5 rounded-full ${stockInfo.dot}`}></div>
              {stockInfo.label}
           </div>
        </div>

        {/* Variant Selector (if applicable) */}
        <div className="mt-auto">
          {hasVariants ? (
            <div className="mb-3 h-8">
              {product.variants!.length > 4 ? (
                 <div className="relative" onClick={e => e.stopPropagation()}>
                    <select 
                      className="w-full text-[11px] border border-gray-200 rounded-lg py-1.5 pl-2 pr-6 appearance-none bg-gray-50 focus:bg-white focus:ring-1 focus:ring-blue-500 outline-none cursor-pointer text-gray-700 font-medium"
                      onChange={(e) => {
                         const v = product.variants!.find(v => v.id === e.target.value);
                         setSelectedVariant(v || null);
                      }}
                      value={selectedVariant?.id || ""}
                    >
                       <option value="">เลือกแบบ ({product.variants!.length})</option>
                       {product.variants!.map(v => (
                          <option key={v.id} value={v.id}>{v.name}</option>
                       ))}
                    </select>
                    <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                 </div>
              ) : (
                  <div className="flex flex-wrap gap-1.5" onClick={e => e.stopPropagation()}>
                      {product.variants!.map(variant => (
                          <button 
                              key={variant.id}
                              onClick={() => setSelectedVariant(variant)}
                               className={`text-[10px] px-2 py-1 rounded-md border transition-all font-bold ${
                                  selectedVariant?.id === variant.id 
                                  ? 'bg-blue-600 text-white border-blue-600 shadow-sm' 
                                  : 'bg-white text-gray-600 border-gray-200 hover:border-blue-400 hover:text-blue-600'
                               }`}
                          >
                              {variant.name}
                          </button>
                      ))}
                  </div>
              )}
            </div>
          ) : (
             <div className="mb-3 h-8" /> 
          )}

          {/* Price & Cart Actions */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex flex-col">
              <div className="flex items-baseline gap-1.5">
                <span className="text-[#0056b3] text-lg font-black">฿{displayPrice.toLocaleString()}</span>
                {product.originalPrice && product.originalPrice > displayPrice && (
                  <span className="text-gray-300 text-[10px] line-through font-medium">฿{product.originalPrice.toLocaleString()}</span>
                )}
              </div>
              {!selectedVariant && hasVariants && (
                 <span className="text-[9px] text-orange-500 font-bold -mt-1">ราคาเริ่มต้น</span>
              )}
            </div>

            <button 
              onClick={(e) => {
                 e.stopPropagation();
                 if (currentStock > 0 && (!hasVariants || selectedVariant)) {
                    alert(`เพิ่ม ${product.name} ${selectedVariant ? `(${selectedVariant.name})` : ''} ลงตะกร้า`);
                 }
              }}
              disabled={currentStock === 0}
              className={`w-9 h-9 flex items-center justify-center rounded-full transition-all shadow-sm ${
                  currentStock === 0 
                  ? 'bg-gray-100 text-gray-300 cursor-not-allowed'
                  : hasVariants && !selectedVariant 
                  ? 'bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-100' 
                  : 'bg-[#0056b3] text-white hover:bg-blue-700 hover:shadow-blue-200 hover:scale-105 active:scale-95'
              }`}
              title={currentStock === 0 ? 'สินค้าหมด' : 'เพิ่มลงตะกร้า'}
            >
              <ShoppingCart size={16} /> 
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProductQuickViewModal: React.FC<{ product: Product | null; onClose: () => void }> = ({ product, onClose }) => {
  if (!product) return null;

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const displayPrice = selectedVariant ? selectedVariant.price : product.price;
  const displayImage = selectedVariant?.image ? selectedVariant.image : product.image;

  // Use real description if available, otherwise fallback
  const description = product.description || `พบกับนวัตกรรมใหม่แห่งการอยู่อาศัย ด้วย ${product.name} ที่ได้รับการออกแบบมาอย่างพิถีพิถัน เพื่อตอบโจทย์ทุกความต้องการของบ้านคุณ สินค้าคุณภาพสูงในหมวด ${product.category} มั่นใจได้ในความทนทานและประสิทธิภาพการใช้งานที่ยาวนาน`;

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
                    onClick={() => setSelectedVariant(v)}
                    className={`px-4 py-2.5 rounded-xl border-2 font-bold text-sm transition-all ${selectedVariant?.id === v.id ? 'border-blue-600 bg-blue-50 text-blue-600 shadow-md ring-4 ring-blue-50' : 'border-gray-100 hover:border-gray-300 text-gray-600'}`}
                  >
                    {v.name}
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

export const HomePage: React.FC<HomePageProps> = ({ onProductClick }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [currentView, setCurrentView] = useState<'landing' | 'all-products'>('landing');
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  useEffect(() => {
    setProducts(db.getProducts());
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentView]);

  const featuredProducts = products.filter(p => p.isFeatured);

  const LandingView = () => (
    <>
      <Hero />
      <FlashSale products={products} />
      
      {/* Featured Products Section */}
      {featuredProducts.length > 0 && (
        <div className="container mx-auto px-4 py-12">
          <div className="flex items-center gap-3 mb-8 border-b-2 border-yellow-200 pb-4">
            <div className="bg-yellow-400 p-2.5 rounded-xl shadow-lg">
              <Star className="text-white fill-white" size={22} />
            </div>
            <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">สินค้าแนะนำพิเศษ</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onQuickView={setQuickViewProduct} 
                onClick={onProductClick}
              />
            ))}
          </div>
        </div>
      )}

      <CategorySection />
      
      {/* Recommended Products Section */}
      <div className="container mx-auto px-4 py-12">
         <div className="flex items-center justify-between mb-8 border-b-2 border-blue-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-2.5 rounded-xl shadow-lg">
                <Star className="text-white fill-white" size={22} />
              </div>
              <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">สินค้าที่คุณอาจสนใจ</h2>
            </div>
            <button 
              onClick={() => setCurrentView('all-products')}
              className="text-sm font-black text-[#0056b3] hover:text-blue-800 flex items-center gap-1.5 transition-all group bg-blue-50 px-4 py-2 rounded-full"
            >
              ดูทั้งหมด <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
         </div>
         <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
           {products.slice(0, 10).map((product) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onQuickView={setQuickViewProduct} 
                onClick={onProductClick}
              />
           ))}
         </div>
      </div>
    </>
  );

  const AllProductsView = () => (
    <div className="container mx-auto px-4 py-10">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 gap-6">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setCurrentView('landing')}
            className="p-3 bg-white shadow-md hover:shadow-lg rounded-2xl transition-all text-gray-600 active:scale-95"
          >
            <ArrowLeft size={24} strokeWidth={2.5} />
          </button>
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">สินค้าทั้งหมด</h1>
            <p className="text-sm text-gray-400 font-bold uppercase tracking-widest mt-1">Total {products.length} Products</p>
          </div>
        </div>
        
        <div className="flex gap-4 w-full md:w-auto">
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-white border-2 border-gray-100 rounded-2xl text-sm font-black hover:border-blue-200 transition-all shadow-sm">
            <Filter size={18} /> กรองสินค้า
          </button>
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-white border-2 border-gray-100 rounded-2xl text-sm font-black hover:border-blue-200 transition-all shadow-sm">
            <Grid size={18} /> เรียงลำดับ
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {products.map((product) => (
          <ProductCard 
            key={product.id} 
            product={product} 
            onQuickView={setQuickViewProduct} 
            onClick={onProductClick}
          />
        ))}
      </div>
      
      {products.length === 0 && (
        <div className="py-24 text-center">
          <div className="bg-gray-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
            <Grid className="text-gray-300" size={40} />
          </div>
          <p className="text-gray-400 font-black text-xl">ไม่พบรายการสินค้าในขณะนี้</p>
          <button onClick={() => setCurrentView('landing')} className="mt-6 text-blue-600 font-bold underline">กลับสู่หน้าหลัก</button>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
      <Header />
      <main className="min-h-[60vh]">
        {currentView === 'landing' ? <LandingView /> : <AllProductsView />}
      </main>
      <AiAssistant />
      <Footer />
      
      {/* Quick View Modal */}
      <ProductQuickViewModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
    </div>
  );
};
