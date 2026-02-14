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
    <div className="flex min-h-screen bg-[#f8fafc]">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 p-8">
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
        {/* Mobile View Route */}
        <Route path="/view" element={<ARView />} />
        {/* Admin Dashboard Routes */}
        <Route path="/*" element={<AppContent />} />
      </Routes>
    </Router>
  );
}

export default App;