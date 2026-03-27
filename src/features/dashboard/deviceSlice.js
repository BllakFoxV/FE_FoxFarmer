import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '@/api/apiClient';
import { ENDPOINTS } from '@/api/endpoints';
import { createApiThunk } from '@/utils/api';

// --- ASYNC THUNKS ---

// 1. Lấy danh sách thiết bị
export const fetchDevicesThunk = createApiThunk(
  'device/fetchDevices',
  async ()=> await apiClient.get(ENDPOINTS.DEVICES.LIST),
  "error can't get device list"
);

// 2. Start Script trên Device
export const startDeviceThunk = createApiThunk(
  'device/startDevice',
  async (device_id, file_name)=> await apiClient.post(ENDPOINTS.DEVICES.START(id), { file_name }),
  "device error"
)

// 3. Stop Script trên Device
export const stopDeviceThunk = createApiThunk(
  'device/stopDevice',
  async (id) => await apiClient.post(ENDPOINTS.DEVICES.STOP(id)),
  "error, can't stop"
)

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
    },
    setLoading: (state, action)=>{
      state.loading = action.payload
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