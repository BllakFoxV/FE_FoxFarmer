import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { toast } from 'react-hot-toast';
import { ArrowLeft, Save, Play, Plus, Smartphone, XCircle, ChevronDown } from 'lucide-react';

import {
  fetchScriptsThunk,
  loadScriptThunk,
  saveScriptThunk,
  getScreenshotThunk,
  editorSlice
} from './editorSlice';
import { ActionRow } from './components/ActionRow';
import { ActionLibrary } from './components/ActionLibrary';
import { VisualPickerModal } from './components/VisualPickerModal';

export const Editor = () => {
  const { scriptName } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { actions, linking, loading, currentScreenshot, availableScripts } = useSelector(state => state.editor);

  const [isLibOpen, setIsLibOpen] = useState(false);
  const [targetDevice, setTargetDevice] = useState("emulator-5554");
  const [picker, setPicker] = useState({ open: false, actionId: null, context: null });

  // --- LOGIC COMBOBOX ---
  const [inputValue, setInputValue] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // 1. Fetch danh sách scripts lúc mới vào & đồng bộ Tên Script
  useEffect(() => {
    dispatch(fetchScriptsThunk());
  }, [dispatch]);

  useEffect(() => {
    const isNew = !scriptName || scriptName === 'new';
    setInputValue(isNew ? '' : scriptName);

    if (!isNew) {
      dispatch(loadScriptThunk(scriptName)).unwrap().catch(() => {
        toast.error("Không tìm thấy script, đang tạo mới...");
        dispatch(editorSlice.actions.clearScript());
      });
    } else {
      dispatch(editorSlice.actions.clearScript());
    }
  }, [scriptName, dispatch]);

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    dispatch(fetchScriptsThunk())
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setShowDropdown(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectScript = async (name) => {
    setShowDropdown(false);
    setInputValue(name); // Đổi text trên ô input
    
    // Clear màn hình cũ cho sạch (nhìn cho có cảm giác đang chuyển file)
    dispatch(editorSlice.actions.clearScript()); 
    
    // Bắn API load data mới nhét thẳng vào Store
    try {
      await dispatch(loadScriptThunk(name)).unwrap();
      // Không cần navigate nữa! Redux tự cập nhật UI luôn.
      toast.success(`load: ${name}`);
    } catch (err) {
      toast.error("can't save!");
    }
  };

  const handleSave = async () => {
    if (!inputValue.trim()) return toast.error("Please Enter Script Name!");
    
    const res = await dispatch(saveScriptThunk({ name: inputValue, actions }));
    if (saveScriptThunk.fulfilled.match(res)) {
      toast.success("Success!");
      dispatch(fetchScriptsThunk());
    }
  };

  // 2. Logic bốc Screenshot từ thiết bị đang chọn
  const handleOpenPicker = async (actionId, context = null) => {
    if (linking) return;
    const res = await dispatch(getScreenshotThunk(targetDevice));
    if (getScreenshotThunk.fulfilled.match(res)) {
      setPicker({ open: true, actionId, context });
    } else {
      toast.error(`Device ${targetDevice} is offline!`);
    }
  };

  // 3. Xử lý Click khi đang ở chế độ Linking (GOTO, IF_VAR)
  const handleActionClick = (targetId) => {
    if (linking) {
      dispatch(editorSlice.actions.updateData({
        id: linking.sourceId,
        data: { [linking.field]: targetId }
      }));
      dispatch(editorSlice.actions.setLinking(null)); 
      toast.success(`Đã chốt mục tiêu: Bước có ID ${targetId.slice(0, 5)}...`);
    }
  };

  let currentDepth = 0;

  return (
    <div className="h-screen flex flex-col bg-[#050505] text-gray-300 overflow-hidden font-sans">
      
      {/* BANNER THÔNG BÁO LINKING (Giữ nguyên) */}
      {linking && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-[100] bg-yellow-500 text-black px-6 py-2 rounded-full font-black uppercase text-[10px] flex items-center gap-3 shadow-[0_0_30px_rgba(234,179,8,0.4)]">
          <span>Đang chọn mục tiêu... Bấm vào 1 hành động bên dưới để lấy ID</span>
          <button onClick={() => dispatch(editorSlice.actions.setLinking(null))} className="hover:scale-110 transition-transform">
            <XCircle size={16} />
          </button>
        </div>
      )}

      {/* HEADER */}
      <header className={`h-16 border-b border-white/5 bg-[#0a0a0a]/80 backdrop-blur-md flex items-center justify-between px-8 z-30 shrink-0 transition-all duration-300 ${linking ? 'pointer-events-none opacity-40' : ''}`}>
        <div className="flex items-center gap-6">
          <button onClick={() => navigate('/')} className="p-2 hover:bg-white/5 rounded-full transition-colors"><ArrowLeft size={20} /></button>
          
          <div className="flex flex-col gap-1">
            <h1 className="font-black text-blue-500 text-[10px] uppercase tracking-tighter">Script Editor</h1>
            
            {/* COMBOBOX CHỌN/NHẬP SCRIPT MỚI */}
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
                  placeholder="Tên script (VD: login.json)"
                  className="bg-transparent text-white font-bold text-sm outline-none w-48 placeholder:text-gray-600"
                />
                <ChevronDown size={14} className="text-gray-500 cursor-pointer" onClick={() => setShowDropdown(!showDropdown)}/>
              </div>

              {/* DROPDOWN DANH SÁCH FILE */}
              {showDropdown && availableScripts.length > 0 && (
                <div className="absolute top-full left-0 mt-2 w-full bg-[#111] border border-white/10 rounded-lg shadow-2xl z-50 max-h-56 overflow-y-auto custom-scrollbar">
                  {availableScripts
                    .filter(s => s.toLowerCase().includes(inputValue.toLowerCase()))
                    .map(s => (
                      <div
                        key={s}
                        onClick={() => handleSelectScript(s)}
                        className="px-4 py-2 text-sm font-medium text-gray-300 hover:bg-blue-600 hover:text-white cursor-pointer transition-colors"
                      >
                        {s}
                      </div>
                  ))}
                  {/* Option báo không tìm thấy nếu gõ linh tinh */}
                  {availableScripts.filter(s => s.toLowerCase().includes(inputValue.toLowerCase())).length === 0 && (
                    <div className="px-4 py-2 text-xs text-gray-500 italic">
                      Sẽ tạo file mới khi Save
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Device Selector (Giữ nguyên) */}
        <div className="flex items-center gap-3 bg-black/40 border border-white/5 px-4 py-2 rounded-2xl">
          <Smartphone size={14} className="text-gray-500" />
          <select
            value={targetDevice}
            onChange={(e) => setTargetDevice(e.target.value)}
            className="bg-transparent text-[10px] font-bold outline-none text-blue-400 uppercase tracking-widest cursor-pointer"
          >
            <option value="emulator-5554">Pixel 4 XL</option>
            <option value="192.168.1.50:5555">Samsung S22</option>
          </select>
        </div>

        <div className="flex gap-3">
          <button onClick={handleSave} className="bg-gray-900 border border-white/10 hover:border-blue-500/50 px-6 py-2 rounded-xl text-[10px] font-black uppercase transition-all flex items-center gap-2 tracking-widest">
            <Save size={14} /> Save
          </button>
          <button className="bg-blue-600 hover:bg-blue-500 px-6 py-2 rounded-xl text-[10px] font-black text-white uppercase transition-all shadow-lg shadow-blue-600/20 flex items-center gap-2 tracking-widest">
            <Play size={14} /> Push & Run
          </button>
        </div>
      </header>

      {/* VÙNG KÉO THẢ VÀ HIỂN THỊ ACTION (Giữ y nguyên của bạn) */}
      <DragDropContext onDragEnd={(result) => {
        if (!result.destination) return;
        dispatch(editorSlice.actions.reorderActions({ startIndex: result.source.index, endIndex: result.destination.index }));
      }}>
        <Droppable droppableId="script-list">
          {(provided) => (
            <main {...provided.droppableProps} ref={provided.innerRef} className="flex-1 overflow-y-auto p-12 custom-scrollbar relative">
              <div className="max-w-3xl mx-auto space-y-4 pb-40">
                {actions.map((action, index) => {
                  const depth = currentDepth;
                  if (action.type === 'group_start') currentDepth++;
                  if (action.type === 'group_end') currentDepth--;

                  return (
                    <Draggable key={action.id} draggableId={String(action.id)} index={index} isDragDisabled={!!linking}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          onClick={() => handleActionClick(action.id)}
                          className={`
                            relative transition-all duration-200 rounded-xl
                            ${snapshot.isDragging ? "z-50 scale-[1.02] shadow-[0_20px_50px_rgba(0,0,0,0.5)]" : "z-10"}
                            ${linking ? "cursor-crosshair hover:ring-2 hover:ring-yellow-500" : ""}
                          `}
                        >
                          {linking && <div className="absolute inset-0 z-20" />}

                          <ActionRow
                            action={action}
                            index={index}
                            depth={depth}
                            onOpenPicker={handleOpenPicker}
                          />
                        </div>
                      )}
                    </Draggable>
                  );
                })}
                {provided.placeholder}
              </div>
            </main>
          )}
        </Droppable>
      </DragDropContext>

      <button
        onClick={() => setIsLibOpen(true)}
        disabled={!!linking}
        className={`fixed bottom-10 right-10 w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(37,99,235,0.4)] transition-all z-40 group border border-blue-400/50 ${linking ? 'opacity-0 pointer-events-none translate-y-10' : 'hover:scale-110 active:scale-95'}`}
      >
        <Plus size={32} color="white" className="group-hover:rotate-90 transition-transform duration-500" />
      </button>

      <ActionLibrary isOpen={isLibOpen} onClose={() => setIsLibOpen(false)} />

      {picker.open && (
        <VisualPickerModal
          actionId={picker.actionId} 
          screenshot={currentScreenshot}
          onClose={() => setPicker({ open: false })}
          onSave={(d) => {
            dispatch(editorSlice.actions.updateData({ id: picker.actionId, data: d }));
            setPicker({ open: false });
          }}
        />
      )}

      {loading && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-center justify-center font-black text-blue-500 uppercase tracking-[1em]">
          Syncing...
        </div>
      )}
    </div>
  );
};