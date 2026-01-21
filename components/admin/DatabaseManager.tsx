
import React, { useState, useEffect } from 'react';
import alasql from 'alasql';
import { db } from '../../services/mockDb';
import { aiService } from '../../services/aiService';
import { 
  Database, Play, Trash2, Search, Table, 
  Terminal, Sparkles, Loader2, RefreshCw, AlertCircle, Save,
  CheckCircle2
} from 'lucide-react';

export const DatabaseManager: React.FC = () => {
  const [query, setQuery] = useState('SELECT * FROM products LIMIT 10');
  const [results, setResults] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [activeTable, setActiveTable] = useState<string>('products');
  
  // AI State
  const [aiPrompt, setAiPrompt] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);

  useEffect(() => {
    // Initialize Database
    try {
      alasql('CREATE TABLE IF NOT EXISTS products');
      alasql('CREATE TABLE IF NOT EXISTS categories');
      alasql('CREATE TABLE IF NOT EXISTS brands');
      alasql('CREATE TABLE IF NOT EXISTS users');
      alasql('CREATE TABLE IF NOT EXISTS orders');
      alasql('CREATE TABLE IF NOT EXISTS product_variants'); 

      // Clear existing to avoid dupes on re-mount (in memory)
      alasql('DELETE FROM products');
      alasql('DELETE FROM categories');
      alasql('DELETE FROM brands');
      alasql('DELETE FROM users');
      alasql('DELETE FROM orders');
      alasql('DELETE FROM product_variants');

      // Populate Data
      alasql('INSERT INTO products SELECT * FROM ?', [db.getProducts()]);
      alasql('INSERT INTO categories SELECT * FROM ?', [db.getCategories()]);
      alasql('INSERT INTO brands SELECT * FROM ?', [db.getBrands()]);
      alasql('INSERT INTO users SELECT * FROM ?', [db.getUsers()]);
      alasql('INSERT INTO orders SELECT * FROM ?', [db.getOrders()]);
      alasql('INSERT INTO product_variants SELECT * FROM ?', [db.getAllVariants()]); 

      // Initial Run
      handleRunQuery();
    } catch (e) {
      console.error("DB Init Error", e);
    }
  }, []);

  const handleRunQuery = () => {
    setError(null);
    setSuccessMsg(null);
    try {
      const res = alasql(query);
      // alasql returns array of results if multiple queries, or just result if one.
      // We assume single query for now or take the last one.
      const data = Array.isArray(res) && res.length > 0 && Array.isArray(res[0]) ? res[res.length - 1] : res;
      setResults(Array.isArray(data) ? data : []);

      // Check if modification query
      const upperQuery = query.trim().toUpperCase();
      if (upperQuery.startsWith('INSERT') || upperQuery.startsWith('UPDATE') || upperQuery.startsWith('DELETE')) {
         const match = query.match(/(?:INSERT\s+INTO|UPDATE|DELETE\s+FROM)\s+([a-zA-Z0-9_]+)/i);
         if (match && match[1]) {
            const tableName = match[1].toLowerCase();
            syncTableToDb(tableName);
            setSuccessMsg(`Query executed successfully. Table '${tableName}' synced to storage.`);
         } else {
            setSuccessMsg(`Query executed successfully.`);
         }
      }

    } catch (err: any) {
      setError(err.message);
      setResults([]);
    }
  };

  const syncTableToDb = (tableName: string) => {
     try {
       const data = alasql(`SELECT * FROM ${tableName}`);
       switch(tableName) {
          case 'products': db.setProducts(data); break;
          case 'categories': db.setCategories(data); break;
          case 'brands': db.setBrands(data); break;
          case 'users': db.setUsers(data); break;
          case 'orders': db.setOrders(data); break;
       }
     } catch(e) {
       console.error("Sync error", e);
     }
  }

  const handleAiQuery = async () => {
    if (!aiPrompt.trim()) return;
    setIsAiLoading(true);
    setError(null);
    try {
      const sql = await aiService.generateSql(aiPrompt);
      if (sql) {
        setQuery(sql);
        // Execute immediately is optional, but convenient
        setTimeout(() => {
           // We click run programmatically or just let user click
        }, 100);
      } else {
        setError("AI ไม่สามารถสร้างคำสั่ง SQL ได้ กรุณาลองใหม่");
      }
    } catch (e) {
      setError("เกิดข้อผิดพลาดในการเชื่อมต่อกับ AI");
    } finally {
      setIsAiLoading(false);
    }
  };

  const loadTableTemplate = (tableName: string) => {
    setActiveTable(tableName);
    setQuery(`SELECT * FROM ${tableName}`);
    setTimeout(handleRunQuery, 0); // Tick to update
  };

  const getTableCount = (table: string) => {
      switch(table) {
          case 'products': return db.getProducts().length;
          case 'categories': return db.getCategories().length;
          case 'brands': return db.getBrands().length;
          case 'users': return db.getUsers().length;
          case 'orders': return db.getOrders().length;
          case 'product_variants': return db.getAllVariants().length;
          default: return 0;
      }
  };

  const getTableLabel = (table: string) => {
    switch(table) {
        case 'products': return 'สินค้า (Products)';
        case 'categories': return 'หมวดหมู่ (Categories)';
        case 'brands': return 'แบรนด์ (Brands)';
        case 'users': return 'ผู้ใช้งาน (Users)';
        case 'orders': return 'คำสั่งซื้อ (Orders)';
        case 'product_variants': return 'ตัวเลือกสินค้า (Variants)';
        default: return table;
    }
  };

  return (
    <div className="flex h-full flex-col md:flex-row bg-gray-50 overflow-hidden" style={{ height: 'calc(100vh - 140px)' }}>
      {/* Sidebar - Tables */}
      <div className="w-full md:w-64 bg-white border-r border-gray-200 flex-shrink-0 flex flex-col">
         <div className="p-4 border-b border-gray-100 bg-gray-50">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
              <Database size={14} /> ตารางฐานข้อมูล
            </h3>
         </div>
         <div className="p-2 space-y-1 overflow-y-auto flex-1">
            {['products', 'categories', 'brands', 'users', 'orders', 'product_variants'].map(table => (
              <button
                key={table}
                onClick={() => loadTableTemplate(table)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition ${activeTable === table ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                 <div className="flex items-center gap-2 capitalize truncate">
                    <Table size={16} className={activeTable === table ? 'text-blue-500' : 'text-gray-400'} />
                    <span className="truncate">{getTableLabel(table)}</span>
                 </div>
                 <span className="text-xs bg-gray-200 px-2 py-0.5 rounded-full text-gray-500 flex-shrink-0">
                    {getTableCount(table)}
                 </span>
              </button>
            ))}
         </div>
         <div className="p-4 border-t border-gray-100 bg-gray-50">
            <div className="text-[10px] text-gray-400">
               ขับเคลื่อนโดย AlaSQL (In-Memory) <br/>
               * การแก้ไขข้อมูล (INSERT/UPDATE/DELETE) จะถูกบันทึกลง MockDB โดยอัตโนมัติ
            </div>
         </div>
      </div>

      {/* Main Area */}
      <div className="flex-1 flex flex-col min-w-0">
         {/* Top Bar: AI Query */}
         <div className="bg-white p-4 border-b border-gray-200 flex flex-col md:flex-row gap-4 items-center shadow-sm z-10">
            <div className="relative flex-1 w-full">
               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Sparkles size={18} className="text-purple-500" />
               </div>
               <input 
                 type="text" 
                 value={aiPrompt}
                 onChange={(e) => setAiPrompt(e.target.value)}
                 onKeyPress={(e) => e.key === 'Enter' && handleAiQuery()}
                 placeholder="ถาม AI ให้ช่วยเขียน SQL (เช่น 'แสดงสินค้าที่มีราคาสูงกว่า 5000 บาท' หรือ 'เพิ่มแบรนด์ใหม่ชื่อ Test')..." 
                 className="block w-full pl-10 pr-32 py-2.5 bg-purple-50 border border-purple-100 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition"
               />
               <button 
                 onClick={handleAiQuery}
                 disabled={isAiLoading || !aiPrompt.trim()}
                 className="absolute inset-y-1 right-1 px-4 bg-purple-600 text-white rounded-lg text-xs font-bold hover:bg-purple-700 disabled:opacity-50 transition flex items-center gap-2"
               >
                 {isAiLoading ? <Loader2 size={14} className="animate-spin" /> : 'สร้างคำสั่ง SQL'}
               </button>
            </div>
         </div>

         {/* Editor Section */}
         <div className="flex-1 flex flex-col overflow-hidden">
            <div className="h-1/3 min-h-[150px] bg-gray-900 flex flex-col">
               <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
                  <span className="text-xs font-mono text-gray-400 flex items-center gap-2">
                     <Terminal size={12} /> SQL Editor
                  </span>
                  <div className="flex items-center gap-2">
                     <button onClick={() => setQuery('')} className="text-gray-400 hover:text-white p-1 rounded hover:bg-gray-700 transition" title="ล้าง">
                        <Trash2 size={14} />
                     </button>
                     <button onClick={handleRunQuery} className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs font-bold flex items-center gap-1 transition">
                        <Play size={12} /> รันคำสั่ง (Run)
                     </button>
                  </div>
               </div>
               <textarea 
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="flex-1 bg-gray-900 text-green-400 font-mono text-sm p-4 outline-none resize-none leading-relaxed"
                  spellCheck={false}
               />
            </div>

            {/* Results Section */}
            <div className="flex-1 bg-white flex flex-col overflow-hidden relative">
               {error && (
                  <div className="bg-red-50 border-b border-red-100 p-3 flex items-center gap-2 text-red-600 text-sm font-medium animate-in slide-in-from-top-2">
                     <AlertCircle size={16} /> Error: {error}
                  </div>
               )}
               {successMsg && !error && (
                  <div className="bg-green-50 border-b border-green-100 p-3 flex items-center gap-2 text-green-600 text-sm font-medium animate-in slide-in-from-top-2">
                     <CheckCircle2 size={16} /> {successMsg}
                  </div>
               )}
               
               <div className="flex-1 overflow-auto">
                  {results.length > 0 ? (
                     <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50 sticky top-0 z-10 shadow-sm">
                           <tr>
                              {Object.keys(results[0]).map((key) => (
                                 <th key={key} className="p-3 text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-200 whitespace-nowrap">
                                    {key}
                                 </th>
                              ))}
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                           {results.map((row, idx) => (
                              <tr key={idx} className="hover:bg-blue-50/50 transition">
                                 {Object.values(row).map((val: any, vIdx) => (
                                    <td key={vIdx} className="p-3 text-sm text-gray-700 whitespace-nowrap border-r border-transparent last:border-0 max-w-xs overflow-hidden text-ellipsis">
                                       {typeof val === 'object' ? JSON.stringify(val).substring(0, 30) + '...' : String(val)}
                                    </td>
                                 ))}
                              </tr>
                           ))}
                        </tbody>
                     </table>
                  ) : (
                     <div className="h-full flex flex-col items-center justify-center text-gray-400">
                        {error ? (
                           <AlertCircle size={48} className="mb-2 opacity-20 text-red-500" />
                        ) : (
                           <Table size={48} className="mb-2 opacity-20" />
                        )}
                        <p className="text-sm">{error ? 'การดำเนินการล้มเหลว' : 'ไม่มีผลลัพธ์ที่จะแสดง'}</p>
                     </div>
                  )}
               </div>
               
               <div className="p-2 bg-gray-50 border-t border-gray-200 text-xs text-gray-500 flex justify-between items-center">
                  <span>พบข้อมูล {results.length} รายการ</span>
                  <span>Execution time: &lt; 10ms</span>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};
