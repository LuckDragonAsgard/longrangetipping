const SQUIGGLE_BASE = 'https://api.squiggle.com.au';

interface SquiggleTeam {
  id: number;
  name: string;
  abbrev: string;
  logo: string;
}

interface SquiggleGame {
  id: number;
  round: number;
  roundname: string;
  hteam: string;
  hteamid: number;
  ateam: string;
  ateamid: number;
  venue: string;
  date: string;
  localtime: string;
  hscore: number;
  ascore: number;
  winner: string;
  winnerteamid: number;
  complete: number;
  year: number;
}

export async function getTeams(): Promise<SquiggleTeam[]> {
  const res = await fetch(`${SQUIGGLE_BASE}/?q=teams`, {
    headers: { 'User-Agent': 'LongRangeTipping/1.0 (longrangetipping.com)' },
    next: { revalidate: 86400 },
  });
  const data = await res.json();
  return data.teams || [];
}

export async function getFixtures(year: number): Promise<SquiggleGame[]> {
  const res = await fetch(`${SQUIGGLE_BASE}/?q=games;year=${year}`, {
    headers: { 'User-Agent': 'LongRangeTipping/1.0 (longrangetipping.com)' },
    next: { revalidate: 300 },
  });
  const data = await res.json();
  return data.games || [];
}

export async function getResults(year: number, round: number): Promise<SquiggleGame[]> {
  const res = await fetch(`${SQUIGGLE_BASE}/?q=games;year=${year};round=${round}`, {
    headers: { 'User-Agent': 'LongRangeTipping/1.0 (longrangetipping.com)' },
    next: { revalidate: 60 },
  });
  const data = await res.json();
  return data.games || [];
}

export async function getRounds(year: number): Promise<{ round: number; roundname: string }[]> {
  const games = await getFixtures(year);
  const roundMap = new Map<number, string>();
  for (const g of games) {
    if (!roundMap.has(g.round)) roundMap.set(g.round, g.roundname || `Round ${g.round}`);
  }
  return Array.from(roundMap.entries())
    .map(([round, roundname]) => ({ round, roundname }))
    .sort((a, b) => a.round - b.round);
}
