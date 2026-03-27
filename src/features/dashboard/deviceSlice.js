import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '@/api/apiClient';
import { ENDPOINTS } from '@/api/endpoints'; // Đảm bảo import đúng đường dẫn ENDPOINTS của mày

// --- ASYNC THUNKS ---

// 1. Lấy danh sách thiết bị
export const fetchDevicesThunk = createAsyncThunk(
  'device/fetchDevices',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(ENDPOINTS.DEVICES.LIST);
      return response; 
    } catch (err) {
      return rejectWithValue(err.response?.data || "Lỗi lấy danh sách thiết bị");
    }
  }
);

// 2. Start Script trên Device
export const startDeviceThunk = createAsyncThunk(
  'device/startDevice',
  async ({ id, scriptName }, { rejectWithValue }) => {
    try {
      // Body truyền script_name xuống BE để nó biết chạy file nào
      const response = await apiClient.post(ENDPOINTS.DEVICES.START(id), { script_name: scriptName });
      return { id, data: response };
    } catch (err) {
      return rejectWithValue(err.response?.data || `Lỗi start thiết bị ${id}`);
    }
  }
);

// 3. Stop Script trên Device
export const stopDeviceThunk = createAsyncThunk(
  'device/stopDevice',
  async (id, { rejectWithValue }) => {
    try {
      const response = await apiClient.post(ENDPOINTS.DEVICES.STOP(id));
      return { id, data: response };
    } catch (err) {
      return rejectWithValue(err.response?.data || `Lỗi stop thiết bị ${id}`);
    }
  }
);

// --- SLICE ---
export const deviceSlice = createSlice({
  name: 'device',
  initialState: {
    list: [], // Mảng chứa các object device { id, name, status... }
    loading: false,
    error: null,
  },
  reducers: {
    // Dùng cái này khi WebSocket bắn event từ BE về để update UI real-time
    updateDeviceStatus: (state, action) => {
      const { id, status } = action.payload;
      const device = state.list.find(d => d.id === id);
      if (device) {
        device.status = status;
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Devices
      .addCase(fetchDevicesThunk.pending, (state) => { 
        state.loading = true; 
        state.error = null; 
      })
      .addCase(fetchDevicesThunk.fulfilled, (state, action) => {
        state.loading = false;
        // Đảm bảo list luôn là mảng. Tùy interceptor của mày bóc data thế nào
        state.list = Array.isArray(action.payload) ? action.payload : (action.payload?.data || []);
      })
      .addCase(fetchDevicesThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Start Device (Update UI tạm thời thành PLAYING)
      .addCase(startDeviceThunk.fulfilled, (state, action) => {
        const device = state.list.find(d => d.id === action.payload.id);
        if (device) device.status = 'PLAYING';
      })
      
      // Stop Device (Update UI tạm thời về ONLINE)
      .addCase(stopDeviceThunk.fulfilled, (state, action) => {
        const device = state.list.find(d => d.id === action.payload.id);
        if (device) device.status = 'ONLINE';
      });
  }
});

export const { updateDeviceStatus } = deviceSlice.actions;
export default deviceSlice.reducer;