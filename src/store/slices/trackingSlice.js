// src/store/slices/trackingSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunks for different tracking features
export const updatePaymentStatus = createAsyncThunk(
  'tracking/updatePayment',
  async ({ applicationId, status, paymentDetails }) => {
    const response = await fetch(`/api/payments/${applicationId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, paymentDetails })
    });
    if (!response.ok) throw new Error('Payment update failed');
    return await response.json();
  }
);

export const scheduleAudit = createAsyncThunk(
  'tracking/scheduleAudit',
  async ({ applicationId, auditDetails }) => {
    const response = await fetch(`/api/audits/schedule`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ applicationId, ...auditDetails })
    });
    if (!response.ok) throw new Error('Audit scheduling failed');
    return await response.json();
  }
);

const trackingSlice = createSlice({
  name: 'tracking',
  initialState: {
    payments: {
      records: [],
      status: 'idle',
      error: null
    },
    documents: {
      verificationQueue: [],
      verified: [],
      rejected: [],
      status: 'idle',
      error: null
    },
    audits: {
      scheduled: [],
      completed: [],
      pending: [],
      status: 'idle',
      error: null
    },
    alerts: {
      upcoming: [],
      overdue: [],
      payment: [],
      status: 'idle',
      error: null
    }
  },
  reducers: {
    // Payment tracking
    updatePaymentRecord: (state, action) => {
      const { id, status, details } = action.payload;
      const payment = state.payments.records.find(p => p.id === id);
      if (payment) {
        payment.status = status;
        payment.details = { ...payment.details, ...details };
      }
    },
    
    // Document verification
    addToVerificationQueue: (state, action) => {
      state.documents.verificationQueue.push(action.payload);
    },
    updateDocumentStatus: (state, action) => {
      const { id, status, verificationDetails } = action.payload;
      // Move document between appropriate arrays based on status
      ['verificationQueue', 'verified', 'rejected'].forEach(arrayName => {
        state.documents[arrayName] = state.documents[arrayName].filter(doc => doc.id !== id);
      });
      state.documents[status === 'verified' ? 'verified' : 'rejected'].push({
        id,
        status,
        verificationDetails,
        updatedAt: new Date().toISOString()
      });
    },

    // Audit tracking
    updateAuditStatus: (state, action) => {
      const { id, status, details } = action.payload;
      ['scheduled', 'completed', 'pending'].forEach(arrayName => {
        state.audits[arrayName] = state.audits[arrayName].filter(audit => audit.id !== id);
      });
      state.audits[status].push({
        id,
        status,
        details,
        updatedAt: new Date().toISOString()
      });
    },

    // Alert management
    addAlert: (state, action) => {
      const { type, ...alertData } = action.payload;
      state.alerts[type].push({
        ...alertData,
        createdAt: new Date().toISOString(),
        read: false
      });
    },
    markAlertRead: (state, action) => {
      const { type, id } = action.payload;
      const alert = state.alerts[type].find(a => a.id === id);
      if (alert) {
        alert.read = true;
      }
    }
  },
  extraReducers: (builder) => {
    // Payment status updates
    builder
      .addCase(updatePaymentStatus.pending, (state) => {
        state.payments.status = 'loading';
      })
      .addCase(updatePaymentStatus.fulfilled, (state, action) => {
        state.payments.status = 'succeeded';
        // Update payment record
      })
      .addCase(updatePaymentStatus.rejected, (state, action) => {
        state.payments.status = 'failed';
        state.payments.error = action.error.message;
      })

    // Audit scheduling
    builder
      .addCase(scheduleAudit.pending, (state) => {
        state.audits.status = 'loading';
      })
      .addCase(scheduleAudit.fulfilled, (state, action) => {
        state.audits.status = 'succeeded';
        state.audits.scheduled.push(action.payload);
      })
      .addCase(scheduleAudit.rejected, (state, action) => {
        state.audits.status = 'failed';
        state.audits.error = action.error.message;
      });
  }
});

export const {
  updatePaymentRecord,
  addToVerificationQueue,
  updateDocumentStatus,
  updateAuditStatus,
  addAlert,
  markAlertRead
} = trackingSlice.actions;

export default trackingSlice.reducer;