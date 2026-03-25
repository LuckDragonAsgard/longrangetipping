'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApp } from '@/lib/store';
import { AFL_2026_FIXTURE, ROUND_SUMMARY, TOTAL_GAMES } from '@/lib/fixture-data';

export default function DashboardPage() {
  const router = useRouter();
  const { user, comps, tips, joinComp } = useApp();
  const [inviteCode, setInviteCode] = useState('');
  const [joinError, setJoinError] = useState('');
  const [joinSuccess, setJoinSuccess] = useState(false);

  // Calculate comprehensive stats from real state
  const stats = useMemo(() => {
    if (!user || !user.isLoggedIn) return null;

    // Count total tips entered across all comps
    const totalTips = Object.values(tips).reduce((sum, compTips) => sum + Object.keys(compTips).length, 0);

    // Count completed games
    const gamesCompleted = AFL_2026_FIXTURE.filter(g => g.complete).length;

    // Calculate season progress as percentage of rounds completed
    const completedRounds = ROUND_SUMMARY.filter(r => r.completed > 0).length;
    const totalRounds = ROUND_SUMMARY.length;
    const seasonProgress = Math.round((completedRounds / totalRounds) * 100);

    return {
      activeComps: comps.length,
      totalTips,
      gamesCompleted,
      seasonProgress,
      completedRounds,
      totalRounds,
    };
  }, [user, comps, tips]);

  // Count tips per comp for each user's comps
  const getTipsForComp = (compId: string): number => {
    return Object.keys(tips[compId] || {}).length;
  };

  // Calculate user's rank in a comp based on member position
  const getUserRank = (compId: string): number | string => {
    const comp = comps.find(c => c.id === compId);
    if (!comp || !user) return '-';
    const memberIndex = comp.members.findIndex(m => m.user_id === user.id);
    return memberIndex === -1 ? '-' : memberIndex + 1;
  };

  // Handle join comp logic
  const handleJoinComp = () => {
    if (!inviteCode.trim()) {
      setJoinError('Please enter a code');
      return;
    }

    // Find comp by invite code
    const targetComp = comps.find(c => c.invite_code.toUpperCase() === inviteCode.toUpperCase());

    if (!targetComp) {
      setJoinError('Comp not found. Check your invite code.');
      return;
    }

    // Check if already a member
    if (user && targetComp.members.some(m => m.user_id === user.id)) {
      setJoinError("You're already a member of this comp!");
      return;
    }

    // Join the comp
    if (targetComp.id) {
      joinComp(targetComp.id);
      setJoinSuccess(true);
      setInviteCode('');
      setJoinError('');

      // Reset success message after 3 seconds
      setTimeout(() => {
        setJoinSuccess(false);
      }, 3000);
    }
  };

  // Show login prompt if not logged in
  if (!user || !user.isLoggedIn) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center py-16">
          <div className="text-6xl mb-6">🔐</div>
          <h1 className="text-4xl font-bold mb-4">You need to log in</h1>
          <p className="text-[#a0a0cc] mb-8 max-w-md mx-auto">
            Create an account or log in to access your dashboard, join comps, and start tipping on AFL games.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/login" className="btn-primary">
              Log In
            </Link>
            <Link href="/signup" className="btn-secondary">
              Create Account
            </Link>
          </div>
          <p className="text-sm text-[#a0a0cc] mt-8">
            <Link href="/browse" className="text-[#6366f1] hover:underline">
              Browse public comps
            </Link>
            {' '}without logging in
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Welcome Header */}
      <div className="flex items-center justify-between mb-12 flex-col sm:flex-row gap-4">
        <div>
          <h1 className="text-4xl font-bold mb-2">
            Hey {user.display_name}!
          </h1>
          <p className="text-[#a0a0cc]">Welcome back to your tipping dashboard</p>
        </div>
        <Link href="/create" className="btn-primary whitespace-nowrap">
          Create New Comp
        </Link>
      </div>

      {/* Quick Stats Grid */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          <div className="bg-[#111128] border border-[#2a2a5a] rounded-xl p-6 hover:border-[#6366f1] transition-colors">
            <div className="text-3xl mb-2">🏆</div>
            <div className="text-3xl font-bold mb-1">{stats.activeComps}</div>
            <div className="text-sm text-[#a0a0cc]">Active Comps</div>
            {stats.activeComps === 0 && (
              <p className="text-xs text-[#6366f1] mt-2">
                <Link href="/create" className="hover:underline">Create or join one</Link>
              </p>
            )}
          </div>

          <div className="bg-[#111128] border border-[#2a2a5a] rounded-xl p-6 hover:border-[#a855f7] transition-colors">
            <div className="text-3xl mb-2">⭐</div>
            <div className="text-3xl font-bold mb-1">{stats.totalTips}</div>
            <div className="text-sm text-[#a0a0cc]">Total Tips Entered</div>
            <p className="text-xs text-[#a0a0cc] mt-2">
              {stats.totalTips === 0 ? 'Start tipping in your comps!' : `${(stats.totalTips / TOTAL_GAMES * 100).toFixed(0)}% of season`}
            </p>
          </div>

          <div className="bg-[#111128] border border-[#2a2a5a] rounded-xl p-6 hover:border-[#ec4899] transition-colors">
            <div className="text-3xl mb-2">🏈</div>
            <div className="text-3xl font-bold mb-1">{stats.gamesCompleted}</div>
            <div className="text-sm text-[#a0a0cc]">Games Completed</div>
            <p className="text-xs text-[#a0a0cc] mt-2">
              {stats.gamesCompleted} of {TOTAL_GAMES} games
            </p>
          </div>

          <div className="bg-[#111128] border border-[#2a2a5a] rounded-xl p-6 hover:border-[#14b8a6] transition-colors">
            <div className="text-3xl mb-2">📊</div>
            <div className="text-3xl font-bold mb-1">{stats.seasonProgress}%</div>
            <div className="text-sm text-[#a0a0cc]">Season Progress</div>
            <div className="w-full bg-[#1a1a3e] rounded-full h-2 mt-3">
              <div
                className="bg-gradient-to-r from-[#6366f1] to-[#14b8a6] h-2 rounded-full transition-all"
                style={{ width: `${stats.seasonProgress}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Your Comps Section */}
      {comps.length > 0 ? (
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Your Comps</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {comps.map(comp => {
              const rank = getUserRank(comp.id);
              const userTips = getTipsForComp(comp.id);

              return (
                <Link
                  key={comp.id}
                  href={`/comp/${comp.invite_code}`}
                  className="bg-[#111128] border border-[#2a2a5a] rounded-2xl p-6 hover:border-[#6366f1] hover:shadow-lg hover:shadow-[#6366f1]/20 transition-all block group"
                >
                  {/* Card Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold group-hover:text-[#a78bfa] transition-colors">{comp.name}</h3>
                      <p className="text-sm text-[#a0a0cc] mt-1">
                        {comp.members.length} member{comp.members.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="bg-[#6366f1]/10 text-[#a78bfa] text-xs font-bold px-3 py-1 rounded-full block">
                        Rank: {rank}
                      </span>
                    </div>
                  </div>

                  {/* Invite Code */}
                  <div className="bg-[#1a1a3e] rounded-lg p-3 mb-4">
                    <p className="text-xs text-[#a0a0cc] mb-1">Invite Code</p>
                    <p className="text-sm font-mono font-bold text-[#a78bfa]">{comp.invite_code}</p>
                  </div>

                  {/* Stats Row */}
                  <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                    <div className="bg-[#1a1a3e] rounded-lg p-3">
                      <p className="text-[#a0a0cc] text-xs mb-1">Your Tips</p>
                      <p className="text-xl font-bold text-[#6366f1]">{userTips}</p>
                    </div>
                    <div className="bg-[#1a1a3e] rounded-lg p-3">
                      <p className="text-[#a0a0cc] text-xs mb-1">Total Tips</p>
                      <p className="text-xl font-bold text-[#a855f7]">{TOTAL_GAMES}</p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="bg-[#1a1a3e] rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-[#6366f1] to-[#a855f7] h-2 rounded-full transition-all"
                      style={{ width: `${(userTips / TOTAL_GAMES) * 100}%` }}
                    />
                  </div>
                  <p className="text-xs text-[#a0a0cc] mt-2">
                    {userTips} of {TOTAL_GAMES} tips entered
                  </p>
                </Link>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="bg-[#111128] border border-[#2a2a5a] rounded-2xl p-12 text-center mb-12">
          <div className="text-5xl mb-4">🎯</div>
          <h3 className="text-xl font-bold mb-2">No Comps Yet</h3>
          <p className="text-[#a0a0cc] mb-6">You haven't joined or created any comps. Get started below!</p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link href="/create" className="btn-primary">
              Create a Comp
            </Link>
            <button onClick={() => document.getElementById('join-section')?.scrollIntoView({ behavior: 'smooth' })} className="btn-secondary">
              Join a Comp
            </button>
          </div>
        </div>
      )}

      {/* Join a Comp Section */}
      <div id="join-section" className="bg-gradient-to-br from-[#111128] to-[#1a1a3e] border border-[#2a2a5a] rounded-2xl p-8 mb-12">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold mb-2">Join a Comp</h2>
          <p className="text-[#a0a0cc] mb-6">
            Got an invite code from a mate? Enter it below to join their comp.
          </p>

          {joinSuccess && (
            <div className="bg-[#14b8a6]/10 border border-[#14b8a6] text-[#14b8a6] rounded-lg p-4 mb-6">
              <p className="font-medium">Successfully joined! Visit the comp page to start tipping.</p>
            </div>
          )}

          <div className="flex gap-3 mb-4">
            <input
              type="text"
              placeholder="e.g. GALLI26"
              value={inviteCode}
              onChange={e => {
                setInviteCode(e.target.value.toUpperCase());
                setJoinError('');
              }}
              onKeyPress={e => e.key === 'Enter' && handleJoinComp()}
              className="input-field flex-1"
              maxLength={10}
            />
            <button
              onClick={handleJoinComp}
              disabled={!inviteCode.trim()}
              className="btn-primary whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Join
            </button>
          </div>

          {joinError && (
            <p className="text-sm text-red-400 mb-4">{joinError}</p>
          )}

          <p className="text-sm text-[#a0a0cc]">
            Don't have an invite code?{' '}
            <Link href="/browse" className="text-[#6366f1] hover:underline font-medium">
              Browse public comps
            </Link>
          </p>
        </div>
      </div>

      {/* Browse Section */}
      <div className="bg-[#111128] border border-[#2a2a5a] rounded-2xl p-8 text-center">
        <div className="max-w-xl mx-auto">
          <div className="text-4xl mb-4">🌍</div>
          <h3 className="text-xl font-bold mb-2">Browse Public Comps</h3>
          <p className="text-[#a0a0cc] mb-6">
            Looking for more comps to join? Browse all public competitions and find one that suits you.
          </p>
          <Link href="/browse" className="btn-primary">
            Browse All Comps
          </Link>
        </div>
      </div>
    </div>
  );
}
