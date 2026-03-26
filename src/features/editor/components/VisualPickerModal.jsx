import React, { useRef, useState, useEffect } from 'react';

export const VisualPickerModal = ({ screenshot, onSave, onClose }) => {
  const imgRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [region, setRegion] = useState({ x: 0, y: 0, w: 0, h: 0 });

  const getMousePos = (e) => {
    const rect = imgRef.current.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const handleMouseDown = (e) => {
    const pos = getMousePos(e);
    setStartPos(pos);
    setRegion({ x: pos.x, y: pos.y, w: 0, h: 0 });
    setIsDrawing(true);
  };

  const handleMouseMove = (e) => {
    if (!isDrawing) return;
    const pos = getMousePos(e);
    setRegion({
      x: Math.min(pos.x, startPos.x),
      y: Math.min(pos.y, startPos.y),
      w: Math.abs(pos.x - startPos.x),
      h: Math.abs(pos.y - startPos.y)
    });
  };

  const handleConfirm = () => {
    const img = imgRef.current;
    const S = img.naturalHeight / img.clientHeight; // Scale Factor (90vh based)

    const raw = {
      x1: Math.round(region.x * S),
      y1: Math.round(region.y * S),
      w: Math.round(region.w * S),
      h: Math.round(region.h * S)
    };

    const canvas = document.createElement('canvas');
    canvas.width = raw.w;
    canvas.height = raw.h;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, raw.x1, raw.y1, raw.w, raw.h, 0, 0, raw.w, raw.h);
    
    onSave({
      region: { x1: raw.x1, y1: raw.y1, x2: raw.x1 + raw.w, y2: raw.y1 + raw.h },
      template: canvas.toDataURL('image/png')
    });
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/95 flex flex-col items-center justify-center">
      <div className="flex justify-between w-full max-w-6xl p-4">
        <h2 className="text-white font-bold uppercase tracking-tighter">Picker - Android View</h2>
        <div className="flex gap-4">
          <button onClick={onClose} className="text-gray-400">Cancel</button>
          <button onClick={handleConfirm} className="bg-blue-600 px-6 py-1 rounded font-bold text-white">Confirm</button>
        </div>
      </div>
      <div className="relative border border-blue-500" style={{ height: '85vh' }}>
        <img 
          ref={imgRef} src={screenshot} draggable={false}
          className="h-full w-auto cursor-crosshair select-none"
          onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={() => setIsDrawing(false)}
        />
        {region.w > 0 && (
          <div className="absolute border border-red-500 bg-red-500/20 pointer-events-none"
               style={{ left: region.x, top: region.y, width: region.w, height: region.h }} />
        )}
      </div>
    </div>
  );
};