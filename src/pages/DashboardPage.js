// src/pages/DashboardPage.js
import React from 'react';

import { StatisticCard } from '../components/ui/StatisticCard';

const DashboardPage = () => {
  const analyticsData = {
    applications: {
      total: 1234,
      pending: 45,
      approved: 1189
    },
    inspections: {
      completed: 892,
      scheduled: 56,
      pending: 23
    },
    documents: {
      total: 3456,
      verified: 3100,
      pending: 356
    },
    payments: {
      total: 4500000,
      successRate: 98.5
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome to MTI Portal</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatisticCard
          title="Total Applications"
          value={analyticsData.applications.total}
          subtitle={`${analyticsData.applications.pending} pending`}
          icon="document"
        />
        <StatisticCard
          title="Inspections Completed"
          value={analyticsData.inspections.completed}
          subtitle={`${analyticsData.inspections.scheduled} scheduled`}
          icon="calendar"
        />
        <StatisticCard
          title="Documents Processed"
          value={analyticsData.documents.total}
          subtitle={`${analyticsData.documents.verified} verified`}
          icon="document"
        />
        <StatisticCard
          title="Total Payments"
          value={`KES ${(analyticsData.payments.total / 1000).toFixed(1)}k`}
          subtitle={`${analyticsData.payments.successRate}% success rate`}
          icon="license"
        />
      </div>
    </div>
  );
};

export default DashboardPage;