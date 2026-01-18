
import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X, ChevronRight, Zap, Droplets, Wrench, Grid, HardHat, Lightbulb, FlaskConical, Database, Utensils, Snowflake, Gauge, Bath, Truck, Recycle, Waves, GlassWater, ArrowDownToLine, Filter, Box, ArrowLeft, Home, Phone, FileText, Edit2 } from 'lucide-react';
import { db } from '../services/mockDb';
import { Category } from '../types';
import { MegaMenuEditModal } from './admin/MegaMenuEditModal';

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
  'flask': <FlaskConical size={18} />,
  'database': <Database size={18} />,
  'utensils': <Utensils size={18} />,
  'snowflake': <Snowflake size={18} />,
  'gauge': <Gauge size={18} />,
  'bath': <Bath size={18} />,
  'truck': <Truck size={18} />,
  'recycle': <Recycle size={18} />,
  'waves': <Waves size={18} />,
  'glass-water': <GlassWater size={18} />,
  'arrow-down-to-line': <ArrowDownToLine size={18} />,
  'filter': <Filter size={18} />,
  'box': <Box size={18} />,
};

// Standard links for mobile view
const MOBILE_NAV_LINKS = [
  { label: 'หน้าแรก', icon: <Home size={18}/>, href: '#' },
  { label: 'สินค้าทั้งหมด', icon: <Box size={18}/>, href: '#' },
  { label: 'โปรโมชั่น', icon: <Zap size={18}/>, href: '#', isPromo: true },
  { label: 'บริการงานระบบ', icon: <Wrench size={18}/>, href: '#' },
  { label: 'บทความสาระน่ารู้', icon: <FileText size={18}/>, href: '#' },
  { label: 'ติดต่อเรา', icon: <Phone size={18}/>, href: '#' },
];

