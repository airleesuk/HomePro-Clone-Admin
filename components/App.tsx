
import React, { useState, useEffect } from 'react';
import { HomePage } from '../pages/HomePage';
import { AdminPage } from '../pages/AdminPage';
import { ProductDetailPage } from '../pages/ProductDetailPage';
import { ContentPage } from '../pages/ContentPage';
import { ViewMode, Product, Page } from '../types';
import { Settings } from 'lucide-react';
import { db } from '../services/mockDb';

const App: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.CLIENT);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedPage, setSelectedPage] = useState<Page | null>(null);

  useEffect(() => {
    // Listen for custom navigation events from Header
    const handleNavigation = (e: CustomEvent) => {
      if (e.detail.slug) {
        const page = db.getPages().find(p => p.slug === e.detail.slug);
        if (page) {
          setSelectedPage(page);
          setViewMode(ViewMode.PAGE_VIEW);
          window.scrollTo(0, 0);
        } else {
          console.warn(`Page not found: ${e.detail.slug}`);
          // Fallback or show 404
        }
      }
    };

    window.addEventListener('navigate-page', handleNavigation as EventListener);
    return () => {
      window.removeEventListener('navigate-page', handleNavigation as EventListener);
    };
  }, []);

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setViewMode(ViewMode.PRODUCT_DETAIL);
    window.scrollTo(0, 0);
  };

  const handleBackToHome = () => {
    setSelectedProduct(null);
    setSelectedPage(null);
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

      {viewMode === ViewMode.PAGE_VIEW && selectedPage && (
        <ContentPage 
          page={selectedPage} 
          onNavigate={handleBackToHome}
        />
      )}
    </>
  );
};

export default App;
