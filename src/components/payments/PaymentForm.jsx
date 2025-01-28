// src/components/payments/PaymentForm.js
import { CreditCard, AlertCircle } from 'lucide-react';
import React, { useState } from 'react';

const PaymentForm = ({ amount, onSuccess, onError }) => {
  const [paymentMethod, setPaymentMethod] = useState('mpesa');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const paymentMethods = [
    { id: 'mpesa', label: 'M-PESA', icon: '📱' },
    { id: 'card', label: 'Credit/Debit Card', icon: '💳' },
    { id: 'bank', label: 'Bank Transfer', icon: '🏦' }
  ];

  const handlePayment = async () => {
    setLoading(true);
    setError(null);

    try {
      // Integrate with your payment gateway here
      const response = await processPayment({
        amount,
        method: paymentMethod,
        currency: 'KES',
        reference: `MTI_${Date.now()}`
      });

      if (response.success) {
        onSuccess(response.transactionId);
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      setError(error.message);
      onError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-6">Payment Details</h3>
      
      <div className="mb-6">
        <p className="text-xl font-bold">KES {amount.toLocaleString()}</p>
        <p className="text-sm text-gray-600">Application Fee</p>
      </div>

      <div className="space-y-4">
        {paymentMethods.map(method => (
          <label
            key={method.id}
            className={`flex items-center p-4 border rounded-lg cursor-pointer ${
              paymentMethod === method.id ? 'border-blue-500 bg-blue-50' : ''
            }`}
          >
            <input
              type="radio"
              name="paymentMethod"
              value={method.id}
              checked={paymentMethod === method.id}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="mr-3"
            />
            <span className="mr-2">{method.icon}</span>
            <span>{method.label}</span>
          </label>
        ))}
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-lg flex items-center">
          <AlertCircle className="w-5 h-5 mr-2" />
          {error}
        </div>
      )}

      <button
        onClick={handlePayment}
        disabled={loading}
        className={`w-full mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg
          ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'}
        `}
      >
        {loading ? 'Processing...' : 'Pay Now'}
      </button>
    </div>
  );
};

export default PaymentForm;