import React, { useState, useRef, useEffect } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { Upload, Smartphone, Activity, Cpu, Palette, Box, Trash2, Edit3, Plus } from 'lucide-react';
import axios from 'axios';
import '@google/model-viewer';

const ArGenerator = () => {
  const [models, setModels] = useState([]);
  const [currentId, setCurrentId] = useState(null); // Edit mode ke liye
  const [modelUrl, setModelUrl] = useState(null);
  const [publicUrl, setPublicUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [exposure, setExposure] = useState(1);
  const [baseColor, setBaseColor] = useState('#ffffff');
  
  const modelViewerRef = useRef();
  const API_BASE_URL = "https://ar-admin-pannel.vercel.app/api";

  // Models Fetch Karo
  const fetchModels = async () => {
    const res = await axios.get(`${API_BASE_URL}/get-all-models`);
    setModels(res.data);
  };

  useEffect(() => { fetchModels(); }, []);

  const handleColorChange = (color) => {
    setBaseColor(color);
    const viewer = modelViewerRef.current;
    if (viewer?.model) {
      viewer.model.materials.forEach(mat => {
        const r = parseInt(color.slice(1, 3), 16) / 255;
        const g = parseInt(color.slice(3, 5), 16) / 255;
        const b = parseInt(color.slice(5, 7), 16) / 255;
        mat.pbrMetallicRoughness.setBaseColorFactor([r, g, b, 1]);
      });
    }
  };

  const saveConfig = async () => {
    setSyncing(true);
    try {
      await axios.post(`${API_BASE_URL}/save-config`, {
        id: currentId,
        publicUrl,
        baseColor,
        exposure
      });
      fetchModels();
      alert("Matrix Synced!");
    } catch (err) { alert("Sync Failed"); }
    finally { setSyncing(false); }
  };

  const deleteModel = async (id) => {
    if(window.confirm("Delete this link?")) {
      await axios.delete(`${API_BASE_URL}/delete-model/${id}`);
      fetchModels();
    }
  };

  const editModel = (m) => {
    setCurrentId(m._id);
    setPublicUrl(m.publicUrl);
    setModelUrl(m.publicUrl);
    setBaseColor(m.baseColor);
    setExposure(m.exposure);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', "ml_default");
    try {
      const res = await axios.post(`https://api.cloudinary.com/v1_1/doa5h9wwi/auto/upload`, formData);
      setPublicUrl(res.data.secure_url);
      setModelUrl(res.data.secure_url);
      setCurrentId(null); // Naya upload hai
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-[#010604] p-6 text-emerald-50 font-mono">
      {/* HEADER */}
      <header className="flex justify-between items-center mb-10 bg-black/40 p-6 rounded-3xl border border-emerald-500/10">
        <div className="flex items-center gap-3"><Cpu className="text-emerald-500 animate-pulse" /> <h1 className="font-black text-xl italic">MATRIX CMS</h1></div>
        <label className="bg-emerald-500 text-black px-6 py-2 rounded-xl font-bold cursor-pointer flex items-center gap-2">
          <Plus size={18}/> <input type="file" className="hidden" onChange={handleFileUpload} /> {loading ? "Uploading..." : "New Model"}
        </label>
      </header>

      {/* EDITOR */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
        <div className="lg:col-span-8 bg-black/60 rounded-[3rem] h-[500px] border border-emerald-500/10 relative overflow-hidden">
          {modelUrl ? (
            <>
              <model-viewer ref={modelViewerRef} src={modelUrl} camera-controls exposure={exposure} style={{width:'100%', height:'100%'}} />
              <div className="absolute bottom-6 left-6 right-6 bg-black/90 p-4 rounded-2xl flex items-center justify-between border border-emerald-500/20">
                <input type="color" value={baseColor} onChange={(e) => handleColorChange(e.target.value)} className="w-10 h-10 cursor-pointer" />
                <input type="range" min="0" max="3" step="0.1" value={exposure} onChange={(e) => setExposure(parseFloat(e.target.value))} className="w-1/3 accent-emerald-500" />
                <button onClick={saveConfig} className="bg-emerald-500 text-black px-8 py-2 rounded-xl font-bold uppercase text-xs">
                  {syncing ? "Saving..." : currentId ? "Update Matrix" : "Deploy Matrix"}
                </button>
              </div>
            </>
          ) : <div className="h-full flex items-center justify-center opacity-20"><Box size={100}/></div>}
        </div>

        <div className="lg:col-span-4 bg-[#05110d] rounded-[3rem] p-10 flex flex-col items-center justify-center border border-emerald-500/10 shadow-2xl">
          {currentId || publicUrl ? (
            <div className="bg-white p-4 rounded-3xl"><QRCodeCanvas value={`${window.location.origin}/view?id=${currentId || 'pending'}`} size={200} /></div>
          ) : <Smartphone size={80} className="opacity-10"/>}
          <p className="mt-4 text-[10px] opacity-40">REAL-TIME QR PREVIEW</p>
        </div>
      </div>

      {/* LIBRARY SECTION */}
      <h2 className="text-xl font-black mb-6 flex items-center gap-2 italic"><Box className="text-emerald-500"/> NEURAL ASSET LIBRARY</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {models.map(m => (
          <div key={m._id} className="bg-black/40 border border-emerald-500/10 p-5 rounded-3xl hover:border-emerald-500/40 transition-all group">
            <div className="h-32 bg-emerald-900/5 rounded-2xl mb-4 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
                <Box className="text-emerald-500/20" size={40} />
            </div>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest">{m.modelName}</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-3 h-3 rounded-full" style={{backgroundColor: m.baseColor}}></div>
                  <span className="text-[8px] opacity-40">EXP: {m.exposure}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => editModel(m)} className="p-2 bg-emerald-500/10 text-emerald-500 rounded-lg hover:bg-emerald-500 hover:text-black transition-all"><Edit3 size={14}/></button>
                <button onClick={() => deleteModel(m._id)} className="p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all"><Trash2 size={14}/></button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ArGenerator;