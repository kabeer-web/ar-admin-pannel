import React from 'react';
import { QrCode, Download, Share2 } from 'lucide-react';

const QrGenerator = () => {
  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <header>
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">QR Generator</h1>
        <p className="text-slate-500 mt-1 text-lg font-medium">Create QR codes for instant AR viewing.</p>
      </header>

      <div className="max-w-xl bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm">
        <div className="bg-slate-50 w-full aspect-square rounded-[2rem] border-2 border-dashed border-slate-200 flex items-center justify-center mb-8">
          <QrCode size={120} className="text-slate-200" />
        </div>
        
        <div className="space-y-4">
          <label className="text-sm font-black text-slate-700 uppercase tracking-widest">Model Link</label>
          <input 
            type="text" 
            placeholder="Paste your .glb or .usdz link here..."
            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black hover:bg-blue-700 transition-all">
            GENERATE AR QR CODE
          </button>
        </div>
      </div>
    </div>
  );
};

export default QrGenerator;