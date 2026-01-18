
import React from 'react';
import { Page, PageBlock, Product } from '../types';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { AiAssistant } from '../components/AiAssistant';
import { db } from '../services/mockDb';
import { ArrowLeft, ShoppingCart } from 'lucide-react';

interface ContentPageProps {
  page: Page;
  onNavigate: () => void;
}

const BlockRenderer: React.FC<{ block: PageBlock }> = ({ block }) => {
  switch (block.type) {
    case 'hero':
      return (
        <div className="relative h-[400px] w-full overflow-hidden mb-8 rounded-2xl">
          <img src={block.data.image || 'https://via.placeholder.com/1200x400'} alt="Hero" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white text-center p-6">
             <h1 className="text-4xl md:text-5xl font-black mb-4">{block.data.title}</h1>
             <p className="text-lg md:text-xl mb-6 max-w-2xl opacity-90">{block.data.subtitle}</p>
             {block.data.buttonText && (
               <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold shadow-lg transition transform hover:scale-105">
                 {block.data.buttonText}
               </button>
             )}
          </div>
        </div>
      );
    
    case 'text':
      return (
        <div className="prose prose-blue max-w-4xl mx-auto my-8 p-4">
           <div dangerouslySetInnerHTML={{ __html: block.data.content }} />
        </div>
      );

    case 'grid':
      const cols = block.data.columns || 3;
      const gridClass = cols === 2 ? 'md:grid-cols-2' : cols === 4 ? 'md:grid-cols-4' : 'md:grid-cols-3';
      return (
          <div className="max-w-7xl mx-auto my-12 px-4">
              <div className={`grid grid-cols-1 ${gridClass} gap-8`}>
                  {block.data.items?.map((item: any, idx: number) => (
                      <div key={idx} className="flex flex-col items-start gap-4 p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
                          {item.image && (
                              <div className="w-16 h-16 rounded-xl bg-blue-50 flex items-center justify-center overflow-hidden shrink-0">
                                  <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                              </div>
                          )}
                          <div>
                              <h3 className="text-xl font-bold text-gray-800 mb-2">{item.title}</h3>
                              <p className="text-gray-600 leading-relaxed text-sm">{item.description}</p>
                          </div>
                      </div>
                  ))}
              </div>
          </div>
      );

    case 'product-row':
      // Mock fetching products
      const category = block.data.category === 'All' ? undefined : block.data.category;
      const products = db.getProducts()
        .filter(p => !category || p.category === category)
        .slice(0, block.data.count || 4);

      return (
        <div className="max-w-7xl mx-auto my-12 px-4">
           {block.data.title && <h2 className="text-2xl font-bold mb-6 text-gray-800 border-l-4 border-blue-600 pl-3">{block.data.title}</h2>}
           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {products.map(product => (
                 <div key={product.id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition">
                    <div className="aspect-square bg-gray-50 rounded-lg mb-3 overflow-hidden">
                       <img src={product.image} className="w-full h-full object-contain hover:scale-110 transition duration-500" alt={product.name}/>
                    </div>
                    <h3 className="font-bold text-sm text-gray-800 line-clamp-2 h-10 mb-2">{product.name}</h3>
                    <div className="flex justify-between items-end">
                       <span className="text-blue-600 font-black">฿{product.price.toLocaleString()}</span>
                       <button className="p-2 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-600 hover:text-white transition">
                          <ShoppingCart size={16} />
                       </button>
                    </div>
                 </div>
              ))}
           </div>
        </div>
      );

    case 'image':
      return (
        <div className="max-w-5xl mx-auto my-8 px-4">
           <figure className="rounded-2xl overflow-hidden shadow-lg">
              <img src={block.data.url} alt={block.data.alt} className="w-full h-auto" />
              {block.data.caption && <figcaption className="text-center text-sm text-gray-500 mt-2 italic">{block.data.caption}</figcaption>}
           </figure>
        </div>
      );

    case 'spacer':
      return <div style={{ height: block.data.height || 50 }} />;

    default:
      return null;
  }
};

export const ContentPage: React.FC<ContentPageProps> = ({ page, onNavigate }) => {
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
       <Header />
       <main className="container mx-auto px-4 py-8">
          <button onClick={onNavigate} className="flex items-center gap-2 text-gray-500 hover:text-blue-600 mb-6 transition font-medium">
             <ArrowLeft size={18} /> กลับหน้าหลัก
          </button>
          
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden min-h-[500px] p-6 md:p-12">
             {page.blocks.length === 0 ? (
               <div className="text-center py-20 text-gray-400">
                  <h1 className="text-3xl font-bold text-gray-300 mb-4">{page.title}</h1>
                  <p>This page has no content yet.</p>
               </div>
             ) : (
               <div className="space-y-4">
                  {page.blocks.map(block => (
                    <BlockRenderer key={block.id} block={block} />
                  ))}
               </div>
             )}
          </div>
       </main>
       <AiAssistant />
       <Footer />
    </div>
  );
};
