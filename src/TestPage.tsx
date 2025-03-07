import React from 'react';

const TestPage: React.FC = () => {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">MTI Portal Test Page</h1>
      <p className="mb-4">This is a simple test page to verify that the application is rendering correctly.</p>
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Test Button
      </button>
    </div>
  );
};

export default TestPage;
