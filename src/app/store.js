import { configureStore } from '@reduxjs/toolkit';
import editorReducer from '../features/editor/editorSlice';
import deviceReducer from '../features/dashboard/deviceSlice'

export const store = configureStore({
  reducer: {
    editor: editorReducer,
    device: deviceReducer
  },
  // Middleware mặc định của RTK đã bao gồm Thunk
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Tắt để truyền các chuỗi Base64 lớn mượt hơn
    }),
});