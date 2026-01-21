
import React, { useState, useEffect } from 'react';
import { aiService } from '../../services/aiService';
import { db } from '../../services/mockDb';
import { PageBlock, SavedBlock, BlockType } from '../../types';
import { BlockRenderer } from '../BlockRenderer';
import { 
  Sparkles, Loader2, Save, RotateCcw, 
  Layout, Type, Image as ImageIcon, ShoppingBag, 
  MoveDown, LayoutGrid, CheckCircle2, Trash2, Library, Plus, MessageSquareQuote
} from 'lucide-react';

export const BlockGenerator: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'generate' | 'library'>('generate');
  
  // Generator State
  const [blockType, setBlockType] = useState<BlockType>('hero');
  const [prompt, setPrompt] = useState('');
  const [generatedBlock, setGeneratedBlock] = useState<PageBlock | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Save State
  const [saveName, setSaveName] = useState('');
  const [saveCategory, setSaveCategory] = useState('General');
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);

  // Library State
  const [savedBlocks, setSavedBlocks] = useState<SavedBlock[]>([]);

  useEffect(() => {
    refreshLibrary();
  }, []);

  const refreshLibrary = () => {
    setSavedBlocks([...db.getSavedBlocks()]);
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    setGeneratedBlock(null);
    setShowSaveSuccess(false);

    try {
      const block = await aiService.generateBlock(blockType, prompt);
      if (block) {
        setGeneratedBlock(block);
        setSaveName(`AI Generated ${blockType.charAt(0).toUpperCase() + blockType.slice(1)}`);
      } else {
        alert('Could not generate block. Please try again.');
      }
    } catch (error) {
      console.error(error);
      alert('Error connecting to AI service.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveBlock = () => {
    if (!generatedBlock || !saveName.trim()) return;

    const newSavedBlock: SavedBlock = {
      id: `saved-block-${Date.now()}`,
      name: saveName,
      category: saveCategory,
      block: generatedBlock,
      createdAt: new Date().toISOString()
    };

    db.addSavedBlock(newSavedBlock);
    refreshLibrary();
    setShowSaveSuccess(true);
    setTimeout(() => setShowSaveSuccess(false), 3000);
  };

  const handleDeleteSaved = (id: string) => {
    if (confirm('Delete this saved block?')) {
      db.deleteSavedBlock(id);
      refreshLibrary();
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Sub Header / Tabs */}
      <div className="bg-white border-b px-6 py-3 flex gap-4 shadow-sm sticky top-0 z-20">
         <button 
           onClick={() => setActiveTab('generate')}
           className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition ${activeTab === 'generate' ? 'bg-purple-100 text-purple-700' : 'text-gray-500 hover:bg-gray-100'}`}
         >
            <Sparkles size={16} /> AI Generator
         </button>
         <button 
           onClick={() => setActiveTab('library')}
           className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition ${activeTab === 'library' ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:bg-gray-100'}`}
         >
            <Library size={16} /> Block Library <span className="bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded text-[10px]">{savedBlocks.length}</span>
         </button>
      </div>

      <div className="flex-1 overflow-hidden p-6">
        {activeTab === 'generate' ? (
          <div className="h-full flex flex-col md:flex-row gap-6">
             {/* Left: Controls */}
             <div className="w-full md:w-80 flex-shrink-0 flex flex-col gap-4">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
                   <h3 className="font-bold text-gray-700 text-lg">Design Configuration</h3>
                   
                   <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Block Type</label>
                      <div className="grid grid-cols-2 gap-2">
                         {[
                           { id: 'hero', label: 'Hero Banner', icon: Layout },
                           { id: 'text', label: 'Text Content', icon: Type },
                           { id: 'grid', label: 'Feature Grid', icon: LayoutGrid },
                           { id: 'product-row', label: 'Product Row', icon: ShoppingBag },
                           { id: 'image', label: 'Single Image', icon: ImageIcon },
                           { id: 'testimonial', label: 'Testimonials', icon: MessageSquareQuote },
                           { id: 'spacer', label: 'Spacer', icon: MoveDown },
                         ].map((type) => (
                           <button 
                             key={type.id}
                             onClick={() => setBlockType(type.id as BlockType)}
                             className={`p-3 rounded-xl border text-left flex flex-col gap-2 transition ${blockType === type.id ? 'border-purple-500 bg-purple-50 text-purple-700' : 'border-gray-100 hover:border-gray-300 text-gray-600'}`}
                           >
                              <type.icon size={20} />
                              <span className="text-xs font-bold">{type.label}</span>
                           </button>
                         ))}
                      </div>
                   </div>

                   <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Prompt / Context</label>
                      <textarea 
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        className="w-full border-2 border-purple-100 rounded-xl p-3 text-sm h-32 focus:ring-2 focus:ring-purple-500 outline-none resize-none bg-purple-50/30"
                        placeholder={`Describe your ${blockType}... e.g. "Minimalist style with blue accent"`}
                        disabled={isGenerating}
                      />
                   </div>

                   <button 
                     onClick={handleGenerate}
                     disabled={isGenerating || !prompt.trim()}
                     className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold shadow-lg hover:shadow-purple-200 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed active:scale-95"
                   >
                     {isGenerating ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
                     Generate Block
                   </button>
                </div>

                {generatedBlock && (
                   <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4 animate-in slide-in-from-left">
                      <h3 className="font-bold text-gray-700 text-lg flex items-center gap-2">
                         <Save size={18} /> Save to Library
                      </h3>
                      <div>
                         <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Block Name</label>
                         <input 
                           type="text" 
                           value={saveName}
                           onChange={(e) => setSaveName(e.target.value)}
                           className="w-full border rounded-lg p-2 text-sm"
                         />
                      </div>
                      <div>
                         <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Category</label>
                         <select 
                           value={saveCategory}
                           onChange={(e) => setSaveCategory(e.target.value)}
                           className="w-full border rounded-lg p-2 text-sm bg-white"
                         >
                            <option value="General">General</option>
                            <option value="Headers">Headers</option>
                            <option value="Content">Content</option>
                            <option value="Promotions">Promotions</option>
                         </select>
                      </div>
                      
                      {showSaveSuccess && (
                         <div className="bg-green-50 text-green-700 p-2 rounded-lg text-xs flex items-center gap-2">
                            <CheckCircle2 size={14} /> Saved successfully!
                         </div>
                      )}

                      <button 
                        onClick={handleSaveBlock}
                        className="w-full py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition"
                      >
                         Save Block
                      </button>
                   </div>
                )}
             </div>

             {/* Right: Preview */}
             <div className="flex-1 bg-gray-100 rounded-2xl border border-gray-200 overflow-hidden flex flex-col relative shadow-inner">
                <div className="bg-white border-b px-4 py-2 flex justify-between items-center text-xs font-bold text-gray-500 uppercase tracking-wider">
                   <span>Live Preview</span>
                   {generatedBlock && (
                      <button onClick={() => setGeneratedBlock(null)} className="hover:text-red-500 transition">
                         <RotateCcw size={14} /> Reset
                      </button>
                   )}
                </div>
                <div className="flex-1 overflow-y-auto p-8">
                   {generatedBlock ? (
                      <div className="bg-white shadow-lg rounded-xl overflow-hidden min-h-[200px]">
                         <BlockRenderer block={generatedBlock} />
                      </div>
                   ) : (
                      <div className="h-full flex flex-col items-center justify-center text-gray-400 opacity-50">
                         <Layout size={64} className="mb-4" />
                         <p>No block generated yet.</p>
                      </div>
                   )}
                </div>
             </div>
          </div>
        ) : (
          /* Library View */
          <div className="h-full overflow-y-auto">
             {savedBlocks.length === 0 ? (
                <div className="h-96 flex flex-col items-center justify-center text-gray-400">
                   <Library size={48} className="mb-4 opacity-50" />
                   <p className="font-medium">Block Library is empty</p>
                   <button onClick={() => setActiveTab('generate')} className="mt-4 text-purple-600 font-bold hover:underline flex items-center gap-1">
                      Go to Generator <Plus size={16} />
                   </button>
                </div>
             ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                   {savedBlocks.map(saved => (
                      <div key={saved.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition group flex flex-col">
                         <div className="bg-gray-50 p-2 border-b border-gray-100 flex justify-between items-center">
                            <span className="text-xs font-bold text-gray-500 uppercase px-2 bg-white rounded border border-gray-200">{saved.category}</span>
                            <div className="flex items-center gap-2">
                               <span className="text-[10px] text-gray-400">{new Date(saved.createdAt).toLocaleDateString()}</span>
                               <button onClick={() => handleDeleteSaved(saved.id)} className="text-gray-400 hover:text-red-500 transition p-1">
                                  <Trash2 size={14} />
                               </button>
                            </div>
                         </div>
                         <div className="relative h-48 overflow-hidden bg-gray-100">
                            <div className="scale-[0.6] origin-top w-[166%] h-[166%] pointer-events-none select-none">
                               <BlockRenderer block={saved.block} />
                            </div>
                            <div className="absolute inset-0 hover:bg-black/5 transition cursor-pointer" />
                         </div>
                         <div className="p-4 border-t border-gray-100 flex justify-between items-center">
                            <h4 className="font-bold text-gray-800 text-sm truncate pr-2">{saved.name}</h4>
                            <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded font-mono uppercase">{saved.block.type}</span>
                         </div>
                      </div>
                   ))}
                </div>
             )}
          </div>
        )}
      </div>
    </div>
  );
};
