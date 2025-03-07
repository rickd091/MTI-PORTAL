import * as yup from 'yup';

// User validation schemas
export const passwordSchema = yup.string()
  .min(12, 'Password must be at least 12 characters')
  .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
  .matches(/[0-9]/, 'Password must contain at least one number')
  .matches(/[^A-Za-z0-9]/, 'Password must contain at least one special character')
  .required('Password is required');

export const userLoginSchema = yup.object().shape({
  email: yup.string().email('Invalid email address').required('Email is required'),
  password: passwordSchema,
});

export const userRegistrationSchema = yup.object().shape({
  email: yup.string().email('Invalid email address').required('Email is required'),
  password: passwordSchema,
  confirmPassword: yup.string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Confirm password is required'),
  role: yup.string().required('Role is required'),
  termsAccepted: yup.boolean().oneOf([true], 'You must accept the terms and conditions'),
  privacyPolicyAccepted: yup.boolean().oneOf([true], 'You must accept the privacy policy'),
});

// Institution validation schemas
export const institutionSchema = yup.object().shape({
  name: yup.string().required('Institution name is required').max(100),
  registrationNumber: yup.string().required('Registration number is required'),
  address: yup.string().required('Address is required'),
  phoneNumber: yup.string().required('Phone number is required')
    .matches(/^\+?[0-9]{10,15}$/, 'Invalid phone number format'),
  email: yup.string().email('Invalid email address').required('Email is required'),
  website: yup.string().url('Invalid URL format'),
  contactPerson: yup.string().required('Contact person is required'),
  contactEmail: yup.string().email('Invalid email address').required('Contact email is required'),
});

// Document validation schemas
export const documentSchema = yup.object().shape({
  title: yup.string().required('Document title is required'),
  type: yup.string().required('Document type is required'),
  expiryDate: yup.date().nullable().min(new Date(), 'Expiry date cannot be in the past'),
  file: yup.mixed().required('Document file is required'),
  fileSize: yup.number().max(10 * 1024 * 1024, 'File size must be less than 10MB'),
});

// Course validation schemas
export const courseSchema = yup.object().shape({
  title: yup.string().required('Course title is required'),
  code: yup.string().required('Course code is required'),
  description: yup.string().required('Course description is required'),
  duration: yup.number().positive('Duration must be positive').required('Duration is required'),
  durationUnit: yup.string().required('Duration unit is required'),
  capacity: yup.number().positive('Capacity must be positive').required('Capacity is required'),
});

// Inspection validation schemas
export const inspectionSchema = yup.object().shape({
  institutionId: yup.string().required('Institution is required'),
  inspectionDate: yup.date().required('Inspection date is required'),
  inspectionType: yup.string().required('Inspection type is required'),
  inspectorId: yup.string().required('Inspector is required'),
  comments: yup.string(),
  status: yup.string().required('Status is required'),
});

// Validate sanitized input data against schemas
export const validateData = async (data: any, schema: any) => {
  try {
    // Sanitize data before validation
    const sanitizedData = Object.keys(data).reduce((acc, key) => {
      if (typeof data[key] === 'string') {
        // Basic sanitization for strings
        acc[key] = data[key].trim();
      } else {
        acc[key] = data[key];
      }
      return acc;
    }, {});

    // Validate the sanitized data
    await schema.validate(sanitizedData, { abortEarly: false });
    return { isValid: true, data: sanitizedData, errors: null };
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      // Format validation errors
      const errors = error.inner.reduce((acc, err) => {
        if (err.path) {
          acc[err.path] = err.message;
        }
        return acc;
      }, {});
      return { isValid: false, data: null, errors };
    }
    return { isValid: false, data: null, errors: { general: 'Validation failed' } };
  }
};
