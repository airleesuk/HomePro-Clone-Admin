
import React, { useState } from 'react';
import { aiService } from '../../services/aiService';
import { db } from '../../services/mockDb';
import { PageBlock, Page } from '../../types';
import { BlockRenderer } from '../BlockRenderer';
import { Sparkles, Loader2, Save, LayoutTemplate, RotateCcw, Monitor, Smartphone, CheckCircle2, AlertCircle } from 'lucide-react';

export const TemplateGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [generatedBlocks, setGeneratedBlocks] = useState<PageBlock[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [saveTitle, setSaveTitle] = useState('');
  const [saveSlug, setSaveSlug] = useState('');
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    setGeneratedBlocks([]);
    setNotification(null);

    try {
      const blocks = await aiService.generatePageLayout(prompt);
      if (blocks.length > 0) {
        setGeneratedBlocks(blocks);
        // Auto-generate title suggestions based on prompt if empty
        if (!saveTitle) {
          setSaveTitle("New Template " + new Date().toLocaleDateString());
          setSaveSlug("template-" + Date.now());
        }
      } else {
        setNotification({ type: 'error', message: 'AI could not generate a layout. Please try a detailed description.' });
      }
    } catch (error) {
      console.error(error);
      setNotification({ type: 'error', message: 'Connection error. Please try again.' });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveTemplate = () => {
    if (!saveTitle || !saveSlug) {
      setNotification({ type: 'error', message: 'Please provide a Title and Slug for the page.' });
      return;
    }

    const newPage: Page = {
      id: `page-${Date.now()}`,
      title: saveTitle,
      slug: saveSlug.toLowerCase().replace(/\s+/g, '-'),
      blocks: generatedBlocks,
      status: 'draft',
      updatedAt: new Date().toISOString()
    };

    db.addPage(newPage);
    setNotification({ type: 'success', message: 'Template saved successfully as a Draft Page!' });
    
    // Optional: Reset
    setTimeout(() => {
        setNotification(null);
    }, 3000);
  };

  const predefinedPrompts = [
    "Landing page for Summer Sale with a large hero banner, a text section about hot deals, and a grid of 4 featured products.",
    "About Us page with a company history text, a grid of 3 core values with icons, and a team photo.",
    "Service page for Water Tank Installation, including a hero image, a 3-step process grid, and a pricing table text section."
  ];

  return (
    <div className="p-4 md:p-8 h-full flex flex-col md:flex-row gap-6">
      
      {/* Left Panel: Controls */}
      <div className="w-full md:w-96 flex-shrink-0 flex flex-col gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
          <div className="flex items-center gap-2 mb-4 text-purple-600">
             <LayoutTemplate size={24} />
             <h2 className="text-xl font-bold">AI Template Generator</h2>
          </div>
          
          <div className="space-y-4">
            <div>
               <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Describe your layout</label>
               <textarea 
                 value={prompt}
                 onChange={(e) => setPrompt(e.target.value)}
                 placeholder="e.g. A modern homepage with a hero slider, a feature grid, and a product showcase..."
                 className="w-full h-32 border-2 border-purple-100 rounded-xl p-4 text-sm focus:ring-2 focus:ring-purple-500 outline-none resize-none bg-purple-50/30 transition"
                 disabled={isGenerating}
               />
            </div>

            <div className="space-y-2">
               <span className="text-xs font-bold text-gray-400 uppercase">Try Examples:</span>
               <div className="flex flex-col gap-2">
                  {predefinedPrompts.map((p, i) => (
                    <button 
                      key={i}
                      onClick={() => setPrompt(p)}
                      className="text-left text-xs bg-gray-50 hover:bg-purple-50 p-2 rounded-lg text-gray-600 hover:text-purple-700 transition border border-gray-100"
                    >
                      {p.substring(0, 60)}...
                    </button>
                  ))}
               </div>
            </div>

            <button 
              onClick={handleGenerate}
              disabled={isGenerating || !prompt.trim()}
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-bold shadow-lg hover:shadow-purple-200 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed active:scale-95"
            >
              {isGenerating ? <Loader2 size={20} className="animate-spin" /> : <Sparkles size={20} />}
              {isGenerating ? 'Designing Layout...' : 'Generate Template'}
            </button>
          </div>
        </div>

        {generatedBlocks.length > 0 && (
           <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 animate-in slide-in-from-left duration-300">
              <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                 <Save size={18} /> Save as Page
              </h3>
              <div className="space-y-4">
                 <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Page Title</label>
                    <input 
                      type="text" 
                      value={saveTitle} 
                      onChange={(e) => setSaveTitle(e.target.value)}
                      className="w-full border rounded-xl p-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g. Summer Campaign"
                    />
                 </div>
                 <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">URL Slug</label>
                    <input 
                      type="text" 
                      value={saveSlug} 
                      onChange={(e) => setSaveSlug(e.target.value)}
                      className="w-full border rounded-xl p-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g. summer-campaign"
                    />
                 </div>
                 
                 {notification && (
                    <div className={`p-3 rounded-lg text-xs font-medium flex items-center gap-2 ${notification.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                       {notification.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                       {notification.message}
                    </div>
                 )}

                 <button 
                   onClick={handleSaveTemplate}
                   className="w-full py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition shadow active:scale-95"
                 >
                   Save to Pages
                 </button>
              </div>
           </div>
        )}
      </div>

      {/* Right Panel: Preview */}
      <div className="flex-1 flex flex-col bg-gray-100 rounded-3xl overflow-hidden border border-gray-200 shadow-inner relative">
         <div className="bg-white border-b px-4 py-3 flex justify-between items-center shrink-0">
            <span className="font-bold text-gray-500 text-sm uppercase tracking-wider">Live Preview</span>
            <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-lg">
               <button 
                 onClick={() => setViewMode('desktop')}
                 className={`p-2 rounded-md transition ${viewMode === 'desktop' ? 'bg-white shadow text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
               >
                 <Monitor size={16} />
               </button>
               <button 
                 onClick={() => setViewMode('mobile')}
                 className={`p-2 rounded-md transition ${viewMode === 'mobile' ? 'bg-white shadow text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
               >
                 <Smartphone size={16} />
               </button>
            </div>
            <button 
              onClick={() => { setGeneratedBlocks([]); setPrompt(''); setNotification(null); }}
              className="p-2 text-gray-400 hover:bg-gray-50 rounded-full transition"
              title="Reset"
            >
               <RotateCcw size={16} />
            </button>
         </div>

         <div className="flex-1 overflow-y-auto p-8 flex justify-center bg-gray-200/50">
            {generatedBlocks.length === 0 ? (
               <div className="flex flex-col items-center justify-center text-gray-400 opacity-50">
                  <LayoutTemplate size={64} className="mb-4" />
                  <p className="font-medium">No layout generated yet.</p>
                  <p className="text-sm">Describe your idea on the left to start.</p>
               </div>
            ) : (
               <div 
                 className={`bg-white shadow-xl transition-all duration-300 overflow-hidden ${viewMode === 'mobile' ? 'w-[375px] rounded-[30px] border-[8px] border-gray-800 min-h-[667px]' : 'w-full max-w-5xl rounded-xl min-h-full'}`}
               >
                  <div className={`w-full h-full overflow-y-auto ${viewMode === 'mobile' ? 'no-scrollbar' : ''}`}>
                    {generatedBlocks.map(block => (
                      <BlockRenderer key={block.id} block={block} />
                    ))}
                  </div>
               </div>
            )}
         </div>
      </div>

    </div>
  );
};
