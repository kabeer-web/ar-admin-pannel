import React, { useState, useRef, useEffect } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { Upload, Smartphone, Activity, Cpu, Box, Trash2, Edit3, Save } from 'lucide-react';
import axios from 'axios';
import '@google/model-viewer';

const ArGenerator = () => {
  const [models, setModels] = useState([]);
  const [currentId, setCurrentId] = useState(null);
  const [modelUrl, setModelUrl] = useState(null);
  const [publicUrl, setPublicUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [exposure, setExposure] = useState(1);
  const [baseColor, setBaseColor] = useState('#ffffff');
  const [showQR, setShowQR] = useState(false);
  
  const modelViewerRef = useRef();
  const API_BASE_URL = "https://ar-admin-pannel.vercel.app/api";

  const fetchModels = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/get-all-models?t=${Date.now()}`);
      setModels(res.data);
    } catch (err) { console.error("Fetch Error"); }
  };

  useEffect(() => { fetchModels(); }, []);

  const applyColorToViewer = (colorValue) => {
    const viewer = modelViewerRef.current;
    if (viewer?.model) {
      const r = parseInt(colorValue.slice(1, 3), 16) / 255;
      const g = parseInt(colorValue.slice(3, 5), 16) / 255;
      const b = parseInt(colorValue.slice(5, 7), 16) / 255;
      viewer.model.materials.forEach(mat => {
        mat.pbrMetallicRoughness.setBaseColorFactor([r, g, b, 1]);
      });
    }
  };

  const saveConfig = async () => {
    if (!publicUrl) return alert("Pehle model upload karein!");
    setSyncing(true);
    
    // Yahan payload ko explicit kiya hai taake MongoDB ko sahi data mile
    const payload = {
      id: currentId,
      publicUrl: publicUrl,
      baseColor: baseColor,
      exposure: exposure
    };

    try {
      const res = await axios.post(`${API_BASE_URL}/save-config`, payload);
      if (res.data.success) {
        const newId = res.data.modelId;
        setCurrentId(newId);
        setShowQR(true); 
        await fetchModels(); // List refresh karo
        alert(currentId ? "MATRIX UPDATED IN DATABASE ✅" : "NEW ASSET DEPLOYED ✅");
      }
    } catch (err) { 
      console.error(err);
      alert("DATABASE SYNC FAILED ❌"); 
    } finally { setSyncing(false); }
  };

  const editModel = (m) => {
    setShowQR(false); 
    setCurrentId(m._id);
    setPublicUrl(m.publicUrl);
    setModelUrl(m.publicUrl);
    setBaseColor(m.baseColor || "#ffffff");
    setExposure(m.exposure || 1);
    // Model viewer ko thoda time do load hone ke liye
    setTimeout(() => applyColorToViewer(m.baseColor || "#ffffff"), 500);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setLoading(true);
    setShowQR(false);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', "ml_default");
    try {
      const res = await axios.post(`https://api.cloudinary.com/v1_1/doa5h9wwi/auto/upload`, formData);
      setPublicUrl(res.data.secure_url);
      setModelUrl(res.data.secure_url);
      setCurrentId(null); // Naya upload hai toh ID reset
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-[#020806] p-6 text-white font-sans">
      <header className="flex justify-between items-center mb-10 bg-emerald-950/20 p-6 rounded-2xl border border-emerald-500/10">
        <div className="flex items-center gap-3"><Cpu className="text-emerald-500 animate-pulse"/><h1 className="text-xl font-black tracking-tighter uppercase">Neural Matrix Admin</h1></div>
        <label className="bg-emerald-500 hover:bg-emerald-400 text-black px-6 py-2 rounded-lg font-bold cursor-pointer transition-all flex items-center gap-2 active:scale-95">
          <Upload size={18}/> <input type="file" className="hidden" onChange={handleFileUpload} /> {loading ? "Uploading..." : "Inject GLB"}
        </label>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
        <div className="lg:col-span-8 bg-black rounded-3xl h-[550px] border border-emerald-500/20 relative shadow-2xl overflow-hidden">
          {modelUrl ? (
            <>
              <model-viewer 
                ref={modelViewerRef} 
                src={modelUrl} 
                camera-controls 
                exposure={exposure} 
                onLoad={() => applyColorToViewer(baseColor)}
                style={{width:'100%', height:'100%'}} 
              />
              <div className="absolute bottom-6 left-6 right-6 bg-black/80 backdrop-blur-md p-5 rounded-2xl border border-white/10 flex items-center gap-6">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] text-emerald-500 font-bold uppercase">Material Tint</span>
                  <input type="color" value={baseColor} onChange={(e) => { setBaseColor(e.target.value); applyColorToViewer(e.target.value); }} className="w-12 h-12 rounded cursor-pointer bg-transparent border-none" />
                </div>
                <div className="flex-1 flex flex-col gap-1">
                  <span className="text-[10px] text-emerald-500 font-bold uppercase">Luminance Trace: {exposure}</span>
                  <input type="range" min="0" max="3" step="0.1" value={exposure} onChange={(e) => setExposure(parseFloat(e.target.value))} className="w-full accent-emerald-500" />
                </div>
                <button onClick={saveConfig} className="bg-emerald-500 text-black px-8 py-3 rounded-xl font-black uppercase text-xs flex items-center gap-2 hover:bg-emerald-400 transition-all active:scale-90">
                  {syncing ? <Activity className="animate-spin"/> : <Save size={16}/>} {currentId ? "Update Matrix" : "Deploy Asset"}
                </button>
              </div>
            </>
          ) : <div className="h-full flex flex-col items-center justify-center opacity-10"><Box size={100}/><p className="mt-4 font-bold tracking-[0.5em]">AWAITING NEURAL INPUT</p></div>}
        </div>

        <div className="lg:col-span-4">
          <div className="bg-emerald-950/10 rounded-3xl p-8 border border-emerald-500/10 flex flex-col items-center justify-center min-h-[550px]">
            {showQR && currentId ? (
              <div className="text-center animate-in fade-in zoom-in duration-500">
                <div className="bg-white p-4 rounded-3xl shadow-[0_0_80px_rgba(16,185,129,0.3)] mb-6">
                  <QRCodeCanvas value={`${window.location.origin}/view?id=${currentId}`} size={250} />
                </div>
                <p className="text-emerald-500 font-black text-sm tracking-widest italic animate-pulse">MATRIX LINK ENCRYPTED</p>
                <p className="text-[10px] opacity-40 mt-2 font-mono">{currentId}</p>
              </div>
            ) : (
              <div className="text-center opacity-20">
                <Smartphone size={80} className="mx-auto mb-4" />
                <p className="text-xs font-bold uppercase tracking-widest leading-loose">Sync with Database <br/> to generate Neural QR</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="border-t border-emerald-500/10 pt-10">
        <h2 className="text-2xl font-black mb-8 italic tracking-tighter text-emerald-500">NEURAL ASSET LIBRARY</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {models.map(m => (
            <div key={m._id} className="bg-emerald-950/5 border border-emerald-500/10 p-6 rounded-2xl hover:border-emerald-500/40 transition-all group relative">
              <div className="flex justify-between items-start mb-6">
                <div className="w-10 h-10 rounded-xl border border-white/10 shadow-lg" style={{backgroundColor: m.baseColor}}></div>
                <div className="flex gap-2">
                  <button onClick={() => editModel(m)} className="p-2 bg-emerald-500/10 hover:bg-emerald-500 text-emerald-500 hover:text-black rounded-lg transition-all"><Edit3 size={16}/></button>
                  <button onClick={() => { if(window.confirm("Purge Asset?")) axios.delete(`${API_BASE_URL}/delete-model/${m._id}`).then(fetchModels) }} className="p-2 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-lg transition-all"><Trash2 size={16}/></button>
                </div>
              </div>
              <p className="text-[9px] font-mono opacity-30 truncate">REF: {m._id}</p>
              <div className="mt-4 flex justify-between items-center">
                <span className="text-[10px] font-bold text-emerald-500 uppercase">EXP_{m.exposure}</span>
                <span className="text-[10px] font-bold opacity-40 italic">STABLE</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ArGenerator;