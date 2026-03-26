import React from 'react';
import { useDispatch } from 'react-redux';
import { editorSlice } from '../editorSlice';
import { ACTION_MANIFEST } from '../../../constants/actionManifest';

export const FormRenderer = ({ action, onOpenPicker }) => {
  const dispatch = useDispatch();
  const config = ACTION_MANIFEST[action.type];

  const update = (key, val) => {
    dispatch(editorSlice.actions.updateData({ id: action.id, data: { [key]: val } }));
  };

  if (!config) return <div className="text-red-500 text-[10px]">Action Error</div>;

  return (
    <div className="grid grid-cols-2 gap-x-6 gap-y-3 mt-4 animate-in fade-in duration-300">
      {config.fields.map((field) => {
        if (field.type === 'hidden') return null;
        const val = action.data?.[field.key] ?? field.default ?? '';

        return (
          <div key={field.key} className="flex flex-col gap-1">
            <label className="text-[9px] text-gray-600 uppercase font-black">{field.label || field.key}</label>
            
            {field.type === 'text' || field.type === 'number' ? (
              <input 
                type={field.type}
                className="bg-black border border-gray-800 rounded px-2 py-1.5 text-xs text-blue-400 outline-none focus:border-blue-600 transition-all"
                value={val}
                onChange={(e) => update(field.key, field.type === 'number' ? Number(e.target.value) : e.target.value)}
              />
            ) : field.type === 'select' ? (
              <select 
                className="bg-black border border-gray-800 rounded px-2 py-1.5 text-xs text-blue-400 outline-none cursor-pointer"
                value={val}
                onChange={(e) => update(field.key, e.target.value)}
              >
                <option value="" disabled>Select...</option>
                {field.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            ) : field.type === 'toggle' ? (
              <div 
                onClick={() => update(field.key, !val)}
                className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors ${val ? 'bg-blue-600' : 'bg-gray-800'}`}
              >
                <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${val ? 'left-6' : 'left-1'}`} />
              </div>
            ) : field.type === 'picker' ? (
              <button 
                onClick={() => onOpenPicker(action.id)}
                className={`py-1.5 rounded text-[10px] font-bold border transition-all ${val ? 'bg-blue-600/20 border-blue-500 text-blue-400' : 'bg-gray-900 border-gray-800 text-gray-500 hover:border-blue-500'}`}
              >
                {val ? "Region Defined" : "Pick on Screen"}
              </button>
            ) : field.type === 'link' ? (
              <button 
                onClick={() => dispatch(editorSlice.actions.setLinkMode({ id: action.id, field: field.key }))}
                className={`py-1.5 rounded text-[10px] font-bold border transition-all ${val ? 'bg-green-600/20 border-green-500 text-green-400' : 'bg-yellow-600/20 border-yellow-500 text-yellow-500 hover:scale-[1.02]'}`}
              >
                {val ? `-> Step: ${val.slice(0, 8)}` : "Select Target Action"}
              </button>
            ) : null}
          </div>
        );
      })}
    </div>
  );
};