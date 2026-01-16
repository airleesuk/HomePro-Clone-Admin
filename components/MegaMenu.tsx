
import React, { useState } from 'react';
import { X, ChevronRight, Zap, Droplets, Wrench, Grid, HardHat, Lightbulb } from 'lucide-react';
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
};

export const MegaMenu: React.FC<MegaMenuProps> = ({ isOpen, onClose }) => {
  const [activeCategoryId, setActiveCategoryId] = useState<number>(1);
  
  if (!isOpen) return null;

  const activeCategory = db.getCategoryDetail(activeCategoryId);
  // Fallback to first if not found, or handle empty state
  const displayCategory = activeCategory || db.getCategoryDetail(1);

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center p-0 md:p-4 overflow-hidden">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" onClick={onClose} />

      <div className="relative bg-white w-full max-w-7xl h-full md:h-auto md:max-h-[90vh] rounded-none md:rounded-2xl shadow-2xl flex flex-col md:flex-row overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300">
        
        {/* Left Sidebar */}
        <div className="w-full md:w-72 bg-gray-50 border-r border-gray-100 overflow-y-auto shrink-0">
          <div className="p-6 flex justify-between items-center border-b border-gray-200 md:hidden">
            <span className="font-bold text-[#0056b3]">หมวดหมู่ทั้งหมด</span>
            <button onClick={onClose}><X size={24} /></button>
          </div>
          <nav className="py-2">
            {CATEGORIES.map((cat) => (
              <div 
                key={cat.id} 
                onMouseEnter={() => setActiveCategoryId(cat.id)}
                className={`flex items-center justify-between px-6 py-4 cursor-pointer transition-all group ${activeCategoryId === cat.id ? 'bg-white text-[#0056b3] font-bold border-y border-gray-100 shadow-sm' : 'text-gray-600 hover:bg-white hover:text-[#0056b3]'}`}
              >
                <div className="flex items-center gap-4">
                  <span className={`${activeCategoryId === cat.id ? 'text-[#0056b3]' : 'text-gray-400 group-hover:text-[#0056b3]'}`}>
                    {cat.iconKey ? IconMap[cat.iconKey] : <Zap size={18} />}
                  </span>
                  <span className="text-sm">{cat.name}</span>
                </div>
                <ChevronRight size={14} className={`transition-transform duration-200 ${activeCategoryId === cat.id ? 'text-[#0056b3] translate-x-1' : 'text-gray-300'}`} />
              </div>
            ))}
          </nav>
        </div>

        {/* Right Content Area */}
        <div className="flex-1 overflow-y-auto bg-white p-6 md:p-12 relative">
          <button onClick={onClose} className="absolute top-8 right-8 text-gray-400 hover:text-gray-600 hidden md:block">
            <X size={32} />
          </button>

          {displayCategory ? (
            <div key={displayCategory.id} className="flex flex-col lg:flex-row gap-12 animate-in fade-in duration-500">
              <div className="flex-1">
                <h3 className="text-2xl font-black text-gray-900 mb-8 border-b pb-6 flex items-center gap-3">
                   <span className="bg-blue-600 p-2 rounded-lg text-white">
                      {IconMap[displayCategory.iconKey] || <Zap size={18} />}
                   </span> 
                   {displayCategory.name}
                </h3>

                {/* Highlight Icons/Photos */}
                <div className="grid grid-cols-3 gap-6 mb-12">
                  {displayCategory.highlights.map((item, i) => (
                    <div key={i} className="group cursor-pointer">
                      <div className="aspect-square rounded-2xl overflow-hidden mb-3 border-2 border-transparent group-hover:border-blue-500 transition-all shadow-sm">
                        <img src={item.img} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" />
                      </div>
                      <h4 className="font-bold text-center text-gray-800 text-xs uppercase tracking-wider">{item.title}</h4>
                    </div>
                  ))}
                </div>

                {/* Sub-category Scannable List - 4 COLUMNS ON DESKTOP */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-12">
                  {displayCategory.subCategories.map((sub, idx) => (
                    <div key={idx} className="space-y-5">
                      <h5 className="font-black text-gray-900 text-sm border-l-4 border-blue-600 pl-3 uppercase tracking-widest">{sub.title}</h5>
                      <ul className="space-y-2.5 text-[13px] text-gray-500 font-medium">
                        {sub.items.map((link, lIdx) => (
                          <li key={lIdx} className="hover:text-blue-600 hover:translate-x-1 cursor-pointer transition-all flex items-start gap-1.5 leading-relaxed">
                             <span className="text-blue-300 mt-0.5">•</span> {link}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              {/* Side Promotion Card */}
              <div className="w-full lg:w-96 shrink-0 h-fit">
                <div className="relative rounded-3xl overflow-hidden shadow-2xl group border border-gray-100">
                  <img src={displayCategory.promoImg} alt="Special Deal" className="w-full aspect-[3/4] object-cover group-hover:scale-105 transition duration-1000" />
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-900/95 via-blue-900/40 to-transparent p-10 flex flex-col justify-end">
                    <div className="bg-yellow-400 text-blue-900 text-[10px] font-black px-4 py-1.5 rounded-full w-fit mb-4 uppercase tracking-tighter">Recommended by Expert</div>
                    <h3 className="text-white text-3xl font-black mb-4 leading-tight">Best Solution for Your Home</h3>
                    <p className="text-blue-50 text-sm mb-8 leading-relaxed opacity-90">
                      {displayCategory.promoText}
                    </p>
                    <button className="bg-white text-blue-900 font-black py-4 px-8 rounded-2xl text-sm w-full transition-all shadow-xl hover:bg-yellow-400 active:scale-95">
                      VIEW PRODUCTS
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
             <div className="flex items-center justify-center h-96 text-gray-400">
                <p>เลือกหมวดหมู่เพื่อดูรายละเอียด</p>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};
