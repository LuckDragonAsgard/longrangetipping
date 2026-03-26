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
  id?: string; // comp_member_id from Supabase
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
  loading: boolean;
  setUser: (user: UserState | null) => void;
  addComp: (comp: CompState) => void;
  joinComp: (compId: string) => Promise<void>;
  setTips: (compId: string, tips: TipState) => void;
  setTip: (compId: string, matchId: number, teamId: number) => void;
  saveTipsToDb: (compInviteCode: string) => Promise<{ saved: number; errors: number }>;
  loadTipsFromDb: (compInviteCode: string) => Promise<void>;
  refreshComps: () => Promise<void>;
}

export const AppContext = createContext<AppState>({
  user: null,
  comps: [],
  tips: {},
  loading: true,
  setUser: () => {},
  addComp: () => {},
  joinComp: async () => {},
  setTips: () => {},
  setTip: () => {},
  saveTipsToDb: async () => ({ saved: 0, errors: 0 }),
  loadTipsFromDb: async () => {},
  refreshComps: async () => {},
});

export function useApp() {
  return useContext(AppContext);
}

// Generate a random invite code
export function generateInviteCode(name: string): string {
  const prefix = name.replace(/[^a-zA-Z]/g, '').substring(0, 4).toUpperCase();
  const suffix = Math.floor(Math.random() * 900 + 100);
  return prefix + suffix;
}
