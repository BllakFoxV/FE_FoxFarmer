import { createSlice } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';

export const editorSlice = createSlice({
  name: 'editor',
  initialState: {
    actions: [], // Mảng phẳng
    linking: { active: false, sourceId: null, field: null }
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
    finishLink: (state, action) => {
      const source = state.actions.find(a => a.id === state.linking.sourceId);
      if (source) source.data[state.linking.field] = action.payload;
      state.linking = { active: false, sourceId: null, field: null };
    },
    clearScript: (state) => {
      state.actions = [];
    }
  }
});