// components/dashboard/RecentApplications.js
export const RecentApplications = () => {
  const applications = [
    {
      id: 'APP-001',
      institution: 'Maritime Academy Kenya',
      status: 'Under Review',
      date: '2024-01-10'
    },
    // Add more sample data
  ];

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              ID
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Institution
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Date
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {applications.map((app) => (
            <tr key={app.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm">{app.id}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">{app.institution}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">
                  {app.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">{app.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};