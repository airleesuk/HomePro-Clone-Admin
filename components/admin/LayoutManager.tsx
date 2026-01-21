
import React, { useState, useEffect } from 'react';
import { db } from '../../services/mockDb';
import { PageLayout, PageBlock, BlockType } from '../../types';
import { 
  Plus, Search, Edit, Trash2, Save, Layout, Star, 
  Check, ArrowLeft, MoreHorizontal, LayoutTemplate, 
  Image as ImageIcon, Type, LayoutGrid, ShoppingBag, 
  MessageSquareQuote, MoveDown
} from 'lucide-react';
import { BlockEditor, ToolboxItem, getDefaultBlockData } from './EditorComponents';

export const LayoutManager: React.FC = () => {
  const [view, setView] = useState<'list' | 'edit'>('list');
  const [layouts, setLayouts] = useState<PageLayout[]>([]);
  const [currentLayout, setCurrentLayout] = useState<PageLayout | null>(null);
  const [blocks, setBlocks] = useState<PageBlock[]>([]);
  const [layoutMeta, setLayoutMeta] = useState({ name: '', description: '' });

  useEffect(() => {
    refreshLayouts();
  }, []);

  const refreshLayouts = () => {
    setLayouts([...db.getLayouts()]);
  };

  const handleCreateNew = () => {
    const newLayout: PageLayout = {
      id: `layout-${Date.now()}`,
      name: 'New Layout',
      description: '',
      blocks: [],
      isDefault: false
    };
    setCurrentLayout(newLayout);
    setBlocks([]);
    setLayoutMeta({ name: newLayout.name, description: newLayout.description || '' });
    setView('edit');
  };

  const handleEdit = (layout: PageLayout) => {
    setCurrentLayout(layout);
    setBlocks(layout.blocks);
    setLayoutMeta({ name: layout.name, description: layout.description || '' });
    setView('edit');
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this layout?')) {
      db.deleteLayout(id);
      refreshLayouts();
    }
  };

  const handleSetDefault = (layout: PageLayout) => {
    db.updateLayout({ ...layout, isDefault: true });
    refreshLayouts();
  };

  const handleSave = () => {
    if (!currentLayout) return;
    const updatedLayout: PageLayout = {
      ...currentLayout,
      name: layoutMeta.name,
      description: layoutMeta.description,
      blocks: blocks
    };

    if (db.getLayouts().find(l => l.id === updatedLayout.id)) {
      db.updateLayout(updatedLayout);
    } else {
      db.addLayout(updatedLayout);
    }
    refreshLayouts();
    setView('list');
  };

  // Block Management (Reused Logic)
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

  if (view === 'list') {
    return (
      <div className="p-8">
        <div className="bg-white p-6 rounded-2xl shadow-md mb-8 flex justify-between items-center">
          <div>
             <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <LayoutTemplate size={24} className="text-purple-600" /> Layouts & Templates
             </h2>
             <p className="text-sm text-gray-500 mt-1">Manage reusable page structures and set a default layout for new pages.</p>
          </div>
          <button 
            onClick={handleCreateNew}
            className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-3 rounded-xl flex items-center gap-2 font-bold shadow-lg transition active:scale-95"
          >
            <Plus size={18} /> Create New Layout
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {layouts.map(layout => (
             <div key={layout.id} className={`bg-white rounded-2xl border transition-all hover:shadow-xl group flex flex-col overflow-hidden ${layout.isDefault ? 'border-purple-500 ring-2 ring-purple-100' : 'border-gray-200'}`}>
                {/* Header / Preview Area */}
                <div className="h-32 bg-gray-50 border-b border-gray-100 flex items-center justify-center relative p-6">
                   <div className="scale-[0.4] origin-center w-full select-none pointer-events-none opacity-50 blur-[1px]">
                      {/* Abstract Mini Preview */}
                      <div className="space-y-4">
                         <div className="h-20 bg-gray-300 rounded-lg w-full"></div>
                         <div className="flex gap-4">
                            <div className="h-20 bg-gray-200 rounded-lg flex-1"></div>
                            <div className="h-20 bg-gray-200 rounded-lg flex-1"></div>
                         </div>
                      </div>
                   </div>
                   {layout.isDefault && (
                      <div className="absolute top-3 right-3 bg-purple-600 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-sm flex items-center gap-1">
                         <Star size={10} fill="currentColor" /> DEFAULT
                      </div>
                   )}
                </div>

                <div className="p-5 flex-1 flex flex-col">
                   <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-gray-800 text-lg">{layout.name}</h3>
                   </div>
                   <p className="text-sm text-gray-500 mb-4 line-clamp-2 h-10">{layout.description || 'No description provided.'}</p>
                   
                   <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-50">
                      <span className="text-xs font-bold text-gray-400 bg-gray-100 px-2 py-1 rounded">{layout.blocks.length} Blocks</span>
                      
                      <div className="flex items-center gap-2">
                         {!layout.isDefault && (
                            <button 
                              onClick={() => handleSetDefault(layout)}
                              className="text-gray-400 hover:text-purple-600 p-2 rounded-lg hover:bg-purple-50 transition" 
                              title="Set as Default"
                            >
                               <Star size={16} />
                            </button>
                         )}
                         <button onClick={() => handleEdit(layout)} className="text-blue-600 hover:bg-blue-50 p-2 rounded-lg transition"><Edit size={16}/></button>
                         {!layout.isDefault && (
                            <button onClick={() => handleDelete(layout.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition"><Trash2 size={16}/></button>
                         )}
                      </div>
                   </div>
                </div>
             </div>
           ))}
        </div>
      </div>
    );
  }

  // Edit View
  return (
    <div className="h-full flex flex-col bg-gray-100 relative">
      <div className="bg-white border-b px-6 py-4 flex items-center justify-between sticky top-0 z-20 shadow-sm">
        <div className="flex items-center gap-4">
          <button onClick={() => setView('list')} className="p-2 hover:bg-gray-100 rounded-full text-gray-500">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 className="font-bold text-lg text-gray-800">Edit Layout</h2>
            <div className="text-xs text-gray-500">
               Editing: <span className="font-medium text-gray-700">{layoutMeta.name}</span>
            </div>
          </div>
        </div>
        <button onClick={handleSave} className="flex items-center gap-2 bg-purple-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-purple-700 shadow-lg active:scale-95 transition">
           <Save size={18} /> Save Layout
        </button>
      </div>

      <div className="flex-1 flex overflow-hidden">
         {/* Sidebar */}
         <div className="w-72 bg-white border-r flex flex-col shrink-0">
            <div className="p-6 border-b bg-gray-50">
               <h3 className="font-bold text-gray-700 text-sm uppercase tracking-wider mb-4">Layout Settings</h3>
               <div className="space-y-4">
                  <div>
                     <label className="block text-xs font-bold text-gray-500 mb-1">Layout Name</label>
                     <input 
                        className="w-full border rounded-lg p-2 text-sm focus:ring-2 focus:ring-purple-500 outline-none"
                        value={layoutMeta.name}
                        onChange={e => setLayoutMeta({...layoutMeta, name: e.target.value})}
                     />
                  </div>
                  <div>
                     <label className="block text-xs font-bold text-gray-500 mb-1">Description</label>
                     <textarea 
                        className="w-full border rounded-lg p-2 text-sm h-20 resize-none focus:ring-2 focus:ring-purple-500 outline-none"
                        value={layoutMeta.description}
                        onChange={e => setLayoutMeta({...layoutMeta, description: e.target.value})}
                     />
                  </div>
               </div>
            </div>
            
            <div className="p-4 bg-gray-50 border-b">
               <h3 className="font-bold text-gray-700 text-sm uppercase tracking-wider">Add Block</h3>
            </div>
            <div className="p-4 space-y-2 overflow-y-auto flex-1">
               <ToolboxItem icon={<Layout />} label="Hero Banner" onClick={() => addBlock('hero')} />
               <ToolboxItem icon={<Type />} label="Text Content" onClick={() => addBlock('text')} />
               <ToolboxItem icon={<LayoutGrid />} label="Feature Grid" onClick={() => addBlock('grid')} />
               <ToolboxItem icon={<ShoppingBag />} label="Product Row" onClick={() => addBlock('product-row')} />
               <ToolboxItem icon={<MessageSquareQuote />} label="Testimonials" onClick={() => addBlock('testimonial')} />
               <ToolboxItem icon={<ImageIcon />} label="Image" onClick={() => addBlock('image')} />
               <ToolboxItem icon={<MoveDown />} label="Spacer" onClick={() => addBlock('spacer')} />
            </div>
         </div>

         {/* Canvas */}
         <div className="flex-1 overflow-y-auto p-8 bg-gray-100/50">
            <div className="max-w-4xl mx-auto space-y-6 pb-20">
               {blocks.length === 0 && (
                  <div className="border-2 border-dashed border-gray-300 rounded-2xl p-16 text-center text-gray-400 bg-white">
                     <LayoutTemplate size={48} className="mx-auto mb-4 opacity-50" />
                     <p className="font-medium">Empty Layout</p>
                     <p className="text-sm">Add blocks from the sidebar to define the structure.</p>
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
    </div>
  );
};
