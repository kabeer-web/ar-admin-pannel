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
    { role: 'ai', text: "Beer AI v4.2 Active! Bhai Ali Ahmed ka naam Capital kar diya aur Bilal ka 5000 charha diya hai. Math ab bilkul perfect hai." }
  ]);
  const [excelData, setExcelData] = useState([
    { "Date": "46023", "Customer Name": "Fraaz Industry", "Description": "Opening Balance", "Debit": 0, "Credit": 0, "Balance": 10000 },
    { "Date": "46143", "Customer Name": "ALI AHMED", "Description": "Goods Purchase", "Debit": 2000, "Credit": 0, "Balance": 8000 },
    { "Date": "46296", "Customer Name": "Fraaz Industry", "Description": "Payment Received", "Debit": 0, "Credit": 5000, "Balance": 13000 },
    { "Date": "15/01/2026", "Customer Name": "Khan & Sons", "Description": "Service Charges", "Debit": 1500, "Credit": 0, "Balance": 11500 },
    { "Date": "20/01/2026", "Customer Name": "ALI AHMED", "Description": "Cash Deposit", "Debit": 0, "Credit": 3000, "Balance": 14500 },
    { "Date": "22/02/2026", "Customer Name": "Bilal Garments", "Description": "Credit Entry", "Debit": 0, "Credit": 10000, "Balance": 24500 }
  ]);
  const [fileName, setFileName] = useState("Beer_Business_Ledger.xlsx");
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => chatEndRef.current?.scrollIntoView({ behavior: "smooth" }), [messages]);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const wb = XLSX.read(evt.target.result, { type: 'binary' });
        const data = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
        setExcelData(data);
        setMessages(prev => [...prev, { role: 'ai', text: "Bhai file load ho gayi! Beer AI ne data matrix set kar diya hai." }]);
      } catch (err) {
        setMessages(prev => [...prev, { role: 'ai', text: "Bhai file read nahi hui. Format check karo?" }]);
      }
    };
    reader.readAsBinaryString(file);
  };

  const handleCellEdit = (rowIndex, columnKey, value) => {
    const newData = [...excelData];
    newData[rowIndex][columnKey] = value;
    setExcelData(newData);
  };

  const downloadExcel = () => {
    if (excelData.length === 0) return alert("Bhai pehle data toh dalo!");
    const ws = XLSX.utils.json_to_sheet(excelData);
    ws['!cols'] = [{wch: 15}, {wch: 25}, {wch: 25}, {wch: 12}, {wch: 12}, {wch: 15}];
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
            content: `You are 'Beer AI'. Expert Accountant. 
            Response Style: Hinglish (Urdu/Hindi in English script). 
            Task: Handle the ledger data precisely. 
            - Always return [MESSAGE]: and [DATA]: JSON array.
            - Keep Customer Names in UPPERCASE if requested.
            - Ensure math: Balance = Previous Balance + Credit - Debit.`
          },
          {
            role: "user",
            content: `Current Data: ${JSON.stringify(excelData)}\nCommand: ${userQuery}`
          }
        ],
        model: "llama-3.3-70b-versatile",
        temperature: 0.3, // Accuracy ke liye temperature low rakha hai
      });

      let rawResponse = chatCompletion.choices[0]?.message?.content || "";
      const messageMatch = rawResponse.match(/\[MESSAGE\]:(.*?)(\[DATA\]|$)/s);
      const dataMatch = rawResponse.match(/\[DATA\]:(\s*\[[\s\S]*\])/);

      if (dataMatch) {
        setExcelData(JSON.parse(dataMatch[1].trim()));
        setMessages(prev => [...prev, { role: 'ai', text: messageMatch ? messageMatch[1].trim() : "Bhai, dhanda update ho gaya hai!" }]);
      }
    } catch (err) {
      setMessages(prev => [...prev, { role: 'ai', text: "Yaar bhai, dimaag ghoom gaya. Dobara bolna?" }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-[#020403] p-4 gap-6 overflow-hidden text-zinc-100">
      
      {/* 🟢 Sidebar: Beer AI Chat */}
      <div className="w-full lg:w-1/4 flex flex-col bg-[#0d1110] rounded-[2rem] border border-emerald-500/10 shadow-2xl overflow-hidden">
        <div className="p-6 border-b border-emerald-500/5 bg-emerald-500/5 flex items-center gap-3">
          <BrainCircuit className="text-emerald-400" size={24} />
          <h2 className="text-sm font-black uppercase tracking-[0.2em] text-emerald-400">Beer AI</h2>
        </div>

        <style>{`
          .custom-scroll::-webkit-scrollbar { width: 4px; }
          .custom-scroll::-webkit-scrollbar-thumb { background: #10b98133; border-radius: 10px; }
          .custom-scroll:hover::-webkit-scrollbar-thumb { background: #10b98166; }
        `}</style>
        
        <div className="flex-1 overflow-y-auto p-5 space-y-5 custom-scroll scroll-smooth">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`p-4 rounded-2xl max-w-[85%] text-[13px] leading-relaxed shadow-md ${
                msg.role === 'user' ? 'bg-emerald-600' : 'bg-[#161d1a] border border-emerald-500/10'
              }`}>
                {msg.text}
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        <div className="p-5 bg-black/20">
          <div className="flex gap-2 bg-[#020403] p-2 rounded-2xl border border-emerald-500/20 focus-within:border-emerald-500 transition-all">
            <input 
              className="flex-1 bg-transparent border-none outline-none px-3 text-sm"
              placeholder="Beer AI se baat..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            <button onClick={handleSend} className="bg-emerald-500 p-3 rounded-xl text-black">
              <Send size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* 🔵 Main Interface: Corporate Grid */}
      <div className="w-full lg:w-3/4 flex flex-col bg-[#0d1110] rounded-[2.5rem] border border-emerald-500/10 shadow-2xl overflow-hidden">
        <div className="p-7 border-b border-emerald-500/5 flex justify-between items-center bg-black/10">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-500/10 rounded-2xl"><TableIcon className="text-emerald-400" size={24} /></div>
            <div>
              <h2 className="text-sm font-black text-white uppercase tracking-widest">Financial Matrix</h2>
              <p className="text-[10px] text-emerald-700 font-bold uppercase tracking-tighter">Enterprise Standard</p>
            </div>
          </div>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer border border-emerald-500/20 px-5 py-2.5 rounded-2xl text-xs font-bold uppercase text-emerald-400">
              <FileUp size={18} /> Ingest
              <input type="file" className="hidden" onChange={handleFileUpload} />
            </label>
            <button onClick={downloadExcel} className="bg-emerald-500 text-black px-8 py-2.5 rounded-2xl font-black text-xs uppercase shadow-lg hover:bg-white transition-all">
              Export File
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-6 bg-[#050706] custom-scroll">
          {excelData.length > 0 ? (
            <div className="border border-emerald-500/10 rounded-[1.5rem] overflow-hidden bg-[#0d1110]">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-[#161d1a] text-emerald-400 font-black uppercase text-[10px] tracking-[0.2em]">
                    <th className="p-5 text-left border-b border-emerald-500/5">Date</th>
                    <th className="p-5 text-left border-b border-emerald-500/5">Customer Name</th>
                    <th className="p-5 text-left border-b border-emerald-500/5">Description</th>
                    <th className="p-5 text-right border-b border-emerald-500/5">Debit</th>
                    <th className="p-5 text-right border-b border-emerald-500/5">Credit</th>
                    <th className="p-5 text-right border-b border-emerald-500/5 bg-emerald-500/5">Balance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-emerald-500/5">
                  {excelData.map((row, i) => (
                    <tr key={i} className="hover:bg-emerald-500/5 transition-colors">
                      <td className="p-2 px-5"><input className="bg-transparent outline-none w-full text-emerald-100/50" value={row["Date"] || ""} onChange={(e) => handleCellEdit(i, "Date", e.target.value)} /></td>
                      <td className="p-2 px-5 font-bold"><input className="bg-transparent outline-none w-full text-white uppercase" value={row["Customer Name"] || ""} onChange={(e) => handleCellEdit(i, "Customer Name", e.target.value)} /></td>
                      <td className="p-2 px-5 opacity-50"><input className="bg-transparent outline-none w-full" value={row["Description"] || ""} onChange={(e) => handleCellEdit(i, "Description", e.target.value)} /></td>
                      <td className="p-2 px-5 text-right font-black text-red-400"><input className="bg-transparent outline-none w-full text-right" value={row["Debit"] || 0} onChange={(e) => handleCellEdit(i, "Debit", e.target.value)} /></td>
                      <td className="p-2 px-5 text-right font-black text-emerald-400"><input className="bg-transparent outline-none w-full text-right" value={row["Credit"] || 0} onChange={(e) => handleCellEdit(i, "Credit", e.target.value)} /></td>
                      <td className="p-5 text-right font-black text-white bg-emerald-500/[0.02]">{row["Balance"] || 0}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center opacity-20">
              <Database size={80} className="text-emerald-500" />
              <p className="font-black uppercase tracking-[0.5em] text-sm text-white">Waiting for Matrix Command</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AiExcelManager;