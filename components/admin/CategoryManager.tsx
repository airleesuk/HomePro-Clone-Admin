
import React, { useState, useEffect } from 'react';
import { db } from '../../services/mockDb';
import { Category } from '../../types';
import { 
  Plus, Edit, Trash2, Search, ArrowUp, ArrowDown, X, Layout,
  Zap, Droplets, Wrench, Grid, HardHat, Lightbulb, FlaskConical, Database, 
  Utensils, Snowflake, Gauge, Bath, Truck, Recycle, Waves, GlassWater, 
  ArrowDownToLine, Filter, Box, Settings, GripVertical 
} from 'lucide-react';
import { ImageManager } from './ImageManager';
import { MegaMenuEditModal } from './MegaMenuEditModal';

const IconMap: Record<string, React.ReactNode> = {
  'zap': <Zap size={16} />,
  'droplets': <Droplets size={16} />,
  'wrench': <Wrench size={16} />,
  'grid': <Grid size={16} />,
  'hard-hat': <HardHat size={16} />,
  'lightbulb': <Lightbulb size={16} />,
  'flask': <FlaskConical size={16} />,
  'database': <Database size={16} />,
  'utensils': <Utensils size={16} />,
  'snowflake': <Snowflake size={16} />,
  'gauge': <Gauge size={16} />,
  'bath': <Bath size={16} />,
  'truck': <Truck size={16} />,
  'recycle': <Recycle size={16} />,
  'waves': <Waves size={16} />,
  'glass-water': <GlassWater size={16} />,
  'arrow-down-to-line': <ArrowDownToLine size={16} />,
  'filter': <Filter size={16} />,
  'box': <Box size={16} />,
  'filter-cog': <Settings size={16} />,
};

