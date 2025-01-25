// src/store/slices/monitoringSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunks for audit management
export const fetchAudits = createAsyncThunk(
  'monitoring/fetchAudits',
  async () => {
    const response = await fetch('/api/audits');
    if (!response.ok) throw new Error('Failed to fetch audits');
    return await response.json();
  }
);

export const scheduleAudit = createAsyncThunk(
  'monitoring/scheduleAudit',
  async (auditData) => {
    const response = await fetch('/api/audits/schedule', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(auditData)
    });
    if (!response.ok) throw new Error('Failed to schedule audit');
    return await response.json();
  }
);

export const updateAuditStatus = createAsyncThunk(
  'monitoring/updateAuditStatus',
  async ({ auditId, status, findings }) => {
    const response = await fetch(`/api/audits/${auditId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, findings })
    });
    if (!response.ok) throw new Error('Failed to update audit status');
    return await response.json();
  }
);

const initialState = {
  audits: [],
  scheduledAudits: [],
  completedAudits: [],
  upcomingAudits: [],
  alerts: [],
  status: 'idle',
  error: null,
  filters: {
    type: 'all',
    status: 'all',
    dateRange: 'all'
  }
};

const monitoringSlice = createSlice({
  name: 'monitoring',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    addAlert: (state, action) => {
      state.alerts.push({
        ...action.payload,
        id: Date.now(),
        createdAt: new Date().toISOString()
      });
    },
    clearAlert: (state, action) => {
      state.alerts = state.alerts.filter(alert => alert.id !== action.payload);
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch audits
      .addCase(fetchAudits.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAudits.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.audits = action.payload;
        state.scheduledAudits = action.payload.filter(audit => audit.status === 'scheduled');
        state.completedAudits = action.payload.filter(audit => audit.status === 'completed');
        state.upcomingAudits = action.payload.filter(audit => {
          const auditDate = new Date(audit.scheduledDate);
          const today = new Date();
          const twoWeeks = 14 * 24 * 60 * 60 * 1000;
          return auditDate - today <= twoWeeks && audit.status === 'scheduled';
        });
      })
      .addCase(fetchAudits.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      // Schedule audit
      .addCase(scheduleAudit.fulfilled, (state, action) => {
        state.audits.push(action.payload);
        state.scheduledAudits.push(action.payload);
      })
      // Update audit status
      .addCase(updateAuditStatus.fulfilled, (state, action) => {
        const index = state.audits.findIndex(a => a.id === action.payload.id);
        if (index !== -1) {
          state.audits[index] = action.payload;
          state.scheduledAudits = state.audits.filter(audit => audit.status === 'scheduled');
          state.completedAudits = state.audits.filter(audit => audit.status === 'completed');
          state.upcomingAudits = state.audits.filter(audit => {
            const auditDate = new Date(audit.scheduledDate);
            const today = new Date();
            const twoWeeks = 14 * 24 * 60 * 60 * 1000;
            return auditDate - today <= twoWeeks && audit.status === 'scheduled';
          });
        }
      });
  }
});

export const { setFilters, addAlert, clearAlert } = monitoringSlice.actions;

export default monitoringSlice.reducer;