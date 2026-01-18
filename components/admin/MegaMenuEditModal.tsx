
import React, { useState, useEffect } from 'react';
import { Save, X, Plus, ArrowLeft, ArrowRight, Trash2, Layout, GripVertical, MoveUp, MoveDown } from 'lucide-react';
import { Category, CategoryDetail } from '../../types';
import { db } from '../../services/mockDb';
import { ImageManager } from './ImageManager';

interface MegaMenuEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: Category;
  onSave: () => void;
}

export const MegaMenuEditModal: React.FC<MegaMenuEditModalProps> = ({ isOpen, onClose, category, onSave }) => {
  const [editingDetail, setEditingDetail] = useState<CategoryDetail | null>(null);

  useEffect(() => {
    if (isOpen && category) {
      const existing = db.getCategoryDetail(category.id);
      const detail: CategoryDetail = existing ? { 
        ...existing,
        // Ensure arrays are initialized even if missing in stored data
        highlights: Array.isArray(existing.highlights) ? existing.highlights : [],
        subCategories: Array.isArray(existing.subCategories) ? existing.subCategories : []
      } : {
        id: category.id,
        name: category.name,
        iconKey: category.iconKey || 'box',
        highlights: [
          { title: 'Highlight 1', img: '' },
          { title: 'Highlight 2', img: '' },
          { title: 'Highlight 3', img: '' },
        ],
        subCategories: [
          { title: 'แนะนำ', items: ['สินค้ายอดนิยม', 'สินค้ามาใหม่'] }
        ],
        promoText: 'ใส่ข้อความโปรโมชั่นที่นี่...',
        promoImg: ''
      };
      
      // Sync basic fields
      detail.name = category.name;
      detail.iconKey = category.iconKey || 'box';
      
      setEditingDetail(detail);
    }
  }, [isOpen, category]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingDetail) {
      const cleanedDetail = {
        ...editingDetail,
        subCategories: editingDetail.subCategories.map(sub => ({
          ...sub,
          items: sub.items.map(i => i.trim()).filter(i => i !== '')
        }))
      };
      db.updateCategoryDetail(cleanedDetail);
      onSave();
      onClose();
    }
  };

  // --- Highlights Logic ---
  const updateHighlight = (index: number, field: 'title' | 'img', value: string) => {
    if (!editingDetail) return;
    const newHighlights = [...editingDetail.highlights];
    newHighlights[index] = { ...newHighlights[index], [field]: value };
    setEditingDetail({ ...editingDetail, highlights: newHighlights });
  };

  const addHighlight = () => {
    if (!editingDetail) return;
    setEditingDetail({
        ...editingDetail,
        highlights: [...editingDetail.highlights, { title: 'New Item', img: '' }]
    });
  };

  const removeHighlight = (index: number) => {
    if (!editingDetail) return;
    const newHighlights = [...editingDetail.highlights];
    newHighlights.splice(index, 1);
    setEditingDetail({ ...editingDetail, highlights: newHighlights });
  };

  const moveHighlight = (index: number, direction: 'left' | 'right') => {
    if (!editingDetail) return;
    const newHighlights = [...editingDetail.highlights];
    const targetIndex = direction === 'left' ? index - 1 : index + 1;
    if (targetIndex >= 0 && targetIndex < newHighlights.length) {
      [newHighlights[index], newHighlights[targetIndex]] = [newHighlights[targetIndex], newHighlights[index]];
      setEditingDetail({ ...editingDetail, highlights: newHighlights });
    }
  };

  // --- SubCategories Logic ---
  const updateSubCategoryTitle = (index: number, value: string) => {
    if (!editingDetail) return;
    const newSubs = [...editingDetail.subCategories];
    newSubs[index] = { ...newSubs[index], title: value };
    setEditingDetail({ ...editingDetail, subCategories: newSubs });
  };

  const addSubCategory = () => {
    if (!editingDetail) return;
    setEditingDetail({
      ...editingDetail,
      subCategories: [...editingDetail.subCategories, { title: 'New Group', items: ['Item 1'] }]
    });
  };

  const removeSubCategory = (index: number) => {
    if (!editingDetail) return;
    const newSubs = [...editingDetail.subCategories];
    newSubs.splice(index, 1);
    setEditingDetail({ ...editingDetail, subCategories: newSubs });
  };

  const moveSubCategory = (index: number, direction: 'left' | 'right') => {
    if (!editingDetail) return;
    const newSubs = [...editingDetail.subCategories];
    const targetIndex = direction === 'left' ? index - 1 : index + 1;
    if (targetIndex >= 0 && targetIndex < newSubs.length) {
      [newSubs[index], newSubs[targetIndex]] = [newSubs[targetIndex], newSubs[index]];
      setEditingDetail({ ...editingDetail, subCategories: newSubs });
    }
  };

  // --- SubCategory Items Logic ---
  const updateSubCategoryItem = (subIndex: number, itemIndex: number, value: string) => {
    if (!editingDetail) return;
    const newSubs = [...editingDetail.subCategories];
    const newItems = [...newSubs[subIndex].items];
    newItems[itemIndex] = value;
    newSubs[subIndex] = { ...newSubs[subIndex], items: newItems };
    setEditingDetail({ ...editingDetail, subCategories: newSubs });
  };

  const addSubCategoryItem = (subIndex: number) => {
    if (!editingDetail) return;
    const newSubs = [...editingDetail.subCategories];
    newSubs[subIndex] = { 
        ...newSubs[subIndex], 
        items: [...newSubs[subIndex].items, 'New Item'] 
    };
    setEditingDetail({ ...editingDetail, subCategories: newSubs });
  };

  const removeSubCategoryItem = (subIndex: number, itemIndex: number) => {
    if (!editingDetail) return;
    const newSubs = [...editingDetail.subCategories];
    const newItems = [...newSubs[subIndex].items];
    newItems.splice(itemIndex, 1);
    newSubs[subIndex] = { ...newSubs[subIndex], items: newItems };
    setEditingDetail({ ...editingDetail, subCategories: newSubs });
  };

  const moveSubCategoryItem = (subIndex: number, itemIndex: number, direction: 'up' | 'down') => {
    if (!editingDetail) return;
    const newSubs = [...editingDetail.subCategories];
    const newItems = [...newSubs[subIndex].items];
    const targetIndex = direction === 'up' ? itemIndex - 1 : itemIndex + 1;
    
    if (targetIndex >= 0 && targetIndex < newItems.length) {
      [newItems[itemIndex], newItems[targetIndex]] = [newItems[targetIndex], newItems[itemIndex]];
      newSubs[subIndex] = { ...newSubs[subIndex], items: newItems };
      setEditingDetail({ ...editingDetail, subCategories: newSubs });
    }
  };

  if (!isOpen || !editingDetail) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-[120] flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-6xl max-h-[90vh] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col">
        <div className="bg-purple-800 p-4 flex justify-between items-center text-white shrink-0">
          <h3 className="font-bold flex items-center gap-2"><Layout size={20} /> Mega Menu Configuration: {editingDetail.name}</h3>
          <button onClick={onClose}><X size={20}/></button>
        </div>
        
        <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-8 bg-gray-50/50">
           {/* Highlights Section */}
           <div className="space-y-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <div className="flex justify-between items-center border-b pb-4 mb-4">
                 <div>
                    <h4 className="font-bold text-gray-800 text-lg">1. Highlight Items (รูปภาพด้านบน)</h4>
                    <p className="text-xs text-gray-400">แสดงผลเป็น Grid (แนะนำ 3 รายการ)</p>
                 </div>
                 <button type="button" onClick={addHighlight} className="text-xs bg-purple-100 text-purple-700 px-4 py-2 rounded-lg font-bold hover:bg-purple-200 flex items-center gap-2 transition">
                    <Plus size={16} /> เพิ่ม Highlight
                 </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                 {editingDetail.highlights.map((hl, idx) => (
                   <div key={idx} className="bg-gray-50 p-4 rounded-xl border border-gray-200 relative group transition-all hover:border-purple-300 hover:shadow-md">
                      <div className="absolute top-2 right-2 flex gap-1 z-10">
                         <button type="button" onClick={() => moveHighlight(idx, 'left')} disabled={idx === 0} className="p-1 text-gray-400 hover:text-purple-600 disabled:opacity-30 hover:bg-white rounded"><ArrowLeft size={14}/></button>
                         <button type="button" onClick={() => moveHighlight(idx, 'right')} disabled={idx === editingDetail.highlights.length - 1} className="p-1 text-gray-400 hover:text-purple-600 disabled:opacity-30 hover:bg-white rounded"><ArrowRight size={14}/></button>
                         <button type="button" onClick={() => removeHighlight(idx)} className="p-1 text-gray-400 hover:text-red-600 hover:bg-white rounded ml-2"><Trash2 size={14}/></button>
                      </div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1 mt-2">หัวข้อ</label>
                      <input 
                        type="text" 
                        value={hl.title}
                        onChange={(e) => updateHighlight(idx, 'title', e.target.value)}
                        className="w-full border rounded-lg p-2 text-sm mb-3 focus:ring-2 focus:ring-purple-200 outline-none"
                        placeholder="Title..."
                      />
                      <ImageManager 
                        images={hl.img ? [hl.img] : []}
                        onChange={(imgs) => updateHighlight(idx, 'img', imgs[0] || '')}
                        label="รูปภาพ (คลิกรูปเพื่อแก้ไข)"
                        multiple={false}
                      />
                   </div>
                 ))}
                 
                 <button
                    type="button"
                    onClick={addHighlight}
                    className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center text-gray-400 hover:text-purple-600 hover:border-purple-300 hover:bg-purple-50 transition min-h-[200px]"
                >
                    <Plus size={32} />
                    <span className="font-bold text-sm mt-2">เพิ่ม Highlight ใหม่</span>
                </button>
              </div>
           </div>

           {/* Subcategories Section */}
           <div className="space-y-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <div className="flex justify-between items-center border-b pb-4 mb-4">
                 <div>
                    <h4 className="font-bold text-gray-800 text-lg">2. Sub Categories (รายการย่อย)</h4>
                    <p className="text-xs text-gray-400">จัดกลุ่มรายการสินค้าในเมนู</p>
                 </div>
                 <button type="button" onClick={addSubCategory} className="text-xs bg-purple-100 text-purple-700 px-4 py-2 rounded-lg font-bold hover:bg-purple-200 flex items-center gap-2 transition">
                    <Plus size={16} /> เพิ่มกลุ่ม
                 </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 items-start">
                 {editingDetail.subCategories.map((sub, idx) => (
                   <div key={idx} className="bg-gray-50 p-4 rounded-xl border border-gray-200 relative group transition-all hover:border-purple-300 hover:shadow-md">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex gap-1">
                            <button type="button" onClick={() => moveSubCategory(idx, 'left')} disabled={idx === 0} className="p-1 text-gray-400 hover:text-purple-600 disabled:opacity-30 hover:bg-white rounded"><ArrowLeft size={14}/></button>
                            <button type="button" onClick={() => moveSubCategory(idx, 'right')} disabled={idx === editingDetail.subCategories.length - 1} className="p-1 text-gray-400 hover:text-purple-600 disabled:opacity-30 hover:bg-white rounded"><ArrowRight size={14}/></button>
                        </div>
                        <button type="button" onClick={() => removeSubCategory(idx)} className="p-1 text-gray-400 hover:text-red-600 hover:bg-white rounded"><Trash2 size={14}/></button>
                      </div>
                      
                      <div className="mb-4">
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">ชื่อกลุ่ม</label>
                        <input 
                            type="text" 
                            value={sub.title}
                            onChange={(e) => updateSubCategoryTitle(idx, e.target.value)}
                            className="w-full border rounded-lg p-2 text-sm font-bold text-blue-600 focus:ring-2 focus:ring-purple-200 outline-none"
                            placeholder="Group Name..."
                        />
                      </div>

                      <label className="block text-xs font-bold text-gray-500 uppercase mb-2">รายการย่อย</label>
                      <div className="space-y-2 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
                         {sub.items.map((item, itemIdx) => (
                           <div key={itemIdx} className="flex gap-1 items-center group/item">
                              <div className="flex flex-col text-gray-300">
                                 <button onClick={() => moveSubCategoryItem(idx, itemIdx, 'up')} disabled={itemIdx === 0} className="hover:text-purple-600 disabled:opacity-20"><MoveUp size={10}/></button>
                                 <button onClick={() => moveSubCategoryItem(idx, itemIdx, 'down')} disabled={itemIdx === sub.items.length - 1} className="hover:text-purple-600 disabled:opacity-20"><MoveDown size={10}/></button>
                              </div>
                              <input 
                                value={item}
                                onChange={(e) => updateSubCategoryItem(idx, itemIdx, e.target.value)}
                                className="flex-1 border rounded px-2 py-1 text-xs focus:ring-1 focus:ring-purple-200 outline-none"
                                placeholder="Item name"
                              />
                              <button 
                                type="button" 
                                onClick={() => removeSubCategoryItem(idx, itemIdx)}
                                className="text-gray-300 hover:text-red-500 p-1 opacity-0 group-hover/item:opacity-100 transition"
                              >
                                <X size={12} />
                              </button>
                           </div>
                         ))}
                      </div>
                      <button 
                        type="button" 
                        onClick={() => addSubCategoryItem(idx)}
                        className="mt-3 w-full py-2 border border-dashed border-gray-300 rounded-lg text-xs font-bold text-gray-500 hover:text-purple-600 hover:border-purple-300 hover:bg-purple-50 transition flex items-center justify-center gap-1"
                      >
                         <Plus size={12} /> เพิ่มรายการ
                      </button>
                   </div>
                 ))}

                <button
                    type="button"
                    onClick={addSubCategory}
                    className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center text-gray-400 hover:text-purple-600 hover:border-purple-300 hover:bg-purple-50 transition min-h-[200px]"
                >
                    <Plus size={32} />
                    <span className="font-bold text-sm mt-2">เพิ่มกลุ่มรายการใหม่</span>
                </button>
              </div>
           </div>

           {/* Promo Section */}
           <div className="space-y-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <h4 className="font-bold text-gray-800 text-lg border-b pb-4 mb-4">3. Side Promotion (โปรโมชั่นด้านขวา)</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">ข้อความโปรโมชั่น</label>
                    <textarea 
                      value={editingDetail.promoText}
                      onChange={(e) => setEditingDetail({...editingDetail, promoText: e.target.value})}
                      className="w-full border rounded-xl p-3 text-sm h-32 focus:ring-2 focus:ring-purple-200 outline-none resize-none"
                      placeholder="ข้อความโฆษณาที่จะแสดงบนแบนเนอร์ด้านขวาของเมนู..."
                    />
                    <p className="text-[10px] text-gray-400 mt-1 text-right">
                       {editingDetail.promoText?.length || 0} ตัวอักษร
                    </p>
                 </div>
                 <div>
                    <ImageManager 
                      images={editingDetail.promoImg ? [editingDetail.promoImg] : []}
                      onChange={(imgs) => setEditingDetail({...editingDetail, promoImg: imgs[0] || ''})}
                      label="รูปภาพโปรโมชั่น (แนะนำแนวตั้ง Ratio 3:4) - คลิกรูปเพื่อแก้ไข"
                      multiple={false}
                    />
                 </div>
              </div>
           </div>
        </form>

        <div className="p-4 border-t bg-white flex justify-end gap-3 shrink-0">
           <button type="button" onClick={onClose} className="px-4 py-2 text-gray-600 font-bold hover:bg-gray-100 rounded-lg transition">ยกเลิก</button>
           <button type="button" onClick={handleSave} className="px-6 py-2 bg-purple-600 text-white rounded-xl font-bold shadow-lg hover:bg-purple-700 transition flex items-center gap-2">
              <Save size={18} /> บันทึก Mega Menu
           </button>
        </div>
      </div>
    </div>
  );
};
