/**
 * API Route for exporting party members as CSV
 * GET /api/parties/[slug]/export.csv
 */

import { NextRequest, NextResponse } from 'next/server';
import { getParty, exportMembersCSV } from '@/lib/store';

/**
 * GET /api/parties/[slug]/export.csv
 * Export party members as CSV file
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;

    // Check if party exists
    const party = getParty(slug);
    if (!party) {
      return NextResponse.json(
        { error: 'Party not found' },
        { status: 404 }
      );
    }

    // Generate CSV
    const csv = exportMembersCSV(slug);

    // Return CSV with appropriate headers
    return new NextResponse(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="${slug}-members.csv"`,
      },
    });
  } catch (error) {
    console.error('Error exporting members:', error);
    return NextResponse.json(
      { error: 'Failed to export members' },
      { status: 500 }
    );
  }
}
