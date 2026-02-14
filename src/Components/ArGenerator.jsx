import React, { useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { Upload, Smartphone, Loader2, AlertCircle, Box, CheckCircle2, Share2, Scan } from 'lucide-react';
import axios from 'axios';
import '@google/model-viewer';

const ArGenerator = () => {
  const [modelUrl, setModelUrl] = useState('');
  const [publicUrl, setPublicUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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

    const formData = new FormData();
    formData.append('model', file); 

    try {
      const res = await axios.post(`${API_BASE_URL}/api/upload-model`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      if (res.data.url) {
        setPublicUrl(res.data.url);
      }
    } catch (err) {
      console.error("❌ Full Error Details:", err.response?.data || err.message);
      setError(err.response?.data?.error || "Upload failed. Check Backend Terminal!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8 bg-slate-50 text-slate-900 animate-in fade-in duration-700">
      {/* Header Section */}
      <div className="max-w-6xl mx-auto mb-10">
        <h1 className="text-4xl font-black tracking-tight text-slate-900 mb-2">
          AR <span className="text-blue-600">Experience</span> Generator
        </h1>
        <p className="text-slate-500 font-medium">Transform your 3D models into interactive AR reality in seconds.</p>
      </div>

      {error && (
        <div className="max-w-6xl mx-auto mb-6 bg-red-50 border border-red-200 text-red-700 p-4 rounded-2xl flex items-center gap-3 animate-bounce">
          <AlertCircle size={20}/> {error}
        </div>
      )}
      
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* --- LEFT: UPLOAD PANEL (40%) --- */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
               <Box size={120} />
            </div>
            
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <span className="bg-blue-100 text-blue-600 p-2 rounded-lg"><Upload size={18}/></span>
              Step 1: Upload Asset
            </h2>

            <input type="file" id="glb-up" className="hidden" onChange={handleFileUpload} accept=".glb" />
            <label 
              htmlFor="glb-up" 
              className={`relative cursor-pointer group flex flex-col items-center justify-center border-2 border-dashed rounded-[2rem] p-12 transition-all duration-300 ${
                loading ? 'border-blue-400 bg-blue-50/50' : 'border-slate-200 hover:border-blue-400 hover:bg-slate-50'
              }`}
            >
              <div className={`p-6 rounded-full transition-transform group-hover:scale-110 ${loading ? 'bg-blue-100' : 'bg-slate-100'}`}>
                {loading ? <Loader2 className="animate-spin text-blue-600" size={40}/> : <Box className="text-slate-400 group-hover:text-blue-500" size={40}/>}
              </div>
              <span className="mt-6 font-bold text-slate-700 text-lg">
                {loading ? "Processing..." : "Drop .GLB here"}
              </span>
              <p className="text-slate-400 text-sm mt-1 text-center">Standard 3D Binary format only</p>
            </label>

            {publicUrl && (
              <div className="mt-6 p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center gap-3 text-emerald-700">
                <CheckCircle2 size={20} className="shrink-0"/>
                <span className="text-sm font-semibold truncate">Successfully hosted on Cloudinary</span>
              </div>
            )}
          </div>

          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-8 rounded-[2.5rem] text-white shadow-lg shadow-blue-200 relative overflow-hidden">
             <div className="relative z-10">
                <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                  <Share2 size={18}/> Deployment Ready
                </h3>
                <p className="text-blue-100 text-sm leading-relaxed">
                  Your model will be served via a high-speed CDN. Scan the code to view it instantly on iOS or Android devices using WebXR.
                </p>
             </div>
             <div className="absolute -bottom-4 -right-4 opacity-20 rotate-12">
                <Scan size={140}/>
             </div>
          </div>
        </div>

        {/* --- RIGHT: PREVIEW PANEL (60%) --- */}
        <div className="lg:col-span-7">
          <div className="bg-slate-900 rounded-[3rem] p-2 shadow-2xl shadow-slate-900/40 relative h-full flex flex-col min-h-[600px]">
            
            {publicUrl ? (
              <div className="flex flex-col h-full p-6 md:p-10">
                {/* QR Section */}
                <div className="flex flex-col md:flex-row items-center gap-8 mb-10">
                  <div className="bg-white p-5 rounded-[2rem] shadow-2xl transform hover:scale-105 transition-transform">
                    <QRCodeCanvas 
                      value={getARViewLink()} 
                      size={200} 
                      level="H"
                      includeMargin={true}
                      className="rounded-xl"
                    />
                  </div>
                  <div className="text-center md:text-left">
                    <div className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3">
                      <Smartphone size={14}/> Live Preview
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2 italic">Scan to Visualize</h2>
                    <p className="text-slate-400 text-sm max-w-xs">
                      Aim your phone camera at this code to launch the AR experience directly in your space.
                    </p>
                  </div>
                </div>

                {/* Model Viewer Container */}
                <div className="flex-1 bg-slate-800/50 rounded-[2rem] border border-white/5 overflow-hidden relative group">
                  <div className="absolute top-4 left-4 z-10 bg-black/40 backdrop-blur-md text-white/70 px-4 py-2 rounded-full text-xs font-medium border border-white/10">
                    Interact: 360° View Enabled
                  </div>
                  <model-viewer 
                    src={modelUrl} 
                    auto-rotate 
                    camera-controls 
                    interaction-prompt="none"
                    style={{width:'100%', height:'100%', backgroundColor: 'transparent'}} 
                    className="cursor-grab active:cursor-grabbing"
                  />
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-white/20 p-20 text-center">
                <div className="mb-6 p-10 border-4 border-dashed border-white/5 rounded-full animate-pulse">
                  <Box size={80} />
                </div>
                <h3 className="text-2xl font-black uppercase tracking-tighter">Waiting for Asset</h3>
                <p className="max-w-[250px] mt-2 text-sm text-white/10 font-medium">
                  Once you upload a 3D file, the interactive QR and preview will appear here.
                </p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default ArGenerator;