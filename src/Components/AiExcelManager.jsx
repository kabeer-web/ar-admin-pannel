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
    { role: 'ai', text: "Assalam-o-Alaikum bhai! Neural Core active hai. Excel file phenko ya command do, mil kar dhanda set karte hain." }
  ]);
  const [excelData, setExcelData] = useState([]);
  const [fileName, setFileName] = useState("AR_Ledger.xlsx");
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
      setMessages(prev => [...prev, { role: 'ai', text: `Bhai file mil gayi! ${data.length} entries hain isme. Batao kya karun?` }]);
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
            content: `You are a friendly, expert Accountant. Talk in Hinglish (Urdu/Hindi + English). 
            Be conversational, not robotic. 
            Analyze the data and provide:
            1. A friendly response about what you did.
            2. The updated data in JSON format.
            Format your response like this:
            [MESSAGE]: Your friendly talk here.
            [DATA]: [{ "Date": "...", "Customer Name": "...", "Bill No": "...", "Credit": 0, "Debit": 0, "Balance": 0 }]`
          },
          {
            role: "user",
            content: `Current Data: ${JSON.stringify(excelData)}\nUser Command: ${userQuery}`
          }
        ],
        model: "llama-3.3-70b-versatile",
        temperature: 0.7, // Thora "creativity" taake robotic na lage
      });

      let fullResponse = chatCompletion.choices[0]?.message?.content || "";
      
      // Extracting Message and Data
      const msgPart = fullResponse.split("[DATA]")[0].replace("[MESSAGE]:", "").trim();
      const dataPart = fullResponse.match(/\[[\s\S]*\]/);

      if (dataPart) setExcelData(JSON.parse(dataPart[0]));
      setMessages(prev => [...prev, { role: 'ai', text: msgPart || "Bhai, update kar diya hai, check kar lo!" }]);

    } catch (err) {
      setMessages(prev => [...prev, { role: 'ai', text: "Maaf karna bhai, kuch samajh nahi aya. Dobara bolna?" }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-[#050706] p-4 gap-4 overflow-hidden text-white font-sans">
      
      {/* Sidebar Chat - High Visibility */}
      <div className="w-full lg:w-1/4 flex flex-col bg-[#111814] rounded-[1.5rem] border border-emerald-500/20 shadow-xl overflow-hidden">
        <div className="p-5 border-b border-emerald-500/10 flex items-center gap-2 bg-emerald-500/5">
          <BrainCircuit className="text-emerald-400" size={22} />
          <span className="text-xs font-black uppercase tracking-widest text-emerald-400">AI Partner</span>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`p-4 rounded-2xl max-w-[90%] text-[13px] leading-relaxed shadow-lg ${
                msg.role === 'user' ? 'bg-emerald-600 text-white border-b-none' : 'bg-[#1a241f] text-emerald-50 border border-emerald-500/10'
              }`}>
                {msg.text}
              </div>
            </div>
          ))}
          {isTyping && <div className="flex gap-1 p-2"><div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce"></div><div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce [animation-delay:-.3s]"></div><div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce [animation-delay:-.5s]"></div></div>}
          <div ref={chatEndRef} />
        </div>

        <div className="p-4 bg-black/40 border-t border-emerald-500/10">
          <div className="flex gap-2 bg-[#050706] p-2 rounded-xl border border-emerald-500/30 focus-within:border-emerald-400 transition-all">
            <input 
              className="flex-1 bg-transparent border-none outline-none px-2 text-sm text-white placeholder-emerald-900"
              placeholder="Bhai se baat karo..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            <button onClick={handleSend} className="bg-emerald-500 p-2.5 rounded-lg text-black hover:bg-white active:scale-95 transition-all shadow-md">
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Professional Grid - Super Clean */}
      <div className="w-full lg:w-3/4 flex flex-col bg-[#111814] rounded-[1.5rem] border border-emerald-500/20 overflow-hidden shadow-2xl">
        <div className="p-5 border-b border-emerald-500/10 flex justify-between items-center bg-black/20">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/10 rounded-lg"><TableIcon className="text-emerald-400" size={20} /></div>
            <h2 className="text-sm font-black text-white uppercase tracking-tighter">Business Matrix</h2>
          </div>
          <div className="flex gap-3">
            <label className="flex items-center gap-2 cursor-pointer bg-[#1a241f] px-4 py-2 rounded-xl border border-emerald-500/20 hover:bg-emerald-500 hover:text-black transition-all text-xs font-bold">
              <FileUp size={16} /> Upload
              <input type="file" className="hidden" onChange={handleFileUpload} />
            </label>
            <button onClick={() => XLSX.writeFile(XLSX.utils.book_append_sheet(XLSX.utils.book_new(), XLSX.utils.json_to_sheet(excelData), "Sheet1"), fileName)} className="bg-emerald-500 text-black px-6 py-2 rounded-xl font-black text-xs uppercase hover:bg-white active:scale-95 transition-all shadow-lg">
              Export Excel
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-4 bg-[#0a0f0d]">
          {excelData.length > 0 ? (
            <div className="rounded-xl border border-emerald-500/10 overflow-hidden bg-[#111814]">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-emerald-600 text-black font-black uppercase text-[11px] tracking-widest">
                    <th className="p-4 text-left">Date</th>
                    <th className="p-4 text-left">Customer Name</th>
                    <th className="p-4 text-left">Bill No</th>
                    <th className="p-4 text-right">Credit (+)</th>
                    <th className="p-4 text-right">Debit (-)</th>
                    <th className="p-4 text-right bg-emerald-700">Balance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-emerald-500/5">
                  {excelData.map((row, i) => (
                    <tr key={i} className="hover:bg-emerald-500/5 transition-all">
                      <td className="p-1"><input className="w-full p-3 bg-transparent outline-none text-emerald-100/70" value={row["Date"] || ""} onChange={(e) => handleCellEdit(i, "Date", e.target.value)} /></td>
                      <td className="p-1"><input className="w-full p-3 bg-transparent outline-none font-bold text-white" value={row["Customer Name"] || ""} onChange={(e) => handleCellEdit(i, "Customer Name", e.target.value)} /></td>
                      <td className="p-1"><input className="w-full p-3 bg-transparent outline-none text-center opacity-50" value={row["Bill No"] || ""} onChange={(e) => handleCellEdit(i, "Bill No", e.target.value)} /></td>
                      <td className="p-1"><input className="w-full p-3 bg-transparent outline-none text-right font-black text-emerald-400" value={row["Credit"] || 0} onChange={(e) => handleCellEdit(i, "Credit", e.target.value)} /></td>
                      <td className="p-1"><input className="w-full p-3 bg-transparent outline-none text-right font-black text-red-400" value={row["Debit"] || 0} onChange={(e) => handleCellEdit(i, "Debit", e.target.value)} /></td>
                      <td className="p-4 text-right font-black text-white bg-emerald-500/5">{row["Balance"] || 0}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center space-y-4">
              <Database size={50} className="text-emerald-900 animate-pulse" />
              <p className="text-xs font-bold uppercase tracking-[0.4em] text-emerald-800">No Active Matrix</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AiExcelManager;