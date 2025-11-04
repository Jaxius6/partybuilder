/**
 * API Routes for individual party
 * GET /api/parties/[slug] - Get party details
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  getParty,
  getRecentMembers,
  getPartyQuotes,
  getPartyPolicies,
  getPartyEndorsements,
  getDailyStats,
} from '@/lib/store';

/**
 * GET /api/parties/[slug]
 * Get party details with members, quotes, policies, etc.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;

    const party = getParty(slug);
    if (!party) {
      return NextResponse.json(
        { error: 'Party not found' },
        { status: 404 }
      );
    }

    // Get additional data
    const recentMembers = getRecentMembers(slug, 10);
    const quotes = getPartyQuotes(slug);
    const policies = getPartyPolicies(slug);
    const endorsements = getPartyEndorsements(slug);
    const dailyStats = getDailyStats(slug, 30);

    return NextResponse.json({
      party,
      recentMembers,
      quotes,
      policies,
      endorsements,
      dailyStats,
    });
  } catch (error) {
    console.error('Error getting party:', error);
    return NextResponse.json(
      { error: 'Failed to get party' },
      { status: 500 }
    );
  }
}
