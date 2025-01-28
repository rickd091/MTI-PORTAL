// src/components/analytics/ApplicationAnalytics.js
import React from 'react';
import {
  LineChart, BarChart, PieChart,
  Line, Bar, Pie,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer
} from 'recharts';

const ApplicationAnalytics = () => {
  const [analytics, setAnalytics] = useState({
    applications: [],
    approvalRate: 0,
    averageProcessingTime: 0,
    statusDistribution: []
  });

  useEffect(() => {
    fetchAnalytics();
  }, []);

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-3 gap-4">
        <StatCard
          title="Approval Rate"
          value={`${analytics.approvalRate}%`}
          trend={+5}
        />
        <StatCard
          title="Processing Time"
          value={`${analytics.averageProcessingTime} days`}
          trend={-2}
        />
        <StatCard
          title="Active Applications"
          value={analytics.applications.length}
          trend={+12}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-4">Application Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={analytics.applications}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="count" stroke="#3B82F6" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-4">Status Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={analytics.statusDistribution}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                fill="#3B82F6"
              />
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

// src/components/notifications/NotificationCenter.js
const NotificationCenter = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetchNotifications();
    const socket = connectToWebSocket();
    
    socket.on('notification', handleNewNotification);
    
    return () => socket.disconnect();
  }, []);

  return (
    <div className="fixed right-4 bottom-4 w-96">
      {notifications.map(notification => (
        <NotificationCard
          key={notification.id}
          notification={notification}
          onDismiss={() => dismissNotification(notification.id)}
        />
      ))}
    </div>
  );
};