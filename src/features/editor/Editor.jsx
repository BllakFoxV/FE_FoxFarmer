// MODIFIED
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import { Plus } from 'lucide-react';

import { fetchScriptsThunk, loadScriptThunk, getScreenshotThunk, updateData, clearScript } from './editorSlice';
import { fetchDevicesThunk, deviceSlice } from '@/features/dashboard/deviceSlice'; 

import { ActionLibrary } from './components/ActionLibrary';
import { VisualPickerModal } from './components/VisualPickerModal';
import { LinkingBanner } from './components/LinkingBanner';
import { EditorHeader } from './components/EditorHeader';
import { ActionList } from './components/ActionList';

export const Editor = () => {
  const { scriptName } = useParams();
  const dispatch = useDispatch();

  const { linking, loading: editorLoading, currentScreenshot } = useSelector(state => state.editor);
  const { loading: deviceLoading, selected: targetDevice } = useSelector(state => state.device);

  const [isLibOpen, setIsLibOpen] = useState(false);
  const [picker, setPicker] = useState({ open: false, actionId: null, context: null });

  // Load target script
  useEffect(() => {
    const isNew = !scriptName || scriptName === 'new';
    if (!isNew) {
      dispatch(loadScriptThunk(scriptName)).unwrap().catch(() => {
        toast.error("Script not found, creating new...");
        dispatch(clearScript());
      });
    } else {
      dispatch(clearScript());
    }
  }, [scriptName, dispatch]);

  const handleOpenPicker = async (actionId, context = null) => {
    if (linking) return;
    if (!targetDevice) return toast.error("Please select a device first!");

    const res = await dispatch(getScreenshotThunk(targetDevice));
    if (getScreenshotThunk.fulfilled.match(res)) {
      setPicker({ open: true, actionId, context });
    } else {
      toast.error(`Device ${targetDevice} is offline or encountered an error!`);
    }
  };

  const isLoading = editorLoading || deviceLoading;

  return (
    <div className="h-screen flex flex-col bg-[#050505] text-gray-300 overflow-hidden font-sans">
      <LinkingBanner linking={linking} />

      {/* NO PROPS DRILLING HERE */}
      <EditorHeader />

      <ActionList onOpenPicker={handleOpenPicker} />

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
            dispatch(updateData({ id: picker.actionId, data: d }));
            setPicker({ open: false });
          }}
        />
      )}

      {isLoading && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-center justify-center font-black text-blue-500 uppercase tracking-[1em]">
          Syncing...
        </div>
      )}
    </div>
  );
};