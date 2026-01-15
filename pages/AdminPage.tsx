
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { db } from '../services/mockDb';
import { Product, ProductVariant, Category } from '../types';
import { 
  Package, Plus, Trash2, Edit, Save, X, 
  Zap, Database, Terminal, 
  Search, AlertCircle, Box, Layers, 
  Trash, ShieldAlert, Star, PlusCircle, CheckSquare, 
  Square, Globe, Wand2, List, Info, BarChart3, 
  Archive, Eye, EyeOff, Truck, Ruler, Weight, CheckCircle2,
  Code, Play, RotateCcw, Copy, Check
} from 'lucide-react';

export const AdminPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Category management state
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryFormData, setCategoryFormData] = useState<Partial<Category>>({
    name: '',
    icon: '',
    isActive: true
  });
  
  // Confirmation Modals
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [bulkDeleteConfirm, setBulkDeleteConfirm] = useState<'products' | 'categories' | null>(null);
  
  const [tagInput, setTagInput] = useState('');
  const [seoKeywordInput, setSeoKeywordInput] = useState('');

  // Selection/Bulk Actions Products
  const [selectedProductIds, setSelectedProductIds] = useState<number[]>([]);

  // Selection/Bulk Actions Categories
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>([]);

  // Navigation State
  const [activeTab, setActiveTab] = useState<'products' | 'categories' | 'database'>('products');

  // Sorting State
  const [sortConfig, setSortConfig] = useState<{ key: keyof Product; direction: 'asc' | 'desc' } | null>(null);
  
  // Filter State
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('All');
  const [filterStock, setFilterStock] = useState<'all' | 'low' | 'out'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // SQL Terminal State
  const [sqlCommand, setSqlCommand] = useState("SELECT * FROM products WHERE stock < 10;");
  const [sqlResult, setSqlResult] = useState<any[]>([]);
  const [isExecutingSql, setIsExecutingSql] = useState(false);
  const [sqlLog, setSqlLog] = useState<string[]>(["Core System Initialized...", "Awaiting Sequence Command..."]);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  // Product Form State
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    brand: '',
    sku: '',
    price: 0,
    category: '',
    stock: 0,
    description: '',
    weight: 0,
    dimensions: '',
    image: '',
    isFeatured: false,
    tags: [],
    variants: [],
    seoUrl: '',
    seoKeywords: [],
    seoDescription: ''
  });

  useEffect(() => {
    refreshData();
  }, []);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [sqlLog]);

  const refreshData = () => {
    setProducts([...db.getProducts()]);
    setCategories([...db.getCategories()]);
  };

  const stats = useMemo(() => {
    const total = products.length;
    const inventoryValue = products.reduce((acc, p) => acc + (p.stock * (p.price || 0)), 0);
    const lowStock = products.filter(p => p.stock > 0 && p.stock < 10).length;
    const totalSold = products.reduce((acc, p) => acc + (p.sold || 0), 0);
    return { total, lowStock, inventoryValue, totalSold };
  }, [products]);

  const confirmDelete = () => {
    if (deleteConfirmId !== null) {
      db.deleteProduct(deleteConfirmId);
      setDeleteConfirmId(null);
      refreshData();
    }
  };

  const handleBulkDelete = () => {
    if (bulkDeleteConfirm === 'products') {
      db.bulkDeleteProducts(selectedProductIds);
      setSelectedProductIds([]);
    } else if (bulkDeleteConfirm === 'categories') {
      db.bulkDeleteCategories(selectedCategoryIds);
      setSelectedCategoryIds([]);
    }
    setBulkDeleteConfirm(null);
    refreshData();
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      ...product,
      tags: product.tags || [],
      variants: product.variants || [],
      seoKeywords: product.seoKeywords || [],
      seoDescription: product.seoDescription || ''
    });
    setTagInput('');
    setSeoKeywordInput('');
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setEditingProduct(null);
    setFormData({
       name: '',
       brand: '',
       sku: `SKU-${Date.now().toString().slice(-6)}`,
       price: 0,
       category: categories[0]?.name || 'เครื่องใช้ไฟฟ้า',
       stock: 10,
       image: 'https://images.unsplash.com/photo-1556740738-b6a63e27c4df?w=400',
       sold: 0,
       discount: 0,
       isFlashSale: false,
       isFeatured: false,
       tags: [],
       description: '',
       weight: 0,
       dimensions: '',
       variants: [],
       seoUrl: '',
       seoKeywords: [],
       seoDescription: ''
    });
    setTagInput('');
    setSeoKeywordInput('');
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      db.updateProduct({ ...editingProduct, ...formData } as Product);
    } else {
      db.addProduct({ ...formData, id: Date.now(), sold: 0 } as Product);
    }
    setIsModalOpen(false);
    refreshData();
  };

  const updateVariant = (id: string, field: keyof ProductVariant, value: any) => {
    setFormData(prev => ({
      ...prev,
      variants: prev.variants?.map(v => v.id === id ? { ...v, [field]: value } : v)
    }));
  };

  const generateSEO = () => {
    if (!formData.name) return;
    const brandPart = formData.brand ? `${formData.brand}-` : '';
    const slug = `${brandPart}${formData.name}`.toLowerCase().trim().replace(/[^\w\sก-๙\-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-');
    let finalDesc = (formData.seoDescription || '').trim();
    if (!finalDesc) {
      finalDesc = (formData.description || '').replace(/<[^>]*>?/gm, '').substring(0, 150) + '...';
    }
    setFormData(prev => ({ ...prev, seoUrl: slug, seoDescription: finalDesc.substring(0, 160) }));
  };

  const processedProducts = useMemo(() => {
    let result = [...products];
    if (selectedCategoryFilter !== 'All') result = result.filter(p => p.category === selectedCategoryFilter);
    if (filterStock === 'low') result = result.filter(p => p.stock > 0 && p.stock < 10);
    if (filterStock === 'out') result = result.filter(p => p.stock === 0);
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      result = result.filter(p => p.name.toLowerCase().includes(lowerQuery) || p.brand?.toLowerCase().includes(lowerQuery) || p.sku?.toLowerCase().includes(lowerQuery));
    }
    return result;
  }, [products, selectedCategoryFilter, filterStock, searchQuery]);

  const handleInlineStockUpdate = (product: Product, newStock: number) => {
    if (newStock < 0) newStock = 0;
    const updatedProduct = { ...product, stock: newStock };
    setProducts(prev => prev.map(p => p.id === product.id ? updatedProduct : p));
    db.updateProduct(updatedProduct);
  };

  const executeSql = () => {
    if (!sqlCommand.trim()) return;
    setIsExecutingSql(true);
    setSqlLog(prev => [...prev, `> ${sqlCommand}`]);
    
    setTimeout(() => {
      setIsExecutingSql(false);
      const lowerCmd = sqlCommand.toLowerCase();
      if (lowerCmd.includes('select')) {
        let results = [...products];
        if (lowerCmd.includes('where stock < 10')) results = products.filter(p => p.stock < 10);
        setSqlResult(results.slice(0, 5));
        setSqlLog(prev => [...prev, `Success: ${results.length} rows returned.`]);
      } else {
        setSqlLog(prev => [...prev, `Error: Operation not permitted in read-only console.`]);
      }
    }, 600);
  };

  const toggleSelectAllProducts = () => {
    if (selectedProductIds.length === processedProducts.length) setSelectedProductIds([]);
    else setSelectedProductIds(processedProducts.map(p => p.id));
  };

  const toggleSelectOneProduct = (id: number) => {
    setSelectedProductIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const toggleSelectAllCategories = () => {
    if (selectedCategoryIds.length === categories.length) setSelectedCategoryIds([]);
    else setSelectedCategoryIds(categories.map(c => c.id));
  };

  const toggleSelectOneCategory = (id: number) => {
    setSelectedCategoryIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const handleBulkCategoryAction = (action: 'enable' | 'disable' | 'delete') => {
    if (action === 'enable') {
      db.bulkUpdateCategoryStatus(selectedCategoryIds, true);
      setSelectedCategoryIds([]);
    } else if (action === 'disable') {
      db.bulkUpdateCategoryStatus(selectedCategoryIds, false);
      setSelectedCategoryIds([]);
    } else if (action === 'delete') {
      setBulkDeleteConfirm('categories');
    }
    refreshData();
  };

  return (
    <div className="flex h-screen bg-[#f1f5f9] text-slate-800 font-sans overflow-hidden">
      {/* Sidebar Navigation */}
      <aside className="w-80 bg-[#001f3f] text-white flex flex-col shadow-2xl shrink-0 hidden lg:flex relative z-30">
        <div className="p-10 border-b border-white/10">
          <div className="flex items-center gap-4">
             <div className="bg-blue-600 p-3 rounded-2xl shadow-lg shadow-blue-500/20">
               <Database size={28} className="text-white" />
             </div>
             <div>
               <div className="font-black text-2xl tracking-tighter uppercase leading-none">WAREE</div>
               <div className="text-[10px] text-blue-400 font-black tracking-[0.4em] uppercase opacity-60 mt-2">Core Registry</div>
             </div>
          </div>
        </div>
        <nav className="flex-1 p-8 space-y-3 mt-6">
          <button onClick={() => setActiveTab('products')} className={`w-full flex items-center gap-4 px-6 py-5 rounded-[2rem] transition-all group ${activeTab === 'products' ? 'bg-blue-600 text-white shadow-2xl shadow-blue-600/30' : 'text-blue-200/50 hover:bg-white/5 hover:text-white'}`}>
            <Package size={22} className={activeTab === 'products' ? 'animate-pulse' : ''} /> 
            <span className="font-black text-sm uppercase tracking-widest">Product Matrix</span>
          </button>
          <button onClick={() => setActiveTab('categories')} className={`w-full flex items-center gap-4 px-6 py-5 rounded-[2rem] transition-all group ${activeTab === 'categories' ? 'bg-blue-600 text-white shadow-2xl shadow-blue-600/30' : 'text-blue-200/50 hover:bg-white/5 hover:text-white'}`}>
            <List size={22} /> 
            <span className="font-black text-sm uppercase tracking-widest">Taxonomy Hub</span>
          </button>
          <button onClick={() => setActiveTab('database')} className={`w-full flex items-center gap-4 px-6 py-5 rounded-[2rem] transition-all group ${activeTab === 'database' ? 'bg-blue-600 text-white shadow-2xl shadow-blue-600/30' : 'text-blue-200/50 hover:bg-white/5 hover:text-white'}`}>
            <Terminal size={22} /> 
            <span className="font-black text-sm uppercase tracking-widest">SQL Terminal</span>
          </button>
        </nav>
        <div className="p-10 border-t border-white/10 bg-black/10">
           <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-[1.5rem] bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center font-black text-xl border border-white/20 shadow-lg">A</div>
              <div>
                <div className="text-xs font-black uppercase tracking-widest">Root Architect</div>
                <div className="text-[9px] text-blue-400/50 font-black uppercase tracking-tighter mt-1 flex items-center gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></div> Online Status
                </div>
              </div>
           </div>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto bg-[#f8fafc] flex flex-col no-scrollbar scroll-smooth">
        {activeTab === 'products' && (
          <div className="p-10 space-y-10">
            <header className="flex justify-between items-center bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100">
                <div>
                  <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-none mb-3">Inventory Matrix</h1>
                  <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.5em] flex items-center gap-2">
                    <Archive size={14} /> Master Registry Control
                  </p>
                </div>
                <div className="flex items-center gap-4">
                    {selectedProductIds.length > 0 && (
                      <div className="flex items-center gap-3 bg-slate-50 px-6 py-3 rounded-2xl border border-slate-100 animate-in slide-in-from-right">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mr-2">{selectedProductIds.length} Selected</span>
                        <button onClick={() => setBulkDeleteConfirm('products')} className="text-red-500 hover:bg-red-50 p-2 rounded-lg" title="Bulk Delete">
                          <Trash size={20} />
                        </button>
                      </div>
                    )}
                    <button onClick={handleAddNew} className="bg-blue-600 text-white px-10 py-5 rounded-[2rem] font-black text-xs uppercase tracking-widest flex items-center gap-3 shadow-2xl shadow-blue-600/30 hover:shadow-blue-600/50 hover:-translate-y-1 transition-all">
                      <PlusCircle size={22} /> New Registry Entry
                    </button>
                </div>
            </header>

            {/* Performance Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {[
                  { label: "Density", value: stats.total, icon: Box, color: "blue" },
                  { label: "Critical", value: stats.lowStock, icon: AlertCircle, color: "red" },
                  { label: "Velocity", value: stats.totalSold, icon: BarChart3, color: "emerald" },
                  { label: "Equity", value: `฿${(stats.inventoryValue / 1000000).toFixed(1)}M`, icon: Zap, color: "amber" }
                ].map((card, i) => (
                  <div key={i} className="bg-white p-8 rounded-[3rem] border border-slate-200 shadow-soft flex items-center gap-6">
                      <div className={`w-16 h-16 bg-${card.color}-50 text-${card.color}-600 rounded-[1.5rem] flex items-center justify-center shadow-inner`}>
                          <card.icon size={28} />
                      </div>
                      <div>
                          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-2">{card.label}</div>
                          <div className="text-3xl font-black text-slate-900 leading-tight">{card.value}</div>
                      </div>
                  </div>
                ))}
            </div>

            {/* Product Table */}
            <div className="bg-white rounded-[4rem] shadow-2xl border border-slate-100 overflow-hidden">
                <div className="px-10 py-8 border-b bg-slate-50/50 flex gap-6 items-center">
                    <div className="relative flex-1 group">
                        <Search size={20} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-colors" />
                        <input type="text" placeholder="Query Matrix..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full bg-white border border-slate-200 pl-14 pr-8 py-5 rounded-[2rem] text-sm font-bold outline-none focus:ring-8 focus:ring-blue-500/5 shadow-inner" />
                    </div>
                    <select value={selectedCategoryFilter} onChange={e => setSelectedCategoryFilter(e.target.value)} className="bg-white border border-slate-200 px-8 py-5 rounded-[2rem] text-xs font-black uppercase tracking-widest outline-none shadow-sm cursor-pointer hover:bg-slate-50 transition-all">
                      <option value="All">All Clusters</option>
                      {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                    </select>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-50 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
                            <tr>
                                <th className="px-10 py-8 w-12 text-center border-b">
                                  <button onClick={toggleSelectAllProducts} className="text-blue-600">
                                    {selectedProductIds.length === processedProducts.length && processedProducts.length > 0 ? <CheckSquare size={24} /> : <Square size={24} />}
                                  </button>
                                </th>
                                <th className="px-10 py-8 border-b">Product Hierarchy</th>
                                <th className="px-10 py-8 border-b">Logistics</th>
                                <th className="px-10 py-8 border-b text-right">Unit Point</th>
                                <th className="px-10 py-8 border-b text-center">Engine</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {processedProducts.map(p => (
                                <tr key={p.id} className="group hover:bg-blue-50/20 transition-all">
                                    <td className="px-10 py-6 text-center">
                                      <button onClick={() => toggleSelectOneProduct(p.id)} className="text-blue-600">
                                        {selectedProductIds.includes(p.id) ? <CheckSquare size={20} /> : <Square size={20} className="text-slate-200" />}
                                      </button>
                                    </td>
                                    <td className="px-10 py-6">
                                        <div className="flex items-center gap-6">
                                            <div className="w-16 h-16 rounded-[1.5rem] bg-slate-50 p-2 border border-slate-100 shrink-0 overflow-hidden relative">
                                                <img src={p.image} className="w-full h-full object-contain mix-blend-multiply" alt={p.name} />
                                                {p.isFeatured && <div className="absolute top-0 right-0 bg-amber-400 text-white p-1 rounded-bl-xl shadow-sm"><Star size={10} fill="currentColor" /></div>}
                                            </div>
                                            <div>
                                                <div className="font-black text-slate-900 text-sm leading-none mb-2">{p.name}</div>
                                                <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{p.sku} | {p.category}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-10 py-6">
                                        <div className="flex flex-col gap-2">
                                          <div className={`text-[8px] font-black uppercase px-2 py-1 rounded w-fit ${p.stock < 10 ? 'bg-red-500 text-white' : 'bg-emerald-500 text-white'}`}>
                                            {p.stock < 10 ? 'Low Stock' : 'Optimal'}
                                          </div>
                                          <input type="number" min="0" className="w-20 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs font-black text-center" value={p.stock} onChange={(e) => handleInlineStockUpdate(p, parseInt(e.target.value) || 0)} />
                                        </div>
                                    </td>
                                    <td className="px-10 py-6 text-right">
                                        <div className="font-black text-slate-900 text-xl tracking-tighter">฿{p.price.toLocaleString()}</div>
                                    </td>
                                    <td className="px-10 py-6">
                                        <div className="flex justify-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300">
                                            <button onClick={() => handleEdit(p)} className="p-4 bg-blue-50 text-blue-600 rounded-[1.5rem] hover:bg-blue-600 hover:text-white transition-all shadow-sm"><Edit size={18} /></button>
                                            <button onClick={() => setDeleteConfirmId(p.id)} className="p-4 bg-red-50 text-red-600 rounded-[1.5rem] hover:bg-red-600 hover:text-white transition-all shadow-sm"><Trash2 size={18} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
          </div>
        )}

        {activeTab === 'categories' && (
          <div className="p-10 space-y-10 animate-in fade-in">
             <header className="flex justify-between items-center bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100">
                <div>
                  <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-none mb-3">Taxonomy Hub</h1>
                  <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.5em] flex items-center gap-2">
                    <List size={14} /> Global Taxonomy Structure
                  </p>
                </div>
                <div className="flex items-center gap-4">
                    {selectedCategoryIds.length > 0 && (
                      <div className="flex items-center gap-2 bg-slate-50 px-6 py-3 rounded-2xl border border-slate-100">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mr-4">{selectedCategoryIds.length} Selected</span>
                        <div className="flex gap-1">
                          <button onClick={() => handleBulkCategoryAction('enable')} className="p-2.5 text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all" title="Enable Selection"><Eye size={20} /></button>
                          <button onClick={() => handleBulkCategoryAction('disable')} className="p-2.5 text-amber-600 hover:bg-amber-50 rounded-xl transition-all" title="Disable Selection"><EyeOff size={20} /></button>
                          <button onClick={() => handleBulkCategoryAction('delete')} className="p-2.5 text-red-600 hover:bg-red-50 rounded-xl transition-all" title="Delete Selection"><Trash size={20} /></button>
                        </div>
                      </div>
                    )}
                    <button onClick={() => setIsCategoryModalOpen(true)} className="bg-blue-600 text-white px-10 py-5 rounded-[2rem] font-black text-xs uppercase tracking-widest flex items-center gap-3 shadow-2xl hover:shadow-blue-600/50 transition-all">
                      <Plus size={22} /> Create New Cluster
                    </button>
                </div>
             </header>

             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {categories.map(cat => (
                  <div key={cat.id} className={`bg-white p-8 rounded-[3.5rem] border shadow-soft flex flex-col items-center gap-6 group hover:border-blue-300 transition-all ${selectedCategoryIds.includes(cat.id) ? 'border-blue-500 ring-8 ring-blue-500/5 bg-blue-50/5' : 'border-slate-100'}`}>
                    <div className="flex justify-between w-full">
                       <button onClick={() => toggleSelectOneCategory(cat.id)} className="text-blue-600">
                          {selectedCategoryIds.includes(cat.id) ? <CheckSquare size={28} /> : <Square size={28} className="text-slate-100 group-hover:text-slate-200" />}
                       </button>
                       <div className={`w-3.5 h-3.5 rounded-full ${cat.isActive !== false ? 'bg-emerald-500' : 'bg-slate-200'}`}></div>
                    </div>
                    <div className={`w-32 h-32 rounded-[2.5rem] overflow-hidden border-8 border-slate-50 shadow-inner group-hover:scale-105 transition-all ${cat.isActive === false ? 'grayscale opacity-50' : ''}`}>
                      <img src={cat.icon} className="w-full h-full object-cover" alt={cat.name} />
                    </div>
                    <div className="text-center">
                      <div className="font-black text-slate-900 text-xl uppercase tracking-tighter leading-tight mb-2">{cat.name}</div>
                      <div className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">{products.filter(p => p.category === cat.name).length} Nodes Assigned</div>
                    </div>
                    <div className="flex gap-3 w-full pt-6 border-t border-slate-50">
                      <button onClick={() => { setEditingCategory(cat); setCategoryFormData(cat); setIsCategoryModalOpen(true); }} className="flex-1 flex items-center justify-center gap-2 py-4 bg-slate-50 text-slate-900 rounded-[1.5rem] hover:bg-blue-600 hover:text-white transition-all font-black text-[10px] uppercase tracking-widest">
                        <Edit size={16} /> Edit
                      </button>
                      <button onClick={() => db.deleteCategory(cat.id)} className="p-4 bg-red-50 text-red-600 rounded-[1.5rem] hover:bg-red-600 hover:text-white transition-all shadow-sm"><Trash2 size={16} /></button>
                    </div>
                  </div>
                ))}
             </div>
          </div>
        )}

        {activeTab === 'database' && (
          <div className="p-10 space-y-10 animate-in fade-in">
             <header className="flex justify-between items-center bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100">
                <div>
                  <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-none mb-3">SQL Terminal</h1>
                  <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.5em] flex items-center gap-2">
                    <Terminal size={14} /> Advanced Query Engine
                  </p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 px-6 py-4 bg-emerald-50 text-emerald-600 rounded-2xl border border-emerald-100 font-black text-[10px] uppercase tracking-widest">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div> DB Status: Connected
                    </div>
                </div>
             </header>

             <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* SQL Input Area */}
                <div className="lg:col-span-7 flex flex-col gap-6">
                   <div className="bg-[#1e293b] rounded-[3rem] shadow-2xl p-8 flex flex-col border border-slate-700/50">
                      <div className="flex items-center justify-between mb-6 border-b border-slate-700/50 pb-6 px-4">
                         <div className="flex items-center gap-3">
                            <div className="flex gap-1.5">
                               <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                               <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
                               <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
                            </div>
                            <span className="text-slate-400 font-mono text-xs ml-4">Registry_Sequence_Compiler.sh</span>
                         </div>
                         <div className="flex items-center gap-4">
                            <button onClick={() => setSqlCommand("")} className="text-slate-500 hover:text-white transition-colors" title="Clear Console"><RotateCcw size={16} /></button>
                            <button onClick={executeSql} disabled={isExecutingSql} className="bg-blue-600 hover:bg-blue-500 disabled:bg-slate-600 text-white px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] flex items-center gap-3 shadow-xl transition-all active:scale-95">
                               {isExecutingSql ? <RotateCcw size={16} className="animate-spin" /> : <Play size={16} />} Execute Sequence
                            </button>
                         </div>
                      </div>
                      
                      <div className="flex-1 bg-black/30 rounded-2xl p-6 mb-6">
                        <textarea 
                          value={sqlCommand} 
                          onChange={(e) => setSqlCommand(e.target.value)}
                          className="w-full bg-transparent text-emerald-400 font-mono text-sm resize-none outline-none h-48 leading-relaxed" 
                          spellCheck="false"
                        />
                      </div>

                      <div className="bg-black/50 rounded-2xl p-6 h-64 overflow-y-auto font-mono text-[11px] no-scrollbar">
                         {sqlLog.map((log, i) => (
                           <div key={i} className={`mb-2 ${log.startsWith('>') ? 'text-blue-400' : log.startsWith('Error') ? 'text-red-400' : 'text-slate-400'}`}>
                              {log}
                           </div>
                         ))}
                         <div ref={terminalEndRef} />
                      </div>
                   </div>
                </div>

                {/* SQL Result Visualization */}
                <div className="lg:col-span-5 space-y-8">
                   <div className="bg-white rounded-[3rem] p-10 shadow-sm border border-slate-200">
                      <h4 className="text-[11px] font-black text-blue-600 uppercase tracking-[0.5em] mb-8 flex items-center gap-3">
                         <Layers size={20} /> Matrix Projection
                      </h4>
                      {sqlResult.length > 0 ? (
                        <div className="space-y-6">
                           {sqlResult.map(res => (
                             <div key={res.id} className="flex items-center gap-6 p-4 hover:bg-slate-50 rounded-2xl border border-slate-100 transition-all group">
                                <div className="w-12 h-12 rounded-xl bg-slate-50 p-1 border border-slate-100 shrink-0">
                                   <img src={res.image} className="w-full h-full object-contain mix-blend-multiply" />
                                </div>
                                <div className="flex-1 min-w-0">
                                   <div className="font-black text-slate-900 text-xs truncate uppercase tracking-tight">{res.name}</div>
                                   <div className="text-[9px] text-slate-400 font-black uppercase tracking-widest mt-1">Stock: {res.stock} Unit Node</div>
                                </div>
                             </div>
                           ))}
                        </div>
                      ) : (
                        <div className="h-64 flex flex-col items-center justify-center text-slate-300">
                           <Code size={48} className="mb-4 opacity-20" />
                           <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">No active matrix projection</p>
                        </div>
                      )}
                   </div>

                   <div className="bg-[#001f3f] rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
                      <h4 className="text-[11px] font-black text-blue-400 uppercase tracking-[0.5em] mb-6 relative z-10">Data Integrity System</h4>
                      <p className="text-blue-100/60 text-xs leading-relaxed mb-8 relative z-10 font-medium">ทุกการเปลี่ยนแปลงจะถูกบันทึกเข้าสู่ Global Core Registry โดยอัตโนมัติ กรุณาตรวจสอบ Query ก่อนทำการ Execute</p>
                      <button className="w-full bg-white/10 hover:bg-white/20 border border-white/10 text-white rounded-[2rem] py-5 text-[10px] font-black uppercase tracking-[0.4em] transition-all relative z-10 active:scale-95 flex items-center justify-center gap-3">
                        <RotateCcw size={16} /> Re-Sync Matrix
                      </button>
                   </div>
                </div>
             </div>
          </div>
        )}

        {/* Global Confirmation Modal */}
        {(deleteConfirmId || bulkDeleteConfirm) && (
          <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-xl z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
             <div className="bg-white p-16 rounded-[5rem] text-center max-w-md border border-white/20 shadow-2xl animate-in zoom-in duration-500">
                <div className="w-24 h-24 bg-red-50 text-red-500 rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 shadow-inner">
                  <ShieldAlert size={56} strokeWidth={1.5} />
                </div>
                <h3 className="text-4xl font-black mb-4 tracking-tighter uppercase leading-none text-slate-900">Purge Request</h3>
                <p className="text-slate-500 text-sm mb-12 font-bold leading-relaxed uppercase tracking-widest">
                  {bulkDeleteConfirm 
                    ? `Permanent removal of ${bulkDeleteConfirm === 'products' ? selectedProductIds.length : selectedCategoryIds.length} registry clusters in progress.` 
                    : 'A single SKU record is about to be terminated from the global matrix.'
                  }
                </p>
                <div className="flex gap-4">
                   <button 
                    onClick={() => { setDeleteConfirmId(null); setBulkDeleteConfirm(null); }} 
                    className="flex-1 px-10 py-6 bg-slate-100 rounded-[2.5rem] font-black text-[11px] uppercase tracking-[0.4em] text-slate-600 hover:bg-slate-200 transition-all"
                   >
                    Abort
                   </button>
                   <button 
                    onClick={bulkDeleteConfirm ? handleBulkDelete : confirmDelete} 
                    className="flex-1 px-10 py-6 bg-red-600 text-white rounded-[2.5rem] font-black text-[11px] uppercase tracking-[0.4em] shadow-2xl shadow-red-500/40 active:scale-95 hover:bg-red-700 transition-all"
                   >
                    Terminate
                   </button>
                </div>
             </div>
          </div>
        )}

        {/* Modular Product Registry Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-2xl flex items-center justify-center z-[60] p-10 overflow-y-auto no-scrollbar">
             <div className="bg-white rounded-[5rem] shadow-2xl w-full max-w-7xl mx-auto overflow-hidden animate-in zoom-in duration-500 flex flex-col max-h-[90vh] border border-white/20">
                <header className="bg-[#001f3f] p-12 text-white flex justify-between items-center relative overflow-hidden shrink-0">
                   <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-transparent"></div>
                   <div className="flex items-center gap-8 relative z-10">
                     <div className="p-5 bg-white/10 rounded-[2.5rem] backdrop-blur-md border border-white/10 shadow-2xl"><Package size={42} /></div>
                     <div>
                      <h2 className="text-4xl font-black tracking-tighter uppercase leading-none">{editingProduct ? 'Modify Registry' : 'Initialize Matrix'}</h2>
                      <p className="text-[10px] text-blue-400 font-black uppercase tracking-[0.5em] mt-4 opacity-70">Core Logic Version 4.0.2</p>
                     </div>
                   </div>
                   <button onClick={() => setIsModalOpen(false)} className="hover:bg-white/10 p-5 rounded-full transition-all relative z-10 border border-white/10 group"><X size={42} className="group-hover:rotate-90 transition-transform" /></button>
                </header>

                <form onSubmit={handleSubmit} className="p-16 overflow-y-auto no-scrollbar bg-slate-50 flex-1">
                   <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
                      <div className="space-y-12">
                         <section>
                            <h4 className="text-[11px] font-black text-blue-600 uppercase tracking-[0.5em] mb-8 flex items-center gap-3">
                               <Info size={16} /> Data Fundamentals
                            </h4>
                            <div className="space-y-8">
                               <div>
                                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-3 ml-2 tracking-widest">Global Descriptor</label>
                                  <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-white border border-slate-200 rounded-[2rem] px-8 py-5 text-sm font-black text-slate-900 outline-none focus:ring-8 focus:ring-blue-500/5 transition-all shadow-sm" required />
                               </div>
                               <div className="grid grid-cols-2 gap-6">
                                  <div>
                                     <label className="block text-[10px] font-black text-slate-400 uppercase mb-3 ml-2 tracking-widest">Brand OEM</label>
                                     <input type="text" value={formData.brand} onChange={e => setFormData({...formData, brand: e.target.value})} className="w-full bg-white border border-slate-200 rounded-[2rem] px-6 py-5 text-sm font-bold outline-none" />
                                  </div>
                                  <div>
                                     <label className="block text-[10px] font-black text-slate-400 uppercase mb-3 ml-2 tracking-widest">Registry SKU</label>
                                     <input type="text" value={formData.sku} onChange={e => setFormData({...formData, sku: e.target.value})} className="w-full bg-white border border-slate-200 rounded-[2rem] px-6 py-5 text-xs font-mono font-black outline-none" required />
                                  </div>
                               </div>
                               <div className="grid grid-cols-2 gap-6">
                                  <div>
                                     <label className="block text-[10px] font-black text-slate-400 uppercase mb-3 ml-2 tracking-widest">Cluster Node</label>
                                     <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full bg-white border border-slate-200 rounded-[2rem] px-6 py-5 text-xs font-black uppercase tracking-widest outline-none shadow-sm">
                                       {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                                     </select>
                                  </div>
                                  <div>
                                     <label className="block text-[10px] font-black text-slate-400 uppercase mb-3 ml-2 tracking-widest">Base Price (฿)</label>
                                     <input type="number" value={formData.price} onChange={e => setFormData({...formData, price: Number(e.target.value)})} className="w-full bg-white border border-slate-200 rounded-[2rem] px-6 py-5 text-sm font-black text-blue-600 outline-none" required />
                                  </div>
                               </div>
                               <div>
                                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-3 ml-2 tracking-widest">Visual Asset Source (URL)</label>
                                  <input type="text" value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} className="w-full bg-white border border-slate-200 rounded-[2rem] px-8 py-5 text-[10px] font-mono outline-none" />
                               </div>
                            </div>
                         </section>

                         <section>
                            <h4 className="text-[11px] font-black text-amber-600 uppercase tracking-[0.5em] mb-8 flex items-center gap-3">
                               <Truck size={16} /> Physical Logistics
                            </h4>
                            <div className="bg-amber-50/50 p-10 rounded-[3rem] border border-amber-100/50 space-y-8">
                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-[9px] font-black text-amber-700/50 uppercase mb-3 tracking-widest">Weight (kg)</label>
                                        <input type="number" value={formData.weight} onChange={e => setFormData({...formData, weight: Number(e.target.value)})} className="w-full bg-white border border-amber-100 rounded-[1.5rem] px-6 py-4 text-xs font-black outline-none" />
                                    </div>
                                    <div>
                                        <label className="block text-[9px] font-black text-amber-700/50 uppercase mb-3 tracking-widest">Volume Specs</label>
                                        <input type="text" placeholder="W x H x D" value={formData.dimensions} onChange={e => setFormData({...formData, dimensions: e.target.value})} className="w-full bg-white border border-amber-100 rounded-[1.5rem] px-6 py-4 text-xs font-black outline-none" />
                                    </div>
                                </div>
                                <div>
                                    <div className="flex items-center justify-between bg-white px-6 py-4 rounded-[1.5rem] border border-amber-100">
                                        <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest">Prominent Placement</span>
                                        <button type="button" onClick={() => setFormData({...formData, isFeatured: !formData.isFeatured})} className={`w-14 h-8 rounded-full transition-all relative ${formData.isFeatured ? 'bg-amber-500 shadow-lg shadow-amber-500/20' : 'bg-slate-200'}`}>
                                            <div className={`absolute top-1.5 w-5 h-5 bg-white rounded-full transition-all shadow-md ${formData.isFeatured ? 'left-8' : 'left-1.5'}`} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                         </section>
                      </div>

                      <div className="lg:col-span-2 space-y-12">
                         <section className="bg-white rounded-[4rem] p-12 border border-slate-200 shadow-sm flex flex-col min-h-[500px]">
                            <div className="flex justify-between items-center mb-10">
                                <h4 className="text-[11px] font-black text-blue-600 uppercase tracking-[0.5em] flex items-center gap-3">
                                   <Layers size={20} /> Matrix Variant Controller
                                </h4>
                                <button type="button" onClick={() => { const newV: ProductVariant = { id: `v-${Date.now()}`, name: '', sku: `${formData.sku || 'SKU'}-${(formData.variants?.length || 0) + 1}`, price: formData.price || 0, stock: 0 }; setFormData(prev => ({ ...prev, variants: [...(prev.variants || []), newV] })); }} className="bg-blue-600 text-white px-8 py-4 rounded-[1.5rem] font-black text-[10px] uppercase tracking-[0.2em] flex items-center gap-3 shadow-xl hover:scale-105 transition-all">
                                   <Plus size={16} strokeWidth={3} /> Initialize Variant
                                </button>
                            </div>
                            
                            <div className="flex-1 space-y-6">
                               {formData.variants && formData.variants.length > 0 ? (
                                  formData.variants.map((v) => (
                                    <div key={v.id} className="bg-slate-50/50 rounded-[2.5rem] p-8 border border-slate-100 relative group animate-in slide-in-from-bottom-4">
                                        <button type="button" onClick={() => setFormData(prev => ({ ...prev, variants: prev.variants?.filter(x => x.id !== v.id) }))} className="absolute -top-3 -right-3 bg-red-500 text-white rounded-2xl p-3 opacity-0 group-hover:opacity-100 transition-all shadow-xl hover:scale-110"><Trash2 size={20} /></button>
                                        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                                            <div>
                                              <label className="block text-[9px] font-black text-slate-400 uppercase mb-3 tracking-widest">Descriptor</label>
                                              <input type="text" value={v.name} placeholder="Finish..." onChange={e => updateVariant(v.id, 'name', e.target.value)} className="w-full bg-white border border-slate-200 rounded-xl px-5 py-4 text-xs font-black outline-none" />
                                            </div>
                                            <div>
                                              <label className="block text-[9px] font-black text-slate-400 uppercase mb-3 tracking-widest">SKU Instance</label>
                                              <input type="text" value={v.sku} onChange={e => updateVariant(v.id, 'sku', e.target.value)} className="w-full bg-white border border-slate-200 rounded-xl px-5 py-4 text-xs font-mono font-black outline-none" />
                                            </div>
                                            <div>
                                              <label className="block text-[9px] font-black text-slate-400 uppercase mb-3 tracking-widest">MSRP (฿)</label>
                                              <input type="number" value={v.price} onChange={e => updateVariant(v.id, 'price', Number(e.target.value))} className="w-full bg-white border border-slate-200 rounded-xl px-5 py-4 text-xs font-black text-blue-600 outline-none" />
                                            </div>
                                            <div>
                                              <label className="block text-[9px] font-black text-slate-400 uppercase mb-3 tracking-widest">Stock</label>
                                              <input type="number" value={v.stock} onChange={e => updateVariant(v.id, 'stock', Number(e.target.value))} className="w-full bg-white border border-slate-200 rounded-xl px-5 py-4 text-xs font-black outline-none" />
                                            </div>
                                        </div>
                                    </div>
                                  ))
                               ) : (
                                  <div className="h-full flex flex-col items-center justify-center py-20 bg-slate-50/50 rounded-[3rem] border border-dashed border-slate-200">
                                      <Layers size={64} className="text-slate-200 mb-6" />
                                      <p className="font-black text-[10px] uppercase tracking-[0.4em] text-slate-300">Standalone Matrix Instance</p>
                                  </div>
                                )}
                            </div>
                         </section>

                         <section>
                            <div className="flex justify-between items-end mb-8">
                                <h4 className="text-[11px] font-black text-emerald-600 uppercase tracking-[0.5em] flex items-center gap-3">
                                   <Globe size={20} /> SEO Engine
                                </h4>
                                <button type="button" onClick={generateSEO} className="bg-emerald-600 text-white px-8 py-3.5 rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-3 shadow-lg hover:scale-105 transition-all">
                                   <Wand2 size={16} /> Re-Calculate Metadata
                                </button>
                            </div>
                            <div className="bg-emerald-50/50 p-12 rounded-[4rem] border border-emerald-100/50 grid grid-cols-1 md:grid-cols-2 gap-12">
                                <div className="space-y-8">
                                    <div>
                                        <label className="block text-[9px] font-black text-emerald-600 uppercase mb-3 tracking-widest">Optimized URL ID</label>
                                        <input type="text" value={formData.seoUrl} onChange={e => setFormData({...formData, seoUrl: e.target.value})} className="w-full bg-white border border-emerald-100 rounded-[1.5rem] px-6 py-4 text-xs font-mono outline-none" />
                                    </div>
                                    <div>
                                        <label className="block text-[9px] font-black text-emerald-600 uppercase mb-3 tracking-widest">Search Keywords</label>
                                        <div className="flex flex-wrap gap-2 pt-2">
                                            {formData.seoKeywords?.map(k => (
                                                <span key={k} className="bg-emerald-600 text-white px-4 py-2 rounded-xl text-[8px] font-black uppercase tracking-widest">{k}</span>
                                            ))}
                                            <input type="text" placeholder="+ Keyword" value={seoKeywordInput} onChange={e => setSeoKeywordInput(e.target.value)} onKeyDown={e => { if(e.key === 'Enter') { e.preventDefault(); if(seoKeywordInput.trim()) setFormData(prev => ({...prev, seoKeywords: [...(prev.seoKeywords || []), seoKeywordInput.trim()]})); setSeoKeywordInput(''); } }} className="bg-transparent border-none text-[9px] font-black outline-none placeholder:text-emerald-300/50 min-w-[80px]" />
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-[9px] font-black text-emerald-600 uppercase mb-3 tracking-widest">Description Snapshot</label>
                                    <textarea value={formData.seoDescription} onChange={e => setFormData({...formData, seoDescription: e.target.value})} maxLength={160} className="w-full bg-white border border-emerald-100 rounded-[2rem] p-6 text-[10px] leading-relaxed font-bold text-slate-600 h-32 resize-none outline-none shadow-inner" placeholder="Metadata snippet..." />
                                </div>
                            </div>
                         </section>
                      </div>
                   </div>

                   <div className="mt-20 pt-12 border-t border-slate-200 flex justify-end items-center gap-10">
                      <button type="button" onClick={() => setIsModalOpen(false)} className="font-black text-[11px] uppercase tracking-[0.5em] text-slate-400 hover:text-slate-900 transition-colors">Discard Sequence</button>
                      <button type="submit" className="bg-[#001f3f] text-white px-20 py-8 rounded-[3rem] font-black text-[12px] uppercase tracking-[0.5em] shadow-2xl shadow-blue-900/40 hover:-translate-y-2 transition-all flex items-center gap-4 border border-white/10 active:scale-95">
                         <Save size={24} strokeWidth={3} /> Commit to Registry Matrix
                      </button>
                   </div>
                </form>
             </div>
          </div>
        )}

        {/* Category Creation Modal */}
        {isCategoryModalOpen && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-2xl flex items-center justify-center z-[60] p-10 overflow-y-auto no-scrollbar">
             <div className="bg-white rounded-[5rem] shadow-2xl w-full max-w-2xl mx-auto overflow-hidden animate-in zoom-in duration-500 flex flex-col border border-white/20">
                <header className="bg-[#001f3f] p-10 text-white flex justify-between items-center relative overflow-hidden shrink-0">
                   <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-transparent"></div>
                   <div className="flex items-center gap-6 relative z-10">
                     <div className="p-4 bg-white/10 rounded-[2rem] backdrop-blur-md border border-white/10 shadow-2xl"><List size={32} /></div>
                     <div>
                      <h2 className="text-3xl font-black tracking-tighter uppercase leading-none">{editingCategory ? 'Update Cluster' : 'Define New Cluster'}</h2>
                      <p className="text-[10px] text-blue-400 font-black uppercase tracking-[0.5em] mt-3 opacity-70">Taxonomy Hub v2.0</p>
                     </div>
                   </div>
                   <button onClick={() => { setIsCategoryModalOpen(false); setEditingCategory(null); }} className="hover:bg-white/10 p-4 rounded-full transition-all relative z-10 border border-white/10 group"><X size={32} /></button>
                </header>
                
                <div className="p-12 bg-slate-50">
                   <div className="space-y-8">
                      <div>
                          <label className="block text-[10px] font-black text-slate-400 uppercase mb-3 ml-2 tracking-widest">Cluster Name</label>
                          <input type="text" value={categoryFormData.name} onChange={e => setCategoryFormData({...categoryFormData, name: e.target.value})} className="w-full bg-white border border-slate-200 rounded-[2rem] px-8 py-5 text-sm font-black text-slate-900 outline-none focus:ring-8 focus:ring-blue-500/5 transition-all shadow-sm" placeholder="e.g. Premium Filtration" />
                      </div>
                      <div>
                          <label className="block text-[10px] font-black text-slate-400 uppercase mb-3 ml-2 tracking-widest">Iconography Asset (URL)</label>
                          <input type="text" value={categoryFormData.icon} onChange={e => setCategoryFormData({...categoryFormData, icon: e.target.value})} className="w-full bg-white border border-slate-200 rounded-[2rem] px-8 py-5 text-[10px] font-mono outline-none shadow-sm" placeholder="https://images.unsplash.com/..." />
                      </div>
                      <div className="flex items-center justify-between bg-white px-8 py-5 rounded-[2rem] border border-slate-200 shadow-sm">
                          <div className="flex items-center gap-3">
                             {categoryFormData.isActive ? <CheckCircle2 className="text-emerald-500" size={20} /> : <EyeOff className="text-slate-300" size={20} />}
                             <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Discovery Status: Active</span>
                          </div>
                          <button type="button" onClick={() => setCategoryFormData({...categoryFormData, isActive: !categoryFormData.isActive})} className={`w-14 h-8 rounded-full transition-all relative ${categoryFormData.isActive ? 'bg-emerald-500 shadow-lg shadow-emerald-500/20' : 'bg-slate-200'}`}>
                              <div className={`absolute top-1.5 w-5 h-5 bg-white rounded-full transition-all shadow-md ${categoryFormData.isActive ? 'left-8' : 'left-1.5'}`} />
                          </button>
                      </div>
                   </div>
                   
                   <div className="mt-12 pt-8 border-t border-slate-200 flex justify-end items-center gap-8">
                      <button type="button" onClick={() => { setIsCategoryModalOpen(false); setEditingCategory(null); }} className="font-black text-[10px] uppercase tracking-[0.4em] text-slate-400 hover:text-slate-900 transition-colors">Abort</button>
                      <button 
                        onClick={() => {
                          if (editingCategory) db.updateCategory({ ...editingCategory, ...categoryFormData } as Category);
                          else db.addCategory(categoryFormData);
                          setIsCategoryModalOpen(false);
                          setEditingCategory(null);
                          setCategoryFormData({ name: '', icon: '', isActive: true });
                          refreshData();
                        }}
                        className="bg-[#001f3f] text-white px-12 py-6 rounded-[2.5rem] font-black text-[10px] uppercase tracking-[0.4em] shadow-2xl shadow-blue-900/40 hover:-translate-y-1 transition-all flex items-center gap-4 border border-white/10"
                      >
                         <Save size={18} /> {editingCategory ? 'Commit Cluster' : 'Publish Cluster'}
                      </button>
                   </div>
                </div>
             </div>
          </div>
        )}
      </main>
    </div>
  );
};
