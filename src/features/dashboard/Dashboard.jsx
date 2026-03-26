import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Monitor, Play, Edit3, RefreshCw } from 'lucide-react';

const devices = [
  { id: 'emulator-5554', name: 'Pixel 4 XL', status: 'online', task: 'Idle' },
  { id: '192.168.1.50:5555', name: 'Samsung S22', status: 'offline', task: '-' },
];

export const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-black text-white tracking-tighter uppercase">Device Management</h1>
        <button className="flex items-center gap-2 bg-gray-800 px-4 py-2 rounded text-xs hover:bg-gray-700 transition">
          <RefreshCw size={14} /> Scan ADB
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {devices.map(device => (
          <div key={device.id} className="bg-[#0d0d0d] border border-gray-800 rounded-xl p-6 hover:border-blue-500/50 transition-all group">
            <div className="flex justify-between items-start mb-6">
              <div className="p-3 bg-blue-600/10 rounded-lg text-blue-500">
                <Monitor size={24} />
              </div>
              <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded ${device.status === 'online' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                {device.status}
              </span>
            </div>
            
            <h3 className="text-white font-bold mb-1">{device.name}</h3>
            <p className="text-gray-600 text-xs font-mono mb-6">{device.id}</p>

            <div className="flex gap-2">
              <button 
                onClick={() => navigate('/editor')}
                className="flex-1 bg-gray-800 hover:bg-blue-600 text-white py-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-2"
              >
                <Edit3 size={14} /> Build Script
              </button>
              <button className="w-10 bg-green-600/10 text-green-500 hover:bg-green-600 hover:text-white rounded-lg transition flex items-center justify-center">
                <Play size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};