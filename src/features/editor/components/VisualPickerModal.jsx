// FE_FoxFarmer/src/features/editor/components/VisualPickerModal.jsx

import React, { useRef, useState } from 'react';
import { useSelector } from 'react-redux';

export const VisualPickerModal = ({ actionId, screenshot, onSave, onClose }) => {
  // Tự động nhận diện mày đang cần lấy cái gì dựa vào Redux
  const action = useSelector(state => state.editor.actions.find(a => a.id === actionId));
  const actionType = action?.type || 'find_image';

  let mode = 'region';
  if (['tap', 'hold_point'].includes(actionType)) mode = 'point';
  if (['swipe'].includes(actionType)) mode = 'swipe';

  const imgRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState(null);
  const [currentPos, setCurrentPos] = useState(null);

  const getMousePos = (e) => {
    const rect = imgRef.current.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const handleMouseDown = (e) => {
    const pos = getMousePos(e);
    setStartPos(pos);
    setCurrentPos(pos);
    setIsDrawing(true);
  };

  const handleMouseMove = (e) => {
    if (!isDrawing) return;
    setCurrentPos(getMousePos(e));
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  const handleConfirm = () => {
    if (!startPos) return alert("Mày chưa thao tác trên màn hình kìa!");
    
    const img = imgRef.current;
    const scaleX = img.naturalWidth / img.clientWidth;
    const scaleY = img.naturalHeight / img.clientHeight;

    const sx = Math.round(startPos.x * scaleX);
    const sy = Math.round(startPos.y * scaleY);
    const cx = Math.round((currentPos?.x || startPos.x) * scaleX);
    const cy = Math.round((currentPos?.y || startPos.y) * scaleY);

    if (mode === 'point') {
      onSave({...action.data, x: sx, y: sy });
    } 
    else if (mode === 'swipe') {
      onSave({...action.data, x1: sx, y1: sy, x2: cx, y2: cy });
    } 
    else {
      // Logic Crop Region cũ của mày
      const x = Math.min(sx, cx);
      const y = Math.min(sy, cy);
      const w = Math.abs(cx - sx);
      const h = Math.abs(cy - sy);
      
      if (w < 5 || h < 5) return alert("Vùng chọn bé quá, khoanh lại đi!");

      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, x, y, w, h, 0, 0, w, h);
      
      onSave({
        ...action.data,
        region: { x1: x, y1: y, x2: x + w, y2: y + h },
        template: canvas.toDataURL('image/png')
      });
    }
  };

  return (
    <div className="fixed inset-0 z-[200] bg-black/95 flex flex-col items-center justify-center font-sans">
      <div className="flex justify-between items-center w-full max-w-6xl p-4">
        <div>
          <h2 className="text-blue-500 font-black uppercase tracking-widest text-sm">Visual Target Picker</h2>
          <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">
            Mode: {mode === 'point' ? 'Click 1 điểm' : mode === 'swipe' ? 'Kéo thả vẽ hướng vuốt' : 'Khoanh vùng cắt ảnh'}
          </p>
        </div>
        <div className="flex gap-4">
          <button onClick={onClose} className="text-gray-400 hover:text-white text-xs font-bold uppercase">Cancel</button>
          <button onClick={handleConfirm} className="bg-blue-600 hover:bg-blue-500 px-8 py-2 rounded text-xs font-black text-white uppercase tracking-widest shadow-[0_0_15px_rgba(37,99,235,0.4)]">
            Confirm & Save
          </button>
        </div>
      </div>
      
      <div className="relative border border-gray-800 bg-[#050505]" style={{ height: '80vh' }}>
        <img 
          ref={imgRef} src={screenshot} draggable={false}
          className="h-full w-auto select-none opacity-90"
          onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp}
        />
        
        {/* LỚP SVG VẼ UI TARGETING LÊN TRÊN ẢNH */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {/* Vẽ Tâm Ngắm (Point) */}
          {mode === 'point' && startPos && (
            <g>
              <circle cx={startPos.x} cy={startPos.y} r="12" stroke="red" fill="rgba(255,0,0,0.2)" strokeWidth="2" />
              <line x1={startPos.x - 20} y1={startPos.y} x2={startPos.x + 20} y2={startPos.y} stroke="red" strokeWidth="2" />
              <line x1={startPos.x} y1={startPos.y - 20} x2={startPos.x} y2={startPos.y + 20} stroke="red" strokeWidth="2" />
            </g>
          )}

          {/* Vẽ Mũi Tên (Swipe) */}
          {mode === 'swipe' && startPos && currentPos && (
            <g>
              <circle cx={startPos.x} cy={startPos.y} r="6" fill="#3b82f6" />
              <line x1={startPos.x} y1={startPos.y} x2={currentPos.x} y2={currentPos.y} stroke="#3b82f6" strokeWidth="4" markerEnd="url(#arrowhead)" />
            </g>
          )}

          {/* Vẽ Hình Chữ Nhật (Region) */}
          {mode === 'region' && startPos && currentPos && (
            <rect 
              x={Math.min(startPos.x, currentPos.x)} 
              y={Math.min(startPos.y, currentPos.y)} 
              width={Math.abs(currentPos.x - startPos.x)} 
              height={Math.abs(currentPos.y - startPos.y)} 
              stroke="red" strokeWidth="2" fill="rgba(255,0,0,0.2)" strokeDasharray="4"
            />
          )}

          {/* Define Mũi tên SVG */}
          <defs>
            <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="#3b82f6" />
            </marker>
          </defs>
        </svg>
      </div>
    </div>
  );
};