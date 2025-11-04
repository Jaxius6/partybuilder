'use client';

/**
 * Home Page
 * Lists all parties with stats and allows creating new parties
 */

import { useEffect, useState } from 'react';
import PartyTable from '@/components/PartyTable';
import CreatePartyModal from '@/components/CreatePartyModal';
import Countdown from '@/components/Countdown';
import MiniPie from '@/components/MiniPie';
import type { PartyWithStats } from '@/lib/types';

export default function Home() {
  const [parties, setParties] = useState<PartyWithStats[]>([]);
  const [categoryStats, setCategoryStats] = useState<{ category: string; count: number }[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedState, setSelectedState] = useState('WA');

  const electionDate = process.env.NEXT_PUBLIC_ELECTION_DATE || '2029-03-08';

  // WA Legislative Council seat distribution (36 seats total)
  const legislativeCouncilSeats = [
    { label: 'WA Labor', value: 14 },
    { label: 'Liberal Party Western Australia', value: 9 },
    { label: 'The Greens (WA) Inc', value: 4 },
    { label: 'The Nationals WA', value: 3 },
    { label: 'Legalise Cannabis Party WA', value: 2 },
    { label: "Pauline Hanson's One Nation", value: 2 },
    { label: 'Daylight Saving Party', value: 1 },
    { label: 'Independent/Others', value: 1 },
  ];

  useEffect(() => {
    fetchParties();
  }, []);

  const fetchParties = async () => {
    try {
      const response = await fetch('/api/parties');
      const data = await response.json();
      setParties(data.parties || []);

      // Calculate category stats
      const categoryMap = new Map<string, number>();
      (data.parties || []).forEach((party: PartyWithStats) => {
        const cat = party.category || 'Uncategorized';
        categoryMap.set(cat, (categoryMap.get(cat) || 0) + 1);
      });

      const stats = Array.from(categoryMap.entries())
        .map(([category, count]) => ({ category, count }))
        .sort((a, b) => b.count - a.count);

      setCategoryStats(stats);
    } catch (error) {
      console.error('Error fetching parties:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const totalParties = parties.length;
  const totalMembers = parties.reduce((sum, p) => sum + p.members_count, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              {/* Logo - Ballot Box with Star */}
              <div className="relative w-16 h-16 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0 transform hover:rotate-6 transition-transform">
                <div className="absolute inset-0 bg-white opacity-20 rounded-2xl"></div>
                <div className="relative">
                  <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2L9.19 8.63L2 9.24l5.46 4.73L5.82 21L12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2z"/>
                  </svg>
                </div>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  PartyBuilder.com.au
                </h1>
                <div className="mt-2 flex flex-col sm:flex-row sm:items-center gap-2">
                  <p className="text-sm text-gray-600">
                    Start your own political party in
                  </p>
                  <select
                    value={selectedState}
                    onChange={(e) => setSelectedState(e.target.value)}
                    className="text-sm px-3 py-1 border border-gray-300 rounded-lg bg-white text-gray-900 font-medium hover:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="WA">Western Australia</option>
                    <option value="NSW" disabled>New South Wales (Coming Soon)</option>
                    <option value="VIC" disabled>Victoria (Coming Soon)</option>
                    <option value="QLD" disabled>Queensland (Coming Soon)</option>
                    <option value="SA" disabled>South Australia (Coming Soon)</option>
                    <option value="TAS" disabled>Tasmania (Coming Soon)</option>
                    <option value="ACT" disabled>ACT (Coming Soon)</option>
                    <option value="NT" disabled>Northern Territory (Coming Soon)</option>
                  </select>
                </div>
              </div>
            </div>
            <Countdown targetDate={electionDate} />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero CTA */}
        <div className="mb-8 bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 rounded-2xl shadow-xl p-10 text-white text-center">
          <h2 className="text-4xl font-bold mb-3">
            Start Your Political Journey
          </h2>
          <p className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
            Create a political party, gather 500 members, and prepare for WAEC registration
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-8 py-4 bg-white text-blue-600 rounded-xl font-bold text-lg hover:bg-blue-50 transition-all hover:scale-105 shadow-lg"
          >
            + Create New Party
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Legislative Council Seats Chart */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              WA Legislative Council Seats
            </h2>
            <MiniPie data={legislativeCouncilSeats} />
            <p className="text-sm text-gray-600 mt-6 text-center">
              Current distribution of 36 seats in the Upper House
            </p>
          </div>

          {/* Stats Summary */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Platform Statistics
            </h2>
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                <div>
                  <div className="text-sm text-gray-600">Total Parties</div>
                  <div className="text-4xl font-bold text-blue-600">{totalParties}</div>
                </div>
                <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                  </svg>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                <div>
                  <div className="text-sm text-gray-600">Total Members</div>
                  <div className="text-4xl font-bold text-green-600">{totalMembers.toLocaleString()}</div>
                </div>
                <div className="w-16 h-16 rounded-full bg-green-600 flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                  </svg>
                </div>
              </div>
              <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border-2 border-purple-200">
                <div className="text-sm text-purple-700 font-medium mb-1">Registration Threshold</div>
                <div className="text-lg text-purple-900">
                  <span className="font-bold text-2xl">{parties.filter(p => p.members_count >= 500).length}</span> parties ready for WAEC
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Parties Table */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              All Parties
            </h2>
          </div>
          <div className="p-6">
            {isLoading ? (
              <div className="text-center py-12">
                <div className="inline-block w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                <p className="mt-4 text-gray-600">Loading parties...</p>
              </div>
            ) : (
              <PartyTable parties={parties} />
            )}
          </div>
        </div>
      </main>

      {/* Create Party Modal */}
      <CreatePartyModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          fetchParties(); // Refresh on close
        }}
      />
    </div>
  );
}
