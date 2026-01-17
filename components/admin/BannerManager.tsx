
import React, { useState, useEffect } from 'react';
import { db } from '../../services/mockDb';
import { Banner } from '../../types';
import { Plus, Edit, Trash2, Search, X, Image as ImageIcon } from 'lucide-react';
import { ImageManager } from './ImageManager';

export const BannerManager: React.FC = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [formData, setFormData] = useState<Partial<Banner>>({
    image: '',
    alt: ''
  });

  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = () => {
    setBanners([...db.getBanners()]);
  };

  const handleDelete = (id: number) => {
    if (confirm('คุณแน่ใจหรือไม่ที่จะลบแบนเนอร์นี้?')) {
      db.deleteBanner(id);
      refreshData();
    }
  };

  const handleEdit = (banner: Banner) => {
    setEditingBanner(banner);
    setFormData(banner);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setEditingBanner(null);
    setFormData({ image: '', alt: '' });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingBanner) {
      db.updateBanner({ ...editingBanner, ...formData } as Banner);
    } else {
      db.addBanner(formData as Banner);
    }
    setIsModalOpen(false);
    refreshData();
  };

  return (
    <div className="p-4 md:p-8">
      <div className="bg-white p-6 rounded-2xl shadow-md mb-8 flex flex-col md:flex-row gap-6 justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            จัดการแบนเนอร์โฆษณา
        </h2>
        <button 
          onClick={handleAddNew}
          className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-3 rounded-xl flex items-center gap-2 font-bold shadow-lg transition active:scale-95 whitespace-nowrap"
        >
          <Plus size={18} /> เพิ่มแบนเนอร์ใหม่
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {banners.map((banner) => (
          <div key={banner.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition group">
            <div className="aspect-[3/1] bg-gray-50 relative">
               {banner.image ? (
                 <img src={banner.image} alt={banner.alt} className="w-full h-full object-cover" />
               ) : (
                 <div className="w-full h-full flex items-center justify-center text-gray-300"><ImageIcon /></div>
               )}
               <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-3">
                    <button onClick={() => handleEdit(banner)} className="p-2 bg-white rounded-full hover:bg-blue-50 text-blue-600 font-bold transition">
                        <Edit size={18} />
                    </button>
                    <button onClick={() => handleDelete(banner.id)} className="p-2 bg-white rounded-full hover:bg-red-50 text-red-600 font-bold transition">
                        <Trash2 size={18} />
                    </button>
               </div>
            </div>
            <div className="p-4 flex items-center justify-between">
                <span className="font-medium text-gray-700">{banner.alt || 'No Title'}</span>
                <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">ID: {banner.id}</span>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-[110] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="bg-purple-800 p-4 flex justify-between items-center text-white">
              <h3 className="font-bold">{editingBanner ? 'แก้ไขแบนเนอร์' : 'เพิ่มแบนเนอร์ใหม่'}</h3>
              <button onClick={() => setIsModalOpen(false)}><X size={20}/></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">คำอธิบายภาพ (Alt Text)</label>
                <input 
                  type="text" 
                  value={formData.alt} 
                  onChange={e => setFormData({...formData, alt: e.target.value})} 
                  className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-purple-500 outline-none" 
                  placeholder="เช่น โปรโมชั่นหน้าร้อน"
                  required 
                />
              </div>
              <div>
                 <ImageManager 
                    images={formData.image ? [formData.image] : []}
                    onChange={(newImages) => setFormData({...formData, image: newImages[0] || ''})}
                    label="รูปภาพแบนเนอร์"
                 />
              </div>
              <div className="pt-4 flex justify-end gap-3">
                 <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-600 font-bold">ยกเลิก</button>
                 <button type="submit" className="px-6 py-2 bg-purple-600 text-white rounded-xl font-bold shadow-lg">บันทึก</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
