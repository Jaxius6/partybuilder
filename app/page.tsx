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
              {/* Logo - Modern Political Building Icon */}
              <div className="relative w-16 h-16 bg-gradient-to-br from-indigo-600 via-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl flex-shrink-0 border-2 border-white ring-2 ring-indigo-200">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-white/10 to-transparent"></div>
                <svg className="w-10 h-10 text-white relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                  {/* Parliament/Building with people */}
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  <circle cx="8" cy="14" r="1.5" fill="currentColor" />
                  <circle cx="12" cy="14" r="1.5" fill="currentColor" />
                  <circle cx="16" cy="14" r="1.5" fill="currentColor" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v4" strokeWidth="2" />
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
            className="group relative inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-600 text-white rounded-lg font-bold text-sm shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 hover:-translate-y-0.5 active:scale-100 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <svg className="w-5 h-5 relative z-10 group-hover:rotate-90 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            <span className="relative z-10">Create New Party</span>
            <div className="absolute inset-0 -z-10 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
          </button>
        </div>

        {/* Parties Tables */}
        {isLoading ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <div className="inline-block w-8 h-8 border-4 border-gray-500 border-t-transparent rounded-full animate-spin" />
            <p className="mt-4 text-gray-600">Loading parties...</p>
          </div>
        ) : (
          <PartyTable parties={parties} onCreateClick={() => setIsModalOpen(true)} />
        )}
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
