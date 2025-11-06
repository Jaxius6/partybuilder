-- Seed PartyBuilder with Real WA Parties + 3 Fun Fake Parties
-- Run this in NocoDB SQL Editor or psql

-- REAL REGISTERED PARTIES IN WA (500+ members each)
-- These are actual political parties registered with WAEC

INSERT INTO partybuilder (
  name,
  abbreviation,
  slug,
  category,
  waec_status,
  members_count,
  has_website,
  has_constitution,
  has_bank_account,
  has_exec,
  has_facebook,
  app_fee_paid,
  website
) VALUES

-- Labor
('WA Labor', 'ALP', 'wa-labor', 'Progressive', 'REGISTERED', 2100, true, true, true, true, true, true, 'https://www.walabor.org.au'),

-- Liberal
('Liberal Party Western Australia', 'LIB', 'liberal-party-western-australia', 'Conservative', 'REGISTERED', 1850, true, true, true, true, true, true, 'https://www.waliberal.org.au'),

-- Greens
('The Greens (WA) Inc', 'GRN', 'the-greens-wa-inc', 'Environmental', 'REGISTERED', 1450, true, true, true, true, true, true, 'https://greens.org.au/wa'),

-- One Nation
('Pauline Hanson''s One Nation', 'PHON', 'pauline-hansons-one-nation', 'Conservative', 'REGISTERED', 920, true, true, true, true, true, true, 'https://www.onenation.org.au'),

-- Nationals
('The Nationals WA', 'NAT', 'the-nationals-wa', 'Conservative', 'REGISTERED', 890, true, true, true, true, true, true, 'https://www.nationalswa.com'),

-- Legalise Cannabis
('Legalise Cannabis Party WA', 'LCP', 'legalise-cannabis-party-wa', 'Social', 'REGISTERED', 720, true, true, true, true, true, true, 'https://www.legalise.org.au'),

-- Shooters, Fishers and Farmers
('Shooters, Fishers and Farmers Party', 'SFF', 'shooters-fishers-and-farmers-party', 'Conservative', 'REGISTERED', 680, true, true, true, true, true, true, 'https://www.sff.org.au'),

-- Animal Justice
('Animal Justice Party', 'AJP', 'animal-justice-party', 'Environmental', 'REGISTERED', 650, true, true, true, true, true, true, 'https://animaljusticeparty.org'),

-- Sustainable Australia
('Sustainable Australia Party', 'SAP', 'sustainable-australia-party', 'Environmental', 'REGISTERED', 590, true, true, true, true, true, true, 'https://www.sustainableaustralia.org.au'),

-- Australian Christians
('Australian Christians', 'AC', 'australian-christians', 'Conservative', 'REGISTERED', 580, true, true, true, true, true, true, 'https://www.australianchristians.org.au'),

-- Libertarian
('Libertarian Party', 'LDP', 'libertarian-party', 'Economic', 'REGISTERED', 540, true, true, true, true, true, true, 'https://www.ldp.org.au'),

-- WA Party
('Western Australia Party', 'WAP', 'western-australia-party', 'Other', 'REGISTERED', 510, true, true, true, true, true, true, 'https://www.wap.org.au'),


-- 🎉 FUN FAKE PARTIES (under 500 members - still building)

-- Party 1: Bring Back Blockbuster Party
('Bring Back Blockbuster Party', 'BBB', 'bring-back-blockbuster-party', 'Other', 'PREP', 420, true, false, true, true, true, false, 'https://beblockedorbekind.com'),

-- Party 2: Mandatory Nap Time Party
('Mandatory Nap Time Party', 'MNTP', 'mandatory-nap-time-party', 'Social', 'PREP', 267, false, true, false, true, true, false, null),

-- Party 3: Free Coffee For Everyone Party
('Free Coffee For Everyone Party', 'FCFE', 'free-coffee-for-everyone-party', 'Progressive', 'DRAFT', 89, false, false, false, false, true, false, null);


-- Verify the data
SELECT
  name,
  abbreviation,
  members_count,
  waec_status,
  CASE
    WHEN members_count >= 500 THEN '✅ Registered'
    ELSE '⏳ Building (' || (500 - members_count) || ' needed)'
  END as status
FROM partybuilder
ORDER BY members_count DESC;
