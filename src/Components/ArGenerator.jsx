import React, { useState, useRef } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { Upload, Box, Smartphone, Download, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import axios from 'axios';

const ArGenerator = () => {
  const [modelUrl, setModelUrl] = useState(''); // Laptop preview (Blob)
  const [publicUrl, setPublicUrl] = useState(''); // Phone scan (Cloudinary Link)
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const qrRef = useRef();

  // 🌍 APNA VERCEL URL YAHA DALO
  // Agar backend aur frontend ek hi project mein hain toh sirf "/" use karein
  const API_BASE_URL = "https://ar-admin-pannel.vercel.app"; 

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check if it's a GLB file
    if (!file.name.endsWith('.glb')) {
      setError("Please upload a valid .glb file.");
      return;
    }

    // 1. Laptop par foran preview dikhane ke liye
    setModelUrl(URL.createObjectURL(file));
    setError(null);
    setSuccess(false);
    setPublicUrl('');

    // 2. Cloudinary par upload karne ke liye backend ko bhejien
    setLoading(true);
    const formData = new FormData();
    formData.append('model', file);

    try {
      const res = await axios.post(`${API_BASE_URL}/api/upload-model`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res.data.url) {
        setPublicUrl(res.data.url); // Cloudinary link mil gaya
        setSuccess(true);
        console.log("✅ Live AR Link:", res.data.url);
      }
    } catch (err) {
      console.error("Upload Error:", err);
      setError("Server connection failed! Check if Vercel backend is live.");
    } finally {
      setLoading(false);
    }
  };

  const downloadQR = () => {
    const canvas = qrRef.current.querySelector('canvas');
    const link = document.createElement('a');
    link.href = canvas.toDataURL();
    link.download = 'ar-model-qr.png';
    link.click();
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-10 animate-in fade-in duration-500">
      <header className="space-y-2">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">AR Studio Pro</h1>
        <p className="text-slate-500 font-medium">Upload models to generate a permanent AR QR code.</p>
      </header>

      {/* Error & Success Messages */}
      {error && (
        <div className="bg-red-50 border border-red-200 p-4 rounded-2xl flex items-center gap-3 text-red-700 font-bold">
          <AlertCircle size={20} /> {error}
        </div>
      )}
      {success && (
        <div className="bg-green-50 border border-green-200 p-4 rounded-2xl flex items-center gap-3 text-green-700 font-bold">
          <CheckCircle2 size={20} /> Model uploaded successfully! Scan QR below.
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left Side: Upload Section */}
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 block">1. Step: Upload Model</label>
            <label className="flex flex-col items-center justify-center w-full h-72 bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2rem] cursor-pointer hover:bg-blue-50 transition-all group relative overflow-hidden">
              {loading ? (
                <div className="flex flex-col items-center z-10">
                  <Loader2 className="animate-spin text-blue-600 mb-4" size={48} />
                  <span className="font-black text-blue-600 tracking-widest uppercase">Uploading to Cloud...</span>
                </div>
              ) : (
                <>
                  <Upload className="text-slate-300 group-hover:text-blue-500 mb-4 transition-colors" size={48} />
                  <span className="text-sm font-bold text-slate-500">Select .glb 3D Model</span>
                </>
              )}
              <input type="file" className="hidden" onChange={handleFileUpload} accept=".glb" disabled={loading} />
            </label>
          </div>
        </div>

        {/* Right Side: Preview & QR */}
        <div className="bg-slate-900 rounded-[3rem] p-8 flex flex-col items-center justify-center text-white shadow-2xl min-h-[550px] relative">
          {modelUrl ? (
            <div className="w-full h-full flex flex-col space-y-6">
              {/* 3D Viewer */}
              <div className="flex-1 bg-white/5 rounded-[2rem] overflow-hidden border border-white/10 min-h-[300px]">
                <model-viewer
                  src={modelUrl}
                  ar
                  camera-controls
                  auto-rotate
                  shadow-intensity="1"
                  style={{ width: '100%', height: '100%' }}
                />
              </div>

              {/* QR Code Card (Only shows after Cloudinary upload) */}
              {publicUrl && (
                <div className="bg-white p-6 rounded-[2.5rem] flex flex-col items-center space-y-4 animate-in zoom-in duration-300">
                  <div className="flex items-center gap-2 text-slate-900 font-black text-sm uppercase">
                    <Smartphone size={18} className="text-blue-600" /> View in your space
                  </div>
                  <div ref={qrRef} className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                    <QRCodeCanvas value={publicUrl} size={150} level="H" />
                  </div>
                  <button 
                    onClick={downloadQR}
                    className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-blue-600 transition-colors"
                  >
                    <Download size={14} /> Download QR Code
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center opacity-20 space-y-4">
              <Box size={100} strokeWidth={1} />
              <p className="font-bold uppercase tracking-widest text-sm">No Model Selected</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ArGenerator;