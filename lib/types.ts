/**
 * TypeScript types for PartyBuilder
 */

export type WAECStatus =
  | 'DRAFT'
  | 'PREP'
  | 'SUBMITTED'
  | 'GAZETTE_NOTICE'
  | 'OBJECTION_WINDOW'
  | 'REGISTERED'
  | 'REJECTED';

export type Party = {
  id: string;
  name: string;
  abbreviation?: string;
  slug: string;
  slogan?: string;
  category?: string;
  website?: string;
  constitution_url?: string;
  secretary_name?: string;
  secretary_address?: string;
  likes: number;
  has_bank_account: boolean;
  has_exec: boolean;
  has_constitution: boolean;
  has_website: boolean;
  has_facebook: boolean;
  waec_status: WAECStatus;
  app_fee_paid: boolean;
  application_submitted_at?: string;
  gazette_notice_date?: string;
  objection_deadline?: string;
  objections_count: number;
  created_at: string;
};

export type Member = {
  id: string;
  party_id: string;
  full_name: string;
  email: string;
  suburb?: string;
  dob?: string;
  is_wa_elector?: boolean;
  created_at: string;
};

export type Endorsement = {
  id: string;
  party_id: string;
  person_name: string;
  title?: string;
  quote: string;
  avatar_url?: string;
  created_at: string;
};

export type Quote = {
  id: string;
  party_id: string;
  body: string;
  position: number;
};

export type Policy = {
  id: string;
  party_id: string;
  title: string;
  body_md: string;
  updated_at: string;
};

export type PartyWithStats = Party & {
  members_count: number;
  pct_to_500: number;
};

export type DailyStats = {
  date: string;
  members: number;
};
