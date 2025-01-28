import { createSlice } from "@reduxjs/toolkit";

export const APPLICATION_STATUS = {
  DRAFT: "draft",
  SUBMITTED: "submitted",
  UNDER_REVIEW: "under_review",
  DOCUMENT_VERIFICATION: "document_verification",
  APPROVED: "approved",
  REJECTED: "rejected",
};

const initialState = {
  applications: [],
  status: "idle",
  error: null,
};

export const applicationSlice = createSlice({
  name: "applications",
  initialState,
  reducers: {
    addApplication: (state, action) => {
      state.applications.push(action.payload);
    },
    updateApplication: (state, action) => {
      const index = state.applications.findIndex(
        (app) => app.id === action.payload.id,
      );
      if (index !== -1) {
        state.applications[index] = action.payload;
      }
    },
    removeApplication: (state, action) => {
      state.applications = state.applications.filter(
        (app) => app.id !== action.payload,
      );
    },
    setApplications: (state, action) => {
      state.applications = action.payload;
    },
    setStatus: (state, action) => {
      state.status = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const {
  addApplication,
  updateApplication,
  removeApplication,
  setApplications,
  setStatus,
  setError,
} = applicationSlice.actions;

export default applicationSlice.reducer;
