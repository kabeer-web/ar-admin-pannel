import React, { useState, useRef, useEffect, useMemo } from 'react';
import * as XLSX from 'xlsx';
import { 
  Send, Download, BrainCircuit, FileUp, Database, 
  Table as TableIcon, Loader2, TrendingUp, Camera, ImageIcon 
} from 'lucide-react';
import Groq from "groq-sdk";

const groq = new Groq({ 
  apiKey: import.meta.env.VITE_GROQ_API_KEY, 
  dangerouslyAllowBrowser: true 
});

const AiExcelManager = () => {
  const [messages, setMessages] = useState([
    { role: 'ai', text: "Assalam-o-Alaikum! Beer AI v5.5 ready hai. Ab command dein, entry foran hogi!" }
  ]);
  const [excelData, setExcelData] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  // Auto-scroll to bottom
  useEffect(() => chatEndRef.current?.scrollIntoView({ behavior: "smooth" }), [messages]);

  // 📈 Robust Math Engine: Auto-calculates Balance
  const processedData = useMemo(() => {
    let currentBalance = 0;
    return excelData.map((row) => {
      const credit = parseFloat(row.Credit) || 0;
      const debit = parseFloat(row.Debit) || 0;
      currentBalance = currentBalance + credit - debit;
      return { ...row, Balance: currentBalance };
    });
  }, [excelData]);

  // 📂 Excel Upload Handler
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const wb = XLSX.read(evt.target.result, { type: 'binary' });
        const data = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
        setExcelData(data);
        setMessages(prev => [...prev, { role: 'ai', text: `Bhai, ${data.length} records load ho gaye!` }]);
      } catch (err) {
        setMessages(prev => [...prev, { role: 'ai', text: "File parhne mein masla hai." }]);
      }
    };
    reader.readAsBinaryString(file);
  };

  // 📸 Vision/Image Scan
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setIsTyping(true);
    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        const response = await groq.chat.completions.create({
          messages: [{
            role: "user",
            content: [
              { type: "text", text: "Extract ledger data to JSON array: [{Date, 'Customer Name', Description, Debit, Credit}]. If not ledger, say NOT_A_LEDGER." },
              { type: "image_url", image_url: { url: reader.result } }
            ]
          }],
          model: "llama-3.2-11b-vision-preview",
        });
        const res = response.choices[0].message.content;
        const jsonMatch = res.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          setExcelData(prev => [...prev, ...JSON.parse(jsonMatch[0])]);
          setMessages(prev => [...prev, { role: 'ai', text: "Photo se data nikaal liya hai!" }]);
        }
      } catch (err) {
        setMessages(prev => [...prev, { role: 'ai', text: "Image scan failed." }]);
      } finally { setIsTyping(false); }
    };
    reader.readAsDataURL(file);
  };

  // 💬 Core Chat Logic (The Fix)
  const handleSend = async () => {
    if (!input.trim()) return;
    const userQuery = input;
    setInput("");
    setMessages(prev => [...prev, { role: 'user', text: userQuery }]);
    setIsTyping(true);

    try {
      const chatCompletion = await groq.chat.completions.create({
        messages: [
          { 
            role: "system", 
            content: "You are 'Beer AI'. Strictly return format: [MESSAGE]: <text> [DATA]: <json_array>. Update the existing data based on user command. If user says 'entry karo', add a new row." 
          },
          { 
            role: "user", 
            content: `Current Ledger: ${JSON.stringify(excelData)}\nCommand: ${userQuery}` 
          }
        ],
        model: "llama-3.3-70b-versatile",
        temperature: 0.1,
      });

      const raw = chatCompletion.choices[0]?.message?.content || "";
      const dataMatch = raw.match(/\[DATA\]:(\s*\[[\s\S]*\])/);
      const msgMatch = raw.match(/\[MESSAGE\]:(.*?)(\[DATA\]|$)/s);

      if (dataMatch) {
        const newData = JSON.parse(dataMatch[1].trim());
        setExcelData(newData);
        setMessages(prev => [...prev, { role: 'ai', text: msgMatch ? msgMatch[1].trim() : "Done!" }]);
      } else {
        setMessages(prev => [...prev, { role: 'ai', text: "Bhai, AI ne sahi data format nahi bheja." }]);
      }
    } catch (err) {
      setMessages(prev => [...prev, { role: 'ai', text: "Error: " + err.message }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-[#010302] p-4 gap-6 text-zinc-200 font-sans overflow-hidden">
      
      {/* 🟢 Sidebar (Chat & Controls) */}
      <div className="w-full lg:w-96 flex flex-col bg-[#0b0f0e] rounded-[2rem] border border-emerald-500/10 shadow-2xl">
        <div className="p-6 border-b border-emerald-500/5 flex items-center gap-3">
          <div className="p-2 bg-emerald-500/10 rounded-lg"><BrainCircuit className="text-emerald-400" size={20} /></div>
          <h1 className="text-xs font-black uppercase tracking-widest text-emerald-400">Beer AI Core</h1>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`p-4 rounded-2xl max-w-[90%] text-xs leading-relaxed ${
                msg.role === 'user' ? 'bg-emerald-600 text-white' : 'bg-[#141a18] border border-emerald-500/5'
              }`}>
                {msg.text}
              </div>
            </div>
          ))}
          {isTyping && <Loader2 className="animate-spin text-emerald-500 mx-auto" size={18} />}
          <div ref={chatEndRef} />
        </div>

        <div className="p-4 bg-black/20 space-y-3">
          <div className="flex gap-2 bg-[#020403] p-2 rounded-xl border border-emerald-500/20 focus-within:border-emerald-500">
            <input 
              className="flex-1 bg-transparent border-none outline-none px-2 text-xs"
              placeholder="Type command..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            <button onClick={handleSend} className="bg-emerald-500 p-2 rounded-lg text-black hover:scale-95 transition-all">
              <Send size={14} />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <label className="flex items-center justify-center gap-2 cursor-pointer bg-white/5 p-2 rounded-xl text-[10px] font-bold uppercase hover:bg-emerald-500/10 border border-emerald-500/10">
              <FileUp size={14} /> Excel <input type="file" className="hidden" onChange={handleFileUpload} />
            </label>
            <label className="flex items-center justify-center gap-2 cursor-pointer bg-white/5 p-2 rounded-xl text-[10px] font-bold uppercase hover:bg-emerald-500/10 border border-emerald-500/10">
              <Camera size={14} /> Photo <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
            </label>
          </div>
        </div>
      </div>

      {/* 🔵 Main Ledger Table */}
      <div className="flex-1 flex flex-col bg-[#0b0f0e] rounded-[2.5rem] border border-emerald-500/10 shadow-2xl overflow-hidden">
        <div className="p-6 border-b border-emerald-500/5 flex justify-between items-center bg-emerald-500/[0.02]">
          <div className="flex items-center gap-4">
            <TrendingUp className="text-emerald-500" size={24} />
            <h2 className="text-sm font-black uppercase tracking-widest italic">Financial Matrix</h2>
          </div>
          <button onClick={() => {
            const ws = XLSX.utils.json_to_sheet(processedData);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "Audit");
            XLSX.writeFile(wb, "Beer_Audit.xlsx");
          }} className="bg-emerald-500 text-black px-6 py-2 rounded-xl font-black text-[10px] uppercase shadow-emerald-500/20 shadow-lg">
            Export Audit
          </button>
        </div>

        <div className="flex-1 overflow-auto p-6 custom-scrollbar">
          {processedData.length > 0 ? (
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-[#121816] text-emerald-400 font-black uppercase text-[10px] tracking-tighter border-b border-emerald-500/10">
                  <th className="p-4 text-left">Date</th>
                  <th className="p-4 text-left">Customer</th>
                  <th className="p-4 text-left">Description</th>
                  <th className="p-4 text-right text-red-400">Debit (-)</th>
                  <th className="p-4 text-right text-emerald-400">Credit (+)</th>
                  <th className="p-4 text-right bg-emerald-500/5 text-white">Balance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-emerald-500/5">
                {processedData.map((row, i) => (
                  <tr key={i} className="hover:bg-emerald-500/[0.02] text-[11px] transition-all group">
                    <td className="p-4 opacity-50">{row.Date || '-'}</td>
                    <td className="p-4 font-bold text-white uppercase tracking-wider">{row["Customer Name"] || '-'}</td>
                    <td className="p-4 opacity-70 italic">{row.Description || '-'}</td>
                    <td className="p-4 text-right text-red-500/80 font-mono">-{row.Debit || 0}</td>
                    <td className="p-4 text-right text-emerald-500 font-mono">+{row.Credit || 0}</td>
                    <td className="p-4 text-right font-black text-white bg-emerald-500/[0.03] font-mono">
                      {Number(row.Balance).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="h-full flex flex-col items-center justify-center opacity-10">
              <Database size={80} className="mb-4" />
              <p className="text-xs font-black uppercase tracking-[1em]">Matrix Empty</p>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; height: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #10b98144; border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default AiExcelManager;