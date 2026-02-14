import React, { useState, useRef } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { Download, Upload, Palette, Link as LinkIcon, Type } from 'lucide-react';

const QrGenerator = () => {
  const [url, setUrl] = useState('');
  const [fgColor, setFgColor] = useState('#2563eb'); // Foreground (QR dots)
  const [bgColor, setBgColor] = useState('#ffffff'); // Background
  const [logo, setLogo] = useState(null);
  const qrRef = useRef();

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setLogo(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const downloadQR = () => {
    const canvas = qrRef.current.querySelector('canvas');
    const url = canvas.toDataURL("image/png");
    const link = document.createElement('a');
    link.href = url;
    link.download = 'custom-qr.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-500 p-6">
      <header>
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">QR Generator Pro</h1>
        <p className="text-slate-500 mt-1 text-lg font-medium">Design branded QR codes for your AR models.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 max-w-6xl">
        {/* Controls Section */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-8">
          {/* Link Input */}
          <div>
            <label className="text-xs font-black text-slate-500 uppercase tracking-widest mb-3 block">Destination URL</label>
            <div className="relative">
              <LinkIcon className="absolute left-4 top-4 text-slate-400" size={20} />
              <input 
                type="text" 
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://your-ar-link.com"
                className="w-full p-4 pl-12 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>
          </div>

          {/* Color & Logo Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Foreground Color */}
            <div>
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest mb-3 block text-center md:text-left">QR Dots Color</label>
              <div className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-2xl hover:border-blue-300 transition-colors">
                <input 
                  type="color" 
                  value={fgColor}
                  onChange={(e) => setFgColor(e.target.value)}
                  className="w-12 h-12 rounded-xl cursor-pointer border-2 border-white shadow-sm"
                />
                <span className="text-sm font-mono font-bold text-slate-600 uppercase">{fgColor}</span>
              </div>
            </div>

            {/* Background Color */}
            <div>
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest mb-3 block text-center md:text-left">Background Color</label>
              <div className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-2xl hover:border-blue-300 transition-colors">
                <input 
                  type="color" 
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="w-12 h-12 rounded-xl cursor-pointer border-2 border-white shadow-sm"
                />
                <span className="text-sm font-mono font-bold text-slate-600 uppercase">{bgColor}</span>
              </div>
            </div>
          </div>

          {/* Logo Upload */}
          <div>
            <label className="text-xs font-black text-slate-500 uppercase tracking-widest mb-3 block">Center Logo</label>
            <label className="flex flex-col items-center justify-center w-full h-32 bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2rem] cursor-pointer hover:bg-blue-50 hover:border-blue-300 transition-all group">
              <Upload className="text-slate-400 group-hover:text-blue-500 mb-2" size={24} />
              <span className="text-sm font-bold text-slate-500 group-hover:text-blue-600">Click to upload company logo</span>
              <input type="file" className="hidden" onChange={handleLogoUpload} accept="image/*" />
            </label>
          </div>
        </div>

        {/* Live Preview Section */}
        <div className="bg-slate-900 p-10 rounded-[3rem] flex flex-col items-center justify-center text-white shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <Palette size={200} />
          </div>

          <div ref={qrRef} className="relative z-10 p-8 rounded-[2.5rem] shadow-2xl transition-transform hover:scale-105 duration-300" style={{ backgroundColor: bgColor }}>
            <QRCodeCanvas
              value={url || "https://github.com/kabeer-web"}
              size={280}
              fgColor={fgColor}
              bgColor={bgColor}
              level={"H"}
              imageSettings={{
                src: logo || "",
                height: 60,
                width: 60,
                excavate: true,
              }}
            />
          </div>
          
          <div className="mt-10 w-full max-w-sm space-y-4 z-10">
            <button 
              disabled={!url}
              onClick={downloadQR}
              className={`w-full flex items-center justify-center gap-3 px-8 py-5 rounded-[1.5rem] font-black tracking-wide transition-all ${
                url 
                ? 'bg-blue-600 hover:bg-blue-500 hover:-translate-y-1 shadow-xl shadow-blue-500/30' 
                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              <Download size={22} />
              GENERATE & DOWNLOAD
            </button>
            <p className="text-center text-slate-500 text-xs font-bold uppercase tracking-widest">
              Scan to test before downloading
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QrGenerator;