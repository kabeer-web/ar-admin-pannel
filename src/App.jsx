import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './Components/Sidebar';
import Generator3D from './Components/Generator3D';
import QrGenerator from './Components/QrGenerator';
import ArGenerator from './Components/ArGenerator';
import ARView from './Components/ARView';

function AppContent() {
  const [activeTab, setActiveTab] = useState('ar');

  return (
    // 'dark' class Sidebar se control ho rahi hai, yahan hum smooth background transition de rahe hain
    <div className="flex min-h-screen bg-slate-50 dark:bg-[#020617] transition-colors duration-500">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <div className="max-w-[1600px] mx-auto">
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
        <Route path="/view" element={<ARView />} />
        <Route path="/*" element={<AppContent />} />
      </Routes>
    </Router>
  );
}

export default App;