export const MegaMenu: React.FC<MegaMenuProps> = ({ isOpen, onClose }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategoryId, setActiveCategoryId] = useState<number>(1);
  const [showMobileDetail, setShowMobileDetail] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  
  // Parallax Ref
  const promoCardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCategories(db.getCategories());
  }, [isOpen, refreshKey]); // Refresh when menu opens or when manually refreshed
  
  // Parallax Effect & Scroll Lock
  useEffect(() => {
    const root = document.getElementById('root');
    if (isOpen) {
        // Lock Body Scroll
        document.body.style.overflow = 'hidden';
        
        // Apply 3D Parallax/Scale Effect to Root
        if (root) {
            root.style.transform = 'perspective(1500px) rotateX(1deg) scale(0.94) translateY(-10px)';
            root.style.transformOrigin = 'top center';
            root.style.transition = 'transform 0.5s cubic-bezier(0.32, 0.72, 0, 1), border-radius 0.5s, filter 0.5s';
            root.style.borderRadius = '24px';
            root.style.filter = 'brightness(0.85) blur(2px) contrast(0.95)';
            root.style.boxShadow = '0 50px 100px -20px rgba(0, 0, 0, 0.4)';
            root.style.overflow = 'hidden';
        }
    } else {
        document.body.style.overflow = '';
        if (root) {
            root.style.transform = '';
            root.style.transformOrigin = '';
            root.style.transition = 'transform 0.4s cubic-bezier(0.32, 0.72, 0, 1), border-radius 0.4s, filter 0.4s';
            root.style.borderRadius = '';
            root.style.filter = '';
            root.style.boxShadow = '';
            root.style.overflow = '';
        }
    }
    
    return () => {
        document.body.style.overflow = '';
        if (root) {
            root.style.transform = '';
            root.style.borderRadius = '';
            root.style.filter = '';
            root.style.boxShadow = '';
            root.style.overflow = '';
        }
    };
  }, [isOpen]);

  // Reset mobile view when closed
  useEffect(() => {
    if (!isOpen) {
        setShowMobileDetail(false);
    }
  }, [isOpen]);

  const handlePromoMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!promoCardRef.current) return;
    const { left, top, width, height } = promoCardRef.current.getBoundingClientRect();
    const x = (e.clientX - left) / width - 0.5;
    const y = (e.clientY - top) / height - 0.5;
    
    const img = promoCardRef.current.querySelector('img');
    if (img) {
      // Parallax movement: shift image opposite to mouse
      img.style.transform = `scale(1.1) translate(${x * -20}px, ${y * -20}px)`;
    }
  };

  const handlePromoMouseLeave = () => {
    if (!promoCardRef.current) return;
    const img = promoCardRef.current.querySelector('img');
    if (img) {
      img.style.transform = `scale(1.05)`;
    }
  };

  if (!isOpen) return null;

  // Use refreshKey to ensure we get updated data from db
  const activeCategory = db.getCategoryDetail(activeCategoryId);
  const displayCategory = activeCategory || db.getCategoryDetail(1);
  const currentCategoryObj = categories.find(c => c.id === activeCategoryId);

  const handleCategoryClick = (id: number) => {
    setActiveCategoryId(id);
    setShowMobileDetail(true);
  };

  const handleSaveEdit = () => {
    setRefreshKey(prev => prev + 1);
  };

  return createPortal(
    <div 
        className="fixed inset-0 z-[9999] flex justify-start md:justify-center md:items-start p-0 md:p-4 overflow-hidden h-[100dvh]" 
        id="mobile-navigation-drawer"
        role="dialog"
        aria-modal="true"
    >
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity duration-500" onClick={onClose} aria-hidden="true" />

      {/* Main Container - Drawer on Mobile, Modal on Desktop */}
      <div 
        className={`relative bg-white/98 backdrop-blur-xl w-[85vw] max-w-sm md:w-full md:max-w-7xl h-full md:h-auto md:max-h-[90vh] md:rounded-2xl shadow-2xl flex flex-col md:flex-row overflow-hidden animate-in slide-in-from-left duration-500 md:animate-in md:fade-in md:slide-in-from-top-4 ring-1 ring-black/5`}
      >
        
        {/* Left Sidebar (Category List) */}
        <div className={`w-full md:w-72 bg-gray-50/80 border-r border-gray-100/50 overflow-y-auto shrink-0 flex flex-col ${showMobileDetail ? 'hidden md:flex' : 'flex h-full md:h-auto'}`}>
          
          {/* Mobile Header */}
          <div className="p-4 flex justify-between items-center border-b border-gray-200 md:hidden bg-white sticky top-0 z-10 shadow-sm shrink-0">
            <span className="font-black text-[#0056b3] text-lg">เมนูหลัก</span>
            <button onClick={onClose} className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors" aria-label="Close menu"><X size={20} /></button>
          </div>

          <div className="overflow-y-auto flex-1 pb-safe no-scrollbar">
            {/* Mobile Standard Links */}
            <div className="md:hidden py-2 border-b border-gray-200 bg-white">
               {MOBILE_NAV_LINKS.map((link, idx) => (
                 <a 
                   key={idx} 
                   href={link.href}
                   className={`flex items-center gap-4 px-6 py-3.5 hover:bg-gray-50 transition-colors ${link.isPromo ? 'text-orange-500 font-bold' : 'text-gray-700 font-medium'}`}
                 >
                   <span className={link.isPromo ? 'text-orange-500' : 'text-gray-400'}>{link.icon}</span>
                   {link.label}
                 </a>
               ))}
            </div>

            <div className="px-6 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider bg-gray-50 md:bg-transparent sticky top-0 md:static">
               หมวดหมู่สินค้า
            </div>

            <nav className="py-2 pb-20 md:pb-2">
              {categories.map((cat, idx) => (
                <button 
                  key={cat.id} 
                  onMouseEnter={() => setActiveCategoryId(cat.id)}
                  onClick={() => handleCategoryClick(cat.id)}
                  onFocus={() => setActiveCategoryId(cat.id)}
                  className={`w-full flex items-center justify-between px-6 py-3.5 cursor-pointer transition-all duration-200 group outline-none focus:bg-white ${activeCategoryId === cat.id ? 'bg-white text-[#0056b3] font-bold border-y border-gray-100 md:border-transparent md:bg-white md:shadow-sm md:border-r-0 md:translate-x-0.5' : 'text-gray-600 hover:bg-white hover:text-[#0056b3]'}`}
                  aria-expanded={activeCategoryId === cat.id}
                  style={{ transitionDelay: `${idx * 20}ms` }}
                >
                  <div className="flex items-center gap-4">
                    <span className={`transition-transform duration-300 ${activeCategoryId === cat.id ? 'text-[#0056b3] scale-110' : 'text-gray-400 group-hover:text-[#0056b3]'}`}>
                      {cat.iconKey ? IconMap[cat.iconKey] : <Zap size={18} />}
                    </span>
                    <span className="text-sm text-left">{cat.name}</span>
                  </div>
                  <ChevronRight size={14} className={`transition-transform duration-300 ${activeCategoryId === cat.id ? 'text-[#0056b3] translate-x-1 opacity-100' : 'text-gray-300 opacity-50 group-hover:opacity-100'}`} />
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Right Content Area (Details) */}
        <div className={`flex-1 overflow-y-auto bg-white/60 relative flex flex-col ${showMobileDetail ? 'flex h-full animate-in slide-in-from-right duration-300' : 'hidden md:flex'}`}>
          
          {/* Mobile Detail Header (Back Button) */}
          <div className="md:hidden p-4 border-b flex items-center gap-3 sticky top-0 bg-white z-20 shadow-sm shrink-0">
             <button onClick={() => setShowMobileDetail(false)} className="p-2 hover:bg-gray-100 rounded-full text-gray-600 transition-colors" aria-label="Back to menu">
                <ArrowLeft size={20} />
             </button>
             <span className="font-bold text-gray-800 line-clamp-1">{displayCategory?.name || 'รายละเอียด'}</span>
             <button onClick={onClose} className="ml-auto p-2 hover:bg-gray-100 rounded-full text-gray-400 transition-colors" aria-label="Close">
                <X size={20} />
             </button>
          </div>

          {/* Desktop Close Button */}
          <button onClick={onClose} className="absolute top-6 right-6 text-gray-400 hover:text-gray-800 hidden md:block z-10 p-2 hover:bg-gray-100 rounded-full transition-colors" aria-label="Close menu">
            <X size={24} />
          </button>

          <div className="p-6 md:p-12 overflow-y-auto pb-safe">
            {displayCategory ? (
              <div key={displayCategory.id} className="flex flex-col lg:flex-row gap-12 animate-in fade-in slide-in-from-bottom-2 duration-500 pb-20 md:pb-0">
                <div className="flex-1">
                  <h3 className="text-2xl font-black text-gray-900 mb-8 border-b pb-6 flex items-center gap-3 hidden md:flex group">
                    <span className="bg-blue-600 p-2 rounded-xl text-white shadow-lg shadow-blue-200">
                        {IconMap[displayCategory.iconKey] || <Zap size={18} />}
                    </span> 
                    {displayCategory.name}
                    
                    <button 
                      onClick={() => setIsEditModalOpen(true)}
                      className="ml-2 text-gray-300 hover:text-blue-600 opacity-0 group-hover:opacity-100 transition-all p-2 hover:bg-blue-50 rounded-lg scale-90 hover:scale-100"
                      title="Edit Mega Menu Layout"
                    >
                      <Edit2 size={16} />
                    </button>
                  </h3>

                  {/* Highlight Icons/Photos */}
                  <div className={`grid gap-4 md:gap-6 mb-8 md:mb-12 ${
                    displayCategory.highlights.length <= 2 ? 'grid-cols-2' : 
                    displayCategory.highlights.length === 3 ? 'grid-cols-3' :
                    'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
                  }`}>
                    {displayCategory.highlights.map((item, i) => (
                      <div key={i} className="group cursor-pointer">
                        <div className="aspect-square rounded-2xl overflow-hidden mb-3 border border-gray-100 bg-white group-hover:border-blue-500/50 group-hover:ring-4 group-hover:ring-blue-50 transition-all duration-300 shadow-sm group-hover:shadow-lg relative">
                          {item.img ? (
                            <img src={item.img} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-300 bg-gray-50"><Zap size={24} /></div>
                          )}
                          <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors"></div>
                        </div>
                        <h4 className="font-bold text-center text-gray-800 text-xs uppercase tracking-wider group-hover:text-blue-600 transition-colors">{item.title}</h4>
                      </div>
                    ))}
                  </div>

                  {/* Sub-category Scannable List */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-8 md:gap-y-12">
                    {displayCategory.subCategories.map((sub, idx) => (
                      <div 
                        key={idx} 
                        className="space-y-3 md:space-y-5 animate-in slide-in-from-bottom-2 fade-in duration-500 fill-mode-backwards"
                        style={{ animationDelay: `${idx * 100}ms` }}
                      >
                        <h5 className="font-black text-gray-900 text-sm border-l-4 border-blue-600 pl-3 uppercase tracking-widest">{sub.title}</h5>
                        <ul className="space-y-2 text-[13px] text-gray-500 font-medium pl-1">
                          {sub.items.map((link, lIdx) => (
                            <li key={lIdx} className="hover:text-blue-600 hover:translate-x-1 cursor-pointer transition-all flex items-start gap-1.5 leading-relaxed py-0.5 group/item">
                              <span className="text-blue-200 mt-0.5 group-hover/item:text-blue-500 transition-colors">•</span> 
                              <a href="#" className="hover:underline decoration-blue-200 underline-offset-2">{link}</a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Side Promotion Card with Mouse Parallax */}
                <div className="w-full lg:w-96 shrink-0 h-fit mt-8 lg:mt-0">
                  <div 
                    ref={promoCardRef}
                    onMouseMove={handlePromoMouseMove}
                    onMouseLeave={handlePromoMouseLeave}
                    className="relative rounded-[2rem] overflow-hidden shadow-2xl shadow-blue-900/10 group border border-white/50 bg-gray-100 cursor-default"
                  >
                    <img 
                      src={displayCategory.promoImg || 'https://via.placeholder.com/300x400'} 
                      alt="Special Deal" 
                      className="w-full aspect-[3/4] object-cover transition-transform duration-200 ease-out scale-105" 
                      style={{ willChange: 'transform' }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-blue-900/90 via-blue-900/20 to-transparent p-6 md:p-10 flex flex-col justify-end pointer-events-none">
                      <div className="bg-yellow-400 text-blue-900 text-[10px] font-black px-4 py-1.5 rounded-full w-fit mb-4 uppercase tracking-tighter shadow-lg shadow-yellow-400/20 transform group-hover:-translate-y-1 transition-transform duration-300">Recommended by Expert</div>
                      <h3 className="text-white text-2xl md:text-3xl font-black mb-4 leading-tight drop-shadow-lg">Best Solution for Your Home</h3>
                      <p className="text-blue-50 text-sm mb-6 md:mb-8 leading-relaxed opacity-90 line-clamp-3 md:line-clamp-none drop-shadow-md">
                        {displayCategory.promoText}
                      </p>
                      <button className="bg-white text-blue-900 font-black py-3 md:py-4 px-8 rounded-2xl text-sm w-full transition-all shadow-xl hover:bg-yellow-400 hover:shadow-yellow-400/30 active:scale-95 pointer-events-auto">
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
      
      {currentCategoryObj && (
        <MegaMenuEditModal 
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          category={currentCategoryObj}
          onSave={handleSaveEdit}
        />
      )}
    </div>,
    document.body
  );
};
