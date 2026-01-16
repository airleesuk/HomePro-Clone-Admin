
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { X, ChevronRight, Zap, Droplets, Wrench, Grid, HardHat, Lightbulb, Snowflake, Filter, ArrowDownUp, Truck } from 'lucide-react';
import { db, CATEGORIES } from '../services/mockDb';

interface MegaMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const IconMap: Record<string, React.ReactNode> = {
  'zap': <Zap size={18} />,
  'droplets': <Droplets size={18} />,
  'wrench': <Wrench size={18} />,
  'grid': <Grid size={18} />,
  'hard-hat': <HardHat size={18} />,
  'lightbulb': <Lightbulb size={18} />,
  'snowflake': <Snowflake size={18} />,
  'truck': <Truck size={18} />,
};

export const MegaMenu: React.FC<MegaMenuProps> = ({ isOpen, onClose }) => {
  const [activeCategoryId, setActiveCategoryId] = useState<number>(1);
  const [filterType, setFilterType] = useState<string>('all');
  const menuRef = useRef<HTMLDivElement>(null);
  const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);
  
  // Focus management: when opened, focus the menu
  useEffect(() => {
    if (isOpen && menuRef.current) {
      menuRef.current.focus();
    }
  }, [isOpen]);

  // Filter and Sort Logic
  const processedCategories = useMemo(() => {
    const products = db.getProducts();
    let result = [...CATEGORIES];

    const getCatProducts = (catName: string) => products.filter(p => p.category === catName);

    if (filterType === 'onsale') {
      // Filter categories containing items on sale
      result = result.filter(cat => {
        const catProducts = getCatProducts(cat.name);
        return catProducts.some(p => p.isFlashSale || (p.discount && p.discount > 0));
      });
    } else if (filterType === 'newest') {
      // Sort categories by the ID of the newest product (assuming higher ID is newer)
      result.sort((a, b) => {
        const prodA = getCatProducts(a.name);
        const prodB = getCatProducts(b.name);
        const maxIdA = prodA.length ? Math.max(...prodA.map(p => p.id)) : 0;
        const maxIdB = prodB.length ? Math.max(...prodB.map(p => p.id)) : 0;
        return maxIdB - maxIdA;
      });
    } else if (filterType === 'bestseller') {
      // Sort categories by total sales volume
      result.sort((a, b) => {
        const prodA = getCatProducts(a.name);
        const prodB = getCatProducts(b.name);
        const soldA = prodA.reduce((sum, p) => sum + p.sold, 0);
        const soldB = prodB.reduce((sum, p) => sum + p.sold, 0);
        return soldB - soldA;
      });
    }
    
    return result;
  }, [filterType]);

  // Ensure active category is valid after filter change
  useEffect(() => {
    if (processedCategories.length > 0) {
      const exists = processedCategories.find(c => c.id === activeCategoryId);
      if (!exists) {
        setActiveCategoryId(processedCategories[0].id);
      }
    } else {
      setActiveCategoryId(0); // No categories match
    }
  }, [processedCategories, activeCategoryId]);
  
  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const nextIndex = (index + 1) % processedCategories.length;
      tabsRef.current[nextIndex]?.focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prevIndex = (index - 1 + processedCategories.length) % processedCategories.length;
      tabsRef.current[prevIndex]?.focus();
    } else if (e.key === 'Home') {
      e.preventDefault();
      tabsRef.current[0]?.focus();
    } else if (e.key === 'End') {
      e.preventDefault();
      tabsRef.current[processedCategories.length - 1]?.focus();
    }
  };

  if (!isOpen) return null;

  const activeCategory = db.getCategoryDetail(activeCategoryId);
  const displayCategory = activeCategoryId !== 0 ? (activeCategory || db.getCategoryDetail(1)) : null;

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-start justify-center p-0 md:p-4 overflow-hidden"
      role="dialog"
      aria-modal="true"
      aria-label="Product Categories Menu"
    >
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" 
        onClick={onClose} 
        aria-hidden="true"
      />

      <div 
        ref={menuRef}
        className="relative bg-white w-full max-w-7xl h-full md:h-auto md:max-h-[90vh] rounded-none md:rounded-2xl shadow-2xl flex flex-col md:flex-row overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300 outline-none"
        tabIndex={-1}
      >
        
        {/* Left Sidebar */}
        <div className="w-full md:w-72 bg-gray-50 border-r border-gray-100 overflow-y-auto shrink-0 flex flex-col">
          <div className="p-6 flex justify-between items-center border-b border-gray-200 md:hidden">
            <span className="font-bold text-[#0056b3]">หมวดหมู่ทั้งหมด</span>
            <button 
              onClick={onClose}
              className="p-1 hover:bg-gray-200 rounded-full transition-colors"
              aria-label="Close menu"
            >
              <X size={24} />
            </button>
          </div>

          {/* Filter Bar */}
          <div className="px-5 py-3 border-b border-gray-200/50 bg-white sticky top-0 z-10 flex items-center gap-2">
            <Filter size={14} className="text-gray-400 shrink-0" />
            <select 
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full text-xs font-bold text-gray-600 bg-transparent outline-none cursor-pointer hover:text-blue-600 transition-colors py-1"
              aria-label="Filter categories"
            >
              <option value="all">หมวดหมู่ทั้งหมด</option>
              <option value="newest">สินค้ามาใหม่ 🔥</option>
              <option value="bestseller">ขายดียอดนิยม 🏆</option>
              <option value="onsale">กำลังลดราคา 🏷️</option>
            </select>
          </div>

          <div 
            className="py-2 flex-1" 
            role="tablist" 
            aria-orientation="vertical"
            aria-label="Product Categories"
          >
            {processedCategories.length > 0 ? (
              processedCategories.map((cat, index) => (
                <button 
                  key={cat.id} 
                  ref={el => { tabsRef.current[index] = el; }}
                  role="tab"
                  aria-selected={activeCategoryId === cat.id}
                  aria-controls="category-panel"
                  id={`category-tab-${cat.id}`}
                  tabIndex={activeCategoryId === cat.id ? 0 : -1}
                  onMouseEnter={() => setActiveCategoryId(cat.id)}
                  onClick={() => setActiveCategoryId(cat.id)}
                  onFocus={() => setActiveCategoryId(cat.id)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  className={`w-full flex items-center justify-between px-6 py-4 cursor-pointer transition-all group outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 ${activeCategoryId === cat.id ? 'bg-white text-[#0056b3] font-bold border-y border-gray-100 shadow-sm' : 'text-gray-600 hover:bg-white hover:text-[#0056b3]'}`}
                >
                  <div className="flex items-center gap-4 w-full">
                    <span className="w-8 h-8 rounded-md overflow-hidden bg-white border border-gray-100 p-0.5 shrink-0">
                      {cat.icon ? (
                        <img src={cat.icon} className="w-full h-full object-contain" alt="" />
                      ) : (
                        <span className={`${activeCategoryId === cat.id ? 'text-[#0056b3]' : 'text-gray-400 group-hover:text-[#0056b3]'}`}>
                          {cat.iconKey ? IconMap[cat.iconKey] : <Zap size={18} />}
                        </span>
                      )}
                    </span>
                    <span className="text-sm line-clamp-1 text-left flex-1">{cat.name}</span>
                  </div>
                  <ChevronRight size={14} className={`shrink-0 transition-transform duration-200 ${activeCategoryId === cat.id ? 'text-[#0056b3] translate-x-1' : 'text-gray-300'}`} />
                </button>
              ))
            ) : (
              <div className="p-8 text-center text-gray-400 text-xs">
                 <p>ไม่พบหมวดหมู่ตามเงื่อนไข</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Content Area */}
        <div 
          className="flex-1 overflow-y-auto bg-white p-6 md:p-12 relative"
          role="tabpanel"
          id="category-panel"
          aria-labelledby={`category-tab-${activeCategoryId}`}
        >
          <button 
            onClick={onClose} 
            className="absolute top-8 right-8 text-gray-400 hover:text-gray-600 hidden md:block focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg p-1"
            aria-label="Close menu"
          >
            <X size={32} />
          </button>

          {displayCategory ? (
            <div key={displayCategory.id} className="flex flex-col lg:flex-row gap-12 animate-in fade-in duration-500">
              <div className="flex-1">
                <h3 className="text-2xl font-black text-gray-900 mb-8 border-b pb-6 flex items-center gap-3">
                   <div className="w-12 h-12 p-1 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
                      {displayCategory.promoImg ? (
                         <img src={displayCategory.promoImg} alt="" className="w-full h-full object-contain mix-blend-multiply" />
                      ) : (
                         <span className="text-blue-600">
                            {IconMap[displayCategory.iconKey] || <Zap size={24} />}
                         </span>
                      )}
                   </div>
                   {displayCategory.name}
                </h3>

                {/* Highlight Icons/Photos (if any) */}
                {displayCategory.highlights && displayCategory.highlights.length > 0 && (
                  <div className="grid grid-cols-3 gap-6 mb-12">
                    {displayCategory.highlights.map((item, i) => (
                      <a href="#" key={i} className="group cursor-pointer block focus:outline-none focus:ring-4 focus:ring-blue-100 rounded-2xl" role="link">
                        <div className="aspect-square rounded-2xl overflow-hidden mb-3 border-2 border-transparent group-hover:border-blue-500 transition-all shadow-sm bg-gray-50 flex items-center justify-center p-2">
                          <img src={item.img} alt="" className="w-full h-full object-contain group-hover:scale-110 transition duration-700" />
                        </div>
                        <h4 className="font-bold text-center text-gray-800 text-xs uppercase tracking-wider">{item.title}</h4>
                      </a>
                    ))}
                  </div>
                )}

                {/* Sub-category Scannable List */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-12">
                  {displayCategory.subCategories.map((sub, idx) => (
                    <div key={idx} className="space-y-5">
                      <h5 className="font-black text-gray-900 text-sm border-l-4 border-blue-600 pl-3 uppercase tracking-widest">{sub.title}</h5>
                      <ul className="space-y-2.5 text-[13px] text-gray-500 font-medium">
                        {sub.items.map((link, lIdx) => (
                          <li key={lIdx}>
                            <a 
                              href="#" 
                              className="hover:text-blue-600 hover:translate-x-1 cursor-pointer transition-all flex items-start gap-1.5 leading-relaxed focus:outline-none focus:text-blue-600 focus:translate-x-1"
                            >
                               <span className="text-blue-300 mt-0.5" aria-hidden="true">•</span> {link}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              {/* Side Promotion Card */}
              <div className="w-full lg:w-96 shrink-0 h-fit">
                <div className="relative rounded-3xl overflow-hidden shadow-2xl group border border-gray-100 bg-white">
                  <div className="w-full aspect-[3/4] p-8 flex items-center justify-center bg-gradient-to-b from-blue-50 to-white">
                     <img src={displayCategory.promoImg} alt="Special Deal" className="w-full h-full object-contain group-hover:scale-105 transition duration-1000 drop-shadow-xl" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-900/95 via-blue-900/40 to-transparent p-10 flex flex-col justify-end">
                    <div className="bg-yellow-400 text-blue-900 text-[10px] font-black px-4 py-1.5 rounded-full w-fit mb-4 uppercase tracking-tighter">สินค้าแนะนำ</div>
                    <h3 className="text-white text-3xl font-black mb-4 leading-tight">{displayCategory.name}</h3>
                    <p className="text-blue-50 text-sm mb-8 leading-relaxed opacity-90 line-clamp-3">
                      {displayCategory.promoText}
                    </p>
                    <button className="bg-white text-blue-900 font-black py-4 px-8 rounded-2xl text-sm w-full transition-all shadow-xl hover:bg-yellow-400 active:scale-95 focus:outline-none focus:ring-4 focus:ring-white/50">
                      ดูสินค้าทั้งหมด
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
             <div className="flex flex-col items-center justify-center h-full text-gray-400 animate-in fade-in">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <Grid size={32} className="opacity-50" />
                </div>
                <p>กรุณาเลือกหมวดหมู่ที่สนใจจากเมนูด้านซ้าย</p>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};
