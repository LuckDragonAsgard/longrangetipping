'use client';

export const runtime = "edge";

import { useState, useMemo, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useApp } from '@/lib/store';
import { AFL_2026_FIXTURE, ROUND_SUMMARY, type FixtureGame } from '@/lib/fixture-data';
import { getTeamColor } from '@/lib/teams';
import { getTeamById } from '@/lib/teams-data';
import { fetchCompByCode } from '@/lib/supabase-db';

interface LeaderboardEntry {
  user_id: string;
  display_name: string;
  points: number;
  correct: number;
  total: number;
  accuracy: number;
}

function generateDemoScores(userId: string, games: FixtureGame[]): LeaderboardEntry {
  const completedGames = games.filter(g => g.complete);

  let correct = 0;
  for (let i = 0; i < completedGames.length; i++) {
    const game = completedGames[i];
    const tipChoice = (userId.charCodeAt(i % userId.length) + game.id) % 3;
    const tippedTeamId = tipChoice === 0 ? game.home_team_id : tipChoice === 1 ? game.away_team_id : game.home_team_id;

    if (tippedTeamId === game.winner_team_id) {
      correct++;
    }
  }

  return {
    user_id: userId,
    display_name: userId,
    points: correct * 3,
    correct,
    total: completedGames.length,
    accuracy: completedGames.length > 0 ? Math.round((correct / completedGames.length) * 100) : 0,
  };
}

