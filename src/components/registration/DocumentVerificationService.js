//src/components/registration/DocumentVerificationService.js
import React, { useState } from 'react';
import { AlertCircle, CheckCircle, Clock, FileText } from 'lucide-react';
import { Alert } from '@/components/ui/alert';

const VerificationStatus = {
  PENDING: 'pending',
  VERIFYING: 'verifying',
  VERIFIED: 'verified',
  FAILED: 'failed'
};

const VerificationIndicator = ({ status, message }) => {
  const statusConfig = {
    [VerificationStatus.PENDING]: {
      icon: Clock,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200'
    },
    [VerificationStatus.VERIFYING]: {
      icon: Clock,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    [VerificationStatus.VERIFIED]: {
      icon: CheckCircle,
      color: 'text-green-500',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    },
    [VerificationStatus.FAILED]: {
      icon: AlertCircle,
      color: 'text-red-500',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200'
    }
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <div className={`flex items-center p-2 rounded-md ${config.bgColor} border ${config.borderColor}`}>
      <Icon className={`w-4 h-4 mr-2 ${config.color}`} />
      <span className={`text-sm ${config.color}`}>{message}</span>
    </div>
  );
};

const DocumentVerificationService = ({ document, onVerificationComplete }) => {
  const [verificationStatus, setVerificationStatus] = useState(VerificationStatus.PENDING);
  const [verificationDetails, setVerificationDetails] = useState(null);

  const verifyDocument = async (file) => {
    setVerificationStatus(VerificationStatus.VERIFYING);

    try {
      // Simulated verification checks
      const checks = await Promise.all([
        checkFileIntegrity(file),
        checkFileFormat(file),
        checkFileContent(file)
      ]);

      const failedChecks = checks.filter(check => !check.passed);

      if (failedChecks.length === 0) {
        setVerificationStatus(VerificationStatus.VERIFIED);
        setVerificationDetails({
          timestamp: new Date().toISOString(),
          message: 'Document verified successfully',
          checks: checks
        });
      } else {
        setVerificationStatus(VerificationStatus.FAILED);
        setVerificationDetails({
          timestamp: new Date().toISOString(),
          message: 'Document verification failed',
          checks: checks
        });
      }

      onVerificationComplete(verificationStatus === VerificationStatus.VERIFIED);
    } catch (error) {
      setVerificationStatus(VerificationStatus.FAILED);
      setVerificationDetails({
        timestamp: new Date().toISOString(),
        message: 'Verification process failed',
        error: error.message
      });
    }
  };

  const checkFileIntegrity = async (file) => {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({
          name: 'File Integrity',
          passed: true,
          message: 'File integrity check passed'
        });
      }, 1000);
    });
  };

  const checkFileFormat = async (file) => {
    return new Promise(resolve => {
      setTimeout(() => {
        const isValidFormat = /\.(pdf|doc|docx)$/i.test(file.name);
        resolve({
          name: 'File Format',
          passed: isValidFormat,
          message: isValidFormat ? 'Valid file format' : 'Invalid file format'
        });
      }, 800);
    });
  };

  const checkFileContent = async (file) => {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({
          name: 'Content Check',
          passed: true,
          message: 'Content validation passed'
        });
      }, 1200);
    });
  };

  return (
    <div className="space-y-4">
      <VerificationIndicator
        status={verificationStatus}
        message={verificationDetails?.message || 'Pending verification'}
      />

      {verificationDetails?.checks && (
        <div className="space-y-2">
          {verificationDetails.checks.map((check, index) => (
            <div
              key={index}
              className={`p-2 rounded-md ${
                check.passed ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
              } border`}
            >
              <div className="flex items-center">
                {check.passed ? (
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-red-500 mr-2" />
                )}
                <span className="text-sm font-medium">{check.name}</span>
              </div>
              <p className="text-sm ml-6">{check.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DocumentVerificationService;