import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Monitor, Cpu, Play, Edit3 } from 'lucide-react';


export const Dashboard = () => {
  const navigate = useNavigate();
  const devices = [{ id: 'emulator-5554', name: 'Pixel 4 XL', status: 'online' }];
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    if (isRefreshing) return; // Chặn nếu đang chạy

    setIsRefreshing(true);
    try {
      await deviceService.refreshDevices();
      // Có thể thêm một cái toast thông báo thành công ở đây
    } catch (err) {
      console.error("Refresh failed", err);
    } finally {
      // Đợi 1s rồi mới cho click lại để tránh spam quá nhanh
      setTimeout(() => setIsRefreshing(false), 1000);
    }
  };

  return (
    <div className="p-10 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-black text-white tracking-tighter uppercase italic">Control Panel</h1>
        <div className="flex gap-3">
          {/* NÚT REFRESH DEVICES */}
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className={`group relative px-6 py-2 rounded-sm text-[11px] font-black uppercase tracking-widest transition-all duration-300 border
      ${isRefreshing
                ? 'bg-gray-900 border-gray-800 text-gray-600 cursor-not-allowed'
                : 'bg-black border-blue-900 text-blue-400 hover:border-blue-400 hover:shadow-[0_0_15px_rgba(59,130,246,0.2)] active:scale-95'}`}
          >
            <span className="relative z-10">
              {isRefreshing ? 'Scanning...' : 'Refresh Devices'}
            </span>
            {!isRefreshing && (
              <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            )}
          </button>

          {/* NÚT OPEN SCRIPT EDITOR */}
          <button
            onClick={() => navigate('/editor')}
            className="group relative px-6 py-2 rounded-sm text-[11px] font-black uppercase tracking-widest transition-all duration-300 border border-blue-600 bg-blue-600 text-white hover:bg-blue-500 hover:border-blue-400 hover:shadow-[0_0_20px_rgba(37,99,235,0.5)] active:scale-95"
          >
            <span className="relative z-10">Open Script Editor</span>
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {devices.map(d => (
          <div key={d.id} className="bg-[#0d0d0d] border border-gray-800 rounded-2xl p-6 hover:border-blue-500 transition-all group">
            <div className="flex justify-between mb-8">
              <div className="p-4 bg-blue-600/10 rounded-xl text-blue-500"><Monitor size={32} /></div>
              <span className="text-[10px] bg-green-500/10 text-green-500 px-3 py-1 rounded-full font-bold h-fit">ACTIVE</span>
            </div>
            <h3 className="text-white font-bold text-lg mb-1">{d.name}</h3>
            <p className="text-gray-600 text-[10px] font-mono mb-8 tracking-widest">{d.id}</p>
            <div className="flex gap-2">
              <button onClick={() => navigate('/editor')} className="flex-1 bg-gray-800 hover:bg-blue-600 text-white py-3 rounded-xl text-xs font-black transition flex items-center justify-center gap-2 uppercase tracking-widest"><Edit3 size={16} /> Edit</button>
              <button className="w-12 bg-green-600/10 text-green-500 hover:bg-green-600 hover:text-white rounded-xl transition flex items-center justify-center"><Play size={18} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};