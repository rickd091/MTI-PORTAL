-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  auth_id TEXT NOT NULL,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('ADMIN', 'REVIEWER', 'INSTITUTION_USER', 'ASSESSOR')),
  phone TEXT,
  avatar_url TEXT,
  active BOOLEAN DEFAULT TRUE,
  last_login TIMESTAMP,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create institutions table
CREATE TABLE public.institutions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID NOT NULL REFERENCES public.profiles(id),
  name TEXT NOT NULL,
  registration_number TEXT,
  type TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('PENDING', 'ACTIVE', 'SUSPENDED', 'EXPIRED')),
  contact_person TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  address TEXT NOT NULL,
  website TEXT,
  accreditation_status TEXT NOT NULL,
  accreditation_expiry TIMESTAMP,
  last_inspection_date TIMESTAMP,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create applications table
CREATE TABLE public.applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  institution_id UUID NOT NULL REFERENCES public.institutions(id),
  application_type TEXT NOT NULL CHECK (application_type IN ('INITIAL', 'RENEWAL', 'AMENDMENT')),
  status TEXT NOT NULL CHECK (status IN ('DRAFT', 'SUBMITTED', 'UNDER_REVIEW', 'APPROVED', 'REJECTED')),
  submission_date TIMESTAMP,
  review_date TIMESTAMP,
  approval_date TIMESTAMP,
  rejection_reason TEXT,
  payment_status TEXT NOT NULL CHECK (payment_status IN ('PENDING', 'PAID', 'FAILED')),
  payment_reference TEXT,
  payment_amount NUMERIC,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create inspections table
CREATE TABLE public.inspections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  institution_id UUID NOT NULL REFERENCES public.institutions(id),
  application_id UUID REFERENCES public.applications(id),
  inspector_id UUID NOT NULL, -- References profiles(id) for the inspector
  status TEXT NOT NULL CHECK (status IN ('SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED')),
  scheduled_date TIMESTAMP NOT NULL,
  completion_date TIMESTAMP,
  report_submitted BOOLEAN DEFAULT FALSE,
  report_url TEXT,
  findings JSONB,
  recommendations TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  FOREIGN KEY (inspector_id) REFERENCES public.profiles(id)
);

-- Create documents table
CREATE TABLE public.documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  institution_id UUID NOT NULL REFERENCES public.institutions(id),
  application_id UUID REFERENCES public.applications(id),
  document_type TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  mime_type TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('PENDING', 'VERIFIED', 'REJECTED')),
  verification_date TIMESTAMP,
  verified_by UUID REFERENCES public.profiles(id),
  rejection_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.institutions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inspections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

-- Create UUID extension if not exists
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Add sample data for testing
INSERT INTO public.profiles (auth_id, email, full_name, role)
VALUES 
('sample-auth-id', 'admin@example.com', 'Admin User', 'ADMIN');

-- Get the UUID of the inserted profile
DO $$ 
DECLARE
  profile_id UUID;
BEGIN
  SELECT id INTO profile_id FROM public.profiles WHERE email = 'admin@example.com' LIMIT 1;
  
  INSERT INTO public.institutions 
  (profile_id, name, type, status, contact_person, email, phone, address, accreditation_status)
  VALUES 
  (profile_id, 'Sample Institution', 'UNIVERSITY', 'PENDING', 'John Doe', 'contact@example.com', '+1234567890', '123 Main St', 'PENDING');
END $$;
