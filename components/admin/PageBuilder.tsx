
import React, { useState, useEffect } from 'react';
import { db } from '../../services/mockDb';
import { aiService } from '../../services/aiService';
import { Page, PageBlock, BlockType } from '../../types';
import { 
  Plus, Search, Edit, Trash2, Save, ArrowLeft, 
  MoveUp, MoveDown, Layout, Type, Image as ImageIcon, 
  ShoppingBag, Eye, FileText, Globe, CheckCircle, GripVertical,
  Sparkles, Loader2, X
} from 'lucide-react';
import { ImageManager } from './ImageManager';

export const PageBuilder: React.FC = () => {
  const [view, setView] = useState<'list' | 'edit'>('list');
  const [pages, setPages] = useState<Page[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Editor State
  const [currentPage, setCurrentPage] = useState<Page | null>(null);
  const [blocks, setBlocks] = useState<PageBlock[]>([]);
  const [pageMeta, setPageMeta] = useState({ title: '', slug: '', status: 'draft' });

  // AI State
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    refreshPages();
  }, []);

  const refreshPages = () => {
    setPages([...db.getPages()]);
  };

  const handleCreateNew = () => {
    const newPage: Page = {
      id: `page-${Date.now()}`,
      title: 'Untitled Page',
      slug: `new-page-${Date.now()}`,
      blocks: [],
      status: 'draft',
      updatedAt: new Date().toISOString()
    };
    setCurrentPage(newPage);
    setBlocks([]);
    setPageMeta({ title: newPage.title, slug: newPage.slug, status: 'draft' });
    setView('edit');
  };

  const handleEdit = (page: Page) => {
    setCurrentPage(page);
    setBlocks(page.blocks);
    setPageMeta({ title: page.title, slug: page.slug, status: page.status as any });
    setView('edit');
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this page?')) {
      db.deletePage(id);
      refreshPages();
    }
  };

  const handleSave = () => {
    if (!currentPage) return;
    const updatedPage: Page = {
      ...currentPage,
      title: pageMeta.title,
      slug: pageMeta.slug,
      status: pageMeta.status as any,
      blocks: blocks,
      updatedAt: new Date().toISOString()
    };

    if (db.getPage(updatedPage.id)) {
      db.updatePage(updatedPage);
    } else {
      db.addPage(updatedPage);
    }
    
    refreshPages();
    setView('list');
  };

  // AI Generation Handler
  const handleAiGenerate = async () => {
    if (!aiPrompt.trim()) return;
    
    setIsGenerating(true);
    try {
      const generatedBlocks = await aiService.generatePageLayout(aiPrompt);
      if (generatedBlocks.length > 0) {
        setBlocks(prev => [...prev, ...generatedBlocks]);
        setIsAiModalOpen(false);
        setAiPrompt('');
      } else {
        alert('AI could not generate the layout. Please try a different description.');
      }
    } catch (error) {
      console.error(error);
      alert('Error generating layout');
    } finally {
      setIsGenerating(false);
    }
  };

  // Block Management
  const addBlock = (type: BlockType) => {
    const newBlock: PageBlock = {
      id: `block-${Date.now()}`,
      type,
      data: getDefaultBlockData(type)
    };
    setBlocks([...blocks, newBlock]);
  };

  const updateBlockData = (id: string, data: any) => {
    setBlocks(blocks.map(b => b.id === id ? { ...b, data: { ...b.data, ...data } } : b));
  };

  const removeBlock = (id: string) => {
    setBlocks(blocks.filter(b => b.id !== id));
  };

  const moveBlock = (index: number, direction: 'up' | 'down') => {
    const newBlocks = [...blocks];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex >= 0 && targetIndex < newBlocks.length) {
      [newBlocks[index], newBlocks[targetIndex]] = [newBlocks[targetIndex], newBlocks[index]];
      setBlocks(newBlocks);
    }
  };

  const getDefaultBlockData = (type: BlockType) => {
    switch (type) {
      case 'hero': return { title: 'Hero Title', subtitle: 'Subtitle goes here', image: '', buttonText: 'Click Me' };
      case 'text': return { content: '<h2>Heading</h2><p>Write your content here...</p>' };
      case 'product-row': return { title: 'Featured Products', category: 'All', count: 4 };
      case 'image': return { url: '', alt: '', caption: '' };
      case 'spacer': return { height: 50 };
      default: return {};
    }
  };

  if (view === 'list') {
    return (
      <div className="p-8">
        <div className="bg-white p-6 rounded-2xl shadow-md mb-8 flex justify-between items-center">
          <div className="relative w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder="Search pages..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <button 
            onClick={handleCreateNew}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl flex items-center gap-2 font-bold shadow-lg"
          >
            <Plus size={18} /> Create New Page
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-bold">
              <tr>
                <th className="p-4">Page Title</th>
                <th className="p-4">Slug (URL)</th>
                <th className="p-4">Status</th>
                <th className="p-4">Last Modified</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {pages.filter(p => p.title.toLowerCase().includes(searchQuery.toLowerCase())).map(page => (
                <tr key={page.id} className="hover:bg-gray-50">
                  <td className="p-4 font-bold text-gray-800 flex items-center gap-2">
                    <FileText size={16} className="text-gray-400" /> {page.title}
                  </td>
                  <td className="p-4 text-gray-500 font-mono text-sm">/{page.slug}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${page.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                      {page.status}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-gray-500">{new Date(page.updatedAt).toLocaleDateString()}</td>
                  <td className="p-4 text-center">
                    <div className="flex justify-center gap-2">
                      <button onClick={() => handleEdit(page)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><Edit size={16}/></button>
                      <button onClick={() => handleDelete(page.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={16}/></button>
                    </div>
                  </td>
                </tr>
              ))}
              {pages.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-400">No pages found. Create one to get started.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gray-100 relative">
      {/* Editor Header */}
      <div className="bg-white border-b px-6 py-4 flex items-center justify-between sticky top-0 z-20 shadow-sm">
        <div className="flex items-center gap-4">
          <button onClick={() => setView('list')} className="p-2 hover:bg-gray-100 rounded-full text-gray-500">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 className="font-bold text-lg text-gray-800">Page Editor</h2>
            <div className="flex items-center gap-2 text-xs text-gray-500">
               <Globe size={12} /> /{pageMeta.slug}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
           {/* AI Trigger */}
           <button 
             onClick={() => setIsAiModalOpen(true)}
             className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-2 rounded-lg font-bold hover:shadow-lg hover:from-purple-700 hover:to-indigo-700 transition active:scale-95"
           >
             <Sparkles size={18} /> AI Assistant
           </button>

           <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <button 
                onClick={() => setPageMeta({...pageMeta, status: 'draft'})}
                className={`px-3 py-1 text-xs font-bold rounded-md transition ${pageMeta.status === 'draft' ? 'bg-white shadow text-gray-800' : 'text-gray-500'}`}
              >
                Draft
              </button>
              <button 
                 onClick={() => setPageMeta({...pageMeta, status: 'published'})}
                 className={`px-3 py-1 text-xs font-bold rounded-md transition ${pageMeta.status === 'published' ? 'bg-green-500 shadow text-white' : 'text-gray-500'}`}
              >
                Published
              </button>
           </div>
           <button onClick={handleSave} className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 shadow-lg active:scale-95 transition">
             <Save size={18} /> Save Page
           </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left: Component Toolbox */}
        <div className="w-64 bg-white border-r flex flex-col shrink-0">
           <div className="p-4 border-b bg-gray-50">
              <h3 className="font-bold text-gray-700 text-sm uppercase tracking-wider">Add Block</h3>
           </div>
           <div className="p-4 space-y-3 overflow-y-auto">
              <ToolboxItem icon={<Layout />} label="Hero Banner" onClick={() => addBlock('hero')} />
              <ToolboxItem icon={<Type />} label="Text Content" onClick={() => addBlock('text')} />
              <ToolboxItem icon={<ShoppingBag />} label="Product Row" onClick={() => addBlock('product-row')} />
              <ToolboxItem icon={<ImageIcon />} label="Image" onClick={() => addBlock('image')} />
              <ToolboxItem icon={<MoveDown />} label="Spacer" onClick={() => addBlock('spacer')} />
           </div>
           
           <div className="mt-auto p-4 border-t bg-gray-50">
              <h3 className="font-bold text-gray-700 text-sm uppercase tracking-wider mb-2">Page Settings</h3>
              <div className="space-y-3">
                 <div>
                    <label className="text-xs font-bold text-gray-500">Title</label>
                    <input 
                      className="w-full border rounded p-2 text-sm mt-1" 
                      value={pageMeta.title}
                      onChange={e => setPageMeta({...pageMeta, title: e.target.value})}
                    />
                 </div>
                 <div>
                    <label className="text-xs font-bold text-gray-500">Slug</label>
                    <input 
                      className="w-full border rounded p-2 text-sm mt-1" 
                      value={pageMeta.slug}
                      onChange={e => setPageMeta({...pageMeta, slug: e.target.value})}
                    />
                 </div>
              </div>
           </div>
        </div>

        {/* Center: Canvas / Block List */}
        <div className="flex-1 overflow-y-auto p-8 bg-gray-100/50">
           <div className="max-w-4xl mx-auto space-y-6 pb-20">
              {blocks.length === 0 && (
                <div className="border-2 border-dashed border-gray-300 rounded-2xl p-12 text-center text-gray-400 bg-white">
                   <Layout size={48} className="mx-auto mb-4 opacity-50" />
                   <p className="font-medium">This page is empty.</p>
                   <p className="text-sm">Click a block from the sidebar to add content, or use the <strong>AI Assistant</strong> to generate a layout.</p>
                   <button onClick={() => setIsAiModalOpen(true)} className="mt-4 text-purple-600 font-bold hover:underline flex items-center justify-center gap-2 mx-auto">
                      <Sparkles size={16} /> Try AI Generator
                   </button>
                </div>
              )}
              
              {blocks.map((block, index) => (
                <BlockEditor 
                  key={block.id}
                  block={block}
                  index={index}
                  total={blocks.length}
                  onUpdate={(data) => updateBlockData(block.id, data)}
                  onRemove={() => removeBlock(block.id)}
                  onMove={(dir) => moveBlock(index, dir)}
                />
              ))}
           </div>
        </div>
      </div>

      {/* AI Modal */}
      {isAiModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="bg-gradient-to-r from-purple-700 to-indigo-700 p-6 text-white flex justify-between items-start">
              <div>
                <h3 className="font-bold text-xl flex items-center gap-2"><Sparkles size={24} className="text-yellow-300" /> AI Layout Designer</h3>
                <p className="text-purple-100 text-sm mt-1">Describe the page you want to build, and I'll generate the structure and content for you.</p>
              </div>
              <button onClick={() => setIsAiModalOpen(false)} className="bg-white/10 hover:bg-white/20 p-1.5 rounded-full transition"><X size={20} /></button>
            </div>
            
            <div className="p-6">
              <label className="block text-sm font-bold text-gray-700 mb-2">What kind of page do you need?</label>
              <textarea 
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="e.g., A landing page for our new 'Summer Sale' on Water Pumps. I want a hero section with a refreshing image, a text section explaining the discounts, and a list of our best-selling pumps."
                className="w-full border-2 border-purple-100 rounded-xl p-4 text-sm h-32 focus:ring-2 focus:ring-purple-500 outline-none resize-none bg-purple-50/30"
                disabled={isGenerating}
              />
              
              <div className="flex gap-2 mt-2 flex-wrap">
                <span className="text-xs font-bold text-gray-400 uppercase">Try:</span>
                <button onClick={() => setAiPrompt("Home page for high-end water filters")} className="text-xs bg-gray-100 hover:bg-purple-100 text-gray-600 hover:text-purple-700 px-2 py-1 rounded transition">Water Filters Page</button>
                <button onClick={() => setAiPrompt("About Us page with company history")} className="text-xs bg-gray-100 hover:bg-purple-100 text-gray-600 hover:text-purple-700 px-2 py-1 rounded transition">About Us</button>
                <button onClick={() => setAiPrompt("Sale landing page for Water Tanks")} className="text-xs bg-gray-100 hover:bg-purple-100 text-gray-600 hover:text-purple-700 px-2 py-1 rounded transition">Tank Sale</button>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button onClick={() => setIsAiModalOpen(false)} disabled={isGenerating} className="px-4 py-2 text-gray-500 font-bold hover:bg-gray-100 rounded-lg transition">Cancel</button>
                <button 
                  onClick={handleAiGenerate} 
                  disabled={!aiPrompt.trim() || isGenerating}
                  className="px-6 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-bold shadow-lg hover:shadow-purple-200 transition-all flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isGenerating ? <><Loader2 size={18} className="animate-spin" /> Generating...</> : <><Sparkles size={18} /> Generate Layout</>}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const ToolboxItem: React.FC<{ icon: React.ReactNode; label: string; onClick: () => void }> = ({ icon, label, onClick }) => (
  <button onClick={onClick} className="w-full flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:border-blue-500 hover:bg-blue-50 hover:text-blue-700 transition group text-left">
    <div className="text-gray-400 group-hover:text-blue-600">{icon}</div>
    <span className="text-sm font-medium text-gray-600 group-hover:text-blue-700">{label}</span>
    <Plus size={14} className="ml-auto opacity-0 group-hover:opacity-100 transition" />
  </button>
);

const BlockEditor: React.FC<{ 
  block: PageBlock; 
  index: number; 
  total: number;
  onUpdate: (data: any) => void;
  onRemove: () => void;
  onMove: (dir: 'up' | 'down') => void;
}> = ({ block, index, total, onUpdate, onRemove, onMove }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden group hover:shadow-md transition-all">
       {/* Block Header */}
       <div className="bg-gray-50 border-b px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
             <GripVertical size={16} className="text-gray-300 cursor-grab" />
             <span className="text-xs font-bold uppercase text-gray-500 bg-gray-200 px-2 py-0.5 rounded">{block.type}</span>
          </div>
          <div className="flex items-center gap-1 opacity-50 group-hover:opacity-100 transition">
             <button onClick={() => onMove('up')} disabled={index === 0} className="p-1 hover:bg-gray-200 rounded disabled:opacity-30"><MoveUp size={14}/></button>
             <button onClick={() => onMove('down')} disabled={index === total - 1} className="p-1 hover:bg-gray-200 rounded disabled:opacity-30"><MoveDown size={14}/></button>
             <button onClick={onRemove} className="p-1 hover:bg-red-100 text-red-500 rounded ml-2"><Trash2 size={14}/></button>
          </div>
       </div>

       {/* Block Content Form */}
       <div className="p-6">
          {block.type === 'hero' && (
            <div className="grid grid-cols-2 gap-4">
               <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">Title</label>
                  <input className="w-full border rounded p-2 text-sm" value={block.data.title} onChange={e => onUpdate({ title: e.target.value })} />
               </div>
               <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">Subtitle</label>
                  <input className="w-full border rounded p-2 text-sm" value={block.data.subtitle} onChange={e => onUpdate({ subtitle: e.target.value })} />
               </div>
               <div className="col-span-2">
                  <ImageManager images={block.data.image ? [block.data.image] : []} onChange={imgs => onUpdate({ image: imgs[0] || '' })} label="Background Image" multiple={false} />
               </div>
               <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">Button Text</label>
                  <input className="w-full border rounded p-2 text-sm" value={block.data.buttonText} onChange={e => onUpdate({ buttonText: e.target.value })} />
               </div>
            </div>
          )}

          {block.type === 'text' && (
             <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">HTML Content</label>
                <textarea 
                  className="w-full border rounded p-2 text-sm h-32 font-mono" 
                  value={block.data.content} 
                  onChange={e => onUpdate({ content: e.target.value })} 
                />
                <p className="text-xs text-gray-400 mt-1">Supports Basic HTML tags (h1, p, b, i, ul, li)</p>
             </div>
          )}

          {block.type === 'image' && (
             <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                   <ImageManager images={block.data.url ? [block.data.url] : []} onChange={imgs => onUpdate({ url: imgs[0] || '' })} label="Image" multiple={false} />
                </div>
                <div>
                   <label className="block text-xs font-bold text-gray-500 mb-1">Alt Text</label>
                   <input className="w-full border rounded p-2 text-sm" value={block.data.alt} onChange={e => onUpdate({ alt: e.target.value })} />
                </div>
                <div>
                   <label className="block text-xs font-bold text-gray-500 mb-1">Caption</label>
                   <input className="w-full border rounded p-2 text-sm" value={block.data.caption} onChange={e => onUpdate({ caption: e.target.value })} />
                </div>
             </div>
          )}

          {block.type === 'product-row' && (
             <div className="grid grid-cols-2 gap-4">
                <div>
                   <label className="block text-xs font-bold text-gray-500 mb-1">Section Title</label>
                   <input className="w-full border rounded p-2 text-sm" value={block.data.title} onChange={e => onUpdate({ title: e.target.value })} />
                </div>
                <div>
                   <label className="block text-xs font-bold text-gray-500 mb-1">Category Filter</label>
                   <select className="w-full border rounded p-2 text-sm" value={block.data.category} onChange={e => onUpdate({ category: e.target.value })}>
                      <option value="All">All Categories</option>
                      {db.getCategories().map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                   </select>
                </div>
             </div>
          )}

          {block.type === 'spacer' && (
             <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">Height (px)</label>
                <input type="number" className="w-full border rounded p-2 text-sm" value={block.data.height} onChange={e => onUpdate({ height: parseInt(e.target.value) })} />
             </div>
          )}
       </div>
    </div>
  );
};
