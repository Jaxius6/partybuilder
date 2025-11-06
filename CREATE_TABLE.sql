-- PartyBuilder Table Creation
-- Run this in your NocoDB SQL editor or PostgreSQL client

-- Option 1: Drop existing table and create fresh (USE WITH CAUTION - deletes all data)
DROP TABLE IF EXISTS partybuilder CASCADE;

CREATE TABLE partybuilder (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Basic Info
  name VARCHAR(255) NOT NULL UNIQUE,
  abbreviation VARCHAR(10),
  slug VARCHAR(255) NOT NULL UNIQUE,
  slogan TEXT,
  category VARCHAR(50),

  -- Contact & Documents
  website VARCHAR(500),
  constitution_url VARCHAR(500),
  secretary_name VARCHAR(255),
  secretary_address TEXT,

  -- Engagement
  likes INTEGER DEFAULT 0,
  members_count INTEGER DEFAULT 0,
  elected_seats INTEGER DEFAULT 0,

  -- Requirements Checklist
  has_bank_account BOOLEAN DEFAULT false,
  has_exec BOOLEAN DEFAULT false,
  has_constitution BOOLEAN DEFAULT false,
  has_website BOOLEAN DEFAULT false,
  has_facebook BOOLEAN DEFAULT false,

  -- WAEC Registration Status
  waec_status VARCHAR(50) DEFAULT 'DRAFT',
  app_fee_paid BOOLEAN DEFAULT false,
  application_submitted_at TIMESTAMP,
  gazette_notice_date TIMESTAMP,
  objection_deadline TIMESTAMP,
  objections_count INTEGER DEFAULT 0,

  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_partybuilder_slug ON partybuilder(slug);
CREATE INDEX idx_partybuilder_waec_status ON partybuilder(waec_status);
CREATE INDEX idx_partybuilder_created_at ON partybuilder(created_at DESC);
CREATE INDEX idx_partybuilder_members_count ON partybuilder(members_count DESC);

-- Add constraint for valid WAEC status
ALTER TABLE partybuilder
ADD CONSTRAINT check_waec_status
CHECK (waec_status IN (
  'DRAFT',
  'PREP',
  'SUBMITTED',
  'GAZETTE_NOTICE',
  'OBJECTION_WINDOW',
  'REGISTERED',
  'REJECTED'
));

-- Add constraint for valid category
ALTER TABLE partybuilder
ADD CONSTRAINT check_category
CHECK (category IN (
  'Progressive',
  'Conservative',
  'Centrist',
  'Environmental',
  'Social',
  'Economic',
  'Other'
) OR category IS NULL);
