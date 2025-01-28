// src/components/applications/ApplicationProgress.js
import { Check, AlertCircle } from 'lucide-react';
import React from 'react';

export const ApplicationProgress = ({ steps, currentStep, validations }) => {
  const getStepStatus = (stepIndex) => {
    if (stepIndex === currentStep) return 'current';
    if (stepIndex < currentStep) {
      return validations[stepIndex] ? 'complete' : 'error';
    }
    return 'pending';
  };

  return (
    <div className="mb-8">
      <div className="flex justify-between">
        {steps.map((step, index) => (
          <div
            key={index}
            className={`flex flex-col items-center ${
              index < steps.length - 1 ? 'w-full' : ''
            }`}
          >
            <div className="relative">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  getStepStatus(index) === 'complete' 
                    ? 'bg-green-500' 
                    : getStepStatus(index) === 'current'
                    ? 'bg-blue-500'
                    : getStepStatus(index) === 'error'
                    ? 'bg-red-500'
                    : 'bg-gray-200'
                } text-white`}
              >
                {getStepStatus(index) === 'complete' ? (
                  <Check className="w-6 h-6" />
                ) : getStepStatus(index) === 'error' ? (
                  <AlertCircle className="w-6 h-6" />
                ) : (
                  index + 1
                )}
              </div>
            </div>
            <div className="mt-2 text-sm text-center">{step.title}</div>
          </div>
        ))}
      </div>
    </div>
  );
};