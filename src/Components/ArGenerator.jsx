import React, { useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { Upload, Smartphone, Loader2, AlertCircle, Box, CheckCircle2, Copy, Zap, Info } from 'lucide-react';
import axios from 'axios';
import '@google/model-viewer';

const ArGenerator = () => {
  const [modelUrl, setModelUrl] = useState('');
  const [publicUrl, setPublicUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploadStep, setUploadStep] = useState('');
  const [error, setError] = useState(null);

  const API_BASE_URL = "http://localhost:5000"; 

  const getARViewLink = () => {
    if (!publicUrl) return '';
    return `${window.location.origin}/view?model=${encodeURIComponent(publicUrl)}`;
  };

  const copyToNotion = () => {
    navigator.clipboard.writeText(getARViewLink());
    // Ek toast ya alert dikhane ke liye
    alert("🚀 Notion Ready Link Copied!");
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
    setUploadStep('Preparing Asset...');

    const formData = new FormData();
    formData.append('model', file); 

    try {
      setUploadStep('Syncing to Cloudinary...');
      const res = await axios.post(`${API_BASE_URL}/api/upload-model`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      if (res.data.url) {
        setUploadStep('Generating QR Experience...');
        setTimeout(() => {
            setPublicUrl(res.data.url);
            setLoading(false);
        }, 1000);
      }
    } catch (err) {
      setError("Upload failed. Check connection!");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8 animate-in fade-in duration-500">
      {/* Header with Badge */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200 pb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">AR ASSET HUB</h1>
          <p className="text-slate-500 font-medium">Generate instant AR previews for your Notion workspace.</p>
        </div>
        <div className="bg-blue-600 text-white px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 shadow-lg shadow-blue-200">
          <Zap size={14} fill="white"/> v2.0 LIVE ON VERCEL
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Action Area */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm relative overflow-hidden group">
            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                <Box size={16}/> Configuration
            </h2>
            
            <input type="file" id="glb-up" className="hidden" onChange={handleFileUpload} accept=".glb" />
            <label htmlFor="glb-up" className={`w-full h-48 border-2 border-dashed rounded-[1.5rem] flex flex-col items-center justify-center transition-all cursor-pointer ${loading ? 'border-blue-400 bg-blue-50' : 'border-slate-200 hover:border-blue-500'}`}>
               {loading ? (
                 <div className="flex flex-col items-center gap-3">
                   <Loader2 className="animate-spin text-blue-600" size={32}/>
                   <span className="text-sm font-bold text-blue-600 animate-pulse">{uploadStep}</span>
                 </div>
               ) : (
                 <div className="flex flex-col items-center gap-2">
                   <div className="p-4 bg-slate-100 rounded-full text-slate-500 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                     <Upload size={24}/>
                   </div>
                   <span className="font-bold text-slate-600">Upload .GLB File</span>
                 </div>
               )}
            </label>

            {publicUrl && (
              <div className="mt-6 space-y-3">
                <button 
                  onClick={copyToNotion}
                  className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold flex items-center justify-center gap-3 hover:scale-[1.02] transition-transform shadow-xl shadow-slate-200"
                >
                  <img src="https://upload.wikimedia.org/wikipedia/commons/4/45/Notion_app_logo.png" className="w-5 h-5 invert" alt=""/>
                  Copy Notion Embed
                </button>
                <div className="flex items-center gap-2 justify-center text-xs font-bold text-emerald-600 bg-emerald-50 py-2 rounded-lg">
                    <CheckCircle2 size={14}/> CLOUD SYNC ACTIVE
                </div>
              </div>
            )}
          </div>

          {/* Model Info Card */}
          {publicUrl && (
            <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-200 animate-in slide-in-from-bottom-4 duration-500">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Info size={14}/> Asset Info
                </h3>
                <div className="space-y-3">
                    <div className="flex justify-between text-sm"><span className="text-slate-500">Format</span> <span className="font-bold text-slate-700 underline decoration-blue-500">Binary GLB</span></div>
                    <div className="flex justify-between text-sm"><span className="text-slate-500">Optimized</span> <span className="font-bold text-slate-700">Yes</span></div>
                    <div className="flex justify-between text-sm"><span className="text-slate-500">AR Support</span> <span className="font-bold text-slate-700">Universal</span></div>
                </div>
            </div>
          )}
        </div>

        {/* Right: Preview Area */}
        <div className="lg:col-span-8">
           <div className="bg-slate-900 rounded-[2.5rem] p-8 h-full min-h-[500px] flex flex-col md:flex-row gap-8 items-center shadow-2xl shadow-slate-300">
              {publicUrl ? (
                <>
                  <div className="bg-white p-6 rounded-[2rem] shadow-2xl">
                    <QRCodeCanvas value={getARViewLink()} size={200} />
                    <p className="mt-4 text-center text-[10px] font-black text-slate-400 tracking-[0.2em]">SCAN FOR AR</p>
                  </div>
                  <div className="flex-1 w-full h-full rounded-[2rem] overflow-hidden border border-white/10 bg-slate-800/50">
                     <model-viewer 
                        src={modelUrl} 
                        auto-rotate 
                        camera-controls 
                        style={{width:'100%', height:'100%'}}
                        className="ar-viewer"
                     />
                  </div>
                </>
              ) : (
                <div className="w-full flex flex-col items-center justify-center text-slate-600 gap-4">
                  <div className="p-8 border-2 border-dashed border-slate-800 rounded-full">
                    <Smartphone size={48} className="opacity-20"/>
                  </div>
                  <p className="font-bold tracking-widest text-xs opacity-40">WAITING FOR ASSET DEPLOYMENT</p>
                </div>
              )}
           </div>
        </div>
      </div>
    </div>
  );
};

export default ArGenerator;