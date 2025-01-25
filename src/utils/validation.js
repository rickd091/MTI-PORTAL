// src/utils/validation.js
import * as yup from 'yup';

export const validationSchemas = {
  institution: yup.object().shape({
    name: yup.string()
      .required('Institution name is required')
      .min(3, 'Name must be at least 3 characters'),
    type: yup.string()
      .required('Institution type is required'),
    email: yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    phone: yup.string()
      .matches(/^(\+254|0)[17]\d{8}$/, 'Invalid Kenyan phone number')
      .required('Phone number is required'),
    registrationNumber: yup.string()
      .required('Registration number is required')
      .matches(/^[A-Z0-9]{5,}$/, 'Invalid registration number format'),
    address: yup.object().shape({
      physical: yup.string().required('Physical address is required'),
      county: yup.string().required('County is required'),
      subCounty: yup.string().required('Sub-county is required')
    })
  }),

  program: yup.object().shape({
    name: yup.string()
      .required('Program name is required')
      .min(5, 'Program name must be at least 5 characters'),
    type: yup.string()
      .required('Program type is required'),
    duration: yup.number()
      .required('Duration is required')
      .min(1, 'Duration must be at least 1 month')
      .max(60, 'Duration cannot exceed 60 months'),
    capacity: yup.number()
      .required('Capacity is required')
      .min(1, 'Capacity must be greater than 0'),
    level: yup.string()
      .required('Program level is required')
  })
};

// src/hooks/useForm.js
import { useState } from 'react';
import { validationSchemas } from '../utils/validation';

export const useForm = (schema, initialValues, onSubmit) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = async (fieldName, value) => {
    try {
      await schema.validateAt(fieldName, { [fieldName]: value });
      setErrors(prev => ({ ...prev, [fieldName]: undefined }));
      return true;
    } catch (error) {
      setErrors(prev => ({ ...prev, [fieldName]: error.message }));
      return false;
    }
  };

  const handleChange = async (e) => {
    const { name, value } = e.target;
    setValues(prev => ({ ...prev, [name]: value }));
    await validate(name, value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const validatedData = await schema.validate(values, { abortEarly: false });
      await onSubmit(validatedData);
    } catch (error) {
      const validationErrors = {};
      error.inner.forEach(err => {
        validationErrors[err.path] = err.message;
      });
      setErrors(validationErrors);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    values,
    errors,
    isSubmitting,
    handleChange,
    handleSubmit,
    setValues
  };
};