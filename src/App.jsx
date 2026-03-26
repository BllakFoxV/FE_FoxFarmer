import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Dashboard } from './features/dashboard/Dashboard';
import { Editor } from './features/editor/Editor';

const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-[#050505]">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/editor" element={<Editor />} />
        </Routes>
        <Toaster position="bottom-left" toastOptions={{ 
          style: { background: '#121212', color: '#fff', border: '1px solid #333', fontSize: '12px', fontWeight: 'bold' } 
        }} />
      </div>
    </Router>
  );
};

export default App;