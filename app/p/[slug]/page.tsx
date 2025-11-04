'use client';

/**
 * Party Detail Page
 * Shows detailed information about a party
 */

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import ProgressBar from '@/components/ProgressBar';
import MiniLine from '@/components/MiniLine';
import Countdown from '@/components/Countdown';
import { timeAgo } from '@/lib/util';
import type { PartyWithStats, Member, DailyStats } from '@/lib/types';

export default function PartyPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [party, setParty] = useState<PartyWithStats | null>(null);
  const [recentMembers, setRecentMembers] = useState<Member[]>([]);
  const [dailyStats, setDailyStats] = useState<DailyStats[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isJoining, setIsJoining] = useState(false);
  const [showJoinForm, setShowJoinForm] = useState(false);
  const [joinError, setJoinError] = useState('');

  const [joinForm, setJoinForm] = useState({
    full_name: '',
    email: '',
    suburb: '',
    dob: '',
    is_wa_elector: false,
  });

  const electionDate = process.env.NEXT_PUBLIC_ELECTION_DATE || '2029-03-08';

  useEffect(() => {
    fetchParty();
  }, [slug]);

  const fetchParty = async () => {
    try {
      const response = await fetch(`/api/parties/${slug}`);
      if (!response.ok) throw new Error('Party not found');

      const data = await response.json();
      setParty(data.party);
      setRecentMembers(data.recentMembers || []);
      setDailyStats(data.dailyStats || []);
    } catch (error) {
      console.error('Error fetching party:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLike = async () => {
    try {
      const response = await fetch(`/api/parties/${slug}/like`, {
        method: 'POST',
      });

      if (response.ok) {
        const data = await response.json();
        if (party) {
          setParty({ ...party, likes: data.likes });
        }
      }
    } catch (error) {
      console.error('Error liking party:', error);
    }
  };

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsJoining(true);
    setJoinError('');

    try {
      const response = await fetch(`/api/parties/${slug}/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(joinForm),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.errors) {
          const errorMessages = Object.values(data.errors).join(', ');
          setJoinError(errorMessages);
        } else {
          setJoinError(data.error || 'Failed to join party');
        }
        setIsJoining(false);
        return;
      }

      // Success! Refresh party data
      setShowJoinForm(false);
      setJoinForm({
        full_name: '',
        email: '',
        suburb: '',
        dob: '',
        is_wa_elector: false,
      });
      await fetchParty();
    } catch (error) {
      console.error('Error joining party:', error);
      setJoinError('An unexpected error occurred');
    } finally {
      setIsJoining(false);
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: party?.name || 'Party',
          text: party?.slogan || 'Join this party on PartyBuilder',
          url,
        });
      } catch (error) {
        // User cancelled share
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(url);
      alert('Link copied to clipboard!');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="inline-block w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!party) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Party Not Found</h1>
          <Link href="/" className="text-blue-600 hover:text-blue-800">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  const statusColors: { [key: string]: string } = {
    DRAFT: 'bg-gray-100 text-gray-800',
    PREP: 'bg-yellow-100 text-yellow-800',
    SUBMITTED: 'bg-blue-100 text-blue-800',
    GAZETTE_NOTICE: 'bg-purple-100 text-purple-800',
    OBJECTION_WINDOW: 'bg-orange-100 text-orange-800',
    REGISTERED: 'bg-green-100 text-green-800',
    REJECTED: 'bg-red-100 text-red-800',
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/" className="text-blue-600 hover:text-blue-800 text-sm">
            ← Back to All Parties
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Party Header */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                {party.name}
              </h1>
              {party.abbreviation && (
                <p className="text-xl text-gray-600 mb-4">({party.abbreviation})</p>
              )}
              {party.slogan && (
                <p className="text-lg text-gray-700 italic mb-4">&quot;{party.slogan}&quot;</p>
              )}

              <div className="flex flex-wrap gap-2 mb-4">
                {party.category && (
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                    {party.category}
                  </span>
                )}
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[party.waec_status]}`}>
                  {party.waec_status.replace(/_/g, ' ')}
                </span>
              </div>

              {party.website && (
                <a
                  href={party.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  Visit Website →
                </a>
              )}
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={handleLike}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                </svg>
                {party.likes} Likes
              </button>

              <button
                onClick={handleShare}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Share
              </button>

              <button
                onClick={() => setShowJoinForm(!showJoinForm)}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
              >
                Join Party
              </button>
            </div>
          </div>
        </div>

        {/* Progress Section */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Membership Progress
          </h2>
          <ProgressBar current={party.members_count} goal={500} />
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Join Form */}
            {showJoinForm && (
              <div className="bg-white rounded-lg shadow-lg p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Join {party.name}</h3>
                {joinError && (
                  <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                    {joinError}
                  </div>
                )}
                <form onSubmit={handleJoin} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={joinForm.full_name}
                      onChange={(e) => setJoinForm({ ...joinForm, full_name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      value={joinForm.email}
                      onChange={(e) => setJoinForm({ ...joinForm, email: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Suburb
                    </label>
                    <input
                      type="text"
                      value={joinForm.suburb}
                      onChange={(e) => setJoinForm({ ...joinForm, suburb: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      value={joinForm.dob}
                      onChange={(e) => setJoinForm({ ...joinForm, dob: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="is_wa_elector"
                      checked={joinForm.is_wa_elector}
                      onChange={(e) => setJoinForm({ ...joinForm, is_wa_elector: e.target.checked })}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="is_wa_elector" className="ml-2 text-sm text-gray-700">
                      I am a registered WA elector
                    </label>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowJoinForm(false)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                      disabled={isJoining}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={isJoining}
                    >
                      {isJoining ? 'Joining...' : 'Join Now'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* WAEC Status Panel */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">WAEC Registration Status</h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Status:</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[party.waec_status]}`}>
                    {party.waec_status.replace(/_/g, ' ')}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Application Fee Paid:</span>
                  <span className={`px-3 py-1 rounded-full text-sm ${party.app_fee_paid ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                    {party.app_fee_paid ? 'Yes' : 'No'}
                  </span>
                </div>

                {party.application_submitted_at && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Submitted:</span>
                    <span className="text-sm text-gray-900">{new Date(party.application_submitted_at).toLocaleDateString()}</span>
                  </div>
                )}

                {party.gazette_notice_date && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Gazette Notice:</span>
                    <span className="text-sm text-gray-900">{new Date(party.gazette_notice_date).toLocaleDateString()}</span>
                  </div>
                )}

                {party.objection_deadline && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Objection Deadline:</span>
                    <span className="text-sm text-gray-900">{new Date(party.objection_deadline).toLocaleDateString()}</span>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Objections:</span>
                  <span className="text-sm text-gray-900">{party.objections_count}</span>
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  After submission, WAEC publishes a Gazette notice and opens a 1-month objection window before decision.
                </p>
              </div>
            </div>

            {/* Checklist */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Registration Checklist</h3>
              <div className="space-y-3">
                {[
                  { label: 'Bank Account', checked: party.has_bank_account },
                  { label: 'Executive Committee', checked: party.has_exec },
                  { label: 'Constitution', checked: party.has_constitution },
                  { label: 'Website', checked: party.has_website },
                  { label: 'Facebook Page', checked: party.has_facebook },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded flex items-center justify-center ${item.checked ? 'bg-green-500' : 'bg-gray-200'}`}>
                      {item.checked && (
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <span className={`text-sm ${item.checked ? 'text-gray-900 font-medium' : 'text-gray-600'}`}>
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Export CSV */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Export Members</h3>
              <p className="text-sm text-gray-600 mb-4">
                Download a CSV file of all party members for WAEC submission.
              </p>
              <a
                href={`/api/parties/${slug}/export.csv`}
                className="inline-block px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold"
              >
                Download CSV
              </a>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-8">
            {/* Countdown */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Election Countdown</h3>
              <Countdown targetDate={electionDate} className="w-full justify-center" />
            </div>

            {/* Member Growth Chart */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Member Growth</h3>
              {dailyStats.length > 0 ? (
                <MiniLine
                  data={dailyStats.map(s => ({ date: s.date, value: s.members }))}
                  width={280}
                  height={150}
                />
              ) : (
                <p className="text-center text-gray-500 py-8">No data yet</p>
              )}
            </div>

            {/* Recent Members */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Members</h3>
              {recentMembers.length > 0 ? (
                <div className="space-y-3">
                  {recentMembers.map((member) => (
                    <div key={member.id} className="border-b border-gray-100 pb-3 last:border-0">
                      <p className="text-sm font-medium text-gray-900">{member.full_name}</p>
                      {member.suburb && (
                        <p className="text-xs text-gray-600">{member.suburb}</p>
                      )}
                      <p className="text-xs text-gray-500">{timeAgo(member.created_at)}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500 py-4">No members yet</p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
