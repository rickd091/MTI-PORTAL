-- Create applications table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.applications (
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

-- Create inspections table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.inspections (
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

-- Create documents table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.documents (
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

-- Enable Row Level Security (RLS) if it's not already enabled
DO $$ 
BEGIN
  -- Enable RLS for each table
  ALTER TABLE IF EXISTS public.profiles ENABLE ROW LEVEL SECURITY;
  ALTER TABLE IF EXISTS public.institutions ENABLE ROW LEVEL SECURITY;
  ALTER TABLE IF EXISTS public.applications ENABLE ROW LEVEL SECURITY;
  ALTER TABLE IF EXISTS public.inspections ENABLE ROW LEVEL SECURITY;
  ALTER TABLE IF EXISTS public.documents ENABLE ROW LEVEL SECURITY;
END $$;

-- Create UUID extension if not exists
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Check if sample data already exists before inserting
DO $$ 
DECLARE
  admin_exists BOOLEAN;
  profile_id UUID;
BEGIN
  -- Check if admin user already exists
  SELECT EXISTS(SELECT 1 FROM public.profiles WHERE email = 'admin@example.com') INTO admin_exists;
  
  -- Only insert if admin doesn't exist
  IF NOT admin_exists THEN
    INSERT INTO public.profiles (auth_id, email, full_name, role)
    VALUES ('sample-auth-id', 'admin@example.com', 'Admin User', 'ADMIN');
    
    -- Get the UUID of the inserted profile
    SELECT id INTO profile_id FROM public.profiles WHERE email = 'admin@example.com' LIMIT 1;
    
    -- Check if institution already exists for this profile
    IF NOT EXISTS(SELECT 1 FROM public.institutions WHERE profile_id = profile_id) THEN
      INSERT INTO public.institutions 
      (profile_id, name, type, status, contact_person, email, phone, address, accreditation_status)
      VALUES 
      (profile_id, 'Sample Institution', 'UNIVERSITY', 'PENDING', 'John Doe', 'contact@example.com', '+1234567890', '123 Main St', 'PENDING');
    END IF;
  END IF;
END $$;
