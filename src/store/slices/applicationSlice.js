// src/store/slices/applicationSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Application status types
export const APPLICATION_STATUS = {
  DRAFT: 'draft',
  SUBMITTED: 'submitted',
  UNDER_REVIEW: 'under_review',
  DOCUMENT_VERIFICATION: 'document_verification',
  PAYMENT_PENDING: 'payment_pending',
  INSPECTION_SCHEDULED: 'inspection_scheduled',
  INSPECTION_COMPLETED: 'inspection_completed',
  PENDING_APPROVAL: 'pending_approval',
  APPROVED: 'approved',
  REJECTED: 'rejected'
};

// Audit types
export const AUDIT_TYPES = {
  INITIAL: 'initial',
  FOLLOW_UP: 'follow_up',
  ANNUAL: 'annual',
  RENEWAL: 'renewal'
};

// Document verification status
export const DOCUMENT_STATUS = {
  PENDING: 'pending',
  UNDER_REVIEW: 'under_review',
  VERIFIED: 'verified',
  REJECTED: 'rejected'
};

// Async thunks
export const submitApplication = createAsyncThunk(
  'applications/submit',
  async (formData) => {
    const response = await fetch('/api/applications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    
    if (!response.ok) throw new Error('Application submission failed');
    return await response.json();
  }
);

export const scheduleInspection = createAsyncThunk(
  'applications/scheduleInspection',
  async ({ applicationId, inspectionData }) => {
    const response = await fetch(`/api/applications/${applicationId}/inspections`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(inspectionData)
    });
    
    if (!response.ok) throw new Error('Inspection scheduling failed');
    return await response.json();
  }
);

const initialState = {
  applications: [],
  instructors: [],
  certificates: [],
  audits: [],
  documents: [],
  payments: [],
  status: 'idle',
  error: null,
  filters: {
    status: 'all',
    type: 'all',
    date: 'all'
  },
  currentApplication: null,
  notifications: []
};

const applicationSlice = createSlice({
  name: 'applications',
  initialState,
  reducers: {
    setApplications(state, action) {
      state.applications = action.payload;
    },
    updateApplicationStatus(state, action) {
      const { id, status, updateType } = action.payload;
      const application = state.applications.find(app => app.id === id);
      if (application) {
        application.status = status;
        if (updateType === 'payment') {
          application.paymentStatus = status;
        } else if (updateType === 'document') {
          application.documentStatus = status;
        }
      }
    },
    addInstructor(state, action) {
      state.instructors.push(action.payload);
    },
    updateInstructor(state, action) {
      const idx = state.instructors.findIndex(i => i.id === action.payload.id);
      if (idx !== -1) {
        state.instructors[idx] = action.payload;
      }
    },
    addCertificate(state, action) {
      state.certificates.push(action.payload);
    },
    updateAuditStatus(state, action) {
      const { applicationId, auditType, status } = action.payload;
      const application = state.applications.find(app => app.id === applicationId);
      if (application) {
        if (!application.audits) application.audits = [];
        application.audits.push({
          type: auditType,
          status,
          date: new Date().toISOString()
        });
      }
    },
    addNotification(state, action) {
      state.notifications.push(action.payload);
    },
    setFilters(state, action) {
      state.filters = { ...state.filters, ...action.payload };
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitApplication.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(submitApplication.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.applications.push(action.payload);
      })
      .addCase(submitApplication.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(scheduleInspection.fulfilled, (state, action) => {
        const { applicationId, inspection } = action.payload;
        const application = state.applications.find(app => app.id === applicationId);
        if (application) {
          application.inspections = application.inspections || [];
          application.inspections.push(inspection);
        }
      });
  }
});

export const {
  setApplications,
  updateApplicationStatus,
  addInstructor,
  updateInstructor,
  addCertificate,
  updateAuditStatus,
  addNotification,
  setFilters
} = applicationSlice.actions;

export default applicationSlice.reducer;