
import React from 'react';
import { 
  MoveUp, MoveDown, Trash2, GripVertical, Plus, 
  Layout, Type, LayoutGrid, ShoppingBag, MessageSquareQuote, 
  Image as ImageIcon, MoveDown as MoveDownIcon, X, Columns
} from 'lucide-react';
import { PageBlock, BlockType } from '../../types';
import { ImageManager } from './ImageManager';
import { db } from '../../services/mockDb';

export const getDefaultBlockData = (type: BlockType) => {
  switch (type) {
    case 'hero': return { title: 'Hero Title', subtitle: 'Subtitle goes here', image: '', buttonText: 'Click Me' };
    case 'text': return { content: '<h2>Heading</h2><p>Write your content here...</p>' };
    case 'product-row': return { title: 'Featured Products', category: 'All', count: 4 };
    case 'image': return { url: '', alt: '', caption: '' };
    case 'spacer': return { height: 50 };
    case 'grid': return { columns: 3, items: [{ title: 'Feature 1', description: 'Description', image: '' }, { title: 'Feature 2', description: 'Description', image: '' }, { title: 'Feature 3', description: 'Description', image: '' }] };
    case 'testimonial': return { title: 'What our customers say', items: [{ name: 'John Doe', role: 'Homeowner', quote: 'Great service!', avatar: '' }] };
    default: return {};
  }
};

export const ToolboxItem: React.FC<{ icon: React.ReactNode; label: string; onClick: () => void }> = ({ icon, label, onClick }) => (
  <button onClick={onClick} className="w-full flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:border-blue-500 hover:bg-blue-50 hover:text-blue-700 transition group text-left bg-white">
    <div className="text-gray-400 group-hover:text-blue-600">{icon}</div>
    <span className="text-sm font-medium text-gray-600 group-hover:text-blue-700">{label}</span>
    <Plus size={14} className="ml-auto opacity-0 group-hover:opacity-100 transition" />
  </button>
);

