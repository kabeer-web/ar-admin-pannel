import React from 'react';
import { Box, QrCode, Sparkles, LayoutDashboard, ChevronRight, Leaf, Zap, ShieldCheck } from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab }) => {
  return (
    <div className="w-72 h-screen flex flex-col p-6 sticky top-0 transition-all duration-500
      bg-[#040d0a] border-r border-emerald-900/30 shadow-[10px_0_30px_rgba(0,0,0,0.5)] z-50">
      
      {/* --- BRANDING SECTION --- */}
      <div className="flex items-center gap-4 mb-14 px-2 mt-6">
        <div className="relative group">
          <div className="absolute -inset-2 bg-gradient-to-r from-emerald-600 to-cyan-600 rounded-2xl blur opacity-20 group-hover:opacity-60 transition duration-1000"></div>
          <div className="relative bg-[#0a1a15] border border-emerald-500/30 p-3 rounded-2xl text-emerald-400 shadow-2xl">
            <Leaf size={24} fill="currentColor" className="animate-pulse" />
          </div>
        </div>
        <div className="flex flex-col">
          <span className="text-2xl font-black tracking-tighter text-emerald-50 leading-none">BEER <span className="text-emerald-500">AI</span></span>
          <span className="text-[9px] font-black text-emerald-700 tracking-[0.3em] uppercase mt-1">Kabir's Neural Core</span>
        </div>
      </div>

      {/* --- NAVIGATION MENU --- */}
      <nav className="flex-1 space-y-3">
        <p className="text-[10px] font-black text-emerald-900 uppercase tracking-[0.4em] mb-6 ml-4">Neural Networks</p>
        
        <NavItem 
          icon={<LayoutDashboard size={20}/>} 
          label="3D Generator" 
          active={activeTab === 'generator'} 
          onClick={() => setActiveTab('generator')} 
        />
        <NavItem 
          icon={<QrCode size={20}/>} 
          label="QR Matrix" 
          active={activeTab === 'qr'} 
          onClick={() => setActiveTab('qr')} 
        />
        <NavItem 
          icon={<Sparkles size={20}/>} 
          label="AR Biosphere" 
          active={activeTab === 'ar'} 
          onClick={() => setActiveTab('ar')} 
        />
      </nav>

      {/* --- FOOTER STATUS --- */}
      <div className="mt-auto space-y-4">
        <div className="p-5 rounded-[2rem] bg-emerald-950/20 border border-emerald-900/30">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></div>
            <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">System Online</span>
          </div>
          <p className="text-[11px] text-emerald-100/40 font-medium leading-relaxed">
            All bio-nodes are synchronized with 3D engine.
          </p>
        </div>

        <div className="flex items-center justify-between px-4 py-2 opacity-30 hover:opacity-100 transition-opacity">
            <div className="flex items-center gap-2">
                <Zap size={14} className="text-emerald-500" />
                <span className="text-[10px] font-bold tracking-tighter">v2.4.0-Stable</span>
            </div>
            <ShieldCheck size={14} />
        </div>
      </div>
    </div>
  );
};

const NavItem = ({ icon, label, active, onClick }) => (
  <div 
    onClick={onClick} 
    className={`group flex items-center justify-between p-4 rounded-2xl cursor-pointer transition-all duration-500 relative overflow-hidden
      ${active 
        ? 'bg-emerald-500/10 text-emerald-400 shadow-[inset_0_0_20px_rgba(16,185,129,0.05)]' 
        : 'text-emerald-900 hover:text-emerald-100 hover:bg-emerald-950/30'
      }`}
  >
    {/* Active Indicator Glow */}
    {active && (
        <div className="absolute left-0 top-0 h-full w-1 bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,1)]"></div>
    )}

    <div className="flex items-center gap-4 z-10">
      <span className={`transition-all duration-500 ${active ? 'scale-110' : 'group-hover:text-emerald-400 group-hover:scale-110'}`}>
        {icon}
      </span>
      <span className={`font-black text-[11px] tracking-widest uppercase transition-all duration-300 ${active ? 'opacity-100' : 'opacity-60 group-hover:opacity-100'}`}>
        {label}
      </span>
    </div>

    {active ? (
      <div className="w-1 h-1 bg-emerald-400 rounded-full shadow-[0_0_8px_rgba(52,211,153,1)]"></div>
    ) : (
      <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
    )}
  </div>
);

export default Sidebar;