function Leaderboard({ members }: { members: Array<{ user_id: string; display_name: string }> }) {
  const scores = useMemo(() => {
    const leaderboard = members.map(m => generateDemoScores(m.user_id, AFL_2026_FIXTURE));
    return leaderboard.sort((a, b) => b.points - a.points);
  }, [members]);

  const getMedalEmoji = (rank: number) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

  const getRowStyle = (rank: number) => {
    if (rank === 1) return 'bg-[#6366f1]/10 border-l-4 border-yellow-500';
    if (rank === 2) return 'bg-[#a0a0cc]/5 border-l-4 border-gray-400';
    if (rank === 3) return 'bg-[#a855f7]/5 border-l-4 border-orange-600';
    return 'hover:bg-[#111128]/50';
  };

  return (
    <div className="space-y-2">
      {scores.map((entry, idx) => (
        <div
          key={entry.user_id}
          className={`flex items-center justify-between p-4 bg-[#111128] border border-[#2a2a5a] rounded-lg transition-all ${getRowStyle(idx + 1)}`}
        >
          <div className="flex items-center gap-4 flex-1">
            <div className="text-lg font-bold w-8">{getMedalEmoji(idx + 1)}</div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold truncate">{entry.display_name}</div>
              <div className="text-xs text-[#a0a0cc]">{entry.accuracy}% accuracy</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xl font-bold text-[#6366f1]">{entry.points}</div>
            <div className="text-xs text-[#a0a0cc]">{entry.correct}/{entry.total} correct</div>
          </div>
        </div>
      ))}
    </div>
  );
}

function RoundsTab({ code }: { code: string }) {
  return (
    <div className="space-y-2">
      {ROUND_SUMMARY.map(round => {
        const isCompleted = round.completed > 0;
        const allCompleted = round.completed === round.games;

        return (
          <Link
            key={round.round}
            href={`/comp/${code}/results?round=${round.round}`}
            className="flex items-center justify-between p-4 bg-[#111128] border border-[#2a2a5a] rounded-lg hover:border-[#6366f1] transition-all group"
          >
            <div className="flex-1 min-w-0">
              <div className="font-semibold group-hover:text-[#a78bfa] transition-colors">{round.name}</div>
              <div className="text-xs text-[#a0a0cc]">{round.games} game{round.games !== 1 ? 's' : ''}</div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-sm font-bold">{round.completed}/{round.games}</div>
                <div className="text-xs text-[#a0a0cc]">completed</div>
              </div>
              <div>
                {allCompleted ? (
                  <span className="bg-[#14b8a6]/20 text-[#14b8a6] text-xs font-bold px-2 py-1 rounded-full">
                    ✓ Done
                  </span>
                ) : isCompleted ? (
                  <span className="bg-[#6366f1]/20 text-[#6366f1] text-xs font-bold px-2 py-1 rounded-full">
                    In Progress
                  </span>
                ) : (
                  <span className="bg-[#2a2a5a]/50 text-[#a0a0cc] text-xs font-bold px-2 py-1 rounded-full">
                    Upcoming
                  </span>
                )}
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}

function YourTipsTab({ inviteCode, members }: { inviteCode: string; members: Array<{ user_id: string; display_name: string }> }) {
  const { user, tips, loadTipsFromDb } = useApp();
  const compTips = tips[inviteCode] || {};

  // Load tips from DB on mount
  useEffect(() => {
    if (user?.isLoggedIn) {
      loadTipsFromDb(inviteCode);
    }
  }, [user, inviteCode, loadTipsFromDb]);

  const tipsByRound = useMemo(() => {
    const grouped: { [round: number]: Array<{ game: FixtureGame; tipTeamId?: number }> } = {};

    AFL_2026_FIXTURE.forEach(game => {
      if (!grouped[game.round]) {
        grouped[game.round] = [];
      }
      grouped[game.round].push({
        game,
        tipTeamId: compTips[game.id],
      });
    });

    return grouped;
  }, [compTips]);

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-[#a0a0cc]">Please log in to view your tips</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {ROUND_SUMMARY.map(round => {
        const roundGames = tipsByRound[round.round] || [];
        const tipCount = roundGames.filter(g => g.tipTeamId).length;
        const correctCount = roundGames.filter(g => {
          if (!g.tipTeamId || !g.game.complete) return false;
          return g.tipTeamId === g.game.winner_team_id;
        }).length;

        return (
          <div key={round.round} className="bg-[#111128] border border-[#2a2a5a] rounded-xl p-6">
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-[#2a2a5a]">
              <div>
                <h3 className="font-bold text-lg">{round.name}</h3>
                <p className="text-xs text-[#a0a0cc]">{tipCount}/{round.games} tips entered</p>
              </div>
              {tipCount > 0 && (
                <div className="text-right">
                  <div className="text-sm font-bold text-[#6366f1]">{correctCount}/{tipCount}</div>
                  <div className="text-xs text-[#a0a0cc]">correct</div>
                </div>
              )}
            </div>

            <div className="space-y-2">
              {roundGames.map(({ game, tipTeamId }) => {
                const homeTeam = game.home_team_id ? getTeamById(game.home_team_id) : undefined;
                const awayTeam = game.away_team_id ? getTeamById(game.away_team_id) : undefined;
                const homeColor = getTeamColor(game.home_team || '');
                const awayColor = getTeamColor(game.away_team || '');

                const isTippedHome = tipTeamId === game.home_team_id;
                const isTippedAway = tipTeamId === game.away_team_id;
                const isCorrect = tipTeamId === game.winner_team_id;

                return (
                  <div key={game.id} className="bg-[#0a0a14] rounded-lg p-3 text-sm">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-2 h-2 rounded-full flex-shrink-0"
                            style={{ backgroundColor: homeColor }}
                          />
                          <span className="truncate">{game.home_team}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        {isTippedHome && (
                          <span className={game.complete ? (isCorrect ? '✅' : '❌') : '📌'} />
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-2 mt-1">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-2 h-2 rounded-full flex-shrink-0"
                            style={{ backgroundColor: awayColor }}
                          />
                          <span className="truncate">{game.away_team}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        {isTippedAway && (
                          <span className={game.complete ? (isCorrect ? '✅' : '❌') : '📌'} />
                        )}
                      </div>
                    </div>

                    {!tipTeamId && (
                      <div className="text-[#a0a0cc] text-xs mt-1">No tip</div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function CompPage() {
  const params = useParams();
  const code = params.code as string;
  const { user, comps, joinComp, loading } = useApp();
  const [activeTab, setActiveTab] = useState<'leaderboard' | 'rounds' | 'tips'>('leaderboard');
  const [fetchedComp, setFetchedComp] = useState<{
    id: string; name: string; description: string; invite_code: string;
    is_public: boolean; season_year: number; tip_deadline: string; creator_id: string;
    members: Array<{ user_id: string; display_name: string; joined_at: string }>;
  } | null>(null);
  const [fetching, setFetching] = useState(false);
  const [joining, setJoining] = useState(false);

  const comp = comps.find(c => c.invite_code === code) || fetchedComp;

  // If comp not in local state, try fetching from Supabase
  useEffect(() => {
    if (!comp && !fetching && !loading) {
      setFetching(true);
      fetchCompByCode(code)
        .then(data => {
          if (data) {
            setFetchedComp({
              ...data,
              members: [],
              description: data.description || '',
            });
          }
        })
        .finally(() => setFetching(false));
    }
  }, [comp, code, fetching, loading]);

  if (loading || fetching) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <p className="text-[#a0a0cc]">Loading comp...</p>
      </div>
    );
  }

  if (!comp) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center py-12">
          <div className="text-6xl mb-6">❌</div>
          <h1 className="text-3xl font-bold mb-4">Comp Not Found</h1>
          <p className="text-[#a0a0cc] mb-8">
            We couldn&apos;t find a comp with code <span className="font-mono text-[#6366f1]">{code}</span>
          </p>
          <Link href="/browse" className="btn-primary">
            Browse Public Comps
          </Link>
        </div>
      </div>
    );
  }

  const isUserMember = user && comp.members.some(m => m.user_id === user.id);
  const completedRounds = ROUND_SUMMARY.filter(r => r.completed > 0).length;
  const totalRounds = ROUND_SUMMARY.length;
  const completedGames = AFL_2026_FIXTURE.filter(g => g.complete).length;
  const totalGames = AFL_2026_FIXTURE.length;
  const remainingGames = totalGames - completedGames;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-start justify-between gap-4 mb-6 flex-col sm:flex-row">
          <div>
            <h1 className="text-4xl font-bold mb-2">{comp.name}</h1>
            <p className="text-[#a0a0cc]">{comp.members.length} member{comp.members.length !== 1 ? 's' : ''}</p>
          </div>
          <div className="flex gap-3 flex-col sm:flex-row">
            {isUserMember ? (
              <Link href={`/comp/${code}/tips`} className="btn-primary whitespace-nowrap">
                Enter Tips
              </Link>
            ) : user?.isLoggedIn ? (
              <button
                onClick={async () => {
                  setJoining(true);
                  try { await joinComp(comp.id); } catch (err: any) { alert(err?.message || 'Failed to join'); }
                  setJoining(false);
                }}
                disabled={joining}
                className="btn-primary whitespace-nowrap disabled:opacity-50"
              >
                {joining ? 'Joining...' : 'Join Comp'}
              </button>
            ) : (
              <Link href="/signup" className="btn-primary whitespace-nowrap">
                Sign Up to Join
              </Link>
            )}
          </div>
        </div>

        {/* Invite Code Card */}
        <div className="bg-[#111128] border border-[#2a2a5a] rounded-xl p-4 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-[#a0a0cc] mb-1">Invite Code</p>
              <p className="font-mono text-lg font-bold text-[#6366f1]">{comp.invite_code}</p>
            </div>
            <button
              onClick={() => {
                navigator.clipboard.writeText(comp.invite_code);
              }}
              className="px-4 py-2 bg-[#6366f1]/10 hover:bg-[#6366f1]/20 text-[#6366f1] rounded-lg text-sm font-semibold transition-all"
            >
              Copy
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-[#111128] border border-[#2a2a5a] rounded-xl p-4">
            <div className="text-xs text-[#a0a0cc] font-medium uppercase tracking-wider mb-1">
              Rounds Completed
            </div>
            <div className="text-2xl font-bold text-[#6366f1]">{completedRounds}/{totalRounds}</div>
          </div>
          <div className="bg-[#111128] border border-[#2a2a5a] rounded-xl p-4">
            <div className="text-xs text-[#a0a0cc] font-medium uppercase tracking-wider mb-1">
              Games Decided
            </div>
            <div className="text-2xl font-bold text-[#a855f7]">{completedGames}/{totalGames}</div>
          </div>
          <div className="bg-[#111128] border border-[#2a2a5a] rounded-xl p-4">
            <div className="text-xs text-[#a0a0cc] font-medium uppercase tracking-wider mb-1">
              Games Remaining
            </div>
            <div className="text-2xl font-bold text-[#14b8a6]">{remainingGames}</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-8 border-b border-[#2a2a5a]">
        <div className="flex gap-1 overflow-x-auto">
          {[
            { id: 'leaderboard', label: 'Leaderboard' },
            { id: 'rounds', label: 'Rounds' },
            { id: 'tips', label: 'Your Tips' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-3 font-semibold whitespace-nowrap transition-all border-b-2 ${
                activeTab === tab.id
                  ? 'border-[#6366f1] text-[#6366f1]'
                  : 'border-transparent text-[#a0a0cc] hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'leaderboard' && <Leaderboard members={comp.members} />}
        {activeTab === 'rounds' && <RoundsTab code={code} />}
        {activeTab === 'tips' && <YourTipsTab inviteCode={comp.invite_code} members={comp.members} />}
      </div>
    </div>
  );
}
