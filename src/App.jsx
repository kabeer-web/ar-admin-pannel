import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './Components/Sidebar';
import Generator3D from './Components/Generator3D';
import QrGenerator from './Components/QrGenerator';
import ArGenerator from './Components/ArGenerator';
import ARView from './Components/ARView'; // Yeh naya component hai mobile ke liye

function AppContent() {
  const [activeTab, setActiveTab] = useState('generator');

  return (
    <div className="flex min-h-screen bg-[#f8fafc] text-slate-900 font-sans">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
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
        {/* Admin Panel Route */}
        <Route path="/" element={<AppContent />} />
        
        {/* 📱 Mobile View Route (Scan karne par ye khulega) */}
        <Route path="/view" element={<ARView />} />
      </Routes>
    </Router>
  );
}

export default App;