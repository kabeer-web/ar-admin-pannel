import React, { useState, useRef } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { Upload, Smartphone, Loader2, Box, Palette, Image as ImageIcon, Zap, Share2, Download, MousePointer2, Expand } from 'lucide-react';
import axios from 'axios';
import '@google/model-viewer';

const ArGenerator = () => {
  const [modelUrl, setModelUrl] = useState('');
  const [publicUrl, setPublicUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploadStep, setUploadStep] = useState('');
  const qrRef = useRef();

  // --- BRANDING STATES ---
  const [qrColor, setQrColor] = useState('#2563eb');
  const [qrBg, setQrBg] = useState('#ffffff');
  const [logoUrl, setLogoUrl] = useState(''); 

  const API_BASE_URL = "http://localhost:5000"; 

  const getARViewLink = () => {
    if (!publicUrl) return '';
    return `${window.location.origin}/view?model=${encodeURIComponent(publicUrl)}`;
  };

  // --- DOWNLOAD QR AS PNG ---
  const downloadQRCode = () => {
    const canvas = qrRef.current.querySelector('canvas');
    const pngUrl = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
    let downloadLink = document.createElement("a");
    downloadLink.href = pngUrl;
    downloadLink.download = "AR-Experience-QR.png";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

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
    if (!file || !file.name.endsWith('.glb')) return;

    setModelUrl(URL.createObjectURL(file));
    setLoading(true);
    setUploadStep('Analyzing Geometry...');

    const formData = new FormData();
    formData.append('model', file); 

    try {
      setUploadStep('Optimizing Cloud Path...');
      const res = await axios.post(`${API_BASE_URL}/api/upload-model`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      if (res.data.url) {
        setUploadStep('Ready!');
        setPublicUrl(res.data.url);
        setLoading(false);
      }
    } catch (err) {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-[1600px] mx-auto p-4 md:p-6 space-y-6 bg-[#f1f5f9] min-h-screen font-sans">
      
      {/* Header - Compact */}
      <header className="flex justify-between items-center bg-white p-4 rounded-3xl shadow-sm border border-slate-200">
        <div className="flex items-center gap-3">
           <div className="bg-blue-600 p-2 rounded-xl text-white shadow-lg shadow-blue-200"><Zap size={20} fill="currentColor"/></div>
           <h1 className="text-xl font-black text-slate-900 tracking-tighter uppercase">AR Studio <span className="text-blue-600">Pro</span></h1>
        </div>
        <div className="flex items-center gap-4">
           <div className="hidden md:block px-4 py-1.5 bg-slate-100 rounded-full text-[10px] font-black text-slate-500 tracking-widest uppercase">V2.5 Branding Engine</div>
           <input type="file" id="glb-up" className="hidden" onChange={handleFileUpload} accept=".glb" />
           <label htmlFor="glb-up" className="cursor-pointer bg-slate-900 text-white px-6 py-2 rounded-2xl text-sm font-bold hover:bg-blue-600 transition-all flex items-center gap-2">
              <Upload size={16}/> Upload GLB
           </label>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-140px)]">
        
        {/* --- MAIN VIEWPORT (Jaga Barha Di) --- */}
        <div className="flex-[3] bg-[#0f172a] rounded-[2.5rem] relative overflow-hidden shadow-2xl border border-white/5">
            {publicUrl ? (
                <>
                  <div className="absolute top-6 left-6 z-10 flex gap-3">
                    <div className="bg-white/10 backdrop-blur-md border border-white/10 px-4 py-2 rounded-2xl flex items-center gap-2 text-white">
                        <Expand size={14} className="text-blue-400"/>
                        <span className="text-[10px] font-bold uppercase tracking-wider">Immersive Preview</span>
                    </div>
                  </div>
                  <model-viewer 
                      src={modelUrl} 
                      auto-rotate 
                      camera-controls 
                      shadow-intensity="1"
                      environment-image="neutral"
                      style={{width:'100%', height:'100%', '--poster-color': 'transparent'}}
                      className="w-full h-full"
                  />
                  <div className="absolute bottom-6 left-6 text-white/30 flex items-center gap-2 text-[10px] font-bold uppercase">
                      <MousePointer2 size={14}/> Orbit Control Active
                  </div>
                </>
            ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-center p-10 space-y-6">
                    <div className="p-10 bg-white/5 rounded-full border border-white/10 animate-pulse">
                        <Box size={60} className="text-white/20"/>
                    </div>
                    <p className="text-slate-500 font-bold tracking-widest uppercase text-sm">Upload a 3D asset to begin</p>
                </div>
            )}
        </div>

        {/* --- CONTROL PANEL (Sidebar) --- */}
        <div className="flex-1 flex flex-col gap-6 min-w-[380px]">
            
            {/* QR CARD */}
            <div className="bg-white p-6 rounded-[2.5rem] shadow-xl border border-slate-100 flex flex-col items-center justify-center relative">
                {publicUrl ? (
                    <div className="animate-in zoom-in duration-300 w-full space-y-6">
                        <div ref={qrRef} className="bg-slate-50 p-6 rounded-[2rem] flex items-center justify-center border border-slate-100 shadow-inner">
                            <QRCodeCanvas 
                                value={getARViewLink()} 
                                size={200} 
                                fgColor={qrColor}
                                bgColor={qrBg}
                                level="H"
                                imageSettings={logoUrl ? { src: logoUrl, height: 40, width: 40, excavate: true } : null}
                            />
                        </div>
                        <div className="flex gap-2">
                            <button 
                                onClick={downloadQRCode}
                                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-100 transition-all"
                            >
                                <Download size={16}/> DOWNLOAD PNG
                            </button>
                            <button 
                                onClick={() => {navigator.clipboard.writeText(getARViewLink()); alert("Copied!")}}
                                className="p-4 bg-slate-100 rounded-2xl text-slate-600 hover:bg-slate-200 transition-all"
                            >
                                <Share2 size={18}/>
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="h-48 flex flex-col items-center justify-center text-slate-300">
                        <Smartphone size={40} className="mb-2 opacity-20"/>
                        <p className="text-[10px] font-black uppercase tracking-widest">QR Waiting...</p>
                    </div>
                )}
            </div>

            {/* DESIGN SYSTEM CARD */}
            <div className={`bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100 flex-1 space-y-6 ${!publicUrl && 'opacity-40 grayscale pointer-events-none'}`}>
                <h3 className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] flex items-center gap-2">
                    <Palette size={14}/> Design Studio
                </h3>

                <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                            <p className="text-[9px] font-bold text-slate-400 uppercase mb-2">QR Color</p>
                            <input type="color" value={qrColor} onChange={(e)=>setQrColor(e.target.value)} className="w-full h-8 bg-transparent cursor-pointer rounded-lg overflow-hidden border-none" />
                        </div>
                        <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                            <p className="text-[9px] font-bold text-slate-400 uppercase mb-2">Canvas</p>
                            <input type="color" value={qrBg} onChange={(e)=>setQrBg(e.target.value)} className="w-full h-8 bg-transparent cursor-pointer rounded-lg overflow-hidden border-none" />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <p className="text-[9px] font-bold text-slate-400 uppercase ml-1 flex justify-between">
                            <span>Center Branding</span>
                            {logoUrl && <span onClick={()=>setLogoUrl('')} className="text-red-500 cursor-pointer">Remove</span>}
                        </p>
                        <input type="file" id="logo-up" className="hidden" onChange={handleLogoUpload} accept="image/*" />
                        <label htmlFor="logo-up" className="w-full p-4 border-2 border-dashed border-slate-200 rounded-2xl flex items-center gap-3 cursor-pointer hover:bg-slate-50 hover:border-blue-400 transition-all">
                            <ImageIcon size={18} className="text-blue-500"/>
                            <span className="text-xs font-bold text-slate-600">Upload Logo</span>
                        </label>
                        <input 
                            type="text" 
                            placeholder="Paste Logo URL..."
                            className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-[11px] font-medium outline-none focus:ring-2 ring-blue-500/20 transition-all"
                            value={logoUrl.startsWith('data:') ? '' : logoUrl}
                            onChange={(e)=>setLogoUrl(e.target.value)}
                        />
                    </div>
                </div>

                {loading && (
                    <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-2xl border border-blue-100 animate-pulse">
                        <Loader2 className="animate-spin text-blue-600" size={18}/>
                        <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">{uploadStep}</span>
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default ArGenerator;