
import React, { useState } from 'react';
import { HomePage } from '../pages/HomePage';
import { AdminPage } from '../pages/AdminPage';
import { ProductDetailPage } from '../pages/ProductDetailPage';
import { ViewMode } from '../types';
import { Settings } from 'lucide-react';

// Simple Router Types
type ClientView = 'HOME' | 'PRODUCT';

const App: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.CLIENT);
  
  // Client Side Routing State
  const [clientView, setClientView] = useState<ClientView>('HOME');
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);

  const navigateToProduct = (id: number) => {
    setSelectedProductId(id);
    setClientView('PRODUCT');
    window.scrollTo(0, 0);
  };

  const navigateHome = () => {
    setClientView('HOME');
    setSelectedProductId(null);
    window.scrollTo(0, 0);
  };

  const renderClientContent = () => {
    if (clientView === 'PRODUCT' && selectedProductId) {
      return (
        <ProductDetailPage 
          productId={selectedProductId} 
          onBack={navigateHome}
          onNavigateToProduct={navigateToProduct}
        />
      );
    }
    return <HomePage onProductClick={navigateToProduct} />;
  };

  return (
    <>
      {/* View Switcher for Demo Purpose */}
      <div className="fixed bottom-20 md:bottom-4 right-4 z-[100]">
        <button 
          onClick={() => setViewMode(viewMode === ViewMode.CLIENT ? ViewMode.ADMIN : ViewMode.CLIENT)}
          className="bg-gray-800 text-white p-3 rounded-full shadow-lg hover:bg-gray-700 transition flex items-center gap-2"
          title="Switch View Mode"
        >
          <Settings size={20} />
          <span className="text-xs font-bold hidden md:inline">{viewMode === ViewMode.CLIENT ? 'Go to Admin' : 'Go to Shop'}</span>
        </button>
      </div>

      {viewMode === ViewMode.CLIENT ? renderClientContent() : <AdminPage />}
    </>
  );
};

export default App;
