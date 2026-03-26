import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import { useNavigate } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';
import { 
  ArrowLeft, Save, Play, Plus, Monitor, 
  Trash2, Copy, Zap, Info 
} from 'lucide-react';

import { ActionRow } from './components/ActionRow';
import { ActionLibrary } from './components/ActionLibrary';
import { VisualPickerModal } from './components/VisualPickerModal';
import { editorSlice } from './editorSlice';
import { scriptService } from '../../services/scriptService';

export const Editor = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { actions, linking } = useSelector(state => state.editor);
  
  const [isLibOpen, setIsLibOpen] = useState(false);
  const [picker, setPicker] = useState({ open: false, actionId: null, screenshot: null });

  // 1. Xử lý Drag & Drop
  const onDragEnd = (result) => {
    if (!result.destination) return;
    dispatch(editorSlice.actions.moveAction({
      oldIndex: result.source.index,
      newIndex: result.destination.index
    }));
  };

  // 2. Xử lý mở Picker lấy Screenshot từ BE
  const handleOpenPicker = async (actionId) => {
    const loadingToast = toast.loading("Capturing device screen...");
    try {
      const base64 = await scriptService.getScreenshot('current_device'); 
      setPicker({ 
        open: true, 
        actionId, 
        screenshot: `data:image/png;base64,${base64}` 
      });
      toast.dismiss(loadingToast);
    } catch (err) {
      toast.error("ADB Error: Could not capture screen");
      toast.dismiss(loadingToast);
    }
  };

  // 3. Lưu vùng chọn từ Modal
  const handleSaveRegion = (data) => {
    dispatch(editorSlice.actions.updateData({
      id: picker.actionId,
      data: { region: data.region, template: data.template }
    }));
    setPicker({ open: false, actionId: null, screenshot: null });
    toast.success("Region coordinates & Template updated");
  };

  // 4. Lưu Script xuống Server
  const handleSaveScript = async () => {
    const name = prompt("Enter script name (without .json):", "new_script");
    if (!name) return;
    try {
      await scriptService.saveScript(name, actions);
      toast.success(`Script "${name}" saved successfully`);
    } catch (err) {
      toast.error("Failed to save script to server");
    }
  };

  let currentDepth = 0;

  return (
    <div className="h-screen flex flex-col bg-[#050505] text-gray-300 select-none overflow-hidden">
      {/* --- HEADER FULL --- */}
      <header className="h-14 border-b border-gray-800 bg-[#0a0a0a] flex items-center justify-between px-6 z-30 shadow-2xl">
        <div className="flex items-center gap-6">
          <button 
            onClick={() => navigate('/')} 
            className="p-2 hover:bg-gray-800 rounded-full transition-colors text-gray-400 hover:text-white"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="flex flex-col">
            <h1 className="font-black text-blue-500 tracking-[0.2em] uppercase text-sm">Editor Mode</h1>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-[10px] text-gray-500 font-mono">Target: Pixel_4_ADB_5554</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => { if(window.confirm("Clear current script?")) dispatch(editorSlice.actions.clearScript()) }}
            className="text-[10px] font-bold text-gray-600 hover:text-red-500 uppercase tracking-widest transition-colors px-4"
          >
            Clear All
          </button>
          <button 
            onClick={handleSaveScript}
            className="bg-gray-800 hover:bg-gray-700 text-white px-5 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 border border-gray-700"
          >
            <Save size={14}/> Save JSON
          </button>
          <button 
            className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 shadow-lg shadow-blue-600/20 active:scale-95"
          >
            <Play size={14}/> Push & Run
          </button>
        </div>
      </header>

      {/* --- MAIN SCRIPT AREA --- */}
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="script-list">
          {(provided) => (
            <main 
              {...provided.droppableProps}
              ref={provided.innerRef}
              className={`flex-1 overflow-y-auto p-12 custom-scrollbar transition-all duration-500 ${linking.active ? 'opacity-20 blur-md pointer-events-none scale-95' : 'opacity-100'}`}
            >
              <div className="max-w-4xl mx-auto pb-32">
                {actions.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-32 border-2 border-dashed border-gray-800 rounded-3xl text-gray-700">
                    <Zap size={48} className="mb-4 opacity-20" />
                    <p className="text-sm font-bold uppercase tracking-widest">No actions in script</p>
                    <p className="text-xs mt-2">Click the [+] button to add your first step</p>
                  </div>
                )}
                
                {actions.map((action, index) => {
                  const depth = currentDepth;
                  if (action.type === 'GROUP_START') currentDepth++;
                  if (action.type === 'GROUP_END') currentDepth--;

                  return (
                    <ActionRow 
                      key={action.id} 
                      action={action} 
                      index={index} 
                      depth={depth}
                      onRemove={() => dispatch(editorSlice.actions.removeAction(action.id))}
                      onOpenPicker={handleOpenPicker}
                    />
                  );
                })}
                {provided.placeholder}
              </div>
            </main>
          )}
        </Droppable>
      </DragDropContext>

      {/* --- OVERLAYS & MODALS --- */}
      <button 
        onClick={() => setIsLibOpen(true)}
        className="fixed bottom-10 right-10 w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all z-20 group"
      >
        <Plus size={32} color="white" className="group-hover:rotate-90 transition-transform duration-300" />
      </button>

      <ActionLibrary isOpen={isLibOpen} onClose={() => setIsLibOpen(false)} />
      
      {picker.open && (
        <VisualPickerModal 
          screenshot={picker.screenshot} 
          onSave={handleSaveRegion} 
          onClose={() => setPicker({ open: false, actionId: null, screenshot: null })} 
        />
      )}

      {linking.active && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-yellow-600 text-white px-10 py-4 rounded-full font-black animate-bounce shadow-2xl z-50 flex items-center gap-4 border-4 border-yellow-500">
          <Info size={20} />
          <span className="tracking-widest uppercase text-sm">Select target action for linking</span>
          <button 
            onClick={() => dispatch(editorSlice.actions.cancelLinking())}
            className="bg-black/20 hover:bg-black/40 px-3 py-1 rounded text-[10px]"
          >
            CANCEL
          </button>
        </div>
      )}
    </div>
  );
};