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
    { role: 'ai', text: "Assalam-o-Alaikum! Beer AI Vision active hai. Ab aap khatay ki photo phenkein ya handwritten data, main sab set kar doonga!" }
  ]);
  const [excelData, setExcelData] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => chatEndRef.current?.scrollIntoView({ behavior: "smooth" }), [messages]);

  // 🔥 Calculation Engine
  const processedData = useMemo(() => {
    let currentBalance = 0;
    return excelData.map((row) => {
      const credit = parseFloat(row.Credit) || 0;
      const debit = parseFloat(row.Debit) || 0;
      currentBalance = currentBalance + credit - debit;
      return { ...row, Balance: currentBalance };
    });
  }, [excelData]);

  // 📸 Vision Handler: Image se data nikalne ke liye
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsTyping(true);
    setMessages(prev => [...prev, { role: 'ai', text: "Bhai, photo scan kar raha hoon, thora sabar..." }]);

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64Image = reader.result;
      
      try {
        const response = await groq.chat.completions.create({
          messages: [
            {
              role: "user",
              content: [
                { type: "text", text: "Analyze this image. If it's a financial ledger, handwritten accounts, or excel-style data, extract it into a JSON array with keys: Date, Customer Name, Description, Debit, Credit. If it's a random image (car, person, animal, etc.) that isn't a ledger, strictly respond with: 'NOT_A_LEDGER'." },
                { type: "image_url", image_url: { url: base64Image } }
              ]
            }
          ],
          model: "llama-3.2-11b-vision-preview",
        });

        const result = response.choices[0].message.content;

        if (result.includes("NOT_A_LEDGER")) {
          setMessages(prev => [...prev, { role: 'ai', text: "Bhai, ye kya bhej diya? Main sirf khata entry kar sakta hoon, gariyan ya random photos nahi!" }]);
        } else {
          // Extract JSON from AI response
          const jsonMatch = result.match(/\[[\s\S]*\]/);
          if (jsonMatch) {
            const newData = JSON.parse(jsonMatch[0]);
            setExcelData(prev => [...prev, ...newData]);
            setMessages(prev => [...prev, { role: 'ai', text: "Zabardast! Photo se data nikaal kar table mein charha diya hai. Check kar lo!" }]);
          }
        }
      } catch (err) {
        setMessages(prev => [...prev, { role: 'ai', text: "Yaar photo parhne mein masla hua. Dubara kheencho saaf si?" }]);
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
          {
            role: "system",
            content: "You are 'Beer AI'. Expert Accountant. Return [MESSAGE]: and [DATA]: JSON array. Never change 'Balance' field."
          },
          {
            role: "user",
            content: `Data: ${JSON.stringify(excelData)}\nTask: ${userQuery}`
          }
        ],
        model: "llama-3.3-70b-versatile",
        temperature: 0.1,
      });

      const raw = chatCompletion.choices[0]?.message?.content || "";
      const dataMatch = raw.match(/\[DATA\]:(\s*\[[\s\S]*\])/);
      const msgMatch = raw.match(/\[MESSAGE\]:(.*?)(\[DATA\]|$)/s);

      if (dataMatch) {
        setExcelData(JSON.parse(dataMatch[1].trim()));
        setMessages(prev => [...prev, { role: 'ai', text: msgMatch ? msgMatch[1].trim() : "Update ho gaya!" }]);
      }
    } catch (err) {
      setMessages(prev => [...prev, { role: 'ai', text: "Bhai dimaag ghoom gaya, phir se bolo?" }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-[#010302] p-4 gap-6 text-zinc-200 overflow-hidden font-sans">
      
      {/* 🟢 Sidebar: AI Chat */}
      <div className="w-full lg:w-80 flex flex-col bg-[#0b0f0e] rounded-[2rem] border border-emerald-500/10 shadow-2xl">
        <div className="p-6 border-b border-emerald-500/5 flex items-center gap-2">
          <BrainCircuit className="text-emerald-400" size={20} />
          <span className="text-xs font-black uppercase tracking-widest text-emerald-400">Beer AI Vision</span>
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

        <div className="p-4 bg-black/20 flex flex-col gap-2">
          <div className="flex gap-2">
            <input 
              className="flex-1 bg-[#020403] border border-emerald-500/20 rounded-xl px-3 text-xs outline-none focus:border-emerald-500"
              placeholder="Command do..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            <button onClick={handleSend} className="bg-emerald-500 p-2.5 rounded-xl text-black">
              <Send size={14} />
            </button>
          </div>
          
          {/* Photo Upload Button */}
          <label className="flex items-center justify-center gap-2 cursor-pointer bg-white/5 border border-dashed border-emerald-500/30 p-2 rounded-xl text-[10px] hover:bg-emerald-500/10 transition-all uppercase font-bold text-emerald-400">
            <Camera size={14} /> Scan Hand-written/Image
            <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
          </label>
        </div>
      </div>

      {/* 🔵 Data Matrix */}
      <div className="flex-1 flex flex-col bg-[#0b0f0e] rounded-[2.5rem] border border-emerald-500/10 overflow-hidden shadow-2xl">
        <div className="p-6 flex justify-between items-center bg-emerald-500/[0.02] border-b border-emerald-500/5">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-emerald-500/10 rounded-lg"><TableIcon className="text-emerald-500" size={20} /></div>
            <h2 className="text-sm font-black uppercase tracking-widest">Financial Matrix</h2>
          </div>
          <button onClick={() => {
             const ws = XLSX.utils.json_to_sheet(processedData);
             const wb = XLSX.utils.book_new();
             XLSX.utils.book_append_sheet(wb, ws, "Ledger");
             XLSX.writeFile(wb, "Beer_Ledger.xlsx");
          }} className="bg-emerald-500 text-black px-6 py-2 rounded-xl font-black text-[10px] uppercase shadow-lg">
            Export Audit
          </button>
        </div>

        <div className="flex-1 overflow-auto p-6 custom-scrollbar">
          {processedData.length > 0 ? (
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-[#121816] text-emerald-400 font-black uppercase text-[10px] tracking-widest">
                  <th className="p-4 text-left">Date</th>
                  <th className="p-4 text-left">Customer</th>
                  <th className="p-4 text-left">Description</th>
                  <th className="p-4 text-right">Debit</th>
                  <th className="p-4 text-right">Credit</th>
                  <th className="p-4 text-right bg-emerald-500/5">Balance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-emerald-500/5">
                {processedData.map((row, i) => (
                  <tr key={i} className="hover:bg-emerald-500/[0.02] text-[11px]">
                    <td className="p-2 px-4 opacity-40">{row.Date || '-'}</td>
                    <td className="p-2 px-4 font-bold text-white">{row["Customer Name"] || '-'}</td>
                    <td className="p-2 px-4 opacity-60">{row.Description || '-'}</td>
                    <td className="p-2 px-4 text-right text-red-400">{row.Debit || 0}</td>
                    <td className="p-2 px-4 text-right text-emerald-400">{row.Credit || 0}</td>
                    <td className="p-4 text-right font-black text-white bg-emerald-500/[0.03]">{row.Balance.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="h-full flex flex-col items-center justify-center opacity-10">
              <ImageIcon size={60} className="mb-2" />
              <p className="text-[10px] font-black uppercase tracking-[0.5em]">Upload image or file to start</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AiExcelManager;