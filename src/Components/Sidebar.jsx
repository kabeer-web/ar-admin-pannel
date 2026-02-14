import React from 'react';
import { Box, QrCode, Sparkles, LayoutDashboard } from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab }) => (
  <div className="w-72 h-screen bg-slate-900 text-gray-400 flex flex-col p-6 sticky top-0 shadow-2xl">
    <div className="flex items-center gap-3 mb-12 text-white px-2">
      <div className="bg-blue-600 p-2 rounded-xl text-white shadow-lg shadow-blue-900/50">
        <Sparkles size={24} fill="currentColor" />
      </div>
      <span className="text-xl font-black tracking-tighter">GEMINI 3D</span>
    </div>
    
    <nav className="flex-1 space-y-3">
      <NavItem 
        icon={<Box size={20}/>} 
        label="2D TO 3D GENERATOR" 
        active={activeTab === 'generator'} 
        onClick={() => setActiveTab('generator')} 
      />
      <NavItem 
        icon={<QrCode size={20}/>} 
        label="QR GENERATOR" 
        active={activeTab === 'qr'} 
        onClick={() => setActiveTab('qr')} 
      />
      <NavItem 
        icon={<Sparkles size={20}/>} 
        label="AR GENERATOR" 
        active={activeTab === 'ar'} 
        onClick={() => setActiveTab('ar')} 
      />
    </nav>
  </div>
);

const NavItem = ({ icon, label, active, onClick }) => (
  <div 
    onClick={onClick}
    className={`flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all duration-200 group ${
      active ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' : 'hover:bg-slate-800 hover:text-gray-200'
    }`}
  >
    <span className={`${active ? 'text-white' : 'text-slate-500 group-hover:text-blue-400'}`}>{icon}</span>
    <span className="font-bold text-xs tracking-widest">{label}</span>
  </div>
);

export default Sidebar;