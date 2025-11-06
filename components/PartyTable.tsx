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
  onCreateClick?: () => void;
}

export default function PartyTable({ parties: initialParties, onCreateClick }: PartyTableProps) {
  // Sort parties by members count (descending)
  const [parties, setParties] = useState(
    [...initialParties].sort((a, b) => b.members_count - a.members_count)
  );

  const handleLike = async (e: React.MouseEvent, slug: string) => {
    e.preventDefault();
    e.stopPropagation();

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

  const handleRowClick = (party: PartyWithStats) => {
    if (party.members_count >= 500 && party.website) {
      // Registered party - go to their website
      window.open(party.website, '_blank', 'noopener,noreferrer');
    } else {
      // Non-registered party - go to party detail page
      window.location.href = `/p/${party.slug}`;
    }
  };

  // Helper function to get progress bar color based on member count
  const getProgressColor = (count: number) => {
    if (count >= 500) return 'from-green-400 to-green-600'; // Completed - green
    if (count >= 400) return 'from-orange-400 to-red-500'; // Hot - red zone
    if (count >= 250) return 'from-yellow-400 to-orange-500'; // Warm - orange zone
    return 'from-blue-400 to-blue-600'; // Starting - blue
  };

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th colSpan={5} className="px-3 py-3 text-left text-sm font-bold text-gray-900 border-b-2 border-gray-300">
              Current Registered Parties in WA
            </th>
          </tr>
          <tr>
            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Logo
            </th>
            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Party
            </th>
            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Category
            </th>
            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/2">
              Members
            </th>
            <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Likes
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {parties.length === 0 ? (
            <tr>
              <td colSpan={5} className="px-3 py-8 text-center text-gray-500">
                No parties yet. Be the first to create one!
              </td>
            </tr>
          ) : (
            parties.map((party, index) => {
              const prevParty = index > 0 ? parties[index - 1] : null;
              const showSeparator = prevParty && prevParty.members_count >= 500 && party.members_count < 500;
              const isRegistered = party.members_count >= 500;

              return (
                <>
                  {showSeparator && (
                    <tr key={`separator-${party.id}`}>
                      <td colSpan={5} className="px-0 py-0">
                        <div className="relative h-12 bg-gradient-to-r from-green-50 via-green-100 to-green-50 border-t-4 border-b-4 border-green-400">
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="bg-white px-6 py-2 text-base font-bold text-green-700 border-2 border-green-400 rounded-lg shadow-md">
                              ⬇ Potential Political Parties
                            </span>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                  <tr
                    key={party.id}
                    className={`hover:bg-gray-50 ${isRegistered ? 'cursor-pointer' : 'cursor-pointer'}`}
                    onClick={() => handleRowClick(party)}
                  >
                    <td className="px-3 py-2 whitespace-nowrap">
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${getPartyColor(party.name)} flex items-center justify-center text-white font-bold text-xs shadow-md`}>
                        {party.abbreviation || party.name.substring(0, 3).toUpperCase()}
                      </div>
                    </td>
                    <td className="px-3 py-2">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-900">
                          {party.name}
                        </span>
                        {party.abbreviation && (
                          <span className="text-xs text-gray-500">
                            {party.abbreviation}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700">
                        {party.category || 'Uncategorized'}
                      </span>
                    </td>
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden shadow-inner">
                          <div
                            className={`h-full transition-all duration-500 bg-gradient-to-r ${getProgressColor(party.members_count)}`}
                            style={{ width: `${Math.min(party.pct_to_500, 100)}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-600 min-w-[80px]">
                          {party.members_count} / 500
                        </span>
                        {party.members_count < 500 && (
                          <span className="text-xs font-semibold text-gray-700 min-w-[45px]">
                            {party.pct_to_500.toFixed(0)}%
                          </span>
                        )}
                        {party.members_count >= 500 && (
                          <span className="px-2 py-0.5 bg-green-100 text-green-800 rounded-full font-medium text-xs flex items-center gap-1 min-w-[85px]">
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            Registered
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={(e) => handleLike(e, party.slug)}
                          className="p-1 rounded-full hover:bg-gray-100 transition-colors group"
                          title="Like this party"
                        >
                          <svg className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                          </svg>
                        </button>
                        <span className="text-sm font-medium text-gray-700 min-w-[30px]">
                          {party.likes}
                        </span>
                      </div>
                    </td>
                  </tr>
                </>
              );
            })
          )}
          {/* Add your own party button row */}
          <tr className="bg-gray-50">
            <td colSpan={5} className="px-3 py-6 text-center">
              <button
                onClick={onCreateClick}
                className="inline-flex items-center gap-2 px-6 py-3 bg-white border-2 border-gray-300 text-gray-900 rounded-lg font-semibold hover:bg-gray-50 transition-all hover:scale-105 shadow-md"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Your Own Political Party
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
