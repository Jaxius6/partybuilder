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
  likes?: number;
}

// Test parties
const testParties: PartyData[] = [
  {
    name: 'Stop Ai Party',
    abbreviation: 'SAI',
    category: 'Progressive',
    slogan: 'Protecting humanity from unregulated AI',
    members: 120,
    likes: 45,
  },
  {
    name: 'Fix Housing Party',
    abbreviation: 'FHP',
    category: 'Social',
    slogan: 'Affordable homes for all Western Australians',
    members: 350,
    likes: 128,
  },
  {
    name: 'Pro Ai Party',
    abbreviation: 'PAI',
    category: 'Progressive',
    slogan: 'Embracing AI for a better future',
    members: 89,
    likes: 23,
  },
];

// Real registered WA political parties (all with 500+ members)
const registeredParties: PartyData[] = [
  {
    name: 'Animal Justice Party',
    abbreviation: 'AJP',
    category: 'Environmental',
    secretary_name: 'Amanda McGovern',
    members: 650,
    likes: 234,
  },
  {
    name: 'Australian Christians',
    abbreviation: 'AC',
    category: 'Conservative',
    secretary_name: 'Margret Hinton',
    members: 580,
    likes: 156,
  },
  {
    name: 'Legalise Cannabis Wa',
    abbreviation: 'LCPWA',
    category: 'Progressive',
    secretary_name: 'Aaron Cross',
    members: 720,
    likes: 412,
  },
  {
    name: 'Liberal Party Wa',
    abbreviation: 'Liberal',
    category: 'Conservative',
    secretary_name: 'Simon Morgan',
    members: 1850,
    likes: 892,
  },
  {
    name: 'Libertarian Party',
    abbreviation: 'LDP',
    category: 'Economic',
    secretary_name: 'Ryan Burns',
    members: 540,
    likes: 178,
  },
  {
    name: "One Nation",
    abbreviation: 'PHON',
    category: 'Conservative',
    secretary_name: 'Julie Cottam',
    members: 920,
    likes: 445,
  },
  {
    name: 'Shooters Fishers Farmers',
    abbreviation: 'SFFPWA',
    category: 'Conservative',
    secretary_name: 'Clinton Thomas',
    members: 680,
    likes: 267,
  },
  {
    name: 'Sustainable Australia Party',
    abbreviation: 'SAP',
    category: 'Environmental',
    secretary_name: 'William Bourke',
    members: 590,
    likes: 203,
  },
  {
    name: 'The Greens Wa',
    abbreviation: 'Greens WA',
    category: 'Environmental',
    secretary_name: 'David Worth',
    members: 1450,
    likes: 678,
  },
  {
    name: 'The Nationals Wa',
    abbreviation: 'Nationals',
    category: 'Conservative',
    secretary_name: 'Debbie Carson',
    members: 890,
    likes: 334,
  },
  {
    name: 'Wa Labor',
    abbreviation: 'Labor',
    category: 'Progressive',
    secretary_name: 'Eleanor Whiteaker',
    members: 2100,
    likes: 1247,
  },
  {
    name: 'Western Australia Party',
    abbreviation: 'WAP',
    category: 'Centrist',
    secretary_name: 'Various',
    members: 510,
    likes: 189,
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

async function addLikes(slug: string, count: number) {
  for (let i = 0; i < count; i++) {
    try {
      await fetch(`${BASE_URL}/api/parties/${slug}/like`, {
        method: 'POST',
      });
    } catch (error) {
      // Silently continue
    }
  }
  console.log(`  Added ${count} likes to ${slug}`);
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
          email: `${name.toLowerCase().replace(/\s/g, '.')}${i}@example.com`,
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

  console.log('Creating test parties...');
  for (const party of testParties) {
    const created = await createParty(party);
    if (created) {
      if (party.members) {
        await addMembers(created.slug, party.members);
      }
      if (party.likes) {
        await addLikes(created.slug, party.likes);
      }
    }
  }

  console.log('\nCreating registered parties (500+ members)...');
  for (const party of registeredParties) {
    const created = await createParty(party);
    if (created) {
      if (party.members) {
        await addMembers(created.slug, party.members);
      }
      if (party.likes) {
        await addLikes(created.slug, party.likes);
      }
    }
  }

  console.log('\n✅ Seeding complete!');
  console.log('\n📝 To wipe data and re-seed:');
  console.log('   1. Stop the dev server (Ctrl+C)');
  console.log('   2. Restart: npm run dev');
  console.log('   3. Run: npm run seed');
}

seed().catch(console.error);
