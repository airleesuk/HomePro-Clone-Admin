
import React, { useState, useRef, useEffect } from 'react';
import { 
  Plus, X, Image as ImageIcon, Star, GripVertical, 
  Edit2, RotateCw, Crop, Upload, Save, MoveHorizontal, 
  Maximize, AlertCircle, RefreshCw, RotateCcw
} from 'lucide-react';

interface ImageManagerProps {
  images: string[];
  onChange: (newImages: string[]) => void;
  label?: string;
  multiple?: boolean;
}

export const ImageManager: React.FC<ImageManagerProps> = ({ images, onChange, label = "รูปภาพสินค้า", multiple = true }) => {
  const [newImageUrl, setNewImageUrl] = useState('');
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  
  // Edit Mode State
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editPreviewUrl, setEditPreviewUrl] = useState<string>('');
  const [editError, setEditError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const canAdd = multiple || images.length === 0;

  const handleAddImage = () => {
    if (newImageUrl.trim()) {
      if (!multiple && images.length > 0) {
        // Should not happen if UI is hidden, but extra safety
        onChange([newImageUrl.trim()]);
      } else {
        onChange([...images, newImageUrl.trim()]);
      }
      setNewImageUrl('');
    }
  };

  const handleRemoveImage = (index: number) => {
    const updated = images.filter((_, i) => i !== index);
    onChange(updated);
  };

  // Drag and Drop Logic
  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;
    const updated = [...images];
    const draggedItem = updated[draggedIndex];
    updated.splice(draggedIndex, 1);
    updated.splice(index, 0, draggedItem);
    onChange(updated);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  // Edit Logic
  const openEditor = (index: number) => {
    setEditingIndex(index);
    setEditPreviewUrl(images[index]);
    setEditError('');
  };

  const closeEditor = () => {
    setEditingIndex(null);
    setEditPreviewUrl('');
    setEditError('');
  };

  const saveEdit = () => {
    if (editingIndex !== null) {
      const updated = [...images];
      updated[editingIndex] = editPreviewUrl;
      onChange(updated);
      closeEditor();
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setEditPreviewUrl(event.target.result as string);
          setEditError('');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Canvas Manipulations
  const manipulateImage = async (operation: 'rotate' | 'cropSquare' | 'flip' | 'resize') => {
    if (!editPreviewUrl) return;

    try {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = editPreviewUrl;

      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = () => reject(new Error("Cannot load image. It might be blocked by CORS policy. Try uploading a local file."));
      });

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      if (operation === 'rotate') {
        canvas.width = img.height;
        canvas.height = img.width;
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate(90 * Math.PI / 180);
        ctx.drawImage(img, -img.width / 2, -img.height / 2);
      } 
      else if (operation === 'flip') {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
        ctx.drawImage(img, 0, 0);
      }
      else if (operation === 'cropSquare') {
        const size = Math.min(img.width, img.height);
        canvas.width = size;
        canvas.height = size;
        const offsetX = (img.width - size) / 2;
        const offsetY = (img.height - size) / 2;
        ctx.drawImage(img, offsetX, offsetY, size, size, 0, 0, size, size);
      }
      else if (operation === 'resize') {
        // Simple resize to max 800px width
        const scale = 800 / img.width;
        if (scale >= 1) return; // Don't upscale
        canvas.width = 800;
        canvas.height = img.height * scale;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      }

      setEditPreviewUrl(canvas.toDataURL('image/png'));
      setEditError('');
    } catch (err) {
      console.error(err);
      setEditError("ไม่สามารถแก้ไขรูปภาพนี้ได้เนื่องจากนโยบายความปลอดภัย (CORS) หรือรูปแบบไฟล์ไม่รองรับ กรุณาอัปโหลดไฟล์ใหม่จากเครื่องเพื่อแก้ไข");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <label className="block text-xs font-bold text-gray-500 uppercase">{label}</label>
        {multiple && <span className="text-[10px] text-gray-400">ลากเพื่อจัดลำดับ (รูปแรก = รูปหลัก)</span>}
      </div>

      {/* Quick Add URL - Only show if we can add more images */}
      {canAdd && (
        <div className="flex gap-2 animate-in fade-in slide-in-from-top-1 duration-200">
          <div className="relative flex-1">
             <ImageIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
             <input 
               type="text" 
               value={newImageUrl}
               onChange={(e) => setNewImageUrl(e.target.value)}
               onKeyPress={(e) => e.key === 'Enter' && handleAddImage()}
               placeholder="วาง URL รูปภาพ..."
               className="w-full pl-9 pr-4 py-2 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 transition"
             />
          </div>
          <button 
            type="button"
            onClick={handleAddImage}
            disabled={!newImageUrl}
            className="bg-gray-100 hover:bg-blue-100 text-blue-600 px-4 rounded-xl text-sm font-bold transition-colors disabled:opacity-50"
          >
            <Plus size={18} />
          </button>
        </div>
      )}

      {/* Grid */}
      {images.length === 0 ? (
        <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center text-gray-400 gap-2 bg-gray-50">
           <ImageIcon size={32} />
           <span className="text-xs">ยังไม่มีรูปภาพ</span>
        </div>
      ) : (
        <div className={`grid gap-3 ${multiple ? 'grid-cols-3 sm:grid-cols-4 md:grid-cols-5' : 'grid-cols-1 max-w-[200px]'}`}>
          {images.map((img, index) => (
            <div 
              key={`${img}-${index}`}
              draggable={multiple}
              onDragStart={(e) => multiple && handleDragStart(e, index)}
              onDragOver={(e) => multiple && handleDragOver(e, index)}
              onDragEnd={multiple ? handleDragEnd : undefined}
              className={`relative group aspect-square rounded-xl overflow-hidden border-2 bg-white cursor-grab active:cursor-grabbing transition-all ${
                index === editingIndex ? 'border-purple-500 ring-4 ring-purple-100 scale-105 z-10' :
                (index === 0 && multiple) ? 'border-blue-500 ring-2 ring-blue-100' : 
                'border-gray-100 hover:border-gray-300'
              }`}
            >
              <img src={img} className="w-full h-full object-cover" alt="product-preview" />
              
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-1.5">
                 <div className="flex justify-between items-start">
                    <div className="text-white drop-shadow-md cursor-grab">
                       {multiple && <GripVertical size={14} />}
                    </div>
                    <button 
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition"
                      title="ลบรูปภาพ"
                    >
                      <X size={12} />
                    </button>
                 </div>
                 
                 <div className="flex justify-center pb-2">
                    <button 
                      type="button" 
                      onClick={() => openEditor(index)}
                      className="bg-white/20 hover:bg-white text-white hover:text-blue-600 p-1.5 rounded-full backdrop-blur-sm transition-all"
                      title="แก้ไขรูปภาพ"
                    >
                      <Edit2 size={14} />
                    </button>
                 </div>

                 {(index === 0 && multiple) && (
                   <div className="absolute bottom-1.5 left-1.5 bg-blue-500 text-white text-[9px] px-2 py-0.5 rounded-full font-bold shadow-sm flex items-center gap-1">
                     <Star size={8} fill="currentColor" /> Main
                   </div>
                 )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Editor Modal */}
      {editingIndex !== null && (
        <div className="fixed inset-0 z-[150] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
           <div className="bg-white w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
              <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
                 <h3 className="font-bold text-gray-800 flex items-center gap-2">
                   <Edit2 size={18} className="text-blue-600" /> แก้ไขรูปภาพ
                 </h3>
                 <button onClick={closeEditor} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
              </div>

              <div className="p-6 flex-1 overflow-y-auto">
                 {/* Image Preview */}
                 <div className="aspect-video bg-gray-100 rounded-xl overflow-hidden border border-gray-200 mb-6 flex items-center justify-center relative group">
                    <img src={editPreviewUrl} className="max-w-full max-h-full object-contain" alt="Preview" />
                    {editError && (
                      <div className="absolute inset-0 bg-white/90 flex flex-col items-center justify-center p-6 text-center text-red-500 text-sm gap-2">
                         <AlertCircle size={32} />
                         <p>{editError}</p>
                         <button onClick={() => setEditError('')} className="text-blue-600 underline text-xs mt-2">กลับไปดูรูปเดิม</button>
                      </div>
                    )}
                    <button 
                      onClick={() => setEditPreviewUrl(images[editingIndex])}
                      className="absolute top-2 right-2 bg-white/80 hover:bg-white p-2 rounded-full shadow-md text-gray-500 hover:text-blue-600 transition"
                      title="รีเซ็ตกลับไปเป็นรูปเดิม"
                    >
                       <RotateCcw size={16} />
                    </button>
                 </div>

                 {/* Action Grid */}
                 <div className="space-y-6">
                    {/* Replace Section */}
                    <div>
                       <label className="text-xs font-bold text-gray-400 uppercase mb-2 block">เปลี่ยนรูปภาพ</label>
                       <div className="flex gap-2">
                          <input 
                            type="text" 
                            value={editPreviewUrl}
                            onChange={(e) => setEditPreviewUrl(e.target.value)}
                            className="flex-1 border rounded-lg px-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="Image URL..."
                          />
                          <button 
                            onClick={() => fileInputRef.current?.click()}
                            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg flex items-center gap-2 text-xs font-bold"
                            title="อัปโหลดไฟล์จากเครื่อง"
                          >
                             <Upload size={14} /> อัปโหลด
                          </button>
                          <input 
                            type="file" 
                            ref={fileInputRef} 
                            className="hidden" 
                            accept="image/*"
                            onChange={handleFileUpload}
                          />
                       </div>
                    </div>

                    {/* Transform Section */}
                    <div>
                       <label className="text-xs font-bold text-gray-400 uppercase mb-2 block">เครื่องมือแก้ไข (Canvas)</label>
                       <div className="grid grid-cols-4 gap-2">
                          <button 
                            onClick={() => manipulateImage('rotate')}
                            className="flex flex-col items-center gap-1 p-3 rounded-xl border hover:border-blue-500 hover:bg-blue-50 transition text-gray-600 hover:text-blue-600 group"
                            title="หมุนรูปภาพ 90 องศาตามเข็มนาฬิกา"
                          >
                             <RotateCw size={20} className="group-hover:rotate-90 transition-transform" />
                             <span className="text-[10px] font-bold">หมุน 90°</span>
                          </button>
                          <button 
                            onClick={() => manipulateImage('flip')}
                            className="flex flex-col items-center gap-1 p-3 rounded-xl border hover:border-blue-500 hover:bg-blue-50 transition text-gray-600 hover:text-blue-600"
                            title="กลับด้านรูปภาพ (แนวนอน)"
                          >
                             <MoveHorizontal size={20} />
                             <span className="text-[10px] font-bold">กลับด้าน</span>
                          </button>
                          <button 
                            onClick={() => manipulateImage('cropSquare')}
                            className="flex flex-col items-center gap-1 p-3 rounded-xl border hover:border-blue-500 hover:bg-blue-50 transition text-gray-600 hover:text-blue-600"
                            title="ตัดรูปภาพเป็นสี่เหลี่ยมจัตุรัส (ตรงกลาง)"
                          >
                             <Crop size={20} />
                             <span className="text-[10px] font-bold">ตัดจัตุรัส</span>
                          </button>
                          <button 
                            onClick={() => manipulateImage('resize')}
                            className="flex flex-col items-center gap-1 p-3 rounded-xl border hover:border-blue-500 hover:bg-blue-50 transition text-gray-600 hover:text-blue-600"
                            title="ย่อขนาดรูปภาพ (ความกว้างสูงสุด 800px)"
                          >
                             <Maximize size={20} />
                             <span className="text-[10px] font-bold">ย่อขนาด</span>
                          </button>
                       </div>
                       <p className="text-[10px] text-gray-400 mt-2 italic">* การแก้ไขอาจไม่รองรับรูปภาพจากเว็บไซต์ภายนอกบางแห่ง (CORS Policy)</p>
                    </div>
                 </div>
              </div>

              <div className="p-4 border-t bg-gray-50 flex justify-end gap-3">
                 <button onClick={closeEditor} className="px-5 py-2.5 text-gray-600 font-bold hover:bg-gray-200 rounded-xl transition">ยกเลิก</button>
                 <button onClick={saveEdit} className="px-6 py-2.5 bg-blue-600 text-white font-bold rounded-xl shadow-lg hover:bg-blue-700 transition flex items-center gap-2">
                    <Save size={16} /> บันทึกการแก้ไข
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};
