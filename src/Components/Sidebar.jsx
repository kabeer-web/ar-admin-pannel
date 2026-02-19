import React from 'react';
import { 
  Box, QrCode, Sparkles, LayoutDashboard, 
  ChevronRight, Leaf, Zap, ShieldCheck, 
  Calculator, LogOut, Database // Database icon add kiya
} from 'lucide-react';
import { useClerk } from '@clerk/clerk-react';

const Sidebar = ({ activeTab, setActiveTab }) => {
  const { signOut } = useClerk();

  return (
    <div className="w-72 h-screen flex flex-col p-6 sticky top-0 transition-all duration-500
      bg-[#040d0a] border-r border-emerald-900/30 shadow-[10px_0_30px_rgba(0,0,0,0.5)] z-50">
      
      {/* --- BRANDING --- */}
      <div className="flex items-center gap-4 mb-14 px-2 mt-6">
        <div className="relative bg-[#0a1a15] border border-emerald-500/30 p-3 rounded-2xl text-emerald-400">
          <Leaf size={24} fill="currentColor" className="animate-pulse" />
        </div>
        <div className="flex flex-col">
          <span className="text-2xl font-black tracking-tighter text-emerald-50 leading-none">BEER <span className="text-emerald-500">AI</span></span>
          <span className="text-[9px] font-black text-emerald-700 tracking-[0.3em] uppercase mt-1">Neural Core</span>
        </div>
      </div>

      {/* --- NAVIGATION --- */}
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
        {/* --- Naya AI Data Management Tab --- */}
        <NavItem 
          icon={<Database size={20}/>} 
          label="AI Data Manager" 
          active={activeTab === 'excel'} 
          onClick={() => setActiveTab('excel')} 
        />
        <NavItem 
          icon={<Calculator size={20}/>} 
          label="Math Processor" 
          active={activeTab === 'calculator'} 
          onClick={() => setActiveTab('calculator')} 
        />
      </nav>

      {/* --- LOGOUT --- */}
      <div className="mt-auto space-y-4">
        <button 
          onClick={() => signOut()}
          className="w-full group flex items-center gap-4 p-4 rounded-2xl border border-red-900/20 text-red-900 hover:text-red-400 hover:bg-red-500/5 transition-all"
        >
          <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-black text-[11px] tracking-widest uppercase">Terminate</span>
        </button>
      </div>
    </div>
  );
};

const NavItem = ({ icon, label, active, onClick }) => (
  <div 
    onClick={onClick} 
    className={`group flex items-center justify-between p-4 rounded-2xl cursor-pointer transition-all duration-500 relative
      ${active 
        ? 'bg-emerald-500/10 text-emerald-400' 
        : 'text-emerald-900 hover:text-emerald-100 hover:bg-emerald-950/30'
      }`}
  >
    <div className="flex items-center gap-4 z-10">
      <span className={active ? 'scale-110' : 'group-hover:scale-110'}>{icon}</span>
      <span className="font-black text-[11px] tracking-widest uppercase">{label}</span>
    </div>
    {active ? <div className="w-1 h-1 bg-emerald-400 rounded-full shadow-[0_0_8px_rgba(52,211,153,1)]"></div> : <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-all" />}
  </div>
);

export default Sidebar;