// src/components/payments/ECitizenPaymentHandler.js
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Building2,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  Download,
  Clock
} from 'lucide-react';
import { 
  initiateECitizenPayment,
  verifyECitizenPayment,
  generateECitizenReceipt,
  clearECitizenTransaction
} from '../../store/slices/paymentSlice';
import { 
  Alert,
  AlertDescription,
  AlertTitle 
} from '@/components/ui/alert';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const ECitizenPaymentHandler = ({
  serviceCode,
  applicationData,
  onPaymentComplete,
  onCancel
}) => {
  const dispatch = useDispatch();
  const {
    currentTransaction,
    eCitizenStatus,
    serviceCodes,
    status,
    error
  } = useSelector(state => state.payments);

  const [isVerifying, setIsVerifying] = useState(false);
  const [pollInterval, setPollInterval] = useState(null);

  // Get service details
  const service = Object.values(serviceCodes)
    .flatMap(category => Object.values(category))
    .find(s => s.serviceCode === serviceCode);

  useEffect(() => {
    // Clean up on unmount
    return () => {
      if (pollInterval) clearInterval(pollInterval);
      dispatch(clearECitizenTransaction());
    };
  }, [dispatch, pollInterval]);

  const handleInitiatePayment = async () => {
    try {
      const result = await dispatch(initiateECitizenPayment({
        serviceCode,
        applicationData
      })).unwrap();

      // Start polling for payment status
      const interval = setInterval(() => {
        if (result.transactionId) {
          verifyPaymentStatus(result.transactionId);
        }
      }, 10000); // Poll every 10 seconds
      setPollInterval(interval);

      // Redirect to e-Citizen portal
      window.open(result.paymentUrl, '_blank');
    } catch (error) {
      console.error('Failed to initiate payment:', error);
    }
  };

  const verifyPaymentStatus = async (transactionId) => {
    if (isVerifying) return;

    setIsVerifying(true);
    try {
      const result = await dispatch(verifyECitizenPayment(transactionId)).unwrap();
      
      if (result.status === 'completed') {
        // Stop polling
        if (pollInterval) clearInterval(pollInterval);
        
        // Generate receipt
        await dispatch(generateECitizenReceipt(transactionId));
        
        // Notify completion
        onPaymentComplete(result);
      }
    } catch (error) {
      console.error('Payment verification failed:', error);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleManualVerification = () => {
    if (currentTransaction?.transactionId) {
      verifyPaymentStatus(currentTransaction.transactionId);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="w-5 h-5" />
          e-Citizen Payment
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Service Details */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-medium mb-2">{service?.serviceName}</h3>
          <p className="text-sm text-gray-600 mb-2">{service?.description}</p>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Amount:</span>
            <span className="font-medium">KES {service?.amount.toLocaleString()}</span>
          </div>
        </div>

        {/* Payment Status */}
        {status === 'loading' && (
          <Alert>
            <Clock className="w-4 h-4" />
            <AlertTitle>Processing</AlertTitle>
            <AlertDescription>
              Please wait while we process your request...
            </AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="w-4 h-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {eCitizenStatus.verified && (
          <Alert variant="success">
            <CheckCircle className="w-4 h-4" />
            <AlertTitle>Payment Successful</AlertTitle>
            <AlertDescription>
              Your payment has been successfully processed.
              {eCitizenStatus.receiptUrl && (
                <Button
                  variant="link"
                  className="mt-2"
                  onClick={() => window.open(eCitizenStatus.receiptUrl, '_blank')}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Receipt
                </Button>
              )}
            </AlertDescription>
          </Alert>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end gap-4">
          {!eCitizenStatus.verified && (
            <>
              {!eCitizenStatus.initiated ? (
                <Button
                  onClick={handleInitiatePayment}
                  disabled={status === 'loading'}
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Pay via e-Citizen
                </Button>
              ) : (
                <Button
                  onClick={handleManualVerification}
                  disabled={isVerifying}
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Verify Payment
                </Button>
              )}
            </>
          )}
          
          <Button
            variant="outline"
            onClick={onCancel}
            disabled={status === 'loading'}
          >
            Cancel
          </Button>
        </div>

        {/* Payment Instructions */}
        {eCitizenStatus.initiated && !eCitizenStatus.verified && (
          <div className="mt-4 text-sm text-gray-600">
            <h4 className="font-medium mb-2">Payment Instructions:</h4>
            <ol className="list-decimal list-inside space-y-2">
              <li>Complete the payment process on the e-Citizen portal.</li>
              <li>After payment, return to this page.</li>
              <li>Click "Verify Payment" to confirm your payment.</li>
            </ol>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ECitizenPaymentHandler;