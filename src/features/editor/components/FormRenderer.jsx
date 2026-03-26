import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { editorSlice } from '../editorSlice';
import { ACTION_MANIFEST } from '../../../constants/actionManifest';

export const FormRenderer = ({ action, onOpenPicker }) => {
  const dispatch = useDispatch();
  const config = ACTION_MANIFEST[action.type];

  const handleChange = (key, value) => {
    dispatch(editorSlice.actions.updateData({
      id: action.id,
      data: { [key]: value }
    }));
  };

  if (!config) return <div className="p-4 bg-red-950 text-red-400 rounded-lg text-[10px] font-bold">MANIFEST_ERROR: {action.type}</div>;

  return (
    <div className="grid grid-cols-2 gap-x-8 gap-y-4 mt-6">
      {config.fields.map((field) => {
        if (field.type === 'hidden') return null;
        const value = action.data[field.key] ?? field.default ?? '';

        return (
          <div key={field.key} className="flex flex-col gap-2">
            <label className="text-[10px] text-gray-600 uppercase font-black tracking-widest">
              {field.label || field.key}
            </label>
            
            {field.type === 'text' || field.type === 'number' ? (
              <input 
                type={field.type}
                className="bg-[#050505] border border-gray-800 rounded-lg px-3 py-2 text-xs text-blue-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                value={value}
                onChange={(e) => handleChange(field.key, field.type === 'number' ? Number(e.target.value) : e.target.value)}
              />
            ) : field.type === 'toggle' ? (
              <div 
                onClick={() => handleChange(field.key, !value)}
                className={`w-12 h-6 rounded-full relative cursor-pointer transition-colors duration-300 ${value ? 'bg-blue-600' : 'bg-gray-800'}`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 ${value ? 'left-7' : 'left-1'}`} />
              </div>
            ) : field.type === 'select' ? (
              <select 
                className="bg-[#050505] border border-gray-800 rounded-lg px-3 py-2 text-xs text-blue-300 outline-none focus:border-blue-500 transition-all cursor-pointer"
                value={value}
                onChange={(e) => handleChange(field.key, e.target.value)}
              >
                {field.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            ) : field.type === 'picker' ? (
              <button 
                onClick={() => onOpenPicker(action.id)}
                className={`py-2 rounded-lg text-[10px] font-black border transition-all ${value ? 'bg-blue-600/10 border-blue-500 text-blue-400' : 'bg-gray-900 border-gray-800 text-gray-500 hover:border-gray-600'}`}
              >
                {value ? "RE-MAP AREA" : "OPEN SNAPSHOT PICKER"}
              </button>
            ) : field.type === 'link' ? (
              <button 
                onClick={() => dispatch(editorSlice.actions.setLinkMode({ id: action.id, field: field.key }))}
                className={`py-2 rounded-lg text-[10px] font-black border transition-all uppercase tracking-tighter ${value ? 'bg-green-600/10 border-green-500 text-green-400' : 'bg-yellow-600/10 border-yellow-500 text-yellow-500 hover:scale-[1.02]'}`}
              >
                {value ? `Target -> ${value.slice(0, 8)}` : "Click to set Jump Point"}
              </button>
            ) : null}
          </div>
        );
      })}
    </div>
  );
};