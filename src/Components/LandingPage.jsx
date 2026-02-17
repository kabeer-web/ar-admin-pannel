import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Zap, Smartphone, Globe, Github, Linkedin, ExternalLink, ArrowRight, Code2, Rocket } from 'lucide-react';
// Yahan image import ho rahi hai root folder se
// LandingPage.jsx ke upar
import myProfilePic from '../../profile-pic.png';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#010604] text-emerald-50 font-sans selection:bg-emerald-500 selection:text-black overflow-x-hidden">
      
      {/* --- ANIMATED BACKGROUND GLOW --- */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-500/5 blur-[120px] rounded-full animate-bounce" />
      </div>

      {/* Navbar */}
      <nav className="relative z-20 p-6 flex justify-between items-center max-w-7xl mx-auto backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.5)] rounded-xl flex items-center justify-center text-black font-black">K</div>
          <span className="font-black italic tracking-tighter text-2xl uppercase group cursor-default">
            AR <span className="text-emerald-500 group-hover:text-white transition-colors">MATRIX</span>
          </span>
        </div>
        <div className="hidden md:flex gap-8 text-[10px] font-bold uppercase tracking-[0.3em] text-emerald-500/50">
          <span className="hover:text-emerald-400 cursor-pointer transition-colors tracking-tighter text-lg uppercase italic font-black">PAKISTAN BASED TECH</span>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-24 pb-32 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/5 border border-emerald-500/20 mb-8 animate-fade-in">
          <Rocket size={14} className="text-emerald-500" />
          <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Next-Gen AR Ecosystem for Corporations</span>
        </div>
        
        <h1 className="text-6xl md:text-9xl font-black uppercase italic tracking-tighter mb-8 leading-[0.9] drop-shadow-[0_0_30px_rgba(16,185,129,0.2)]">
          Forge <span className="text-emerald-500">Spatial</span> <br /> Realities
        </h1>
        
        <p className="text-emerald-500/60 max-w-2xl mx-auto text-sm md:text-lg tracking-wide mb-12 font-medium leading-relaxed">
          The ultimate bridge for 3D Digital Assets & Augmented Reality. Built to scale corporate visualization.
        </p>

        <button 
          onClick={() => navigate('/dashboard')}
          className="group relative bg-emerald-500 hover:bg-emerald-400 px-12 py-6 rounded-2xl font-black text-black flex items-center gap-4 uppercase tracking-widest mx-auto transition-all shadow-[0_0_50px_rgba(16,185,129,0.4)] hover:scale-105 active:scale-95"
        >
          Access Matrix Dashboard <ArrowRight className="group-hover:translate-x-2 transition-transform" />
        </button>
      </section>

      {/* Profile Section (Kabeer Intro) */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 py-24">
        <div className="bg-black/40 backdrop-blur-2xl rounded-[4rem] p-10 md:p-16 border border-emerald-500/10 flex flex-col md:flex-row items-center gap-12 shadow-[0_0_100px_rgba(0,0,0,0.5)]">
          
          {/* Real Profile Image with Neon Frame */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-emerald-800 rounded-[3.5rem] blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative w-64 h-72 rounded-[3rem] bg-[#020806] border-2 border-emerald-500/20 overflow-hidden transition-all shadow-2xl">
              {/* TERI REAL PHOTO YAHAN DISPLAY HOGI */}
              <img 
                src={myProfilePic} 
                alt="Kabeer - MERN Stack Dev" 
                className="w-full h-full object-cover object-top grayscale hover:grayscale-0 transition-all duration-500 scale-110 hover:scale-100"
              />
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent">
                <p className="text-emerald-500 font-black text-center text-xs tracking-widest uppercase">Agent Kabeer</p>
              </div>
            </div>
          </div>

          <div className="flex-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
              <div className="h-[1px] w-8 bg-emerald-500"></div>
              <span className="text-emerald-500 text-xs font-black uppercase tracking-[0.4em]">Architect of Reality</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter mb-6">
              I am <span className="text-emerald-500 underline decoration-emerald-500/30">Kabeer</span>
            </h2>
            <p className="text-emerald-100/70 text-base md:text-lg mb-8 leading-relaxed font-medium">
              A passionate <span className="text-white font-bold">MERN Stack Developer from Pakistan</span>. I live at the intersection of clean code and <span className="text-emerald-400 italic">3D Augmented Reality</span>. 
              I built the AR MATRIX ENGINE to empower all types of <span className="text-white font-bold">Corporation Companies</span> to showcase their physical products in a digital spatial dimension.
            </p>
            
            <div className="flex flex-wrap justify-center md:justify-start gap-6">
              <a href="https://github.com" target="_blank" rel="noreferrer" className="flex items-center gap-2 text-emerald-500 hover:text-white transition-all text-xs font-black uppercase tracking-widest"><Github size={18}/> Github</a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="flex items-center gap-2 text-emerald-500 hover:text-white transition-all text-xs font-black uppercase tracking-widest"><Linkedin size={18}/> LinkedIn</a>
              <div className="flex items-center gap-2 text-emerald-500/40 text-xs font-black uppercase tracking-widest border-l border-emerald-500/10 pl-6"><Globe size={18}/> Based in Pakistan</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Showcase */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { icon: <Box className="animate-bounce" />, title: "3D Neural View", desc: "Enterprise-grade PBR rendering for high-fidelity assets." },
          { icon: <Zap className="animate-pulse" />, title: "Corporate Hues", desc: "Tailor model textures to match brand identity in real-time." },
          { icon: <Smartphone />, title: "Spatial QR Link", desc: "Instant AR projection for showrooms and digital marketing." }
        ].map((f, i) => (
          <div key={i} className="group bg-[#05110d]/50 backdrop-blur-md border border-emerald-500/10 p-10 rounded-[3rem] hover:bg-emerald-500/5 hover:border-emerald-500/40 transition-all duration-500">
            <div className="text-emerald-500 mb-6 group-hover:scale-110 transition-transform">{f.icon}</div>
            <h3 className="text-xl font-black uppercase mb-4 tracking-tighter">{f.title}</h3>
            <p className="text-emerald-500/40 text-sm leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-20 text-center border-t border-emerald-500/5">
        <p className="text-[10px] uppercase tracking-[0.8em] text-emerald-500/20 font-black mb-4 animate-pulse">
          &copy; 2026 MATRIX ENGINE // ALL NODES ENCRYPTED
        </p>
        <div className="flex justify-center gap-4 opacity-30">
             <div className="w-1 h-1 bg-emerald-500 rounded-full"></div>
             <div className="w-1 h-1 bg-emerald-500 rounded-full"></div>
             <div className="w-1 h-1 bg-emerald-500 rounded-full"></div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;