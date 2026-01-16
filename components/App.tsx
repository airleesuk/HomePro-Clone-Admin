import React, { useState } from 'react';
import { HomePage } from '../pages/HomePage';
import { AdminPage } from '../pages/AdminPage';
import { ViewMode } from '../types';
import { Settings } from 'lucide-react';

const App: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.CLIENT);

  return (
    <>
      {/* View Switcher for Demo Purpose */}
      <div className="fixed bottom-4 right-4 z-[100]">
        <button 
          onClick={() => setViewMode(viewMode === ViewMode.CLIENT ? ViewMode.ADMIN : ViewMode.CLIENT)}
          className="bg-gray-800 text-white p-3 rounded-full shadow-lg hover:bg-gray-700 transition flex items-center gap-2"
          title="Switch View Mode"
        >
          <Settings size={20} />
          <span className="text-xs font-bold">{viewMode === ViewMode.CLIENT ? 'Go to Admin' : 'Go to Shop'}</span>
        </button>
      </div>

      {viewMode === ViewMode.CLIENT ? <HomePage /> : <AdminPage />}
    </>
  );
};

export default App;