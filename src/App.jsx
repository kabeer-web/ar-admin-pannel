import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './Components/Sidebar';
import ArGenerator from './Components/ArGenerator';
import Generator3D from './Components/Generator3D';
import QrGenerator from './Components/QrGenerator';
import ARView from './Components/ARView'; // Isse import zaroor karna

function Dashboard() {
  const [activeTab, setActiveTab] = useState('ar'); // Default tab 'ar' rakha hai

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
        {/* Dashboard route (Generator, Sidebar etc) */}
        <Route path="/" element={<Dashboard />} />
        
        {/* AR View route (Scan ke baad sirf ye khulega) */}
        <Route path="/view" element={<ARView />} />
        
        {/* Fallback to Dashboard */}
        <Route path="*" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;