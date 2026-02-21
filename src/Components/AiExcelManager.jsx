import React, { useState, useRef, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { Send, Download, BrainCircuit, FileUp, Database, Table as TableIcon, Loader2 } from 'lucide-react';
import Groq from "groq-sdk";

const groq = new Groq({ 
  apiKey: import.meta.env.VITE_GROQ_API_KEY, 
  dangerouslyAllowBrowser: true 
});

const AiExcelManager = () => {
  const [messages, setMessages] = useState([
    { role: 'ai', text: "Assalam-o-Alaikum bhai! Beer AI hazir hai. Excel download fix kar di hai aur scrollbar bhi makkhan hai. Batao kya hukum hai?" }
  ]);
  const [excelData, setExcelData] = useState([]);
  const [fileName, setFileName] = useState("Beer_Ledger.xlsx");
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => chatEndRef.current?.scrollIntoView({ behavior: "smooth" }), [messages]);

  const handleCellEdit = (rowIndex, columnKey, value) => {
    const newData = [...excelData];
    newData[rowIndex][columnKey] = value;
    setExcelData(newData);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (evt) => {
      const data = XLSX.utils.sheet_to_json(XLSX.read(evt.target.result, { type: 'binary' }).Sheets[XLSX.read(evt.target.result, { type: 'binary' }).SheetNames[0]]);
      setExcelData(data);
      setMessages(prev => [...prev, { role: 'ai', text: `Bhai file mil gayi! Isme ${data.length} entries hain. Beer AI ready hai!` }]);
    };
    reader.readAsBinaryString(file);
  };

  // 🔥 FIXED DOWNLOAD FUNCTION
  const downloadExcel = () => {
    if (excelData.length === 0) return alert("Bhai pehle data toh daalo!");
    const ws = XLSX.utils.json_to_sheet(excelData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Ledger");
    XLSX.writeFile(wb, fileName);
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
          {
            role: "system",
            content: `You are 'Beer AI', a friendly Hinglish Accountant. 
            Rules:
            1. Respond in Hinglish like a partner.
            2. ALWAYS return [MESSAGE]: your talk and [DATA]: the full JSON array.
            3. Ensure 'Balance' is auto-calculated correctly.`
          },
          {
            role: "user",
            content: `Current Ledger: ${JSON.stringify(excelData)}\nAction: ${userQuery}`
          }
        ],
        model: "llama-3.3-70b-versatile",
        temperature: 0.6,
      });

      let rawResponse = chatCompletion.choices[0]?.message?.content || "";
      const messageMatch = rawResponse.match(/\[MESSAGE\]:(.*?)(\[DATA\]|$)/s);
      const dataMatch = rawResponse.match(/\[DATA\]:(\s*\[[\s\S]*\])/);

      if (dataMatch) {
        setExcelData(JSON.parse(dataMatch[1].trim()));
        setMessages(prev => [...prev, { role: 'ai', text: messageMatch ? messageMatch[1].trim() : "Bhai kaam done hai!" }]);
      }
    } catch (err) {
      setMessages(prev => [...prev, { role: 'ai', text: "Yaar bhai, dimaag thora ghoom gaya. Dobara bolna?" }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-[#050706] p-4 gap-4 overflow-hidden text-white">
      
      {/* Sidebar - Beer AI Chat with Custom Scrollbar */}
      <div className="w-full lg:w-1/4 flex flex-col bg-[#111814] rounded-[2rem] border border-emerald-500/20 shadow-2xl overflow-hidden">
        <div className="p-5 border-b border-emerald-500/10 flex items-center justify-between bg-emerald-500/5">
          <div className="flex items-center gap-2">
            <BrainCircuit className="text-emerald-400" size={24} />
            <span className="text-sm font-black uppercase tracking-widest text-emerald-400">Beer AI</span>
          </div>
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-emerald-500/20 hover:scrollbar-thumb-emerald-500/50 scrollbar-track-transparent">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`p-4 rounded-2xl max-w-[90%] text-[13px] shadow-lg transition-all ${
                msg.role === 'user' ? 'bg-emerald-600 shadow-emerald-900/20' : 'bg-[#1a241f] border border-emerald-500/10 text-emerald-50'
              }`}>
                {msg.text}
              </div>
            </div>
          ))}
          {isTyping && <Loader2 className="animate-spin text-emerald-500 mx-auto" size={20} />}
          <div ref={chatEndRef} />
        </div>

        <div className="p-4 bg-black/40 border-t border-emerald-500/10">
          <div className="flex gap-2 bg-[#050706] p-2 rounded-xl border border-emerald-500/30 focus-within:border-emerald-400 transition-all">
            <input 
              className="flex-1 bg-transparent border-none outline-none px-2 text-sm text-white"
              placeholder="Beer AI se baat karo..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            <button onClick={handleSend} className="bg-emerald-500 p-2.5 rounded-lg text-black hover:bg-white active:scale-95 transition-all">
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Ledger Grid with Custom Scrollbar */}
      <div className="w-full lg:w-3/4 flex flex-col bg-[#111814] rounded-[2rem] border border-emerald-500/20 overflow-hidden shadow-2xl">
        <div className="p-5 border-b border-emerald-500/10 flex justify-between items-center bg-black/20">
          <div className="flex items-center gap-3">
            <TableIcon className="text-emerald-400" size={22} />
            <h2 className="text-xs font-black uppercase tracking-widest text-emerald-100/50">Business Matrix</h2>
          </div>
          <div className="flex gap-3">
            <label className="flex items-center gap-2 cursor-pointer bg-[#1a241f] px-4 py-2 rounded-xl border border-emerald-500/20 hover:bg-emerald-500 hover:text-black transition-all text-xs font-bold uppercase">
              <FileUp size={16} /> Load
              <input type="file" className="hidden" onChange={handleFileUpload} />
            </label>
            <button onClick={downloadExcel} className="bg-emerald-500 text-black px-6 py-2 rounded-xl font-black text-xs uppercase hover:bg-white active:scale-95 transition-all shadow-lg flex items-center gap-2">
              <Download size={16} /> Export
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-4 bg-[#0a0f0d] scrollbar-thin scrollbar-thumb-emerald-500/20 hover:scrollbar-thumb-emerald-500/40 scrollbar-track-transparent">
          {excelData.length > 0 ? (
            <div className="rounded-2xl border border-emerald-500/10 overflow-hidden">
              <table className="w-full border-collapse text-sm">
                <thead className="sticky top-0 z-10">
                  <tr className="bg-emerald-600 text-black font-black uppercase text-[11px]">
                    <th className="p-4 text-left">Date</th>
                    <th className="p-4 text-left">Customer Name</th>
                    <th className="p-4 text-center">Bill No</th>
                    <th className="p-4 text-right">Credit (+)</th>
                    <th className="p-4 text-right">Debit (-)</th>
                    <th className="p-4 text-right bg-emerald-700">Balance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-emerald-500/5 bg-[#111814]">
                  {excelData.map((row, i) => (
                    <tr key={i} className="hover:bg-emerald-500/5 transition-all">
                      <td className="p-1"><input className="w-full p-3 bg-transparent outline-none text-emerald-100/60" value={row["Date"] || ""} onChange={(e) => handleCellEdit(i, "Date", e.target.value)} /></td>
                      <td className="p-1"><input className="w-full p-3 bg-transparent outline-none font-bold text-white" value={row["Customer Name"] || ""} onChange={(e) => handleCellEdit(i, "Customer Name", e.target.value)} /></td>
                      <td className="p-1"><input className="w-full p-3 bg-transparent outline-none text-center opacity-40 font-mono" value={row["Bill No"] || ""} onChange={(e) => handleCellEdit(i, "Bill No", e.target.value)} /></td>
                      <td className="p-1"><input className="w-full p-3 bg-transparent outline-none text-right font-black text-emerald-400" value={row["Credit"] || 0} onChange={(e) => handleCellEdit(i, "Credit", e.target.value)} /></td>
                      <td className="p-1"><input className="w-full p-3 bg-transparent outline-none text-right font-black text-red-400" value={row["Debit"] || 0} onChange={(e) => handleCellEdit(i, "Debit", e.target.value)} /></td>
                      <td className="p-4 text-right font-black text-white bg-emerald-500/5">{row["Balance"] || 0}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center opacity-20">
              <Database size={60} className="text-emerald-500 mb-4 animate-pulse" />
              <p className="font-black uppercase tracking-[0.5em]">Beer AI Matrix Empty</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AiExcelManager;