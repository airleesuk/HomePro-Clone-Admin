
import React, { useState, useEffect, useMemo } from 'react';
import { db, CATEGORIES } from '../services/mockDb';
import { Product, ProductVariant } from '../types';
import { 
  Package, Settings, Plus, Trash2, Edit, Save, X, Search, 
  ChevronLeft, ChevronRight, ArrowUpDown, ArrowUp, ArrowDown, 
  Filter, Zap, Layers, CheckSquare, Square, Star, 
  Image as ImageIcon, AlertCircle, CheckCircle2, MinusSquare, XCircle, LayoutGrid
} from 'lucide-react';

export const AdminPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'products' | 'settings'>('products');
  
  // Data State
  const [products, setProducts] = useState<Product[]>([]);
  
  // UI State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Bulk Edit State
  const [isBulkEditModalOpen, setIsBulkEditModalOpen] = useState(false);
  const [bulkEditValues, setBulkEditValues] = useState({
    price: '',
    stock: '',
    image: '',
    applyPrice: false,
    applyStock: false,
    applyImage: false
  });

  // Filter & Search State
  const [productSearchQuery, setProductSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  
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
    variants: []
  });

  const [variantErrors, setVariantErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    refreshData();
  }, []);

  useEffect(() => {
    setProductPage(1);
  }, [productSearchQuery, selectedCategory]);

  const refreshData = () => {
    setProducts([...db.getProducts()]);
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
      return matchesSearch && matchesCategory;
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
  }, [products, productSearchQuery, selectedCategory, sortConfig]);

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
    if (!confirm(`ยืนยันการลบสินค้า ${selectedIds.length} รายการที่เลือกไว้?`)) return;
    selectedIds.forEach(id => db.deleteProduct(id));
    setSelectedIds([]);
    refreshData();
  };

  const handleBulkEditOpen = () => {
    setBulkEditValues({
      price: '',
      stock: '',
      image: '',
      applyPrice: false,
      applyStock: false,
      applyImage: false
    });
    setIsBulkEditModalOpen(true);
  };

  const handleBulkSave = (e: React.FormEvent) => {
    e.preventDefault();
    
    selectedIds.forEach(id => {
      const product = products.find(p => p.id === id);
      if (!product) return;

      const updatedProduct = { ...product };
      const hasVariants = updatedProduct.variants && updatedProduct.variants.length > 0;

      // Price Update
      if (bulkEditValues.applyPrice) {
        const newPrice = Number(bulkEditValues.price);
        if (hasVariants) {
          // Update all variants prices
          updatedProduct.variants = updatedProduct.variants!.map(v => ({
            ...v,
            price: newPrice
          }));
          updatedProduct.price = newPrice; // Update main display price
        } else {
          updatedProduct.price = newPrice;
        }
      }

      // Stock Update
      if (bulkEditValues.applyStock) {
        const newStock = Number(bulkEditValues.stock);
        if (hasVariants) {
          // Update all variants stock
          updatedProduct.variants = updatedProduct.variants!.map(v => ({
            ...v,
            stock: newStock
          }));
          // Recalculate total stock for main product
          updatedProduct.stock = updatedProduct.variants!.reduce((sum, v) => sum + v.stock, 0);
        } else {
          updatedProduct.stock = newStock;
        }
      }

      // Image Update
      if (bulkEditValues.applyImage && bulkEditValues.image) {
        const newImage = bulkEditValues.image;
        updatedProduct.image = newImage;
        if (hasVariants) {
          // Update all variants image
           updatedProduct.variants = updatedProduct.variants!.map(v => ({
            ...v,
            image: newImage
          }));
        }
      }

      db.updateProduct(updatedProduct);
    });

    setIsBulkEditModalOpen(false);
    setSelectedIds([]);
    refreshData();
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    const variants = product.variants || [];
    
    const price = variants.length > 0
      ? Math.min(...variants.map(v => Number(v.price) || Infinity))
      : product.price;

    const totalStock = variants.length > 0
      ? variants.reduce((sum, v) => sum + (Number(v.stock) || 0), 0)
      : product.stock;

    setFormData({ 
      ...product, 
      variants: variants,
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
       sold: 0,
       discount: 0,
       isFlashSale: false,
       isFeatured: false,
       variants: []
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
      image: ''
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

  const handleUpdateVariant = (id: string, field: keyof ProductVariant, value: string | number) => {
    const updatedVariants = (formData.variants || []).map(v => 
      v.id === id ? { ...v, [field]: value } : v
    );
    
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

    if (editingProduct) {
      db.updateProduct({ ...editingProduct, ...formData } as Product);
    } else {
      db.addProduct({ ...formData, sold: 0 } as Product);
    }
    setIsModalOpen(false);
    refreshData();
  };

  const hasVariants = formData.variants && formData.variants.length > 0;

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      <aside className="w-64 bg-[#1a237e] text-white flex flex-col hidden md:flex">
        <div className="p-6 text-2xl font-bold tracking-wider border-b border-blue-800">
          Waree-th<span className="text-orange-400">Admin</span>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <button onClick={() => setActiveTab('products')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition text-left ${activeTab === 'products' ? 'bg-blue-800 text-white shadow-inner' : 'text-gray-300 hover:bg-blue-800 hover:text-white'}`}>
            <Package size={20} /> รายการสินค้า
          </button>
          <button onClick={() => setActiveTab('settings')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition text-left ${activeTab === 'settings' ? 'bg-blue-800 text-white' : 'text-gray-300 hover:bg-blue-800 hover:text-white'}`}>
            <Settings size={20} /> ตั้งค่าระบบ
          </button>
        </nav>
      </aside>

      <main className="flex-1 overflow-y-auto relative pb-24 no-scrollbar">
        {activeTab === 'products' && (
          <>
            <header className="bg-white shadow-sm px-4 md:px-8 py-4 flex justify-between items-center sticky top-0 z-30">
              <div>
                <h1 className="text-xl font-bold text-gray-800">Waree-th Database Admin</h1>
                <p className="text-xs text-gray-400">มีสินค้าทั้งหมด {products.length} รายการ (SQL Connected)</p>
              </div>
              <button 
                onClick={handleAddNew}
                className="bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-lg hover:shadow-green-100 font-bold active:scale-95"
              >
                <Plus size={18} /> เพิ่มสินค้าใหม่
              </button>
            </header>

            <div className="p-4 md:p-8">
              {/* Prominent Search and Filters */}
              <div className="bg-white p-6 rounded-2xl shadow-md mb-8 flex flex-col lg:flex-row gap-6 justify-between items-center border border-gray-100 ring-1 ring-black/5">
                 <div className="relative w-full lg:flex-1 group">
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
                 <div className="flex gap-4 w-full lg:w-auto">
                     <div className="flex-1 lg:w-64 relative">
                       <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                       <select
                          value={selectedCategory}
                          onChange={(e) => setSelectedCategory(e.target.value)}
                          className="w-full pl-12 pr-10 py-4 bg-gray-50 border-2 border-transparent rounded-2xl text-sm font-bold focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none cursor-pointer appearance-none shadow-inner"
                        >
                          <option value="All">ทุกหมวดหมู่</option>
                          {CATEGORIES.map(cat => (
                            <option key={cat.id} value={cat.name}>{cat.name}</option>
                          ))}
                        </select>
                        <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 rotate-90" size={16} />
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
                          className={`group transition-all duration-200 ${isSelected ? 'bg-blue-50/60 border-l-4 border-l-blue-600' : 'hover:bg-gray-50/50 border-l-4 border-l-transparent'}`}
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
                                className="cursor-pointer w-5 h-5 rounded-md text-blue-600 focus:ring-blue-500 border-gray-300 transition-all"
                               />
                             </div>
                          </td>
                          <td className="p-4 text-gray-400 text-xs font-mono">#{product.id}</td>
                          <td className="p-4 font-medium text-gray-800 flex items-center gap-3">
                             <div className="relative w-12 h-12 flex-shrink-0">
                               <img src={product.image} className="w-full h-full rounded-xl object-cover border border-gray-100 group-hover:scale-110 transition duration-300 shadow-sm" alt="" />
                               {product.isFeatured && (
                                 <div className="absolute -top-1 -right-1 bg-yellow-400 p-0.5 rounded-full shadow-sm ring-2 ring-white">
                                   <Star size={10} className="text-white fill-white" />
                                 </div>
                               )}
                             </div>
                             <div className="flex flex-col">
                                <span className="text-sm group-hover:text-blue-600 transition-colors">{product.name}</span>
                                <div className="flex gap-1.5 mt-1">
                                  {product.isFlashSale && <span className="text-[8px] bg-orange-100 text-orange-600 px-1.5 py-0.5 rounded-sm font-bold uppercase tracking-tighter shadow-sm">Flash Sale</span>}
                                  {product.variants && product.variants.length > 0 && (
                                    <span className="text-[8px] bg-purple-100 text-purple-600 px-1.5 py-0.5 rounded-sm font-bold uppercase tracking-tighter flex items-center gap-0.5 shadow-sm">
                                      <Layers size={8} /> {product.variants.length} ตัวเลือก
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
                             <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border ${product.stock < 10 ? 'bg-red-50 text-red-600 border-red-100' : 'bg-green-50 text-green-600 border-green-100'}`}>
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

            {/* Sticky Bulk Action Bar */}
            {selectedIds.length > 0 && (
              <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-10 fade-in duration-300">
                <div className="bg-[#1a237e] text-white px-6 py-4 rounded-3xl shadow-2xl flex items-center gap-8 border border-white/10 backdrop-blur-md">
                   <div className="flex items-center gap-3 pr-6 border-r border-white/20">
                      <div className="bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-inner animate-pulse">
                        {selectedIds.length}
                      </div>
                      <span className="text-sm font-medium tracking-wide">รายการที่ถูกเลือก</span>
                   </div>
                   
                   <div className="flex items-center gap-4">
                      <button 
                        onClick={handleBulkEditOpen}
                        className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-lg active:scale-95"
                      >
                        <Edit size={16} /> แก้ไขพร้อมกัน
                      </button>

                      <button 
                        onClick={handleBulkDelete}
                        className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-lg active:scale-95"
                      >
                        <Trash2 size={16} /> ลบที่เลือก
                      </button>
                      
                      <button 
                        onClick={() => setSelectedIds([])}
                        className="flex items-center gap-2 hover:bg-white/10 text-gray-300 hover:text-white px-4 py-2 rounded-xl text-xs font-medium transition-all"
                      >
                        <X size={16} /> ยกเลิกทั้งหมด
                      </button>
                   </div>
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* Bulk Edit Modal */}
      {isBulkEditModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100] backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
             <div className="bg-[#1a237e] px-8 py-5 border-b border-white/10 flex justify-between items-center text-white">
                <div className="flex items-center gap-3">
                  <div className="bg-white/20 p-2 rounded-xl">
                    <LayoutGrid size={22} />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg tracking-wide">แก้ไขข้อมูลหลายรายการ</h3>
                    <p className="text-[10px] text-blue-200">กำลังแก้ไข {selectedIds.length} รายการที่เลือก</p>
                  </div>
                </div>
                <button onClick={() => setIsBulkEditModalOpen(false)} className="bg-white/10 hover:bg-white/20 p-2 rounded-full transition-all duration-200">
                  <X size={20} />
                </button>
             </div>
             
             <form onSubmit={handleBulkSave} className="p-8 space-y-6">
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex gap-3 items-start">
                   <AlertCircle className="text-blue-600 shrink-0 mt-0.5" size={18} />
                   <div className="text-xs text-blue-800 leading-relaxed">
                     <strong>หมายเหตุ:</strong> การแก้ไขในหน้านี้จะอัปเดตข้อมูลของสินค้าหลัก และหากสินค้ามี <strong>"ตัวเลือกย่อย" (Variants)</strong> ระบบจะทำการอัปเดตข้อมูลของทุกตัวเลือกให้เป็นค่าเดียวกันโดยอัตโนมัติ
                   </div>
                </div>

                <div className="space-y-4">
                   {/* Price Field */}
                   <div className={`p-4 rounded-xl border-2 transition-all ${bulkEditValues.applyPrice ? 'border-blue-500 bg-blue-50/30' : 'border-gray-100 bg-white'}`}>
                      <div className="flex items-center justify-between mb-2">
                         <label className="flex items-center gap-2 text-sm font-bold text-gray-700 cursor-pointer select-none">
                            <input 
                              type="checkbox" 
                              checked={bulkEditValues.applyPrice} 
                              onChange={(e) => setBulkEditValues({...bulkEditValues, applyPrice: e.target.checked})}
                              className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                            />
                            อัปเดตราคา (บาท)
                         </label>
                      </div>
                      <input 
                        type="number" 
                        placeholder="0.00" 
                        disabled={!bulkEditValues.applyPrice}
                        value={bulkEditValues.price}
                        onChange={(e) => setBulkEditValues({...bulkEditValues, price: e.target.value})}
                        className="w-full border border-gray-200 rounded-lg p-2 text-sm disabled:bg-gray-100 disabled:text-gray-400 focus:ring-2 focus:ring-blue-500 outline-none transition"
                      />
                   </div>

                   {/* Stock Field */}
                   <div className={`p-4 rounded-xl border-2 transition-all ${bulkEditValues.applyStock ? 'border-blue-500 bg-blue-50/30' : 'border-gray-100 bg-white'}`}>
                      <div className="flex items-center justify-between mb-2">
                         <label className="flex items-center gap-2 text-sm font-bold text-gray-700 cursor-pointer select-none">
                            <input 
                              type="checkbox" 
                              checked={bulkEditValues.applyStock} 
                              onChange={(e) => setBulkEditValues({...bulkEditValues, applyStock: e.target.checked})}
                              className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                            />
                            อัปเดตสต็อก (จำนวน)
                         </label>
                      </div>
                      <input 
                        type="number" 
                        placeholder="0" 
                        disabled={!bulkEditValues.applyStock}
                        value={bulkEditValues.stock}
                        onChange={(e) => setBulkEditValues({...bulkEditValues, stock: e.target.value})}
                        className="w-full border border-gray-200 rounded-lg p-2 text-sm disabled:bg-gray-100 disabled:text-gray-400 focus:ring-2 focus:ring-blue-500 outline-none transition"
                      />
                      <p className="text-[10px] text-gray-400 mt-2 ml-6">*สำหรับสินค้ามีตัวเลือก จะเป็นการกำหนดสต็อกให้แต่ละตัวเลือกเท่ากัน</p>
                   </div>

                   {/* Image Field */}
                   <div className={`p-4 rounded-xl border-2 transition-all ${bulkEditValues.applyImage ? 'border-blue-500 bg-blue-50/30' : 'border-gray-100 bg-white'}`}>
                      <div className="flex items-center justify-between mb-2">
                         <label className="flex items-center gap-2 text-sm font-bold text-gray-700 cursor-pointer select-none">
                            <input 
                              type="checkbox" 
                              checked={bulkEditValues.applyImage} 
                              onChange={(e) => setBulkEditValues({...bulkEditValues, applyImage: e.target.checked})}
                              className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                            />
                            อัปเดต URL รูปภาพ
                         </label>
                      </div>
                      <input 
                        type="text" 
                        placeholder="https://..." 
                        disabled={!bulkEditValues.applyImage}
                        value={bulkEditValues.image}
                        onChange={(e) => setBulkEditValues({...bulkEditValues, image: e.target.value})}
                        className="w-full border border-gray-200 rounded-lg p-2 text-sm disabled:bg-gray-100 disabled:text-gray-400 focus:ring-2 focus:ring-blue-500 outline-none transition"
                      />
                   </div>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                   <button 
                     type="button" 
                     onClick={() => setIsBulkEditModalOpen(false)} 
                     className="px-6 py-2.5 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-xl font-bold transition-all text-sm"
                   >
                     ยกเลิก
                   </button>
                   <button 
                    type="submit" 
                    className="px-8 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 shadow-lg hover:shadow-blue-200 transition-all font-bold active:scale-[0.98] text-sm flex items-center gap-2"
                   >
                     <Save size={16} /> บันทึกการแก้ไข
                   </button>
                </div>
             </form>
          </div>
        </div>
      )}

      {/* Edit/Add Modal */}
      {isModalOpen && (
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
                         {CATEGORIES.map(category => (<option key={category.id} value={category.name}>{category.name}</option>))}
                       </select>
                    </div>

                    <div className="md:col-span-1">
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-2 ml-1">URL รูปภาพหลัก</label>
                      <input type="text" value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} className="w-full border-gray-200 border rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition shadow-sm" placeholder="https://..." />
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
                              <div className="md:col-span-4">
                                <label className="block text-[9px] font-bold text-gray-400 uppercase mb-1.5 tracking-tighter">ชื่อตัวเลือก (เช่น สีแดง, XL)</label>
                                <div className="relative">
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

                              <div className="md:col-span-2 flex flex-col items-center justify-end h-full">
                                 <label className="block text-[9px] font-bold text-gray-400 uppercase mb-1.5 tracking-tighter text-center">Preview</label>
                                 <div className="w-12 h-12 rounded-xl border-2 border-dashed border-gray-200 flex items-center justify-center text-gray-300 bg-gray-50 overflow-hidden shadow-inner group-hover:border-purple-200 group-hover:bg-purple-50 transition-colors">
                                    {variant.image ? (
                                      <img src={variant.image} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-125" alt="v-preview" />
                                    ) : (
                                      <ImageIcon size={18} />
                                    )}
                                 </div>
                              </div>

                              <div className="md:col-span-12 pt-2 border-t border-gray-50 mt-1">
                                 <div className="flex items-center gap-2 mb-1.5">
                                   <ImageIcon size={12} className="text-gray-400" />
                                   <label className="block text-[9px] font-bold text-gray-400 uppercase tracking-tighter">URL รูปภาพเฉพาะตัวเลือก (ถ้ามี)</label>
                                 </div>
                                 <input 
                                  type="text" 
                                  value={variant.image || ''} 
                                  onChange={(e) => handleUpdateVariant(variant.id, 'image', e.target.value)} 
                                  className="w-full text-[10px] border border-gray-100 bg-gray-50/50 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 outline-none transition" 
                                  placeholder="ตัวอย่าง: https://image-server.com/blue-model.jpg"
                                />
                                <p className="text-[9px] text-gray-400 mt-1.5 italic font-medium">รูปภาพนี้จะแสดงแทนรูปหลักเมื่อลูกค้าคลิกเลือกตัวเลือกนี้ในหน้าร้าน</p>
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
