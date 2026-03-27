import React, {useEffect} from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Dashboard } from '@/features/dashboard/Dashboard';
import { Editor } from '@/features/editor/Editor';
import { Toaster } from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { fetchDevicesThunk } from './features/dashboard/deviceSlice';
import { fetchScriptsThunk } from './features/editor/editorSlice';

const App = () => {
  const dispatch = useDispatch()
  useEffect(() => {
    // Load dữ liệu một lần duy nhất khi mở App
    dispatch(fetchDevicesThunk());
    dispatch(fetchScriptsThunk());
  }, [dispatch]);
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