// src/components/ReviewsList.js
import React from "react";

const ReviewsList = ({
  applications,
  userContext,
  handleViewApplicationDetails,
  handleApproveApplication,
  handleRejectApplication,
}) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">Reviews</h3>
      <p className="text-sm text-gray-600 mb-4">
        Below are applications assigned to you for review.
      </p>
      <div className="border rounded-lg">
        <div className="grid grid-cols-5 gap-4 p-4 border-b bg-gray-50 text-sm font-medium">
          <div>App ID</div>
          <div>Institution</div>
          <div>Status</div>
          <div>Documents</div>
          <div>Actions</div>
        </div>
        <div className="divide-y">
          {applications
            .filter((app) => app.assignedReviewer === userContext.userId)
            .map((app) => (
              <div key={app.id} className="grid grid-cols-5 gap-4 p-4 text-sm">
                <div>{app.id}</div>
                <div>{app.institutionName}</div>
                <div>{app.status}</div>
                <div>{app.documents.map((d) => d.name).join(", ")}</div>
                <div className="flex items-center gap-2">
                  <button
                    className="text-blue-600"
                    onClick={() => handleViewApplicationDetails(app.id)}
                  >
                    View
                  </button>
                  <button
                    className="text-green-600"
                    onClick={() => handleApproveApplication(app.id)}
                  >
                    Approve
                  </button>
                  <button
                    className="text-red-600"
                    onClick={() => handleRejectApplication(app.id)}
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default ReviewsList;
