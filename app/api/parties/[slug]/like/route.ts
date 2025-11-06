/**
 * API Route for liking a party
 * POST /api/parties/[slug]/like
 */

import { NextRequest, NextResponse } from 'next/server';
import { likeParty } from '@/lib/store';

/**
 * POST /api/parties/[slug]/like
 * Like a party (increment likes counter)
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;

    // TODO: Add cookie-based throttling to prevent spam
    // For MVP, we'll allow unlimited likes

    const party = await likeParty(slug);

    if (!party) {
      return NextResponse.json(
        { error: 'Party not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ likes: party.likes });
  } catch (error) {
    console.error('Error liking party:', error);
    return NextResponse.json(
      { error: 'Failed to like party' },
      { status: 500 }
    );
  }
}
