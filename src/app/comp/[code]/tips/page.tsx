'use client';

export const runtime = "edge";

import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { AFL_2026_FIXTURE, type FixtureGame } from '@/lib/fixture-data';
import { useApp } from '@/lib/store';
import { getTeamColor } from '@/lib/teams';
import { AFL_TEAMS, getTeamById } from '@/lib/teams-data';

// ─── Quick Fill Modal ───────────────────────────────────────────────
function QuickFillModal({
  onClose,
  onApply,
  existingTips,
}: {
  onClose: () => void;
  onApply: (tips: { [matchId: number]: number }) => void;
  existingTips: { [matchId: number]: number };
}) {
  const [rankings, setRankings] = useState<number[]>(
    AFL_TEAMS.map(t => t.id)
  );

  const moveTeam = (from: number, to: number) => {
    const next = [...rankings];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    setRankings(next);
  };

  const handleGenerate = () => {
    const rankMap: { [teamId: number]: number } = {};
    rankings.forEach((teamId, idx) => {
      rankMap[teamId] = idx;
    });

    const newTips: { [matchId: number]: number } = {};
    AFL_2026_FIXTURE.forEach(game => {
      if (game.home_team_id && game.away_team_id) {
        const homeRank = rankMap[game.home_team_id] ?? 99;
        const awayRank = rankMap[game.away_team_id] ?? 99;
        newTips[game.id] = homeRank <= awayRank ? game.home_team_id : game.away_team_id;
      }
    });

    onApply(newTips);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div className="bg-[#111128] border border-[#2a2a5a] rounded-2xl w-full max-w-md max-h-[85vh] flex flex-col">
        <div className="p-6 border-b border-[#2a2a5a]">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-bold">Quick Fill</h2>
            <button onClick={onClose} className="text-[#a0a0cc] hover:text-white text-2xl">&times;</button>
          </div>
          <p className="text-sm text-[#a0a0cc]">
            Rank teams best to worst. The better-ranked team gets auto-tipped to win each game. Tweak individual tips after.
          </p>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {rankings.map((teamId, idx) => {
            const team = getTeamById(teamId);
            if (!team) return null;
            const color = getTeamColor(team.name);

            return (
              <div
                key={teamId}
                className="flex items-center gap-3 p-3 rounded-lg mb-1 bg-[#0a0a14] hover:bg-[#1a1a3e] transition-all"
              >
                <div className="text-sm font-bold text-[#a0a0cc] w-6 text-center">{idx + 1}</div>
                <div className="flex items-center gap-2 flex-1">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
                  <span className="font-medium text-sm">{team.name}</span>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => { if (idx > 0) moveTeam(idx, idx - 1); }}
                    disabled={idx === 0}
                    className="w-7 h-7 rounded bg-[#2a2a5a] hover:bg-[#6366f1]/30 flex items-center justify-center text-xs disabled:opacity-20"
                  >▲</button>
                  <button
                    onClick={() => { if (idx < rankings.length - 1) moveTeam(idx, idx + 1); }}
                    disabled={idx === rankings.length - 1}
                    className="w-7 h-7 rounded bg-[#2a2a5a] hover:bg-[#6366f1]/30 flex items-center justify-center text-xs disabled:opacity-20"
                  >▼</button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="p-4 border-t border-[#2a2a5a] flex gap-3">
          <button onClick={onClose} className="flex-1 py-3 rounded-lg border border-[#2a2a5a] font-semibold hover:bg-[#1a1a3e] transition-all">
            Cancel
          </button>
          <button onClick={handleGenerate} className="flex-1 py-3 rounded-lg bg-gradient-to-r from-[#6366f1] to-[#a855f7] font-semibold hover:shadow-lg transition-all">
            Fill All Tips
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Compact Match Row ──────────────────────────────────────────────
function MatchRow({
  game,
  tipTeamId,
  onTip,
}: {
  game: FixtureGame;
  tipTeamId?: number;
  onTip: (gameId: number, teamId: number) => void;
}) {
  const homeColor = getTeamColor(game.home_team || '');
  const awayColor = getTeamColor(game.away_team || '');

  const isHomeTipped = tipTeamId === game.home_team_id;
  const isAwayTipped = tipTeamId === game.away_team_id;
  const isComplete = game.complete;
  const homeWon = game.winner_team_id === game.home_team_id;
  const awayWon = game.winner_team_id === game.away_team_id;
  const tipCorrect = tipTeamId === game.winner_team_id;

  return (
    <div className={`flex items-center gap-2 py-1.5 px-2 rounded-lg transition-all ${
      isComplete ? 'bg-[#0a0a14]/50' : tipTeamId ? 'bg-[#111128]' : 'bg-[#0a0a14]'
    }`}>
      <button
        onClick={() => game.home_team_id && !isComplete && onTip(game.id, game.home_team_id)}
        disabled={isComplete}
        className={`flex-1 flex items-center gap-2 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
          isComplete
            ? homeWon ? 'bg-green-500/10 text-green-400' : 'text-[#a0a0cc]/50'
            : isHomeTipped
            ? 'bg-[#6366f1]/20 border border-[#6366f1] text-white'
            : 'hover:bg-[#1a1a3e] text-[#a0a0cc] hover:text-white'
        }`}
      >
        <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: homeColor }} />
        <span className="truncate">{game.home_team}</span>
        {isComplete && <span className="ml-auto font-bold text-xs">{game.home_score}</span>}
        {isHomeTipped && !isComplete && <span className="ml-auto text-[#6366f1]">●</span>}
      </button>

      <span className="text-[#a0a0cc]/30 text-xs font-bold w-5 text-center flex-shrink-0">v</span>

      <button
        onClick={() => game.away_team_id && !isComplete && onTip(game.id, game.away_team_id)}
        disabled={isComplete}
        className={`flex-1 flex items-center gap-2 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
          isComplete
            ? awayWon ? 'bg-green-500/10 text-green-400' : 'text-[#a0a0cc]/50'
            : isAwayTipped
            ? 'bg-[#6366f1]/20 border border-[#6366f1] text-white'
            : 'hover:bg-[#1a1a3e] text-[#a0a0cc] hover:text-white'
        }`}
      >
        <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: awayColor }} />
        <span className="truncate">{game.away_team}</span>
        {isComplete && <span className="ml-auto font-bold text-xs">{game.away_score}</span>}
        {isAwayTipped && !isComplete && <span className="ml-auto text-[#6366f1]">●</span>}
      </button>

      {isComplete && tipTeamId && (
        <span className="text-sm flex-shrink-0 w-5 text-center">{tipCorrect ? '✅' : '❌'}</span>
      )}
      {isComplete && !tipTeamId && (
        <span className="text-sm flex-shrink-0 w-5 text-center text-[#a0a0cc]/30">—</span>
      )}
    </div>
  );
}

// ─── Round Nav Pill ─────────────────────────────────────────────────
function RoundPill({
  roundName,
  tipped,
  total,
  isActive,
  onClick,
}: {
  roundName: string;
  tipped: number;
  total: number;
  isActive: boolean;
  onClick: () => void;
}) {
  const allTipped = tipped === total;
  const label = roundName === 'Opening Round' ? 'OR' : roundName.replace('Round ', 'R');

  return (
    <button
      onClick={onClick}
      className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
        isActive
          ? 'bg-[#6366f1] text-white shadow-lg shadow-[#6366f1]/30'
          : allTipped
          ? 'bg-[#14b8a6]/20 text-[#14b8a6] border border-[#14b8a6]/30'
          : tipped > 0
          ? 'bg-[#6366f1]/10 text-[#a78bfa] border border-[#6366f1]/20'
          : 'bg-[#1a1a3e] text-[#a0a0cc] border border-[#2a2a5a]'
      }`}
    >
      {label}{allTipped ? '✓' : tipped > 0 ? ` ${tipped}/${total}` : ''}
    </button>
  );
}

// ─── Main Tips Page ─────────────────────────────────────────────────
export default function TipsPage() {
  const params = useParams();
  const code = params.code as string;
  const { user, tips, setTip, setTips, saveTipsToDb, loadTipsFromDb, loading } = useApp();
  const [showQuickFill, setShowQuickFill] = useState(false);
  const [activeRound, setActiveRound] = useState<number | null>(null);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [tipsLoaded, setTipsLoaded] = useState(false);
  const roundRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});

  const compTips = tips[code] || {};

  // Load tips from Supabase on mount
  useEffect(() => {
    if (user?.isLoggedIn && !tipsLoaded) {
      loadTipsFromDb(code).then(() => setTipsLoaded(true));
    }
  }, [user, code, tipsLoaded, loadTipsFromDb]);

  const rounds = useMemo(() => {
    const map = new Map<number, { roundNum: number; roundName: string; games: FixtureGame[] }>();
    AFL_2026_FIXTURE.forEach(game => {
      if (!map.has(game.round)) {
        map.set(game.round, { roundNum: game.round, roundName: game.roundname, games: [] });
      }
      map.get(game.round)!.games.push(game);
    });
    return Array.from(map.values()).sort((a, b) => a.roundNum - b.roundNum);
  }, []);

  const totalGames = AFL_2026_FIXTURE.length;
  const totalTipped = Object.keys(compTips).length;
  const percent = Math.round((totalTipped / totalGames) * 100);

  useEffect(() => {
    if (activeRound === null && rounds.length > 0) {
      const firstUntipped = rounds.find(r => {
        const tippedInRound = r.games.filter(g => compTips[g.id]).length;
        return tippedInRound < r.games.length;
      });
      setActiveRound(firstUntipped?.roundNum ?? rounds[0]?.roundNum ?? 0);
    }
  }, [rounds, compTips, activeRound]);

  const handleTip = useCallback((gameId: number, teamId: number) => {
    setTip(code, gameId, teamId);
  }, [code, setTip]);

  const handleQuickFill = useCallback((allTips: { [matchId: number]: number }) => {
    setTips(code, allTips);
  }, [code, setTips]);

  const scrollToRound = (roundNum: number) => {
    setActiveRound(roundNum);
    roundRefs.current[roundNum]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleSave = async () => {
    if (!user?.isLoggedIn) {
      setSaveStatus('error');
      return;
    }
    setSaveStatus('saving');
    try {
      const result = await saveTipsToDb(code);
      if (result.errors > 0) {
        setSaveStatus('error');
        setTimeout(() => setSaveStatus('idle'), 3000);
      } else {
        setSaveStatus('saved');
        setTimeout(() => setSaveStatus('idle'), 2000);
      }
    } catch {
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a14]">
      {/* Sticky Header */}
      <div className="sticky top-16 bg-[#0a0a14]/95 backdrop-blur-lg border-b border-[#2a2a5a] z-40">
        <div className="px-4 pt-3 pb-2">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <h1 className="font-bold text-lg">Enter Tips</h1>
                <button
                  onClick={() => setShowQuickFill(true)}
                  className="px-3 py-1 rounded-full text-xs font-bold bg-[#a855f7]/20 text-[#a855f7] border border-[#a855f7]/30 hover:bg-[#a855f7]/30 transition-all"
                >
                  ⚡ Quick Fill
                </button>
              </div>
              <div className="text-sm font-bold">
                <span className="text-[#6366f1]">{totalTipped}</span>
                <span className="text-[#a0a0cc]">/{totalGames}</span>
              </div>
            </div>
            <div className="w-full bg-[#2a2a5a] rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-gradient-to-r from-[#6366f1] to-[#a855f7] h-full transition-all duration-300"
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>
        </div>

        <div className="px-4 pb-3 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
          <div className="max-w-4xl mx-auto flex gap-1.5">
            {rounds.map(round => {
              const tippedInRound = round.games.filter(g => compTips[g.id]).length;
              return (
                <RoundPill
                  key={round.roundNum}
                  roundName={round.roundName}
                  tipped={tippedInRound}
                  total={round.games.length}
                  isActive={activeRound === round.roundNum}
                  onClick={() => scrollToRound(round.roundNum)}
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* Games */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        {rounds.map(round => {
          const tippedInRound = round.games.filter(g => compTips[g.id]).length;
          const allDone = tippedInRound === round.games.length;

          return (
            <div
              key={round.roundNum}
              ref={el => { roundRefs.current[round.roundNum] = el; }}
              className="mb-8 scroll-mt-36"
            >
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-base font-bold">{round.roundName}</h2>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                  allDone ? 'bg-[#14b8a6]/20 text-[#14b8a6]' : tippedInRound > 0 ? 'bg-[#6366f1]/20 text-[#6366f1]' : 'bg-[#2a2a5a]/50 text-[#a0a0cc]'
                }`}>
                  {tippedInRound}/{round.games.length}
                </span>
              </div>
              <div className="space-y-1">
                {round.games.map(game => (
                  <MatchRow key={game.id} game={game} tipTeamId={compTips[game.id]} onTip={handleTip} />
                ))}
              </div>
            </div>
          );
        })}

        {/* Save Footer */}
        <div className="sticky bottom-0 bg-gradient-to-t from-[#0a0a14] via-[#0a0a14] to-transparent pt-8 pb-4 flex gap-3">
          <button
            onClick={handleSave}
            className={`flex-1 py-3 rounded-lg font-semibold transition-all ${
              saveStatus === 'saved'
                ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                : saveStatus === 'saving'
                ? 'bg-[#6366f1]/80 text-white'
                : 'bg-gradient-to-r from-[#6366f1] to-[#a855f7] text-white hover:shadow-lg hover:shadow-[#6366f1]/20'
            }`}
          >
            {saveStatus === 'saved' ? '✓ Tips Saved' : saveStatus === 'saving' ? 'Saving...' : saveStatus === 'error' ? 'Save Failed - Retry' : `Save Tips (${totalTipped}/${totalGames})`}
          </button>
          <a
            href={`/comp/${code}`}
            className="py-3 px-6 rounded-lg font-semibold border border-[#2a2a5a] hover:border-[#6366f1]/50 hover:bg-[#6366f1]/5 transition-all"
          >
            Back
          </a>
        </div>
      </div>

      {showQuickFill && (
        <QuickFillModal
          onClose={() => setShowQuickFill(false)}
          onApply={handleQuickFill}
          existingTips={compTips}
        />
      )}
    </div>
  );
}
