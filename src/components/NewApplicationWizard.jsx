// src/components/NewApplicationWizard.js
import React from "react";
import { Plus } from "lucide-react";

const NewApplicationWizard = ({
  applicationStep,
  applicationData,
  setApplicationData,
  handleNextStep,
  handlePrevStep,
  handleCancelApplication,
  handleSubmitApplication,
}) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-xl font-semibold mb-4">
        New Application (Step {applicationStep}/4)
      </h3>

      {applicationStep === 1 && (
        <div className="space-y-4">
          <h4 className="text-lg font-medium">Basic Institution Information</h4>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Institution Name
            </label>
            <input
              type="text"
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              value={applicationData.institutionName}
              onChange={(e) =>
                setApplicationData({
                  ...applicationData,
                  institutionName: e.target.value,
                })
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Contact Person
            </label>
            <input
              type="text"
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              value={applicationData.contactPerson}
              onChange={(e) =>
                setApplicationData({
                  ...applicationData,
                  contactPerson: e.target.value,
                })
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Contact Email
            </label>
            <input
              type="email"
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              value={applicationData.contactEmail}
              onChange={(e) =>
                setApplicationData({
                  ...applicationData,
                  contactEmail: e.target.value,
                })
              }
            />
          </div>
        </div>
      )}

      {applicationStep === 2 && (
        <div className="space-y-4">
          <h4 className="text-lg font-medium">Upload Required Documents</h4>
          <p className="text-sm text-gray-600">
            Please upload the required accreditation documents (e.g., course
            outlines, staff certifications, facility compliance certificates, etc.)
          </p>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Upload Files
            </label>
            <input
              type="file"
              multiple
              className="mt-1 block w-full"
              onChange={(e) =>
                setApplicationData({
                  ...applicationData,
                  documentFiles: e.target.files,
                })
              }
            />
          </div>
        </div>
      )}

      {applicationStep === 3 && (
        <div className="space-y-4">
          <h4 className="text-lg font-medium">Payment Details</h4>
          <p className="text-sm text-gray-600">
            Provide the payment information for the accreditation process fee.
          </p>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Amount (KES)
            </label>
            <input
              type="number"
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              value={applicationData.paymentInfo.amount}
              onChange={(e) =>
                setApplicationData({
                  ...applicationData,
                  paymentInfo: {
                    ...applicationData.paymentInfo,
                    amount: e.target.value,
                  },
                })
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Transaction ID
            </label>
            <input
              type="text"
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              value={applicationData.paymentInfo.transactionId}
              onChange={(e) =>
                setApplicationData({
                  ...applicationData,
                  paymentInfo: {
                    ...applicationData.paymentInfo,
                    transactionId: e.target.value,
                  },
                })
              }
            />
          </div>
        </div>
      )}

      {applicationStep === 4 && (
        <div className="space-y-4">
          <h4 className="text-lg font-medium">Review &amp; Submit</h4>
          <p className="text-sm text-gray-600">
            Please review the information below and click{" "}
            <strong>Submit</strong> if everything looks good.
          </p>
          <div className="bg-gray-50 p-4 rounded-md">
            <h5 className="font-medium">Institution Details</h5>
            <p className="text-sm">Name: {applicationData.institutionName}</p>
            <p className="text-sm">Contact: {applicationData.contactPerson}</p>
            <p className="text-sm">Email: {applicationData.contactEmail}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-md">
            <h5 className="font-medium">Documents Uploaded</h5>
            <p className="text-sm">
              {applicationData.documentFiles && applicationData.documentFiles.length
                ? `${applicationData.documentFiles.length} file(s) uploaded`
                : "No files uploaded"}
            </p>
          </div>
          <div className="bg-gray-50 p-4 rounded-md">
            <h5 className="font-medium">Payment Information</h5>
            <p className="text-sm">
              Amount: KES {applicationData.paymentInfo.amount}
            </p>
            <p className="text-sm">
              Transaction ID: {applicationData.paymentInfo.transactionId}
            </p>
          </div>
        </div>
      )}

      <div className="mt-6 flex justify-between">
        <button
          className="px-4 py-2 text-gray-600 hover:text-gray-800"
          onClick={handleCancelApplication}
        >
          Cancel
        </button>
        <div className="space-x-4">
          {applicationStep > 1 && (
            <button
              className="px-4 py-2 border rounded hover:bg-gray-50"
              onClick={handlePrevStep}
            >
              Previous
            </button>
          )}
          {applicationStep < 4 && (
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              onClick={handleNextStep}
            >
              Next
            </button>
          )}
          {applicationStep === 4 && (
            <button
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              onClick={handleSubmitApplication}
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