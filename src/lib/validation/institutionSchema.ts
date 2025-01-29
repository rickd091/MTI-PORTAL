import * as z from "zod";

// Basic information validation schema
export const basicInfoSchema = z.object({
  name: z.string().min(3, "Institution name must be at least 3 characters"),
  type: z.string().min(1, "Institution type is required"),
  registration_number: z.string().min(1, "Registration number is required"),
  contact_person: z.string().min(3, "Contact person name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().regex(/^\+?[0-9]{10,15}$/, "Invalid phone number format"),
  address: z.string().min(10, "Please provide a complete address"),
  website: z.string().url("Invalid website URL").optional().or(z.literal("")),
});

// Facilities validation schema
export const facilitySchema = z.object({
  facility_type: z.string().min(1, "Facility type is required"),
  name: z.string().min(1, "Facility name is required"),
  capacity: z.number().min(1, "Capacity must be at least 1").optional(),
  area_size: z.number().min(1, "Area size must be greater than 0").optional(),
  equipment_details: z.record(z.any()).optional(),
  status: z.enum(["operational", "maintenance", "inactive"]),
});

// Staff validation schema
export const staffSchema = z.object({
  first_name: z.string().min(2, "First name is required"),
  last_name: z.string().min(2, "Last name is required"),
  role: z.string().min(1, "Role is required"),
  qualification: z.string().min(1, "Qualification is required"),
  email: z.string().email("Invalid email address").optional(),
  phone: z
    .string()
    .regex(/^\+?[0-9]{10,15}$/, "Invalid phone number format")
    .optional(),
  certification_details: z.record(z.any()).optional(),
});

// Document validation schema
export const documentSchema = z.object({
  document_type: z.string().min(1, "Document type is required"),
  file: z
    .instanceof(File)
    .refine((file) => file.size <= 10 * 1024 * 1024, {
      message: "File size must be less than 10MB",
    })
    .refine(
      (file) =>
        [
          "application/pdf",
          "image/jpeg",
          "image/png",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ].includes(file.type),
      {
        message: "File type must be PDF, JPEG, PNG, or DOC/DOCX",
      },
    ),
});

// Complete registration schema
export const registrationSchema = z.object({
  basicInfo: basicInfoSchema,
  facilities: z.array(facilitySchema),
  staff: z.array(staffSchema),
  documents: z.array(documentSchema),
  terms_accepted: z.boolean().refine((val) => val === true, {
    message: "You must accept the terms and conditions",
  }),
});

// Types
export type BasicInfoInputs = z.infer<typeof basicInfoSchema>;
export type FacilityInputs = z.infer<typeof facilitySchema>;
export type StaffInputs = z.infer<typeof staffSchema>;
export type DocumentInputs = z.infer<typeof documentSchema>;
export type RegistrationInputs = z.infer<typeof registrationSchema>;
