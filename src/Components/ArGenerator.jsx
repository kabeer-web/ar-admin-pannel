import React, { useState, useEffect } from 'react';
import { Sparkles, ShieldCheck, Save, CheckCircle } from 'lucide-react';

const ArGenerator = () => {
  const [apiKey, setApiKey] = useState('');
  const [saved, setSaved] = useState(false);

  // Pehle se save ki hui key load karna
  useEffect(() => {
    const storedKey = localStorage.getItem('meshy_api_key');
    if (storedKey) setApiKey(storedKey);
  }, []);

  const handleSave = () => {
    localStorage.setItem('meshy_api_key', apiKey);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000); // 3 sec baad success message hat jayega
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <header>
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">AR Generator</h1>
        <p className="text-slate-500 mt-1 text-lg font-medium">Manage API credentials and AR environment settings.</p>
      </header>

      <div className="max-w-2xl space-y-6">
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm transition-all hover:shadow-md">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
            <ShieldCheck className="text-blue-600" size={24} /> API Authentication
          </h3>
          
          <div className="space-y-6">
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 px-1">
                Meshy.ai Secret Key
              </label>
              <input 
                type="password" 
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="msy_xxxxxxxxxxxxxxxx" 
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-mono" 
              />
            </div>

            <button 
              onClick={handleSave}
              className={`flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-black transition-all ${
                saved ? 'bg-green-500 text-white' : 'bg-slate-900 text-white hover:bg-blue-600 shadow-lg shadow-slate-200'
              }`}
            >
              {saved ? <><CheckCircle size={20} /> Key Saved!</> : <><Save size={20} /> Update AR Settings</>}
            </button>
          </div>

          <div className="mt-8 p-4 bg-blue-50 rounded-2xl border border-blue-100 flex gap-3 italic text-sm text-blue-700">
            <Sparkles size={18} className="shrink-0" />
            <p>Aapki API key browser mein safe hai. Iska istemal image se 3D model banane ke liye kiya jayega.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArGenerator;