/**
 * Seed script to populate the database with test data
 * Run with: npx tsx scripts/seed.ts
 */

const BASE_URL = 'http://localhost:3000';

interface PartyData {
  name: string;
  abbreviation?: string;
  category?: string;
  secretary_name?: string;
  slogan?: string;
  members?: number;
}

// Test parties (prototypes)
const testParties: PartyData[] = [
  {
    name: 'Stop Ai Party',
    abbreviation: 'SAI',
    category: 'Progressive',
    slogan: 'Protecting humanity from unregulated AI',
    members: 120,
  },
  {
    name: 'Fix Housing Party',
    abbreviation: 'FHP',
    category: 'Social',
    slogan: 'Affordable homes for all Western Australians',
    members: 350,
  },
  {
    name: 'Pro Ai Party',
    abbreviation: 'PAI',
    category: 'Progressive',
    slogan: 'Embracing AI for a better future',
    members: 89,
  },
];

// Real registered WA political parties (all with 500+ members)
const registeredParties: PartyData[] = [
  {
    name: 'Animal Justice Party',
    abbreviation: 'Animal Justice Party',
    category: 'Environmental',
    secretary_name: 'Amanda McGovern',
    members: 650,
  },
  {
    name: 'Australian Christians',
    abbreviation: 'Australian Christians',
    category: 'Conservative',
    secretary_name: 'Margret Hinton',
    members: 580,
  },
  {
    name: 'Legalise Cannabis Party Wa',
    abbreviation: 'Legalise Cannabis Party WA',
    category: 'Progressive',
    secretary_name: 'Aaron Cross',
    members: 720,
  },
  {
    name: 'Liberal Party Western Australia',
    abbreviation: 'Liberal Party',
    category: 'Conservative',
    secretary_name: 'Simon Morgan',
    members: 1850,
  },
  {
    name: 'Libertarian Party',
    abbreviation: 'Libertarian',
    category: 'Economic',
    secretary_name: 'Ryan Burns',
    members: 540,
  },
  {
    name: "Pauline Hanson's One Nation",
    abbreviation: 'One Nation',
    category: 'Conservative',
    secretary_name: 'Julie Cottam',
    members: 920,
  },
  {
    name: 'Shooters Fishers And Farmers',
    abbreviation: 'SFFPWA',
    category: 'Conservative',
    secretary_name: 'Clinton Thomas',
    members: 680,
  },
  {
    name: 'Sustainable Australia Party Anti Corruption',
    abbreviation: 'Sustainable Australia',
    category: 'Environmental',
    secretary_name: 'William Bourke',
    members: 590,
  },
  {
    name: 'The Greens Wa Inc',
    abbreviation: 'The Greens (WA)',
    category: 'Environmental',
    secretary_name: 'David Worth',
    members: 1450,
  },
  {
    name: 'The Nationals Wa',
    abbreviation: 'The Nationals WA',
    category: 'Conservative',
    secretary_name: 'Debbie Carson',
    members: 890,
  },
  {
    name: 'Wa Labor',
    abbreviation: 'WA Labor',
    category: 'Progressive',
    secretary_name: 'Eleanor Whiteaker',
    members: 2100,
  },
  {
    name: 'Western Australia Party',
    abbreviation: 'WA Party',
    category: 'Centrist',
    secretary_name: 'Various',
    members: 510,
  },
];

async function createParty(party: PartyData) {
  try {
    const response = await fetch(`${BASE_URL}/api/parties`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: party.name,
        abbreviation: party.abbreviation,
        category: party.category,
        slogan: party.slogan,
        secretary_name: party.secretary_name,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error(`Failed to create ${party.name}:`, error);
      return null;
    }

    const data = await response.json();
    console.log(`✓ Created party: ${party.name}`);
    return data.party;
  } catch (error) {
    console.error(`Error creating ${party.name}:`, error);
    return null;
  }
}

async function addMembers(slug: string, count: number) {
  const memberNames = [
    'John Smith', 'Jane Doe', 'Michael Brown', 'Sarah Johnson', 'David Lee',
    'Emma Wilson', 'James Taylor', 'Olivia Davis', 'William Martinez', 'Sophia Anderson',
    'Robert Thomas', 'Isabella Jackson', 'Charles White', 'Mia Harris', 'Daniel Clark',
    'Charlotte Lewis', 'Matthew Walker', 'Amelia Hall', 'Joseph Allen', 'Harper Young',
    'Thomas King', 'Evelyn Wright', 'Christopher Lopez', 'Abigail Hill', 'Andrew Scott',
  ];

  const suburbs = [
    'Perth', 'Fremantle', 'Joondalup', 'Rockingham', 'Mandurah',
    'Bunbury', 'Kalgoorlie', 'Albany', 'Geraldton', 'Broome',
    'Subiaco', 'Nedlands', 'Victoria Park', 'South Perth', 'Cottesloe',
  ];

  for (let i = 0; i < count; i++) {
    const name = memberNames[i % memberNames.length] + ` ${i}`;
    const suburb = suburbs[i % suburbs.length];

    try {
      const response = await fetch(`${BASE_URL}/api/parties/${slug}/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: name,
          email: `${name.toLowerCase().replace(' ', '.')}${i}@example.com`,
          suburb: suburb,
          is_wa_elector: true,
        }),
      });

      if (!response.ok && i === 0) {
        const error = await response.json();
        console.error(`Failed to add member to ${slug}:`, error);
      }
    } catch (error) {
      if (i === 0) {
        console.error(`Error adding members to ${slug}:`, error);
      }
    }
  }

  console.log(`  Added ${count} members to ${slug}`);
}

async function seed() {
  console.log('🌱 Seeding database...\n');

  console.log('Creating test parties (prototypes)...');
  for (const party of testParties) {
    const created = await createParty(party);
    if (created && party.members) {
      await addMembers(created.slug, party.members);
    }
  }

  console.log('\nCreating registered parties (500+ members)...');
  for (const party of registeredParties) {
    const created = await createParty(party);
    if (created && party.members) {
      await addMembers(created.slug, party.members);
    }
  }

  console.log('\n✅ Seeding complete!');
}

seed().catch(console.error);
