// src/components/InspectionsList.js
import React from "react";

const InspectionsList = ({
  applications,
  markInspectionComplete,
  scheduleInspection,
}) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">Inspections</h3>
      <div className="border rounded-lg">
        <div className="grid grid-cols-5 gap-4 p-4 border-b bg-gray-50 text-sm font-medium">
          <div>App ID</div>
          <div>Institution</div>
          <div>Status</div>
          <div>Inspection Date</div>
          <div>Actions</div>
        </div>
        <div className="divide-y">
          {applications
            .filter((app) => app.status === "Approved" || app.status === "Inspected")
            .map((app) => (
              <div key={app.id} className="grid grid-cols-5 gap-4 p-4 text-sm">
                <div>{app.id}</div>
                <div>{app.institutionName}</div>
                <div>{app.status}</div>
                <div>{app.inspectionDate || "Not Scheduled"}</div>
                <div>
                  {app.inspectionDate ? (
                    <button
                      className="text-orange-600"
                      onClick={() => markInspectionComplete(app.id)}
                    >
                      Mark Complete
                    </button>
                  ) : (
                    <button
                      className="text-blue-600"
                      onClick={() => scheduleInspection(app.id)}
                    >
                      Schedule
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

export default InspectionsList;
