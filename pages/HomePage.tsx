import React, { useEffect, useState } from 'react';
import { Header } from '../components/Header';
import { Hero } from '../components/Hero';
import { FlashSale } from '../components/FlashSale';
import { CategorySection } from '../components/CategorySection';
import { Footer } from '../components/Footer';
import { db } from '../services/mockDb';
import { Product } from '../types';

export const HomePage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    // Simulate loading data from DB
    setProducts(db.getProducts());
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Header />
      <main>
        <Hero />
        <FlashSale products={products} />
        <CategorySection />
        
        {/* Recommended Products Section */}
        <div className="container mx-auto px-4 py-10">
           <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-[#0056b3]">สินค้าแนะนำสำหรับคุณ</h2>
              <button className="text-gray-500 hover:text-[#0056b3]">ดูทั้งหมด</button>
           </div>
           <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
             {products.map((product) => (
                <div key={product.id} className="bg-white rounded-lg border hover:shadow-xl transition-all p-4 group cursor-pointer">
                   <div className="relative mb-3">
                      <img src={product.image} alt={product.name} className="w-full h-40 object-contain group-hover:scale-105 transition duration-300" />
                      {product.discount && (
                         <span className="absolute top-0 right-0 bg-red-100 text-red-600 text-xs font-bold px-2 py-1 rounded">
                           -{product.discount}%
                         </span>
                      )}
                   </div>
                   <h3 className="text-gray-700 text-sm font-medium line-clamp-2 h-10 mb-2">{product.name}</h3>
                   <div className="mb-2">
                      <span className="text-[#0056b3] text-lg font-bold block">฿{product.price.toLocaleString()}</span>
                      {product.originalPrice && (
                        <span className="text-gray-400 text-xs line-through">฿{product.originalPrice.toLocaleString()}</span>
                      )}
                   </div>
                   <button className="w-full border border-[#0056b3] text-[#0056b3] hover:bg-[#0056b3] hover:text-white transition rounded py-1.5 text-sm font-medium">
                      ใส่ตะกร้า
                   </button>
                </div>
             ))}
           </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};