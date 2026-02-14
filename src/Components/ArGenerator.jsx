import React, { useState, useRef } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { Upload, Smartphone, Box, Palette, Zap, Download, Activity, Eye, ShieldCheck, Cpu, Maximize2, Image as ImageIcon, X } from 'lucide-react';
import axios from 'axios';
import '@google/model-viewer';

const ArGenerator = () => {
  const [modelUrl, setModelUrl] = useState('');
  const [publicUrl, setPublicUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [logoUrl, setLogoUrl] = useState(''); // Logo State
  const qrRef = useRef();

  const [qrColor, setQrColor] = useState('#10b981'); 
  const [qrBg, setQrBg] = useState('#ffffff'); 

  const API_BASE_URL = "http://localhost:5000"; 

  const getARViewLink = () => {
    if (!publicUrl) return '';
    return `${window.location.origin}/view?model=${encodeURIComponent(publicUrl)}`;
  };

  const downloadQRCode = () => {
    const canvas = qrRef.current.querySelector('canvas');
    const pngUrl = canvas.toDataURL("image/png");
    let downloadLink = document.createElement("a");
    downloadLink.href = pngUrl;
    downloadLink.download = "AR-code-Generator.png";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !file.name.endsWith('.glb')) return;
    setModelUrl(URL.createObjectURL(file));
    setLoading(true);
    const formData = new FormData();
    formData.append('model', file); 
    try {
      const res = await axios.post(`${API_BASE_URL}/api/upload-model`, formData);
      if (res.data.url) {
        setPublicUrl(res.data.url);
        setLoading(false);
      }
    } catch (err) { setLoading(false); }
  };

  // Handle Logo Upload for QR
  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoUrl(URL.createObjectURL(file));
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#020806] p-4 lg:p-8 text-emerald-50 font-sans selection:bg-emerald-500/30">
      
      {/* --- CINEMATIC HEADER --- */}
      <header className="flex justify-between items-center bg-[#05110d] p-8 rounded-[2.5rem] border border-emerald-500/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] mb-8">
        <div className="flex items-center gap-6">
           <div className="relative group">
              <div className="absolute -inset-1 bg-emerald-500 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
              <div className="relative bg-[#020806] p-5 rounded-2xl text-emerald-400 border border-emerald-500/20 shadow-2xl">
                <Cpu size={32} className="animate-pulse"/>
              </div>
           </div>
           <div>
              <h1 className="text-4xl font-black tracking-tighter uppercase leading-none italic">
                CODE GENERATOR <span className="text-emerald-500">AR</span>
              </h1>
              <p className="text-[11px] font-black text-emerald-800 tracking-[0.5em] uppercase mt-2 ml-1">Augmented Reality Neural Hub</p>
           </div>
        </div>
        
        <div className="flex items-center gap-8">
           <input type="file" id="glb-up" className="hidden" onChange={handleFileUpload} accept=".glb" />
           <label htmlFor="glb-up" className="cursor-pointer bg-emerald-600 hover:bg-emerald-400 text-[#020806] px-12 py-5 rounded-2xl text-sm font-black transition-all transform hover:-translate-y-1 active:scale-95 flex items-center gap-4 shadow-[0_15px_30px_rgba(16,185,129,0.2)] uppercase tracking-widest">
              <Upload size={20} strokeWidth={3}/> Initialize GLB
           </label>
        </div>
      </header>

      {/* --- MAIN INTERFACE --- */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 h-auto xl:h-[75vh]">
        
        {/* --- 1. SPATIAL VIEWPORT --- */}
        <div className="bg-[#030c08] rounded-[3.5rem] relative overflow-hidden border border-emerald-900/20 shadow-2xl flex flex-col min-h-[500px]">
            <div className="absolute top-8 left-8 z-20 flex items-center gap-3 bg-[#020806]/60 backdrop-blur-xl px-5 py-2.5 rounded-full border border-emerald-500/20">
               <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></div>
               <span className="text-[10px] font-black tracking-[0.3em] uppercase">Live Render Engine</span>
            </div>

            <div className="flex-1 w-full relative">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.03)_1.5px,transparent_1.5px),linear-gradient(90deg,rgba(16,185,129,0.03)_1.5px,transparent_1.5px)] bg-[size:60px_60px] pointer-events-none"></div>
                {publicUrl ? (
                    <model-viewer src={modelUrl} auto-rotate camera-controls shadow-intensity="2" exposure="1.2" environment-image="neutral" style={{width:'100%', height:'100%', background: 'transparent'}} />
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center space-y-8">
                        <Box size={160} strokeWidth={0.2} className="text-emerald-900/20 animate-spin-slow"/>
                        <p className="text-emerald-800 font-black tracking-[0.6em] uppercase text-xs">Awaiting Matrix Data</p>
                    </div>
                )}
            </div>
        </div>

        {/* --- 2. GENERATION CORE --- */}
        <div className="flex flex-col gap-8">
            
            {/* MASSIVE QR Card */}
            <div className="flex-1 bg-[#081511] rounded-[3.5rem] border border-emerald-900/30 shadow-2xl flex flex-col items-center justify-center relative p-10 overflow-hidden group min-h-[450px]">
                {publicUrl ? (
                    <div className="w-full flex flex-col items-center gap-10 z-10">
                        <div ref={qrRef} className="bg-white p-8 rounded-[3.5rem] shadow-[0_0_80px_rgba(16,185,129,0.25)] border-[12px] border-[#020806] transition-all duration-700">
                            <QRCodeCanvas 
                              value={getARViewLink()} 
                              size={320}
                              fgColor={qrColor} 
                              bgColor="#ffffff" 
                              level="H" 
                              imageSettings={logoUrl ? { src: logoUrl, height: 60, width: 60, excavate: true } : null}
                            />
                        </div>
                        <button onClick={downloadQRCode} className="w-full max-w-md bg-emerald-600 text-[#020806] py-6 rounded-[2rem] font-black text-xs tracking-[0.4em] flex items-center justify-center gap-4 hover:bg-emerald-400 transition-all uppercase">
                           <Download size={22} strokeWidth={3}/> Export Matrix
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col items-center gap-6 opacity-20">
                        <Smartphone size={100} strokeWidth={0.5} className="text-emerald-500"/>
                        <p className="text-xs font-black uppercase tracking-[0.5em]">Neural Link Standby</p>
                    </div>
                )}
            </div>

            {/* Design Panel + Logo Upload */}
            <div className={`bg-[#05110d] p-8 rounded-[3rem] border border-emerald-900/30 shadow-2xl ${!publicUrl && 'opacity-20 pointer-events-none'}`}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    
                    {/* Color Config */}
                    <div className="space-y-4">
                        <h3 className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.4em] flex items-center gap-3">
                           <Palette size={16}/> Matrix Tint
                        </h3>
                        <div className="flex items-center gap-4 p-4 bg-[#020806] rounded-2xl border border-emerald-900/30">
                            <input type="color" value={qrColor} onChange={(e)=>setQrColor(e.target.value)} className="w-12 h-12 bg-transparent cursor-pointer border-none rounded-lg" />
                            <span className="text-[10px] font-mono text-emerald-600">{qrColor.toUpperCase()}</span>
                        </div>
                    </div>

                    {/* Logo Config (The missing part!) */}
                    <div className="space-y-4">
                        <h3 className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.4em] flex items-center gap-3">
                           <ImageIcon size={16}/> Neural Branding
                        </h3>
                        <div className="flex items-center gap-4 p-4 bg-[#020806] rounded-2xl border border-emerald-900/30 relative">
                            {logoUrl ? (
                                <div className="flex items-center w-full justify-between">
                                    <img src={logoUrl} className="w-12 h-12 rounded-lg object-cover border border-emerald-500/30" alt="Logo" />
                                    <button onClick={() => setLogoUrl('')} className="p-2 hover:bg-red-500/10 text-red-500 rounded-lg transition-colors">
                                        <X size={16} />
                                    </button>
                                </div>
                            ) : (
                                <label className="flex items-center justify-center w-full h-12 border-2 border-dashed border-emerald-900/30 rounded-xl hover:border-emerald-500/50 cursor-pointer transition-all">
                                    <input type="file" className="hidden" accept="image/*" onChange={handleLogoUpload} />
                                    <span className="text-[9px] font-black text-emerald-800 uppercase tracking-widest">+ Add Logo</span>
                                </label>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ArGenerator;