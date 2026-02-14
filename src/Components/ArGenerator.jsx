import React, { useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { Upload, Smartphone, Loader2, AlertCircle, Box, CheckCircle2, Palette, Image as ImageIcon, Zap, Info, Share2 } from 'lucide-react';
import axios from 'axios';
import '@google/model-viewer';

const ArGenerator = () => {
  const [modelUrl, setModelUrl] = useState('');
  const [publicUrl, setPublicUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploadStep, setUploadStep] = useState('');
  const [error, setError] = useState(null);

  // --- BRANDING STATES ---
  const [qrColor, setQrColor] = useState('#000000');
  const [qrBg, setQrBg] = useState('#ffffff');
  const [logoUrl, setLogoUrl] = useState(''); // Logo link ya base64

  const API_BASE_URL = "http://localhost:5000"; 

  const getARViewLink = () => {
    if (!publicUrl) return '';
    return `${window.location.origin}/view?model=${encodeURIComponent(publicUrl)}`;
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
    setUploadStep('Analyzing 3D Mesh...');

    const formData = new FormData();
    formData.append('model', file); 

    try {
      setUploadStep('Optimizing for Mobile...');
      const res = await axios.post(`${API_BASE_URL}/api/upload-model`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      if (res.data.url) {
        setUploadStep('Ready for Branding...');
        setTimeout(() => {
            setPublicUrl(res.data.url);
            setLoading(false);
        }, 1000);
      }
    } catch (err) {
      setError("Upload failed. Check Server!");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8 animate-in fade-in duration-700 bg-[#fbfcfd]">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200 pb-8">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">Enterprise <span className="text-blue-600">AR</span> Hub</h1>
          <p className="text-slate-500 font-medium">Professional AR asset deployment with custom brand identity.</p>
        </div>
        <div className="flex gap-3">
            <div className="bg-slate-900 text-white px-5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 shadow-xl">
               <Zap size={14} className="text-yellow-400 fill-yellow-400"/> PREMIUM VERSION
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Controls */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* 1. Upload Section */}
          <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm transition-all hover:shadow-md">
            <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                <Upload size={14}/> 01. Asset Upload
            </h2>
            <input type="file" id="glb-up" className="hidden" onChange={handleFileUpload} accept=".glb" />
            <label htmlFor="glb-up" className={`w-full h-40 border-2 border-dashed rounded-[1.5rem] flex flex-col items-center justify-center transition-all cursor-pointer ${loading ? 'border-blue-400 bg-blue-50' : 'border-slate-100 bg-slate-50 hover:border-blue-500 hover:bg-white'}`}>
               {loading ? (
                 <div className="flex flex-col items-center gap-3">
                   <Loader2 className="animate-spin text-blue-600" size={32}/>
                   <span className="text-sm font-bold text-blue-600">{uploadStep}</span>
                 </div>
               ) : (
                 <div className="flex flex-col items-center gap-2">
                   <Box className="text-slate-300" size={32}/>
                   <span className="font-bold text-slate-500 text-sm tracking-tight">Select 3D Model (.glb)</span>
                 </div>
               )}
            </label>
          </div>

          {/* 2. Customization Section */}
          <div className={`bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm transition-all ${!publicUrl && 'opacity-50 pointer-events-none'}`}>
            <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                <Palette size={14}/> 02. Brand Identity
            </h2>
            
            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">QR Color</label>
                    <input type="color" value={qrColor} onChange={(e)=>setQrColor(e.target.value)} className="w-full h-10 rounded-lg cursor-pointer border-none" />
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">QR Background</label>
                    <input type="color" value={qrBg} onChange={(e)=>setQrBg(e.target.value)} className="w-full h-10 rounded-lg cursor-pointer border-none" />
                </div>
              </div>

              <div className="space-y-2 text-left">
                <label className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
                    <ImageIcon size={10}/> Company Logo (URL)
                </label>
                <input 
                    type="text" 
                    placeholder="https://logo-link.png"
                    className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-medium focus:ring-2 ring-blue-500 outline-none"
                    onChange={(e)=>setLogoUrl(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Preview Hub */}
        <div className="lg:col-span-8">
            <div className="bg-slate-900 rounded-[3rem] p-10 min-h-[600px] flex flex-col items-center justify-center shadow-2xl relative overflow-hidden">
                {/* Background Decor */}
                <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                    <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-blue-600 rounded-full blur-[120px]"></div>
                </div>

                {publicUrl ? (
                    <div className="w-full flex flex-col md:flex-row gap-12 items-center z-10 animate-in zoom-in duration-500">
                        {/* Custom QR Canvas */}
                        <div className="flex flex-col items-center group">
                            <div className="bg-white p-6 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] relative transition-transform hover:scale-105">
                                <QRCodeCanvas 
                                    value={getARViewLink()} 
                                    size={240} 
                                    fgColor={qrColor}
                                    bgColor={qrBg}
                                    level="H"
                                    imageSettings={logoUrl ? {
                                        src: logoUrl,
                                        height: 40,
                                        width: 40,
                                        excavate: true,
                                    } : null}
                                />
                                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] font-black px-4 py-1 rounded-full whitespace-nowrap shadow-lg">
                                    LIVE EXPERIENCE READY
                                </div>
                            </div>
                            <button 
                                onClick={() => {navigator.clipboard.writeText(getARViewLink()); alert("Link Copied!")}}
                                className="mt-10 flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-bold"
                            >
                                <Share2 size={16}/> Copy Deployment Link
                            </button>
                        </div>

                        {/* 3D Preview */}
                        <div className="flex-1 w-full h-[400px] bg-white/5 backdrop-blur-sm rounded-[2.5rem] border border-white/10 overflow-hidden relative shadow-inner">
                            <model-viewer 
                                src={modelUrl} 
                                auto-rotate 
                                camera-controls 
                                style={{width:'100%', height:'100%'}}
                            />
                        </div>
                    </div>
                ) : (
                    <div className="text-center space-y-4 opacity-30 z-10">
                        <div className="inline-block p-10 border-4 border-dashed border-white/10 rounded-full mb-4">
                            <Smartphone size={60} className="text-white"/>
                        </div>
                        <h3 className="text-xl font-black text-white uppercase tracking-tighter">System Idle</h3>
                        <p className="text-slate-400 text-sm max-w-xs mx-auto">Upload a 3D asset to generate a branded AR gateway.</p>
                    </div>
                )}
            </div>
        </div>

      </div>
    </div>
  );
};

export default ArGenerator;