import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, UserButton } from '@clerk/clerk-react'; // Clerk hooks
import { Box, Zap, Smartphone, Globe, Github, Linkedin, ArrowRight, Code2, Rocket } from 'lucide-react';
import myProfilePic from '../../profile-pic.png';

const LandingPage = () => {
  const navigate = useNavigate();
  const { isSignedIn } = useAuth(); // Check if user is logged in

  return (
    <div className="min-h-screen bg-[#010604] text-emerald-50 font-sans selection:bg-emerald-500 selection:text-black overflow-x-hidden">
      
      {/* Background Glows... (same as before) */}

      {/* Navbar */}
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
              <button 
                onClick={() => navigate('/dashboard')}
                className="text-[10px] font-black uppercase tracking-widest text-emerald-500 border border-emerald-500/30 px-4 py-2 rounded-lg hover:bg-emerald-500 hover:text-black transition-all"
              >
                Go to Dashboard
              </button>
              <UserButton afterSignOutUrl="/" />
            </div>
          ) : (
            <button 
              onClick={() => navigate('/login')}
              className="text-[10px] font-black uppercase tracking-widest text-emerald-500 hover:text-white transition-colors"
            >
              Member Login
            </button>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-24 pb-32 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/5 border border-emerald-500/20 mb-8">
          <Rocket size={14} className="text-emerald-500" />
          <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Next-Gen AR Ecosystem</span>
        </div>
        
        <h1 className="text-6xl md:text-9xl font-black uppercase italic tracking-tighter mb-8 leading-[0.9]">
          Forge <span className="text-emerald-500">Spatial</span> <br /> Realities
        </h1>
        
        <p className="text-emerald-500/60 max-w-2xl mx-auto text-sm md:text-lg mb-12 font-medium">
          The ultimate bridge for 3D Digital Assets & Augmented Reality.
        </p>

        <button 
          onClick={() => navigate('/dashboard')}
          className="group relative bg-emerald-500 hover:bg-emerald-400 px-12 py-6 rounded-2xl font-black text-black flex items-center gap-4 uppercase tracking-widest mx-auto transition-all shadow-[0_0_50px_rgba(16,185,129,0.4)]"
        >
          {isSignedIn ? 'Enter Matrix' : 'Access Matrix Dashboard'} <ArrowRight className="group-hover:translate-x-2 transition-transform" />
        </button>
      </section>

      {/* Profile, Features, & Footer... (same as your previous code) */}
      {/* ... (Keep the Github/LinkedIn links you updated) */}

    </div>
  );
};

export default LandingPage;