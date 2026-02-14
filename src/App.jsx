import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './Components/Sidebar';
import Generator3D from './Components/Generator3D';
import QrGenerator from './Components/QrGenerator';
import ArGenerator from './Components/ArGenerator';
import ARView from './Components/ARView';

function AppContent() {
  const [activeTab, setActiveTab] = useState('ar');

  return (
    // "transition-colors" lagaya hai taake mode change hote waqt aankhon ko jhatka na lage
    <div className="flex min-h-screen bg-[#f8fafc] dark:bg-[#020617] transition-colors duration-300">
      
      {/* Sidebar handles the 'dark' class injection via its toggle */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <div className="max-w-[1600px] mx-auto">
          {/* Har component ke andar dark: modifiers hone chahiye */}
          {activeTab === 'generator' && <Generator3D />}
          {activeTab === 'qr' && <QrGenerator />}
          {activeTab === 'ar' && <ArGenerator />}
        </div>
      </main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        {/* Mobile View Route (Usually kept clean/standard) */}
        <Route path="/view" element={<ARView />} />
        
        {/* Admin Dashboard Routes */}
        <Route path="/*" element={<AppContent />} />
      </Routes>
    </Router>
  );
}

export default App;