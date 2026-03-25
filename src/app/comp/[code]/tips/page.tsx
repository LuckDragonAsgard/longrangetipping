'use client';

import { useState, useMemo, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { AFL_2026_FIXTURE, type FixtureGame } from '@/lib/fixture-data';
import { useApp } from '@/lib/store';
import { getTeamColor } from '@/lib/teams';
import { getTeamById } from '@/lib/teams-data';

interface RoundGroup {
  roundNumber: number;
  roundName: string;
  games: FixtureGame[];
  completed: number;
  total: number;
  isComplete: boolean;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const dayName = days[date.getDay()];
  const dayNum = date.getDate();
  const monthName = months[date.getMonth()];
  const hour = date.getHours();
  const min = date.getMinutes().toString().padStart(2, '0');

  return `${dayName} ${dayNum} ${monthName} ${hour}:${min}`;
}

function MatchCard({ game, compId, isExpanded }: { game: FixtureGame; compId: string; isExpanded: boolean }) {
  const { tips, setTip } = useApp();
  const compTips = tips[compId] || {};
  const userTip = compTips[game.id];

  const homeTeam = game.home_team_id ? getTeamById(game.home_team_id) : undefined;
  const awayTeam = game.away_team_id ? getTeamById(game.away_team_id) : undefined;

  const homeColor = getTeamColor(game.home_team || '');
  const awayColor = getTeamColor(game.away_team || '');

  const handleTip = (teamId: number) => {
    if (!game.complete) {
      setTip(compId, game.id, teamId);
    }
  };

  if (!isExpanded) {
    return null;
  }

  return (
    <div className="bg-[#111128] border border-[#2a2a5a] rounded-xl p-4 mb-3">
      {/* Date and Venue */}
      <div className="flex items-center justify-between mb-3 pb-3 border-b border-[#2a2a5a]/50">
        <div>
          <div className="text-xs text-[#a0a0cc] font-medium">{formatDate(game.date)}</div>
          <div className="text-xs text-[#a0a0cc]">{game.venue}</div>
        </div>
        {game.complete && (
          <div className="px-2 py-1 bg-[#2a2a5a] rounded-full text-xs font-semibold text-[#a0a0cc]">
            LOCKED
          </div>
        )}
      </div>

      {/* Match Teams */}
      <div className="space-y-2">
        {/* Home Team */}
        <button
          onClick={() => game.home_team_id && handleTip(game.home_team_id)}
          disabled={game.complete || !game.home_team_id}
          className={`w-full p-3 rounded-lg border-2 transition-all ${
            game.complete
              ? 'cursor-not-allowed bg-[#0a0a14]'
              : userTip === game.home_team_id
              ? 'border-[#6366f1] bg-[#6366f1]/10'
              : 'border-[#2a2a5a] hover:border-[#6366f1]/50 hover:bg-[#6366f1]/5'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: homeColor }}
              />
              <div className="text-left">
                <div className="font-semibold">{game.home_team}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {game.complete ? (
                <>
                  <div className="text-lg font-bold">{game.home_score}</div>
                  {game.winner_team_id === game.home_team_id && (
                    <div className="text-xl">✓</div>
                  )}
                </>
              ) : (
                <>
                  {userTip === game.home_team_id && (
                    <div className="w-5 h-5 bg-[#6366f1] rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full" />
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </button>

        {/* Away Team */}
        <button
          onClick={() => game.away_team_id && handleTip(game.away_team_id)}
          disabled={game.complete || !game.away_team_id}
          className={`w-full p-3 rounded-lg border-2 transition-all ${
            game.complete
              ? 'cursor-not-allowed bg-[#0a0a14]'
              : userTip === game.away_team_id
              ? 'border-[#6366f1] bg-[#6366f1]/10'
              : 'border-[#2a2a5a] hover:border-[#6366f1]/50 hover:bg-[#6366f1]/5'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: awayColor }}
              />
              <div className="text-left">
                <div className="font-semibold">{game.away_team}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {game.complete ? (
                <>
                  <div className="text-lg font-bold">{game.away_score}</div>
                  {game.winner_team_id === game.away_team_id && (
                    <div className="text-xl">✓</div>
                  )}
                </>
              ) : (
                <>
                  {userTip === game.away_team_id && (
                    <div className="w-5 h-5 bg-[#6366f1] rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full" />
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </button>
      </div>
    </div>
  );
}

function RoundSection({
  round,
  compId,
  autoExpand,
}: {
  round: RoundGroup;
  compId: string;
  autoExpand: boolean;
}) {
  const [expanded, setExpanded] = useState(autoExpand);

  const completionPercent = Math.round((round.completed / round.total) * 100);

  return (
    <div className="mb-4">
      {/* Round Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full bg-gradient-to-r from-[#1a1040]/50 to-[#111128]/50 border border-[#2a2a5a] rounded-xl p-4 flex items-center justify-between hover:bg-gradient-to-r hover:from-[#1a1040]/70 hover:to-[#111128]/70 transition-all group"
      >
        <div className="flex items-center gap-4">
          <div>
            <h3 className="font-bold text-lg">{round.roundName}</h3>
            <p className="text-sm text-[#a0a0cc]">
              {round.total} game{round.total !== 1 ? 's' : ''} {round.isComplete && '• Completed'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <div className="font-bold">{round.completed}/{round.total}</div>
            <div className="text-xs text-[#a0a0cc]">games decided</div>
          </div>
          <div
            className={`transition-transform ${expanded ? 'rotate-180' : ''}`}
          >
            <svg className="w-5 h-5 text-[#a0a0cc]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      </button>

      {/* Progress Bar */}
      {expanded && (
        <div className="mt-2 px-4 py-2 bg-[#0a0a14] rounded-lg">
          <div className="w-full bg-[#2a2a5a] rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-[#6366f1] to-[#a855f7] h-full transition-all"
              style={{ width: `${completionPercent}%` }}
            />
          </div>
          <p className="text-xs text-[#a0a0cc] mt-1">{completionPercent}% of games decided</p>
        </div>
      )}

      {/* Games List */}
      {expanded && (
        <div className="mt-4 space-y-0">
          {round.games.map(game => (
            <MatchCard
              key={game.id}
              game={game}
              compId={compId}
              isExpanded={expanded}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function ProgressHeader({
  totalTipped,
  totalGames,
}: {
  totalTipped: number;
  totalGames: number;
}) {
  const percent = Math.round((totalTipped / totalGames) * 100);

  return (
    <div className="sticky top-16 bg-[#0a0a14]/95 backdrop-blur-lg border-b border-[#2a2a5a] px-4 py-4 z-40">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-3">
          <div className="font-semibold">Tips Progress</div>
          <div className="text-sm font-bold text-[#6366f1]">
            {totalTipped}/{totalGames} games tipped
          </div>
        </div>
        <div className="w-full bg-[#2a2a5a] rounded-full h-2 overflow-hidden">
          <div
            className="bg-gradient-to-r from-[#6366f1] to-[#a855f7] h-full transition-all"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>
    </div>
  );
}

export default function TipsPage() {
  const params = useParams();
  const code = params.code as string;
  const { tips, setTips } = useApp();
  const [saved, setSaved] = useState(false);
  const [showSaveConfirm, setShowSaveConfirm] = useState(false);

  const compTips = tips[code] || {};

  // Group games by round
  const roundGroups = useMemo(() => {
    const groups: RoundGroup[] = [];
    const roundMap: { [key: number]: RoundGroup } = {};

    AFL_2026_FIXTURE.forEach(game => {
      if (!roundMap[game.round]) {
        roundMap[game.round] = {
          roundNumber: game.round,
          roundName: game.roundname,
          games: [],
          completed: 0,
          total: 0,
          isComplete: false,
        };
        groups.push(roundMap[game.round]);
      }

      roundMap[game.round].games.push(game);
      roundMap[game.round].total++;
      if (game.complete) {
        roundMap[game.round].completed++;
      }
    });

    groups.forEach(g => {
      g.isComplete = g.completed === g.total;
    });

    return groups.sort((a, b) => a.roundNumber - b.roundNumber);
  }, []);

  // Calculate statistics
  const stats = useMemo(() => {
    const totalGames = AFL_2026_FIXTURE.length;
    const completedGames = AFL_2026_FIXTURE.filter(g => g.complete).length;
    const totalTipped = Object.keys(compTips).length;
    const firstIncompleteRound = roundGroups.findIndex(r => !r.isComplete);

    return {
      totalGames,
      completedGames,
      remainingGames: totalGames - completedGames,
      totalTipped,
      firstIncompleteRound,
    };
  }, [compTips, roundGroups]);

  const handleSave = () => {
    setShowSaveConfirm(true);
    setTips(code, compTips);
    setTimeout(() => {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }, 500);
    setTimeout(() => setShowSaveConfirm(false), 1000);
  };

  return (
    <div className="min-h-screen bg-[#0a0a14]">
      {/* Progress Header */}
      <ProgressHeader
        totalTipped={stats.totalTipped}
        totalGames={stats.totalGames}
      />

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Enter Your Tips</h1>
          <p className="text-[#a0a0cc]">
            {stats.completedGames} game{stats.completedGames !== 1 ? 's' : ''} completed • {stats.remainingGames} to tip
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-[#111128] border border-[#2a2a5a] rounded-xl p-4">
            <div className="text-xs text-[#a0a0cc] font-medium uppercase tracking-wider mb-1">
              Tips Entered
            </div>
            <div className="text-2xl font-bold gradient-text">{stats.totalTipped}</div>
          </div>
          <div className="bg-[#111128] border border-[#2a2a5a] rounded-xl p-4">
            <div className="text-xs text-[#a0a0cc] font-medium uppercase tracking-wider mb-1">
              Games Remaining
            </div>
            <div className="text-2xl font-bold gradient-text">{stats.remainingGames}</div>
          </div>
          <div className="bg-[#111128] border border-[#2a2a5a] rounded-xl p-4">
            <div className="text-xs text-[#a0a0cc] font-medium uppercase tracking-wider mb-1">
              Progress
            </div>
            <div className="text-2xl font-bold gradient-text">
              {Math.round((stats.totalTipped / stats.totalGames) * 100)}%
            </div>
          </div>
        </div>

        {/* Rounds */}
        <div className="space-y-4">
          {roundGroups.map((round, idx) => (
            <RoundSection
              key={round.roundNumber}
              round={round}
              compId={code}
              autoExpand={idx === stats.firstIncompleteRound}
            />
          ))}
        </div>

        {/* Save Button */}
        <div className="mt-12 flex gap-3 sticky bottom-0 bg-gradient-to-t from-[#0a0a14] via-[#0a0a14] to-transparent pt-8 pb-4">
          <button
            onClick={handleSave}
            className={`flex-1 py-3 rounded-lg font-semibold transition-all ${
              saved
                ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                : showSaveConfirm
                ? 'bg-[#6366f1]/80 text-white border border-[#6366f1]/50'
                : 'bg-gradient-to-r from-[#6366f1] to-[#a855f7] text-white hover:shadow-lg hover:shadow-[#6366f1]/20'
            }`}
          >
            {saved ? '✓ Tips Saved' : showSaveConfirm ? 'Saving...' : 'Save Tips'}
          </button>
          <a
            href={`/comp/${code}`}
            className="py-3 px-6 rounded-lg font-semibold border border-[#2a2a5a] hover:border-[#6366f1]/50 hover:bg-[#6366f1]/5 transition-all"
          >
            View Comp
          </a>
        </div>
      </div>
    </div>
  );
}
