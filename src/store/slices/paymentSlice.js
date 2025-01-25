// src/store/slices/paymentSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { eCitizenPaymentService } from '../../services/eCitizenPaymentService';
import { eCitizenServices } from '../../config/eCitizenServices';

export const initiateECitizenPayment = createAsyncThunk(
  'payments/initiateECitizen',
  async ({ serviceCode, applicationData }) => {
    const result = await eCitizenPaymentService.initiatePayment(serviceCode, applicationData);
    return result;
  }
);

export const verifyECitizenPayment = createAsyncThunk(
  'payments/verifyECitizen',
  async (transactionId) => {
    const result = await eCitizenPaymentService.verifyPayment(transactionId);
    return result;
  }
);

export const generateECitizenReceipt = createAsyncThunk(
  'payments/generateReceipt',
  async (transactionId) => {
    const result = await eCitizenPaymentService.generateReceipt(transactionId);
    return result;
  }
);

const initialState = {
  // ... existing initialState ...
  serviceCodes: eCitizenServices,
  currentTransaction: null,
  paymentHistory: [],
  eCitizenStatus: {
    initiated: false,
    transactionId: null,
    verified: false,
    receiptUrl: null
  }
};

const paymentSlice = createSlice({
  name: 'payments',
  initialState,
  reducers: {
    // ... existing reducers ...
    setECitizenTransaction: (state, action) => {
      state.currentTransaction = action.payload;
    },
    clearECitizenTransaction: (state) => {
      state.currentTransaction = null;
      state.eCitizenStatus = initialState.eCitizenStatus;
    }
  },
  extraReducers: (builder) => {
    builder
      // e-Citizen payment initiation
      .addCase(initiateECitizenPayment.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(initiateECitizenPayment.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.eCitizenStatus = {
          initiated: true,
          transactionId: action.payload.transactionId,
          verified: false
        };
        state.currentTransaction = action.payload;
      })
      .addCase(initiateECitizenPayment.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })

      // e-Citizen payment verification
      .addCase(verifyECitizenPayment.fulfilled, (state, action) => {
        state.eCitizenStatus.verified = true;
        if (state.currentTransaction) {
          state.currentTransaction.status = action.payload.status;
          state.currentTransaction.receiptNumber = action.payload.receiptNumber;
        }
      })

      // Receipt generation
      .addCase(generateECitizenReceipt.fulfilled, (state, action) => {
        state.eCitizenStatus.receiptUrl = action.payload.receiptUrl;
      });
  }
});

export const {
  setECitizenTransaction,
  clearECitizenTransaction,
  // ... existing exports ...
} = paymentSlice.actions;

export default paymentSlice.reducer;