export const CategoryManager: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Basic Edit Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  
  // Basic Category Form Data
  const [formData, setFormData] = useState<Partial<Category>>({
    name: '',
    icon: '',
    iconKey: 'box'
  });

  // Mega Menu Edit Modal
  const [isMegaMenuModalOpen, setIsMegaMenuModalOpen] = useState(false);
  const [megaMenuCategory, setMegaMenuCategory] = useState<Category | null>(null);

  // DnD State
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = () => {
    setCategories([...db.getCategories()]);
  };

  const filteredCategories = categories.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = (id: number) => {
    if (confirm('คุณแน่ใจหรือไม่ที่จะลบหมวดหมู่นี้?')) {
      db.deleteCategory(id);
      refreshData();
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      icon: category.icon,
      iconKey: category.iconKey
    });
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setEditingCategory(null);
    setFormData({ 
      name: '', 
      icon: 'https://via.placeholder.com/150x150.png?text=New+Category', 
      iconKey: 'box'
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingCategory) {
      // Update Basic Category Info
      db.updateCategory({ 
        ...editingCategory, 
        name: formData.name!,
        icon: formData.icon!,
        iconKey: formData.iconKey 
      });
    } else {
      // Add new category
      db.addCategory(formData as Category);
    }
    
    setIsModalOpen(false);
    refreshData();
  };

  const handleEditMegaMenu = (category: Category) => {
    setMegaMenuCategory(category);
    setIsMegaMenuModalOpen(true);
  };

  const moveCategory = (index: number, direction: 'up' | 'down') => {
    const newCategories = [...categories];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;

    if (targetIndex >= 0 && targetIndex < newCategories.length) {
      [newCategories[index], newCategories[targetIndex]] = [newCategories[targetIndex], newCategories[index]];
      setCategories(newCategories);
      db.reorderCategories(newCategories);
    }
  };

  // DnD Handlers
  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    // Required for Firefox
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", index.toString());
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault(); // Necessary to allow dropping
    if (draggedIndex === null || draggedIndex === index) return;
    
    // Optimistic UI update
    const newCategories = [...categories];
    const draggedItem = newCategories[draggedIndex];
    newCategories.splice(draggedIndex, 1);
    newCategories.splice(index, 0, draggedItem);
    
    setCategories(newCategories);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    // Persist new order to DB
    db.reorderCategories(categories);
  };

  return (
    <div className="p-4 md:p-8">
      <div className="bg-white p-6 rounded-2xl shadow-md mb-8 flex flex-col md:flex-row gap-6 justify-between items-center">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="ค้นหาหมวดหมู่..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-gray-50 border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition"
          />
        </div>
        <button 
          onClick={handleAddNew}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl flex items-center gap-2 font-bold shadow-lg transition active:scale-95 whitespace-nowrap"
        >
          <Plus size={18} /> เพิ่มหมวดหมู่
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-bold tracking-wider">
            <tr>
              <th className="p-4 w-20 text-center">ลำดับ</th>
              <th className="p-4">แสดงผล (Image & Icon)</th>
              <th className="p-4">ชื่อหมวดหมู่</th>
              <th className="p-4 text-center">จัดเรียง</th>
              <th className="p-4 text-center">จัดการ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredCategories.map((cat, index) => (
              <tr 
                key={cat.id} 
                className={`transition ${draggedIndex === index ? 'bg-blue-50' : 'hover:bg-gray-50/50'}`}
                draggable={!searchQuery} // Disable DnD when filtering
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragEnd={handleDragEnd}
              >
                <td className="p-4 text-center text-gray-400 font-mono flex items-center justify-center gap-2 h-full">
                  {!searchQuery && <GripVertical size={16} className="text-gray-300 cursor-grab active:cursor-grabbing" />}
                  #{index + 1}
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    {/* Category Image */}
                    <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden border border-gray-200 shrink-0">
                       {cat.icon ? (
                         <img src={cat.icon} alt={cat.name} className="w-full h-full object-cover" />
                       ) : (
                         <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">No Img</div>
                       )}
                    </div>
                    {/* Lucide Icon Badge */}
                    <div className="flex flex-col justify-center">
                       <div className="flex items-center gap-1.5 text-xs text-gray-600 bg-gray-100 px-2.5 py-1 rounded-md border border-gray-200">
                          <span className="text-gray-500">{IconMap[cat.iconKey || 'box'] || <Box size={14} />}</span>
                          <span className="font-mono text-[10px] font-medium">{cat.iconKey || 'box'}</span>
                       </div>
                    </div>
                  </div>
                </td>
                <td className="p-4 font-bold text-gray-800">{cat.name}</td>
                <td className="p-4">
                  <div className="flex items-center justify-center gap-1">
                    <button 
                      onClick={() => moveCategory(index, 'up')}
                      disabled={index === 0}
                      className="p-1.5 rounded-lg hover:bg-gray-200 disabled:opacity-30 transition"
                    >
                      <ArrowUp size={16} />
                    </button>
                    <button 
                      onClick={() => moveCategory(index, 'down')}
                      disabled={index === categories.length - 1}
                      className="p-1.5 rounded-lg hover:bg-gray-200 disabled:opacity-30 transition"
                    >
                      <ArrowDown size={16} />
                    </button>
                  </div>
                </td>
                <td className="p-4 text-center">
                  <div className="flex justify-center gap-2">
                    <button onClick={() => handleEdit(cat)} className="text-blue-600 hover:bg-blue-50 p-2 rounded-lg transition" title="แก้ไขข้อมูลทั่วไป"><Edit size={16}/></button>
                    <button onClick={() => handleEditMegaMenu(cat)} className="text-purple-600 hover:bg-purple-50 p-2 rounded-lg transition" title="จัดการ Mega Menu"><Layout size={16}/></button>
                    <button onClick={() => handleDelete(cat.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition" title="ลบ"><Trash2 size={16}/></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Basic Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-[110] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
            <div className="bg-gray-800 p-4 flex justify-between items-center text-white shrink-0">
              <h3 className="font-bold">{editingCategory ? 'แก้ไขหมวดหมู่' : 'เพิ่มหมวดหมู่ใหม่'}</h3>
              <button onClick={() => setIsModalOpen(false)}><X size={20}/></button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                 <div className="col-span-2">
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">ชื่อหมวดหมู่</label>
                    <input 
                      type="text" 
                      value={formData.name} 
                      onChange={e => setFormData({...formData, name: e.target.value})} 
                      className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none" 
                      required 
                    />
                 </div>
                 
                 <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Lucide Icon Key</label>
                    <input 
                      type="text" 
                      value={formData.iconKey} 
                      onChange={e => setFormData({...formData, iconKey: e.target.value})} 
                      className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none" 
                      placeholder="e.g. zap"
                    />
                 </div>
                 
                 <div>
                     <label className="block text-xs font-bold text-gray-500 uppercase mb-1">&nbsp;</label>
                     <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-lg border border-gray-100">
                        {IconMap[formData.iconKey || 'box'] || <Box size={18} className="text-gray-400" />}
                        <span className="text-xs text-gray-500">Preview Icon</span>
                     </div>
                 </div>
              </div>

              <div>
                 <ImageManager 
                    images={formData.icon ? [formData.icon] : []}
                    onChange={(newImages) => setFormData({...formData, icon: newImages[0] || ''})}
                    label="รูปภาพไอคอน (Icon Image)"
                    multiple={false}
                 />
              </div>

              <div className="pt-4 flex justify-end gap-3 shrink-0">
                 <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-600 font-bold hover:bg-gray-100 rounded-lg transition">ยกเลิก</button>
                 <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-xl font-bold shadow-lg hover:bg-blue-700 transition">บันทึก</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Mega Menu Edit Modal */}
      {megaMenuCategory && (
        <MegaMenuEditModal
          isOpen={isMegaMenuModalOpen}
          onClose={() => setIsMegaMenuModalOpen(false)}
          category={megaMenuCategory}
          onSave={refreshData}
        />
      )}
    </div>
  );
};
