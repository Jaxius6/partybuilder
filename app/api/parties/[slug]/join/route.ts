/**
 * API Route for joining a party
 * POST /api/parties/[slug]/join
 */

import { NextRequest, NextResponse } from 'next/server';
import { joinParty } from '@/lib/store';
import { validateMemberInput } from '@/lib/validate';

/**
 * POST /api/parties/[slug]/join
 * Join a party as a member
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;
    const body = await request.json();

    // Validate input
    const validation = validateMemberInput(body);

    if (!validation.ok) {
      return NextResponse.json(
        { error: 'Validation failed', errors: validation.errors },
        { status: 400 }
      );
    }

    // Join party
    const member = joinParty(slug, body);

    if (!member) {
      return NextResponse.json(
        { error: 'Party not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ member }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message.includes('already registered')) {
      return NextResponse.json(
        { error: error.message },
        { status: 409 }
      );
    }

    console.error('Error joining party:', error);
    return NextResponse.json(
      { error: 'Failed to join party' },
      { status: 500 }
    );
  }
}
