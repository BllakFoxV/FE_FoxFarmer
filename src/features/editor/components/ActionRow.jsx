import React from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { FormRenderer } from './FormRenderer';
import { GripVertical, Trash2, Copy , PlayCircle} from 'lucide-react';
import { useSelector,useDispatch } from 'react-redux';
import { testStepThunk, removeAction } from '../editorSlice';

export const ActionRow = ({ action, index, depth, onOpenPicker }) => {
  const actionType = String(action?.type || "");
  const dispatch = useDispatch();
  const targetDevice = useSelector(state => state.device.selected);

  const handleTestStep = (e) => {
    e.stopPropagation(); // Không kích hoạt chọn mục tiêu khi đang ở chế độ Linking
    if (!targetDevice) return toast.error("Chọn thiết bị trước khi test!");
    
    dispatch(testStepThunk({ 
      deviceId: targetDevice, 
      action: action 
    }));
  };
  return (
    <Draggable draggableId={action.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          style={{ 
            marginLeft: `${depth * 32}px`,
            ...provided.draggableProps.style 
          }}
          className={`group mb-3 transition-shadow ${snapshot.isDragging ? 'z-50 shadow-2xl scale-[1.02]' : ''}`}
        >
          <div className={`bg-[#0d0d0d] border ${snapshot.isDragging ? 'border-blue-500' : 'border-gray-800'} rounded-xl p-4 hover:border-gray-700 transition-colors`}>
            <div className="flex justify-between items-center border-b border-gray-800/50 pb-3">
              <div className="flex items-center gap-3">
                <div {...provided.dragHandleProps} className="text-gray-700 hover:text-gray-400 cursor-grab">
                  <GripVertical size={16} />
                </div>
                <span className="text-[10px] text-gray-600 font-mono">{(index + 1).toString().padStart(2, '0')}</span>
                <span className={`text-[10px] font-black tracking-[0.2em] uppercase ${action.type.includes('GROUP') ? 'text-yellow-500' : 'text-blue-500'}`}>
                  {action.type}
                </span>
              </div>
              
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={handleTestStep}
                  title="Test this step"
                  className="text-green-500 hover:text-green-400 transition-colors p-1"
                >
                  <PlayCircle size={16}/>
                </button>
                <button onClick={()=>{dispatch(removeAction(action.id))}} className="text-gray-600 hover:text-red-500 transition-colors"><Trash2 size={14}/></button>
              </div>
            </div>

            <FormRenderer action={action} onOpenPicker={onOpenPicker} />
          </div>
        </div>
      )}
    </Draggable>
  );
};