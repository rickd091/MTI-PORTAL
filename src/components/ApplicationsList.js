// src/components/ApplicationsList.js
import { Plus } from "lucide-react";
import React from "react";

const ApplicationsList = ({
  applications,
  userContext,
  handleStartNewApplication,
  handleViewApplicationDetails,
  handleApproveApplication,
  handleRejectApplication,
}) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Applications</h3>
        {(userContext.role === "institution" || userContext.role === "admin") && (
          <button
            className="flex items-center gap-2 bg-blue-600 text-white px-3 py-1 rounded-lg text-sm"
            onClick={handleStartNewApplication}
          >
            <Plus className="w-4 h-4" />
            New Application
          </button>
        )}
      </div>

      {/* Table */}
      <div className="border rounded-lg">
        <div className="grid grid-cols-6 gap-4 p-4 border-b bg-gray-50 text-sm font-medium">
          <div>ID</div>
          <div>Institution</div>
          <div>Status</div>
          <div>Contact Person</div>
          <div>Payment</div>
          <div>Actions</div>
        </div>
        <div className="divide-y">
          {applications.map((app) => (
            <div key={app.id} className="grid grid-cols-6 gap-4 p-4 text-sm">
              <div>{app.id}</div>
              <div>{app.institutionName}</div>
              <div>{app.status}</div>
              <div>{app.contactPerson}</div>
              <div>{app.paymentInfo?.amount || 0} KES</div>
              <div className="flex items-center gap-2">
                <button
                  className="text-blue-600"
                  onClick={() => handleViewApplicationDetails(app.id)}
                >
                  View
                </button>
                {(userContext.role === "admin" || userContext.role === "reviewer") && (
                  <button
                    className="text-green-600"
                    onClick={() => handleApproveApplication(app.id)}
                  >
                    Approve
                  </button>
                )}
                {(userContext.role === "admin" || userContext.role === "reviewer") && (
                  <button
                    className="text-red-600"
                    onClick={() => handleRejectApplication(app.id)}
                  >
                    Reject
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ApplicationsList;
