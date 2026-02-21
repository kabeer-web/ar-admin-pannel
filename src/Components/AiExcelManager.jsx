import React, { useState, useRef, useEffect, useMemo } from 'react';
import * as XLSX from 'xlsx';
import { Send, Download, BrainCircuit, FileUp, Database, Table as TableIcon, Loader2, TrendingUp, Camera, Image as ImageIcon } from 'lucide-react';
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: import.meta.env.VITE_GROQ_API_KEY, dangerouslyAllowBrowser: true });

const AiExcelManager = () => {
  const [messages, setMessages] = useState([{ role: 'ai', text: "Beer AI v6.0 Live! Bhai ab image compressor laga diya hai, ab Scan fail nahi hoga. Try karo!" }]);
  const [excelData, setExcelData] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => chatEndRef.current?.scrollIntoView({ behavior: "smooth" }), [messages]);

  const processedData = useMemo(() => {
    let currentBalance = 0;
    return excelData.map((row) => {
      const credit = parseFloat(row.Credit) || 0;
      const debit = parseFloat(row.Debit) || 0;
      currentBalance = currentBalance + credit - debit;
      return { ...row, Balance: currentBalance };
    });
  }, [excelData]);

  // 🛠️ IMAGE COMPRESSOR (400 Error ka ilaj)
  const compressImage = (base64Str) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = base64Str;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 800; // Resolution thori kam ki taake API handle kar sakay
        let width = img.width;
        let height = img.height;
        if (width > MAX_WIDTH) {
          height *= MAX_WIDTH / width;
          width = MAX_WIDTH;
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.7)); // 70% quality compression
      };
    });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setIsTyping(true);
    setMessages(prev => [...prev, { role: 'ai', text: "Bhai, photo ko optimize kar raha hoon..." }]);

    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        const optimizedImage = await compressImage(reader.result);
        const response = await groq.chat.completions.create({
          messages: [{
            role: "user",
            content: [
              { type: "text", text: "Convert this ledger/handwritten account to JSON array: [{Date, 'Customer Name', Description, Debit, Credit}]. No extra talk, just JSON." },
              { type: "image_url", image_url: { url: optimizedImage } }
            ]
          }],
          model: "llama-3.2-11b-vision-preview",
        });

        const res = response.choices[0].message.content;
        const jsonMatch = res.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          setExcelData(prev => [...prev, ...JSON.parse(jsonMatch[0])]);
          setMessages(prev => [...prev, { role: 'ai', text: "Zabardast! Optimized photo se data aa gaya." }]);
        }
      } catch (err) {
        setMessages(prev => [...prev, { role: 'ai', text: "Abhi bhi API ka masla hai, shayad net ya limit ka issue ho." }]);
      } finally { setIsTyping(false); }
    };
    reader.readAsDataURL(file);
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    const userQuery = input;
    setInput("");
    setMessages(prev => [...prev, { role: 'user', text: userQuery }]);
    setIsTyping(true);

    try {
      const chatCompletion = await groq.chat.completions.create({
        messages: [
          { role: "system", content: "You are 'Beer AI'. Return [MESSAGE]: and [DATA]: JSON array." },
          { role: "user", content: `Data: ${JSON.stringify(excelData)}\nCommand: ${userQuery}` }
        ],
        model: "llama-3.3-70b-versatile",
        temperature: 0.1,
      });
      const raw = chatCompletion.choices[0]?.message?.content || "";
      const dataMatch = raw.match(/\[DATA\]:(\s*\[[\s\S]*\])/);
      const msgMatch = raw.match(/\[MESSAGE\]:(.*?)(\[DATA\]|$)/s);
      if (dataMatch) {
        setExcelData(JSON.parse(dataMatch[1].trim()));
        setMessages(prev => [...prev, { role: 'ai', text: msgMatch ? msgMatch[1].trim() : "Done!" }]);
      }
    } catch (err) { setMessages(prev => [...prev, { role: 'ai', text: "Error logic mein!" }]); }
    finally { setIsTyping(false); }
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-[#010302] p-4 gap-6 text-zinc-200 overflow-hidden font-sans">
      <div className="w-full lg:w-80 flex flex-col bg-[#0b0f0e] rounded-[2rem] border border-emerald-500/10 shadow-2xl">
        <div className="p-6 border-b border-emerald-500/5 flex items-center gap-2">
          <BrainCircuit className="text-emerald-400" size={20} />
          <span className="text-xs font-black uppercase tracking-widest text-emerald-400">Beer AI Core</span>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`p-4 rounded-2xl max-w-[90%] text-xs ${msg.role === 'user' ? 'bg-emerald-600' : 'bg-[#141a18] border border-emerald-500/5'}`}>
                {msg.text}
              </div>
            </div>
          ))}
          {isTyping && <Loader2 className="animate-spin text-emerald-500 mx-auto" size={18} />}
          <div ref={chatEndRef} />
        </div>
        <div className="p-4 bg-black/20 space-y-2">
          <div className="flex gap-2 bg-[#020403] p-1.5 rounded-xl border border-emerald-500/20 focus-within:border-emerald-500 transition-all">
            <input className="flex-1 bg-transparent border-none outline-none px-3 text-xs" placeholder="Command..." value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSend()} />
            <button onClick={handleSend} className="bg-emerald-500 p-2.5 rounded-lg text-black"><Send size={14} /></button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <label className="flex items-center justify-center gap-2 cursor-pointer border border-emerald-500/20 p-2 rounded-xl text-[10px] text-emerald-400 font-bold uppercase hover:bg-emerald-500/5 transition-all">
              <FileUp size={14} /> Excel <input type="file" className="hidden" onChange={(e) => {
                const file = e.target.files[0];
                const reader = new FileReader();
                reader.onload = (evt) => {
                  const wb = XLSX.read(evt.target.result, { type: 'binary' });
                  setExcelData(XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]));
                };
                reader.readAsBinaryString(file);
              }} />
            </label>
            <label className="flex items-center justify-center gap-2 cursor-pointer border border-emerald-500/20 p-2 rounded-xl text-[10px] text-emerald-400 font-bold uppercase hover:bg-emerald-500/5 transition-all">
              <Camera size={14} /> Scan <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
            </label>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col bg-[#0b0f0e] rounded-[2.5rem] border border-emerald-500/10 shadow-2xl overflow-hidden">
        <div className="p-6 border-b border-emerald-500/5 flex justify-between items-center bg-emerald-500/[0.02]">
          <div className="flex items-center gap-4">
            <TrendingUp className="text-emerald-500" size={24} />
            <h2 className="text-sm font-black uppercase tracking-widest">Financial Ledger</h2>
          </div>
          <button onClick={() => {
            const ws = XLSX.utils.json_to_sheet(processedData);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "Audit");
            XLSX.writeFile(wb, "Beer_Ledger.xlsx");
          }} className="bg-emerald-500 text-black px-6 py-2 rounded-xl font-black text-[10px] uppercase">Export</button>
        </div>
        <div className="flex-1 overflow-auto p-6">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-[#121816] text-emerald-400 text-[10px] font-black uppercase border-b border-emerald-500/10">
                <th className="p-4 text-left">Date</th>
                <th className="p-4 text-left">Customer</th>
                <th className="p-4 text-right">Debit</th>
                <th className="p-4 text-right">Credit</th>
                <th className="p-4 text-right">Balance</th>
              </tr>
            </thead>
            <tbody>
              {processedData.map((row, i) => (
                <tr key={i} className="hover:bg-emerald-500/[0.02] text-[11px] border-b border-emerald-500/5">
                  <td className="p-4 opacity-50">{row.Date || '-'}</td>
                  <td className="p-4 font-bold text-white uppercase">{row["Customer Name"] || '-'}</td>
                  <td className="p-4 text-right text-red-400 font-mono">-{row.Debit || 0}</td>
                  <td className="p-4 text-right text-emerald-400 font-mono">+{row.Credit || 0}</td>
                  <td className="p-4 text-right font-black text-white bg-emerald-500/[0.02]">{row.Balance.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AiExcelManager;