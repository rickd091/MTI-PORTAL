// src/store/slices/documentsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunks for document management
export const uploadDocument = createAsyncThunk(
  'documents/upload',
  async (fileData) => {
    const formData = new FormData();
    formData.append('file', fileData.file);
    formData.append('type', fileData.type);
    formData.append('applicationId', fileData.applicationId);

    const response = await fetch('/api/documents/upload', {
      method: 'POST',
      body: formData
    });
    
    if (!response.ok) throw new Error('Failed to upload document');
    return await response.json();
  }
);

export const verifyDocument = createAsyncThunk(
  'documents/verify',
  async ({ documentId, verificationData }) => {
    const response = await fetch(`/api/documents/${documentId}/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(verificationData)
    });

    if (!response.ok) throw new Error('Document verification failed');
    return await response.json();
  }
);

export const fetchDocuments = createAsyncThunk(
  'documents/fetch',
  async ({ applicationId, type }) => {
    const response = await fetch(`/api/documents?applicationId=${applicationId}&type=${type}`);
    if (!response.ok) throw new Error('Failed to fetch documents');
    return await response.json();
  }
);

const initialState = {
  documents: {
    pending: [],
    verified: [],
    rejected: [],
    all: []
  },
  requiredDocuments: {
    MTI_APPLICATION: [
      { 
        id: 'REG_CERT',
        name: 'Registration Certificate',
        required: true,
        description: 'Business registration certificate',
        allowedTypes: ['pdf', 'jpg', 'png'],
        maxSize: 5 * 1024 * 1024 // 5MB
      },
      {
        id: 'PAQ',
        name: 'Pre-Audit Questionnaire',
        required: true,
        description: 'Completed pre-audit questionnaire form',
        allowedTypes: ['pdf'],
        maxSize: 10 * 1024 * 1024 // 10MB
      },
      {
        id: 'COURSE_OUTLINE',
        name: 'Course Outlines',
        required: true,
        description: 'Detailed course curriculum and schedules',
        allowedTypes: ['pdf', 'doc', 'docx'],
        maxSize: 20 * 1024 * 1024 // 20MB
      }
    ],
    INSTRUCTOR_APPLICATION: [
      {
        id: 'CV',
        name: 'Curriculum Vitae',
        required: true,
        description: 'Detailed CV with maritime experience',
        allowedTypes: ['pdf', 'doc', 'docx'],
        maxSize: 5 * 1024 * 1024
      },
      {
        id: 'CERTIFICATES',
        name: 'Professional Certificates',
        required: true,
        description: 'Maritime qualifications and certificates',
        allowedTypes: ['pdf', 'jpg', 'png'],
        maxSize: 15 * 1024 * 1024
      }
    ]
  },
  verificationChecklist: {
    REG_CERT: [
      { id: 'auth', label: 'Authenticity Verified', required: true },
      { id: 'valid', label: 'Currently Valid', required: true },
      { id: 'complete', label: 'All Information Complete', required: true }
    ],
    PAQ: [
      { id: 'complete', label: 'All Sections Completed', required: true },
      { id: 'consistent', label: 'Information Consistent', required: true },
      { id: 'adequate', label: 'Responses Adequate', required: true }
    ]
  },
  status: 'idle',
  error: null,
  currentDocument: null
};

const documentsSlice = createSlice({
  name: 'documents',
  initialState,
  reducers: {
    setCurrentDocument: (state, action) => {
      state.currentDocument = action.payload;
    },
    addVerificationNote: (state, action) => {
      const { documentId, note } = action.payload;
      const document = state.documents.all.find(doc => doc.id === documentId);
      if (document) {
        if (!document.verificationNotes) document.verificationNotes = [];
        document.verificationNotes.push({
          ...note,
          timestamp: new Date().toISOString()
        });
      }
    },
    updateDocumentStatus: (state, action) => {
      const { documentId, status, verificationDetails } = action.payload;
      const document = state.documents.all.find(doc => doc.id === documentId);
      if (document) {
        document.status = status;
        document.verificationDetails = verificationDetails;
        document.verifiedAt = new Date().toISOString();
        
        // Move document to appropriate list
        ['pending', 'verified', 'rejected'].forEach(list => {
          state.documents[list] = state.documents[list].filter(d => d.id !== documentId);
        });
        state.documents[status === 'verified' ? 'verified' : 'rejected'].push(document);
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // Upload document
      .addCase(uploadDocument.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(uploadDocument.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.documents.all.push(action.payload);
        state.documents.pending.push(action.payload);
      })
      .addCase(uploadDocument.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })

      // Verify document
      .addCase(verifyDocument.fulfilled, (state, action) => {
        const { id, status } = action.payload;
        state.documents.pending = state.documents.pending.filter(doc => doc.id !== id);
        if (status === 'verified') {
          state.documents.verified.push(action.payload);
        } else {
          state.documents.rejected.push(action.payload);
        }
      })

      // Fetch documents
      .addCase(fetchDocuments.fulfilled, (state, action) => {
        state.documents.all = action.payload;
        state.documents.pending = action.payload.filter(doc => doc.status === 'pending');
        state.documents.verified = action.payload.filter(doc => doc.status === 'verified');
        state.documents.rejected = action.payload.filter(doc => doc.status === 'rejected');
      });
  }
});

export const {
  setCurrentDocument,
  addVerificationNote,
  updateDocumentStatus
} = documentsSlice.actions;

export default documentsSlice.reducer;