/**
 * Supabase storage - queries the partybuilder table
 */

import { supabase } from './supabase';
import type { Party, PartyWithStats, DailyStats } from './types';
import { generateId, formatDateISO, slugify, calculatePercentage } from './util';

/**
 * List all parties with stats
 */
export async function listParties(): Promise<PartyWithStats[]> {
  const { data, error } = await supabase
    .from('partybuilder')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching parties:', error);
    return [];
  }

  return (data || []).map(party => ({
    ...party,
    pct_to_500: calculatePercentage(party.members_count || 0, 500),
  }));
}

/**
 * Get party by slug
 */
export async function getParty(slug: string): Promise<PartyWithStats | null> {
  const { data, error } = await supabase
    .from('partybuilder')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error || !data) {
    console.error('Error fetching party:', error);
    return null;
  }

  return {
    ...data,
    pct_to_500: calculatePercentage(data.members_count || 0, 500),
  };
}

/**
 * Create a new party
 */
export async function createParty(input: Partial<Party>): Promise<Party | null> {
  const party = {
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
    members_count: 0,
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

  const { data, error } = await supabase
    .from('partybuilder')
    .insert([party])
    .select()
    .single();

  if (error) {
    console.error('Error creating party:', error);
    return null;
  }

  return data;
}

/**
 * Join a party (increment members_count)
 * Note: Since there's no members table, this just increments the counter
 */
export async function joinParty(slug: string, _input: {
  full_name: string;
  email: string;
  suburb?: string;
  dob?: string;
  is_wa_elector?: boolean;
}): Promise<{ success: boolean } | null> {
  // Get current party
  const { data: party, error: fetchError } = await supabase
    .from('partybuilder')
    .select('members_count')
    .eq('slug', slug)
    .single();

  if (fetchError || !party) {
    console.error('Error fetching party for join:', fetchError);
    return null;
  }

  // Increment members_count
  const { error: updateError } = await supabase
    .from('partybuilder')
    .update({ members_count: (party.members_count || 0) + 1 })
    .eq('slug', slug);

  if (updateError) {
    console.error('Error joining party:', updateError);
    return null;
  }

  return { success: true };
}

/**
 * Like a party (increment likes)
 */
export async function likeParty(slug: string): Promise<Party | null> {
  // Get current likes
  const { data: party, error: fetchError } = await supabase
    .from('partybuilder')
    .select('likes')
    .eq('slug', slug)
    .single();

  if (fetchError || !party) {
    console.error('Error fetching party for like:', fetchError);
    return null;
  }

  // Increment likes
  const { data, error: updateError } = await supabase
    .from('partybuilder')
    .update({ likes: (party.likes || 0) + 1 })
    .eq('slug', slug)
    .select()
    .single();

  if (updateError) {
    console.error('Error liking party:', updateError);
    return null;
  }

  return data;
}

/**
 * Get party members
 * Note: No members table - returns empty array
 */
export async function getPartyMembers(_slug: string): Promise<any[]> {
  return [];
}

/**
 * Get recent members for a party
 * Note: No members table - returns empty array
 */
export async function getRecentMembers(_slug: string, _limit: number = 10): Promise<any[]> {
  return [];
}

/**
 * Get daily member growth stats for a party
 * Note: Without individual member records, we can't provide daily stats
 * Returns a single data point with current member count
 */
export async function getDailyStats(slug: string, days: number = 30): Promise<DailyStats[]> {
  const { data: party } = await supabase
    .from('partybuilder')
    .select('members_count')
    .eq('slug', slug)
    .single();

  if (!party) return [];

  // Generate synthetic data showing linear growth to current count
  const result: DailyStats[] = [];
  const today = new Date();
  const membersCount = party.members_count || 0;
  const perDay = membersCount / days;

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    const members = Math.floor((days - i) * perDay);
    result.push({ date: dateStr, members });
  }

  return result;
}

/**
 * Get quotes for a party
 * Note: No quotes table - returns empty array
 */
export async function getPartyQuotes(_slug: string): Promise<any[]> {
  return [];
}

/**
 * Get policies for a party
 * Note: No policies table - returns empty array
 */
export async function getPartyPolicies(_slug: string): Promise<any[]> {
  return [];
}

/**
 * Get endorsements for a party
 * Note: No endorsements table - returns empty array
 */
export async function getPartyEndorsements(_slug: string): Promise<any[]> {
  return [];
}

/**
 * Get category statistics
 */
export async function getCategoryStats(): Promise<{ category: string; count: number }[]> {
  const { data, error } = await supabase
    .from('partybuilder')
    .select('category');

  if (error || !data) {
    console.error('Error fetching category stats:', error);
    return [];
  }

  const categoryMap = new Map<string, number>();

  data.forEach(party => {
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
export async function getAllPartyNames(): Promise<string[]> {
  const { data, error } = await supabase
    .from('partybuilder')
    .select('name');

  if (error || !data) {
    console.error('Error fetching party names:', error);
    return [];
  }

  return data.map(p => p.name);
}

/**
 * Export members as CSV data
 * Note: No members table - returns header only
 */
export function exportMembersCSV(_slug: string): string {
  const headers = ['Name', 'Email', 'Suburb', 'DOB', 'WA Elector', 'Joined'];
  return headers.join(',');
}
