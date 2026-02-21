import React, { useState, useRef, useEffect, useMemo } from 'react';
import * as XLSX from 'xlsx';
import { 
  Send, Download, BrainCircuit, FileUp, Database, 
  Table as TableIcon, Loader2, TrendingUp, Camera, Image as ImageIcon 
} from 'lucide-react';
import Groq from "groq-sdk";

const groq = new Groq({ 
  apiKey: import.meta.env.VITE_GROQ_API_KEY, 
  dangerouslyAllowBrowser: true 
});

const AiExcelManager = () => {
  const [messages, setMessages] = useState([
    { role: 'ai', text: "Beer AI v5.2 Live! Excel Upload + Image Scan + Chat sab on hai. Ab galti nahi hogi bhai!" }
  ]);
  const [excelData, setExcelData] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => chatEndRef.current?.scrollIntoView({ behavior: "smooth" }), [messages]);

  // 📈 Smart Balance Engine
  const processedData = useMemo(() => {
    let currentBalance = 0;
    return excelData.map((row) => {
      const credit = parseFloat(row.Credit) || 0;
      const debit = parseFloat(row.Debit) || 0;
      currentBalance = currentBalance + credit - debit;
      return { ...row, Balance: currentBalance };
    });
  }, [excelData]);

  // 📂 EXCEL UPLOAD FEATURE (Wapas Aa Gaya!)
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const wb = XLSX.read(evt.target.result, { type: 'binary' });
        const data = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
        setExcelData(data);
        setMessages(prev => [...prev, { role: 'ai', text: `Bhai, ${data.length} records Excel se load ho gaye hain!` }]);
      } catch (err) {
        setMessages(prev => [...prev, { role: 'ai', text: "Excel file mein locha hai!" }]);
      }
    };
    reader.readAsBinaryString(file);
  };

  // 📸 IMAGE/HANDWRITTEN SCAN
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setIsTyping(true);
    setMessages(prev => [...prev, { role: 'ai', text: "Bhai photo scan ho rahi hai..." }]);

    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        const response = await groq.chat.completions.create({
          messages: [
            {
              role: "user",
              content: [
                { type: "text", text: "Convert this ledger image to JSON array. Keys: Date, Customer Name, Description, Debit, Credit. If not a ledger, reply 'NOT_A_LEDGER'." },
                { type: "image_url", image_url: { url: reader.result } }
              ]
            }
          ],
          model: "llama-3.2-11b-vision-preview",
        });

        const result = response.choices[0].message.content;
        if (result.includes("NOT_A_LEDGER")) {
          setMessages(prev => [...prev, { role: 'ai', text: "Bhai ye khata nahi hai, saaf photo bhejo." }]);
        } else {
          const jsonMatch = result.match(/\[[\s\S]*\]/);
          if (jsonMatch) {
            setExcelData(prev => [...prev, ...JSON.parse(jsonMatch[0])]);
            setMessages(prev => [...prev, { role: 'ai', text: "Photo ka data table mein charha diya hai!" }]);
          }
        }
      } catch (err) {
        setMessages(prev => [...prev, { role: 'ai', text: "Groq API Limit ya Error! Choti size ki photo try karein." }]);
      } finally {
        setIsTyping(false);
      }
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
          { role: "system", content: "You are 'Beer AI'. Expert Accountant. Return [MESSAGE]: and [DATA]: JSON array." },
          { role: "user", content: `Data: ${JSON.stringify(excelData)}\nTask: ${userQuery}` }
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
    } catch (err) {
      setMessages(prev => [...prev, { role: 'ai', text: "Processing error!" }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-[#010302] p-4 gap-6 text-zinc-200 overflow-hidden font-sans">
      
      {/* 🟢 Sidebar */}
      <div className="w-full lg:w-80 flex flex-col bg-[#0b0f0e] rounded-[2rem] border border-emerald-500/10 shadow-2xl overflow-hidden">
        <div className="p-6 border-b border-emerald-500/5 flex items-center gap-2">
          <BrainCircuit className="text-emerald-400" size={20} />
          <span className="text-xs font-black uppercase tracking-widest text-emerald-400">Beer AI Core</span>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
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
          <div className="flex gap-2 bg-[#020403] p-1.5 rounded-xl border border-emerald-500/20 focus-within:border-emerald-500">
            <input className="flex-1 bg-transparent border-none outline-none px-3 text-xs" placeholder="Hukum..." value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSend()} />
            <button onClick={handleSend} className="bg-emerald-500 p-2.5 rounded-lg text-black"><Send size={14} /></button>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <label className="flex items-center justify-center gap-2 cursor-pointer border border-emerald-500/20 p-2 rounded-xl text-[10px] text-emerald-400 font-bold uppercase hover:bg-emerald-500/5 transition-all">
              <FileUp size={14} /> Excel
              <input type="file" accept=".xlsx, .xls, .csv" className="hidden" onChange={handleFileUpload} />
            </label>
            <label className="flex items-center justify-center gap-2 cursor-pointer border border-emerald-500/20 p-2 rounded-xl text-[10px] text-emerald-400 font-bold uppercase hover:bg-emerald-500/5 transition-all">
              <Camera size={14} /> Scan
              <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
            </label>
          </div>
        </div>
      </div>

      {/* 🔵 Financial Matrix */}
      <div className="flex-1 flex flex-col bg-[#0b0f0e] rounded-[2.5rem] border border-emerald-500/10 shadow-2xl overflow-hidden">
        <div className="p-6 flex justify-between items-center bg-emerald-500/[0.02] border-b border-emerald-500/5">
          <div className="flex items-center gap-4">
            <TrendingUp className="text-emerald-500" size={24} />
            <h2 className="text-sm font-black uppercase tracking-widest text-white">Financial Matrix</h2>
          </div>
          <button onClick={() => {
            const ws = XLSX.utils.json_to_sheet(processedData);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "Ledger");
            XLSX.writeFile(wb, "Beer_Ledger.xlsx");
          }} className="bg-emerald-500 text-black px-6 py-2 rounded-xl font-black text-[10px] uppercase">Export File</button>
        </div>

        <div className="flex-1 overflow-auto p-6">
          {processedData.length > 0 ? (
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-[#121816] text-emerald-400 font-black uppercase text-[10px] tracking-widest border-b border-emerald-500/10">
                  <th className="p-4 text-left">Date</th>
                  <th className="p-4 text-left">Customer</th>
                  <th className="p-4 text-left">Description</th>
                  <th className="p-4 text-right">Debit</th>
                  <th className="p-4 text-right">Credit</th>
                  <th className="p-4 text-right bg-emerald-500/5 text-white">Balance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-emerald-500/5">
                {processedData.map((row, i) => (
                  <tr key={i} className="hover:bg-emerald-500/[0.02] text-[11px] transition-colors">
                    <td className="p-4 opacity-50">{row.Date || '-'}</td>
                    <td className="p-4 font-bold text-white uppercase">{row["Customer Name"] || '-'}</td>
                    <td className="p-4 opacity-70 italic">{row.Description || '-'}</td>
                    <td className="p-4 text-right text-red-400 font-mono">-{row.Debit || 0}</td>
                    <td className="p-4 text-right text-emerald-400 font-mono">+{row.Credit || 0}</td>
                    <td className="p-4 text-right font-black text-white bg-emerald-500/[0.03] font-mono">{row.Balance.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="h-full flex flex-col items-center justify-center opacity-10">
              <Database size={60} className="mb-2 text-emerald-500" />
              <p className="text-[10px] font-black uppercase tracking-[0.5em]">Excel or Image Matrix Empty</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AiExcelManager;