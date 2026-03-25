'use client';

import { createContext, useContext } from 'react';

export interface UserState {
  id: string;
  email: string;
  display_name: string;
  isLoggedIn: boolean;
}

export interface CompState {
  id: string;
  name: string;
  description: string;
  invite_code: string;
  is_public: boolean;
  season_year: number;
  tip_deadline: string;
  creator_id: string;
  members: MemberState[];
}

export interface MemberState {
  user_id: string;
  display_name: string;
  joined_at: string;
}

export interface TipState {
  [matchId: number]: number; // matchId -> tipped_team_id
}

export interface AppState {
  user: UserState | null;
  comps: CompState[];
  tips: { [compId: string]: TipState };
  setUser: (user: UserState | null) => void;
  addComp: (comp: CompState) => void;
  joinComp: (compId: string) => void;
  setTips: (compId: string, tips: TipState) => void;
  setTip: (compId: string, matchId: number, teamId: number) => void;
}

export const AppContext = createContext<AppState>({
  user: null,
  comps: [],
  tips: {},
  setUser: () => {},
  addComp: () => {},
  joinComp: () => {},
  setTips: () => {},
  setTip: () => {},
});

export function useApp() {
  return useContext(AppContext);
}

// Demo user for testing
export const DEMO_USER: UserState = {
  id: 'demo-user-1',
  email: 'demo@longrangetipping.com',
  display_name: 'Demo User',
  isLoggedIn: true,
};

// Generate a random invite code
export function generateInviteCode(name: string): string {
  const prefix = name.replace(/[^a-zA-Z]/g, '').substring(0, 4).toUpperCase();
  const suffix = Math.floor(Math.random() * 900 + 100);
  return prefix + suffix;
}
