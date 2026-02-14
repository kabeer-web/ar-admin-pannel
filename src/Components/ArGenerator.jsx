import React, { useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { Upload, Smartphone, Loader2, AlertCircle } from 'lucide-react';
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

    // Local preview ke liye
    setModelUrl(URL.createObjectURL(file));
    setLoading(true);
    setError(null);

    // --- FORM DATA PREPARATION ---
    const formData = new FormData();
    formData.append('model', file); 

    try {
      // --- AXIOS POST CALL WITH HEADERS ---
      const res = await axios.post(`${API_BASE_URL}/api/upload-model`, formData, {
        headers: { 
          "Content-Type": "multipart/form-data" 
        }
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
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-xl flex gap-2">
          <AlertCircle /> {error}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Side: Upload */}
        <div className="bg-white p-10 border-2 border-dashed rounded-3xl flex flex-col items-center justify-center border-slate-200">
          <input type="file" id="glb-up" className="hidden" onChange={handleFileUpload} accept=".glb" />
          <label htmlFor="glb-up" className="cursor-pointer flex flex-col items-center">
            {loading ? <Loader2 className="animate-spin text-blue-500" size={48}/> : <Upload className="text-slate-400" size={48}/>}
            <span className="mt-4 font-bold text-slate-600 uppercase tracking-wide">
              {loading ? "Uploading to Cloudinary..." : "Upload .GLB Model"}
            </span>
          </label>
        </div>

        {/* Right Side: QR & Model Preview */}
        <div className="bg-slate-900 p-8 rounded-3xl flex flex-col items-center text-white min-h-[400px] shadow-2xl transition-all">
          {publicUrl ? (
            <div className="space-y-6 text-center w-full animate-in fade-in zoom-in duration-300">
              <div className="bg-white p-4 rounded-2xl inline-block shadow-lg">
                <QRCodeCanvas value={getARViewLink()} size={180} />
              </div>
              <p className="font-bold flex items-center gap-2 justify-center text-blue-400">
                <Smartphone size={20}/> SCAN TO VIEW IN YOUR ROOM
              </p>
              <div className="h-48 w-full bg-white/5 rounded-xl overflow-hidden border border-white/10">
                <model-viewer 
                  src={modelUrl} 
                  auto-rotate 
                  camera-controls 
                  style={{width:'100%', height:'100%'}} 
                />
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full opacity-30">
              <Smartphone size={60} />
              <p className="mt-4 font-medium uppercase tracking-widest text-sm">Waiting for asset...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ArGenerator;