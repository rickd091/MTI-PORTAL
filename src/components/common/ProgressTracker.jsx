// src/components/common/ProgressTracker.js
import { CheckCircle, Clock, AlertCircle } from 'lucide-react';
import React, { useState, useEffect } from 'react';

const ProgressTracker = ({ steps, currentStep, onStepClick }) => {
  const getStepStatus = (stepIndex) => {
    if (stepIndex < currentStep) return 'completed';
    if (stepIndex === currentStep) return 'current';
    return 'pending';
  };

  return (
    <div className="relative">
      {/* Progress Line */}
      <div className="absolute left-0 top-10 w-full h-0.5 bg-gray-200">
        <div 
          className="h-full bg-blue-500 transition-all duration-500"
          style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
        />
      </div>

      {/* Steps */}
      <div className="relative flex justify-between">
        {steps.map((step, index) => (
          <div 
            key={index}
            className={`flex flex-col items-center ${
              onStepClick ? 'cursor-pointer' : ''
            }`}
            onClick={() => onStepClick && onStepClick(index)}
          >
            {/* Step Icon */}
            <div className={`
              w-8 h-8 rounded-full flex items-center justify-center
              ${getStepStatus(index) === 'completed' ? 'bg-green-500' :
                getStepStatus(index) === 'current' ? 'bg-blue-500' :
                'bg-gray-200'
              } transition-colors duration-200
            `}>
              {getStepStatus(index) === 'completed' ? (
                <CheckCircle className="w-5 h-5 text-white" />
              ) : getStepStatus(index) === 'current' ? (
                <Clock className="w-5 h-5 text-white" />
              ) : (
                <div className="w-2 h-2 rounded-full bg-gray-400" />
              )}
            </div>

            {/* Step Label */}
            <div className="mt-2 text-sm font-medium text-gray-600">
              {step.label}
            </div>

            {/* Step Status */}
            {step.status && (
              <div className={`
                mt-1 text-xs
                ${step.status === 'error' ? 'text-red-500' :
                  step.status === 'warning' ? 'text-yellow-500' :
                  'text-gray-400'
                }
              `}>
                {step.statusText}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgressTracker;