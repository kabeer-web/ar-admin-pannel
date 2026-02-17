import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, UserButton } from '@clerk/clerk-react';
import { Box, Zap, Smartphone, Globe, Github, Linkedin, ArrowRight, Rocket, MessageCircle, X } from 'lucide-react';
import myProfilePic from '../../profile-pic.png';

const LandingPage = () => {
  const navigate = useNavigate();
  const { isSignedIn } = useAuth();
  const [showChat, setShowChat] = useState(false);

  return (
    <div className="min-h-screen bg-[#010604] text-emerald-50 font-sans selection:bg-emerald-500 selection:text-black overflow-x-hidden">
      
      {/* --- ANIMATED BACKGROUND GLOW --- */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-500/5 blur-[120px] rounded-full" />
      </div>

      {/* --- NAVBAR --- */}
      <nav className="relative z-20 p-6 flex justify-between items-center max-w-7xl mx-auto backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.5)] rounded-xl flex items-center justify-center text-black font-black text-xl">K</div>
          <span className="font-black italic tracking-tighter text-2xl uppercase">
            AR <span className="text-emerald-500">MATRIX</span>
          </span>
        </div>
        
        <div className="flex gap-6 items-center">
          {isSignedIn ? (
            <div className="flex items-center gap-4">
              <button onClick={() => navigate('/dashboard')} className="text-[10px] font-black uppercase tracking-widest text-emerald-500 border border-emerald-500/30 px-4 py-2 rounded-lg hover:bg-emerald-500 hover:text-black transition-all">
                Go to Dashboard
              </button>
              <UserButton afterSignOutUrl="/" />
            </div>
          ) : (
            <button onClick={() => navigate('/login')} className="text-[10px] font-black uppercase tracking-widest text-emerald-500 hover:text-white transition-colors">
              Member Login
            </button>
          )}
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-24 pb-32 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/5 border border-emerald-500/20 mb-8">
          <Rocket size={14} className="text-emerald-500" />
          <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Next-Gen AR Ecosystem</span>
        </div>
        
        <h1 className="text-6xl md:text-9xl font-black uppercase italic tracking-tighter mb-8 leading-[0.9] drop-shadow-[0_0_30px_rgba(16,185,129,0.2)]">
          Forge <span className="text-emerald-500">Spatial</span> <br /> Realities
        </h1>
        
        <p className="text-emerald-500/60 max-w-2xl mx-auto text-sm md:text-lg mb-12 font-medium leading-relaxed">
          The ultimate bridge for 3D Digital Assets & Augmented Reality. Built to scale corporate visualization.
        </p>

        <button 
          onClick={() => navigate('/dashboard')}
          className="group relative bg-emerald-500 hover:bg-emerald-400 px-12 py-6 rounded-2xl font-black text-black flex items-center gap-4 uppercase tracking-widest mx-auto transition-all shadow-[0_0_50px_rgba(16,185,129,0.4)]"
        >
          {isSignedIn ? 'Enter Matrix' : 'Access Matrix Dashboard'} <ArrowRight className="group-hover:translate-x-2 transition-transform" />
        </button>
      </section>

      {/* --- PROFILE SECTION --- */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 py-24">
        <div className="bg-black/40 backdrop-blur-2xl rounded-[4rem] p-10 md:p-16 border border-emerald-500/10 flex flex-col md:flex-row items-center gap-12 shadow-[0_0_100px_rgba(0,0,0,0.5)]">
          
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-emerald-800 rounded-[3.5rem] blur opacity-25 group-hover:opacity-75 transition duration-1000"></div>
            <div className="relative w-64 h-80 rounded-[3rem] bg-[#020806] border-2 border-emerald-500/20 overflow-hidden shadow-2xl">
              <img 
                src={myProfilePic} 
                alt="Kabeer" 
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
              />
            </div>
          </div>

          <div className="flex-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
              <div className="h-[1px] w-8 bg-emerald-500"></div>
              <span className="text-emerald-500 text-xs font-black uppercase tracking-[0.4em]">Architect of Reality</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter mb-6">
              I am <span className="text-emerald-500">Kabeer</span>
            </h2>
            <p className="text-emerald-100/70 text-base md:text-lg mb-8 leading-relaxed font-medium">
              A passionate <span className="text-white font-bold">MERN Stack Developer from Pakistan</span>. I live at the intersection of clean code and <span className="text-emerald-400 italic">3D Augmented Reality</span>.
            </p>
            
            <div className="flex flex-wrap justify-center md:justify-start gap-6">
              <a href="https://github.com/kabeer-web/" target="_blank" rel="noreferrer" className="flex items-center gap-2 text-emerald-500 hover:text-white transition-all text-xs font-black uppercase tracking-widest"><Github size={18}/> Github</a>
              <a href="https://www.linkedin.com/in/kabeer-qadir-7a9a072b3/" target="_blank" rel="noreferrer" className="flex items-center gap-2 text-emerald-500 hover:text-white transition-all text-xs font-black uppercase tracking-widest"><Linkedin size={18}/> LinkedIn</a>
              <div className="flex items-center gap-2 text-emerald-500/40 text-xs font-black uppercase tracking-widest border-l border-emerald-500/10 pl-6"><Globe size={18}/> Karachi, PK</div>
            </div>
          </div>
        </div>
      </section>

      {/* --- FEATURES SECTION --- */}
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

      {/* --- REAL-TIME WHATSAPP CHAT WIDGET --- */}
      <div className="fixed bottom-8 right-8 z-[100]">
        {showChat && (
          <div className="absolute bottom-20 right-0 w-80 bg-[#05110d] border border-emerald-500/20 rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] animate-in fade-in slide-in-from-bottom-5">
            <div className="bg-emerald-500 p-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-black/20 flex items-center justify-center text-black font-bold">K</div>
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-950 border-2 border-emerald-500 rounded-full"></div>
                </div>
                <div>
                  <p className="text-black font-black text-sm uppercase italic">Kabeer Qadir</p>
                  <p className="text-black/60 text-[10px] font-bold uppercase tracking-tighter">Online - Karachi, PK</p>
                </div>
              </div>
              <button onClick={() => setShowChat(false)} className="text-black/50 hover:text-black"><X size={20}/></button>
            </div>
            <div className="p-6">
              <p className="text-emerald-500/70 text-sm font-medium mb-4 italic">"Bhai, payment confirm karni hai ya dashboard access chahiye? Message karo."</p>
              <a 
                href="https://wa.me/923222301920?text=Salam%20Kabeer,%20mujhe%20AR%20Matrix%20ka%20access%20chahiye." 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center justify-center gap-2 bg-emerald-500/10 border border-emerald-500/40 text-emerald-500 py-3 rounded-xl hover:bg-emerald-500 hover:text-black transition-all font-black text-xs uppercase tracking-widest"
              >
                <MessageCircle size={16}/> Start WhatsApp Chat
              </a>
            </div>
          </div>
        )}
        
        <button 
          onClick={() => setShowChat(!showChat)}
          className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center text-black shadow-[0_0_30px_rgba(16,185,129,0.4)] hover:scale-110 transition-transform active:scale-95"
        >
          {showChat ? <X size={30} /> : <MessageCircle size={30} />}
        </button>
      </div>

      {/* --- FOOTER --- */}
      <footer className="relative z-10 py-20 text-center border-t border-emerald-500/5">
        <p className="text-[10px] uppercase tracking-[0.8em] text-emerald-500/20 font-black mb-4">
          &copy; 2026 AR MATRIX // BUILT BY KABEER
        </p>
        <div className="flex justify-center gap-2 opacity-20">
             <div className="w-1 h-1 bg-emerald-500 rounded-full"></div>
             <div className="w-1 h-1 bg-emerald-500 rounded-full"></div>
             <div className="w-1 h-1 bg-emerald-500 rounded-full"></div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;