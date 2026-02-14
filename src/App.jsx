import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './Components/Sidebar';
import ArGenerator from './Components/ArGenerator';
import Generator3D from './Components/Generator3D';
import QrGenerator from './Components/QrGenerator'; // Import check kar lena sahi hai ya nahi

function AppContent() {
  // Shuruat mein 'generator' ya koi bhi valid tab rakhein
  const [activeTab, setActiveTab] = useState('generator');

  return (
    // Pura background dark emerald/black rakha hai takay seamless lage
    <div className="flex min-h-screen bg-[#020806] transition-colors duration-300">
      
      {/* Sidebar Section */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
      />
      
      {/* Main Content Area */}
      <main className="flex-1 h-screen overflow-y-auto custom-scrollbar">
        <div className="max-w-[1600px] mx-auto">
          {/* Conditional Rendering logic yahan theek ki hai */}
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
        <Route path="/*" element={<AppContent />} />
      </Routes>
    </Router>
  );
}

export default App;