//src/components/registration/RegistrationWizard.js
import React, { useEffect } from 'react';
import { useRegistration } from '../../contexts/RegistrationContext';
import { AlertCircle, Save, CheckCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export const RegistrationWizard = ({ children, onComplete }) => {
  const { state, dispatch } = useRegistration();

  // Auto-save functionality
  useEffect(() => {
    const saveFormData = async () => {
      if (state.lastSaved) {
        try {
          localStorage.setItem('registrationDraft', JSON.stringify(state.formData));
        } catch (error) {
          console.error('Error saving draft:', error);
        }
      }
    };

    saveFormData();
  }, [state.formData, state.lastSaved]);

  // Load saved draft on mount
  useEffect(() => {
    const loadDraft = () => {
      try {
        const savedDraft = localStorage.getItem('registrationDraft');
        if (savedDraft) {
          const parsedDraft = JSON.parse(savedDraft);
          dispatch({ 
            type: 'UPDATE_FORM_DATA', 
            section: 'all', 
            data: parsedDraft 
          });
        }
      } catch (error) {
        console.error('Error loading draft:', error);
      }
    };

    loadDraft();
  }, []);

  const isStepValid = (step) => {
    return state.validation[Object.keys(state.validation)[step - 1]];
  };

  const handleNext = () => {
    if (isStepValid(state.currentStep)) {
      dispatch({ type: 'SET_STEP', step: state.currentStep + 1 });
    }
  };

  const handlePrevious = () => {
    dispatch({ type: 'SET_STEP', step: state.currentStep - 1 });
  };

  const handleSubmit = async () => {
    if (Object.values(state.validation).every(Boolean)) {
      dispatch({ type: 'SET_SUBMITTING', isSubmitting: true });
      try {
        await onComplete(state.formData);
        localStorage.removeItem('registrationDraft');
      } catch (error) {
        dispatch({ 
          type: 'SET_ERROR', 
          section: 'submission', 
          error: 'Failed to submit registration. Please try again.' 
        });
      } finally {
        dispatch({ type: 'SET_SUBMITTING', isSubmitting: false });
      }
    }
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardContent className="p-6">
        {/* Progress Indicator */}
        <div className="mb-6">
          <div className="flex justify-between">
            {Object.keys(state.validation).map((step, index) => (
              <div 
                key={step}
                className={`flex flex-col items-center w-full
                  ${index < Object.keys(state.validation).length - 1 ? 'relative' : ''}`}
              >
                <div 
                  className={`w-10 h-10 rounded-full flex items-center justify-center
                    ${state.validation[step] ? 'bg-green-500' : 
                      state.currentStep === index + 1 ? 'bg-blue-500' : 'bg-gray-200'} 
                    text-white`}
                >
                  {state.validation[step] ? (
                    <CheckCircle className="w-6 h-6" />
                  ) : (
                    index + 1
                  )}
                </div>
                <span className="mt-2 text-sm">{step}</span>
                {index < Object.keys(state.validation).length - 1 && (
                  <div className="absolute top-5 left-1/2 w-full h-0.5 bg-gray-200" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Error Messages */}
        {Object.entries(state.errors).map(([section, error]) => (
          <div 
            key={section}
            className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md flex items-start"
          >
            <AlertCircle className="w-5 h-5 text-red-500 mr-2 mt-0.5" />
            <span className="text-red-700">{error}</span>
          </div>
        ))}

        {/* Auto-save Indicator */}
        {state.lastSaved && (
          <div className="mb-4 flex items-center text-sm text-gray-500">
            <Save className="w-4 h-4 mr-1" />
            Last saved: {new Date(state.lastSaved).toLocaleTimeString()}
          </div>
        )}

        {/* Form Content */}
        <div className="mb-6">
          {children}
        </div>

        {/* Navigation */}
        <div className="flex justify-between pt-6 border-t">
          <button
            onClick={handlePrevious}
            disabled={state.currentStep === 1}
            className="px-4 py-2 text-gray-600 border rounded-md disabled:opacity-50"
          >
            Previous
          </button>
          <div>
            {state.currentStep < Object.keys(state.validation).length ? (
              <button
                onClick={handleNext}
                disabled={!isStepValid(state.currentStep)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={state.isSubmitting || !Object.values(state.validation).every(Boolean)}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
              >
                {state.isSubmitting ? 'Submitting...' : 'Submit Registration'}
              </button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};