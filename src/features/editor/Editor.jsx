import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import { toast } from 'react-hot-toast';
import { ArrowLeft, Save, Play, Plus, Trash2, GripVertical } from 'lucide-react';
import { editorSlice, getScreenshotThunk, saveScriptThunk } from './editorSlice';
import { ActionLibrary } from './components/ActionLibrary';
import { FormRenderer } from './components/FormRenderer';
import { VisualPickerModal } from './components/VisualPickerModal';

export const Editor = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { actions, linking, currentScreenshot, loading } = useSelector(state => state.editor);
  
  const [isLibOpen, setIsLibOpen] = useState(false);
  const [picker, setPicker] = useState({ open: false, actionId: null });

  const onDragEnd = (result) => {
    if (!result.destination) return;
    dispatch(editorSlice.actions.moveAction({
      oldIndex: result.source.index,
      newIndex: result.destination.index
    }));
  };

  const handleOpenPicker = async (id) => {
    const res = await dispatch(getScreenshotThunk('emulator-5554'));
    if (getScreenshotThunk.fulfilled.match(res)) {
      setPicker({ open: true, actionId: id });
    } else {
      toast.error("ADB Error: Capture failed");
    }
  };

  const handleSave = async () => {
    const name = prompt("Script Name:", "new_farm");
    if (!name) return;
    const res = await dispatch(saveScriptThunk({ name, actions }));
    if (saveScriptThunk.fulfilled.match(res)) toast.success("Script Stored!");
  };

  let currentDepth = 0;

  return (
    <div className="h-screen flex flex-col bg-[#050505] text-gray-300 overflow-hidden">
      <header className="h-14 border-b border-gray-800 bg-[#0a0a0a] flex items-center justify-between px-6 shadow-2xl">
        <div className="flex items-center gap-6">
          <button onClick={() => navigate('/')}><ArrowLeft size={20}/></button>
          <h1 className="font-black text-blue-500 uppercase tracking-widest text-sm">Editor</h1>
        </div>
        <div className="flex gap-4">
          <button onClick={handleSave} className="bg-gray-800 px-4 py-1.5 rounded text-xs font-bold border border-gray-700">Save</button>
          <button className="bg-blue-600 px-4 py-1.5 rounded text-xs font-bold text-white shadow-lg">Run</button>
        </div>
      </header>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="script-list">
          {(provided) => (
            <main {...provided.droppableProps} ref={provided.innerRef}
                  className={`flex-1 overflow-y-auto p-12 transition-all ${linking.active ? 'opacity-20 blur-sm pointer-events-none' : ''}`}>
              <div className="max-w-4xl mx-auto space-y-3 pb-32">
                {actions.map((action, index) => {
                  const depth = currentDepth;
                  if (action.type === 'GROUP_START') currentDepth++;
                  if (action.type === 'GROUP_END') currentDepth--;
                  return (
                    <div key={action.id} style={{ marginLeft: `${depth * 32}px` }}
                         className="bg-[#0d0d0d] border border-gray-800 rounded-xl p-4 group transition-colors hover:border-blue-500/50"
                         onClick={() => linking.active && dispatch(editorSlice.actions.finishLink(action.id))}>
                       <div className="flex justify-between items-center border-b border-gray-800 pb-2 mb-4 text-[10px] font-mono">
                         <div className="flex items-center gap-2">
                           <span className="text-gray-700">#{(index+1).toString().padStart(2,'0')}</span>
                           <span className="text-blue-500 font-bold uppercase">{action.type}</span>
                         </div>
                         <button onClick={(e) => { e.stopPropagation(); dispatch(editorSlice.actions.removeAction(action.id)) }} className="text-gray-700 hover:text-red-500"><Trash2 size={12}/></button>
                       </div>
                       <FormRenderer action={action} onOpenPicker={handleOpenPicker} />
                    </div>
                  );
                })}
                {provided.placeholder}
              </div>
            </main>
          )}
        </Droppable>
      </DragDropContext>

      <button onClick={() => setIsLibOpen(true)} className="fixed bottom-8 right-8 w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center shadow-2xl z-20"><Plus color="white" size={32}/></button>
      
      <ActionLibrary isOpen={isLibOpen} onClose={() => setIsLibOpen(false)} />
      {picker.open && <VisualPickerModal screenshot={currentScreenshot} onClose={() => setPicker({open:false})} onSave={(d) => { dispatch(editorSlice.actions.updateData({id: picker.actionId, data: d})); setPicker({open:false}) }} />}
      {loading && <div className="fixed inset-0 bg-black/50 z-[200] flex items-center justify-center font-bold text-blue-500 animate-pulse uppercase tracking-[0.5em]">Processing...</div>}
    </div>
  );
};