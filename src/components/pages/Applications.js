// components/pages/Applications.js
export const Applications = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Applications</h1>
          <p className="text-gray-600">Manage accreditation applications</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
          New Application
        </button>
      </div>

      <div className="bg-white shadow rounded-lg">
        {/* Application filters */}
        <div className="p-4 border-b">
          <div className="flex space-x-4">
            <input
              type="text"
              placeholder="Search applications..."
              className="flex-1 px-4 py-2 border rounded-md"
            />
            <select className="px-4 py-2 border rounded-md">
              <option>All Status</option>
              <option>Pending</option>
              <option>Under Review</option>
              <option>Approved</option>
              <option>Rejected</option>
            </select>
            <button className="px-4 py-2 border rounded-md hover:bg-gray-50">
              Filter
            </button>
          </div>
        </div>

        {/* Applications table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            {/* Table headers and content */}
          </table>
        </div>
      </div>
    </div>
  );
};
