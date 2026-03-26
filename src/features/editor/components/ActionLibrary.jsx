import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { ACTION_MANIFEST } from '../../../constants/actionManifest';
import { editorSlice } from '../editorSlice';
import { Search, X, ChevronRight } from 'lucide-react';

export const ActionLibrary = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState("");
  const dispatch = useDispatch();

  if (!isOpen) return null;

  const filteredActions = Object.entries(ACTION_MANIFEST).filter(([key, val]) => 
    val.label.toLowerCase().includes(query.toLowerCase()) || key.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-y-0 right-0 w-96 bg-[#0a0a0a] border-l border-gray-800 shadow-[0_0_50px_rgba(0,0,0,0.8)] z-[60] flex flex-col animate-in slide-in-from-right duration-300">
      <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-[#0d0d0d]">
        <div>
          <h2 className="text-xl font-black text-white uppercase tracking-tighter">Action Library</h2>
          <p className="text-[10px] text-gray-500 font-mono mt-1">Select a component to inject</p>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-gray-800 rounded-lg text-gray-400 hover:text-white transition-colors">
          <X size={20}/>
        </button>
      </div>

      <div className="p-6">
        <div className="relative group">
          <Search className="absolute left-3 top-3 text-gray-600 group-focus-within:text-blue-500 transition-colors" size={18} />
          <input 
            autoFocus
            className="w-full bg-[#121212] text-sm pl-12 pr-4 py-3 rounded-xl border border-gray-800 focus:border-blue-600 outline-none transition-all placeholder:text-gray-700"
            placeholder="Search by type or label..."
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-10 space-y-2 custom-scrollbar">
        {filteredActions.map(([key, config]) => (
          <div 
            key={key} 
            onClick={() => {
              dispatch(editorSlice.actions.addAction(key));
              onClose();
            }}
            className="group p-4 bg-[#0d0d0d] hover:bg-blue-600/10 border border-gray-800 hover:border-blue-500/50 cursor-pointer rounded-2xl transition-all flex items-center justify-between"
          >
            <div>
              <h4 className="text-sm font-bold text-gray-200 group-hover:text-blue-400 transition-colors">{config.label}</h4>
              <p className="text-[9px] text-gray-600 font-mono mt-1 uppercase tracking-widest">{key}</p>
            </div>
            <ChevronRight size={16} className="text-gray-800 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
          </div>
        ))}
        {filteredActions.length === 0 && (
          <p className="text-center text-gray-600 text-xs mt-10 italic">No matching actions found</p>
        )}
      </div>
    </div>
  );
};