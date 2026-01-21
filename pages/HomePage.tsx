
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
import { ProductQuickViewModal } from '../components/ProductQuickViewModal';

interface HomePageProps {
  onProductClick?: (product: Product) => void;
}

const ProductCard: React.FC<{ product: Product; onQuickView: (p: Product) => void; onClick?: (p: Product) => void }> = ({ product, onQuickView, onClick }) => {
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [hoveredVariant, setHoveredVariant] = useState<ProductVariant | null>(null);

  // Determine what to show: Hover takes precedence for preview, then Selected, then Default
  const activeVariant = hoveredVariant || selectedVariant;
  
  const displayPrice = activeVariant ? activeVariant.price : product.price;
  const displayImage = activeVariant?.image ? activeVariant.image : product.image;
  const hasVariants = product.variants && product.variants.length > 0;
  
  // Determine if we should show image thumbnails for variants
  const showVariantThumbnails = hasVariants && product.variants!.some(v => v.image);
  
  // Calculate stock based on selection or aggregate
  const currentStock = activeVariant ? activeVariant.stock : product.stock;

  // Calculate dynamic discount based on current display price
  const discountPercent = product.originalPrice && product.originalPrice > displayPrice
    ? Math.round(((product.originalPrice - displayPrice) / product.originalPrice) * 100)
    : 0;

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { label: 'สินค้าหมด', color: 'text-gray-400 bg-gray-100 border-gray-200', dot: 'bg-gray-400' };
    if (stock < 5) return { label: `เหลือ ${stock} ชิ้น`, color: 'text-red-600 bg-red-50 border-red-100', dot: 'bg-red-500 animate-pulse' };
    return { label: 'มีสินค้า', color: 'text-green-600 bg-green-50 border-green-100', dot: 'bg-green-500' };
  };

  const stockInfo = getStockStatus(currentStock);

  const handleVariantClick = (e: React.MouseEvent, variant: ProductVariant) => {
    e.stopPropagation();
    // Toggle selection: if already selected, deselect it
    if (selectedVariant?.id === variant.id) {
        setSelectedVariant(null);
    } else {
        setSelectedVariant(variant);
    }
  };

  return (
    <div 
      onClick={() => onClick && onClick(product)}
      className={`bg-white rounded-2xl border hover:shadow-xl hover:border-blue-300 transition-all duration-300 flex flex-col h-full relative group cursor-pointer overflow-hidden ${product.isFeatured ? 'border-yellow-200 ring-1 ring-yellow-50' : 'border-gray-100'}`}
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
      
      {discountPercent > 0 && (
          <span className="absolute top-3 right-3 z-10 bg-red-600 text-white text-[11px] font-black px-2 py-1 rounded-lg shadow-sm transform group-hover:scale-110 transition-transform">
            -{discountPercent}%
          </span>
      )}
      
      {/* Image Area */}
      <div className="relative h-48 bg-gray-50 flex items-center justify-center p-4 overflow-hidden group-hover:bg-gray-100 transition-colors">
        <img 
          src={displayImage} 
          alt={product.name} 
          className="w-full h-full object-contain group-hover:scale-110 transition duration-700 mix-blend-multiply" 
        />
        
        {/* Quick View Button (Hover) */}
        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center backdrop-blur-[1px]">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onQuickView(product);
            }}
            className="bg-white text-gray-800 px-4 py-2 rounded-full shadow-lg font-bold text-xs flex items-center gap-2 hover:bg-[#0056b3] hover:text-white transition-all transform translate-y-4 group-hover:translate-y-0 duration-300 active:scale-95 border border-gray-100"
          >
            <Eye size={14} /> ดูตัวอย่าง
          </button>
        </div>
      </div>
      
      {/* Content Area */}
      <div className="p-4 flex flex-col flex-1">
        {/* Category */}
        <div className="mb-1">
           <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{product.category}</span>
        </div>

        {/* Product Name */}
        <h3 className="text-gray-800 text-sm font-bold line-clamp-2 h-10 mb-2 leading-snug group-hover:text-[#0056b3] transition-colors" title={product.name}>
          {product.name}
        </h3>
        
        {/* Stock Status Indicator */}
        <div className="mb-3">
           <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold border transition-colors duration-300 ${stockInfo.color}`}>
              <div className={`w-1.5 h-1.5 rounded-full ${stockInfo.dot}`}></div>
              {stockInfo.label}
           </div>
        </div>

        {/* Spacer to push variants and price to bottom */}
        <div className="flex-1" />

        {/* Variant Selector */}
        <div className="min-h-[40px] mb-2 flex items-end w-full">
          {hasVariants ? (
            <div className="w-full">
              {!showVariantThumbnails && product.variants!.length > 6 ? (
                 <div className="relative w-full">
                    <select 
                      className="w-full text-[11px] border border-gray-200 rounded-lg py-1.5 pl-2 pr-6 appearance-none bg-gray-50 focus:bg-white focus:ring-1 focus:ring-blue-500 outline-none cursor-pointer text-gray-700 font-medium transition-shadow hover:shadow-sm"
                      onClick={(e) => e.stopPropagation()}
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
                  <div className="flex flex-wrap gap-1.5">
                      {product.variants!.map(variant => {
                        const isSelected = selectedVariant?.id === variant.id;
                        const isSwatch = showVariantThumbnails && variant.image;

                        return (
                          <button 
                              key={variant.id}
                              onClick={(e) => handleVariantClick(e, variant)}
                              onMouseEnter={() => setHoveredVariant(variant)}
                              onMouseLeave={() => setHoveredVariant(null)}
                              className={`
                                group relative transition-all duration-200 border overflow-hidden
                                ${isSwatch ? 'w-8 h-8 rounded-full p-0.5' : 'px-2 py-1 rounded-lg min-w-[32px]'}
                                ${isSelected 
                                  ? 'border-blue-600 ring-1 ring-blue-600 bg-blue-50 shadow-sm' 
                                  : 'border-gray-200 hover:border-blue-400 bg-white hover:shadow-sm'
                                }
                              `}
                              title={variant.name}
                          >
                              {isSwatch ? (
                                <>
                                  <img 
                                      src={variant.image} 
                                      alt={variant.name} 
                                      className="w-full h-full object-cover rounded-full" 
                                  />
                                  {isSelected && (
                                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center rounded-full">
                                      <Check size={12} className="text-white drop-shadow-md" strokeWidth={3} />
                                    </div>
                                  )}
                                </>
                              ) : (
                                  <span className={`text-[10px] font-bold block whitespace-nowrap ${isSelected ? 'text-blue-700' : 'text-gray-600'}`}>
                                      {variant.name}
                                  </span>
                              )}
                          </button>
                        );
                      })}
                  </div>
              )}
            </div>
          ) : (
             // Placeholder to maintain height if needed, or just allow collapse
             <div className="w-full" /> 
          )}
        </div>

        {/* Price & Cart Actions */}
        <div className="pt-3 border-t border-gray-50 flex items-center justify-between gap-2 mt-auto">
            <div className="flex flex-col">
              <div className="flex items-baseline gap-1.5">
                <span className="text-[#0056b3] text-lg font-black transition-all duration-300 transform">
                  ฿{displayPrice.toLocaleString()}
                </span>
                {product.originalPrice && product.originalPrice > displayPrice && (
                  <span className="text-gray-300 text-[10px] line-through font-medium">฿{product.originalPrice.toLocaleString()}</span>
                )}
              </div>
              {!selectedVariant && hasVariants && !hoveredVariant && (
                 <span className="text-[9px] text-orange-500 font-bold -mt-0.5 animate-pulse">ราคาเริ่มต้น</span>
              )}
            </div>

            <button 
              onClick={(e) => {
                 e.stopPropagation();
                 if (currentStock > 0) {
                    if (hasVariants && !selectedVariant) {
                       alert('กรุณาเลือกตัวเลือกสินค้าก่อน (สี/ขนาด)');
                       return;
                    }
                    alert(`เพิ่ม ${product.name} ${selectedVariant ? `(${selectedVariant.name})` : ''} ลงตะกร้า`);
                 }
              }}
              disabled={currentStock === 0}
              className={`w-9 h-9 flex items-center justify-center rounded-full transition-all shadow-sm flex-shrink-0 ${
                  currentStock === 0 
                  ? 'bg-gray-100 text-gray-300 cursor-not-allowed'
                  : hasVariants && !selectedVariant 
                  ? 'bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-100' 
                  : 'bg-[#0056b3] text-white hover:bg-blue-700 hover:shadow-blue-200 hover:scale-105 active:scale-95'
              }`}
              title={currentStock === 0 ? 'สินค้าหมด' : 'เพิ่มลงตะกร้า'}
            >
              <ShoppingCart size={18} /> 
            </button>
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
