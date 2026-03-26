import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { ACTION_MANIFEST } from '../../../constants/actionManifest';
import { editorSlice } from '../editorSlice';
import { Search, X } from 'lucide-react';

export const ActionLibrary = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState("");
  const dispatch = useDispatch();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-80 bg-[#0d0d0d] border-l border-gray-800 shadow-2xl z-50 flex flex-col animate-in slide-in-from-right">
      <div className="p-4 border-b border-gray-800 flex justify-between items-center">
        <h2 className="text-white font-black text-sm uppercase tracking-widest">Library</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-white transition"><X size={18}/></button>
      </div>
      <div className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 text-gray-600" size={14} />
          <input 
            autoFocus className="w-full bg-black border border-gray-800 pl-9 pr-4 py-2 rounded text-xs outline-none focus:border-blue-600 transition-all"
            placeholder="Search action..." onChange={(e) => setQuery(e.target.value.toLowerCase())}
          />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {Object.entries(ACTION_MANIFEST)
          .filter(([key, val]) => val.label.toLowerCase().includes(query))
          .map(([key, config]) => (
            <div key={key} onClick={() => { dispatch(editorSlice.actions.addAction(key)); onClose(); }}
                 className="p-3 bg-transparent hover:bg-blue-600/10 hover:text-blue-400 cursor-pointer rounded-md text-gray-400 text-xs transition border border-transparent hover:border-blue-500/30">
              {config.label}
            </div>
          ))}
      </div>
    </div>
  );
};