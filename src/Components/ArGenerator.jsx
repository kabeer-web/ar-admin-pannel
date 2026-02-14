import React, { useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { Upload, Smartphone, Loader2, AlertCircle, Box, CheckCircle2, Palette, Image as ImageIcon, Zap, Info, Share2, MousePointer2 } from 'lucide-react';
import axios from 'axios';
import '@google/model-viewer';

const ArGenerator = () => {
  const [modelUrl, setModelUrl] = useState('');
  const [publicUrl, setPublicUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploadStep, setUploadStep] = useState('');
  const [error, setError] = useState(null);

  // --- BRANDING STATES ---
  const [qrColor, setQrColor] = useState('#2563eb'); // Premium Blue default
  const [qrBg, setQrBg] = useState('#ffffff');
  const [logoUrl, setLogoUrl] = useState(''); 

  const API_BASE_URL = "http://localhost:5000"; 

  const getARViewLink = () => {
    if (!publicUrl) return '';
    return `${window.location.origin}/view?model=${encodeURIComponent(publicUrl)}`;
  };

  // --- NEW: MANUAL LOGO UPLOAD HANDLER ---
  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setLogoUrl(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !file.name.endsWith('.glb')) {
      setError("Please upload a valid .glb file.");
      return;
    }

    setModelUrl(URL.createObjectURL(file));
    setLoading(true);
    setError(null);
    setUploadStep('Analyzing Geometry...');

    const formData = new FormData();
    formData.append('model', file); 

    try {
      setUploadStep('Cloud Syncing...');
      const res = await axios.post(`${API_BASE_URL}/api/upload-model`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      if (res.data.url) {
        setUploadStep('Finalizing AR Link...');
        setTimeout(() => {
            setPublicUrl(res.data.url);
            setLoading(false);
        }, 1000);
      }
    } catch (err) {
      setError("Server Timeout. Try again!");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto p-4 md:p-10 space-y-10 bg-[#f8fafc] min-h-screen font-sans">
      
      {/* Dynamic Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pb-10 border-b-2 border-slate-200/60">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
             <div className="bg-blue-600 p-2 rounded-xl text-white"><Zap size={24} fill="currentColor"/></div>
             <h1 className="text-4xl font-black text-slate-900 tracking-tighter">AR STUDIO <span className="text-blue-600">PRO</span></h1>
          </div>
          <p className="text-slate-500 font-medium text-lg">Deploy branded augmented reality experiences instantly.</p>
        </div>
        <div className="flex items-center gap-4 bg-white p-2 rounded-2xl shadow-sm border border-slate-200">
           <div className="px-4 py-2 bg-slate-50 rounded-xl text-xs font-black text-slate-400">STATUS: SYSTEM READY</div>
           <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* --- Sidebar: Design Controls (4 cols) --- */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* Step 1: Model Upload */}
          <section className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100">
            <h3 className="text-xs font-black text-blue-600 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                <Box size={16}/> 01. 3D Asset
            </h3>
            <input type="file" id="glb-up" className="hidden" onChange={handleFileUpload} accept=".glb" />
            <label htmlFor="glb-up" className={`w-full h-44 border-2 border-dashed rounded-[2rem] flex flex-col items-center justify-center transition-all cursor-pointer group ${loading ? 'border-blue-400 bg-blue-50' : 'border-slate-200 bg-slate-50 hover:border-blue-500 hover:bg-white'}`}>
               {loading ? (
                 <div className="text-center space-y-3">
                   <Loader2 className="animate-spin text-blue-600 mx-auto" size={40}/>
                   <p className="text-sm font-bold text-blue-600 uppercase tracking-widest">{uploadStep}</p>
                 </div>
               ) : (
                 <div className="text-center space-y-2">
                   <div className="p-4 bg-white rounded-2xl shadow-sm group-hover:scale-110 transition-transform inline-block">
                      <Upload className="text-blue-500" size={28}/>
                   </div>
                   <p className="font-bold text-slate-700 block">Click to Upload GLB</p>
                   <p className="text-slate-400 text-xs italic underline">Max size: 50MB</p>
                 </div>
               )}
            </label>
          </section>

          {/* Step 2: Branding (Unlocked when uploaded) */}
          <section className={`bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 transition-all duration-500 ${!publicUrl ? 'opacity-40 grayscale pointer-events-none' : 'opacity-100'}`}>
            <h3 className="text-xs font-black text-blue-600 uppercase tracking-[0.2em] mb-8 flex items-center gap-2">
                <Palette size={16}/> 02. Design System
            </h3>
            
            <div className="space-y-8">
              {/* Colors */}
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-3">
                    <label className="text-xs font-bold text-slate-500 uppercase ml-1">QR Pattern</label>
                    <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-2xl border border-slate-100">
                        <input type="color" value={qrColor} onChange={(e)=>setQrColor(e.target.value)} className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border-none" />
                        <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">{qrColor}</span>
                    </div>
                </div>
                <div className="space-y-3">
                    <label className="text-xs font-bold text-slate-500 uppercase ml-1">QR Canvas</label>
                    <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-2xl border border-slate-100">
                        <input type="color" value={qrBg} onChange={(e)=>setQrBg(e.target.value)} className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border-none" />
                        <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">{qrBg}</span>
                    </div>
                </div>
              </div>

              {/* Logo Upload (Manual) */}
              <div className="space-y-4">
                <label className="text-xs font-bold text-slate-500 uppercase ml-1 flex justify-between">
                    <span>Center Branding Logo</span>
                    {logoUrl && <button onClick={()=>setLogoUrl('')} className="text-red-400 hover:underline">Clear</button>}
                </label>
                <div className="flex gap-4">
                    <input type="file" id="logo-up" className="hidden" onChange={handleLogoUpload} accept="image/*" />
                    <label htmlFor="logo-up" className="flex-1 p-4 border-2 border-dashed border-slate-200 rounded-2xl flex items-center justify-center gap-3 cursor-pointer hover:bg-slate-50 transition-colors">
                        <ImageIcon size={20} className="text-slate-400"/>
                        <span className="text-sm font-bold text-slate-600">Upload Logo</span>
                    </label>
                </div>
                <p className="text-[10px] text-slate-400 text-center uppercase font-bold tracking-tighter">OR PASTE URL BELOW</p>
                <input 
                    type="text" 
                    placeholder="https://brand.com/logo.png"
                    className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-medium focus:ring-4 ring-blue-500/10 outline-none transition-all"
                    value={logoUrl.startsWith('data:') ? '' : logoUrl}
                    onChange={(e)=>setLogoUrl(e.target.value)}
                />
              </div>
            </div>
          </section>
        </div>

        {/* --- Main: Visualization Hub (8 cols) --- */}
        <div className="lg:col-span-8">
            <div className="bg-[#0f172a] rounded-[3.5rem] h-full min-h-[650px] flex flex-col items-center justify-center shadow-2xl relative overflow-hidden group">
                
                {/* Visual Flair */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none transition-opacity group-hover:opacity-40"></div>
                <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-indigo-600/10 rounded-full blur-[80px] pointer-events-none"></div>

                {publicUrl ? (
                    <div className="w-full h-full p-8 md:p-16 flex flex-col lg:flex-row gap-12 items-center z-10 animate-in fade-in zoom-in duration-500">
                        
                        {/* 1. Branded QR Output */}
                        <div className="space-y-8 flex flex-col items-center">
                            <div className="relative p-2 bg-gradient-to-br from-white/20 to-white/5 rounded-[3.5rem] backdrop-blur-xl border border-white/10 shadow-2xl">
                                <div className="bg-white p-8 rounded-[3rem] shadow-inner relative overflow-hidden">
                                    <QRCodeCanvas 
                                        value={getARViewLink()} 
                                        size={260} 
                                        fgColor={qrColor}
                                        bgColor={qrBg}
                                        level="H"
                                        imageSettings={logoUrl ? {
                                            src: logoUrl,
                                            height: 50,
                                            width: 50,
                                            excavate: true,
                                        } : null}
                                    />
                                </div>
                                {/* Scan Badge */}
                                <div className="absolute -top-4 -right-4 bg-blue-600 text-white p-4 rounded-full shadow-xl shadow-blue-900/40 rotate-12 flex items-center justify-center">
                                    <Smartphone size={24}/>
                                </div>
                            </div>
                            
                            <button 
                                onClick={() => {navigator.clipboard.writeText(getARViewLink()); alert("Link Secured to Clipboard!")}}
                                className="group flex items-center gap-3 bg-white/10 hover:bg-white text-white hover:text-slate-900 px-8 py-4 rounded-2xl transition-all font-bold text-sm shadow-xl"
                            >
                                <Share2 size={18} className="group-hover:scale-110 transition-transform"/>
                                COPY DEPLOYMENT LINK
                            </button>
                        </div>

                        {/* 2. Pro Viewport */}
                        <div className="flex-1 w-full h-[500px] rounded-[3.5rem] border border-white/10 bg-gradient-to-b from-white/5 to-transparent relative shadow-2xl overflow-hidden group/viewer">
                            <div className="absolute top-6 left-6 z-10 bg-blue-600/20 backdrop-blur-xl text-blue-300 px-4 py-2 rounded-full text-[10px] font-black tracking-widest border border-blue-500/20 uppercase">
                                Interactive 3D Preview
                            </div>
                            <div className="absolute bottom-6 right-6 z-10 text-white/20 group-hover/viewer:text-white/40 transition-colors">
                                <MousePointer2 size={24}/>
                            </div>
                            <model-viewer 
                                src={modelUrl} 
                                auto-rotate 
                                camera-controls 
                                shadow-intensity="2"
                                environment-image="neutral"
                                exposure="1.2"
                                style={{width:'100%', height:'100%'}}
                            />
                        </div>
                    </div>
                ) : (
                    <div className="text-center space-y-8 z-10 animate-in fade-in duration-1000">
                        <div className="relative inline-block">
                           <div className="absolute inset-0 bg-blue-500 blur-[40px] opacity-20 animate-pulse"></div>
                           <div className="relative bg-white/5 border border-white/10 p-12 rounded-[3rem] backdrop-blur-md">
                              <Box size={80} className="text-white/20 mx-auto" strokeWidth={1}/>
                           </div>
                        </div>
                        <div className="space-y-3">
                            <h3 className="text-3xl font-black text-white uppercase tracking-tighter">Waiting for Asset</h3>
                            <p className="text-slate-500 font-medium max-w-sm mx-auto leading-relaxed">
                                Upload a GLB file to unlock the Branding Suite and generate your custom AR gateway.
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>

      </div>
    </div>
  );
};

export default ArGenerator;