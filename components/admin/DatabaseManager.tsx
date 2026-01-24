
import React, { useState, useEffect } from 'react';
import alasql from 'alasql';
import { db } from '../../services/mockDb';
import { aiService } from '../../services/aiService';
import { BlockRenderer } from '../BlockRenderer';
// FIX: Added User and Order types to ensure proper type casting later.
import { PageBlock, SavedBlock, User, Order, Product, Category, Brand } from '../../types';
import { 
  Database, Play, Trash2, Search, Table, 
  Terminal, Sparkles, Loader2, RefreshCw, AlertCircle, Save,
  CheckCircle2, FileJson, FileText, Download, Wand2
} from 'lucide-react';

export const DatabaseManager: React.FC = () => {
  const [query, setQuery] = useState('SELECT * FROM products LIMIT 10');
  const [results, setResults] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [activeTable, setActiveTable] = useState<string>('products');
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<'editor' | 'generator'>('editor');

  // Generator State
  const [generatorQuery, setGeneratorQuery] = useState('SELECT name, image, price, category FROM products WHERE isFeatured = true LIMIT 4');
  const [generatedBlock, setGeneratedBlock] = useState<PageBlock | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

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

      handleRunQuery(); // Initial run on mount
    } catch (e) {
      console.error("DB Init Error", e);
      setError("Failed to initialize in-memory database.");
    }
  }, []);

  const handleRunQuery = () => {
    setError(null);
    setSuccessMsg(null);
    try {
      const res = alasql(query);
      const data = Array.isArray(res) && res.length > 0 && Array.isArray(res[0]) ? res[res.length - 1] : res;
      setResults(Array.isArray(data) ? data : []);

      const upperQuery = query.trim().toUpperCase();
      if (upperQuery.startsWith('INSERT') || upperQuery.startsWith('UPDATE') || upperQuery.startsWith('DELETE')) {
         const match = query.match(/(?:INSERT\s+INTO|UPDATE|DELETE\s+FROM)\s+([a-zA-Z0-9_]+)/i);
         if (match && match[1]) {
            const tableName = match[1].toLowerCase();
            syncTableToDb(tableName);
            setSuccessMsg(`Query executed. Table '${tableName}' synced to storage.`);
         } else {
            setSuccessMsg(`Query executed successfully.`);
         }
      }
    } catch (err: any) {
      setError(err.message);
      setResults([]);
    }
  };

  const handleAiQuery = async () => {
    if (!query.trim()) return;
    setError(null);
    try {
      const sql = await aiService.generateSql(query); // use current query as prompt
      if (sql) setQuery(sql);
      else setError("AI could not generate a valid SQL query.");
    } catch (e) { setError("Error connecting to AI service."); }
  };

  const syncTableToDb = (tableName: string) => {
     try {
       const data = alasql(`SELECT * FROM ${tableName}`);
       switch(tableName) {
          // FIX: Cast 'data' to the expected array types to satisfy TypeScript.
          case 'products': db.setProducts(data as Product[]); break;
          case 'categories': db.setCategories(data as Category[]); break;
          case 'brands': db.setBrands(data as Brand[]); break;
          case 'users': db.setUsers(data as User[]); break;
          case 'orders': db.setOrders(data as Order[]); break;
       }
     } catch(e) { console.error("Sync error", e); }
  };

  const loadTableTemplate = (tableName: string) => {
    setActiveTable(tableName);
    const newQuery = `SELECT * FROM ${tableName}`;
    setQuery(newQuery);
    // Use a timeout to ensure state update before running query
    setTimeout(() => {
        try {
            const res = alasql(newQuery);
            setResults(Array.isArray(res) ? res : []);
            setError(null);
        } catch (err: any) {
            setError(err.message);
            setResults([]);
        }
    }, 0);
  };
  
  const handleGenerateFromQuery = async () => {
    setIsGenerating(true);
    setGeneratedBlock(null);
    setError(null);
    try {
      // FIX: Explicitly type 'data' as any[] to resolve errors with .length and function arguments.
      const data: any[] = alasql(generatorQuery);
      if (!data || data.length === 0) {
        setError("Query returned no data to generate a block from.");
        setIsGenerating(false);
        return;
      }

      const block = await aiService.generateBlockFromData(data);
      if (block) {
        setGeneratedBlock(block);
      } else {
        setError("AI could not generate a block from the data.");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveGeneratedBlock = () => {
    if (!generatedBlock) return;
    const newSavedBlock: SavedBlock = {
      id: `saved-sql-${Date.now()}`,
      name: `From SQL: ${generatorQuery.substring(0, 20)}...`,
      category: 'SQL Generated',
      block: generatedBlock,
      createdAt: new Date().toISOString()
    };
    db.addSavedBlock(newSavedBlock);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };
  
  const downloadFile = (content: string, fileName: string, contentType: string) => {
    const a = document.createElement("a");
    const file = new Blob([content], { type: contentType });
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(a.href);
  };
  const exportAsJson = () => {
    if (results.length === 0) return;
    downloadFile(JSON.stringify(results, null, 2), 'query_results.json', 'application/json');
    setIsExportOpen(false);
  };
  const exportAsCsv = () => {
    if (results.length === 0) return;
    const headers = Object.keys(results[0]);
    const csvRows = [
      headers.join(','),
      ...results.map(row => headers.map(h => JSON.stringify(row[h])).join(','))
    ];
    downloadFile(csvRows.join('\n'), 'query_results.csv', 'text/csv');
    setIsExportOpen(false);
  };

  const getTableCount = (table: string) => {
    try {
      const results = alasql(`SELECT * FROM ${table}`);
      return Array.isArray(results) ? results.length : 0;
    } catch (e) {
      // If table doesn't exist yet during initial render, return 0
      return 0;
    }
  };
  const getTableLabel = (table: string) => table.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

  return (
    <div className="flex h-full flex-col md:flex-row bg-gray-50 overflow-hidden" style={{ height: 'calc(100vh - 140px)' }}>
      <div className="w-full md:w-64 bg-white border-r border-gray-200 flex-shrink-0 flex flex-col">
        <div className="p-4 border-b border-gray-100 bg-gray-50"><h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2"><Database size={14} /> Tables</h3></div>
        <div className="p-2 space-y-1 overflow-y-auto flex-1">
          {['products', 'categories', 'brands', 'users', 'orders', 'product_variants'].map(table => (
            <button key={table} onClick={() => loadTableTemplate(table)} className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition ${activeTable === table ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}>
              <div className="flex items-center gap-2 truncate"><Table size={16} className={activeTable === table ? 'text-blue-500' : 'text-gray-400'} /><span className="truncate">{getTableLabel(table)}</span></div>
              <span className="text-xs bg-gray-200 px-2 py-0.5 rounded-full text-gray-500 flex-shrink-0">{getTableCount(table)}</span>
            </button>
          ))}
        </div>
        <div className="p-4 border-t border-gray-100 bg-gray-50 text-[10px] text-gray-400">Powered by AlaSQL (In-Memory). Modifications are synced to MockDB.</div>
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        <div className="bg-white border-b border-gray-200 flex items-center shadow-sm z-10">
          <button onClick={() => setActiveSubTab('editor')} className={`px-5 py-3 text-sm font-bold flex items-center gap-2 transition-all ${activeSubTab === 'editor' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}><Terminal size={16}/> SQL Editor</button>
          <button onClick={() => setActiveSubTab('generator')} className={`px-5 py-3 text-sm font-bold flex items-center gap-2 transition-all ${activeSubTab === 'generator' ? 'border-b-2 border-purple-600 text-purple-600' : 'text-gray-500 hover:text-gray-700'}`}><Wand2 size={16}/> Content Generator</button>
        </div>

        {activeSubTab === 'editor' && (
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="h-2/5 min-h-[150px] bg-gray-900 flex flex-col">
              <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
                <input value={query} onChange={e => setQuery(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleAiQuery()} placeholder="Ask AI to write SQL..." className="flex-1 bg-transparent text-gray-300 text-xs focus:outline-none placeholder-gray-500"/>
                <button onClick={handleAiQuery} className="text-purple-400 hover:text-white p-1 rounded hover:bg-gray-700 transition" title="Generate SQL with AI"><Sparkles size={14} /></button>
              </div>
              <textarea value={query} onChange={e => setQuery(e.target.value)} className="flex-1 bg-gray-900 text-green-400 font-mono text-sm p-4 outline-none resize-none leading-relaxed" spellCheck={false}/>
              <div className="flex items-center justify-end px-4 py-2 bg-gray-800 border-t border-gray-700 gap-2">
                <button onClick={() => setQuery('')} className="text-gray-400 hover:text-white p-1 rounded hover:bg-gray-700 transition" title="Clear"><Trash2 size={14} /></button>
                <button onClick={handleRunQuery} className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs font-bold flex items-center gap-1 transition"><Play size={12} /> Run Query</button>
              </div>
            </div>
            <div className="flex-1 bg-white flex flex-col overflow-hidden relative">
              {error && <div className="bg-red-50 border-b border-red-100 p-3 flex items-center gap-2 text-red-600 text-sm font-medium"><AlertCircle size={16} /> Error: {error}</div>}
              {successMsg && !error && <div className="bg-green-50 border-b border-green-100 p-3 flex items-center gap-2 text-green-600 text-sm font-medium"><CheckCircle2 size={16} /> {successMsg}</div>}
              <div className="flex-1 overflow-auto"><ResultsTable results={results} /></div>
              <div className="p-2 bg-gray-50 border-t border-gray-200 text-xs text-gray-500 flex justify-between items-center">
                <span>{results.length} rows returned</span>
                <div className="relative">
                  <button onClick={() => setIsExportOpen(!isExportOpen)} disabled={results.length === 0} className="px-3 py-1 bg-white border border-gray-300 rounded-md text-xs font-bold text-gray-600 hover:bg-gray-100 disabled:opacity-50 flex items-center gap-1"><Download size={12} /> Export</button>
                  {isExportOpen && <div className="absolute bottom-full right-0 mb-2 w-32 bg-white rounded-md shadow-lg border z-20"><button onClick={exportAsJson} className="w-full text-left px-3 py-2 text-xs hover:bg-gray-100">as JSON</button><button onClick={exportAsCsv} className="w-full text-left px-3 py-2 text-xs hover:bg-gray-100">as CSV</button></div>}
                </div>
              </div>
            </div>
          </div>
        )}
        
        {activeSubTab === 'generator' && (
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-gray-800 mb-1">Generate Page Block from SQL</h3>
              <p className="text-sm text-gray-500 mb-4">Write a query to get data, then let AI create a visual component for your website.</p>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">1. SQL Query</label>
              <textarea value={generatorQuery} onChange={e => setGeneratorQuery(e.target.value)} className="w-full h-24 border rounded-lg p-3 font-mono text-sm bg-gray-50 focus:ring-2 focus:ring-purple-500 outline-none" placeholder="e.g. SELECT name, image, description FROM products LIMIT 3"/>
              <button onClick={handleGenerateFromQuery} disabled={isGenerating} className="mt-3 w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold shadow-lg hover:shadow-purple-200 transition-all flex items-center justify-center gap-2 disabled:opacity-70 active:scale-95">
                {isGenerating ? <><Loader2 size={20} className="animate-spin"/> Generating...</> : <><Wand2 size={20}/> Generate Block Preview</>}
              </button>
            </div>

            {(generatedBlock || isGenerating) && (
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 animate-in fade-in">
                <h3 className="text-lg font-bold text-gray-800 mb-4">2. AI Generated Preview</h3>
                {isGenerating && <div className="h-48 flex items-center justify-center text-gray-400"><Loader2 size={32} className="animate-spin"/></div>}
                {error && <div className="bg-red-50 p-4 rounded-lg text-red-600 text-sm">{error}</div>}
                {generatedBlock && (
                  <div>
                    <div className="border rounded-xl overflow-hidden shadow-inner bg-gray-50 p-4"><BlockRenderer block={generatedBlock} /></div>
                    <button onClick={handleSaveGeneratedBlock} disabled={saveSuccess} className="mt-4 w-full py-2.5 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 disabled:bg-green-500 transition shadow flex items-center justify-center gap-2">
                      {saveSuccess ? <><CheckCircle2 size={16}/> Saved!</> : <><Save size={16}/> Save to Block Library</>}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const ResultsTable: React.FC<{ results: any[] }> = ({ results }) => {
  if (results.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-gray-400">
        <Table size={48} className="mb-2 opacity-20" />
        <p className="text-sm">No results to display.</p>
      </div>
    );
  }
  return (
    <table className="w-full text-left border-collapse">
      <thead className="bg-gray-50 sticky top-0 z-10 shadow-sm">
        <tr>{Object.keys(results[0]).map(key => <th key={key} className="p-3 text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-200 whitespace-nowrap">{key}</th>)}</tr>
      </thead>
      <tbody className="divide-y divide-gray-100">
        {results.map((row, idx) => (
          <tr key={idx} className="hover:bg-blue-50/50 transition">
            {Object.values(row).map((val: any, vIdx) => <td key={vIdx} className="p-3 text-sm text-gray-700 whitespace-nowrap max-w-xs overflow-hidden text-ellipsis" title={typeof val === 'object' ? JSON.stringify(val) : String(val)}>{typeof val === 'object' ? JSON.stringify(val) : String(val)}</td>)}
          </tr>
        ))}
      </tbody>
    </table>
  );
};
