
import React, { useState, useEffect, useMemo } from 'react';
import { db, CATEGORIES } from '../services/mockDb';
import { Product, ProductVariant, AdminNotification } from '../types';
import { CategoryManager } from '../components/admin/CategoryManager';
import { BrandManager } from '../components/admin/BrandManager';
import { ImageManager } from '../components/admin/ImageManager';
import { BannerManager } from '../components/admin/BannerManager';
import { PageBuilder } from '../components/admin/PageBuilder';
import { 
  Package, Settings, Plus, Trash2, Edit, Save, X, Search, 
  ChevronLeft, ChevronRight, ArrowUpDown, ArrowUp, ArrowDown, 
  Filter, Zap, Layers, Star, 
  AlertCircle, XCircle, Bell, Grid as GridIcon, Tag,
  ZapOff, StarOff, Layout, FileText, Image as ImageIcon,
  PenTool, Mail, FormInput, FileBox, AlignLeft, Menu, Briefcase
} from 'lucide-react';

export const AdminPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'products' | 'categories' | 'brands' | 'settings' | 'banners' | 'templates' | 'layouts' | 'pagebuilder' | 'blocks' | 'content' | 'forms' | 'emails'>('products');
  
  // Data State
  const [products, setProducts] = useState<Product[]>([]);
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  
  // UI State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Filter & Search State
  const [productSearchQuery, setProductSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [stockFilter, setStockFilter] = useState<'all' | 'low' | 'out' | 'in'>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | 'flash' | 'featured' | 'normal'>('all');
  const [brandFilter, setBrandFilter] = useState<string>('all');
  
  // Pagination State
  const [productPage, setProductPage] = useState(1);
  const itemsPerPage = 10;
  
  // Sorting State
  const [sortConfig, setSortConfig] = useState<{ key: keyof Product; direction: 'asc' | 'desc' } | null>(null);

  // Bulk Action State
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  // Form State
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    price: 0,
    originalPrice: 0,
    category: '',
    stock: 0,
    discount: 0,
    isFlashSale: false,
    isFeatured: false,
    image: '',
    images: [],
    variants: [],
    brandId: undefined
  });

  const [variantErrors, setVariantErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    refreshData();
  }, []);

  useEffect(() => {
    generateNotifications();
  }, [products]);

  useEffect(() => {
    setProductPage(1);
  }, [productSearchQuery, selectedCategory, stockFilter, typeFilter, brandFilter]);

  const refreshData = () => {
    setProducts([...db.getProducts()]);
  };

  const generateNotifications = () => {
    const newNotifications: AdminNotification[] = [];
    
    // Check low stock
    products.forEach(p => {
      if (p.stock < 5) {
        newNotifications.push({
          id: `low-stock-${p.id}`,
          title: 'สินค้าใกล้หมด',
          message: `${p.name} เหลือเพียง ${p.stock} ชิ้น`,
          type: 'warning',
          timestamp: new Date()
        });
      }
    });

    setNotifications(newNotifications);
  };

  const requestSort = (key: keyof Product) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key: keyof Product) => {
    if (!sortConfig || sortConfig.key !== key) {
      return <ArrowUpDown size={14} className="text-gray-400" />;
    }
    return sortConfig.direction === 'asc' ? <ArrowUp size={14} className="text-blue-600" /> : <ArrowDown size={14} className="text-blue-600" />;
  };

  const processedProducts = useMemo(() => {
    let result = products.filter(product => {
      const searchLower = productSearchQuery.toLowerCase().trim();
      const matchesSearch = 
        product.name.toLowerCase().includes(searchLower) ||
        product.category.toLowerCase().includes(searchLower) ||
        product.id.toString().includes(searchLower);
        
      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;

      const matchesStock = 
        stockFilter === 'all' ? true :
        stockFilter === 'low' ? product.stock > 0 && product.stock < 5 :
        stockFilter === 'out' ? product.stock === 0 :
        stockFilter === 'in' ? product.stock >= 5 : true;

      const matchesType = 
        typeFilter === 'all' ? true :
        typeFilter === 'flash' ? product.isFlashSale :
        typeFilter === 'featured' ? product.isFeatured :
        typeFilter === 'normal' ? !product.isFlashSale && !product.isFeatured : true;

      const matchesBrand = 
        brandFilter === 'all' ? true :
        product.brandId?.toString() === brandFilter;

      return matchesSearch && matchesCategory && matchesStock && matchesType && matchesBrand;
    });

    if (sortConfig !== null) {
      result.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        if (aValue === undefined || bValue === undefined) return 0;
        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return result;
  }, [products, productSearchQuery, selectedCategory, stockFilter, typeFilter, brandFilter, sortConfig]);

  const indexOfLastItem = productPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = processedProducts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(processedProducts.length / itemsPerPage);

  const handleSelectAllOnPage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const currentPageIds = currentProducts.map(p => p.id);
    if (e.target.checked) {
      const newSelection = Array.from(new Set([...selectedIds, ...currentPageIds]));
      setSelectedIds(newSelection);
    } else {
      setSelectedIds(selectedIds.filter(id => !currentPageIds.includes(id)));
    }
  };

  const isAllOnPageSelected = currentProducts.length > 0 && currentProducts.every(p => selectedIds.includes(p.id));
  const isSomeOnPageSelected = currentProducts.some(p => selectedIds.includes(p.id)) && !isAllOnPageSelected;

  const handleDelete = (id: number) => {
    if (confirm('คุณแน่ใจหรือไม่ที่จะลบสินค้านี้?')) {
      db.deleteProduct(id);
      setSelectedIds(selectedIds.filter(sid => sid !== id));
      refreshData();
    }
  };

  const handleBulkDelete = () => {
    if (!confirm(`ยืนยันการลบสินค้า ${selectedIds.length} รายการที่เลือกไว้? การกระทำนี้ไม่สามารถย้อนกลับได้`)) return;
    selectedIds.forEach(id => db.deleteProduct(id));
    setSelectedIds([]);
    refreshData();
  };

  const handleBulkUpdate = (updates: Partial<Product>, actionName: string) => {
    if (!confirm(`ยืนยันการ "${actionName}" สำหรับสินค้า ${selectedIds.length} รายการ?`)) return;

    const allProducts = db.getProducts();
    selectedIds.forEach(id => {
      const product = allProducts.find(p => p.id === id);
      if (product) {
        db.updateProduct({ ...product, ...updates });
      }
    });

    refreshData();
    setSelectedIds([]);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    const variants = product.variants || [];
    
    // Normalize variants to have an images array if missing
    const normalizedVariants = variants.map(v => ({
      ...v,
      images: v.images || (v.image ? [v.image] : [])
    }));

    const price = variants.length > 0
      ? Math.min(...variants.map(v => Number(v.price) || Infinity))
      : product.price;

    const totalStock = variants.length > 0
      ? variants.reduce((sum, v) => sum + (Number(v.stock) || 0), 0)
      : product.stock;

    // Ensure main product images exist
    const mainImages = product.images && product.images.length > 0 
      ? product.images 
      : (product.image ? [product.image] : []);

    setFormData({ 
      ...product, 
      images: mainImages,
      image: mainImages[0] || '', // Sync single image for backward compat
      variants: normalizedVariants,
      stock: totalStock,
      price: price === Infinity ? product.price : price
    });
    setVariantErrors({});
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setEditingProduct(null);
    setFormData({
       name: '',
       price: 0,
       originalPrice: 0,
       category: CATEGORIES[0].name,
       stock: 10,
       image: '',
       images: [],
       sold: 0,
       discount: 0,
       isFlashSale: false,
       isFeatured: false,
       variants: [],
       brandId: undefined
    });
    setVariantErrors({});
    setIsModalOpen(true);
  };

  const validateUniqueNames = (variants: ProductVariant[]) => {
    const errors: Record<string, string> = {};
    const nameCount: Record<string, number> = {};
    
    variants.forEach(v => {
      const name = v.name.trim().toLowerCase();
      if (name) {
        nameCount[name] = (nameCount[name] || 0) + 1;
      }
    });

    variants.forEach(v => {
      const name = v.name.trim().toLowerCase();
      if (name && nameCount[name] > 1) {
        errors[v.id] = 'ชื่อตัวเลือกนี้ซ้ำกัน กรุณาแก้ไข';
      } else {
        errors[v.id] = '';
      }
    });
    setVariantErrors(errors);
    return errors;
  };

  const updateMainDataFromVariants = (variants: ProductVariant[]) => {
    const totalStock = variants.reduce((sum, v) => sum + (Number(v.stock) || 0), 0);
    const validPrices = variants.map(v => Number(v.price) || Infinity).filter(p => p !== Infinity);
    const minVariantPrice = validPrices.length > 0 ? Math.min(...validPrices) : (formData.price || 0);

    return { totalStock, minVariantPrice };
  };

  const handleAddVariant = () => {
    const newVariant: ProductVariant = {
      id: Math.random().toString(36).substr(2, 9),
      name: '',
      price: formData.price || 0,
      stock: 0,
      image: '',
      images: []
    };
    const updatedVariants = [...(formData.variants || []), newVariant];
    const { totalStock, minVariantPrice } = updateMainDataFromVariants(updatedVariants);

    validateUniqueNames(updatedVariants);
    setFormData({
      ...formData,
      variants: updatedVariants,
      stock: totalStock,
      price: minVariantPrice
    });
  };

  const handleUpdateVariant = (id: string, field: keyof ProductVariant, value: string | number | string[]) => {
    const updatedVariants = (formData.variants || []).map(v => {
      if (v.id !== id) return v;

      // Special handling for images array
      if (field === 'images') {
        const newImages = value as string[];
        return {
          ...v,
          images: newImages,
          image: newImages[0] || '' // Sync primary
        };
      }

      return { ...v, [field]: value };
    });
    
    const { totalStock, minVariantPrice } = updateMainDataFromVariants(updatedVariants);

    if (field === 'name') {
      validateUniqueNames(updatedVariants);
    }

    setFormData({
      ...formData,
      variants: updatedVariants,
      stock: totalStock,
      price: minVariantPrice
    });
  };

  const handleRemoveVariant = (id: string) => {
    const updatedVariants = (formData.variants || []).filter(v => v.id !== id);
    const { totalStock, minVariantPrice } = updateMainDataFromVariants(updatedVariants);
    
    validateUniqueNames(updatedVariants);
    setFormData({
      ...formData,
      variants: updatedVariants,
      stock: totalStock,
      price: minVariantPrice
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validateUniqueNames(formData.variants || []);
    if (Object.values(errors).some(err => err !== '')) {
      alert('ไม่สามารถบันทึกได้เนื่องจากมีชื่อตัวเลือกที่ซ้ำกัน');
      return;
    }

    const finalProduct = {
      ...formData,
      image: formData.images?.[0] || formData.image || '', // Ensure consistency
      brandId: formData.brandId ? Number(formData.brandId) : undefined
    } as Product;

    if (editingProduct) {
      db.updateProduct({ ...editingProduct, ...finalProduct });
    } else {
      db.addProduct({ ...finalProduct, sold: 0 });
    }
    setIsModalOpen(false);
    refreshData();
  };

  const hasVariants = formData.variants && formData.variants.length > 0;

  const NavItem = ({ id, label, icon: Icon }: any) => (
    <button 
      onClick={() => setActiveTab(id)} 
      className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition text-left text-sm font-medium ${activeTab === id ? 'bg-blue-800 text-white shadow-inner' : 'text-gray-300 hover:bg-blue-800 hover:text-white'}`}
    >
      <Icon size={18} /> {label}
    </button>
  );

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-[#1a237e] text-white flex flex-col hidden md:flex shrink-0">
        <div className="p-6 text-2xl font-bold tracking-wider border-b border-blue-800">
          Admin<span className="text-orange-400">Panel</span>
        </div>
        <nav className="flex-1 p-4 space-y-6 overflow-y-auto no-scrollbar">
          
          <div className="space-y-1">
             <div className="px-4 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">E-Commerce</div>
             <NavItem id="products" label="รายการสินค้า" icon={Package} />
             <NavItem id="brands" label="แบรนด์สินค้า" icon={Tag} />
          </div>

          <div className="space-y-1">
             <div className="px-4 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Design & CMS</div>
             <NavItem id="templates" label="Templates" icon={Layout} />
             <NavItem id="layouts" label="Layouts" icon={Layers} />
             <NavItem id="pagebuilder" label="Page Builder" icon={PenTool} />
             <NavItem id="blocks" label="Blocks" icon={FileBox} />
             <NavItem id="categories" label="Menu" icon={Menu} />
             <NavItem id="content" label="Content" icon={FileText} />
             <NavItem id="banners" label="Banner Manager" icon={ImageIcon} />
          </div>

          <div className="space-y-1">
             <div className="px-4 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Marketing</div>
             <NavItem id="forms" label="Forms Manager" icon={FormInput} />
             <NavItem id="emails" label="Email Templates" icon={Mail} />
          </div>

          <div className="space-y-1">
             <div className="px-4 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">System</div>
             <NavItem id="settings" label="ตั้งค่าระบบ" icon={Settings} />
          </div>

        </nav>
      </aside>

      <main className="flex-1 overflow-y-auto relative pb-24 no-scrollbar">
        {/* Universal Header */}
        <header className="bg-white shadow-sm px-4 md:px-8 py-4 flex justify-between items-center sticky top-0 z-30">
          <div>
            <h1 className="text-xl font-bold text-gray-800 capitalize">
               {activeTab === 'categories' ? 'Menu / Categories' : activeTab === 'pagebuilder' ? 'Page Builder' : activeTab.replace(/([A-Z])/g, ' $1').trim()}
            </h1>
            <p className="text-xs text-gray-400">
               {activeTab === 'products' && `มีสินค้าทั้งหมด ${products.length} รายการ`}
               {activeTab === 'categories' && 'Manage Mega Menu & Categories'}
               {activeTab === 'banners' && 'Manage Website Banners'}
               {activeTab === 'pagebuilder' && 'Manage Custom Pages & Content'}
               {['templates','layouts','blocks','content','forms','emails'].includes(activeTab) && 'Module Management'}
            </p>
          </div>
          
          <div className="flex items-center gap-4">
             {/* Notification Bell */}
             <div className="relative">
                <button onClick={() => setShowNotifications(!showNotifications)} className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition relative">
                   <Bell size={20} />
                   {notifications.length > 0 && (
                     <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
                   )}
                </button>

                {showNotifications && (
                  <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 z-50">
                     <div className="p-3 border-b bg-gray-50 flex justify-between items-center">
                        <span className="font-bold text-sm text-gray-700">การแจ้งเตือน</span>
                        <span className="text-[10px] text-gray-500">{notifications.length} รายการ</span>
                     </div>
                     <div className="max-h-64 overflow-y-auto">
                        {notifications.length === 0 ? (
                          <div className="p-4 text-center text-xs text-gray-400">ไม่มีการแจ้งเตือน</div>
                        ) : (
                          notifications.map(n => (
                            <div key={n.id} className="p-3 border-b hover:bg-gray-50 transition flex items-start gap-3">
                               <div className={`mt-0.5 w-2 h-2 rounded-full flex-shrink-0 ${n.type === 'warning' ? 'bg-orange-500' : 'bg-blue-500'}`}></div>
                               <div>
                                  <p className="text-sm font-bold text-gray-800">{n.title}</p>
                                  <p className="text-xs text-gray-500">{n.message}</p>
                                  <span className="text-[9px] text-gray-400">{n.timestamp.toLocaleTimeString()}</span>
                               </div>
                            </div>
                          ))
                        )}
                     </div>
                  </div>
                )}
             </div>

             {activeTab === 'products' && (
                <button 
                  onClick={handleAddNew}
                  className="bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-lg hover:shadow-green-100 font-bold active:scale-95"
                >
                  <Plus size={18} /> เพิ่มสินค้าใหม่
                </button>
             )}
          </div>
        </header>

        {activeTab === 'categories' && <CategoryManager />}
        
        {activeTab === 'brands' && <BrandManager />}
        
        {activeTab === 'banners' && <BannerManager />}

        {activeTab === 'pagebuilder' && <PageBuilder />}

        {['templates', 'layouts', 'blocks', 'content', 'forms', 'emails', 'settings'].includes(activeTab) && (
           <div className="p-12 flex flex-col items-center justify-center h-[60vh] text-center">
              <div className="bg-gray-100 p-6 rounded-full mb-6">
                 <Settings size={48} className="text-gray-400 animate-spin-slow" />
              </div>
              <h2 className="text-2xl font-bold text-gray-700 mb-2">Module Under Construction</h2>
              <p className="text-gray-500 max-w-md">
                 ส่วนจัดการ <strong>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</strong> กำลังอยู่ในระหว่างการพัฒนา
              </p>
           </div>
        )}

        {activeTab === 'products' && (
          <div className="p-4 md:p-8">
            {/* Search and Filters Section */}
            <div className="bg-white p-6 rounded-2xl shadow-md mb-8 border border-gray-100 ring-1 ring-black/5 space-y-4">
               {/* Search Bar */}
               <div className="relative w-full group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 text-gray-400 group-focus-within:text-blue-500 transition-colors pointer-events-none">
                    <Search size={22} strokeWidth={2.5} />
                  </div>
                  <input 
                     type="text" 
                     placeholder="ค้นหาตามชื่อสินค้า, หมวดหมู่ หรือรหัสสินค้า (#123)..." 
                     value={productSearchQuery}
                     onChange={(e) => setProductSearchQuery(e.target.value)}
                     className="w-full pl-14 pr-12 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all text-base font-medium shadow-inner"
                  />
                  {productSearchQuery && (
                    <button 
                      onClick={() => setProductSearchQuery('')}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 transition-colors"
                    >
                      <XCircle size={20} />
                    </button>
                  )}
               </div>

               {/* Advanced Filters */}
               <div className="flex flex-wrap gap-4">
                   {/* Category Filter */}
                   <div className="flex-1 min-w-[200px] relative">
                     <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                     <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="w-full pl-10 pr-10 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold focus:bg-white focus:border-blue-500 outline-none cursor-pointer appearance-none"
                      >
                        <option value="All">ทุกหมวดหมู่</option>
                        {db.getCategories().map(cat => (
                          <option key={cat.id} value={cat.name}>{cat.name}</option>
                        ))}
                      </select>
                      <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 rotate-90" size={14} />
                   </div>

                   {/* Brand Filter */}
                   <div className="flex-1 min-w-[200px] relative">
                     <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                     <select
                        value={brandFilter}
                        onChange={(e) => setBrandFilter(e.target.value)}
                        className="w-full pl-10 pr-10 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold focus:bg-white focus:border-blue-500 outline-none cursor-pointer appearance-none"
                      >
                        <option value="all">แบรนด์ทั้งหมด</option>
                        {db.getBrands().map(brand => (
                          <option key={brand.id} value={brand.id}>{brand.name}</option>
                        ))}
                      </select>
                      <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 rotate-90" size={14} />
                   </div>

                   {/* Stock Status Filter */}
                   <div className="flex-1 min-w-[200px] relative">
                     <AlertCircle className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                     <select
                        value={stockFilter}
                        onChange={(e) => setStockFilter(e.target.value as any)}
                        className="w-full pl-10 pr-10 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold focus:bg-white focus:border-blue-500 outline-none cursor-pointer appearance-none"
                      >
                        <option value="all">สถานะสต็อกทั้งหมด</option>
                        <option value="in">พร้อมขาย (In Stock)</option>
                        <option value="low">ใกล้หมด (Low Stock)</option>
                        <option value="out">สินค้าหมด (Out of Stock)</option>
                      </select>
                      <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 rotate-90" size={14} />
                   </div>

                   {/* Product Type Filter */}
                   <div className="flex-1 min-w-[200px] relative">
                     <Zap className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                     <select
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value as any)}
                        className="w-full pl-10 pr-10 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold focus:bg-white focus:border-blue-500 outline-none cursor-pointer appearance-none"
                      >
                        <option value="all">สถานะสินค้าทั้งหมด</option>
                        <option value="flash">Flash Sale</option>
                        <option value="featured">สินค้าแนะนำ (Featured)</option>
                        <option value="normal">สินค้าทั่วไป</option>
                      </select>
                      <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 rotate-90" size={14} />
                   </div>
               </div>
            </div>

            {/* Data Table */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100 overflow-x-auto transition-all">
              <table className="w-full text-left border-collapse min-w-[900px]">
                <thead className="bg-gray-50 text-gray-500 uppercase text-[10px] font-bold tracking-widest border-b">
                  <tr>
                    <th className="p-4 w-12 text-center bg-gray-50/50">
                       <div className="flex items-center justify-center">
                         <input 
                          type="checkbox" 
                          checked={isAllOnPageSelected} 
                          ref={el => {
                            if (el) el.indeterminate = isSomeOnPageSelected;
                          }}
                          onChange={handleSelectAllOnPage} 
                          className="cursor-pointer w-5 h-5 rounded-md text-blue-600 focus:ring-blue-500 border-gray-300 transition-all" 
                         />
                       </div>
                    </th>
                    <th className="p-4 cursor-pointer hover:text-blue-600 transition" onClick={() => requestSort('id')}>รหัส {getSortIcon('id')}</th>
                    <th className="p-4 cursor-pointer hover:text-blue-600 transition" onClick={() => requestSort('name')}>ชื่อสินค้า {getSortIcon('name')}</th>
                    <th className="p-4 cursor-pointer hover:text-blue-600 transition" onClick={() => requestSort('category')}>หมวดหมู่ {getSortIcon('category')}</th>
                    <th className="p-4 text-right cursor-pointer hover:text-blue-600 transition" onClick={() => requestSort('price')}>ราคาเริ่มต้น {getSortIcon('price')}</th>
                    <th className="p-4 text-center cursor-pointer hover:text-blue-600 transition" onClick={() => requestSort('stock')}>คงเหลือ {getSortIcon('stock')}</th>
                    <th className="p-4 text-center">จัดการ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {currentProducts.map((product) => {
                    const isSelected = selectedIds.includes(product.id);
                    return (
                      <tr 
                        key={product.id} 
                        className={`group transition-all duration-200 border-b border-gray-50 ${isSelected ? 'bg-blue-50/60 border-l-4 border-l-blue-600 shadow-sm' : 'bg-white hover:bg-gray-50 hover:shadow-md hover:-translate-y-0.5 relative z-0 hover:z-10'}`}
                      >
                        <td className="p-4 text-center">
                           <div className="flex items-center justify-center">
                             <input 
                              type="checkbox" 
                              checked={isSelected} 
                              onChange={() => {
                                if (isSelected) {
                                  setSelectedIds(selectedIds.filter(id => id !== product.id));
                                } else {
                                  setSelectedIds([...selectedIds, product.id]);
                                }
                              }} 
                              className="cursor-pointer w-5 h-5 rounded-md text-blue-600 focus:ring-blue-500 border-gray-300 transition-all bg-gray-50"
                             />
                           </div>
                        </td>
                        <td className="p-4 text-gray-400 text-xs font-mono">#{product.id}</td>
                        <td className="p-4 font-medium text-gray-800 flex items-center gap-4">
                           <div className="relative w-12 h-12 flex-shrink-0 bg-white rounded-lg border border-gray-100 p-1 group-hover:border-blue-300 transition-colors shadow-sm">
                             <img src={product.image} className="w-full h-full object-contain rounded-md" alt="" />
                             {product.isFeatured && (
                               <div className="absolute -top-1.5 -right-1.5 bg-yellow-400 p-0.5 rounded-full shadow-sm ring-2 ring-white">
                                 <Star size={8} className="text-white fill-white" />
                               </div>
                             )}
                           </div>
                           <div className="flex flex-col">
                              <span className="text-sm font-bold group-hover:text-blue-600 transition-colors line-clamp-1">{product.name}</span>
                              <div className="flex gap-1.5 mt-1">
                                {product.isFlashSale && <span className="text-[9px] bg-orange-100 text-orange-600 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider flex items-center gap-0.5"><Zap size={8} className="fill-orange-600" /> Flash</span>}
                                {product.variants && product.variants.length > 0 && (
                                  <span className="text-[9px] bg-purple-100 text-purple-600 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider flex items-center gap-0.5">
                                    <Layers size={8} /> {product.variants.length} Opts
                                  </span>
                                )}
                              </div>
                           </div>
                        </td>
                        <td className="p-4 text-xs font-medium text-gray-500">
                          <span className="bg-gray-100/80 px-2.5 py-1 rounded-lg border border-gray-200/50">{product.category}</span>
                        </td>
                        <td className="p-4 text-right font-bold text-gray-700 text-sm">฿{product.price.toLocaleString()}</td>
                        <td className="p-4 text-center">
                           <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border ${product.stock < 5 ? 'bg-red-50 text-red-600 border-red-100 animate-pulse' : product.stock < 10 ? 'bg-orange-50 text-orange-600 border-orange-100' : 'bg-green-50 text-green-600 border-green-100'}`}>
                             {product.stock}
                           </span>
                        </td>
                        <td className="p-4 text-center">
                          <div className="flex justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => handleEdit(product)} className="text-blue-600 hover:bg-blue-100 p-2 rounded-lg transition-all" title="แก้ไข"><Edit size={16} /></button>
                            <button onClick={() => handleDelete(product.id)} className="text-red-500 hover:bg-red-100 p-2 rounded-lg transition-all" title="ลบ"><Trash2 size={16} /></button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination UI */}
            <div className="mt-6 flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
              <span className="text-xs text-gray-400">แสดง {indexOfFirstItem + 1} ถึง {Math.min(indexOfLastItem, processedProducts.length)} จากทั้งหมด {processedProducts.length} รายการ</span>
              <div className="flex gap-2">
                 <button 
                  disabled={productPage === 1}
                  onClick={() => setProductPage(productPage - 1)}
                  className="p-2 border rounded-xl disabled:opacity-30 hover:bg-gray-50 transition-colors"
                 >
                   <ChevronLeft size={16} />
                 </button>
                 {Array.from({length: totalPages}, (_, i) => i + 1).map(page => (
                   <button 
                    key={page}
                    onClick={() => setProductPage(page)}
                    className={`w-8 h-8 rounded-xl text-xs font-bold transition-all ${productPage === page ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'hover:bg-gray-50 border'}`}
                   >
                     {page}
                   </button>
                 ))}
                 <button 
                  disabled={productPage === totalPages}
                  onClick={() => setProductPage(productPage + 1)}
                  className="p-2 border rounded-xl disabled:opacity-30 hover:bg-gray-50 transition-colors"
                 >
                   <ChevronRight size={16} />
                 </button>
              </div>
            </div>
          </div>
        )}

        {/* Sticky Bulk Action Bar */}
        {selectedIds.length > 0 && activeTab === 'products' && (
          <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-10 fade-in duration-300">
            <div className="bg-[#1a237e] text-white px-6 py-4 rounded-3xl shadow-2xl flex flex-col md:flex-row items-center gap-6 border border-white/10 backdrop-blur-md">
               <div className="flex items-center gap-3 pr-6 border-r border-white/20">
                  <div className="bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-inner animate-pulse">
                    {selectedIds.length}
                  </div>
                  <span className="text-sm font-medium tracking-wide">รายการที่ถูกเลือก</span>
               </div>
               
               <div className="flex flex-wrap justify-center items-center gap-2">
                  {/* Status Actions */}
                  <div className="flex gap-2 mr-2">
                    <button 
                      onClick={() => handleBulkUpdate({ isFlashSale: true }, 'เพิ่มใน Flash Sale')}
                      className="flex items-center gap-1.5 bg-white/10 hover:bg-orange-500 hover:text-white px-3 py-2 rounded-xl text-xs font-bold transition-all"
                      title="Add to Flash Sale"
                    >
                      <Zap size={14} /> <span className="hidden sm:inline">Flash Sale</span>
                    </button>
                    <button 
                      onClick={() => handleBulkUpdate({ isFlashSale: false }, 'ลบจาก Flash Sale')}
                      className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 px-3 py-2 rounded-xl text-xs font-bold transition-all text-gray-300 hover:text-white"
                      title="Remove from Flash Sale"
                    >
                      <ZapOff size={14} />
                    </button>
                  </div>

                  <div className="flex gap-2 mr-4 border-r border-white/20 pr-4">
                    <button 
                      onClick={() => handleBulkUpdate({ isFeatured: true }, 'ตั้งเป็นสินค้าแนะนำ')}
                      className="flex items-center gap-1.5 bg-white/10 hover:bg-yellow-500 hover:text-white px-3 py-2 rounded-xl text-xs font-bold transition-all"
                      title="Set as Featured"
                    >
                      <Star size={14} /> <span className="hidden sm:inline">แนะนำ</span>
                    </button>
                    <button 
                      onClick={() => handleBulkUpdate({ isFeatured: false }, 'ยกเลิกสินค้าแนะนำ')}
                      className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 px-3 py-2 rounded-xl text-xs font-bold transition-all text-gray-300 hover:text-white"
                      title="Remove from Featured"
                    >
                      <StarOff size={14} />
                    </button>
                  </div>

                  {/* Destructive Actions */}
                  <button 
                    onClick={handleBulkDelete}
                    className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-lg active:scale-95"
                  >
                    <Trash2 size={16} /> ลบ
                  </button>
                  
                  <button 
                    onClick={() => setSelectedIds([])}
                    className="flex items-center gap-2 hover:bg-white/10 text-gray-300 hover:text-white px-4 py-2 rounded-xl text-xs font-medium transition-all"
                  >
                    <X size={16} /> ยกเลิก
                  </button>
               </div>
            </div>
          </div>
        )}
      </main>

      {/* Edit/Add Modal */}
      {isModalOpen && activeTab === 'products' && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100] backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[95vh] border border-white/20 animate-in fade-in zoom-in-95 duration-200">
             <div className="bg-[#1a237e] px-8 py-5 border-b border-white/10 flex justify-between items-center text-white">
                <div className="flex items-center gap-3">
                  <div className="bg-white/20 p-2 rounded-xl">
                    {editingProduct ? <Edit size={22} /> : <Plus size={22} />}
                  </div>
                  <h3 className="font-bold text-lg tracking-wide">{editingProduct ? 'แก้ไขข้อมูลสินค้า' : 'เพิ่มสินค้าใหม่ลงระบบ'}</h3>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="bg-white/10 hover:bg-white/20 p-2 rounded-full transition-all duration-200">
                  <X size={20} />
                </button>
             </div>
             
             <form onSubmit={handleSubmit} className="p-8 space-y-8 overflow-y-auto no-scrollbar">
                {/* Basic Info Section */}
                <div className="space-y-6">
                  <div className="flex items-center gap-2 border-l-4 border-blue-600 pl-3">
                    <Package size={18} className="text-blue-600" />
                    <h4 className="font-bold text-gray-800 uppercase tracking-wider text-sm">ข้อมูลทั่วไป</h4>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-2 ml-1">ชื่อสินค้าที่แสดง</label>
                      <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full border-gray-200 border rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none transition shadow-sm" placeholder="ระบุชื่อสินค้า..." required />
                    </div>
                    
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-2 ml-1">
                        {hasVariants ? 'ราคาขายหลัก (คำนวณจากตัวเลือกต่ำสุด)' : 'ราคาขาย (บาท)'}
                      </label>
                      <input 
                        type="number" 
                        value={formData.price} 
                        readOnly={hasVariants}
                        onChange={e => !hasVariants && setFormData({...formData, price: Number(e.target.value)})} 
                        className={`w-full border rounded-xl p-3 outline-none transition shadow-sm ${hasVariants ? 'bg-blue-50 border-blue-200 text-blue-700 font-bold cursor-not-allowed' : 'border-gray-200 focus:ring-2 focus:ring-blue-500'}`} 
                        required 
                      />
                      {hasVariants && <p className="text-[10px] text-blue-600 mt-2 italic flex items-center gap-1 font-medium bg-blue-50/50 p-2 rounded-lg border border-blue-100/50"><AlertCircle size={12}/> ระบบอัปเดตราคาเริ่มต้นอัตโนมัติจากตัวเลือกที่ราคาต่ำสุด</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-2 ml-1">สต็อกรวมในระบบ</label>
                      <input type="number" value={formData.stock} readOnly={hasVariants} onChange={e => !hasVariants && setFormData({...formData, stock: Number(e.target.value)})} className={`w-full border rounded-xl p-3 outline-none transition shadow-sm ${hasVariants ? 'bg-gray-50 border-gray-100 text-gray-500 cursor-not-allowed' : 'border-gray-200 focus:ring-2 focus:ring-blue-500'}`} required />
                      {hasVariants && <p className="text-[10px] text-gray-400 mt-2 italic font-medium">รวมจากจำนวนตัวเลือกทุกรายการ</p>}
                    </div>

                    <div className="md:col-span-1">
                       <label className="block text-xs font-bold text-gray-500 uppercase mb-2 ml-1">หมวดหมู่สินค้า</label>
                       <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full border-gray-200 border rounded-xl p-3 bg-white focus:ring-2 focus:ring-blue-500 outline-none transition shadow-sm cursor-pointer">
                         {db.getCategories().map(category => (<option key={category.id} value={category.name}>{category.name}</option>))}
                       </select>
                    </div>

                    <div className="md:col-span-1">
                       <label className="block text-xs font-bold text-gray-500 uppercase mb-2 ml-1">แบรนด์ (Optional)</label>
                       <select 
                          value={formData.brandId || ''} 
                          onChange={e => setFormData({...formData, brandId: Number(e.target.value)})} 
                          className="w-full border-gray-200 border rounded-xl p-3 bg-white focus:ring-2 focus:ring-blue-500 outline-none transition shadow-sm cursor-pointer"
                       >
                         <option value="">ไม่ระบุแบรนด์</option>
                         {db.getBrands().map(brand => (<option key={brand.id} value={brand.id}>{brand.name}</option>))}
                       </select>
                    </div>

                    <div className="md:col-span-2">
                       <ImageManager 
                         images={formData.images || []} 
                         onChange={(newImages) => setFormData({...formData, images: newImages, image: newImages[0] || ''})} 
                         label="รูปภาพสินค้าหลัก (ใส่ได้หลายรูป)"
                       />
                    </div>
                  </div>
                </div>

                {/* Variants Section */}
                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 space-y-6">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2 border-l-4 border-purple-600 pl-3">
                      <Layers size={18} className="text-purple-600" />
                      <h4 className="font-bold text-gray-800 uppercase tracking-wider text-sm">การตั้งค่าตัวเลือกสินค้า (Variants)</h4>
                    </div>
                    <button type="button" onClick={handleAddVariant} className="text-xs bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-all duration-200 flex items-center gap-1.5 shadow-md font-bold">
                      <Plus size={14} /> เพิ่มตัวเลือกสินค้า
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    {(formData.variants || []).length === 0 ? (
                      <div className="text-center py-10 text-gray-400 text-xs italic bg-white border border-dashed rounded-2xl flex flex-col items-center gap-2">
                        <Layers size={32} className="text-gray-200" />
                        สินค้าชิ้นนี้ยังไม่มีตัวเลือกย่อย (เช่น สี หรือ ขนาด)
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 gap-4">
                        {(formData.variants || []).map((variant) => (
                          <div key={variant.id} className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm relative group hover:border-purple-300 transition-all duration-300">
                            <button 
                              type="button" 
                              onClick={() => handleRemoveVariant(variant.id)} 
                              className="absolute -top-3 -right-3 bg-red-100 text-red-600 hover:bg-red-600 hover:text-white p-1.5 rounded-full shadow-lg transition-all duration-300 z-10 opacity-0 group-hover:opacity-100"
                              title="ลบตัวเลือกนี้"
                            >
                              <X size={14} />
                            </button>
                            
                            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
                              <div className="md:col-span-6">
                                <label className="block text-[9px] font-bold text-gray-400 uppercase mb-1.5 tracking-tighter">ชื่อตัวเลือก (เช่น สีแดง, XL)</label>
                                <div className="relative w-full">
                                  <input 
                                    type="text" 
                                    value={variant.name} 
                                    onChange={(e) => handleUpdateVariant(variant.id, 'name', e.target.value)} 
                                    className={`w-full text-sm border rounded-lg px-3 py-2 outline-none transition shadow-sm ${variantErrors[variant.id] ? 'border-red-500 ring-2 ring-red-50 bg-red-50' : 'border-gray-200 focus:ring-2 focus:ring-purple-500'}`} 
                                    placeholder="ใส่ชื่อตัวเลือก..."
                                    required
                                  />
                                  {variantErrors[variant.id] && (
                                    <p className="text-[9px] text-red-600 mt-1.5 flex items-center gap-1 font-bold italic animate-pulse">
                                      <AlertCircle size={10} /> {variantErrors[variant.id]}
                                    </p>
                                  )}
                                </div>
                              </div>

                              <div className="md:col-span-3">
                                <label className="block text-[9px] font-bold text-gray-400 uppercase mb-1.5 tracking-tighter">ราคา (บาท)</label>
                                <input 
                                  type="number" 
                                  value={variant.price} 
                                  onChange={(e) => handleUpdateVariant(variant.id, 'price', Number(e.target.value))} 
                                  className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 outline-none transition shadow-sm" 
                                  placeholder="0"
                                  required
                                />
                              </div>

                              <div className="md:col-span-3">
                                <label className="block text-[9px] font-bold text-gray-400 uppercase mb-1.5 tracking-tighter">สต็อก</label>
                                <input 
                                  type="number" 
                                  value={variant.stock} 
                                  onChange={(e) => handleUpdateVariant(variant.id, 'stock', Number(e.target.value))} 
                                  className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 outline-none transition shadow-sm" 
                                  placeholder="0"
                                  required
                                />
                              </div>

                              <div className="md:col-span-12 pt-2 border-t border-gray-50 mt-1">
                                 <ImageManager 
                                    images={variant.images || []}
                                    onChange={(newImages) => handleUpdateVariant(variant.id, 'images', newImages)}
                                    label="รูปภาพสำหรับตัวเลือกนี้"
                                 />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Status and Visibility Toggles */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div 
                      className={`flex items-center gap-4 py-5 px-6 rounded-2xl border-2 transition-all duration-300 cursor-pointer ${formData.isFlashSale ? 'bg-orange-50 border-orange-300 ring-4 ring-orange-100 shadow-md scale-[1.02]' : 'bg-white border-gray-100 hover:border-gray-200'}`} 
                      onClick={() => setFormData({...formData, isFlashSale: !formData.isFlashSale})}
                    >
                        <div className={`w-14 h-7 rounded-full relative transition-colors ${formData.isFlashSale ? 'bg-orange-500' : 'bg-gray-200'}`}>
                            <div className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-md transition-all duration-300 ${formData.isFlashSale ? 'left-8' : 'left-1'}`}></div>
                        </div>
                        <div className="flex flex-col">
                          <label className="text-sm font-black text-gray-700 flex items-center gap-2 select-none cursor-pointer uppercase tracking-tight">
                            <Zap size={18} className={formData.isFlashSale ? 'fill-orange-500 text-orange-500' : 'text-gray-400'} /> ติดป้าย Flash Sale
                          </label>
                          <span className="text-[10px] text-gray-500 font-semibold">สินค้าจะปรากฏในโซนดีลพิเศษ</span>
                        </div>
                    </div>

                    <div 
                      className={`flex items-center gap-4 py-5 px-6 rounded-2xl border-2 transition-all duration-300 cursor-pointer ${formData.isFeatured ? 'bg-yellow-50 border-yellow-300 ring-4 ring-yellow-100 shadow-md scale-[1.02]' : 'bg-white border-gray-100 hover:border-gray-200'}`} 
                      onClick={() => setFormData({...formData, isFeatured: !formData.isFeatured})}
                    >
                        <div className={`w-14 h-7 rounded-full relative transition-colors ${formData.isFeatured ? 'bg-yellow-400' : 'bg-gray-200'}`}>
                            <div className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-md transition-all duration-300 ${formData.isFeatured ? 'left-8' : 'left-1'}`}></div>
                        </div>
                        <div className="flex flex-col">
                          <label className="text-sm font-black text-gray-700 flex items-center gap-2 select-none cursor-pointer uppercase tracking-tight">
                            <Star size={18} className={formData.isFeatured ? 'fill-yellow-500 text-yellow-500' : 'text-gray-400'} /> สินค้าแนะนำพิเศษ
                          </label>
                          <span className="text-[10px] text-gray-500 font-semibold">จะแสดงในส่วน Product Hero บนหน้าหลัก</span>
                        </div>
                    </div>
                </div>
                
                {/* Submit / Cancel Buttons */}
                <div className="pt-8 flex justify-end gap-4 border-t border-gray-100 mt-6 flex-shrink-0">
                   <button type="button" onClick={() => setIsModalOpen(false)} className="px-8 py-3 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-xl font-bold transition-all duration-200">
                     ยกเลิก
                   </button>
                   <button 
                    type="submit" 
                    disabled={Object.values(variantErrors).some(err => err !== '')}
                    className="px-10 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-xl hover:shadow-blue-200 transition-all duration-200 font-bold active:scale-[0.98]"
                   >
                     <Save size={20} /> บันทึกข้อมูลสินค้า
                   </button>
                </div>
             </form>
          </div>
        </div>
      )}
    </div>
  );
};
