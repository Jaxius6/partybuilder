/**
 * API Routes for parties
 * GET /api/parties - List all parties
 * POST /api/parties - Create a new party
 */

import { NextRequest, NextResponse } from 'next/server';
import { listParties, createParty, getAllPartyNames } from '@/lib/store';
import { validatePartyInput } from '@/lib/validate';

/**
 * GET /api/parties
 * List all parties with stats
 */
export async function GET() {
  try {
    const parties = listParties();
    return NextResponse.json({ parties });
  } catch (error) {
    console.error('Error listing parties:', error);
    return NextResponse.json(
      { error: 'Failed to list parties' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/parties
 * Create a new party
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Get existing party names for validation
    const existingNames = getAllPartyNames();

    // Validate input
    const validation = validatePartyInput(body, existingNames);

    if (!validation.ok) {
      return NextResponse.json(
        { error: 'Validation failed', errors: validation.errors },
        { status: 400 }
      );
    }

    // Create party with formatted name
    const party = createParty({
      ...body,
      name: validation.data!.formattedName,
    });

    return NextResponse.json({ party }, { status: 201 });
  } catch (error) {
    console.error('Error creating party:', error);
    return NextResponse.json(
      { error: 'Failed to create party' },
      { status: 500 }
    );
  }
}
