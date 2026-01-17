
import React, { useState, useEffect } from 'react';
import { db } from '../../services/mockDb';
import { Brand } from '../../types';
import { Plus, Edit, Trash2, Search, Save, X, Image as ImageIcon } from 'lucide-react';

export const BrandManager: React.FC = () => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [formData, setFormData] = useState<Partial<Brand>>({
    name: '',
    logo: ''
  });

  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = () => {
    setBrands([...db.getBrands()]);
  };

  const filteredBrands = brands.filter(b => 
    b.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = (id: number) => {
    if (confirm('คุณแน่ใจหรือไม่ที่จะลบแบรนด์นี้?')) {
      db.deleteBrand(id);
      refreshData();
    }
  };

  const handleEdit = (brand: Brand) => {
    setEditingBrand(brand);
    setFormData(brand);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setEditingBrand(null);
    setFormData({ name: '', logo: '' });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingBrand) {
      db.updateBrand({ ...editingBrand, ...formData } as Brand);
    } else {
      db.addBrand(formData as Brand);
    }
    setIsModalOpen(false);
    refreshData();
  };

  return (
    <div className="p-4 md:p-8">
      <div className="bg-white p-6 rounded-2xl shadow-md mb-8 flex flex-col md:flex-row gap-6 justify-between items-center">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="ค้นหาแบรนด์..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-gray-50 border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-purple-500 outline-none transition"
          />
        </div>
        <button 
          onClick={handleAddNew}
          className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-3 rounded-xl flex items-center gap-2 font-bold shadow-lg transition active:scale-95 whitespace-nowrap"
        >
          <Plus size={18} /> เพิ่มแบรนด์ใหม่
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {filteredBrands.map((brand) => (
          <div key={brand.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex flex-col items-center gap-4 hover:shadow-lg transition group">
            <div className="w-20 h-20 rounded-full bg-gray-50 flex items-center justify-center border-2 border-dashed border-gray-200 overflow-hidden group-hover:border-purple-200 transition">
               {brand.logo ? (
                 <img src={brand.logo} alt={brand.name} className="w-full h-full object-cover" />
               ) : (
                 <ImageIcon className="text-gray-300" />
               )}
            </div>
            <h3 className="font-bold text-gray-800 text-center">{brand.name}</h3>
            <div className="flex gap-2 w-full mt-auto">
               <button onClick={() => handleEdit(brand)} className="flex-1 py-2 bg-gray-50 hover:bg-blue-50 text-blue-600 rounded-lg text-xs font-bold transition">แก้ไข</button>
               <button onClick={() => handleDelete(brand.id)} className="flex-1 py-2 bg-gray-50 hover:bg-red-50 text-red-600 rounded-lg text-xs font-bold transition">ลบ</button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-[110] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="bg-purple-800 p-4 flex justify-between items-center text-white">
              <h3 className="font-bold">{editingBrand ? 'แก้ไขแบรนด์' : 'เพิ่มแบรนด์ใหม่'}</h3>
              <button onClick={() => setIsModalOpen(false)}><X size={20}/></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="flex justify-center mb-4">
                 <div className="w-24 h-24 bg-gray-100 rounded-full overflow-hidden border-2 border-purple-100">
                    {formData.logo ? (
                      <img src={formData.logo} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">Preview</div>
                    )}
                 </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">ชื่อแบรนด์</label>
                <input 
                  type="text" 
                  value={formData.name} 
                  onChange={e => setFormData({...formData, name: e.target.value})} 
                  className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-purple-500 outline-none" 
                  required 
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">URL โลโก้</label>
                <input 
                  type="text" 
                  value={formData.logo} 
                  onChange={e => setFormData({...formData, logo: e.target.value})} 
                  className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-purple-500 outline-none" 
                  placeholder="https://..."
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
