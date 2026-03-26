import { configureStore } from '@reduxjs/toolkit';
import editorReducer from '../features/editor/editorSlice';

export const store = configureStore({
  reducer: {
    editor: editorReducer,
  },
  // Middleware mặc định của RTK đã bao gồm Thunk
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Tắt để truyền các chuỗi Base64 lớn mượt hơn
    }),
});