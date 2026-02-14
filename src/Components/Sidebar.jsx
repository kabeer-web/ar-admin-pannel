import React, { useState, useEffect } from 'react';
import { Box, QrCode, Sparkles, Sun, Moon, LayoutDashboard, ChevronRight } from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab }) => {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDark]);

  return (
    <div className="w-72 h-screen flex flex-col p-5 sticky top-0 transition-all duration-300
      bg-white dark:bg-[#0f172a] 
      border-r border-slate-200 dark:border-slate-800 shadow-xl z-50">
      
      <div className="flex items-center gap-3 mb-12 px-2 mt-4">
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
          <div className="relative bg-blue-600 p-2.5 rounded-xl text-white shadow-lg">
            <Sparkles size={22} fill="currentColor" />
          </div>
        </div>
        <div className="flex flex-col">
          <span className="text-lg font-black tracking-tighter text-slate-900 dark:text-white leading-none">GEMINI 3D</span>
          <span className="text-[10px] font-bold text-blue-500 tracking-[0.2em] uppercase">Enterprise</span>
        </div>
      </div>

      <nav className="flex-1 space-y-2">
        <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-4 ml-4">Main Menu</p>
        <NavItem icon={<LayoutDashboard size={18}/>} label="2D TO 3D GENERATOR" active={activeTab === 'generator'} onClick={() => setActiveTab('generator')} />
        <NavItem icon={<QrCode size={18}/>} label="QR GENERATOR" active={activeTab === 'qr'} onClick={() => setActiveTab('qr')} />
        <NavItem icon={<Sparkles size={18}/>} label="AR GENERATOR" active={activeTab === 'ar'} onClick={() => setActiveTab('ar')} />
      </nav>

      <div className="mt-auto pt-6 border-t border-slate-100 dark:border-slate-800">
        <button 
          onClick={() => setIsDark(!isDark)}
          className="w-full flex items-center justify-between p-4 rounded-2xl cursor-pointer 
          bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all border border-slate-200/50 dark:border-slate-700/50"
        >
          <div className="flex items-center gap-3">
            {isDark ? <Moon size={18} className="text-blue-400" /> : <Sun size={18} className="text-orange-500" />}
            <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-widest">
              {isDark ? 'Dark Mode' : 'Light Mode'}
            </span>
          </div>
          <div className={`w-8 h-4 rounded-full relative transition-colors ${isDark ? 'bg-blue-600' : 'bg-slate-300'}`}>
             <div className={`absolute top-1 w-2 h-2 bg-white rounded-full transition-all ${isDark ? 'right-1' : 'left-1'}`}></div>
          </div>
        </button>
      </div>
    </div>
  );
};

const NavItem = ({ icon, label, active, onClick }) => (
  <div onClick={onClick} className={`group flex items-center justify-between p-4 rounded-2xl cursor-pointer transition-all duration-300 border ${active ? 'bg-blue-600/10 border-blue-600/20 text-blue-600 dark:text-blue-400 shadow-lg' : 'border-transparent text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-200'}`}>
    <div className="flex items-center gap-4">
      <span className={`transition-transform duration-300 group-hover:scale-110 ${active ? 'text-blue-600 dark:text-blue-400' : ''}`}>{icon}</span>
      <span className="font-black text-[10px] tracking-widest uppercase">{label}</span>
    </div>
    {active && <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-pulse"></div>}
    {!active && <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all text-slate-300 dark:text-slate-600" />}
  </div>
);

export default Sidebar;