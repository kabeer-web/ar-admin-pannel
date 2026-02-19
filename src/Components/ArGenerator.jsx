import React, { useState, useRef } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { Upload, Smartphone, Activity, Cpu, Palette, Box } from 'lucide-react';
import axios from 'axios';
import '@google/model-viewer';

const ArGenerator = () => {
  const [modelUrl, setModelUrl] = useState(null);
  const [publicUrl, setPublicUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [savedId, setSavedId] = useState(null);
  const [exposure, setExposure] = useState(1);
  const [baseColor, setBaseColor] = useState('#ffffff');
  const modelViewerRef = useRef();

  const API_BASE_URL = "https://ar-admin-pannel.vercel.app/api"; // Verify this URL

  const handleColorChange = (color) => {
    setBaseColor(color);
    const viewer = modelViewerRef.current;
    if (viewer?.model?.materials) {
      const r = parseInt(color.slice(1, 3), 16) / 255;
      const g = parseInt(color.slice(3, 5), 16) / 255;
      const b = parseInt(color.slice(5, 7), 16) / 255;
      viewer.model.materials.forEach(mat => {
        mat.pbrMetallicRoughness.setBaseColorFactor([r, g, b, 1]);
      });
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setModelUrl(URL.createObjectURL(file));
    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', "ml_default");
    try {
      const res = await axios.post(`https://api.cloudinary.com/v1_1/doa5h9wwi/auto/upload`, formData);
      setPublicUrl(res.data.secure_url);
      alert("GLB Uploaded Successfully!");
    } catch (err) {
      alert("Upload Failed");
    } finally { setLoading(false); }
  };

  const saveMatrixConfig = async () => {
    if (!publicUrl) return alert("Upload GLB first!");
    setSyncing(true);
    try {
      const res = await axios.post(`${API_BASE_URL}/save-config`, {
        publicUrl,
        baseColor,
        exposure,
        ownerId: "admin_1"
      });
      if (res.data.success) {
        setSavedId(res.data.modelId);
        alert("SYNC COMPLETE! Use the new QR.");
      }
    } catch (err) { alert("Sync Error"); }
    finally { setSyncing(false); }
  };

  return (
    <div className="min-h-screen bg-[#010604] p-8 text-emerald-50">
      <header className="flex justify-between items-center bg-black/50 p-6 rounded-3xl border border-emerald-500/20 mb-8">
        <div className="flex items-center gap-4"><Cpu className="text-emerald-500"/><h1 className="text-xl font-bold uppercase tracking-tighter text-white">AR Matrix Admin</h1></div>
        <label className="bg-emerald-500 text-black px-6 py-2 rounded-xl font-bold cursor-pointer uppercase text-xs">
          <input type="file" className="hidden" onChange={handleFileUpload} />
          {loading ? "Injecting..." : "Upload GLB"}
        </label>
      </header>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 bg-black/40 rounded-[3rem] h-[500px] border border-emerald-500/10 relative overflow-hidden">
          {modelUrl && (
            <>
              <model-viewer ref={modelViewerRef} src={modelUrl} camera-controls exposure={exposure} style={{width:'100%', height:'100%'}} />
              <div className="absolute bottom-6 left-6 right-6 bg-black/80 p-4 rounded-2xl flex items-center justify-between border border-emerald-500/10">
                <input type="color" value={baseColor} onChange={(e) => handleColorChange(e.target.value)} className="w-10 h-10 cursor-pointer" />
                <input type="range" min="0" max="3" step="0.1" value={exposure} onChange={(e) => setExposure(parseFloat(e.target.value))} className="w-1/2 accent-emerald-500" />
                <button onClick={saveMatrixConfig} className="bg-emerald-500 text-black px-6 py-2 rounded-xl font-bold text-[10px] uppercase">
                  {syncing ? "Syncing..." : "Sync Matrix"}
                </button>
              </div>
            </>
          )}
        </div>
        <div className="lg:col-span-4 bg-[#05110d] rounded-[3rem] p-10 flex flex-col items-center justify-center border border-emerald-500/10">
          {savedId ? (
            <div className="bg-white p-4 rounded-2xl">
              <QRCodeCanvas value={`${window.location.origin}/view?id=${savedId}`} size={200} />
            </div>
          ) : <Smartphone size={80} className="opacity-10" />}
        </div>
      </div>
    </div>
  );
};

export default ArGenerator;