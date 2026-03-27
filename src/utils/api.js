import { createAsyncThunk } from "@reduxjs/toolkit";

// Hàm bọc lại createAsyncThunk, tự động xử lý try/catch và lấy lỗi từ Axios
export const createApiThunk = (actionType, apiCall, defaultErrorMsg) => {
  return createAsyncThunk(actionType, async (arg, { rejectWithValue }) => {
    try {
      return await apiCall(arg); // Trả thẳng data luông (VD: ["test"])
    } catch (err) {
      return rejectWithValue(err.response?.data?.detail || err.response?.data || defaultErrorMsg);
    }
  });
};