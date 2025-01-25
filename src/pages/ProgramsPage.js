//src/pages/ProgramsPage.js

import React from 'react';
import { useSelector } from 'react-redux';

const ProgramsPage = () => {
  const programs = useSelector((state) => state.programs?.items || []);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Training Programs</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {programs.map((program) => (
          <div key={program.id} className="bg-white shadow-lg rounded-lg">
            <div className="p-4">
              <h2 className="text-xl font-semibold">{program.title}</h2>
            </div>
            <div className="p-4">
              <div className="space-y-4">
                <p className="text-gray-600">{program.description}</p>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Duration: {program.duration}</span>
                  <span className="text-primary font-bold">
                    ${program.price?.toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">
                    Capacity: {program.capacity} students
                  </span>
                  <span className="text-sm text-gray-500">
                    {program.enrolledCount} enrolled
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgramsPage;