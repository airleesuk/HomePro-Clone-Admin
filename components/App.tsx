
import React, { useState } from 'react';
import { HomePage } from '../pages/HomePage';
import { AdminPage } from '../pages/AdminPage';
import { ProductDetailPage } from '../pages/ProductDetailPage';
import { ViewMode, Product } from '../types';
import { Settings } from 'lucide-react';

const App: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.CLIENT);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setViewMode(ViewMode.PRODUCT_DETAIL);
    window.scrollTo(0, 0);
  };

  const handleBackToHome = () => {
    setSelectedProduct(null);
    setViewMode(ViewMode.CLIENT);
  };

  return (
    <>
      {/* View Switcher for Demo Purpose */}
      <div className="fixed bottom-4 right-4 z-[100]">
        <button 
          onClick={() => {
            if (viewMode === ViewMode.ADMIN) {
              setViewMode(ViewMode.CLIENT);
            } else {
              setViewMode(ViewMode.ADMIN);
            }
          }}
          className="bg-gray-800 text-white p-3 rounded-full shadow-lg hover:bg-gray-700 transition flex items-center gap-2"
          title="Switch View Mode"
        >
          <Settings size={20} />
          <span className="text-xs font-bold">{viewMode === ViewMode.ADMIN ? 'Go to Shop' : 'Go to Admin'}</span>
        </button>
      </div>

      {viewMode === ViewMode.ADMIN && <AdminPage />}
      
      {viewMode === ViewMode.CLIENT && (
        <HomePage onProductClick={handleProductClick} />
      )}

      {viewMode === ViewMode.PRODUCT_DETAIL && selectedProduct && (
        <ProductDetailPage 
          product={selectedProduct} 
          onBack={handleBackToHome} 
          onProductClick={handleProductClick}
        />
      )}
    </>
  );
};

export default App;
