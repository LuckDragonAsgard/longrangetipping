'use client';

import { useMemo } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useApp } from '@/lib/store';
import { AFL_2026_FIXTURE, ROUND_SUMMARY, type FixtureGame } from '@/lib/fixture-data';
import { getTeamColor } from '@/lib/teams';

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

export default function ResultsPage() {
  const params = useParams();
  const code = params.code as string;
  const searchParams = useSearchParams();
  const roundParam = searchParams.get('round');
  const roundNumber = roundParam ? parseInt(roundParam) : 0;

  const { user, tips } = useApp();
  const compTips = tips[code] || {};

  const roundData = useMemo(() => {
    const roundSummary = ROUND_SUMMARY.find(r => r.round === roundNumber);
    if (!roundSummary) return null;

    const games = AFL_2026_FIXTURE.filter(g => g.round === roundNumber);
    const userTipped = games.map(g => ({
      game: g,
      tipTeamId: compTips[g.id],
    }));

    const correct = userTipped.filter(({ game, tipTeamId }) => {
      if (!tipTeamId || !game.complete) return false;
      return tipTeamId === game.winner_team_id;
    }).length;

    return {
      roundName: roundSummary.name,
      games: userTipped,
      correct,
      total: games.filter(g => g.complete).length,
    };
  }, [roundNumber, compTips]);

  if (!roundData) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link href={`/comp/${code}`} className="text-[#a0a0cc] hover:text-white transition-colors mb-8 block">
          ← Back to Comp
        </Link>
        <div className="text-center py-12">
          <p className="text-[#a0a0cc]">Round not found</p>
        </div>
      </div>
    );
  }

  const allGames = roundData.games;
  const prevRound = roundNumber > 0 ? roundNumber - 1 : null;
  const nextRound = roundNumber < ROUND_SUMMARY.length - 1 ? roundNumber + 1 : null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Back Link */}
      <Link href={`/comp/${code}`} className="text-[#a0a0cc] hover:text-white transition-colors mb-8 block">
        ← Back to Comp
      </Link>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">{roundData.roundName} Results</h1>
        <div className="flex items-center gap-2 mb-6">
          <span className="text-4xl font-bold text-[#6366f1]">{roundData.correct}</span>
          <span className="text-lg text-[#a0a0cc]">of {roundData.total} correct</span>
        </div>

        {/* Round Navigation */}
        <div className="flex gap-2">
          {prevRound !== null && (
            <Link
              href={`/comp/${code}/results?round=${prevRound}`}
              className="px-4 py-2 bg-[#111128] border border-[#2a2a5a] rounded-lg hover:border-[#6366f1] transition-all text-sm font-semibold"
            >
              ← Prev Round
            </Link>
          )}
          {nextRound !== null && (
            <Link
              href={`/comp/${code}/results?round=${nextRound}`}
              className="px-4 py-2 bg-[#111128] border border-[#2a2a5a] rounded-lg hover:border-[#6366f1] transition-all text-sm font-semibold"
            >
              Next Round →
            </Link>
          )}
        </div>
      </div>

      {/* Games List */}
      <div className="space-y-3">
        {allGames.map(({ game, tipTeamId }) => {
          const homeColor = getTeamColor(game.home_team || '');
          const awayColor = getTeamColor(game.away_team || '');

          let resultStatus: 'correct' | 'incorrect' | 'pending' | 'no-tip' = 'no-tip';
          if (!tipTeamId) {
            resultStatus = 'no-tip';
          } else if (!game.complete) {
            resultStatus = 'pending';
          } else if (tipTeamId === game.winner_team_id) {
            resultStatus = 'correct';
          } else {
            resultStatus = 'incorrect';
          }

          const bgColor =
            resultStatus === 'correct'
              ? 'bg-[#14b8a6]/5 border-[#14b8a6]/30'
              : resultStatus === 'incorrect'
              ? 'bg-red-500/5 border-red-500/30'
              : resultStatus === 'pending'
              ? 'bg-yellow-500/5 border-yellow-500/30'
              : 'bg-[#111128] border-[#2a2a5a]';

          return (
            <div key={game.id} className={`border rounded-lg p-4 transition-all ${bgColor}`}>
              {/* Date and Venue */}
              <div className="text-xs text-[#a0a0cc] mb-3 pb-3 border-b border-[#2a2a5a]/30">
                <div>{formatDate(game.date)}</div>
                <div>{game.venue}</div>
              </div>

              <div className="flex items-center justify-between gap-4">
                {/* Match */}
                <div className="flex-1 min-w-0">
                  {/* Home Team */}
                  <div className="flex items-center gap-2 mb-2">
                    <div
                      className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: homeColor }}
                    />
                    <span className={`font-semibold ${game.winner_team_id === game.home_team_id ? 'text-white' : 'text-[#a0a0cc]'}`}>
                      {game.home_team}
                    </span>
                    {game.complete && (
                      <span className="text-sm text-[#a0a0cc] ml-2">{game.home_score}</span>
                    )}
                  </div>

                  {/* Away Team */}
                  <div className="flex items-center gap-2">
                    <div
                      className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: awayColor }}
                    />
                    <span className={`font-semibold ${game.winner_team_id === game.away_team_id ? 'text-white' : 'text-[#a0a0cc]'}`}>
                      {game.away_team}
                    </span>
                    {game.complete && (
                      <span className="text-sm text-[#a0a0cc] ml-2">{game.away_score}</span>
                    )}
                  </div>
                </div>

                {/* Your Tip */}
                <div className="text-right flex-shrink-0">
                  {tipTeamId ? (
                    <>
                      <div className="text-xs text-[#a0a0cc] mb-1">Your tip</div>
                      <div className="font-semibold text-sm mb-2">
                        {tipTeamId === game.home_team_id ? game.home_team : game.away_team}
                      </div>
                      <div className="text-lg">
                        {resultStatus === 'correct' && '✅'}
                        {resultStatus === 'incorrect' && '❌'}
                        {resultStatus === 'pending' && '⏳'}
                      </div>
                    </>
                  ) : (
                    <div className="text-xs text-[#a0a0cc]">No tip</div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
