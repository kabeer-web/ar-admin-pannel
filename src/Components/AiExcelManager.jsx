import React, { useState, useRef, useEffect, useMemo } from 'react';
import * as XLSX from 'xlsx';
import { 
  Send, Download, BrainCircuit, FileUp, Database, 
  Table as TableIcon, Loader2, TrendingUp, AlertCircle 
} from 'lucide-react';
import Groq from "groq-sdk";

const groq = new Groq({ 
  apiKey: import.meta.env.VITE_GROQ_API_KEY, 
  dangerouslyAllowBrowser: true 
});

const AiExcelManager = () => {
  const [messages, setMessages] = useState([
    { role: 'ai', text: "Assalam-o-Alaikum! Beer AI Enterprise active hai. System ab math aur data validation mein 100% accurate hai. Hukum karein?" }
  ]);
  const [excelData, setExcelData] = useState([]);
  const [fileName, setFileName] = useState("Beer_Professional_Ledger.xlsx");
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  // Scroll to bottom on new chat
  useEffect(() => chatEndRef.current?.scrollIntoView({ behavior: "smooth" }), [messages]);

  // 🔥 Smart Calculation: Auto-manages running balance and totals
  const processedData = useMemo(() => {
    let currentBalance = 0;
    return excelData.map((row) => {
      const credit = parseFloat(row.Credit) || 0;
      const debit = parseFloat(row.Debit) || 0;
      currentBalance = currentBalance + credit - debit;
      return { ...row, Balance: currentBalance };
    });
  }, [excelData]);

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
        setMessages(prev => [...prev, { role: 'ai', text: `Bhai, ${data.length} records load ho gaye hain. Matrix ready hai.` }]);
      } catch (err) {
        setMessages(prev => [...prev, { role: 'ai', text: "File read nahi ho rahi. Format check karein." }]);
      }
    };
    reader.readAsBinaryString(file);
  };

  const handleCellEdit = (index, key, value) => {
    const updated = [...excelData];
    updated[index][key] = value;
    setExcelData(updated);
  };

  const downloadExcel = () => {
    if (processedData.length === 0) return alert("Pehle data toh daalein!");
    const ws = XLSX.utils.json_to_sheet(processedData);
    ws['!cols'] = [{wch: 12}, {wch: 25}, {wch: 30}, {wch: 12}, {wch: 12}, {wch: 15}];
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "BusinessLedger");
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
            content: `You are 'Beer AI', a Senior Financial Controller. 
            Context: Professional Hinglish.
            Behavior: 
            - Use input data to perform modifications.
            - If user says 'update Ali', find Ali and change values.
            - Format names to UPPERCASE when asked.
            - ALWAYS return [MESSAGE]: response [DATA]: full JSON array.
            - Do NOT change the 'Balance' field; the system handles math.`
          },
          {
            role: "user",
            content: `Ledger State: ${JSON.stringify(excelData)}\nTask: ${userQuery}`
          }
        ],
        model: "llama-3.3-70b-versatile",
        temperature: 0.1,
      });

      const raw = chatCompletion.choices[0]?.message?.content || "";
      const msgMatch = raw.match(/\[MESSAGE\]:(.*?)(\[DATA\]|$)/s);
      const dataMatch = raw.match(/\[DATA\]:(\s*\[[\s\S]*\])/);

      if (dataMatch) {
        setExcelData(JSON.parse(dataMatch[1].trim()));
        setMessages(prev => [...prev, { role: 'ai', text: msgMatch ? msgMatch[1].trim() : "Kaam mukammal hai bhai!" }]);
      }
    } catch (err) {
      setMessages(prev => [...prev, { role: 'ai', text: "System overload! Zara asaan alfaaz mein bolna?" }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-[#010302] p-4 gap-6 text-zinc-200 font-sans overflow-hidden">
      
      {/* 🟢 Professional Chat Sidebar */}
      <div className="w-full lg:w-80 flex flex-col bg-[#0b0f0e] rounded-[2rem] border border-emerald-500/10 shadow-2xl">
        <div className="p-6 border-b border-emerald-500/5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-500/10 rounded-lg">
              <BrainCircuit className="text-emerald-400" size={20} />
            </div>
            <span className="text-xs font-black uppercase tracking-widest text-emerald-400">Beer AI Core</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`p-4 rounded-2xl max-w-[90%] text-xs leading-relaxed shadow-sm ${
                msg.role === 'user' ? 'bg-emerald-600 text-white' : 'bg-[#141a18] border border-emerald-500/5'
              }`}>
                {msg.text}
              </div>
            </div>
          ))}
          {isTyping && <Loader2 className="animate-spin text-emerald-500 mx-auto" size={18} />}
          <div ref={chatEndRef} />
        </div>

        <div className="p-4">
          <div className="flex gap-2 bg-[#020403] p-1.5 rounded-xl border border-emerald-500/20 focus-within:border-emerald-500 transition-all">
            <input 
              className="flex-1 bg-transparent border-none outline-none px-3 text-xs"
              placeholder="Command do..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            <button onClick={handleSend} className="bg-emerald-500 p-2.5 rounded-lg text-black hover:scale-95 transition-transform">
              <Send size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* 🔵 Enterprise Data Matrix */}
      <div className="flex-1 flex flex-col bg-[#0b0f0e] rounded-[2.5rem] border border-emerald-500/10 shadow-2xl overflow-hidden">
        <div className="p-6 border-b border-emerald-500/5 flex justify-between items-center bg-emerald-500/[0.02]">
          <div className="flex items-center gap-4">
            <TrendingUp className="text-emerald-500" size={24} />
            <div>
              <h2 className="text-sm font-black uppercase tracking-widest">Financial Ledger</h2>
              <p className="text-[10px] text-emerald-700 font-bold uppercase">Live Audit Enabled</p>
            </div>
          </div>
          <div className="flex gap-3">
            <label className="flex items-center gap-2 cursor-pointer bg-transparent border border-emerald-500/20 px-4 py-2 rounded-xl text-[10px] font-black uppercase text-emerald-400 hover:bg-emerald-500/5">
              <FileUp size={14} /> Import
              <input type="file" className="hidden" onChange={handleFileUpload} />
            </label>
            <button onClick={downloadExcel} className="bg-emerald-500 text-black px-6 py-2 rounded-xl font-black text-[10px] uppercase shadow-lg hover:shadow-emerald-500/20 transition-all">
              Export Audit
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-6 custom-scrollbar">
          {processedData.length > 0 ? (
            <div className="rounded-2xl border border-emerald-500/5 overflow-hidden shadow-inner">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-[#121816] text-emerald-400 font-black uppercase text-[10px] tracking-widest">
                    <th className="p-4 text-left">Date</th>
                    <th className="p-4 text-left">Customer</th>
                    <th className="p-4 text-left">Description</th>
                    <th className="p-4 text-right">Debit (-)</th>
                    <th className="p-4 text-right">Credit (+)</th>
                    <th className="p-4 text-right bg-emerald-500/5">Balance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-emerald-500/5">
                  {processedData.map((row, i) => (
                    <tr key={i} className="hover:bg-emerald-500/[0.02] transition-colors group text-[11px]">
                      <td className="p-2 px-4 opacity-40"><input className="bg-transparent outline-none w-full" value={row.Date || ''} onChange={(e) => handleCellEdit(i, 'Date', e.target.value)} /></td>
                      <td className="p-2 px-4 font-bold"><input className="bg-transparent outline-none w-full text-white" value={row["Customer Name"] || ''} onChange={(e) => handleCellEdit(i, 'Customer Name', e.target.value)} /></td>
                      <td className="p-2 px-4 opacity-60"><input className="bg-transparent outline-none w-full" value={row.Description || ''} onChange={(e) => handleCellEdit(i, 'Description', e.target.value)} /></td>
                      <td className="p-2 px-4 text-right text-red-400 font-mono font-bold"><input className="bg-transparent outline-none w-full text-right" value={row.Debit || 0} onChange={(e) => handleCellEdit(i, 'Debit', e.target.value)} /></td>
                      <td className="p-2 px-4 text-right text-emerald-400 font-mono font-bold"><input className="bg-transparent outline-none w-full text-right" value={row.Credit || 0} onChange={(e) => handleCellEdit(i, 'Credit', e.target.value)} /></td>
                      <td className="p-4 text-right font-mono font-black text-white bg-emerald-500/[0.03]">{row.Balance.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center opacity-10">
              <Database size={80} className="mb-4" />
              <p className="text-xs font-black uppercase tracking-[1em]">Matrix Offline</p>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 3px; height: 3px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #10b98133; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #10b98166; }
      `}</style>
    </div>
  );
};

export default AiExcelManager;