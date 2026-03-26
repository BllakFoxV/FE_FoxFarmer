import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';

const API_BASE = 'http://localhost:3275';

// --- ASYNC THUNKS ---
export const getScreenshotThunk = createAsyncThunk(
  'editor/getScreenshot',
  async (deviceId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE}/api/v1/devices/${deviceId}/screenshot`);
      return response.data.image; 
    } catch (err) {
      return rejectWithValue(err.response?.data?.detail || "Screenshot failed");
    }
  }
);

export const saveScriptThunk = createAsyncThunk(
  'editor/saveScript',
  async ({ name, actions }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_BASE}/api/v1/scripts/save`, {
        name: name.endsWith('.json') ? name : `${name}.json`,
        data: actions
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.detail || "Save failed");
    }
  }
);

// --- SLICE ---
export const editorSlice = createSlice({
  name: 'editor',
  initialState: {
    actions: [],
    linking: { active: false, sourceId: null, field: null },
    loading: false,
    currentScreenshot: null,
    error: null
  },
  reducers: {
    addAction: (state, action) => {
      state.actions.push({ id: uuidv4(), type: action.payload, data: {} });
    },
    updateData: (state, action) => {
      const target = state.actions.find(a => a.id === action.payload.id);
      if (target) target.data = { ...target.data, ...action.payload.data };
    },
    removeAction: (state, action) => {
      state.actions = state.actions.filter(a => a.id !== action.payload);
    },
    moveAction: (state, action) => {
      const { oldIndex, newIndex } = action.payload;
      const [movedItem] = state.actions.splice(oldIndex, 1);
      state.actions.splice(newIndex, 0, movedItem);
    },
    setLinkMode: (state, action) => {
      state.linking = { active: true, sourceId: action.payload.id, field: action.payload.field };
    },
    cancelLinking: (state) => {
      state.linking = { active: false, sourceId: null, field: null };
    },
    finishLink: (state, action) => {
      const source = state.actions.find(a => a.id === state.linking.sourceId);
      if (source) source.data[state.linking.field] = action.payload;
      state.linking = { active: false, sourceId: null, field: null };
    },
    clearScript: (state) => { state.actions = []; }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getScreenshotThunk.pending, (state) => { state.loading = true; })
      .addCase(getScreenshotThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.currentScreenshot = `data:image/png;base64,${action.payload}`;
      })
      .addCase(getScreenshotThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(saveScriptThunk.pending, (state) => { state.loading = true; })
      .addCase(saveScriptThunk.fulfilled, (state) => { state.loading = false; });
  }
});

// Export Actions để dùng trong Dispatch
export const { addAction, updateData, removeAction, moveAction, setLinkMode, cancelLinking, finishLink, clearScript } = editorSlice.actions;

// Export Reducer làm Default để Store nhận được
export default editorSlice.reducer;