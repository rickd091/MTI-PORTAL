// src/services/eCitizenPaymentService.js
import { eCitizenServices } from '../config/eCitizenServices';

export class ECitizenPaymentService {
  // Initialize the service with API configurations
  constructor() {
    this.baseUrl = process.env.REACT_APP_ECITIZEN_API_URL;
    this.merchantId = process.env.REACT_APP_ECITIZEN_MERCHANT_ID;
    this.apiKey = process.env.REACT_APP_ECITIZEN_API_KEY;
  }

  // Get service details by code
  getServiceDetails(serviceCode) {
    const allServices = Object.values(eCitizenServices).flatMap(category => 
      Object.values(category)
    );
    return allServices.find(service => service.serviceCode === serviceCode);
  }

  // Initialize payment for a specific service
  async initiatePayment(serviceCode, applicationData) {
    const service = this.getServiceDetails(serviceCode);
    if (!service) {
      throw new Error('Invalid service code');
    }

    const paymentData = {
      merchantId: this.merchantId,
      serviceCode: serviceCode,
      amount: service.amount,
      currency: 'KES',
      description: service.description,
      reference: applicationData.applicationId,
      callbackUrl: `${window.location.origin}/payment/callback`,
      metadata: {
        applicationType: service.category,
        applicationId: applicationData.applicationId,
        institutionId: applicationData.institutionId
      }
    };

    try {
      const response = await fetch(`${this.baseUrl}/payments/initiate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify(paymentData)
      });

      if (!response.ok) {
        throw new Error('Failed to initiate e-Citizen payment');
      }

      const result = await response.json();
      return {
        transactionId: result.transactionId,
        paymentUrl: result.paymentUrl,
        serviceDetails: service
      };
    } catch (error) {
      console.error('e-Citizen payment initiation failed:', error);
      throw error;
    }
  }

  // Verify payment status
  async verifyPayment(transactionId) {
    try {
      const response = await fetch(`${this.baseUrl}/payments/verify/${transactionId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`
        }
      });

      if (!response.ok) {
        throw new Error('Payment verification failed');
      }

      const result = await response.json();
      return {
        status: result.status,
        receiptNumber: result.receiptNumber,
        paidAmount: result.amount,
        paidAt: result.paidAt,
        verificationDetails: {
          verifiedAt: new Date().toISOString(),
          verifiedBy: 'e-Citizen System',
          status: result.status
        }
      };
    } catch (error) {
      console.error('Payment verification failed:', error);
      throw error;
    }
  }

  // Generate payment receipt
  async generateReceipt(transactionId) {
    try {
      const response = await fetch(`${this.baseUrl}/payments/receipt/${transactionId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to generate receipt');
      }

      const result = await response.json();
      return {
        receiptUrl: result.receiptUrl,
        receiptNumber: result.receiptNumber,
        generatedAt: new Date().toISOString()
      };
    } catch (error) {
      console.error('Receipt generation failed:', error);
      throw error;
    }
  }

  // Get payment history for a specific application
  async getPaymentHistory(applicationId) {
    try {
      const response = await fetch(`${this.baseUrl}/payments/history/${applicationId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch payment history');
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to fetch payment history:', error);
      throw error;
    }
  }
}

export const eCitizenPaymentService = new ECitizenPaymentService();