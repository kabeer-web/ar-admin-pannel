import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Zap, Smartphone, ShieldCheck, Github, Linkedin, ExternalLink, ArrowRight } from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#010604] text-emerald-50 font-sans selection:bg-emerald-500 selection:text-black">
      {/* Navbar Placeholder */}
      <nav className="p-6 flex justify-between items-center max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center text-black font-black">M</div>
          <span className="font-black italic tracking-tighter text-xl uppercase">AR MATRIX</span>
        </div>
        <button 
          onClick={() => navigate('/dashboard')} // Dashboard ka route yahan dalna
          className="bg-emerald-500/10 border border-emerald-500/20 px-6 py-2 rounded-full text-emerald-400 text-sm font-bold hover:bg-emerald-500 hover:text-black transition-all"
        >
          Dev Log
        </button>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 pt-20 pb-32 text-center relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />
        
        <h1 className="text-5xl md:text-8xl font-black uppercase italic tracking-tighter mb-6 leading-none">
          Next-Gen <br /> <span className="text-emerald-500">Spatial Assets</span>
        </h1>
        <p className="text-emerald-500/60 max-w-2xl mx-auto text-sm md:text-base tracking-widest uppercase mb-12 font-medium">
          The ultimate bridge between 3D Digital Assets and Real-World Augmented Reality.
        </p>

        <button 
          onClick={() => navigate('/dashboard')}
          className="group relative bg-emerald-600 hover:bg-emerald-400 px-12 py-6 rounded-2xl font-black text-black flex items-center gap-4 uppercase tracking-widest mx-auto transition-all shadow-[0_0_50px_rgba(16,185,129,0.3)] active:scale-95"
        >
          Access Matrix Dashboard <ArrowRight className="group-hover:translate-x-2 transition-transform" />
        </button>
      </section>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { icon: <Box size={30} />, title: "3D Neural View", desc: "Real-time PBR rendering for GLB assets with high-fidelity lighting." },
          { icon: <Zap size={30} />, title: "Live Hues", desc: "Modify textures and materials on the fly before generating spatial links." },
          { icon: <Smartphone size={30} />, title: "Matrix AR QR", desc: "One-scan solution to project your models into real-world environments." }
        ].map((f, i) => (
          <div key={i} className="bg-[#05110d] border border-emerald-500/10 p-10 rounded-[3rem] hover:border-emerald-500/30 transition-all">
            <div className="text-emerald-500 mb-6">{f.icon}</div>
            <h3 className="text-xl font-black uppercase mb-4 tracking-tighter">{f.title}</h3>
            <p className="text-emerald-500/40 text-sm leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </section>

      {/* Developer Profile Section */}
      <section className="max-w-4xl mx-auto px-6 py-32 border-t border-emerald-500/5">
        <div className="bg-[#05110d] rounded-[4rem] p-12 border border-emerald-500/10 flex flex-col md:flex-row items-center gap-12">
          {/* Profile Picture Placeholder */}
          <div className="w-48 h-48 rounded-[3rem] bg-emerald-900/20 border-2 border-emerald-500/20 flex items-center justify-center overflow-hidden grayscale hover:grayscale-0 transition-all shadow-2xl">
            <span className="text-emerald-500 font-black text-4xl">DEv</span> 
            {/* Yahan apni image dal sakte ho <img src="/path-to-pic" /> */}
          </div>

          <div className="flex-1 text-center md:text-left">
            <h2 className="text-3xl font-black uppercase italic tracking-tighter mb-2">Developed by <span className="text-emerald-500">Your Name</span></h2>
            <p className="text-emerald-500/60 text-sm mb-6 leading-relaxed">
              Full-stack Developer & AR Enthusiast. Building tools that bridge the gap between imagination and spatial reality. Expert in React, 3D WebGL, and Neural UI design.
            </p>
            
            <div className="flex flex-wrap justify-center md:justify-start gap-4">
              <a href="#" className="p-3 bg-black rounded-xl border border-emerald-500/10 hover:border-emerald-500/50 transition-all text-emerald-500"><Github size={20}/></a>
              <a href="#" className="p-3 bg-black rounded-xl border border-emerald-500/10 hover:border-emerald-500/50 transition-all text-emerald-500"><Linkedin size={20}/></a>
              <a href="#" className="flex items-center gap-2 px-6 py-3 bg-emerald-500/10 rounded-xl border border-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500 hover:text-black transition-all">
                View Portfolio <ExternalLink size={14}/>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 text-center">
        <p className="text-[10px] uppercase tracking-[0.5em] text-emerald-500/20 font-black">
          &copy; 2024 Matrix Engine // All Nodes Encrypted
        </p>
      </footer>
    </div>
  );
};

export default LandingPage;