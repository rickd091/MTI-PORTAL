//src/store/index.js

import { configureStore } from '@reduxjs/toolkit';

import applicationReducer from './slices/applicationSlice';
import documentsReducer from './slices/documentsSlice';
import programsReducer from './slices/programsSlice';

export const store = configureStore({
  reducer: {
    applications: applicationReducer,
    documents: documentsReducer,
    programs: programsReducer,
  },
});