
import React, { useEffect, useState, useMemo } from 'react';
import { Header } from '../components/Header';
import { Hero } from '../components/Hero';
import { FlashSale } from '../components/FlashSale';
import { CategorySection } from '../components/CategorySection';
import { Footer } from '../components/Footer';
import { db } from '../services/mockDb';
import { Product } from '../types';
import { Star, ShoppingCart, ShieldCheck, PenTool, Layout, Hammer } from 'lucide-react';

interface HomePageProps {
  onProductClick?: (id: number) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onProductClick }) => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    setProducts(db.getProducts());
  }, []);

  const featuredProducts = useMemo(() => {
    return products.filter(p => p.isFeatured);
  }, [products]);

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-20 md:pb-0 scroll-smooth">
      <Header />
      <main className="space-y-12">
        <Hero />
        
        {/* Professional Build Services Matrix */}
        <section className="container mx-auto px-4 mt-8">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1 bg-[#001f3f] rounded-[2.5rem] p-8 text-white relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl -mr-32 -mt-32"></div>
               <div className="relative z-10">
                 <div className="bg-blue-500 w-12 h-12 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-blue-500/30">
                   <PenTool size={24} />
                 </div>
                 <h3 className="text-2xl font-black mb-2 tracking-tight">Design & Consultation</h3>
                 <p className="text-blue-200/70 text-sm leading-relaxed mb-6">ผู้เชี่ยวชาญพร้อมให้คำปรึกษา ออกแบบระบบน้ำครบวงจรสำหรับบ้านและอาคาร</p>
                 <button className="bg-white text-blue-900 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-50 transition-colors">Start Design</button>
               </div>
            </div>
            
            <div className="flex-1 bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-sm group hover:border-blue-300 transition-all">
               <div className="bg-slate-100 w-12 h-12 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                 <Hammer size={24} />
               </div>
               <h3 className="text-2xl font-black mb-2 tracking-tight text-slate-900">Custom Installation</h3>
               <p className="text-slate-500 text-sm leading-relaxed mb-6">ทีมช่างมืออาชีพ ติดตั้งถังน้ำ ปั๊มน้ำ และตู้กดน้ำ มั่นใจในมาตรฐานงานสร้าง</p>
               <button className="bg-slate-900 text-white px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-800 transition-colors">Book Service</button>
            </div>

            <div className="flex-1 bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-sm group hover:border-blue-300 transition-all">
               <div className="bg-slate-100 w-12 h-12 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                 <ShieldCheck size={24} />
               </div>
               <h3 className="text-2xl font-black mb-2 tracking-tight text-slate-900">Maintenance Plan</h3>
               <p className="text-slate-500 text-sm leading-relaxed mb-6">บริการดูแลรักษา ล้างเครื่องกรองน้ำ และเช็คระบบน้ำรายปี เพื่อความปลอดภัย</p>
               <button className="bg-slate-900 text-white px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-800 transition-colors">Check Pricing</button>
            </div>
          </div>
        </section>

        {/* Flash Sale Section */}
        <FlashSale products={products} onProductClick={onProductClick} />

        {/* Featured Products Section with Modern Grid */}
        {featuredProducts.length > 0 && (
          <div className="container mx-auto px-4 py-8">
             <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                   <div className="p-2.5 bg-yellow-50 rounded-2xl text-yellow-500 shadow-sm border border-yellow-100">
                      <Star size={24} fill="currentColor" />
                   </div>
                   <div>
                     <h2 className="text-3xl font-black text-slate-900 tracking-tight">Highlight Selection</h2>
                     <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.3em] mt-1">Curated Build Essentials</p>
                   </div>
                </div>
                <button className="hidden md:flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors">
                  View Catalogue <Layout size={16} />
                </button>
             </div>
             
             <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {featuredProducts.map(product => (
                   <div 
                     key={product.id} 
                     onClick={() => onProductClick?.(product.id)}
                     className="group cursor-pointer bg-white rounded-[2rem] border border-slate-100 hover:border-blue-200 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 p-4"
                   >
                      <div className="aspect-square bg-slate-50 rounded-[1.5rem] overflow-hidden mb-4 relative p-4">
                         <img src={product.image} alt={product.name} className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-700" />
                         <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                            {product.tags?.slice(0, 1).map(tag => (
                              <span key={tag} className="bg-white/90 backdrop-blur px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest text-blue-600 shadow-sm border border-blue-50">{tag}</span>
                            ))}
                         </div>
                      </div>
                      <div className="px-1">
                        <h3 className="text-sm font-bold text-slate-800 line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors h-10 leading-tight">{product.name}</h3>
                        <div className="flex items-end gap-2">
                           <span className="text-xl font-black text-slate-900">฿{product.price.toLocaleString()}</span>
                           {product.originalPrice && <span className="text-xs text-slate-400 line-through mb-1">฿{product.originalPrice.toLocaleString()}</span>}
                        </div>
                      </div>
                   </div>
                ))}
             </div>
          </div>
        )}

        <CategorySection />
        
        {/* Recommended Products Grid */}
        <div className="container mx-auto px-4 py-12">
           <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">Recommended for Your Build</h2>
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.3em] mt-1">Based on industry standards</p>
              </div>
              <button className="text-xs font-black text-slate-400 hover:text-blue-600 uppercase tracking-widest transition-colors">Explore All</button>
           </div>
           
           <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
             {products.map((product) => (
                <div 
                    key={product.id} 
                    onClick={() => onProductClick?.(product.id)}
                    className="bg-white rounded-[2rem] border border-slate-100 hover:border-blue-200 hover:shadow-2xl transition-all duration-500 p-4 group cursor-pointer flex flex-col justify-between"
                >
                   <div>
                       <div className="relative mb-4 aspect-square bg-slate-50 rounded-[1.5rem] p-4 flex items-center justify-center">
                          <img src={product.image} alt={product.name} className="w-full h-full object-contain group-hover:scale-105 transition duration-500 mix-blend-multiply" />
                          {product.discount && (
                             <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-black px-2.5 py-1 rounded-bl-[1rem] rounded-tr-[1.5rem] shadow-sm">
                               -{product.discount}%
                             </span>
                          )}
                       </div>
                       <h3 className="text-slate-700 text-sm font-bold line-clamp-2 h-10 mb-2 leading-tight px-1">{product.name}</h3>
                       <div className="mb-4 px-1">
                          <span className="text-blue-600 text-lg font-black block">฿{product.price.toLocaleString()}</span>
                          {product.originalPrice && (
                            <span className="text-slate-400 text-xs line-through">฿{product.originalPrice.toLocaleString()}</span>
                          )}
                       </div>
                   </div>
                   <button className="w-full bg-slate-50 text-slate-900 hover:bg-blue-600 hover:text-white transition-all rounded-xl py-3 text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 active:scale-95 shadow-sm">
                      <ShoppingCart size={14} /> Add to Project
                   </button>
                </div>
             ))}
           </div>
        </div>
      </main>
      <Footer />
      
      {/* Mobile Sticky Navigation */}
      <div className="md:hidden fixed bottom-6 left-6 right-6 bg-slate-900/95 backdrop-blur-md rounded-2xl py-4 px-8 flex justify-between items-center z-[100] text-[10px] text-white/50 font-black uppercase tracking-widest shadow-2xl">
         <div className="flex flex-col items-center text-white">
            <Star size={20} fill="currentColor" className="mb-1 text-yellow-400" />
            <span>Home</span>
         </div>
         <div className="flex flex-col items-center">
            <Layout size={20} className="mb-1" />
            <span>Matrix</span>
         </div>
         <div className="flex flex-col items-center">
            <ShoppingCart size={20} className="mb-1" />
            <span>Project</span>
         </div>
      </div>
    </div>
  );
};
