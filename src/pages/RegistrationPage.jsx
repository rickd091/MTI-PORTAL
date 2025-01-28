//src/pages/RegistrationPage.js
import React from 'react';
import InstitutionRegistrationForm from '../components/institution/registration/InstitutionRegistrationForm';

function RegistrationPage() {
  return (
    <div className="container mx-auto py-8">
      <InstitutionRegistrationForm />
    </div>
  );
}

export default RegistrationPage;