// src/pages/HomePage.js
import Dashboard from '../components/Dashboard';

const HomePage = () => {
  // In a real application, you'd fetch this data from your backend
  const analyticsData = {
    applications: {
      total: 1234,
      pending: 45,
      approved: 1189
    },
    // ... rest of your data
  };

  return (
    <div>
      <h1>Dashboard</h1>
      <Dashboard analyticsData={analyticsData} />
    </div>
  );
};