'use client';

import { useState, useCallback, ReactNode } from 'react';
import { AppContext, AppState, UserState, CompState, TipState } from '@/lib/store';

// Pre-built demo comps
const DEMO_COMPS: CompState[] = [
  {
    id: 'comp-puhie',
    name: "Puhie's Tipping 2026",
    description: 'Family footy tipping comp',
    invite_code: 'PUHIE26',
    is_public: false,
    season_year: 2026,
    tip_deadline: '2026-03-05T19:30:00',
    creator_id: 'user-puhie',
    members: [
      { user_id: 'user-luna', display_name: 'Luna', joined_at: '2026-02-15' },
      { user_id: 'user-freddie', display_name: 'Freddie', joined_at: '2026-02-16' },
      { user_id: 'user-donna', display_name: 'Donna', joined_at: '2026-02-16' },
      { user_id: 'user-puhie', display_name: 'Puhie', joined_at: '2026-02-14' },
      { user_id: 'user-mauro', display_name: 'Mauro', joined_at: '2026-02-17' },
      { user_id: 'user-sara', display_name: 'Sara', joined_at: '2026-02-18' },
    ],
  },
  {
    id: 'comp-gallivan',
    name: 'Gallivan Family Footy Tips',
    description: 'The big family tipping comp - bragging rights on the line!',
    invite_code: 'GALLI26',
    is_public: false,
    season_year: 2026,
    tip_deadline: '2026-03-05T19:30:00',
    creator_id: 'demo-user-1',
    members: [
      { user_id: 'demo-user-1', display_name: 'Paddy', joined_at: '2026-02-10' },
    ],
  },
];

// Pre-generated tips for demo members to create a leaderboard
const DEMO_TIPS: { [compId: string]: { [userId: string]: TipState } } = {};

export default function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<UserState | null>(null);
  const [comps, setComps] = useState<CompState[]>(DEMO_COMPS);
  const [tips, setTipsState] = useState<{ [compId: string]: TipState }>({});

  const setUser = useCallback((u: UserState | null) => {
    setUserState(u);
  }, []);

  const addComp = useCallback((comp: CompState) => {
    setComps(prev => [...prev, comp]);
  }, []);

  const joinComp = useCallback((compId: string) => {
    if (!user) return;
    setComps(prev => prev.map(c => {
      if (c.id === compId) {
        return {
          ...c,
          members: [...c.members, { user_id: user.id, display_name: user.display_name, joined_at: new Date().toISOString() }],
        };
      }
      return c;
    }));
  }, [user]);

  const setTips = useCallback((compId: string, newTips: TipState) => {
    setTipsState(prev => ({ ...prev, [compId]: newTips }));
  }, []);

  const setTip = useCallback((compId: string, matchId: number, teamId: number) => {
    setTipsState(prev => ({
      ...prev,
      [compId]: { ...(prev[compId] || {}), [matchId]: teamId },
    }));
  }, []);

  const value: AppState = {
    user,
    comps,
    tips,
    setUser,
    addComp,
    joinComp,
    setTips,
    setTip,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}
