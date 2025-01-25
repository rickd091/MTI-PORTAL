// src/pages/PaymentsPage.js
import React from 'react';
import ECitizenPaymentHandler from '../components/payments/ECitizenPaymentHandler';

const PaymentsPage = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Payments</h1>
      <ECitizenPaymentHandler />
    </div>
  );
};

export default PaymentsPage;