import React, { useRef, useState, useEffect } from 'react';
import { getScaleFactor, convertToRaw } from '../../../utils/scaling';

export const VisualPickerModal = ({ screenshot, onSave, onClose }) => {
  const imgRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [region, setRegion] = useState({ x: 0, y: 0, w: 0, h: 0 });

  // Reset region khi mở ảnh mới
  useEffect(() => {
    setRegion({ x: 0, y: 0, w: 0, h: 0 });
  }, [screenshot]);

  const getMousePos = (e) => {
    const rect = imgRef.current.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
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
    
    // Xử lý vẽ ngược (từ phải qua trái hoặc dưới lên trên)
    const x = Math.min(pos.x, startPos.x);
    const y = Math.min(pos.y, startPos.y);
    const w = Math.abs(pos.x - startPos.x);
    const h = Math.abs(pos.y - startPos.y);
    
    setRegion({ x, y, w, h });
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  const handleConfirm = () => {
    if (region.w === 0 || region.h === 0) {
      alert("Mày phải quét một vùng ảnh đã!");
      return;
    }

    const img = imgRef.current;
    // Công thức "vàng" tính tỷ lệ theo Height (90vh)
    const S = getScaleFactor(img.naturalHeight, img.clientHeight);

    // Tính tọa độ thực tế trên Android (Raw)
    const raw = {
      x1: convertToRaw(region.x, S),
      y1: convertToRaw(region.y, S),
      w: convertToRaw(region.w, S),
      h: convertToRaw(region.h, S)
    };

    // Tạo Canvas ẩn để trích xuất ảnh template (ảnh mẫu)
    const canvas = document.createElement('canvas');
    canvas.width = raw.w;
    canvas.height = raw.h;
    const ctx = canvas.getContext('2d');
    
    // Cắt ảnh từ ảnh gốc dựa trên tọa độ thực
    ctx.drawImage(
      img, 
      raw.x1, raw.y1, raw.w, raw.h, // Vùng cắt trên ảnh gốc
      0, 0, raw.w, raw.h           // Vẽ vào canvas 1:1
    );

    const base64Template = canvas.toDataURL('image/png');

    // Trả data về cho Editor
    onSave({
      region: { 
        x1: raw.x1, 
        y1: raw.y1, 
        x2: raw.x1 + raw.w, 
        y2: raw.y1 + raw.h 
      },
      template: base64Template
    });
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/95 flex flex-col items-center justify-center p-4 backdrop-blur-sm">
      <div className="flex justify-between w-full max-w-6xl mb-4">
        <h2 className="text-white font-bold">Visual Picker - Select Area</h2>
        <div className="flex gap-2">
          <button onClick={onClose} className="px-4 py-1 text-gray-400 hover:text-white transition">Cancel</button>
          <button onClick={handleConfirm} className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-1 rounded font-bold transition shadow-lg">Confirm & Save</button>
        </div>
      </div>

      <div 
        className="relative border-2 border-blue-500/30 shadow-2xl overflow-hidden bg-gray-900"
        style={{ height: '85vh' }}
      >
        <img 
          ref={imgRef}
          src={screenshot}
          alt="Device Screen"
          className="h-full w-auto object-contain cursor-crosshair select-none"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          draggable={false}
        />
        
        {/* Lớp phủ hình chữ nhật đang vẽ */}
        {(region.w > 0 || region.h > 0) && (
          <div 
            className="absolute border-2 border-red-500 bg-red-500/20 pointer-events-none shadow-[0_0_10px_rgba(239,68,68,0.5)]"
            style={{
              left: region.x,
              top: region.y,
              width: region.w,
              height: region.h
            }}
          >
            <div className="absolute -top-6 left-0 bg-red-500 text-white text-[10px] px-1 rounded">
              {convertToRaw(region.w, getScaleFactor(imgRef.current?.naturalHeight, imgRef.current?.clientHeight))} x 
              {convertToRaw(region.h, getScaleFactor(imgRef.current?.naturalHeight, imgRef.current?.clientHeight))}
            </div>
          </div>
        )}
      </div>

      <p className="text-gray-500 text-[10px] mt-2 italic">
        * Tip: Quét chuột từ trái-trên xuống phải-dưới để lấy vùng ảnh chính xác.
      </p>
    </div>
  );
};