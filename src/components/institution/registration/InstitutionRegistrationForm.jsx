//src/components/institution/registration/InstitutionRegistrationForm.js

import React, { useState, useCallback, Suspense } from 'react';
import { Card, CardContent } from '../../../components/ui/card';
import { ApplicationProgress } from '../../../components/applications/ApplicationProgress';
import DocumentIntegration from './DocumentIntegration';

const BasicInformationStep = React.lazy(() => import('./steps/BasicInformationStep'));
const PremisesStep = React.lazy(() => import('./steps/PremisesStep'));
const ManagementStep = React.lazy(() => import('./steps/ManagementStep'));
const InfrastructureStep = React.lazy(() => import('./steps/InfrastructureStep'));

const InstitutionRegistrationForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    basicInfo: {},
    premises: {},
    management: {},
    infrastructure: {},
    documents: {}
  });

  // Document handling functions
  const handleDocumentUpload = useCallback((docKey, file) => {
    setFormData(prev => ({
      ...prev,
      documents: {
        ...prev.documents,
        [docKey]: {
          file,
          uploadDate: new Date().toISOString(),
          status: 'pending_validation'
        }
      }
    }));
  }, []);

  const checkDocumentStatus = useCallback((docKey) => {
    const doc = formData.documents[docKey];
    if (!doc) return 'missing';
    if (isDocumentExpired(doc)) return 'expired';
    return doc.status;
  }, [formData.documents]);

  const isDocumentExpired = (document) => {
    if (!document.expiryDate) return false;
    const expiryDate = new Date(document.expiryDate);
    return expiryDate < new Date();
  };

  const steps = [
    { title: 'Basic Information', key: 'basicInfo' },
    { title: 'Premises & Land', key: 'premises' },
    { title: 'Management', key: 'management' },
    { title: 'Infrastructure', key: 'infrastructure' },
    { title: 'Documents', key: 'documents' }
  ];

  const [validations] = useState(Array(steps.length).fill(false));

  const handleNext = () => {
    setCurrentStep(prev => Math.min(prev + 1, steps.length));
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const renderStepContent = () => {
    const Fallback = () => <div className="p-4 text-center">Loading...</div>;

    switch(currentStep) {
      case 1:
        return (
          <Suspense fallback={<Fallback />}>
            <BasicInformationStep formData={formData} setFormData={setFormData} />
          </Suspense>
        );
      case 2:
        return (
          <Suspense fallback={<Fallback />}>
            <PremisesStep formData={formData} setFormData={setFormData} />
          </Suspense>
        );
      case 3:
        return (
          <Suspense fallback={<Fallback />}>
            <ManagementStep formData={formData} setFormData={setFormData} />
          </Suspense>
        );
      case 4:
        return (
          <Suspense fallback={<Fallback />}>
            <InfrastructureStep formData={formData} setFormData={setFormData} />
          </Suspense>
        );
		case 5:
		  return (
			<Suspense fallback={<Fallback />}>
			  <DocumentIntegration 
				formData={formData}
				setFormData={setFormData}
				onDocumentUpload={handleDocumentUpload}
				checkDocumentStatus={checkDocumentStatus}
			  />
			</Suspense>
		  );
      default:
        return null;
    }
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardContent className="p-6">
        <h2 className="text-2xl font-bold mb-6">Institution Registration</h2>
        
        <ApplicationProgress 
          steps={steps}
          currentStep={currentStep - 1}
          validations={validations}
        />

        <div className="mb-6">
          {renderStepContent()}
        </div>

        <div className="flex justify-between pt-6 border-t">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className="px-4 py-2 text-gray-600 border rounded-md disabled:opacity-50"
          >
            Previous
          </button>
          <button
            onClick={handleNext}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            {currentStep === steps.length ? 'Submit' : 'Next'}
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

export default InstitutionRegistrationForm;