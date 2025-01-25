//src/store/slices/programsSlice.js

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  status: 'idle',
  error: null
};

const programsSlice = createSlice({
  name: 'programs',
  initialState,
  reducers: {
    setPrograms: (state, action) => {
      state.items = action.payload;
    },
    addProgram: (state, action) => {
      state.items.push(action.payload);
    },
    updateProgram: (state, action) => {
      const index = state.items.findIndex(prog => prog.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
    removeProgram: (state, action) => {
      state.items = state.items.filter(prog => prog.id !== action.payload);
    },
    setStatus: (state, action) => {
      state.status = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    }
  }
});

export const {
  setPrograms,
  addProgram,
  updateProgram,
  removeProgram,
  setStatus,
  setError
} = programsSlice.actions;

export default programsSlice.reducer;