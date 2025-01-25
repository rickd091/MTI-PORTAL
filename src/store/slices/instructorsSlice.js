// src/store/slices/instructorsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchInstructors = createAsyncThunk(
  'instructors/fetch',
  async () => {
    const response = await fetch('/api/instructors');
    if (!response.ok) throw new Error('Failed to fetch instructors');
    return await response.json();
  }
);

export const addInstructor = createAsyncThunk(
  'instructors/add',
  async (instructorData) => {
    const response = await fetch('/api/instructors', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(instructorData)
    });
    if (!response.ok) throw new Error('Failed to add instructor');
    return await response.json();
  }
);

export const updateInstructorCertification = createAsyncThunk(
  'instructors/updateCert',
  async ({ instructorId, certificationData }) => {
    const response = await fetch(`/api/instructors/${instructorId}/certifications`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(certificationData)
    });
    if (!response.ok) throw new Error('Failed to update certification');
    return await response.json();
  }
);

const initialState = {
  list: [],
  status: 'idle',
  error: null,
  filters: {
    search: '',
    specialization: 'all',
    status: 'all'
  }
};

const instructorsSlice = createSlice({
  name: 'instructors',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInstructors.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchInstructors.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.list = action.payload;
      })
      .addCase(fetchInstructors.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  }
});

export const { setFilters } = instructorsSlice.actions;
export default instructorsSlice.reducer;