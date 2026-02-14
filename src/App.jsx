import React, { useState } from 'react';
import Sidebar from './Components/Sidebar';

// Aapki banayi hui nayi files ka import
import Generator3D from './Components/Generator3D';
import QrGenerator from './Components/QrGenerator';
import ArGenerator from './Components/ArGenerator';

function App() {
  // Navigation State: By default pehla tab khulega
  const [activeTab, setActiveTab] = useState('generator');

  return (
    <div className="flex min-h-screen bg-[#f8fafc] text-slate-900 font-sans">
      {/* Sidebar: Navigation control center */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          
          {/* Conditional Rendering: Component tabhi dikhega jab user click karega */}
          
          {activeTab === 'generator' && (
            <div className="animate-in fade-in duration-300">
               <Generator3D />
            </div>
          )}

          {activeTab === 'qr' && (
            <div className="animate-in fade-in duration-300">
               <QrGenerator />
            </div>
          )}

          {activeTab === 'ar' && (
            <div className="animate-in fade-in duration-300">
               <ArGenerator />
            </div>
          )}

        </div>
      </main>
    </div>
  );
}

export default App;