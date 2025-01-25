// src/components/SystemSettings.js
import React from "react";

const SystemSettings = () => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">System Settings</h3>
      <p className="text-sm text-gray-600">
        Manage global configurations, user roles, permissions, etc.
      </p>
      <div className="mt-4 space-y-4">
        <button className="px-4 py-2 border rounded-lg text-sm">
          User Management
        </button>
        <button className="px-4 py-2 border rounded-lg text-sm">
          Permissions
        </button>
        <button className="px-4 py-2 border rounded-lg text-sm">
          System Logs
        </button>
      </div>
    </div>
  );
};

export default SystemSettings;
