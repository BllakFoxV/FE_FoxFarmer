import React from 'react';
import { XCircle } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { setLinking } from '../editorSlice';

export const LinkingBanner = ({ linking }) => {
  const dispatch = useDispatch();

  if (!linking) return null;

  return (
    <div className="absolute top-20 left-1/2 -translate-x-1/2 z-[100] bg-yellow-500 text-black px-6 py-2 rounded-full font-black uppercase text-[10px] flex items-center gap-3 shadow-[0_0_30px_rgba(234,179,8,0.4)]">
      <span>Đang chọn mục tiêu... Bấm vào 1 hành động bên dưới để lấy ID</span>
      <button 
        onClick={() => dispatch(setLinking(null))} 
        className="hover:scale-110 transition-transform"
      >
        <XCircle size={16} />
      </button>
    </div>
  );
};