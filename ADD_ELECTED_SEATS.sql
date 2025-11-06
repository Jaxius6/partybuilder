-- Migration: Add elected_seats column to existing partybuilder table
-- Run this ONLY if you already have the partybuilder table created

-- Add the elected_seats column
ALTER TABLE partybuilder
ADD COLUMN IF NOT EXISTS elected_seats INTEGER DEFAULT 0;

-- Update existing parties with seat data (based on current WA parliament composition)
UPDATE partybuilder SET elected_seats = 53 WHERE slug = 'wa-labor';
UPDATE partybuilder SET elected_seats = 2 WHERE slug = 'liberal-party-western-australia';
UPDATE partybuilder SET elected_seats = 1 WHERE slug = 'the-greens-wa-inc';
UPDATE partybuilder SET elected_seats = 4 WHERE slug = 'the-nationals-wa';
UPDATE partybuilder SET elected_seats = 0 WHERE slug = 'pauline-hansons-one-nation';
UPDATE partybuilder SET elected_seats = 0 WHERE elected_seats IS NULL;

-- Verify the migration
SELECT name, abbreviation, members_count, elected_seats
FROM partybuilder
WHERE members_count >= 500
ORDER BY elected_seats DESC;
