// MODIFIED
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ArrowLeft, Save, Play, Smartphone, ChevronDown } from 'lucide-react';
import { toast } from 'react-hot-toast';

import { loadScriptThunk, saveScriptThunk, clearScript, fetchScriptsThunk, setCurrentName } from '../editorSlice';
import { startDeviceThunk, deviceSlice } from '@/features/dashboard/deviceSlice';

export const EditorHeader = () => {
  // const { scriptName } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Connect directly to Redux Store
  const linking = useSelector(state => state.editor.linking);
  const availableScripts = useSelector(state => state.editor.availableScripts);
  const CurrentScript = useSelector(state => state.editor.currentScriptName);
  const actions = useSelector(state => state.editor.actions);
  const deviceList = useSelector(state => state.device.list);
  const targetDevice = useSelector(state => state.device.selected);

  const [inputValue, setInputValue] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if(CurrentScript){
      loadScript(CurrentScript)
      setInputValue(CurrentScript)
    }
  }, [CurrentScript]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const loadScript = async (name)=>{
    try {
      await dispatch(loadScriptThunk(name)).unwrap();
      dispatch(setCurrentName(name))
      toast.success(`Loaded: ${name}`);
    } catch (err) {
      toast.error("Failed to load script!");
    }
  }

  const handleSelect = async (name) => {
    setShowDropdown(false);
    setInputValue(name);
    dispatch(clearScript());
    await loadScript(name)
  };

  const handleSave = async () => {
    if (!inputValue?.trim()) return toast.error("Please enter a script name!");
    const res = await dispatch(saveScriptThunk({ name: inputValue, actions }));
    if (saveScriptThunk.fulfilled.match(res)) {
      toast.success("Saved successfully!");
      dispatch(fetchScriptsThunk());
    }
  };
  const handleRun = () => {
    if (!targetDevice) return toast.error("Please select a device!");
    if (!inputValue?.trim()) return toast.error("Please save the script first!");
    
    dispatch(startDeviceThunk({ device_id: targetDevice, file_name: inputValue }))
      .unwrap()
      .then(() => toast.success("Execution started!"))
      .catch(() => toast.error("Execution failed!"));
  };

  return (
    <header className={`h-16 border-b border-white/5 bg-[#0a0a0a]/80 backdrop-blur-md flex items-center justify-between px-8 z-30 shrink-0 transition-all duration-300 ${linking ? 'pointer-events-none opacity-40' : ''}`}>
      <div className="flex items-center gap-6">
        <button onClick={() => navigate('/')} className="p-2 hover:bg-white/5 rounded-full transition-colors">
          <ArrowLeft size={20} />
        </button>
        
        <div className="flex flex-col gap-1">
          <h1 className="font-black text-blue-500 text-[10px] uppercase tracking-tighter">Script Editor</h1>
          
          <div className="relative" ref={dropdownRef}>
            <div className="flex items-center bg-black/40 border border-white/10 rounded-lg px-3 py-1 focus-within:border-blue-500 transition-colors">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => {
                  setInputValue(e.target.value);
                  setShowDropdown(true);
                }}
                onFocus={() => setShowDropdown(true)}
                placeholder="Script Name (e.g., login.json)"
                className="bg-transparent text-white font-bold text-sm outline-none w-48 placeholder:text-gray-600"
              />
              <ChevronDown size={14} className="text-gray-500 cursor-pointer" onClick={() => setShowDropdown(!showDropdown)}/>
            </div>

            {showDropdown && availableScripts.length > 0 && (
              <div className="absolute top-full left-0 mt-2 w-full bg-[#111] border border-white/10 rounded-lg shadow-2xl z-50 max-h-56 overflow-y-auto custom-scrollbar">
                {availableScripts
                  .filter(s => s.toLowerCase().includes(inputValue.toLowerCase()))
                  .map(s => (
                    <div
                      key={s}
                      onClick={() => handleSelect(s)}
                      className="px-4 py-2 text-sm font-medium text-gray-300 hover:bg-blue-600 hover:text-white cursor-pointer transition-colors"
                    >
                      {s}
                    </div>
                  ))}
                {availableScripts.filter(s => s.toLowerCase().includes(inputValue.toLowerCase())).length === 0 && (
                  <div className="px-4 py-2 text-xs text-gray-500 italic">Will create new on Save</div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 bg-black/40 border border-white/5 px-4 py-2 rounded-2xl">
        <Smartphone size={14} className="text-gray-500" />
        <select
          value={targetDevice || ""}
          onChange={(e) => dispatch(deviceSlice.actions.setSelectedDevice(e.target.value))}
          className="bg-transparent text-[10px] font-bold outline-none text-blue-400 uppercase tracking-widest cursor-pointer"
        >
          <option value="" disabled>Select Device</option>
          {deviceList.map(device => (
            <option key={device} value={device}>
              {device.toString().slice(0,15)}
            </option>
          ))}
        </select>
      </div>

      <div className="flex gap-3">
        <button onClick={handleSave} className="bg-gray-900 border border-white/10 hover:border-blue-500/50 px-6 py-2 rounded-xl text-[10px] font-black uppercase transition-all flex items-center gap-2 tracking-widest">
          <Save size={14} /> Save
        </button>
        <button 
          onClick={handleRun}
          disabled={!targetDevice}
          className="bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 disabled:cursor-not-allowed px-6 py-2 rounded-xl text-[10px] font-black text-white uppercase transition-all shadow-lg shadow-blue-600/20 flex items-center gap-2 tracking-widest"
        >
          <Play size={14} /> Push & Run
        </button>
      </div>
    </header>
  );
};