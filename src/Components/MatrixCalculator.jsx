import React, { useState, useEffect } from 'react';
import { Cpu, Delete, Hash, ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const MatrixCalculator = () => {
  const [display, setDisplay] = useState('');
  const [result, setResult] = useState('');

  const buttons = [
    '7', '8', '9', '/', 
    '4', '5', '6', '*', 
    '1', '2', '3', '-', 
    '0', '.', '=', '+'
  ];

  // Logic to calculate result
  const calculateResult = (currentDisplay) => {
    try {
      if (!currentDisplay) return;
      // eval is used for simplicity, for production consider a math library
      const evalResult = eval(currentDisplay).toString();
      setResult(evalResult);
    } catch {
      setResult("ERROR");
    }
  };

  const handleAction = (val) => {
    if (val === '=') {
      calculateResult(display);
    } else {
      setDisplay(prev => prev + val);
      setResult(''); // Clear result when new input starts
    }
  };

  const clear = () => {
    setDisplay('');
    setResult('');
  };

  const backspace = () => {
    setDisplay(prev => prev.slice(0, -1));
    setResult('');
  };

  // --- KEYBOARD SUPPORT LOGIC ---
  useEffect(() => {
    const handleKeyDown = (event) => {
      const { key } = event;

      // Numbers and Operators
      if (/^[0-9+\-*/.]/.test(key)) {
        event.preventDefault();
        handleAction(key);
      } 
      // Enter key for result
      else if (key === 'Enter') {
        event.preventDefault();
        handleAction('=');
      } 
      // Backspace for delete
      else if (key === 'Backspace') {
        event.preventDefault();
        backspace();
      } 
      // Escape to clear all
      else if (key === 'Escape') {
        event.preventDefault();
        clear();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [display]); // Re-bind when display changes to get latest state

  return (
    <div className="min-h-screen bg-[#010604] flex items-center justify-center p-4 font-mono">
      {/* Background Glow */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-900/10 via-black to-black pointer-events-none" />

      <div className="relative w-full max-w-md bg-black/60 backdrop-blur-3xl border border-emerald-500/20 rounded-[3rem] p-8 shadow-[0_0_100px_rgba(16,185,129,0.1)]">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <Link to="/dashboard" className="text-emerald-500/50 hover:text-emerald-500 transition-colors">
            <ChevronLeft size={24} />
          </Link>
          <div className="flex items-center gap-2 text-emerald-500">
            <Cpu size={18} className="animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Neural Math Processor</span>
          </div>
          <Hash size={18} className="text-emerald-500/20" />
        </div>

        {/* Screen */}
        <div className="bg-[#020806] border border-emerald-500/10 rounded-2xl p-6 mb-6 text-right relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-emerald-500/20 animate-scan" />
          <div className="text-emerald-500/40 text-[10px] mb-1 h-4 uppercase tracking-[0.2em]">Input Trace: {display}</div>
          <div className="text-emerald-400 text-4xl font-black tracking-tighter truncate">
            {result || display || '0'}
          </div>
        </div>

        {/* Keypad */}
        <div className="grid grid-cols-4 gap-4">
          <button 
            onClick={clear}
            className="col-span-2 bg-red-500/10 border border-red-500/20 text-red-500 py-4 rounded-xl font-black hover:bg-red-500/20 transition-all uppercase text-[10px] tracking-widest"
          >
            Purge Memory (Esc)
          </button>
          <button 
            onClick={backspace}
            className="col-span-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 py-4 rounded-xl flex items-center justify-center hover:bg-emerald-500/20 transition-all"
          >
            <Delete size={20} />
          </button>

          {buttons.map((btn) => (
            <button
              key={btn}
              onClick={() => handleAction(btn)}
              className={`py-6 rounded-2xl font-bold text-xl transition-all active:scale-95 shadow-lg ${
                btn === '=' 
                ? 'bg-emerald-500 text-black hover:bg-emerald-400 shadow-emerald-500/40' 
                : 'bg-black/40 border border-emerald-500/10 text-emerald-100 hover:border-emerald-500/40 hover:bg-emerald-500/5'
              }`}
            >
              {btn}
            </button>
          ))}
        </div>

        {/* Footer Decal */}
        <div className="mt-8 text-center">
          <p className="text-[8px] text-emerald-500/20 uppercase tracking-[1em] font-bold">Matrix Computational Unit v2.0</p>
        </div>
      </div>
    </div>
  );
};

export default MatrixCalculator;