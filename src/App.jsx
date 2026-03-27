import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Dashboard } from '@/features/dashboard/Dashboard';
import { Editor } from '@/features/editor/Editor';
import { Toaster } from 'react-hot-toast';

const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-[#050505]">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          {/* :scriptName là tham số động, ví dụ /editor/auto_reg.json */}
          <Route path="/editor" element={<Editor />} />
        </Routes>
        <Toaster position="bottom-left" />
      </div>
    </Router>
  );
};

export default App;