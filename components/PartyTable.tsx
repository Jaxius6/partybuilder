'use client';

/**
 * PartyTable Component
 * Displays list of parties in a table format
 */

import Link from 'next/link';
import { useState } from 'react';
import type { PartyWithStats } from '@/lib/types';

interface PartyTableProps {
  parties: PartyWithStats[];
}

export default function PartyTable({ parties: initialParties }: PartyTableProps) {
  // Sort parties by members count (descending)
  const [parties, setParties] = useState(
    [...initialParties].sort((a, b) => b.members_count - a.members_count)
  );

  const handleLike = async (slug: string, currentLikes: number) => {
    try {
      const response = await fetch(`/api/parties/${slug}/like`, {
        method: 'POST',
      });

      if (response.ok) {
        const data = await response.json();
        setParties(parties.map(p =>
          p.slug === slug ? { ...p, likes: data.likes } : p
        ));
      }
    } catch (error) {
      console.error('Error liking party:', error);
    }
  };

  // Generate unique color for each party based on name
  const getPartyColor = (name: string) => {
    const colors = [
      'from-red-400 to-red-600',
      'from-blue-400 to-blue-600',
      'from-green-400 to-green-600',
      'from-yellow-400 to-yellow-600',
      'from-purple-400 to-purple-600',
      'from-pink-400 to-pink-600',
      'from-indigo-400 to-indigo-600',
      'from-orange-400 to-orange-600',
      'from-teal-400 to-teal-600',
      'from-cyan-400 to-cyan-600',
    ];
    const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              #
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Logo
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
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/3">
              Members Progress
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {parties.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                No parties yet. Be the first to create one!
              </td>
            </tr>
          ) : (
            parties.map((party, index) => {
              const prevParty = index > 0 ? parties[index - 1] : null;
              const showSeparator = prevParty && prevParty.members_count >= 500 && party.members_count < 500;

              return (
                <>
                  {showSeparator && (
                    <tr key={`separator-${party.id}`}>
                      <td colSpan={6} className="px-0 py-0">
                        <div className="relative h-1">
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-green-500 to-transparent opacity-50"></div>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="bg-white px-4 py-1 text-xs font-bold text-green-600 border-2 border-green-500 rounded-full shadow-lg">
                              500 Member WAEC Threshold
                            </span>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                  <tr key={party.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      {index + 1}
                    </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${getPartyColor(party.name)} flex items-center justify-center text-white font-bold text-sm shadow-md border-2 border-white`}>
                    {party.abbreviation || party.name.substring(0, 3).toUpperCase()}
                  </div>
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
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleLike(party.slug, party.likes)}
                      className="p-1.5 rounded-full hover:bg-blue-50 transition-colors group"
                      title="Like this party"
                    >
                      <svg className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                      </svg>
                    </button>
                    <span className="text-sm font-medium text-gray-700 min-w-[30px]">
                      {party.likes}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-6 bg-gray-200 rounded-full overflow-hidden shadow-inner">
                        <div
                          className={`h-full transition-all duration-500 ${
                            party.members_count >= 500
                              ? 'bg-gradient-to-r from-green-400 to-green-600'
                              : 'bg-gradient-to-r from-blue-400 to-blue-600'
                          }`}
                          style={{ width: `${Math.min(party.pct_to_500, 100)}%` }}
                        />
                      </div>
                      <span className="text-sm font-semibold text-gray-700 min-w-[55px]">
                        {party.pct_to_500.toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-600">
                      <span>{party.members_count} members</span>
                      {party.members_count >= 500 ? (
                        <span className="px-2 py-0.5 bg-green-100 text-green-800 rounded-full font-medium">
                          ✓ Registered
                        </span>
                      ) : (
                        <span className="text-gray-500">
                          {500 - party.members_count} needed
                        </span>
                      )}
                    </div>
                  </div>
                </td>
              </tr>
                </>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
