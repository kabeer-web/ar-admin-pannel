import React, { useState, useRef } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { Download, Upload, Palette, Link as LinkIcon, Sparkles, Zap } from 'lucide-react';

const QrGenerator = () => {
  const [url, setUrl] = useState('');
  const [fgColor, setFgColor] = useState('#10b981'); // Emerald 500
  const [bgColor, setBgColor] = useState('#030c08'); // Deep Forest Black
  const [logo, setLogo] = useState(null);
  const qrRef = useRef();

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setLogo(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const downloadQR = () => {
    const canvas = qrRef.current.querySelector('canvas');
    const url = canvas.toDataURL("image/png");
    const link = document.createElement('a');
    link.href = url;
    link.download = 'BEER-AI-QR.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 p-6 lg:p-12 text-emerald-50">
      
      {/* --- HEADER --- */}
      <header className="space-y-4 border-l-4 border-emerald-600 pl-8 py-2">
        <div className="flex items-center gap-2 text-emerald-500 font-bold text-[10px] tracking-[0.4em] uppercase">
            <Zap size={14} fill="currentColor" /> Neural Matrix Link
        </div>
        <h1 className="text-6xl font-black tracking-tighter leading-none">
            QR <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-700">MATRIX</span>
        </h1>
        <p className="text-emerald-800 font-medium text-lg max-w-2xl">
            Generate branded, high-contrast QR codes to bridge your physical space with the 3D digital world.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-7xl">
        
        {/* --- CONTROLS SECTION (Left) --- */}
        <div className="bg-[#081511] p-8 md:p-10 rounded-[3.5rem] border border-emerald-900/30 shadow-2xl space-y-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-[60px] rounded-full"></div>
          
          {/* Link Input */}
          <div className="space-y-4">
            <label className="text-[10px] font-black text-emerald-700 uppercase tracking-[0.3em] block ml-2">Redirect Endpoint</label>
            <div className="relative group">
              <LinkIcon className="absolute left-5 top-5 text-emerald-800 group-focus-within:text-emerald-400 transition-colors" size={20} />
              <input 
                type="text" 
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://beer-ai.kabeer.com/model-id"
                className="w-full p-5 pl-14 bg-[#030c08] border border-emerald-900/50 rounded-[2rem] text-emerald-100 outline-none focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/5 transition-all placeholder:text-emerald-900/50 font-medium"
              />
            </div>
          </div>

          {/* Color Customization */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <label className="text-[10px] font-black text-emerald-700 uppercase tracking-[0.3em] block ml-2 text-center md:text-left">Matrix Tint</label>
              <div className="flex items-center gap-4 p-3 bg-[#030c08] border border-emerald-900/30 rounded-2xl hover:border-emerald-500/30 transition-all">
                <input 
                  type="color" 
                  value={fgColor}
                  onChange={(e) => setFgColor(e.target.value)}
                  className="w-12 h-12 rounded-xl cursor-pointer border-none bg-transparent"
                />
                <span className="text-sm font-mono font-black text-emerald-500/60 tracking-wider uppercase">{fgColor}</span>
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-black text-emerald-700 uppercase tracking-[0.3em] block ml-2 text-center md:text-left">Plate Base</label>
              <div className="flex items-center gap-4 p-3 bg-[#030c08] border border-emerald-900/30 rounded-2xl hover:border-emerald-500/30 transition-all">
                <input 
                  type="color" 
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="w-12 h-12 rounded-xl cursor-pointer border-none bg-transparent"
                />
                <span className="text-sm font-mono font-black text-emerald-500/60 tracking-wider uppercase">{bgColor}</span>
              </div>
            </div>
          </div>

          {/* Logo Upload Slot */}
          <div className="space-y-4">
            <label className="text-[10px] font-black text-emerald-700 uppercase tracking-[0.3em] block ml-2">Center Branding</label>
            <label className="flex flex-col items-center justify-center w-full h-40 bg-[#030c08] border-2 border-dashed border-emerald-900/30 rounded-[2.5rem] cursor-pointer hover:bg-emerald-900/10 hover:border-emerald-500/40 transition-all group">
              <div className="bg-emerald-500/5 p-4 rounded-2xl mb-3 group-hover:scale-110 transition-transform">
                <Upload className="text-emerald-800 group-hover:text-emerald-500" size={24} />
              </div>
              <span className="text-xs font-black text-emerald-800 group-hover:text-emerald-600 uppercase tracking-widest">Inlay Company Logo</span>
              <input type="file" className="hidden" onChange={handleLogoUpload} accept="image/*" />
            </label>
          </div>
        </div>

        {/* --- PREVIEW SECTION (Right) --- */}
        <div className="bg-[#030c08] rounded-[4rem] flex flex-col items-center justify-center border border-emerald-900/20 shadow-2xl relative overflow-hidden group min-h-[600px]">
          
          {/* Decorative Elements */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.05)_0%,transparent_70%)]"></div>
          <div className="absolute top-10 right-10 text-emerald-900/10 rotate-12 group-hover:rotate-0 transition-transform duration-1000">
            <Palette size={240} />
          </div>

          {/* QR Display Area */}
          <div 
            ref={qrRef} 
            className="relative z-10 p-10 rounded-[3.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.8)] border border-white/5" 
            style={{ backgroundColor: bgColor }}
          >
            <QRCodeCanvas
              value={url || "https://beer-ai.kabeer.com"}
              size={300}
              fgColor={fgColor}
              bgColor={bgColor}
              level={"H"}
              imageSettings={{
                src: logo || "",
                height: 60,
                width: 60,
                excavate: true,
              }}
            />
          </div>
          
          {/* Download & Info */}
          <div className="mt-12 w-full max-w-sm space-y-5 z-10 px-6">
            <button 
              disabled={!url}
              onClick={downloadQR}
              className={`w-full flex items-center justify-center gap-4 px-8 py-6 rounded-3xl font-black tracking-[0.2em] text-xs transition-all duration-500 ${
                url 
                ? 'bg-emerald-600 text-[#020806] hover:bg-emerald-500 hover:-translate-y-1 shadow-[0_10px_30px_rgba(16,185,129,0.2)]' 
                : 'bg-emerald-950/20 text-emerald-900 cursor-not-allowed border border-emerald-900/30'
              }`}
            >
              <Download size={20} strokeWidth={3} />
              COMPILE MATRIX
            </button>
            <div className="flex items-center justify-center gap-2 opacity-40">
                <Sparkles size={12} className="text-emerald-500" />
                <p className="text-center text-[10px] font-black text-emerald-500 uppercase tracking-[0.3em]">
                    Verified for High-Speed Optics
                </p>
            </div>
          </div>

          {/* Bottom Scanner Simulation */}
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-20 animate-pulse"></div>
        </div>

      </div>
    </div>
  );
};

export default QrGenerator;