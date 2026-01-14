import React, { useState, useEffect, useMemo } from 'react';
import { db, CATEGORIES } from '../services/mockDb';
import { Product } from '../types';
import { LayoutDashboard, Package, Tag, Settings, Plus, Trash2, Edit, Save, X, ArrowUpDown, ArrowUp, ArrowDown, Filter, Zap, Database, FileDown, Play, Terminal, ChevronLeft, ChevronRight, Search } from 'lucide-react';

export const AdminPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
  // Navigation State
  const [activeTab, setActiveTab] = useState<'products' | 'database'>('products');

  // Sorting State
  const [sortConfig, setSortConfig] = useState<{ key: keyof Product; direction: 'asc' | 'desc' } | null>(null);
  
  // Filter State
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 8;

  // SQL State
  const [sqlQuery, setSqlQuery] = useState("SELECT * FROM products");
  const [queryResult, setQueryResult] = useState<any[] | null>(null);
  const [queryError, setQueryError] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    price: 0,
    category: '',
    stock: 0,
  });

  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = () => {
    setProducts([...db.getProducts()]);
  };

  const handleDelete = (id: number) => {
    if (confirm('คุณแน่ใจหรือไม่ที่จะลบสินค้านี้?')) {
      db.deleteProduct(id);
      refreshData();
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData(product);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setEditingProduct(null);
    setFormData({
       name: '',
       price: 0,
       category: CATEGORIES[0]?.name || 'เฟอร์นิเจอร์',
       stock: 10,
       image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=400', // Default placeholder
       sold: 0,
       discount: 0,
       isFlashSale: false
    });
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

  // Sorting Logic
  const handleSort = (key: keyof Product) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const processedProducts = useMemo(() => {
    let result = [...products];

    // Filter by Category
    if (selectedCategory !== 'All') {
      result = result.filter(p => p.category === selectedCategory);
    }

    // Filter by Search
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(lowerQuery) || 
        p.id.toString().includes(lowerQuery)
      );
    }

    // Sort
    if (!sortConfig) return result;
    
    return result.sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];

      if (aVal === undefined || bVal === undefined) return 0;

      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortConfig.direction === 'asc' 
          ? aVal.localeCompare(bVal, 'th') 
          : bVal.localeCompare(aVal, 'th');
      }
      
      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [products, sortConfig, selectedCategory, searchQuery]);

  // Pagination Logic
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchQuery, products.length]);

  const totalPages = Math.ceil(processedProducts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedProducts = processedProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const SortIndicator = ({ column }: { column: keyof Product }) => {
    if (sortConfig?.key !== column) {
      return <ArrowUpDown size={14} className="ml-1 text-blue-200 inline" />;
    }
    return sortConfig.direction === 'asc' 
      ? <ArrowUp size={14} className="ml-1 text-blue-600 inline" /> 
      : <ArrowDown size={14} className="ml-1 text-blue-600 inline" />;
  };

  // SQL Handlers
  const handleRunQuery = () => {
    setQueryError(null);
    setQueryResult(null);
    try {
        const lowerQ = sqlQuery.trim().toLowerCase();
        
        if (!lowerQ.startsWith('select')) throw new Error("Only SELECT queries are supported in this demo.");
        if (!lowerQ.includes('from products')) throw new Error("Table not found. Try 'FROM products'.");

        let filtered = [...products];

        // Simple WHERE parser
        if (lowerQ.includes('where')) {
            const wherePart = lowerQ.split('where')[1].split('order by')[0].trim();
            if (wherePart.includes('>')) {
                const [field, val] = wherePart.split('>').map(s => s.trim());
                filtered = filtered.filter(p => (p as any)[field] > Number(val));
            } else if (wherePart.includes('<')) {
                const [field, val] = wherePart.split('<').map(s => s.trim());
                filtered = filtered.filter(p => (p as any)[field] < Number(val));
            } else if (wherePart.includes('=')) {
                const [field, val] = wherePart.split('=').map(s => s.trim());
                const cleanVal = val.replace(/['"]/g, '');
                filtered = filtered.filter(p => String((p as any)[field]).toLowerCase() === cleanVal.toLowerCase());
            }
        }

        // Simple ORDER BY parser
        if (lowerQ.includes('order by')) {
            const orderPart = lowerQ.split('order by')[1].trim();
            const parts = orderPart.split(' ');
            const field = parts[0];
            const dir = parts[1] || 'asc';
            const direction = dir === 'desc' ? -1 : 1;
            filtered.sort((a, b) => {
                if ((a as any)[field] > (b as any)[field]) return 1 * direction;
                if ((a as any)[field] < (b as any)[field]) return -1 * direction;
                return 0;
            });
        }
        
        // Simple SELECT Columns
        const selectPart = lowerQ.split('from')[0].replace('select', '').trim();
        if (selectPart !== '*') {
            const columns = selectPart.split(',').map(c => c.trim());
            const mapped = filtered.map(p => {
                const newObj: any = {};
                columns.forEach(c => {
                    if ((p as any)[c] !== undefined) newObj[c] = (p as any)[c];
                });
                return newObj;
            });
            setQueryResult(mapped);
        } else {
            setQueryResult(filtered);
        }

    } catch (err: any) {
        setQueryError(err.message || "Invalid SQL syntax");
    }
  };

  const handleExportSQL = () => {
    const headers = ['id', 'name', 'price', 'category', 'stock', 'sold', 'isFlashSale', 'discount'];
    let sql = `CREATE TABLE products (\n  ${headers.join(' VARCHAR(255),\n  ')} VARCHAR(255)\n);\n\n`;
    
    products.forEach(p => {
      const values = headers.map(h => {
        const val = (p as any)[h];
        if (typeof val === 'string') return `'${val.replace(/'/g, "''")}'`;
        if (typeof val === 'boolean') return val ? 1 : 0;
        return val === undefined ? 'NULL' : val;
      });
      sql += `INSERT INTO products (${headers.join(', ')}) VALUES (${values.join(', ')});\n`;
    });

    const blob = new Blob([sql], { type: 'text/sql' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'homepro_db_dump.sql';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex h-screen bg-slate-50 text-slate-800 font-sans">
      {/* Sidebar - Premium Dark Blue Gradient */}
      <aside className="w-72 bg-gradient-to-b from-[#0f172a] via-[#1e3a8a] to-[#0f172a] text-white flex flex-col shadow-2xl relative overflow-hidden transition-all duration-300 z-20 shrink-0 hidden lg:flex">
        {/* Decorative elements */}
        <div className="absolute -top-20 -right-20 w-48 h-48 bg-blue-500/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>

        {/* Brand */}
        <div className="p-8 pb-6 border-b border-white/10 relative z-10">
          <div className="flex items-center gap-3">
             <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-2.5 rounded-xl shadow-lg shadow-blue-600/30">
                <LayoutDashboard size={24} className="text-white" />
             </div>
             <div>
               <div className="text-xl font-bold tracking-wider text-white leading-none">
                  WAREE<span className="text-blue-400">-TH</span>
               </div>
               <div className="text-[10px] text-blue-200/70 font-medium tracking-widest mt-1">ADMIN SYSTEM</div>
             </div>
          </div>
        </div>

        {/* Menu */}
        <nav className="flex-1 p-5 space-y-2 mt-2 overflow-y-auto no-scrollbar z-10">
          <div className="text-xs font-bold text-blue-300/50 uppercase tracking-widest mb-4 px-3">Main Menu</div>
          
          <button 
            onClick={() => setActiveTab('products')}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 group relative overflow-hidden ${
              activeTab === 'products' 
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/40 translate-x-1' 
              : 'text-blue-100/70 hover:bg-white/5 hover:text-white'
            }`}
          >
            <div className={`absolute left-0 top-0 bottom-0 w-1 bg-blue-300 ${activeTab === 'products' ? 'opacity-100' : 'opacity-0'} transition-opacity`}></div>
            <Package size={20} className={`transition-transform duration-300 ${activeTab === 'products' ? 'scale-110' : 'group-hover:scale-110'}`} /> 
            <span className="font-medium">Product Store</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('database')}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 group relative overflow-hidden ${
              activeTab === 'database' 
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/40 translate-x-1' 
              : 'text-blue-100/70 hover:bg-white/5 hover:text-white'
            }`}
          >
            <div className={`absolute left-0 top-0 bottom-0 w-1 bg-blue-300 ${activeTab === 'database' ? 'opacity-100' : 'opacity-0'} transition-opacity`}></div>
            <Database size={20} className={`transition-transform duration-300 ${activeTab === 'database' ? 'scale-110' : 'group-hover:scale-110'}`} /> 
            <span className="font-medium">SQL Database</span>
            <span className="text-[10px] bg-blue-400/20 text-blue-200 border border-blue-400/30 px-1.5 py-0.5 rounded ml-auto">PRO</span>
          </button>

          <div className="pt-6 mt-6 border-t border-white/5">
             <div className="text-xs font-bold text-blue-300/50 uppercase tracking-widest mb-4 px-3">Applications</div>
             {['Dashboard', 'Orders', 'Settings'].map((item, idx) => {
                 const icons = [LayoutDashboard, Tag, Settings];
                 const Icon = icons[idx];
                 return (
                    <button key={item} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-blue-100/40 cursor-not-allowed hover:bg-white/5 transition-colors group">
                        <Icon size={18} className="group-hover:text-blue-200 transition-colors" /> 
                        <span className="font-medium">{item}</span>
                    </button>
                 )
             })}
          </div>
        </nav>
        
        {/* User Card */}
        <div className="p-4 mx-4 mb-4 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-400 to-indigo-600 flex items-center justify-center text-white font-bold shadow-md border-2 border-white/10">
                    AD
                </div>
                <div>
                    <div className="text-sm font-bold text-white">Administrator</div>
                    <div className="text-xs text-blue-300/80">admin@waree-th.com</div>
                </div>
            </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto relative bg-[#f8fafc] flex flex-col">
        {/* Subtle background decoration */}
        <div className="absolute top-0 left-0 w-full h-80 bg-gradient-to-b from-blue-100/40 to-transparent pointer-events-none"></div>

        {activeTab === 'products' ? (
            <>
                {/* Header */}
                <header className="px-8 py-6 sticky top-0 z-10 flex flex-col md:flex-row justify-between items-start md:items-center backdrop-blur-xl bg-white/80 border-b border-blue-100 shadow-sm transition-all gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Product Management</h1>
                        <p className="text-slate-500 text-sm mt-1">Manage your store inventory and prices</p>
                    </div>
                    
                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <div className="relative group w-full md:w-64">
                            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-blue-500 transition-colors" />
                            <input 
                              type="text" 
                              placeholder="Search..." 
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              className="w-full bg-white border border-blue-200 text-slate-700 pl-10 pr-4 py-2.5 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            />
                        </div>

                        <div className="relative group hidden sm:block">
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="bg-white border border-blue-200 text-slate-700 pl-10 pr-10 py-2.5 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none cursor-pointer hover:border-blue-300"
                            >
                                <option value="All">All Categories</option>
                                {CATEGORIES.map(category => (
                                    <option key={category.id} value={category.name}>{category.name}</option>
                                ))}
                            </select>
                            <Filter size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-blue-400 group-hover:text-blue-500 transition-colors" />
                            <ArrowDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                        </div>

                        <button 
                            onClick={handleAddNew}
                            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white pl-4 pr-5 py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-blue-500/30 transform hover:-translate-y-0.5 whitespace-nowrap"
                        >
                            <Plus size={18} strokeWidth={2.5} /> 
                            <span className="font-medium">Add Product</span>
                        </button>
                    </div>
                </header>

                <div className="p-4 md:p-8 relative z-0 flex-1 overflow-x-auto">
                    <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 overflow-hidden border border-slate-100 min-w-[800px]">
                        <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-50/80 text-slate-600 uppercase text-xs font-bold tracking-wider">
                            <tr>
                            <th 
                                className="p-5 cursor-pointer hover:bg-blue-50/50 transition-colors"
                                onClick={() => handleSort('id')}
                            >
                                <div className="flex items-center gap-2">ID <SortIndicator column="id" /></div>
                            </th>
                            <th 
                                className="p-5 cursor-pointer hover:bg-blue-50/50 transition-colors"
                                onClick={() => handleSort('name')}
                            >
                                <div className="flex items-center gap-2">Product Name <SortIndicator column="name" /></div>
                            </th>
                            <th 
                                className="p-5 cursor-pointer hover:bg-blue-50/50 transition-colors"
                                onClick={() => handleSort('category')}
                            >
                                <div className="flex items-center gap-2">Category <SortIndicator column="category" /></div>
                            </th>
                            <th 
                                className="p-5 text-right cursor-pointer hover:bg-blue-50/50 transition-colors"
                                onClick={() => handleSort('price')}
                            >
                                <div className="flex items-center justify-end gap-2">Price <SortIndicator column="price" /></div>
                            </th>
                            <th 
                                className="p-5 text-center cursor-pointer hover:bg-blue-50/50 transition-colors"
                                onClick={() => handleSort('stock')}
                            >
                                <div className="flex items-center justify-center gap-2">Stock <SortIndicator column="stock" /></div>
                            </th>
                            <th className="p-5 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {paginatedProducts.length > 0 ? (
                            paginatedProducts.map((product) => (
                                <tr key={product.id} className="hover:bg-blue-50/40 transition-colors group">
                                    <td className="p-5 text-slate-500 font-medium text-sm">#{product.id}</td>
                                    <td className="p-5">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-lg overflow-hidden border border-slate-200 shadow-sm flex-shrink-0 bg-white">
                                                <img src={product.image} className="w-full h-full object-contain p-1" alt="" />
                                            </div>
                                            <div className="font-semibold text-slate-800 group-hover:text-blue-600 transition-colors">{product.name}</div>
                                        </div>
                                    </td>
                                    <td className="p-5">
                                        <div className="flex flex-col items-start gap-1">
                                            <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2.5 py-1 rounded-md border border-blue-200">{product.category}</span>
                                            {product.isFlashSale && (
                                                <span className="bg-orange-100 text-orange-600 text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 border border-orange-200">
                                                    <Zap size={10} className="fill-orange-600" /> Flash Sale
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="p-5 text-right">
                                        <div className="font-bold text-slate-800 text-base">฿{product.price.toLocaleString()}</div>
                                        {product.originalPrice && (
                                            <div className="text-xs text-slate-400 line-through">฿{product.originalPrice.toLocaleString()}</div>
                                        )}
                                    </td>
                                    <td className="p-5 text-center">
                                        <span className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-bold border ${
                                            product.stock < 10 
                                            ? 'bg-red-50 text-red-600 border-red-200' 
                                            : 'bg-emerald-50 text-emerald-600 border-emerald-200'
                                        }`}>
                                            {product.stock} units
                                        </span>
                                    </td>
                                    <td className="p-5 text-center">
                                        <div className="flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => handleEdit(product)} className="text-blue-600 hover:bg-blue-100 p-2 rounded-lg transition-colors" title="Edit">
                                            <Edit size={18} />
                                            </button>
                                            <button onClick={() => handleDelete(product.id)} className="text-red-500 hover:bg-red-100 p-2 rounded-lg transition-colors" title="Delete">
                                            <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="p-12 text-center text-slate-400">
                                        <div className="flex flex-col items-center justify-center gap-3">
                                            <Package size={48} className="text-slate-200" />
                                            <p>No products found.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                        </table>
                    </div>

                    {/* Pagination Controls */}
                    {processedProducts.length > 0 && (
                    <div className="flex items-center justify-between mt-6">
                        <p className="text-sm text-slate-500">
                            Showing <span className="font-bold text-slate-700">{startIndex + 1}</span> to <span className="font-bold text-slate-700">{Math.min(startIndex + ITEMS_PER_PAGE, processedProducts.length)}</span> of <span className="font-bold text-slate-700">{processedProducts.length}</span> entries
                        </p>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className="w-9 h-9 flex items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
                            >
                                <ChevronLeft size={18} />
                            </button>
                            <div className="flex gap-1">
                                {Array.from({ length: totalPages }).map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setCurrentPage(i + 1)}
                                        className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-bold transition-all shadow-sm ${
                                            currentPage === i + 1 
                                            ? 'bg-blue-600 text-white shadow-blue-500/30' 
                                            : 'bg-white border border-slate-200 text-slate-600 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200'
                                        }`}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                            </div>
                            <button
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className="w-9 h-9 flex items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
                            >
                                <ChevronRight size={18} />
                            </button>
                        </div>
                    </div>
                    )}
                </div>
            </>
        ) : (
            // Database View (Dark Premium Theme)
            <div className="flex flex-col h-full bg-slate-900 text-slate-300 font-mono overflow-hidden">
                <header className="bg-slate-950 px-8 py-5 flex justify-between items-center border-b border-slate-800 shadow-lg shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="bg-emerald-500/10 p-2 rounded text-emerald-500 border border-emerald-500/20">
                            <Terminal size={20} />
                        </div>
                        <div>
                            <h1 className="text-lg font-bold text-slate-100 tracking-tight">SQL Console</h1>
                            <div className="text-xs text-slate-500 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                Connected to mock_db_v1
                            </div>
                        </div>
                    </div>
                    <button 
                        onClick={handleExportSQL}
                        className="bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 border border-blue-500/30 px-4 py-2 rounded-lg flex items-center gap-2 transition-all text-sm font-sans hover:border-blue-400/50"
                    >
                        <FileDown size={16} /> Export SQL Dump
                    </button>
                </header>
                
                <div className="p-8 space-y-6 overflow-y-auto flex-1">
                    {/* Query Input */}
                    <div className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden shadow-2xl">
                        <div className="bg-[#0f1520] px-4 py-2.5 text-xs text-slate-500 border-b border-slate-800 flex justify-between items-center select-none">
                            <span className="font-bold text-slate-400 uppercase tracking-wider">Query Editor</span>
                            <div className="flex gap-4">
                                <span>Supports: <span className="text-purple-400">SELECT</span>, <span className="text-blue-400">WHERE</span>, <span className="text-orange-400">ORDER BY</span></span>
                            </div>
                        </div>
                        <div className="p-0 relative">
                            <textarea 
                                value={sqlQuery}
                                onChange={e => setSqlQuery(e.target.value)}
                                className="w-full h-40 bg-slate-950 text-blue-100 p-5 focus:outline-none font-mono text-sm resize-none leading-relaxed selection:bg-blue-500/30"
                                spellCheck="false"
                            />
                            <div className="absolute bottom-4 right-4">
                                <button 
                                    onClick={handleRunQuery}
                                    className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-all font-sans font-bold shadow-lg shadow-emerald-600/20"
                                >
                                    <Play size={16} fill="currentColor" /> Run
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Results / Error */}
                    {queryError && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                            <div className="p-1 bg-red-500/20 rounded-full"><X size={16} /></div>
                            <span className="font-medium">Error: {queryError}</span>
                        </div>
                    )}

                    {queryResult && (
                        <div className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden shadow-2xl animate-in fade-in slide-in-from-top-5">
                            <div className="bg-[#0f1520] px-4 py-2 text-xs text-slate-400 border-b border-slate-800 flex justify-between">
                                <span className="uppercase tracking-wider font-bold">Query Results</span>
                                <span className="bg-slate-800 px-2 rounded text-slate-300">{queryResult.length} rows found</span>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead className="bg-slate-900 text-slate-400 text-xs">
                                        <tr>
                                            {queryResult.length > 0 && Object.keys(queryResult[0]).map(key => (
                                                <th key={key} className="p-3 border-b border-slate-800 font-semibold uppercase tracking-wider text-blue-400/80">{key}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="text-sm">
                                        {queryResult.map((row, idx) => (
                                            <tr key={idx} className="hover:bg-white/5 transition border-b border-slate-800/50">
                                                {Object.values(row).map((val: any, i) => (
                                                    <td key={i} className="p-3 text-slate-300">
                                                        {typeof val === 'boolean' ? (
                                                            <span className={val ? 'text-emerald-400' : 'text-red-400'}>{val ? 'TRUE' : 'FALSE'}</span>
                                                        ) : val}
                                                    </td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                    
                    {/* Schema Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 pb-6">
                         <div className="bg-slate-950/50 p-5 rounded-xl border border-slate-800 hover:border-slate-700 transition-colors">
                            <h3 className="text-sm font-bold text-slate-200 mb-4 flex items-center gap-2">
                                <Database size={16} className="text-blue-500" /> 
                                Schema: products
                            </h3>
                            <div className="grid grid-cols-2 gap-x-8 gap-y-2">
                                {['id (INT PK)', 'name (VARCHAR)', 'price (DECIMAL)', 'category (VARCHAR)', 'stock (INT)', 'isFlashSale (BOOL)'].map((col, i) => {
                                    const [name, type] = col.split(' (');
                                    return (
                                        <div key={i} className="text-xs flex justify-between border-b border-slate-800/50 pb-1">
                                            <span className="text-slate-400 font-mono">{name}</span>
                                            <span className="text-blue-500/80 font-mono text-[10px]">{type.replace(')', '')}</span>
                                        </div>
                                    )
                                })}
                            </div>
                         </div>
                         <div className="bg-slate-950/50 p-5 rounded-xl border border-slate-800 hover:border-slate-700 transition-colors">
                             <h3 className="text-sm font-bold text-slate-200 mb-4 flex items-center gap-2">
                                <Tag size={16} className="text-orange-500" />
                                Quick Queries
                             </h3>
                             <ul className="text-xs space-y-2.5 text-slate-500 font-mono">
                                 {[
                                     "SELECT * FROM products",
                                     "SELECT name, price FROM products WHERE price > 10000",
                                     "SELECT * FROM products WHERE category = 'เครื่องใช้ไฟฟ้า'",
                                     "SELECT * FROM products ORDER BY price DESC"
                                 ].map((q, i) => (
                                    <li 
                                        key={i} 
                                        className="group cursor-pointer hover:text-emerald-400 transition-colors flex items-center gap-2"
                                        onClick={() => setSqlQuery(q)}
                                    >
                                        <span className="opacity-0 group-hover:opacity-100 transition-opacity text-emerald-500">▶</span>
                                        <span className="border-b border-transparent group-hover:border-emerald-500/30 pb-0.5">{q}</span>
                                    </li>
                                 ))}
                             </ul>
                         </div>
                    </div>
                </div>
            </div>
        )}
      </main>

      {/* Edit/Add Modal - Updated UI */}
      {isModalOpen && activeTab === 'products' && (
        <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center z-50 backdrop-blur-sm transition-all p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-auto overflow-hidden animate-in fade-in zoom-in duration-200 ring-1 ring-slate-900/5 max-h-[90vh] overflow-y-auto">
             <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-5 border-b border-blue-500/20 flex justify-between items-center sticky top-0 z-10">
                <div className="flex items-center gap-2 text-white">
                    {editingProduct ? <Edit size={20} /> : <Plus size={20} />}
                    <h3 className="font-bold text-lg tracking-tight">{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="text-white/70 hover:text-white hover:bg-white/10 p-1.5 rounded-full transition-colors">
                  <X size={20} />
                </button>
             </div>
             <form onSubmit={handleSubmit} className="p-8 space-y-5">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">Product Name</label>
                  <input 
                    type="text" 
                    value={formData.name} 
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full border border-slate-300 rounded-xl px-4 py-2.5 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all text-slate-800"
                    placeholder="Enter product name"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1.5">Price (THB)</label>
                    <input 
                      type="number" 
                      value={formData.price} 
                      onChange={e => setFormData({...formData, price: Number(e.target.value)})}
                      className="w-full border border-slate-300 rounded-xl px-4 py-2.5 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all text-slate-800"
                      required
                    />
                  </div>
                   <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1.5">Original Price <span className="font-normal text-slate-400">(Optional)</span></label>
                    <input 
                      type="number" 
                      value={formData.originalPrice || ''} 
                      onChange={e => setFormData({...formData, originalPrice: e.target.value ? Number(e.target.value) : undefined})}
                      className="w-full border border-slate-300 rounded-xl px-4 py-2.5 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all text-slate-800"
                      placeholder="e.g. 15900"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-5">
                   <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1.5">Stock Quantity</label>
                    <input 
                      type="number" 
                      value={formData.stock} 
                      onChange={e => setFormData({...formData, stock: Number(e.target.value)})}
                      className="w-full border border-slate-300 rounded-xl px-4 py-2.5 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all text-slate-800"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1.5">Discount (%)</label>
                    <input 
                      type="number" 
                      value={formData.discount || 0} 
                      onChange={e => setFormData({...formData, discount: Number(e.target.value)})}
                      className="w-full border border-slate-300 rounded-xl px-4 py-2.5 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all text-slate-800"
                    />
                  </div>
                </div>

                <div>
                   <label className="block text-sm font-bold text-slate-700 mb-1.5">Category</label>
                   <div className="relative">
                        <select 
                            value={formData.category} 
                            onChange={e => setFormData({...formData, category: e.target.value})}
                            className="w-full border border-slate-300 rounded-xl px-4 py-2.5 bg-white focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all text-slate-800 appearance-none"
                        >
                            {CATEGORIES.map(cat => (
                                <option key={cat.id} value={cat.name}>{cat.name}</option>
                            ))}
                            <option value="อื่นๆ">Other</option>
                        </select>
                        <ArrowDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                   </div>
                </div>
                 <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">Image URL</label>
                  <input 
                    type="text" 
                    value={formData.image} 
                    onChange={e => setFormData({...formData, image: e.target.value})}
                    className="w-full border border-slate-300 rounded-xl px-4 py-2.5 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all text-xs text-slate-600"
                    placeholder="https://..."
                  />
                </div>

                <div className="pt-2">
                   <label className="flex items-center gap-3 cursor-pointer bg-slate-50 px-5 py-4 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 transition-all">
                        <div className="relative flex items-center">
                            <input 
                                type="checkbox"
                                checked={formData.isFlashSale || false}
                                onChange={e => setFormData({...formData, isFlashSale: e.target.checked})}
                                className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-slate-300 shadow-sm transition-all checked:border-blue-600 checked:bg-blue-600 hover:border-blue-400"
                            />
                            <svg className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100" width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M10 3L4.5 8.5L2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm font-bold text-slate-800 flex items-center gap-2">
                                <Zap size={16} className={formData.isFlashSale ? "text-orange-500 fill-orange-500" : "text-slate-400"} /> 
                                Set as Flash Sale Item
                            </span>
                            <span className="text-xs text-slate-500 mt-0.5">This item will appear in the homepage Flash Sale section</span>
                        </div>
                    </label>
                </div>
                
                <div className="pt-6 flex justify-end gap-3 border-t border-slate-100">
                   <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl font-medium transition-colors">Cancel</button>
                   <button type="submit" className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:shadow-lg hover:shadow-blue-500/30 flex items-center gap-2 font-bold transition-all transform active:scale-95">
                     <Save size={18} /> Save Product
                   </button>
                </div>
             </form>
          </div>
        </div>
      )}
    </div>
  );
};