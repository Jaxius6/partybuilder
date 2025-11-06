'use client';

/**
 * PartyTable Component
 * Displays list of parties in TWO separate tables: Registered and Potential
 */

import Link from 'next/link';
import { useState } from 'react';
import type { PartyWithStats } from '@/lib/types';

interface PartyTableProps {
  parties: PartyWithStats[];
  onCreateClick?: () => void;
}

export default function PartyTable({ parties: initialParties, onCreateClick }: PartyTableProps) {
  // Sort registered parties by seats (descending), then members
  const registeredUnsorted = [...initialParties].filter(p => p.members_count >= 500);
  const potentialUnsorted = [...initialParties].filter(p => p.members_count < 500);

  const [registeredParties, setRegisteredParties] = useState(
    registeredUnsorted.sort((a, b) => {
      // Sort by seats first (descending), then by members
      const seatsDiff = (b.elected_seats || 0) - (a.elected_seats || 0);
      if (seatsDiff !== 0) return seatsDiff;
      return b.members_count - a.members_count;
    })
  );
  const [potentialParties, setPotentialParties] = useState(
    potentialUnsorted.sort((a, b) => b.members_count - a.members_count)
  );

  const handleLike = async (e: React.MouseEvent, slug: string, isRegistered: boolean) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const response = await fetch(`/api/parties/${slug}/like`, {
        method: 'POST',
      });

      if (response.ok) {
        const data = await response.json();
        if (isRegistered) {
          setRegisteredParties(registeredParties.map(p =>
            p.slug === slug ? { ...p, likes: data.likes } : p
          ));
        } else {
          setPotentialParties(potentialParties.map(p =>
            p.slug === slug ? { ...p, likes: data.likes } : p
          ));
        }
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

  // Generate seat circles - one circle per elected MP/seat in parliament
  const generateSeatCircles = (electedSeats: number, partyName: string) => {
    const seats = [];

    // Use party color for all seats
    const partyColorClass = getPartyColor(partyName);

    for (let i = 0; i < electedSeats; i++) {
      seats.push(
        <div
          key={i}
          className={`w-7 h-7 rounded-full bg-gradient-to-br ${partyColorClass} border-2 border-white shadow-md -ml-1.5 first:ml-0 hover:scale-110 transition-transform cursor-pointer flex items-center justify-center`}
          title={`Seat ${i + 1}`}
        >
          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
          </svg>
        </div>
      );
    }

    return seats;
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
    if (count >= 400) return 'from-orange-400 to-red-500'; // Hot - red zone
    if (count >= 250) return 'from-yellow-400 to-orange-500'; // Warm - orange zone
    return 'from-blue-400 to-blue-600'; // Starting - blue
  };

  return (
    <div className="space-y-8">
      {/* REGISTERED PARTIES TABLE */}
      {registeredParties.length > 0 && (
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-6 py-3 border-b border-green-200">
            <h3 className="text-lg font-bold text-green-900 flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Registered Parties
              <span className="text-sm font-normal text-green-700">({registeredParties.length})</span>
            </h3>
          </div>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Logo
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Party
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Secretary
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/3">
                  Parliamentary Seats
                </th>
                <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
                <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Likes
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {registeredParties.map((party) => (
                <tr
                  key={party.id}
                  className="hover:bg-green-50 transition-colors"
                >
                  <td className="px-3 py-2 whitespace-nowrap">
                    <div className={`w-6 h-6 rounded-lg bg-gradient-to-br ${getPartyColor(party.name)} flex items-center justify-center text-white font-bold text-[9px] shadow-md`}>
                      {party.abbreviation || party.name.substring(0, 3).toUpperCase()}
                    </div>
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex flex-col">
                      <a
                        href={`/p/${party.slug}`}
                        className="text-base font-bold text-gray-900 hover:text-green-600 transition-colors cursor-pointer"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {party.name}
                      </a>
                      {party.abbreviation && (
                        <span className="text-xs text-gray-500">
                          {party.abbreviation}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    <span className="text-xs text-gray-600">
                      {party.secretary_name || 'Not listed'}
                    </span>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700">
                      {party.category || 'Uncategorized'}
                    </span>
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-2">
                      {party.elected_seats && party.elected_seats > 0 ? (
                        <>
                          <div className="flex items-center">
                            {generateSeatCircles(party.elected_seats, party.name)}
                          </div>
                          <span className="text-sm font-medium text-gray-700">
                            {party.elected_seats} {party.elected_seats === 1 ? 'seat' : 'seats'}
                          </span>
                        </>
                      ) : (
                        <span className="text-xs text-gray-400">
                          Registered but have no seats
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (party.website) {
                          window.open(party.website, '_blank', 'noopener,noreferrer');
                        }
                      }}
                      className="px-3 py-1 bg-green-600 text-white text-xs font-semibold rounded-lg hover:bg-green-700 transition-colors shadow-sm"
                    >
                      Join
                    </button>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={(e) => handleLike(e, party.slug, true)}
                        className="p-1 rounded-full hover:bg-green-100 transition-all group hover:scale-125 active:scale-150"
                        title="Like this party"
                      >
                        <svg className="w-4 h-4 text-gray-400 group-hover:text-green-600 transition-colors" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                        </svg>
                      </button>
                      <span className="text-sm font-medium text-gray-700 min-w-[30px]">
                        {party.likes}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* POTENTIAL PARTIES TABLE */}
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-3 border-b border-blue-200">
          <h3 className="text-lg font-bold text-blue-900 flex items-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
            </svg>
            Potential Parties
            <span className="text-sm font-normal text-blue-700">({potentialParties.length})</span>
          </h3>
        </div>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Logo
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Party
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Secretary
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/3">
                Progress to 500
              </th>
              <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Action
              </th>
              <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Likes
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {potentialParties.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-3 py-8 text-center text-gray-500">
                  No potential parties yet. Be the first to create one!
                </td>
              </tr>
            ) : (
              potentialParties.map((party) => (
                <tr
                  key={party.id}
                  className="hover:bg-blue-50 transition-colors"
                >
                  <td className="px-3 py-2 whitespace-nowrap">
                    <div className={`w-6 h-6 rounded-lg bg-gradient-to-br ${getPartyColor(party.name)} flex items-center justify-center text-white font-bold text-[9px] shadow-md`}>
                      {party.abbreviation || party.name.substring(0, 3).toUpperCase()}
                    </div>
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex flex-col">
                      <a
                        href={`/p/${party.slug}`}
                        className="text-base font-bold text-gray-900 hover:text-blue-600 transition-colors cursor-pointer"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {party.name}
                      </a>
                      {party.abbreviation && (
                        <span className="text-xs text-gray-500">
                          {party.abbreviation}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    <span className="text-xs text-gray-600">
                      {party.secretary_name || 'Not listed'}
                    </span>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700">
                      {party.category || 'Uncategorized'}
                    </span>
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden shadow-inner">
                        <div
                          className={`h-full transition-all duration-500 bg-gradient-to-r ${getProgressColor(party.members_count)}`}
                          style={{ width: `${Math.min(party.pct_to_500, 100)}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-600 min-w-[80px]">
                        {party.members_count} / 500
                      </span>
                      <span className="text-xs font-semibold text-gray-700 min-w-[45px]">
                        {party.pct_to_500.toFixed(0)}%
                      </span>
                    </div>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        window.location.href = `/p/${party.slug}`;
                      }}
                      className="px-3 py-1 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                    >
                      Join
                    </button>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={(e) => handleLike(e, party.slug, false)}
                        className="p-1 rounded-full hover:bg-blue-100 transition-all group hover:scale-125 active:scale-150"
                        title="Like this party"
                      >
                        <svg className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                        </svg>
                      </button>
                      <span className="text-sm font-medium text-gray-700 min-w-[30px]">
                        {party.likes}
                      </span>
                    </div>
                  </td>
                </tr>
              ))
            )}
            {/* Add your own party button row */}
            <tr className="bg-gradient-to-r from-gray-50 to-slate-50">
              <td colSpan={7} className="px-3 py-6 text-center">
                <button
                  onClick={onCreateClick}
                  className="group relative inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-600 text-white rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110 hover:-translate-y-1 active:scale-105 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <svg className="w-6 h-6 relative z-10 group-hover:rotate-90 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                  <span className="relative z-10">Create New Party</span>
                  <div className="absolute inset-0 -z-10 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
