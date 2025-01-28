// src/components/applications/ApplicationRenewal.js
import React from 'react';
import { useParams } from 'react-router-dom';

const ApplicationRenewal = () => {
  const { id } = useParams();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Application Renewal</h1>
      <p>Renewal for application: {id}</p>
    </div>
  );
};

export default ApplicationRenewal;