
import React from 'react';
import { Page } from '../types';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { AiAssistant } from '../components/AiAssistant';
import { ArrowLeft } from 'lucide-react';
import { BlockRenderer } from '../components/BlockRenderer';

interface ContentPageProps {
  page: Page;
  onNavigate: () => void;
}

export const ContentPage: React.FC<ContentPageProps> = ({ page, onNavigate }) => {
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
       <Header />
       <main className="container mx-auto px-4 py-8">
          <button onClick={onNavigate} className="flex items-center gap-2 text-gray-500 hover:text-blue-600 mb-6 transition font-medium">
             <ArrowLeft size={18} /> กลับหน้าหลัก
          </button>
          
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden min-h-[500px] p-6 md:p-12">
             {page.blocks.length === 0 ? (
               <div className="text-center py-20 text-gray-400">
                  <h1 className="text-3xl font-bold text-gray-300 mb-4">{page.title}</h1>
                  <p>This page has no content yet.</p>
               </div>
             ) : (
               <div className="space-y-4">
                  {page.blocks.map(block => (
                    <BlockRenderer key={block.id} block={block} />
                  ))}
               </div>
             )}
          </div>
       </main>
       <AiAssistant />
       <Footer />
    </div>
  );
};
