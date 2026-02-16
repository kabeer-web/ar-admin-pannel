import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './Components/Sidebar';
import ArGenerator from './Components/ArGenerator';
import Generator3D from './Components/Generator3D';
import QrGenerator from './Components/QrGenerator';
import ARView from './Components/ARView'; 
import LandingPage from './Components/LandingPage'; // Isay import karo

function Dashboard() {
  const [activeTab, setActiveTab] = useState('ar'); 

  return (
    <div className="flex min-h-screen bg-[#020806]">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 h-screen overflow-y-auto custom-scrollbar">
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
        {/* 1. Root Route: Landing Page dikhayega */}
        <Route path="/" element={<LandingPage />} />
        
        {/* 2. Dashboard Route: Jahan saare generators hain */}
        <Route path="/dashboard" element={<Dashboard />} />
        
        {/* 3. AR View: Scan karne ke baad wala standalone page */}
        <Route path="/view" element={<ARView />} />
        
        {/* Fallback to Landing Page agar link galat ho */}
        <Route path="*" element={<LandingPage />} />
      </Routes>
    </Router>
  );
}

export default App;