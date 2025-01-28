components/pages/Inspections.js
export const Inspections = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Inspections</h1>
          <p className="text-gray-600">Schedule and manage facility inspections</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
          Schedule Inspection
        </button>
      </div>

      {/* Calendar view */}
      <div className="bg-white shadow rounded-lg p-6">
        {/* Add calendar component */}
      