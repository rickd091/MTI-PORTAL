import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card, CardContent } from "@/components/ui/card";
import { Alert } from "@/components/ui/alert";
import { fetchComplianceStats } from "@/store/slices/complianceSlice";

export default function ComplianceDashboard() {
  const dispatch = useDispatch();
  const { stats, loading, error } = useSelector(
    (state: any) => state.compliance,
  );

  useEffect(() => {
    dispatch(fetchComplianceStats());
  }, [dispatch]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <Alert variant="destructive">{error}</Alert>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Compliance Dashboard</h2>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
          Generate Report
        </button>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <h3 className="text-sm text-gray-500">Overall Compliance</h3>
            <p className="text-2xl font-bold mt-1">
              {stats.overallCompliance}%
            </p>
            <div className="mt-2 h-2 bg-gray-200 rounded-full">
              <div
                className="h-full bg-green-500 rounded-full"
                style={{ width: `${stats.overallCompliance}%` }}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h3 className="text-sm text-gray-500">Active Alerts</h3>
            <p className="text-2xl font-bold mt-1">{stats.activeAlerts}</p>
            <p className="text-sm text-red-500 mt-1">
              {stats.criticalAlerts} critical
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h3 className="text-sm text-gray-500">Pending Reviews</h3>
            <p className="text-2xl font-bold mt-1">{stats.pendingReviews}</p>
            <p className="text-sm text-yellow-500 mt-1">
              {stats.overdueReviews} overdue
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h3 className="text-sm text-gray-500">Document Status</h3>
            <p className="text-2xl font-bold mt-1">
              {stats.documentCompliance}%
            </p>
            <p className="text-sm text-blue-500 mt-1">
              {stats.pendingDocuments} pending
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-medium mb-4">Recent Compliance Issues</h3>
          <div className="space-y-4">
            {stats.recentIssues?.map((issue: any, index: number) => (
              <div
                key={index}
                className="flex justify-between items-center p-4 bg-gray-50 rounded-lg"
              >
                <div>
                  <p className="font-medium">{issue.title}</p>
                  <p className="text-sm text-gray-500">{issue.institution}</p>
                </div>
                <div className="flex items-center space-x-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      issue.severity === "high"
                        ? "bg-red-100 text-red-800"
                        : issue.severity === "medium"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {issue.severity}
                  </span>
                  <button className="text-blue-600 hover:text-blue-800">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
