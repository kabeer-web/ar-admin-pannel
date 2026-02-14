import React, { useState, useRef } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { Upload, Smartphone, Box, Download, Activity, Cpu } from 'lucide-react';
import axios from 'axios';
import '@google/model-viewer';

const ArGenerator = () => {
  const [modelUrl, setModelUrl] = useState(null); // For local preview
  const [publicUrl, setPublicUrl] = useState(''); // Cloudinary URL
  const [loading, setLoading] = useState(false);
  const qrRef = useRef();

  // IMPORTANT: Replace with the IP address printed in your backend terminal
  const API_BASE_URL = "http://192.168.X.X:5000"; 

  const getARViewLink = () => {
    if (!publicUrl) return '';
    // This points the QR code to your React App's view page + the model link
    const frontendBase = window.location.origin; 
    return `${frontendBase}/view?model=${encodeURIComponent(publicUrl)}`;
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !file.name.endsWith('.glb')) {
      alert("Please upload a .glb file");
      return;
    }
    
    setModelUrl(URL.createObjectURL(file));
    setLoading(true);
    
    const formData = new FormData();
    formData.append('model', file); 
    
    try {
      const res = await axios.post(`${API_BASE_URL}/api/upload-model`, formData);
      if (res.data.url) {
        setPublicUrl(res.data.url);
      }
    } catch (err) { 
      console.error("Upload Error:", err);
      alert("Connection failed! Check if server is running on the correct IP.");
    } finally {
      setLoading(false);
    }
  };

  const downloadQRCode = () => {
    const canvas = qrRef.current.querySelector('canvas');
    const pngUrl = canvas.toDataURL("image/png");
    const downloadLink = document.createElement("a");
    downloadLink.href = pngUrl;
    downloadLink.download = "AR-Code.png";
    downloadLink.click();
  };

  return (
    <div className="w-full min-h-screen bg-[#020806] p-8 text-emerald-50">
      {/* Header section remains same as yours */}
      <header className="flex justify-between items-center bg-[#05110d] p-8 rounded-[2.5rem] border border-emerald-500/10 mb-8">
         <h1 className="text-3xl font-black italic uppercase">CODE GENERATOR <span className="text-emerald-500">AR</span></h1>
         <input type="file" id="glb-up" className="hidden" onChange={handleFileUpload} accept=".glb" />
         <label htmlFor="glb-up" className="cursor-pointer bg-emerald-600 px-6 py-4 rounded-xl font-black text-black flex items-center gap-3 uppercase">
            {loading ? <Activity className="animate-spin" /> : <Upload />}
            {loading ? 'Uploading...' : 'Upload GLB'}
         </label>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Preview Box */}
        <div className="bg-[#030c08] rounded-[3rem] h-[500px] border border-emerald-900/20">
            {modelUrl && <model-viewer src={modelUrl} auto-rotate camera-controls style={{width:'100%', height:'100%'}} />}
        </div>

        {/* QR Box */}
        <div className="bg-[#081511] rounded-[3rem] p-10 flex flex-col items-center justify-center">
            {publicUrl ? (
              <div ref={qrRef} className="flex flex-col items-center gap-6">
                <div className="bg-white p-4 rounded-xl">
                  <QRCodeCanvas value={getARViewLink()} size={250} level="H" />
                </div>
                <button onClick={downloadQRCode} className="bg-emerald-600 px-8 py-3 rounded-lg text-black font-bold uppercase">
                  Download QR
                </button>
              </div>
            ) : <p className="opacity-30">Upload a model to generate QR</p>}
        </div>
      </div>
    </div>
  );
};

export default ArGenerator;
