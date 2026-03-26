import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Monitor, Cpu, Play, Edit3 } from 'lucide-react';

export const Dashboard = () => {
  const navigate = useNavigate();
  const devices = [{ id: 'emulator-5554', name: 'Pixel 4 XL', status: 'online' }];

  return (
    <div className="p-10 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-black text-white tracking-tighter uppercase italic">Control Panel</h1>
        <div className="flex gap-4 text-[10px] font-mono">
          <span className="text-green-500 underline cursor-pointer">Re-scan ADB</span>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {devices.map(d => (
          <div key={d.id} className="bg-[#0d0d0d] border border-gray-800 rounded-2xl p-6 hover:border-blue-500 transition-all group">
            <div className="flex justify-between mb-8">
              <div className="p-4 bg-blue-600/10 rounded-xl text-blue-500"><Monitor size={32}/></div>
              <span className="text-[10px] bg-green-500/10 text-green-500 px-3 py-1 rounded-full font-bold h-fit">ACTIVE</span>
            </div>
            <h3 className="text-white font-bold text-lg mb-1">{d.name}</h3>
            <p className="text-gray-600 text-[10px] font-mono mb-8 tracking-widest">{d.id}</p>
            <div className="flex gap-2">
              <button onClick={() => navigate('/editor')} className="flex-1 bg-gray-800 hover:bg-blue-600 text-white py-3 rounded-xl text-xs font-black transition flex items-center justify-center gap-2 uppercase tracking-widest"><Edit3 size={16}/> Edit</button>
              <button className="w-12 bg-green-600/10 text-green-500 hover:bg-green-600 hover:text-white rounded-xl transition flex items-center justify-center"><Play size={18}/></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};