//src/contexts/RegistrationContext.js
import React, { createContext, useContext, useReducer } from 'react';

const RegistrationContext = createContext(null);

const initialState = {
  currentStep: 1,
  formData: {
    basicInfo: {},
    premises: {},
    management: {},
    infrastructure: {},
    documents: {}
  },
  validation: {
    basicInfo: false,
    premises: false,
    management: false,
    infrastructure: false,
    documents: false
  },
  uploads: {},
  isSubmitting: false,
  errors: {},
  lastSaved: null
};

function registrationReducer(state, action) {
  switch (action.type) {
    case 'UPDATE_FORM_DATA':
      return {
        ...state,
        formData: {
          ...state.formData,
          [action.section]: action.data
        },
        lastSaved: new Date().toISOString()
      };
    
    case 'SET_VALIDATION':
      return {
        ...state,
        validation: {
          ...state.validation,
          [action.section]: action.isValid
        }
      };
    
    case 'UPDATE_UPLOAD_PROGRESS':
      return {
        ...state,
        uploads: {
          ...state.uploads,
          [action.fileId]: action.progress
        }
      };
    
    case 'SET_STEP':
      return {
        ...state,
        currentStep: action.step
      };
    
    case 'SET_ERROR':
      return {
        ...state,
        errors: {
          ...state.errors,
          [action.section]: action.error
        }
      };
    
    case 'CLEAR_ERROR':
      const newErrors = { ...state.errors };
      delete newErrors[action.section];
      return {
        ...state,
        errors: newErrors
      };
    
    case 'SET_SUBMITTING':
      return {
        ...state,
        isSubmitting: action.isSubmitting
      };
    
    default:
      return state;
  }
}

export function RegistrationProvider({ children }) {
  const [state, dispatch] = useReducer(registrationReducer, initialState);

  return (
    <RegistrationContext.Provider value={{ state, dispatch }}>
      {children}
    </RegistrationContext.Provider>
  );
}

export function useRegistration() {
  const context = useContext(RegistrationContext);
  if (!context) {
    throw new Error('useRegistration must be used within a RegistrationProvider');
  }
  return context;
}