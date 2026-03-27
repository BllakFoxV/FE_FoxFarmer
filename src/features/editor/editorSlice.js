import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';
import apiClient from '@/api/apiClient'; 
import { ENDPOINTS } from '@/api/endpoints'; 
import { createApiThunk } from '@/utils/api';

// --- ASYNC THUNKS ---
export const fetchScriptsThunk = createApiThunk(
  'editor/fetchScripts',
  // Sửa lại endpoint này cho khớp với backend của bạn nhé (API trả về mảng string tên file)
  () => apiClient.get(ENDPOINTS.SCRIPTS.LIST), 
  "Lỗi lấy danh sách script"
);

export const loadScriptThunk = createApiThunk(
  'editor/loadScript',
  (fileName) => apiClient.get(ENDPOINTS.SCRIPTS.LOAD(fileName)),
  "Lỗi load script"
);

export const saveScriptThunk = createApiThunk(
  'editor/saveScript',
  ({ name, actions }) => apiClient.post(ENDPOINTS.SCRIPTS.SAVE, {
    filename: name.endsWith('.json') ? name : `${name}.json`,
    actions
  }),
  "Lỗi save script"
);

export const getScreenshotThunk = createApiThunk(
  'editor/getScreenshot',
  async (deviceId) => {
    const response = await apiClient.get(ENDPOINTS.DEVICES.SCREENSHOT(deviceId));
    return response.image || response.data?.image || response; 
  },
  "Lỗi chụp màn hình"
);

export const testStepThunk = createApiThunk(
  'editor/testStep',
  ({ deviceId, action }) => {
    console.log(action)
    return apiClient.post(ENDPOINTS.SCRIPTS.TEST_STEP(deviceId), action)
  },
  "Lỗi thực thi thử bước này"
);

export const getActiveAppThunk = createApiThunk(
  'editor/getActiveApp',
  (deviceId) => apiClient.get(ENDPOINTS.DEVICES.ACTIVE_APP(deviceId)),
  "Lỗi lấy app hiện hành"
);

export const getListAppThunk = createApiThunk(
  'editor/getListApp',
  (deviceId) => apiClient.get(ENDPOINTS.DEVICES.LIST_APP(deviceId)),
  "Lỗi lấy danh sách app"
);

// --- SLICE ---
export const editorSlice = createSlice({
  name: 'editor',
  initialState: {
    currentScriptName: null,
    actions: [],
    availableScripts: [], 
    collapsedGroups: [],
    loading: false,
    error: null,
    currentScreenshot: null,
    linking: null 
  },
  reducers: {
    addAction: (state, action) => {
      const incomingType = typeof action.payload === 'string' ? action.payload : action.payload?.type;
      state.actions.push({ 
        id: action.payload?.id || uuidv4(), 
        type: String(incomingType || "tap"), 
        data: action.payload?.data || {} 
      });
    },
    updateData: (state, action) => {
      const target = state.actions.find(a => a.id === action.payload.id);
      if (target) {
        target.data = { ...target.data, ...action.payload.data };
      }
    },
    removeAction: (state, action) => {
      state.actions = state.actions.filter(a => a.id !== action.payload);
    },
    reorderActions: (state, action) => {
      const { startIndex, endIndex } = action.payload;
      const [movedItem] = state.actions.splice(startIndex, 1);
      state.actions.splice(endIndex, 0, movedItem);
    },
    setLinking: (state, action) => {
      state.linking = action.payload; 
    },
    clearScript: (state) => {
      state.actions = [];
    },
    setActions: (state, action) => {
      state.actions = action.payload;
    },
    setCurrentName:(state, action)=>{
      state.currentScriptName = action.payload
    },
    toggleGroup: (state, action) => { 
      const groupId = action.payload;
      if (state.collapsedGroups.includes(groupId)) {
        state.collapsedGroups = state.collapsedGroups.filter(id => id !== groupId);
      } else {
        state.collapsedGroups.push(groupId);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchScriptsThunk.fulfilled, (state, action) => {
        state.availableScripts = action.payload || []; // Đảm bảo luôn là mảng
      })
      .addCase(loadScriptThunk.fulfilled, (state, action) => {
        state.actions = action.payload;
      })
      .addCase(getScreenshotThunk.fulfilled, (state, action) => {
        state.currentScreenshot = `data:image/png;base64,${action.payload}`;
      })
      
      // Xử lý chung Loading & Error
      .addMatcher(
        (action) => action.type.startsWith('editor/') && action.type.endsWith('/pending'),
        (state) => { state.loading = true; state.error = null; }
      )
      .addMatcher(
        (action) => action.type.startsWith('editor/') && action.type.endsWith('/fulfilled'),
        (state) => { state.loading = false; }
      )
      .addMatcher(
        (action) => action.type.startsWith('editor/') && action.type.endsWith('/rejected'),
        (state, action) => { 
          state.loading = false;
          state.error = action.payload || "Đã xảy ra lỗi";
        }
      );
  }
});

export const { 
  addAction, updateData, removeAction, reorderActions, 
  setLinking, clearScript, setActions, setCurrentName,
  toggleGroup
} = editorSlice.actions;

export default editorSlice.reducer;