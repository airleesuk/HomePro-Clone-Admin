
import React, { useState, useEffect } from 'react';
import { db } from '../../services/mockDb';
import { ContentItem } from '../../types';
import { Search, Edit, Save, X, FileText, ImageIcon, AlignLeft } from 'lucide-react';
import { ImageManager } from './ImageManager';

export const ContentManager: React.FC = () => {
  const [items, setItems] = useState<ContentItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ContentItem | null>(null);

  useEffect(() => {
    refreshData();
  }, [searchQuery]);

  const refreshData = () => {
    setItems(db.queryContentItems(searchQuery));
  };

  const handleEdit = (item: ContentItem) => {
    setEditingItem({ ...item }); // Create a copy for editing
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const handleSave = () => {
    if (editingItem) {
      db.updateContentItem(editingItem);
      handleCloseModal();
      refreshData();
    }
  };
  
  const renderValueInput = () => {
    if (!editingItem) return null;
    
    switch (editingItem.type) {
      case 'image':
        return (
          <ImageManager
            images={editingItem.value ? [editingItem.value] : []}
            onChange={(imgs) => setEditingItem({ ...editingItem, value: imgs[0] || '' })}
            label="Image URL"
            multiple={false}
          />
        );
      case 'rich-text':
        return (
          <textarea
            value={editingItem.value}
            onChange={(e) => setEditingItem({ ...editingItem, value: e.target.value })}
            rows={5}
            className="w-full border rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Enter rich text / HTML content..."
          />
        );
      case 'text':
      default:
        return (
          <input
            type="text"
            value={editingItem.value}
            onChange={(e) => setEditingItem({ ...editingItem, value: e.target.value })}
            className="w-full border rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Enter text content..."
          />
        );
    }
  };

  const renderTypeIcon = (type: ContentItem['type']) => {
    switch (type) {
        case 'image': return <ImageIcon size={16} className="text-purple-500" />;
        case 'rich-text': return <AlignLeft size={16} className="text-orange-500" />;
        default: return <FileText size={16} className="text-blue-500" />;
    }
  };

  return (
    <div className="p-4 md:p-8">
      <div className="bg-white p-6 rounded-2xl shadow-md mb-8">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="Search content by key, value, or description..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-gray-50 border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-bold tracking-wider">
            <tr>
              <th className="p-4">Content Key</th>
              <th className="p-4">Preview</th>
              <th className="p-4">Type</th>
              <th className="p-4">Description</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50/50">
                <td className="p-4 font-mono text-sm text-purple-700">{item.key}</td>
                <td className="p-4">
                  {item.type === 'image' ? (
                    <img src={item.value} alt={item.key} className="w-24 h-12 object-cover rounded-md border" />
                  ) : (
                    <span className="text-gray-600 text-sm line-clamp-2" title={item.value}>{item.value}</span>
                  )}
                </td>
                <td className="p-4">
                    <span className="inline-flex items-center gap-2 text-xs font-bold bg-gray-100 px-2 py-1 rounded">
                        {renderTypeIcon(item.type)}
                        {item.type}
                    </span>
                </td>
                <td className="p-4 text-sm text-gray-500">{item.description}</td>
                <td className="p-4 text-center">
                  <button onClick={() => handleEdit(item)} className="text-blue-600 hover:bg-blue-50 p-2 rounded-lg transition" title="Edit Content">
                    <Edit size={16}/>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && editingItem && (
        <div className="fixed inset-0 bg-black/60 z-[110] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
            <div className="bg-gray-800 p-4 flex justify-between items-center text-white shrink-0">
              <h3 className="font-bold">Edit Content</h3>
              <button onClick={handleCloseModal}><X size={20}/></button>
            </div>
            
            <div className="p-6 space-y-4 overflow-y-auto">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Content Key</label>
                <input 
                  type="text" 
                  value={editingItem.key} 
                  readOnly 
                  className="w-full border rounded-xl p-3 text-sm bg-gray-100 text-gray-500 font-mono cursor-not-allowed"
                />
              </div>
              
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Description</label>
                <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-xl border">{editingItem.description}</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Content Value</label>
                {renderValueInput()}
              </div>

            </div>
            <div className="p-4 border-t bg-gray-50 flex justify-end gap-3 shrink-0">
               <button type="button" onClick={handleCloseModal} className="px-4 py-2 text-gray-600 font-bold hover:bg-gray-100 rounded-lg transition">Cancel</button>
               <button type="button" onClick={handleSave} className="px-6 py-2 bg-blue-600 text-white rounded-xl font-bold shadow-lg hover:bg-blue-700 transition flex items-center gap-2">
                  <Save size={18} /> Save Content
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};