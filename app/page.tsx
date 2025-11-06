'use client';

/**
 * Home Page
 * Lists all parties with stats and allows creating new parties
 */

import { useEffect, useState } from 'react';
import PartyTable from '@/components/PartyTable';
import CreatePartyModal from '@/components/CreatePartyModal';
import Countdown from '@/components/Countdown';
import type { PartyWithStats } from '@/lib/types';

export default function Home() {
  const [parties, setParties] = useState<PartyWithStats[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedState, setSelectedState] = useState('WA');

  const electionDate = process.env.NEXT_PUBLIC_ELECTION_DATE || '2029-03-08';

  useEffect(() => {
    fetchParties();
  }, []);

  const fetchParties = async () => {
    try {
      const response = await fetch('/api/parties');
      const data = await response.json();
      setParties(data.parties || []);
    } catch (error) {
      console.error('Error fetching parties:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              {/* Logo - Better Community Icon */}
              <div className="relative w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0 border-2 border-gray-300">
                <svg className="w-10 h-10 text-gray-700" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/>
                </svg>
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
        {/* Hero CTA - Compact */}
        <div className="mb-4 bg-white border border-gray-200 rounded-lg shadow-sm p-4 text-center">
          <h2 className="text-lg font-bold text-gray-900 mb-1">
            Start Your Political Journey
          </h2>
          <p className="text-xs text-gray-600 mb-3 max-w-2xl mx-auto">
            Create a political party, gather 500 members, and prepare for WAEC registration
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-5 py-1.5 bg-gray-100 text-gray-900 rounded-lg font-semibold text-xs hover:bg-gray-200 transition-all border border-gray-300"
          >
            + Create New Party
          </button>
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
                <div className="inline-block w-8 h-8 border-4 border-gray-500 border-t-transparent rounded-full animate-spin" />
                <p className="mt-4 text-gray-600">Loading parties...</p>
              </div>
            ) : (
              <PartyTable parties={parties} onCreateClick={() => setIsModalOpen(true)} />
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
