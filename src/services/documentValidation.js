//src/services/documentValidation.js
export const DocumentStatus = {
  PENDING: 'pending',
  VALIDATING: 'validating',
  VALID: 'valid',
  INVALID: 'invalid',
  EXPIRED: 'expired'
};

export const DocumentWorkflowState = {
  DRAFT: 'draft',
  SUBMITTED: 'submitted',
  UNDER_REVIEW: 'under_review',
  NEEDS_REVISION: 'needs_revision',
  APPROVED: 'approved',
  REJECTED: 'rejected'
};

export const validateDocument = async (file, requirements) => {
  const validationResults = {
    isValid: true,
    errors: [],
    warnings: [],
    metadata: {}
  };

  // File type validation
  if (!requirements.acceptedTypes.includes(file.type)) {
    validationResults.isValid = false;
    validationResults.errors.push(`Invalid file type. Accepted types: ${requirements.acceptedTypes.join(', ')}`);
  }

  // File size validation
  if (file.size > requirements.maxSize) {
    validationResults.isValid = false;
    validationResults.errors.push(`File size exceeds maximum limit of ${requirements.maxSize / (1024 * 1024)}MB`);
  }

  // File name validation
  const fileName = file.name.toLowerCase();
  if (fileName.length > 100) {
    validationResults.warnings.push('File name is too long. Consider using a shorter name.');
  }

  // Extract metadata
  validationResults.metadata = {
    fileSize: file.size,
    fileType: file.type,
    lastModified: file.lastModified,
    name: file.name
  };

  if (file.type.startsWith('image/')) {
    validationResults.metadata = {
      ...validationResults.metadata,
      ...(await extractImageMetadata(file))
    };
  }

  return validationResults;
};

const extractImageMetadata = (file) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      resolve({
        width: img.width,
        height: img.height,
        aspectRatio: img.width / img.height
      });
    };
    img.src = URL.createObjectURL(file);
  });
};