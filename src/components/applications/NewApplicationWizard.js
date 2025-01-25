// src/components/applications/NewApplicationWizard.js
import React from "react";

const NewApplicationWizard = ({ currentStep, formData, setFormData, handleNext, handlePrevious, handleSubmit }) => {
  const renderBasicInformationSection = () => (
    <div className="space-y-4">
      <h4 className="text-lg font-medium">Basic Institution Information</h4>
      <div>
        <label className="block text-sm font-medium text-gray-700">Institution Name</label>
        <input
          type="text"
          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
          value={formData.institutionName || ''}
          onChange={(e) => setFormData({ ...formData, institutionName: e.target.value })}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Contact Person</label>
        <input
          type="text"
          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
          value={formData.contactPerson || ''}
          onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Contact Email</label>
        <input
          type="email"
          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
          value={formData.contactEmail || ''}
          onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
        />
      </div>
    </div>
  );

  const renderDocumentUploadSection = () => (
    <div className="space-y-4">
      <h4 className="text-lg font-medium">Upload Required Documents</h4>
      <p className="text-sm text-gray-600">
        Please upload the required accreditation documents (e.g., course outlines, 
        staff certifications, facility compliance certificates, etc.)
      </p>
      <div>
        <label className="block text-sm font-medium text-gray-700">Upload Files</label>
        <input
          type="file"
          multiple
          className="mt-1 block w-full"
          onChange={(e) => setFormData({ ...formData, documents: e.target.files })}
        />
      </div>
    </div>
  );

  const renderPaymentSection = () => (
    <div className="space-y-4">
      <h4 className="text-lg font-medium">Payment Information</h4>
      <div>
        <label className="block text-sm font-medium text-gray-700">Amount (KES)</label>
        <input
          type="number"
          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
          value={formData.payment?.amount || ''}
          onChange={(e) => setFormData({ 
            ...formData, 
            payment: { ...formData.payment, amount: e.target.value }
          })}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Transaction ID</label>
        <input
          type="text"
          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
          value={formData.payment?.transactionId || ''}
          onChange={(e) => setFormData({ 
            ...formData, 
            payment: { ...formData.payment, transactionId: e.target.value }
          })}
        />
      </div>
    </div>
  );

  const renderReviewSection = () => (
    <div className="space-y-4">
      <h4 className="text-lg font-medium">Review Your Application</h4>
      <div className="bg-gray-50 p-4 rounded-lg">
        <h5 className="font-medium mb-2">Institution Details</h5>
        <p className="text-sm">Institution Name: {formData.institutionName}</p>
        <p className="text-sm">Contact Person: {formData.contactPerson}</p>
        <p className="text-sm">Contact Email: {formData.contactEmail}</p>
      </div>
      <div className="bg-gray-50 p-4 rounded-lg">
        <h5 className="font-medium mb-2">Documents</h5>
        <p className="text-sm">
          {formData.documents ? `${formData.documents.length} files uploaded` : 'No documents uploaded'}
        </p>
      </div>
      <div className="bg-gray-50 p-4 rounded-lg">
        <h5 className="font-medium mb-2">Payment Details</h5>
        <p className="text-sm">Amount: KES {formData.payment?.amount || 0}</p>
        <p className="text-sm">Transaction ID: {formData.payment?.transactionId || 'Not provided'}</p>
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-xl font-semibold mb-4">New Application (Step {currentStep}/4)</h3>

      {/* Step Content */}
      <div className="mb-6">
        {currentStep === 1 && renderBasicInformationSection()}
        {currentStep === 2 && renderDocumentUploadSection()}
        {currentStep === 3 && renderPaymentSection()}
        {currentStep === 4 && renderReviewSection()}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-4 border-t">
        <button
          type="button"
          className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
          onClick={() => currentStep > 1 && handlePrevious()}
          disabled={currentStep === 1}
        >
          Previous
        </button>
        <div>
          {currentStep < 4 ? (
            <button
              type="button"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
              onClick={handleNext}
            >
              Next
            </button>
          ) : (
            <button
              type="button"
              className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
              onClick={handleSubmit}
            >
              Submit Application
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewApplicationWizard;