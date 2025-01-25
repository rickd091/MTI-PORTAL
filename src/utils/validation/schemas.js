// src/utils/validation/schemas.js
import { parsePhoneNumberFromString } from 'libphonenumber-js';
import * as yup from 'yup';

// Custom validators
const phoneValidator = (value) => {
  if (!value) return false;
  const phoneNumber = parsePhoneNumberFromString(value, 'KE');
  return phoneNumber?.isValid() || 'Invalid phone number';
};

const registrationNumberValidator = (value) => {
  // MTI specific format: MTI-YYYY-XXXX
  const regex = /^MTI-\d{4}-\d{4}$/;
  return regex.test(value) || 'Invalid registration number format';
};

export const institutionValidation = yup.object().shape({
  basic: yup.object().shape({
    name: yup.string()
      .required('Institution name is required')
      .min(3, 'Name must be at least 3 characters')
      .max(100, 'Name must not exceed 100 characters'),
    type: yup.string()
      .required('Institution type is required')
      .oneOf(['PUBLIC', 'PRIVATE', 'PARTNERSHIP'], 'Invalid institution type'),
    registrationNumber: yup.string()
      .required('Registration number is required')
      .test('registration-format', 'Invalid registration number', registrationNumberValidator),
    yearEstablished: yup.number()
      .required('Year established is required')
      .min(1900, 'Invalid year')
      .max(new Date().getFullYear(), 'Year cannot be in the future'),
    operationalStatus: yup.string()
      .required('Operational status is required')
      .oneOf(['ACTIVE', 'PENDING', 'SUSPENDED'], 'Invalid status')
  }),

  contact: yup.object().shape({
    email: yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    phone: yup.string()
      .required('Phone number is required')
      .test('phone-valid', 'Invalid phone number', phoneValidator),
    alternativePhone: yup.string()
      .test('phone-valid', 'Invalid phone number', value => 
        !value || phoneValidator(value)),
    website: yup.string()
      .url('Invalid website URL'),
    postalAddress: yup.string()
      .required('Postal address is required')
      .matches(/^P\.O\. Box \d{1,6}(-\d{5})?$/, 'Invalid postal address format')
  }),

  location: yup.object().shape({
    county: yup.string()
      .required('County is required'),
    subCounty: yup.string()
      .required('Sub-county is required'),
    ward: yup.string()
      .required('Ward is required'),
    gpsCoordinates: yup.object().shape({
      latitude: yup.number()
        .min(-90, 'Invalid latitude')
        .max(90, 'Invalid latitude')
        .required('Latitude is required'),
      longitude: yup.number()
        .min(-180, 'Invalid longitude')
        .max(180, 'Invalid longitude')
        .required('Longitude is required')
    })
  }),

  facilities: yup.object().shape({
    classrooms: yup.array().of(
      yup.object().shape({
        name: yup.string().required('Classroom name is required'),
        capacity: yup.number()
          .required('Capacity is required')
          .min(1, 'Capacity must be greater than 0'),
        hasProjector: yup.boolean(),
        hasAirConditioning: yup.boolean(),
        accessibility: yup.boolean()
      })
    ).min(1, 'At least one classroom is required'),

    laboratories: yup.array().of(
      yup.object().shape({
        type: yup.string().required('Laboratory type is required'),
        equipment: yup.array().of(
          yup.object().shape({
            name: yup.string().required('Equipment name is required'),
            quantity: yup.number()
              .required('Quantity is required')
              .min(1, 'Quantity must be greater than 0'),
            condition: yup.string()
              .oneOf(['NEW', 'GOOD', 'FAIR', 'POOR'], 'Invalid condition')
              .required('Condition is required')
          })
        )
      })
    )
  }),

  documents: yup.object().shape({
    registration: yup.object().shape({
      file: yup.mixed().required('Registration certificate is required'),
      expiryDate: yup.date()
        .min(new Date(), 'Document has expired')
        .required('Expiry date is required')
    }),
    license: yup.object().shape({
      file: yup.mixed().required('License is required'),
      expiryDate: yup.date()
        .min(new Date(), 'License has expired')
        .required('Expiry date is required')
    }),
    qualityManual: yup.mixed().required('Quality manual is required'),
    safetyPolicy: yup.mixed().required('Safety policy is required'),
    insuranceCertificate: yup.mixed().required('Insurance certificate is required')
  })
});

// Course/Program Validation
export const programValidation = yup.object().shape({
  basic: yup.object().shape({
    name: yup.string()
      .required('Program name is required')
      .min(5, 'Program name must be at least 5 characters'),
    code: yup.string()
      .required('Program code is required')
      .matches(/^[A-Z]{3}-\d{3}$/, 'Invalid program code format'),
    type: yup.string()
      .required('Program type is required')
      .oneOf(['CERTIFICATE', 'DIPLOMA', 'DEGREE'], 'Invalid program type'),
    level: yup.string()
      .required('Level is required'),
    duration: yup.number()
      .required('Duration is required')
      .min(1, 'Duration must be at least 1 month')
      .max(60, 'Duration cannot exceed 60 months')
  }),

  requirements: yup.object().shape({
    minimumQualification: yup.string()
      .required('Minimum qualification is required'),
    experience: yup.number()
      .min(0, 'Invalid experience years'),
    specialRequirements: yup.array().of(
      yup.string()
    )
  }),

  curriculum: yup.object().shape({
    learningOutcomes: yup.array()
      .of(yup.string())
      .min(1, 'At least one learning outcome is required'),
    assessmentMethods: yup.array()
      .of(yup.string())
      .min(1, 'At least one assessment method is required'),
    modules: yup.array().of(
      yup.object().shape({
        name: yup.string().required('Module name is required'),
        code: yup.string().required('Module code is required'),
        credits: yup.number()
          .required('Credits are required')
          .min(1, 'Credits must be greater than 0')
      })
    ).min(1, 'At least one module is required')
  })
});