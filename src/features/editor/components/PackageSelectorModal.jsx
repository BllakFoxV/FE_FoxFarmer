import React, { useState } from 'react';
import { Search, X, Smartphone } from 'lucide-react';

export const PackageSelectorModal = ({ packages, onSelect, onClose }) => {
  const [query, setQuery] = useState("");
  const filtered = packages.filter(a => a.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="fixed inset-0 z-[300] bg-black/80 flex items-center justify-center p-4">
      <div className="bg-[#0d0d0d] border border-gray-800 w-full max-w-md rounded-xl flex flex-col max-h-[70vh]">
        <div className="p-4 border-b border-gray-800 flex justify-between items-center">
          <h3 className="text-blue-500 font-black text-xs uppercase tracking-widest">Select Package</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-white"><X size={18}/></button>
        </div>
        <div className="p-3">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-gray-600" size={14} />
            <input 
              autoFocus className="w-full bg-black border border-gray-800 pl-9 pr-4 py-2 rounded text-xs outline-none focus:border-blue-600"
              placeholder="Search package..." onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
          {filtered.map(pkg => (
            <div 
              key={pkg} 
              onClick={() => onSelect(pkg)}
              className="p-3 hover:bg-blue-600/10 hover:text-blue-400 cursor-pointer rounded text-gray-400 text-[11px] font-mono border border-transparent hover:border-blue-500/30 truncate"
            >
              {pkg}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};