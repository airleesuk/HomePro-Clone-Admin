
import React, { useState } from 'react';
import { aiService } from '../../services/aiService';
import { Sparkles, Loader2, Globe, Clipboard, Check, X, Megaphone, Tag, Link } from 'lucide-react';

type GeneratorMode = 'url' | 'keywords';

export const KeywordUrlGenerator: React.FC = () => {
  const [mode, setMode] = useState<GeneratorMode>('url');
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Please enter a description to generate content.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult('');
    setCopied(false);

    try {
      let generatedText = '';
      if (mode === 'url') {
        generatedText = await aiService.generateKeywordUrl(prompt);
      } else {
        generatedText = await aiService.generateSeoKeywords(prompt);
      }
      setResult(generatedText);
    } catch (e) {
      console.error('Error generating content:', e);
      setError('Failed to generate content. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (result) {
      navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleClear = () => {
    setPrompt('');
    setResult('');
    setError(null);
    setCopied(false);
  };

  return (
    <div className="p-4 md:p-8">
      <div className="bg-white p-6 rounded-2xl shadow-md mb-8">
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2 mb-2">
          <Sparkles size={22} className="text-purple-500" /> AI SEO & URL Generator
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          เครื่องมือช่วยสร้าง URL ที่เป็นมิตรกับ SEO และคิดคีย์เวิร์ดสำหรับสินค้าของคุณโดยอัตโนมัติด้วย AI
        </p>

        {/* Mode Toggle */}
        <div className="flex bg-gray-100 p-1 rounded-xl mb-6 w-fit">
           <button 
             onClick={() => { setMode('url'); setResult(''); }}
             className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all ${mode === 'url' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
           >
             <Link size={16} /> URL Slug Generator
           </button>
           <button 
             onClick={() => { setMode('keywords'); setResult(''); }}
             className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all ${mode === 'keywords' ? 'bg-white text-purple-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
           >
             <Tag size={16} /> SEO Keyword Generator
           </button>
        </div>

        <div className="space-y-6">
          {/* Prompt Input */}
          <div>
            <label htmlFor="ai-prompt" className="block text-xs font-bold text-gray-500 uppercase mb-2 ml-1 flex items-center gap-1">
              <Megaphone size={14} className="text-gray-400" /> 
              {mode === 'url' ? 'คำอธิบาย/ชื่อสำหรับสร้าง URL' : 'คำอธิบายสินค้าสำหรับสร้าง Keywords'}
            </label>
            <textarea
              id="ai-prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={mode === 'url' ? "เช่น 'ปั๊มน้ำพลังสูงสำหรับบ้านขนาดใหญ่'" : "เช่น 'เครื่องกรองน้ำ RO กรองละเอียด 5 ขั้นตอน เหมาะสำหรับคอนโด'"}
              rows={3}
              className="w-full border-2 border-purple-100 rounded-xl p-4 text-sm focus:ring-2 focus:ring-purple-500 outline-none resize-none bg-purple-50/30 transition"
              disabled={isLoading}
            />
            <div className="flex flex-wrap gap-2 mt-2">
              <span className="text-xs font-bold text-gray-400 uppercase">ลองใช้:</span>
              <button onClick={() => setPrompt("DOS Water Tank 1000 Liters with UV Protection")} className="text-xs bg-gray-100 hover:bg-purple-100 text-gray-600 hover:text-purple-700 px-2 py-1 rounded transition">DOS Tank 1000L</button>
              <button onClick={() => setPrompt("Promotion for water filters and accessories")} className="text-xs bg-gray-100 hover:bg-purple-100 text-gray-600 hover:text-purple-700 px-2 py-1 rounded transition">Filter Promo</button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={handleGenerate}
              disabled={isLoading || !prompt.trim()}
              className={`flex-1 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:shadow-purple-200 transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed ${mode === 'url' ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700' : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'}`}
            >
              {isLoading ? (
                <>
                  <Loader2 size={20} className="animate-spin" /> กำลังสร้าง...
                </>
              ) : (
                <>
                  <Sparkles size={20} /> {mode === 'url' ? 'สร้าง Keyword URL' : 'สร้าง SEO Keywords'}
                </>
              )}
            </button>
            <button
              onClick={handleClear}
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-all active:scale-95"
            >
              <X size={20} /> ล้าง
            </button>
          </div>

          {/* Result Output */}
          <div className="pt-6 border-t border-gray-100">
            <label htmlFor="generated-result" className="block text-xs font-bold text-gray-500 uppercase mb-2 ml-1 flex items-center gap-1">
              {mode === 'url' ? <Globe size={14} className="text-blue-600" /> : <Tag size={14} className="text-purple-600" />} 
              {mode === 'url' ? 'Keyword URL ที่สร้าง' : 'SEO Keywords ที่แนะนำ'}
            </label>
            <div className="relative">
              {mode === 'url' ? (
                <input
                  id="generated-result"
                  type="text"
                  value={result}
                  readOnly
                  className="w-full border rounded-xl p-3 pr-24 text-sm bg-blue-50 border-blue-100 text-blue-800 font-mono transition shadow-inner"
                  placeholder="ผลลัพธ์จะปรากฏที่นี่..."
                />
              ) : (
                <textarea
                  id="generated-result"
                  value={result}
                  readOnly
                  rows={4}
                  className="w-full border rounded-xl p-3 pr-24 text-sm bg-purple-50 border-purple-100 text-purple-900 font-medium transition shadow-inner resize-none leading-relaxed"
                  placeholder="ผลลัพธ์จะปรากฏที่นี่..."
                />
              )}
              
              <button
                onClick={handleCopy}
                disabled={!result}
                className={`absolute top-2 right-2 px-3 py-1.5 text-white rounded-lg text-xs font-bold disabled:opacity-50 transition flex items-center gap-1.5 ${mode === 'url' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-purple-600 hover:bg-purple-700'}`}
                title="คัดลอก"
              >
                {copied ? <Check size={14} /> : <Clipboard size={14} />} {copied ? 'คัดลอกแล้ว!' : 'คัดลอก'}
              </button>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 text-red-700 border border-red-100 p-4 rounded-xl flex items-center gap-3 mt-6">
              <Sparkles size={20} className="text-red-500" />
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