export const BlockEditor: React.FC<{ 
  block: PageBlock; 
  index: number; 
  total: number;
  onUpdate: (data: any) => void;
  onRemove: () => void;
  onMove: (dir: 'up' | 'down') => void;
}> = ({ block, index, total, onUpdate, onRemove, onMove }) => {
  
  const updateGridItem = (itemIndex: number, field: string, value: any) => {
      const items = [...(block.data.items || [])];
      items[itemIndex] = { ...items[itemIndex], [field]: value };
      onUpdate({ items });
  };

  const addGridItem = () => {
      onUpdate({ items: [...(block.data.items || []), { title: 'New Item', description: 'Description', image: '' }] });
  };
  
  const removeGridItem = (idx: number) => {
      const items = [...(block.data.items || [])];
      items.splice(idx, 1);
      onUpdate({ items });
  };

  const updateTestimonialItem = (itemIndex: number, field: string, value: any) => {
      const items = [...(block.data.items || [])];
      items[itemIndex] = { ...items[itemIndex], [field]: value };
      onUpdate({ items });
  };

  const removeTestimonialItem = (idx: number) => {
      const items = [...(block.data.items || [])];
      items.splice(idx, 1);
      onUpdate({ items });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden group hover:shadow-md transition-all">
       {/* Block Header */}
       <div className="bg-gray-50 border-b px-4 py-2 flex items-center justify-between cursor-move">
          <div className="flex items-center gap-2">
             <GripVertical size={16} className="text-gray-300" />
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

          {block.type === 'grid' && (
             <div className="space-y-4">
                <div>
                    <label className="block text-xs font-bold text-gray-500 mb-2">Columns</label>
                    <div className="flex gap-2">
                        {[2, 3, 4].map(num => (
                            <button 
                                key={num}
                                onClick={() => onUpdate({ columns: num })}
                                className={`px-4 py-2 border rounded-lg text-sm font-bold flex items-center gap-2 ${block.data.columns === num ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                            >
                                <Columns size={16} /> {num} Cols
                            </button>
                        ))}
                    </div>
                </div>
                
                <div className="space-y-3">
                    <label className="block text-xs font-bold text-gray-500">Grid Items</label>
                    {block.data.items?.map((item: any, idx: number) => (
                        <div key={idx} className="border rounded-xl p-4 bg-gray-50 relative group/item">
                            <button onClick={() => removeGridItem(idx)} className="absolute top-2 right-2 text-gray-400 hover:text-red-500"><X size={14}/></button>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-3">
                                    <input 
                                        className="w-full border rounded p-2 text-sm" 
                                        placeholder="Item Title"
                                        value={item.title} 
                                        onChange={e => updateGridItem(idx, 'title', e.target.value)} 
                                    />
                                    <textarea 
                                        className="w-full border rounded p-2 text-sm h-20 resize-none" 
                                        placeholder="Description..."
                                        value={item.description} 
                                        onChange={e => updateGridItem(idx, 'description', e.target.value)} 
                                    />
                                </div>
                                <div>
                                    <ImageManager 
                                        images={item.image ? [item.image] : []} 
                                        onChange={imgs => updateGridItem(idx, 'image', imgs[0] || '')} 
                                        label="Icon/Image" 
                                        multiple={false} 
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                    <button onClick={addGridItem} className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 font-bold hover:border-blue-500 hover:text-blue-600 transition flex items-center justify-center gap-2">
                        <Plus size={16} /> Add Grid Item
                    </button>
                </div>
             </div>
          )}

          {block.type === 'testimonial' && (
             <div className="space-y-4">
                <div>
                   <label className="block text-xs font-bold text-gray-500 mb-1">Section Title</label>
                   <input className="w-full border rounded p-2 text-sm" value={block.data.title} onChange={e => onUpdate({ title: e.target.value })} />
                </div>
                
                <div className="space-y-3">
                    <label className="block text-xs font-bold text-gray-500">Testimonials</label>
                    {block.data.items?.map((item: any, idx: number) => (
                        <div key={idx} className="border rounded-xl p-4 bg-gray-50 relative group/item">
                            <button onClick={() => removeTestimonialItem(idx)} className="absolute top-2 right-2 text-gray-400 hover:text-red-500"><X size={14}/></button>
                            <div className="grid grid-cols-1 gap-3">
                                <input 
                                    className="w-full border rounded p-2 text-sm" 
                                    placeholder="Name"
                                    value={item.name} 
                                    onChange={e => updateTestimonialItem(idx, 'name', e.target.value)} 
                                />
                                <input 
                                    className="w-full border rounded p-2 text-sm" 
                                    placeholder="Role / Title"
                                    value={item.role} 
                                    onChange={e => updateTestimonialItem(idx, 'role', e.target.value)} 
                                />
                                <textarea 
                                    className="w-full border rounded p-2 text-sm h-20 resize-none" 
                                    placeholder="Quote..."
                                    value={item.quote} 
                                    onChange={e => updateTestimonialItem(idx, 'quote', e.target.value)} 
                                />
                                <ImageManager 
                                    images={item.avatar ? [item.avatar] : []} 
                                    onChange={imgs => updateTestimonialItem(idx, 'avatar', imgs[0] || '')} 
                                    label="Avatar" 
                                    multiple={false} 
                                />
                            </div>
                        </div>
                    ))}
                    <button onClick={() => onUpdate({ items: [...(block.data.items || []), { name: 'New Person', role: 'Customer', quote: 'Review text...', avatar: '' }] })} className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 font-bold hover:border-blue-500 hover:text-blue-600 transition flex items-center justify-center gap-2">
                        <Plus size={16} /> Add Testimonial
                    </button>
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
                <div className="flex items-center gap-3">
                   <input 
                     type="range" 
                     min="10" 
                     max="300" 
                     step="10"
                     className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                     value={block.data.height || 50} 
                     onChange={e => onUpdate({ height: parseInt(e.target.value) || 0 })} 
                   />
                   <div className="relative">
                      <input 
                        type="number" 
                        className="w-20 border rounded p-2 text-sm text-center pr-6" 
                        value={block.data.height || 50} 
                        onChange={e => onUpdate({ height: parseInt(e.target.value) || 0 })} 
                      />
                      <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-400 pointer-events-none">px</span>
                   </div>
                </div>
                <div className="flex justify-between text-[10px] text-gray-400 mt-1 px-1">
                   <span>10px</span>
                   <span>300px</span>
                </div>
             </div>
          )}
       </div>
    </div>
  );
};
