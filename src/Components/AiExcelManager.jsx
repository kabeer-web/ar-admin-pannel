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
    { role: 'ai', text: "Excel Matrix Stabilized. I will now maintain a clean, professional ledger format with bold amounts and clear headers." }
  ]);
  const [excelData, setExcelData] = useState([]);
  const [fileName, setFileName] = useState("Professional_Ledger.xlsx");
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
    };
    reader.readAsBinaryString(file);
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
            content: `You are a professional Accountant. Return ONLY a valid JSON array.
            Format: [{ "Date": "...", "Customer Name": "...", "Bill No": "...", "Credit": 0, "Debit": 0, "Balance": 0 }]
            Rules:
            1. Maintain clean data structure.
            2. Auto-calculate Balance: (Prev Balance + Credit - Debit).
            3. No conversational text.`
          },
          {
            role: "user",
            content: `Current Data: ${JSON.stringify(excelData)}\nTask: ${userQuery}`
          }
        ],
        model: "llama-3.3-70b-versatile",
        temperature: 0,
      });

      let responseText = chatCompletion.choices[0]?.message?.content || "[]";
      const jsonMatch = responseText.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        setExcelData(JSON.parse(jsonMatch[0]));
        setMessages(prev => [...prev, { role: 'ai', text: "Ledger updated and balanced." }]);
      }
    } catch (err) {
      setMessages(prev => [...prev, { role: 'ai', text: "Update failed. Check data format." }]);
    } finally {
      setIsTyping(false);
    }
  };

  const downloadExcel = () => {
    const ws = XLSX.utils.json_to_sheet(excelData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Ledger");
    XLSX.writeFile(wb, fileName);
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-[#020403] p-4 gap-4 overflow-hidden">
      
      {/* Sidebar Chat */}
      <div className="w-full lg:w-1/4 flex flex-col bg-[#0b120f] rounded-[2rem] border border-emerald-500/10 overflow-hidden">
        <div className="p-5 border-b border-emerald-500/10 flex items-center gap-2">
          <BrainCircuit className="text-emerald-500" size={18} />
          <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-500">AI Accountant</span>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide text-[12px]">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`p-3 rounded-xl max-w-[90%] ${msg.role === 'user' ? 'bg-emerald-600' : 'bg-emerald-950/20 border border-emerald-900/50'}`}>
                {msg.text}
              </div>
            </div>
          ))}
          {isTyping && <Loader2 className="animate-spin text-emerald-500 mx-auto" size={16} />}
          <div ref={chatEndRef} />
        </div>
        <div className="p-4 bg-black/20">
          <div className="flex gap-2 bg-black/40 p-2 rounded-xl border border-emerald-900/30">
            <input 
              className="flex-1 bg-transparent border-none outline-none px-2 text-xs"
              placeholder="Add entry..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            <button onClick={handleSend} className="bg-emerald-500 p-2 rounded-lg text-black hover:bg-white transition-all">
              <Send size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Professional Excel Grid */}
      <div className="w-full lg:w-3/4 flex flex-col bg-[#0b120f] rounded-[2rem] border border-emerald-500/10 overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-emerald-500/10 flex justify-between items-center bg-black/40">
          <div className="flex items-center gap-3">
            <TableIcon className="text-emerald-500" size={20} />
            <h2 className="text-xs font-black uppercase tracking-widest text-emerald-100">Financial Ledger Matrix</h2>
          </div>
          <div className="flex gap-2">
            <label className="cursor-pointer bg-emerald-900/20 p-2 rounded-lg border border-emerald-500/20 hover:bg-emerald-500 hover:text-black transition-all">
              <FileUp size={16} />
              <input type="file" className="hidden" onChange={handleFileUpload} />
            </label>
            <button onClick={downloadExcel} className="bg-emerald-500 text-black px-4 py-2 rounded-lg font-bold text-[10px] uppercase hover:bg-white transition-all">
              Download Excel
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-4">
          {excelData.length > 0 ? (
            <div className="border border-emerald-500/20 rounded-lg overflow-hidden">
              <table className="w-full border-collapse bg-black/20 text-[12px]">
                <thead>
                  <tr className="bg-emerald-500 text-black uppercase font-black text-[10px]">
                    <th className="p-3 border-r border-black/10">Date</th>
                    <th className="p-3 border-r border-black/10">Customer Name</th>
                    <th className="p-3 border-r border-black/10">Bill No</th>
                    <th className="p-3 border-r border-black/10 text-right">Credit</th>
                    <th className="p-3 border-r border-black/10 text-right">Debit</th>
                    <th className="p-3 text-right">Balance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-emerald-500/10">
                  {excelData.map((row, i) => (
                    <tr key={i} className="hover:bg-emerald-500/5 transition-all group">
                      <td className="p-0"><input className="w-full p-3 bg-transparent outline-none text-center" value={row["Date"] || ""} onChange={(e) => handleCellEdit(i, "Date", e.target.value)} /></td>
                      <td className="p-0"><input className="w-full p-3 bg-transparent outline-none font-semibold text-emerald-50" value={row["Customer Name"] || ""} onChange={(e) => handleCellEdit(i, "Customer Name", e.target.value)} /></td>
                      <td className="p-0"><input className="w-full p-3 bg-transparent outline-none text-center opacity-60" value={row["Bill No"] || ""} onChange={(e) => handleCellEdit(i, "Bill No", e.target.value)} /></td>
                      <td className="p-0 bg-emerald-500/5"><input className="w-full p-3 bg-transparent outline-none text-right font-bold text-emerald-400" value={row["Credit"] || 0} onChange={(e) => handleCellEdit(i, "Credit", e.target.value)} /></td>
                      <td className="p-0"><input className="w-full p-3 bg-transparent outline-none text-right font-bold text-red-400" value={row["Debit"] || 0} onChange={(e) => handleCellEdit(i, "Debit", e.target.value)} /></td>
                      <td className="p-3 text-right font-black text-white bg-emerald-500/10">{row["Balance"] || 0}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center opacity-20">
              <Database size={48} className="text-emerald-500 mb-2" />
              <p className="text-[10px] uppercase font-bold tracking-[0.3em]">No Data Loaded</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AiExcelManager;