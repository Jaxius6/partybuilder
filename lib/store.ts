/**
 * In-memory storage with optional JSON persistence
 */

import fs from 'fs';
import path from 'path';
import type { Party, Member, Quote, Policy, Endorsement, PartyWithStats, DailyStats } from './types';
import { generateId, formatDateISO, slugify, debounce, calculatePercentage } from './util';

const DATA_FILE = path.join(process.cwd(), '.data', 'state.json');

// In-memory state
const state = {
  parties: [] as Party[],
  members: [] as Member[],
  quotes: [] as Quote[],
  policies: [] as Policy[],
  endorsements: [] as Endorsement[],
};

let isLoaded = false;

/**
 * Load state from JSON file
 */
function loadState(): void {
  if (isLoaded) return;

  try {
    if (fs.existsSync(DATA_FILE)) {
      const data = fs.readFileSync(DATA_FILE, 'utf-8');
      const parsed = JSON.parse(data);
      Object.assign(state, parsed);
      console.log('📂 Loaded state from', DATA_FILE);
    } else {
      console.log('📂 No existing state file, starting fresh');
    }
  } catch (error) {
    console.warn('⚠️  Could not load state file:', error);
    // Continue with empty state
  }

  isLoaded = true;
}

/**
 * Save state to JSON file (debounced)
 */
const saveState = debounce((): void => {
  try {
    const dir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(state, null, 2), 'utf-8');
    console.log('💾 Saved state to', DATA_FILE);
  } catch (error) {
    console.warn('⚠️  Could not save state file (continuing in memory-only mode):', error);
  }
}, 1000);

/**
 * Initialize store (load state on first use)
 */
function ensureLoaded(): void {
  if (!isLoaded) {
    loadState();
  }
}

/**
 * List all parties with stats
 */
export function listParties(): PartyWithStats[] {
  ensureLoaded();

  return state.parties.map(party => {
    const members_count = state.members.filter(m => m.party_id === party.id).length;
    const pct_to_500 = calculatePercentage(members_count, 500);

    return {
      ...party,
      members_count,
      pct_to_500,
    };
  });
}

/**
 * Get party by slug
 */
export function getParty(slug: string): PartyWithStats | null {
  ensureLoaded();

  const party = state.parties.find(p => p.slug === slug);
  if (!party) return null;

  const members_count = state.members.filter(m => m.party_id === party.id).length;
  const pct_to_500 = calculatePercentage(members_count, 500);

  return {
    ...party,
    members_count,
    pct_to_500,
  };
}

/**
 * Create a new party
 */
export function createParty(input: Partial<Party>): Party {
  ensureLoaded();

  const party: Party = {
    id: generateId(),
    name: input.name!,
    abbreviation: input.abbreviation,
    slug: slugify(input.name!),
    slogan: input.slogan,
    category: input.category,
    website: input.website,
    constitution_url: input.constitution_url,
    secretary_name: input.secretary_name,
    secretary_address: input.secretary_address,
    likes: 0,
    has_bank_account: false,
    has_exec: false,
    has_constitution: false,
    has_website: false,
    has_facebook: false,
    waec_status: 'DRAFT',
    app_fee_paid: false,
    objections_count: 0,
    created_at: formatDateISO(),
  };

  state.parties.push(party);
  saveState();

  return party;
}

/**
 * Join a party (add member)
 */
export function joinParty(slug: string, input: {
  full_name: string;
  email: string;
  suburb?: string;
  dob?: string;
  is_wa_elector?: boolean;
}): Member | null {
  ensureLoaded();

  const party = state.parties.find(p => p.slug === slug);
  if (!party) return null;

  // Check if already a member (by email)
  const existing = state.members.find(
    m => m.party_id === party.id && m.email.toLowerCase() === input.email.toLowerCase()
  );
  if (existing) {
    throw new Error('Email already registered for this party');
  }

  const member: Member = {
    id: generateId(),
    party_id: party.id,
    full_name: input.full_name,
    email: input.email,
    suburb: input.suburb,
    dob: input.dob,
    is_wa_elector: input.is_wa_elector,
    created_at: formatDateISO(),
  };

  state.members.push(member);
  saveState();

  return member;
}

