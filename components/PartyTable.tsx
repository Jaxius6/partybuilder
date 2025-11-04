'use client';

/**
 * PartyTable Component
 * Displays list of parties in a table format
 */

import Link from 'next/link';
import type { PartyWithStats } from '@/lib/types';

interface PartyTableProps {
  parties: PartyWithStats[];
}

export default function PartyTable({ parties }: PartyTableProps) {
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              #
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Party
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Category
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Likes
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Members
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              % of 500
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {parties.length === 0 ? (
            <tr>
              <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                No parties yet. Be the first to create one!
              </td>
            </tr>
          ) : (
            parties.map((party, index) => (
              <tr key={party.id} className="hover:bg-gray-50">
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                  {index + 1}
                </td>
                <td className="px-4 py-4">
                  <div className="flex flex-col">
                    <Link
                      href={`/p/${party.slug}`}
                      className="text-sm font-medium text-blue-600 hover:text-blue-800"
                    >
                      {party.name}
                    </Link>
                    {party.abbreviation && (
                      <span className="text-xs text-gray-500">
                        {party.abbreviation}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">
                    {party.category || 'Uncategorized'}
                  </span>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                  {party.likes}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                  {party.members_count}
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 max-w-[100px] h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${
                          party.members_count >= 500 ? 'bg-green-500' : 'bg-blue-500'
                        }`}
                        style={{ width: `${Math.min(party.pct_to_500, 100)}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-600 min-w-[45px]">
                      {party.pct_to_500.toFixed(1)}%
                    </span>
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm">
                  <Link
                    href={`/p/${party.slug}`}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    View / Join
                  </Link>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
