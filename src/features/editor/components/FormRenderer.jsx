import React, {useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ACTION_MANIFEST } from '@/constants/actionManifest';
import { Focus } from 'lucide-react'; // Import Icon Tâm ngắm
import { getActiveAppThunk, getListAppThunk, updateData, setLinking } from '../editorSlice'; // Thêm imports
import { PackageSelectorModal } from './PackageSelectorModal';
import { Smartphone, List , Target} from 'lucide-react';
import { toast } from 'react-hot-toast';


export const FormRenderer = ({ action, onOpenPicker }) => {
  const dispatch = useDispatch();
  const allActions = useSelector(state => state.editor.actions);
  const config = ACTION_MANIFEST[action.type];
  const targetDevice = useSelector(state => state.device.selected);
  const [appModal, setAppModal] = useState({ open: false, list: [] });

  const handleGetActive = async (key) => {
    if (!targetDevice) return toast.error("Chọn thiết bị trước!");
    const res = await dispatch(getActiveAppThunk(targetDevice)).unwrap();
    if (res) {
      dispatch(updateData({ id: action.id, data: { [key]: res.package || "" } }));
      toast.success(`Fetched: ${res}`);
    }
  };

  const handleGetAll = async (key) => {
    if (!targetDevice) return toast.error("Chọn thiết bị trước!");
    const res = await dispatch(getListAppThunk(targetDevice)).unwrap();
    if(!res){
      toast("Can't Get List Package, Try Again Later")
      return
    }
    setAppModal({ open: true, list: res, targetKey: key });
  };

  const getDisplayIndex = (targetId) => {
    if (!targetId) return null;
    const idx = allActions.findIndex(a => String(a.id) === String(targetId));
    return idx !== -1 ? idx + 1 : "!?";
  };

  const update = (key, val) => {
    dispatch(updateData({ id: action.id, data: { [key]: val } }));
  };

  if (!config) return <div className="text-red-500 text-[10px] font-bold">Action Type Not Supported</div>;

  const getFieldWidthClass = (key, type) => {
    const miniFields = ['x', 'y', 'x1', 'y1', 'x2', 'y2', 'duration', 'delay', 'threshold'];
    if (miniFields.includes(key)) return 'w-20';
    if (type === 'toggle') return 'w-auto';
    if (type === 'select') return 'w-auto min-w-[120px]';
    return 'flex-1 min-w-[140px]';
  };

  // Check xem Action này có cần nút lấy tọa độ Màn hình không
  const isTargetingAction = ['tap', 'hold_point', 'swipe'].includes(action.type);

  return (
    <div className="flex flex-col mt-3 animate-in fade-in duration-300">
      
      

      {/* RENDER CÁC TRƯỜNG INPUT */}
      <div className="flex flex-wrap items-end gap-x-4 gap-y-3">
        {config.fields.map((field) => {
          if (field.type === 'hidden') return null;
          const val = action.data?.[field.key] ?? field.default ?? '';
          const widthClass = getFieldWidthClass(field.key, field.type);

          return (
            <div key={field.key} className={`flex flex-col gap-1 ${widthClass}`}>
              <label className="text-[9px] text-gray-500 uppercase font-black tracking-wider">
                {field.label || field.key}
              </label>
              {field.key === 'package' && (
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleGetActive(field.key)}
                      className="text-[8px] text-blue-500 hover:text-blue-400 font-bold uppercase flex items-center gap-1"
                    >
                      <Smartphone size={10}/> Active
                    </button>
                    <button 
                      onClick={() => handleGetAll(field.key)}
                      className="text-[8px] text-purple-500 hover:text-purple-400 font-bold uppercase flex items-center gap-1"
                    >
                      <List size={10}/> Get All
                    </button>
                  </div>
                )}
              {(field.type === 'text' || field.type === 'number') && (
                <input 
                  type={field.type}
                  step={field.type === 'number' ? "any" : undefined}
                  className="bg-black border border-gray-800 rounded px-2 py-1.5 text-xs text-blue-400 outline-none focus:border-blue-600 transition-all w-full"
                  value={val}
                  onChange={(e) => update(field.key, field.type === 'number' ? Number(e.target.value) : e.target.value)}
                />
              )}

              {field.type === 'select' && (
                <select 
                  className="bg-black border border-gray-800 rounded px-2 py-1.5 text-xs text-blue-400 outline-none cursor-pointer w-full"
                  value={val}
                  onChange={(e) => update(field.key, e.target.value)}
                >
                  <option value="" disabled>Select...</option>
                  {field.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              )}

              {field.type === 'toggle' && (
                <div className="py-1">
                  <div 
                    onClick={() => update(field.key, !val)}
                    className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors ${val ? 'bg-blue-600' : 'bg-gray-800'}`}
                  >
                    <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${val ? 'left-6' : 'left-1'}`} />
                  </div>
                </div>
              )}

              {/* Nút Picker gốc (Dành cho FIND_IMAGE/OCR) */}
              {field.type === 'picker' && (
                <button 
                  onClick={() => onOpenPicker(action.id)}
                  className={`w-full py-1.5 px-2 rounded text-[10px] font-bold border transition-all truncate ${val ? 'bg-blue-600/20 border-blue-500 text-blue-400' : 'bg-gray-900 border-gray-800 text-gray-500 hover:border-blue-500'}`}
                >
                  {val ? "Đã khoanh vùng" : "Vẽ vùng chọn trên ảnh"}
                </button>
              )}

              {field.type === 'link' && (
                <button 
                  onClick={() => dispatch(setLinking({ id: action.id, field: field.key }))}
                  className={`w-full py-1.5 px-2 rounded text-[10px] font-bold border transition-all truncate ${val ? 'bg-green-600/20 border-green-500 text-green-400' : 'bg-yellow-600/20 border-yellow-500 text-yellow-500 hover:scale-[1.02]'}`}
                >
                  {val ? `-> Nhảy Bước ${getDisplayIndex(val)}` : "Chọn Bước Mục Tiêu"}
                </button>
              )}
            </div>
          );
        })}
        {isTargetingAction && (
                    <button 
                      onClick={() => onOpenPicker(action.id)}
                      title="Chọn tọa độ từ màn hình"
                      className="text-gray-600 hover:text-blue-500 transition-colors p-0.5"
                    >
                      <Target size={20}/> {/* Icon nhỏ xinh cạnh label */}
                    </button>
                  )}
      </div>
      {appModal.open && appModal.list && (
        <PackageSelectorModal 
          packages={appModal.list}
          onClose={() => setAppModal({ open: false, list: [] })}
          onSelect={(pkg) => {
            dispatch(updateData({ id: action.id, data: { [appModal.targetKey]: pkg } }));
            setAppModal({ open: false, list: [] });
          }}
        />
      )}
    </div>
  );
};