/**
 * Like a party (increment likes)
 */
export function likeParty(slug: string): Party | null {
  ensureLoaded();

  const party = state.parties.find(p => p.slug === slug);
  if (!party) return null;

  party.likes++;
  saveState();

  return party;
}

/**
 * Get members of a party
 */
export function getPartyMembers(slug: string): Member[] {
  ensureLoaded();

  const party = state.parties.find(p => p.slug === slug);
  if (!party) return [];

  return state.members
    .filter(m => m.party_id === party.id)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

/**
 * Get recent members for a party
 */
export function getRecentMembers(slug: string, limit: number = 10): Member[] {
  const members = getPartyMembers(slug);
  return members.slice(0, limit);
}

/**
 * Get daily member growth stats for a party
 */
export function getDailyStats(slug: string, days: number = 30): DailyStats[] {
  ensureLoaded();

  const party = state.parties.find(p => p.slug === slug);
  if (!party) return [];

  const members = state.members.filter(m => m.party_id === party.id);

  // Group by date
  const statsMap = new Map<string, number>();

  // Initialize with zeros for the last N days
  const today = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    statsMap.set(dateStr, 0);
  }

  // Count members by date
  members.forEach(member => {
    const dateStr = member.created_at.split('T')[0];
    if (statsMap.has(dateStr)) {
      statsMap.set(dateStr, statsMap.get(dateStr)! + 1);
    }
  });

  // Convert to cumulative counts
  let cumulative = 0;
  const result: DailyStats[] = [];

  Array.from(statsMap.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .forEach(([date, count]) => {
      cumulative += count;
      result.push({ date, members: cumulative });
    });

  return result;
}

/**
 * Get quotes for a party
 */
export function getPartyQuotes(slug: string): Quote[] {
  ensureLoaded();

  const party = state.parties.find(p => p.slug === slug);
  if (!party) return [];

  return state.quotes
    .filter(q => q.party_id === party.id)
    .sort((a, b) => a.position - b.position);
}

/**
 * Get policies for a party
 */
export function getPartyPolicies(slug: string): Policy[] {
  ensureLoaded();

  const party = state.parties.find(p => p.slug === slug);
  if (!party) return [];

  return state.policies
    .filter(p => p.party_id === party.id)
    .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
}

/**
 * Get endorsements for a party
 */
export function getPartyEndorsements(slug: string): Endorsement[] {
  ensureLoaded();

  const party = state.parties.find(p => p.slug === slug);
  if (!party) return [];

  return state.endorsements
    .filter(e => e.party_id === party.id)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

/**
 * Get category statistics
 */
export function getCategoryStats(): { category: string; count: number }[] {
  ensureLoaded();

  const categoryMap = new Map<string, number>();

  state.parties.forEach(party => {
    const cat = party.category || 'Uncategorized';
    categoryMap.set(cat, (categoryMap.get(cat) || 0) + 1);
  });

  return Array.from(categoryMap.entries())
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count);
}

/**
 * Get all party names (for validation)
 */
export function getAllPartyNames(): string[] {
  ensureLoaded();
  return state.parties.map(p => p.name);
}

/**
 * Export members as CSV data
 */
export function exportMembersCSV(slug: string): string {
  const members = getPartyMembers(slug);

  const headers = ['Name', 'Email', 'Suburb', 'DOB', 'WA Elector', 'Joined'];
  const rows = members.map(m => [
    m.full_name,
    m.email,
    m.suburb || '',
    m.dob || '',
    m.is_wa_elector ? 'Yes' : 'No',
    m.created_at,
  ]);

  const csv = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
  ].join('\n');

  return csv;
}
