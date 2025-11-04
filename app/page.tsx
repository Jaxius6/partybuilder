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
            <Countdown targetDate={electionDate} />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats and Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Legislative Council Seats Chart */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              WA Legislative Council Seats
            </h2>
            <MiniPie data={legislativeCouncilSeats} />
            <p className="text-xs text-gray-500 mt-4 text-center">
              Current distribution of 36 seats
            </p>
          </div>

          {/* Create Party CTA */}
          <div className="lg:col-span-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow p-8 text-white">
            <h2 className="text-2xl font-bold mb-2">
              Start Your Political Journey
            </h2>
            <p className="mb-6 text-blue-100">
              Create a political party, gather 500 members, and prepare for WAEC registration.
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
            >
              + Create New Party
            </button>
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
