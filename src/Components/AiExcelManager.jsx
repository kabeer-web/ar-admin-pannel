import React, { useState, useRef, useEffect, useMemo } from 'react';
import * as XLSX from 'xlsx';
import { 
  Send, BrainCircuit, FileUp, Loader2, TrendingUp, 
  Download, Database, ReceiptText 
} from 'lucide-react';
import Groq from "groq-sdk";

// 🔑 API Client (Make sure VITE_GROQ_API_KEY is in your .env)
const apiKey = import.meta.env.VITE_GROQ_API_KEY;
const groq = new Groq({ apiKey: apiKey, dangerouslyAllowBrowser: true });

const AiExcelManager = () => {
  const [messages, setMessages] = useState([{ 
    role: 'ai', 
    text: "Assalam-o-Alaikum bhai! Beer AI v9.5 ready hai. Excel load karo ya direct entry bolo, main sab sambhaal loon ga!" 
  }]);
  const [excelData, setExcelData] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  // Auto-scroll logic
  useEffect(() => chatEndRef.current?.scrollIntoView({ behavior: "smooth" }), [messages]);

  // 📈 Calculation Engine: Auto-updates Balance for every row
  const processedData = useMemo(() => {
    let currentBalance = 0;
    return excelData.map((row) => {
      const credit = parseFloat(row.Credit) || 0;
      const debit = parseFloat(row.Debit) || 0;
      currentBalance = currentBalance + credit - debit;
      return { ...row, Balance: currentBalance };
    });
  }, [excelData]);

  // 📂 Excel File Handler
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const wb = XLSX.read(evt.target.result, { type: 'binary' });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const data = XLSX.utils.sheet_to_json(ws);
        setExcelData(data);
        setMessages(prev => [...prev, { 
          role: 'ai', 
          text: `Zabardast! ${data.length} records mil gaye hain. Ab koi bhi tabdeeli karni ho toh bas bata dein.` 
        }]);
      } catch (err) {
        setMessages(prev => [...prev, { role: 'ai', text: "Bhai, file parhne mein masla hua hai. Check karein file sahi hai?" }]);
      }
    };
    reader.readAsBinaryString(file);
  };

  // 💬 Friendly Chat & Logic Handler
  const handleSend = async () => {
    if (!input.trim()) return;
    if (!apiKey) {
      setMessages(prev => [...prev, { role: 'ai', text: "Bhai, API Key nahi mili. Settings check karein." }]);
      return;
    }

    const userQuery = input;
    setInput("");
    setMessages(prev => [...prev, { role: 'user', text: userQuery }]);
    setIsTyping(true);

    try {
      const completion = await groq.chat.completions.create({
        messages: [
          { 
            role: "system", 
            content: `You are 'Beer AI', a smart and helpful Desi Accountant.
            Rules:
            1. Talk in friendly Hinglish like a partner.
            2. Explain clearly what you changed or added.
            3. Provide a short summary of the specific customer's new balance.
            4. Strictly return: [MESSAGE]: <your_friendly_response> [DATA]: <full_updated_json_array>.
            5. Columns MUST be: "Date", "Customer Name", "Description", "Debit", "Credit".` 
          },
          { 
            role: "user", 
            content: `Current Ledger: ${JSON.stringify(excelData)}\nTask: ${userQuery}` 
          }
        ],
        model: "llama-3.3-70b-versatile",
        temperature: 0.6,
      });

      const responseText = completion.choices[0]?.message?.content || "";
      
      // Smart Regex to split Message and Data
      const dataMatch = responseText.match(/\[DATA\]:(\s*\[[\s\S]*\])/);
      const msgMatch = responseText.match(/\[MESSAGE\]:(.*?)(\[DATA\]|$)/s);

      if (dataMatch) {
        const cleanedJson = dataMatch[1].trim();
        const parsedData = JSON.parse(cleanedJson);
        setExcelData(parsedData);
        setMessages(prev => [...prev, { 
          role: 'ai', 
          text: msgMatch ? msgMatch[1].trim() : "Bhai, entry kar di hai. Table check kar lein!" 
        }]);
      } else {
        setMessages(prev => [...prev, { role: 'ai', text: "Bhai response toh aaya par data format thora hila hua tha. Dobara bolega?" }]);
      }
    } catch (err) {
      setMessages(prev => [...prev, { role: 'ai', text: "Lagta hai Groq bhai thora busy hain, ek baar phir try karein." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-[#010302] p-4 gap-6 text-zinc-200 font-sans overflow-hidden">
      
      {/* 🟢 Sidebar: Chat & Controls */}
      <div className="w-full lg:w-96 flex flex-col bg-[#0b0f0e] rounded-[2rem] border border-emerald-500/10 shadow-2xl">
        <div className="p-6 border-b border-emerald-500/5 flex items-center gap-3">
          <div className="p-2 bg-emerald-500/10 rounded-lg"><BrainCircuit className="text-emerald-400" size={20} /></div>
          <h1 className="text-xs font-black uppercase tracking-widest text-emerald-400">Beer AI Accountant</h1>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar text-xs">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`p-4 rounded-2xl max-w-[85%] leading-relaxed shadow-sm ${
                msg.role === 'user' ? 'bg-emerald-600 text-white' : 'bg-[#141a18] border border-emerald-500/5'
              }`}>
                {msg.text}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex items-center gap-2 text-emerald-500 font-bold animate-pulse">
              <Loader2 className="animate-spin" size={14} /> <span>AI Soch raha hai...</span>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        <div className="p-4 bg-black/20 space-y-3">
          <div className="flex gap-2 bg-[#020403] p-2 rounded-xl border border-emerald-500/20 focus-within:border-emerald-500 transition-all">
            <input 
              className="flex-1 bg-transparent border-none outline-none px-2 text-xs"
              placeholder="Kabeer 1000 debit kar do..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            <button onClick={handleSend} className="bg-emerald-500 p-2 rounded-lg text-black hover:scale-95 active:scale-90 transition-all">
              <Send size={14} />
            </button>
          </div>
          <label className="flex items-center justify-center gap-2 cursor-pointer bg-white/5 p-2 rounded-xl text-[10px] font-black uppercase hover:bg-emerald-500/10 border border-emerald-500/10 transition-all">
            <FileUp size={14} /> Upload Sheet
            <input type="file" className="hidden" onChange={handleFileUpload} />
          </label>
        </div>
      </div>

      {/* 🔵 Main Matrix Table */}
      <div className="flex-1 flex flex-col bg-[#0b0f0e] rounded-[2.5rem] border border-emerald-500/10 shadow-2xl overflow-hidden">
        <div className="p-6 border-b border-emerald-500/5 flex justify-between items-center bg-emerald-500/[0.02]">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-emerald-500/10 rounded-full"><ReceiptText className="text-emerald-500" size={20} /></div>
            <h2 className="text-sm font-black uppercase tracking-tighter">Financial Ledger Matrix</h2>
          </div>
          <button onClick={() => {
            const ws = XLSX.utils.json_to_sheet(processedData);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "Audit");
            XLSX.writeFile(wb, `Beer_Ledger_${new Date().toLocaleDateString()}.xlsx`);
          }} className="bg-emerald-500 text-black px-6 py-2 rounded-xl font-black text-[10px] uppercase shadow-lg shadow-emerald-500/10 hover:bg-emerald-400 transition-all">
            Export Matrix
          </button>
        </div>

        <div className="flex-1 overflow-auto p-6 custom-scrollbar">
          {processedData.length > 0 ? (
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-[#121816] text-emerald-400 font-black uppercase text-[10px] border-b border-emerald-500/10 text-left">
                  <th className="p-4">Date</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Description</th>
                  <th className="p-4 text-right">Debit (-)</th>
                  <th className="p-4 text-right">Credit (+)</th>
                  <th className="p-4 text-right bg-emerald-500/5 text-white">Balance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-emerald-500/5">
                {processedData.map((row, i) => (
                  <tr key={i} className="hover:bg-emerald-500/[0.02] text-[11px] transition-all group">
                    <td className="p-4 opacity-50">{row.Date || '-'}</td>
                    <td className="p-4 font-bold text-white uppercase tracking-wider">{row["Customer Name"] || '-'}</td>
                    <td className="p-4 opacity-70 italic">{row.Description || '-'}</td>
                    <td className="p-4 text-right text-red-400">-{row.Debit || 0}</td>
                    <td className="p-4 text-right text-emerald-500">+{row.Credit || 0}</td>
                    <td className="p-4 text-right font-black text-white bg-emerald-500/[0.03] font-mono">
                      {Number(row.Balance).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="h-full flex flex-col items-center justify-center opacity-10 py-20">
              <Database size={80} className="mb-4" />
              <p className="text-xs font-black uppercase tracking-[1em]">Matrix Offline</p>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; height: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(16, 185, 129, 0.2); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
      `}</style>
    </div>
  );
};

export default AiExcelManager;